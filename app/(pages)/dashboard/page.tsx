import { SignOutButton } from '@/components/auth/sign-out-button';
import { getUser } from '@/lib/lucia';
import { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Welcome to your dashboard on the Next.js Auth Starter Kit. View your profile picture, name, and email address.',
};

const DashboardPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <>
      <div className='flex justify-center items-center h-screen'>
        <div className='flex items-center gap-2 border p-4 rounded-lg bg-secondary transition-all cursor-pointer hover:shadow-xl'>
          {user.avatar && (
            <Image
              src={user.avatar}
              alt='User Avatar'
              className='rounded-full size-10 md:size-14'
              height={30}
              width={30}
            />
          )}
          <div className='flex flex-col'>
            <span className='font-semibold text-lg md:text-xl'>
              {user.name}
            </span>
            <span className='text-xs md:text-base text-muted-foreground'>
              {user.email}
            </span>
          </div>
        </div>
      </div>
      <div className='absolute right-4 top-4'>
        <SignOutButton>Sign out</SignOutButton>
      </div>
    </>
  );
};

export default DashboardPage;
