import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph } from 'docx';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export type ConversionFormat = 'docx' | 'png' | 'jpeg' | 'txt';

export async function convertPDF(file: File, format: ConversionFormat): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  
  switch (format) {
    case 'docx':
      return convertToWord(arrayBuffer);
    case 'png':
      return convertToImage(arrayBuffer, 'png');
    case 'jpeg':
      return convertToImage(arrayBuffer, 'jpeg');
    case 'txt':
      return convertToText(arrayBuffer);
    default:
      throw new Error('Unsupported format');
  }
}

async function convertToWord(arrayBuffer: ArrayBuffer): Promise<Blob> {
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  const doc = new Document();
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item: any) => item.str).join(' ');
    doc.addSection({ children: [new Paragraph({ text })] });
  }
  
  return await Packer.toBlob(doc);
}

async function convertToImage(arrayBuffer: ArrayBuffer, format: 'png' | 'jpeg'): Promise<Blob> {
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2.0 });
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  
  await page.render({
    canvasContext: context,
    viewport: viewport
  }).promise;
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, `image/${format}`, 1.0);
  });
}

async function convertToText(arrayBuffer: ArrayBuffer): Promise<Blob> {
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  let text = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    text += textContent.items.map((item: any) => item.str).join(' ') + '\n';
  }
  
  return new Blob([text], { type: 'text/plain' });
}