
import FileUploader from "@/components/FileUploader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { agruparPorRegistro } from "@/utils/fileProcessing";
import { useState, useEffect } from "react";
import { obterMapeamentoPorCodigo } from "@/utils/registrosMapeamento";

interface TxtToXlsxTabProps {
  txtFile: File | null;
  setTxtFile: (file: File) => void;
  parsedData: string[][];
  isLoading: boolean;
  onFileSelect: (file: File) => void;
  onConvert: () => void;
}

interface ResumoRegistro {
  codigo: string;
  descricao: string;
  contagem: number;
}

export const TxtToXlsxTab = ({
  txtFile,
  setTxtFile,
  parsedData,
  isLoading,
  onFileSelect,
  onConvert
}: TxtToXlsxTabProps) => {
  const [resumoRegistros, setResumoRegistros] = useState<ResumoRegistro[]>([]);

  // Atualizar o resumo de registros quando os dados mudam
  useEffect(() => {
    if (parsedData.length > 0) {
      const grupos = agruparPorRegistro(parsedData);
      
      const resumo: ResumoRegistro[] = Object.entries(grupos).map(([codigo, linhas]) => {
        const mapeamento = obterMapeamentoPorCodigo(codigo);
        
        return {
          codigo,
          descricao: mapeamento?.descricao || 'Registro desconhecido',
          contagem: linhas.length
        };
      });
      
      // Ordenar por código para exibição
      resumo.sort((a, b) => a.codigo.localeCompare(b.codigo));
      
      setResumoRegistros(resumo);
    } else {
      setResumoRegistros([]);
    }
  }, [parsedData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Converter TXT para XLSX</CardTitle>
          <CardDescription>
            Carregue seu arquivo EFD ICMS IPI em formato TXT para convertê-lo em planilha Excel com múltiplas abas.
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
            disabled={!txtFile || isLoading} 
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
                Converter para XLSX
              </>
            )}
          </Button>
          
          {resumoRegistros.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Resumo dos registros encontrados:</h3>
              <div className="max-h-[200px] overflow-y-auto space-y-1">
                {resumoRegistros.map((item) => (
                  <div key={item.codigo} className="text-xs flex justify-between items-center">
                    <Badge variant="outline" className="py-0.5">
                      {item.codigo}
                    </Badge>
                    <span className="text-muted-foreground truncate max-w-[60%]" title={item.descricao}>
                      {item.descricao}
                    </span>
                    <Badge variant="secondary" className="py-0.5">
                      {item.contagem}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Total: {resumoRegistros.length} tipos de registro
              </div>
            </div>
          )}
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
          {isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center gap-4">
              <RefreshCw className="h-12 w-12 text-muted-foreground animate-spin" />
              <p className="text-muted-foreground">Carregando dados...</p>
            </div>
          ) : (
            <DataTable data={parsedData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
