import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FormBuilder Pro - Create Beautiful Forms in Minutes',
  description: 'Build, share, and collect responses with our powerful form builder. Start free, upgrade when you need more.',
  keywords: 'form builder, online forms, survey tool, lead generation, form creator',
  authors: [{ name: 'FormBuilder Pro Team' }],
  openGraph: {
    title: 'FormBuilder Pro - Create Beautiful Forms in Minutes',
    description: 'Build, share, and collect responses with our powerful form builder.',
    url: 'https://formbuilderpro.com',
    siteName: 'FormBuilder Pro',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FormBuilder Pro',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FormBuilder Pro - Create Beautiful Forms in Minutes',
    description: 'Build, share, and collect responses with our powerful form builder.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
