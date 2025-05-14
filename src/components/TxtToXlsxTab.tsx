
import FileUploader from "@/components/FileUploader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

interface TxtToXlsxTabProps {
  txtFile: File | null;
  setTxtFile: (file: File) => void;
  parsedData: string[][];
  isLoading: boolean;
  onFileSelect: (file: File) => void;
  onConvert: () => void;
}

export const TxtToXlsxTab = ({
  txtFile,
  setTxtFile,
  parsedData,
  isLoading,
  onFileSelect,
  onConvert
}: TxtToXlsxTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Converter TXT para XLSX</CardTitle>
          <CardDescription>
            Carregue seu arquivo EFD ICMS IPI em formato TXT para convertê-lo em planilha Excel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploader
            accept=".txt,text/plain"
            onFileSelect={(file) => {
              setTxtFile(file);
              onFileSelect(file);
            }}
            label="Arraste e solte seu arquivo TXT"
            description="ou clique para selecionar"
            className="mb-6"
          />
          
          <Button 
            onClick={onConvert} 
            disabled={!txtFile || isLoading} 
            className="w-full"
          >
            {isLoading ? (
              "Processando..."
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Converter para XLSX
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Pré-visualização dos dados</CardTitle>
          <CardDescription>
            Os dados do arquivo TXT serão exibidos aqui após o carregamento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={parsedData} />
        </CardContent>
      </Card>
    </div>
  );
};
