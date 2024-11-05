'use client';

import { createGoogleAuthorizationURL } from '@/actions/auth.actions';
import { Button } from '../ui/button';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';

export function GoogleOAuthButton() {
  return (
    <Button
      onClick={async () => {
        const res = await createGoogleAuthorizationURL();
        if (res.url) {
          window.location.href = res.url;
        } else {
          toast.error('Something went wrong');
        }
      }}
      className='w-full'
      variant='outline'>
      <FcGoogle className='mr-2 size-5' /> Continue with Google
    </Button>
  );
}
