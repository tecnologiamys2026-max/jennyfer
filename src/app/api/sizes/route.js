import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const sizes = await prisma.size.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(sizes);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener las tallas' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'El nombre de la talla es obligatorio' }, { status: 400 });
    }

    const trimmedName = name.trim().toUpperCase();
    const existing = await prisma.size.findUnique({ where: { name: trimmedName } });
    if (existing) {
      return NextResponse.json({ error: 'Esta talla ya existe' }, { status: 400 });
    }

    const newSize = await prisma.size.create({
      data: { name: trimmedName }
    });
    return NextResponse.json(newSize);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear la talla' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, name } = await request.json();
    if (!id || !name || !name.trim()) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    const trimmedName = name.trim().toUpperCase();
    const updatedSize = await prisma.size.update({
      where: { id: parseInt(id) },
      data: { name: trimmedName }
    });
    return NextResponse.json(updatedSize);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar la talla' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });

    await prisma.size.delete({
      where: { id: parseInt(id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar la talla' }, { status: 500 });
  }
}
