'use client';

import { forgotPasswordSchema } from '@/lib/zod-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { forgotPassword } from '@/actions/auth.actions';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { useCountdown } from 'usehooks-ts';
import { Loader2 } from 'lucide-react';

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onTouched',
  });

  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({ countStart: 60, intervalMs: 1000 });

  useEffect(() => {
    if (count === 0) {
      stopCountdown();
      resetCountdown();
    }
  }, [count, stopCountdown, resetCountdown]);

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setLoading(true);

    const res = await forgotPassword(values);

    if (res.success) {
      toast.success('Password reset link sent successfully');
      startCountdown();
    }

    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='Email' {...field} />
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
          <Button
            type='submit'
            className='w-full'
            disabled={count > 0 && count < 60}>
            Send reset link
            {count > 0 && count < 60 && ` in ${count} seconds`}
          </Button>
        )}
      </form>
    </Form>
  );
}
