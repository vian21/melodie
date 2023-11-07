export const metadata = {
  title: 'Mélodie',
  description: 'Chord Progression and Melody training for musicians',
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
