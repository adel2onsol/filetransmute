import React, { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

interface PreviewPaneProps {
  file: File | null;
}

export function PreviewPane({ file }: PreviewPaneProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const generatePreview = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        setPreviewUrl(canvas.toDataURL());
      } catch (error) {
        console.error('Error generating preview:', error);
      }
    };

    generatePreview();
  }, [file]);

  if (!previewUrl) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 rounded-lg overflow-hidden shadow-lg">
      <img
        src={previewUrl}
        alt="PDF Preview"
        className="w-full h-auto"
      />
    </div>
  );
}