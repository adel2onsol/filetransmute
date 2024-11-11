import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ConversionOptions } from '@/components/ConversionOptions';
import { PreviewPane } from '@/components/PreviewPane';
import { convertPDF, ConversionFormat } from '@/lib/converter';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Download, Loader2 } from 'lucide-react';

export default function Index() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ConversionFormat>('docx');
  const [converting, setConverting] = useState(false);
  const { toast } = useToast();

  const handleConvert = async () => {
    if (!file) return;

    try {
      setConverting(true);
      const blob = await convertPDF(file, format);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Conversion successful!",
        description: "Your file has been converted and downloaded.",
      });
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: "There was an error converting your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PDF Converter
          </h1>
          <p className="text-lg text-gray-600">
            Convert your PDF files to Word, Images, or Text
          </p>
        </div>

        <div className="space-y-8">
          <FileUpload onFileSelect={setFile} />
          
          {file && (
            <>
              <div className="flex flex-col items-center space-y-4">
                <ConversionOptions
                  selectedFormat={format}
                  onFormatChange={setFormat}
                />
                
                <Button
                  onClick={handleConvert}
                  disabled={converting}
                  size="lg"
                  className="w-full max-w-xs"
                >
                  {converting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Convert & Download
                    </>
                  )}
                </Button>
              </div>

              <PreviewPane file={file} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}