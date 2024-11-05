'use client';

import Link from 'next/link';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export const Hero = () => {
  const value = 'git clone https://github.com/thmslfb/auth-starter-kit';
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy!', error);
    }
  };

  return (
    <section className='flex items-center justify-center'>
      <div className='items-center w-full'>
        <div className='text-center'>
          <span className='border border-primary/20 w-fit py-2 px-3 text-sm rounded-lg'>
            Your Essential Auth Starter Kit
          </span>

          <h1 className='mt-8 text-4xl sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl mx-auto font-bold tracking-tighter leading-none'>
            <span className='bg-gradient-to-br dark:from-gray-400 dark:to-gray-200 text-primary bg-clip-text dark:text-transparent'>
              Next.js Lucia Auth Starter Kit
            </span>
          </h1>

          <p className='max-w-2xl mx-auto mt-4 text-sm md:text-base lg:text-lg font-light text-muted-foreground tracking-tighter'>
            Easily implement user authentication with email validation and
            password reset. Built with Lucia, Prisma, Tailwind CSS, shadcn, and
            Resend.
          </p>
          <div className='flex justify-center mt-6 space-x-2'>
            <Input
              type='text'
              value={value}
              readOnly
              style={{
                width: `calc(${value.length}ch + 2rem)`,
              }}
            />
            <Button variant='outline' size='icon' onClick={handleCopy}>
              {isCopied ? (
                <Check className='h-4 w-4' />
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </Button>
          </div>
          <div className='flex justify-center mt-8 space-x-4'>
            <Button variant='outline' asChild>
              <Link
                href='https://gihtub.com/thmslfb/next-lucia-kit'
                target='_blank'>
                Explore on GitHub
              </Link>
            </Button>
            <Button asChild>
              <Link href='/sign-up'>Try it out</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
