export const metadata = {
  title: 'Drafted | WNBA Draft Game',
  description: 'Build the greatest WNBA team of all time. Can you go undefeated?',
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#07090f' }}>
        {children}
      </body>
    </html>
  )
}
