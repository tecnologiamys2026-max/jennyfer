import './globals.css'

export const metadata = {
  title: 'Jennyfer - Moda, Ropa y Tendencias',
  description: 'Descubre nuestra exclusiva colección de ropa, moda y accesorios en tendencia. Compra en línea y contáctanos por WhatsApp.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}
