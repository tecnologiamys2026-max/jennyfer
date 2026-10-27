import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const colors = await prisma.color.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(colors);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener los colores' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, hexCode = '#000000' } = await request.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'El nombre del color es obligatorio' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const existing = await prisma.color.findUnique({ where: { name: trimmedName } });
    if (existing) {
      return NextResponse.json({ error: 'Este color ya existe' }, { status: 400 });
    }

    const newColor = await prisma.color.create({
      data: {
        name: trimmedName,
        hexCode: hexCode || '#000000'
      }
    });
    return NextResponse.json(newColor);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear el color' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, name, hexCode } = await request.json();
    if (!id || !name || !name.trim()) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const updatedColor = await prisma.color.update({
      where: { id: parseInt(id) },
      data: {
        name: trimmedName,
        ...(hexCode ? { hexCode } : {})
      }
    });
    return NextResponse.json(updatedColor);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar el color' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });

    await prisma.color.delete({
      where: { id: parseInt(id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar el color' }, { status: 500 });
  }
}
