export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='h-dvh flex items-center justify-center p-4 md:p-0'>
      {children}
    </main>
  );
}
