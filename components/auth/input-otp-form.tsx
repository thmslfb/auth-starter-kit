'use client';

import { verifyEmail } from '@/actions/auth.actions';
import { inputOTPSchema } from '@/lib/zod-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '../ui/input-otp';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

export default function InputOTPForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof inputOTPSchema>>({
    resolver: zodResolver(inputOTPSchema),
    defaultValues: {
      code: '',
    },
    mode: 'onTouched',
  });

  async function onSubmit(value: z.infer<typeof inputOTPSchema>) {
    setLoading(true);
    const res = await verifyEmail(value.code);

    if (res.success) {
      toast.success('Email successfully verified');
      router.push('/dashboard');
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6 flex flex-col mt-5 mb-3 items-center justify-center'>
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  value={field.value}
                  onChange={(value) => field.onChange(value?.toUpperCase())}
                  className=''>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {loading ? (
          <Button disabled className='w-full'>
            <Loader2 className='animate-spin h-4 w-4' />
          </Button>
        ) : (
          <Button type='submit' className='w-full'>
            Verify email
          </Button>
        )}
      </form>
    </Form>
  );
}
