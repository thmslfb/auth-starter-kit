'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { resendVerificationEmail } from '@/actions/auth.actions';
import { toast } from 'sonner';
import { useCountdown } from 'usehooks-ts';
import InputOTPForm from '@/components/auth/input-otp-form';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({ countStart: 60, intervalMs: 1000 });

  useEffect(() => {
    if (count === 0) {
      stopCountdown();
      resetCountdown();
    }
  }, [count, stopCountdown, resetCountdown]);

  const storedEmail = sessionStorage?.getItem('email');
  if (!storedEmail) {
    router.push('/sign-up');
    return null;
  }

  async function handleResendEmail() {
    if (!storedEmail) return;
    const res = await resendVerificationEmail(storedEmail);

    if (res.success) {
      toast.success('Verification email sent successfully');
      startCountdown();
    } else {
      toast.error(res.error);
    }
  }

  return (
    <main className='flex min-h-screen items-center justify-center p-4 md:p-0'>
      <Card className='w-full max-w-lg mx-auto'>
        <div className='p-6'>
          <div className='w-full flex justify-center'>
            <Mail className='size-12 p-2.5 rounded-full bg-green-500/30 text-green-500' />
          </div>

          <div className='mt-5 text-center sm:mt-6 w-full'>
            <h2 className='text-2xl font-bold'>Please verify your email</h2>
            <p className='text-sm mt-3 text-muted-foreground tracking-tight'>
              You&apos;re almost there! We sent a verification code to <br />
              <span className='font-semibold text-foreground text-base'>
                {storedEmail}
              </span>
            </p>

            <p className='text-sm mt-5 text-muted-foreground tracking-tighter leading-snug max-w-[500px] mx-auto'>
              Enter the verification code sent to your email to complete your
              signup. If you don&apos;t see it, you may need to{' '}
              <span className='text-foreground font-bold'>
                check your spam{' '}
              </span>
              folder
            </p>

            <InputOTPForm />

            <Button
              type='button'
              variant='secondary'
              className='w-full'
              disabled={count > 0 && count < 60}
              onClick={handleResendEmail}>
              Resend code
              {count > 0 && count < 60 && ` in ${count} seconds`}
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
}
