import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify email',
  description:
    'Verify your email to complete the registration on the Next.js Auth Starter Kit.',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className='h-dvh flex items-center justify-center p-4 md:p-0'>
      {children}
    </main>
  );
}
