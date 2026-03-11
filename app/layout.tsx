import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Aarambh — जहाँ श्रद्धा मिले सेवा से',
  description: 'Book verified pandits for weddings, pujas & all Hindu ceremonies. Transparent pricing. Auspicious timing.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Maps Places API — replace YOUR_GOOGLE_MAPS_API_KEY */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap" />
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || 'YOUR_GOOGLE_MAPS_API_KEY'}&libraries=places`}
          strategy="lazyOnload"
        />
        {/* Google Identity Services for Google Login */}
        <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}