import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getServerSession } from 'next-auth'
import SessionProvider from '@/components/SessionProvider/SessionProvider';
import RootLayoutComponent from '@/components/RootLayout/RootLayoutComponent';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: "AlumMap",
    description: "AlumMap adalah peta interaktif untuk pemetaan alumni teknik informatika Unpad",
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession();
    return (
        <html lang="en">
            <body className={inter.className}>
                <SessionProvider session={session}>
                    <RootLayoutComponent>
                    {children}
                    </RootLayoutComponent> 
                </SessionProvider>
            </body>
        </html>
    )
}
