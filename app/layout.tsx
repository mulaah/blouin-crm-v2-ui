import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Blouin CRM - UI Proposals',
  description: 'New UI proposals for Blouin CRM from Claude Design',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
