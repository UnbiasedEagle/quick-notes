import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import prisma from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Toaster } from '@/components/ui/sonner';
import { unstable_noStore as noStore } from 'next/cache';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QuickNotes | Organize Your Thoughts Instantly',
  description:
    'Capture, categorize, and retrieve your ideas in seconds with QuickNotes. Effortlessly organized for clarity and productivity. Experience seamless note-taking with our intuitive interface.',
};

const getUserData = async (userId: string) => {
  noStore();

  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      colorScheme: true,
    },
  });

  return data;
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  let theme = 'theme-orange';

  if (user) {
    const data = await getUserData(user?.id!);
    theme = data?.colorScheme || 'theme-orange';
  }

  return (
    <html lang='en'>
      <body className={`${inter.className} ${theme}`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
