'use client';

import { logOut } from '@/actions/auth.actions';
import { Button } from '../ui/button';

export function SignOutButton({ children }: { children: React.ReactNode }) {
  return (
    <Button
      onClick={() => {
        logOut();
      }}>
      {children}
    </Button>
  );
}
