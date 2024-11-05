'use client';

import { createGithubAuthorizationURL } from '@/actions/auth.actions';
import { Button } from '../ui/button';
import { FaGithub } from 'react-icons/fa';
import { toast } from 'sonner';

export function GithubOAuthButton() {
  return (
    <Button
      onClick={async () => {
        const res = await createGithubAuthorizationURL();
        if (res.url) {
          window.location.href = res.url;
        } else {
          toast.error('Something went wrong');
        }
      }}
      className='w-full'
      variant='outline'>
      <FaGithub className='mr-2 size-5' /> Continue with Github
    </Button>
  );
}
