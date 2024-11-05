import { Hero } from '@/components/hero';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUser } from '@/lib/lucia';
import { AlignJustify, Lock } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className='max-w-7xl mx-auto px-4 flex flex-col justify-between min-h-screen'>
      <header className='flex w-full pt-5 items-center justify-between'>
        <nav className='flex items-center gap-x-3'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon' className='md:hidden'>
                <AlignJustify className='h-5 w-5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href='https://docs.auth.thomaslefebvre.fr'>
                    Documentation
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href='/' className='flex items-center gap-2'>
            <Lock />
            <h4 className='text-xl font-semibold'>Auth</h4>
          </Link>
          <div className='hidden ml-10 md:flex text-muted-foreground/70 text-sm space-x-6'>
            <Link
              href='https://docs.auth.thomaslefebvre.fr'
              target='_blank'
              className=' hover:text-muted-foreground transition-colors'>
              Documentation
            </Link>
          </div>
        </nav>
        <ModeToggle />
      </header>
      <Hero />
      <footer className='pb-5'>
        <p className='text-sm tracking-tight text-muted-foreground'>
          &copy; 2024{' '}
          <Link href='/' className='hover:underline'>
            thmslfb
          </Link>
        </p>
      </footer>
    </main>
  );
}
