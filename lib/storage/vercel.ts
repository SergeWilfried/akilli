import { put } from '@vercel/blob';

export async function downloadFile() {}

export async function createFile(file: File) {
  const blob = new Blob([file], { type: file.type });
  try {
    const { url } = await put(`audio/${blob}`, `${file.name}`, {
      access: 'public',
    });

    console.log('Audio blob saved to Vercel Storage:', url);
    return url;
  } catch (error) {
    console.error('Error saving audio blob to Vercel Storage:', error);
    return null;
  }
}
