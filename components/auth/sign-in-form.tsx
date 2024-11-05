'use client';

import { signInSchema } from '@/lib/zod-schema';
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
import { signIn } from '@/actions/auth.actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function SignInForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setLoading(true);
    const res = await signIn(values);

    if (res.success) {
      toast.success('Login successful');
      router.push('/dashboard');
    } else {
      toast.error(res.error);
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
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <div className='flex justify-between'>
                <FormLabel>Password</FormLabel>
                <Link
                  href='/forgot-password'
                  className='text-xs text-primary hover:underline'>
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input
                  placeholder='Password'
                  type='password'
                  {...field}
                  onChange={(e) => {
                    e.target.value = e.target.value.trim();
                    field.onChange(e);
                  }}
                />
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
            Log in
          </Button>
        )}
      </form>
    </Form>
  );
}
