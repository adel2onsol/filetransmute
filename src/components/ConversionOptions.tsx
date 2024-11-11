import React from 'react';
import { FileType } from 'lucide-react';
import { ConversionFormat } from '@/lib/converter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConversionOptionsProps {
  selectedFormat: ConversionFormat;
  onFormatChange: (format: ConversionFormat) => void;
}

export function ConversionOptions({ selectedFormat, onFormatChange }: ConversionOptionsProps) {
  return (
    <div className="w-full max-w-xs">
      <Select
        value={selectedFormat}
        onValueChange={(value) => onFormatChange(value as ConversionFormat)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="docx">Word Document (.docx)</SelectItem>
          <SelectItem value="png">Image PNG (.png)</SelectItem>
          <SelectItem value="jpeg">Image JPEG (.jpeg)</SelectItem>
          <SelectItem value="txt">Text File (.txt)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}