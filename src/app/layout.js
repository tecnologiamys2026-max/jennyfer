import './globals.css'

export const metadata = {
  title: 'Jennyfer Boutique — Moda, Tendencias & Estilo Exclusivo',
  description: 'Boutique de moda femenina, prendas exclusivas, vestidos, blusas, conjuntos y accesorios en tendencia. Atención personalizada y pedidos directos por WhatsApp.',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
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
