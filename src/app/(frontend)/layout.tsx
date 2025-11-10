import React from 'react'
import './globals.css'

export const metadata = {
  description: 'Payload Blog with Categories',
  title: 'Payload Blog',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" data-theme="light">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
