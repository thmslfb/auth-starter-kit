import { google } from '@/lib/oauth';
import { lucia } from '@/lib/lucia';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code || !state) {
    console.error('No code or state');
    return new Response('Invalid Request', { status: 400 });
  }

  const codeVerifier = cookies().get('codeVerifier')?.value;
  const savedState = cookies().get('state')?.value;

  if (!codeVerifier || !savedState) {
    console.error('No code verifier or state');
    return new Response('Invalid Request', { status: 400 });
  }

  if (state !== savedState) {
    console.error('State mismatch');
    return new Response('Invalid Request', { status: 400 });
  }

  const { accessToken } = await google.validateAuthorizationCode(
    code,
    codeVerifier
  );
  const googleResponse = await fetch(
    'https://www.googleapis.com/oauth2/v1/userinfo',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const googleData = (await googleResponse.json()) as {
    id: string;
    email: string;
    name: string;
    picture: string;
  };

  let userId: string | null = '';

  const existingUser = await prisma.oAuthAccount.findUnique({
    where: {
      providerId_providerUserId: {
        providerId: 'google',
        providerUserId: googleData.id,
      },
    },
  });

  if (existingUser) {
    userId = existingUser.userId;
  } else {
    await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          name: googleData.name,
          email: googleData.email,
          avatar: googleData.picture,
          emailVerified: true,
        },
      });
      await prisma.oAuthAccount.create({
        data: {
          providerId: 'google',
          providerUserId: googleData.id,
          userId: user.id,
        },
      });
      userId = user.id;
    });
  }

  const session = await lucia.createSession(userId!, {});
  const sessionCookie = await lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect('/dashboard');
}
