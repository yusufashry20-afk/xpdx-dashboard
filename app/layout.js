import './globals.css'

export const metadata = {
  title: 'XPDX Dashboard',
  description: 'XPDX Rentals Operations Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
