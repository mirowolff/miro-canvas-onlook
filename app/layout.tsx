import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import './globals.css'

const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-noto-sans' })

export const metadata: Metadata = {
  title: 'Miro Canvas - Onlook Compatible',
  description: 'A Miro-like canvas interface built with Next.js and Tailwind CSS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}