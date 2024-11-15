import ForgotPasswordForm from '@/components/auth/forgot-password-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Forgot password',
  description:
    'Forgot your password? Request a password reset link for the Next.js Auth Starter Kit.',
};

export default function ResetPasswordPage() {
  return (
    <main className='flex h-dvh items-center justify-center p-4 md:p-0'>
      <Card className='max-w-md mx-auto'>
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>
            Enter the email address associated with your account and we&apos;ll
            send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
        <CardFooter>
          <Button variant='secondary' className='w-full' asChild>
            <Link href='/sign-in'>Cancel</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
