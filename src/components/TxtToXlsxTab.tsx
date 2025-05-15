
import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, RefreshCw, FileText, Check, X } from "lucide-react";
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
  encontrado: boolean;
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
          contagem: linhas.length,
          encontrado: !!mapeamento
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
        </CardContent>
      </Card>
      
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Resumo dos registros encontrados</CardTitle>
          <CardDescription>
            Listagem dos tipos de registro no arquivo carregado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center gap-4">
              <RefreshCw className="h-12 w-12 text-muted-foreground animate-spin" />
              <p className="text-muted-foreground">Carregando dados...</p>
            </div>
          ) : resumoRegistros.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {resumoRegistros.map((item) => (
                <div 
                  key={item.codigo} 
                  className={`p-2 rounded-md border flex items-center justify-between ${!item.encontrado ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                >
                  <div className="flex items-center gap-2">
                    {item.encontrado ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <div className="font-medium">{item.codigo}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[180px]" title={item.descricao}>
                        {item.descricao}
                      </div>
                    </div>
                  </div>
                  <Badge variant={item.encontrado ? "secondary" : "destructive"}>
                    {item.contagem}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p>Nenhum registro para exibir. Faça o upload de um arquivo para visualizar o resumo.</p>
            </div>
          )}
          
          {resumoRegistros.length > 0 && (
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">Total de tipos de registro: </span>
                  <span>{resumoRegistros.length}</span>
                </div>
                <div>
                  <span className="font-medium">Registros não mapeados: </span>
                  <span className={`${resumoRegistros.filter(r => !r.encontrado).length > 0 ? 'text-red-500 font-bold' : ''}`}>
                    {resumoRegistros.filter(r => !r.encontrado).length}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Total de linhas: </span>
                  <span>{resumoRegistros.reduce((acc, r) => acc + r.contagem, 0)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
