'use server';

import prisma from '@/lib/prisma';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from '@/lib/zod-schema';
import { z } from 'zod';
import { Argon2id } from 'oslo/password';
import { lucia } from '@/lib/lucia';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { generateCodeVerifier, generateState } from 'arctic';
import { github, google } from '@/lib/oauth';
import crypto from 'crypto';
import { Resend } from 'resend';
import { EmailCodeTemplate } from '@/components/auth/email-code-template';
import { EmailResetTemplate } from '@/components/auth/email-reset-template';

const PASSWORD_RESET_EXPIRY = 600000;
const VERIFICATION_CODE_EXPIRY = 600000;
const RESEND_EMAIL_DELAY = 60000;
const PASSWORD_RESET_DELAY = 60000;

class AuthError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);

const generateVerificationCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

const createHashFromToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');

const setSessionCookie = async (sessionId: string) => {
  const sessionCookie = await lucia.createSessionCookie(sessionId);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
};

export async function signUp(values: z.infer<typeof signUpSchema>) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: values.email.toLocaleLowerCase(),
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new AuthError('USER_EXISTS', 'User already exists');
    }

    const passwordHash = await new Argon2id().hash(values.password);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: values.name,
          email: values.email.toLowerCase(),
          passwordHash,
          avatar: `https://api.dicebear.com/9.x/initials/avif?seed=${values.name}`,
        },
      });

      const verificationCode = generateVerificationCode();

      await tx.emailVerification.create({
        data: {
          userId: newUser.id,
          code: verificationCode,
          sentAt: new Date(),
          expiresAt: new Date(Date.now() + VERIFICATION_CODE_EXPIRY),
        },
      });

      return { user: newUser, verificationCode };
    });

    const { error } = await resend.emails.send({
      from: `thmslfb - Auth Starter Kit <${process.env.RESEND_FORM_EMAIL}>`,
      to: [user.user.email ?? ''],
      subject: 'Verify your email address',
      react: EmailCodeTemplate({
        code: user.verificationCode,
      }),
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw new AuthError('EMAIL_FAILED', 'Failed to send verification email');
    }

    return { email: user.user.email, success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message, success: false };
    }
    return { error: 'An unexpected error occured', success: false };
  }
}

export async function verifyEmail(code: string) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const verification = await tx.emailVerification.findUnique({
        where: {
          code,
        },
        include: {
          user: true,
        },
      });

      if (!verification) {
        throw new AuthError('INVALID_CODE', 'Invalid verification code');
      }

      if (verification.expiresAt < new Date()) {
        throw new AuthError('CODE_EXPIRED', 'Verification code has expired');
      }

      if (verification.user.emailVerified) {
        throw new AuthError('ALREADY_VERIFIED', 'Email already verified');
      }

      const updateUser = await tx.user.update({
        where: {
          id: verification.user.id,
        },
        data: {
          emailVerified: true,
        },
      });

      await tx.emailVerification.delete({
        where: {
          id: verification.id,
        },
      });

      return updateUser;
    });

    const session = await lucia.createSession(result.id, {});
    await setSessionCookie(session.id);

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message, success: false };
    }

    return { error: 'An unexpected error occured', success: false };
  }
}

export async function resendVerificationEmail(email: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        emailVerifications: {
          orderBy: {
            sentAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!existingUser) {
      throw new AuthError('USER_NOT_FOUND', 'User not found');
    }

    if (existingUser.emailVerified) {
      throw new AuthError('ALREADY_VERIFIED', 'Email already verified');
    }

    const lastVerification = existingUser.emailVerifications[0];
    if (!lastVerification) {
      throw new AuthError('NO_VERIFICATION', 'No verification code found');
    }

    const timeSinceLastEmail = Date.now() - lastVerification.sentAt.getTime();
    if (timeSinceLastEmail < RESEND_EMAIL_DELAY) {
      const remainingSeconds = Math.ceil(
        (RESEND_EMAIL_DELAY - timeSinceLastEmail) / 1000
      );
      throw new AuthError(
        'RATE_LIMIT',
        `Please wait ${remainingSeconds} seconds before requesting another email`
      );
    }

    const newVerificationCode = generateVerificationCode();
    await prisma.emailVerification.update({
      where: {
        id: lastVerification.id,
      },
      data: {
        code: newVerificationCode,
        sentAt: new Date(),
        expiresAt: new Date(Date.now() + VERIFICATION_CODE_EXPIRY),
      },
    });

    const { error } = await resend.emails.send({
      from: `thmslfb - Auth Starter Kit <${process.env.RESEND_FORM_EMAIL}>`,
      to: [existingUser.email ?? ''],
      subject: 'Verify your email address',
      react: EmailCodeTemplate({
        code: newVerificationCode,
      }),
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw new AuthError('EMAIL_FAILED', 'Failed to send verification email');
    }

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message, succes: false };
    }

    return { error: 'An unexpected error occurred', success: false };
  }
}

export async function signIn(values: z.infer<typeof signInSchema>) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: values.email.toLowerCase(),
      },
    });

    if (!user?.passwordHash) {
      throw new AuthError('INVALID_CREDENTIALS', 'Invalid credentials');
    }

    const validPassword = await new Argon2id().verify(
      user.passwordHash,
      values.password
    );

    if (!validPassword) {
      throw new AuthError('INVALID_CREDENTIALS', 'Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new AuthError('EMAIL_NOT_VERIFIED', 'Email is not verified');
    }

    // successfully login
    const session = await lucia.createSession(user.id, {});
    await setSessionCookie(session.id);

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message, success: false };
    }
    return { error: 'An unexpected error occurred', success: false };
  }
}

export async function forgotPassword(
  values: z.infer<typeof forgotPasswordSchema>
) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: values.email.toLowerCase(),
      },
      include: {
        passwordResets: {
          orderBy: {
            sentAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!existingUser) {
      throw new AuthError('USER_NOT_FOUND', 'User not found');
    }

    const lastReset = existingUser.passwordResets[0];

    if (lastReset) {
      const timeSinceLastEmail = Date.now() - lastReset.sentAt.getTime();

      if (timeSinceLastEmail < PASSWORD_RESET_DELAY) {
        const remainingSeconds = Math.ceil(
          (PASSWORD_RESET_DELAY - timeSinceLastEmail) / 1000
        );
        throw new AuthError(
          'RATE_LIMIT',
          `Please wait ${remainingSeconds} seconds before requesting another reset`
        );
      }
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = createHashFromToken(resetToken);

    if (lastReset) {
      await prisma.passwordReset.update({
        where: {
          id: lastReset.id,
        },
        data: {
          token: tokenHash,
          sentAt: new Date(),
          expiresAt: new Date(Date.now() + PASSWORD_RESET_EXPIRY),
        },
      });
    } else {
      await prisma.passwordReset.create({
        data: {
          userId: existingUser.id,
          token: tokenHash,
          sentAt: new Date(),
          expiresAt: new Date(Date.now() + PASSWORD_RESET_EXPIRY),
        },
      });
    }

    const resetUrl = `${process.env.LUCIA_AUTH_URL}/reset-password?token=${resetToken}`;

    const { error } = await resend.emails.send({
      from: `thmslfb - Auth Starter Kit <${process.env.RESEND_FORM_EMAIL}>`,
      to: [existingUser.email ?? ''],
      subject: 'Reset your password',
      react: EmailResetTemplate({
        resetUrl,
      }),
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw new AuthError(
        'EMAIL_FAILED',
        'Failed to send reset password email'
      );
    }

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message, success: false };
    }

    return { error: 'An unexpected error occurred', success: false };
  }
}

export async function resetPassword(
  values: z.infer<typeof resetPasswordSchema>,
  token: string
) {
  try {
    const tokenHash = createHashFromToken(token);
    const passwordReset = await prisma.passwordReset.findUnique({
      where: {
        token: tokenHash,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!passwordReset) {
      throw new AuthError('INVALID_TOKEN', 'Invalid or expired reset token');
    }

    const passwordHash = await new Argon2id().hash(values.password);

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: passwordReset.user.id,
        },
        data: {
          passwordHash,
        },
      }),
      prisma.passwordReset.delete({
        where: {
          id: passwordReset.id,
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message, success: false };
    }

    return { error: 'An unexpcted error occurred', success: false };
  }
}

export async function createGoogleAuthorizationURL() {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    };

    cookies().set('codeVerifier', codeVerifier, cookieOptions);
    cookies().set('state', state, cookieOptions);

    const authUrl = await google.createAuthorizationURL(state, codeVerifier, {
      scopes: ['email', 'profile'],
    });

    return { url: authUrl.toString(), success: true };
  } catch (error) {
    return { error: 'Failed to create authorization URL', success: false };
  }
}

export async function createGithubAuthorizationURL() {
  try {
    const state = generateState();

    cookies().set('state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    const authUrl = await github.createAuthorizationURL(state, {
      scopes: ['user:email'],
    });

    return { url: authUrl.toString(), success: true };
  } catch (error) {
    return { error: 'Failed to create authorization URL', success: false };
  }
}

export async function logOut() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value;

  if (sessionId) {
    await lucia.invalidateSession(sessionId);
  }

  const sessionCookie = await lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect('/');
}
