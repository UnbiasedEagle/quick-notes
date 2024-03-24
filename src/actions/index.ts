'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const postData = async (id: string, formData: FormData) => {
  const name = formData.get('name') as string;
  const colorScheme = formData.get('color') as string;

  await prisma.user.update({
    where: {
      kindeUserId: id,
    },
    data: {
      name,
      colorScheme,
    },
  });

  revalidatePath('/', 'layout');
};

export const createNote = async (userId: string, formData: FormData) => {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  await prisma.note.create({
    data: {
      title,
      description,
      userId,
    },
  });

  redirect('/dashboard');
};

export const editNote = async (
  userId: string,
  noteId: string,
  formData: FormData
) => {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  await prisma.note.update({
    where: {
      userId,
      id: noteId,
    },
    data: {
      title,
      description,
    },
  });

  redirect('/dashboard');
};

export const deleteNote = async (userId: string, noteId: string) => {
  await prisma.note.delete({
    where: {
      userId,
      id: noteId,
    },
  });

  revalidatePath('/dashboard');
};
