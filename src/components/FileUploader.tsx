
import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  accept: string;
  onFileSelect: (file: File) => void;
  label: string;
  description?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  className?: string;
}

const FileUploader = ({
  accept,
  onFileSelect,
  label,
  description,
  variant = "default",
  className,
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFileName(selectedFile.name);
      onFileSelect(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      // Check if the file type matches the accepted types
      if (accept.includes(selectedFile.type) || 
          accept.includes(`.${selectedFile.name.split('.').pop()}`)) {
        setFileName(selectedFile.name);
        onFileSelect(selectedFile);
      }
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors",
          isDragging
            ? "border-fiscal-light-blue bg-fiscal-lightest-blue"
            : "border-gray-300 hover:border-fiscal-light-blue",
          className
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <Upload
          className={cn(
            "h-10 w-10 mb-2",
            isDragging ? "text-fiscal-blue" : "text-gray-400"
          )}
        />
        <div className="text-center">
          <p className="font-medium text-lg">{label}</p>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          <Button variant={variant} size="sm" className="mt-3">
            Selecionar arquivo
          </Button>
        </div>
      </div>
      {fileName && (
        <div className="mt-2 text-sm font-medium text-fiscal-blue">
          Arquivo selecionado: {fileName}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
