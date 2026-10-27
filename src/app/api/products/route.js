import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadImage } from '@/lib/storage';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { brand: true, category: true, sizes: true, colors: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('image');
    const name = data.get('name');
    const price = data.get('price');
    const gender = data.get('gender');
    const brandId = data.get('brandId');
    const categoryId = data.get('categoryId');
    const isAvailable = data.get('isAvailable') !== 'false';
    const costPrice = data.get('costPrice') || '0';
    const stock = data.get('stock') || '0';

    // Manejo de tallas y colores
    const sizeIdsRaw = data.getAll('sizeIds');
    let sizeIds = [];
    if (sizeIdsRaw && sizeIdsRaw.length > 0) {
      sizeIds = sizeIdsRaw.map(id => parseInt(id)).filter(id => !isNaN(id));
    } else if (data.get('sizes')) {
      try {
        const parsed = JSON.parse(data.get('sizes'));
        if (Array.isArray(parsed)) sizeIds = parsed.map(Number).filter(id => !isNaN(id));
      } catch (e) {
        sizeIds = data.get('sizes').split(',').map(s => parseInt(s.trim())).filter(id => !isNaN(id));
      }
    }

    const colorIdsRaw = data.getAll('colorIds');
    let colorIds = [];
    if (colorIdsRaw && colorIdsRaw.length > 0) {
      colorIds = colorIdsRaw.map(id => parseInt(id)).filter(id => !isNaN(id));
    } else if (data.get('colors')) {
      try {
        const parsed = JSON.parse(data.get('colors'));
        if (Array.isArray(parsed)) colorIds = parsed.map(Number).filter(id => !isNaN(id));
      } catch (e) {
        colorIds = data.get('colors').split(',').map(s => parseInt(s.trim())).filter(id => !isNaN(id));
      }
    }

    if (!name || !price || !brandId || !categoryId) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    let imageUrl = '';
    
    // Subir imagen (a Cloudinary o almacenamiento configurado)
    if (file && file.name) {
      imageUrl = await uploadImage(file);
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        costPrice: parseFloat(costPrice),
        stock: parseInt(stock, 10),
        gender,
        brandId: parseInt(brandId),
        categoryId: parseInt(categoryId),
        isAvailable,
        imageUrl,
        sizes: sizeIds.length > 0 ? { connect: sizeIds.map(id => ({ id })) } : undefined,
        colors: colorIds.length > 0 ? { connect: colorIds.map(id => ({ id })) } : undefined,
      },
      include: { brand: true, category: true, sizes: true, colors: true }
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error("Error al guardar:", error);
    return NextResponse.json({ error: 'Error al crear el producto' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar el producto' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.formData();
    const id = data.get('id');
    const name = data.get('name');
    const price = data.get('price');
    const gender = data.get('gender');
    const brandId = data.get('brandId');
    const categoryId = data.get('categoryId');
    const isAvailable = data.get('isAvailable') === 'true';
    const file = data.get('image');
    const costPrice = data.get('costPrice') || '0';
    const stock = data.get('stock') || '0';

    // Manejo de tallas y colores
    const sizeIdsRaw = data.getAll('sizeIds');
    let sizeIds = [];
    if (sizeIdsRaw && sizeIdsRaw.length > 0) {
      sizeIds = sizeIdsRaw.map(id => parseInt(id)).filter(id => !isNaN(id));
    } else if (data.get('sizes')) {
      try {
        const parsed = JSON.parse(data.get('sizes'));
        if (Array.isArray(parsed)) sizeIds = parsed.map(Number).filter(id => !isNaN(id));
      } catch (e) {
        sizeIds = data.get('sizes').split(',').map(s => parseInt(s.trim())).filter(id => !isNaN(id));
      }
    }

    const colorIdsRaw = data.getAll('colorIds');
    let colorIds = [];
    if (colorIdsRaw && colorIdsRaw.length > 0) {
      colorIds = colorIdsRaw.map(id => parseInt(id)).filter(id => !isNaN(id));
    } else if (data.get('colors')) {
      try {
        const parsed = JSON.parse(data.get('colors'));
        if (Array.isArray(parsed)) colorIds = parsed.map(Number).filter(id => !isNaN(id));
      } catch (e) {
        colorIds = data.get('colors').split(',').map(s => parseInt(s.trim())).filter(id => !isNaN(id));
      }
    }

    if (!id || !name || !price || !brandId || !categoryId) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    let updateData = {
      name,
      price: parseFloat(price),
      costPrice: parseFloat(costPrice),
      stock: parseInt(stock, 10),
      gender,
      brandId: parseInt(brandId),
      categoryId: parseInt(categoryId),
      isAvailable,
      sizes: { set: sizeIds.map(id => ({ id })) },
      colors: { set: colorIds.map(id => ({ id })) }
    };

    if (file && file.size > 0 && file.name) {
      updateData.imageUrl = await uploadImage(file);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { brand: true, category: true, sizes: true, colors: true }
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar:", error);
    return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 500 });
  }
}
