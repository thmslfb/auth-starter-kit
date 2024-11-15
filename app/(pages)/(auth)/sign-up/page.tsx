import { GithubOAuthButton } from '@/components/auth/github-oauth-button';
import { GoogleOAuthButton } from '@/components/auth/google-oauth-button';
import SignUpForm from '@/components/auth/sign-up-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getUser } from '@/lib/lucia';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Sign up to try the Next.js Auth Starter Kit.',
};

export default async function SignUpPage() {
  const user = await getUser();

  if (user) {
    return redirect('/dashboard');
  }

  return (
    <Card className='max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Begin your journey...</CardTitle>
        <CardDescription>Join us in just a few clicks.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-2 md:space-y-5'>
        <SignUpForm />
        <div className='my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 dark:before:border-neutral-500 dark:after:border-neutral-500'>
          <p className='mx-4 mb-0 text-center text-sm text-neutral-400 font-semibold dark:text-white'>
            OR
          </p>
        </div>
        <GoogleOAuthButton />
        <GithubOAuthButton />
      </CardContent>
      <CardFooter className='flex justify-center'>
        <p className='text-sm'>
          Already have an account ?
          <Link href='/sign-in' className='text-primary hover:underline ml-2'>
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
