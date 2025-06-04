
import FileUploader from "./FileUploader";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Download, RefreshCw } from "lucide-react";

interface XlsxToTxtTabProps {
  xlsxFile: File | null;
  setXlsxFile: (file: File) => void;
  isLoading: boolean;
  onConvert: () => void;
}

export const XlsxToTxtTab = ({
  xlsxFile,
  setXlsxFile,
  isLoading,
  onConvert
}: XlsxToTxtTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Converter XLSX para TXT</CardTitle>
        <CardDescription>
          Carregue sua planilha Excel editada para convertê-la de volta ao formato TXT da EFD ICMS IPI.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-w-md mx-auto">
        <FileUploader
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          onFileSelect={(file) => setXlsxFile(file)}
          label="Arraste e solte sua planilha Excel"
          description="ou clique para selecionar"
          className="mb-6"
        />
        
        {isLoading && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Processando...</span>
              <span className="text-sm font-medium">Aguarde</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        )}
        
        <Button 
          onClick={onConvert} 
          disabled={!xlsxFile || isLoading} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Converter para TXT
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
