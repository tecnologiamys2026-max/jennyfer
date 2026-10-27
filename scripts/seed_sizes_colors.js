const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Única'];
  const defaultColors = [
    { name: 'Negro', hexCode: '#111111' },
    { name: 'Blanco', hexCode: '#FFFFFF' },
    { name: 'Beige / Nude', hexCode: '#E8D8C8' },
    { name: 'Rojo', hexCode: '#D32F2F' },
    { name: 'Rosado', hexCode: '#F48FB1' },
    { name: 'Azul Marino', hexCode: '#1A237E' },
    { name: 'Verde Oliva', hexCode: '#556B2F' },
    { name: 'Dorado / Mostaza', hexCode: '#D4AF37' },
    { name: 'Estampado', hexCode: '#9C27B0' }
  ];

  for (const name of defaultSizes) {
    await prisma.size.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  for (const c of defaultColors) {
    await prisma.color.upsert({
      where: { name: c.name },
      update: { hexCode: c.hexCode },
      create: { name: c.name, hexCode: c.hexCode }
    });
  }

  console.log('Tallas y Colores iniciales sincronizados exitosamente.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
