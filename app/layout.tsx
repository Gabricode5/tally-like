import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Formify - Créez des formulaires intelligents en quelques minutes',
  description: 'Créez, partagez et collectez des réponses avec notre plateforme de formulaires intelligente. Commencez gratuitement, évoluez selon vos besoins.',
  keywords: 'formulaire, sondage, collecte de données, IA, création de formulaires, plateforme de formulaires',
  authors: [{ name: 'Équipe Formify' }],
  openGraph: {
    title: 'Formify - Créez des formulaires intelligents en quelques minutes',
    description: 'Créez, partagez et collectez des réponses avec notre plateforme de formulaires intelligente.',
    url: 'https://formify.com',
    siteName: 'Formify',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Formify',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formify - Créez des formulaires intelligents en quelques minutes',
    description: 'Créez, partagez et collectez des réponses avec notre plateforme de formulaires intelligente.',
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
    <html lang="fr" className="h-full">
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
