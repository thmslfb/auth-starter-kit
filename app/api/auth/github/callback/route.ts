import { github } from '@/lib/oauth';
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

  const savedState = cookies().get('state')?.value;

  if (!savedState) {
    console.error('No code verifier or state');
    return new Response('Invalid Request', { status: 400 });
  }

  if (state !== savedState) {
    console.error('State mismatch');
    return new Response('Invalid Request', { status: 400 });
  }

  const { accessToken } = await github.validateAuthorizationCode(code);
  const githubResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const githubData = (await githubResponse.json()) as {
    id: number;
    name: string;
    email: string;
    avatar_url: string;
  };

  let userId: string | null = '';

  const existingUser = await prisma.oAuthAccount.findUnique({
    where: {
      providerId_providerUserId: {
        providerId: 'github',
        providerUserId: githubData.id.toString(),
      },
    },
  });

  if (existingUser) {
    userId = existingUser.userId;
  } else {
    await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          name: githubData.name,
          email: githubData.email,
          avatar: githubData.avatar_url,
          emailVerified: true,
        },
      });
      await prisma.oAuthAccount.create({
        data: {
          providerId: 'github',
          providerUserId: githubData.id.toString(),
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
