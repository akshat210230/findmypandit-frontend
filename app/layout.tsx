import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '../components/layout/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Find My Pandit - Book Verified Pandits for Ceremonies',
  description: 'Connect with verified Hindu priests for weddings, pujas, and religious ceremonies.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-gray-800 text-gray-300 text-center py-6">
          <p>© 2026 Find My Pandit. All rights reserved. 🙏</p>
        </footer>
      </body>
    </html>
  )
}