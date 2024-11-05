import ResetPasswordForm from '@/components/auth/reset-password-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset password',
  description:
    'Reset your password to regain access to your account on the Next.js Auth Starter Kit.',
};

export default function ResetPasswordPage() {
  return (
    <main className='flex min-h-screen items-center justify-center p-4 md:p-0'>
      <Card className='max-w-md mx-auto'>
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Choose a new password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-5'>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </main>
  );
}
