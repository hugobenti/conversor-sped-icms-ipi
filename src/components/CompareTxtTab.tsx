
import { useState } from "react";
import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, FileText, FileDiff, Check, X, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { parseTxtToArray, agruparPorRegistro } from "@/utils/fileProcessing";
import { useToast } from "@/hooks/use-toast";

interface CompareTxtTabProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

interface ResumoComparacao {
  codigo: string;
  contador1: number;
  contador2: number;
  diferenca: number;
  status: 'igual' | 'diferente' | 'apenas-1' | 'apenas-2';
}

export const CompareTxtTab = ({ isLoading, setIsLoading }: CompareTxtTabProps) => {
  const { toast } = useToast();
  const [txtFile1, setTxtFile1] = useState<File | null>(null);
  const [txtFile2, setTxtFile2] = useState<File | null>(null);
  const [resumoComparacao, setResumoComparacao] = useState<ResumoComparacao[]>([]);
  const [totalRegistros1, setTotalRegistros1] = useState(0);
  const [totalRegistros2, setTotalRegistros2] = useState(0);

  // Função para ler o arquivo como texto
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // Função para comparar os dois arquivos
  const compararArquivos = async () => {
    if (!txtFile1 || !txtFile2) {
      toast({
        title: "Arquivos não selecionados",
        description: "Por favor, selecione os dois arquivos TXT para comparar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: "Comparando arquivos",
      description: "Analisando os arquivos, aguarde um momento."
    });

    try {
      // Ler os conteúdos dos arquivos
      const texto1 = await readFileAsText(txtFile1);
      const texto2 = await readFileAsText(txtFile2);

      // Converter para arrays
      const dados1 = parseTxtToArray(texto1);
      const dados2 = parseTxtToArray(texto2);

      // Agrupar por registro
      const grupos1 = agruparPorRegistro(dados1);
      const grupos2 = agruparPorRegistro(dados2);

      // Obter todos os códigos de registro únicos
      const todosCodigos = [...new Set([
        ...Object.keys(grupos1),
        ...Object.keys(grupos2)
      ])].sort();

      // Calcular o resumo de comparação
      const resumo: ResumoComparacao[] = todosCodigos.map(codigo => {
        const contador1 = grupos1[codigo]?.length || 0;
        const contador2 = grupos2[codigo]?.length || 0;
        const diferenca = Math.abs(contador1 - contador2);
        
        let status: 'igual' | 'diferente' | 'apenas-1' | 'apenas-2';
        if (contador1 > 0 && contador2 === 0) {
          status = 'apenas-1';
        } else if (contador1 === 0 && contador2 > 0) {
          status = 'apenas-2';
        } else if (contador1 === contador2) {
          status = 'igual';
        } else {
          status = 'diferente';
        }

        return {
          codigo,
          contador1,
          contador2,
          diferenca,
          status
        };
      });

      // Calcular totais
      const total1 = dados1.length;
      const total2 = dados2.length;
      
      setTotalRegistros1(total1);
      setTotalRegistros2(total2);
      setResumoComparacao(resumo);
      
      toast({
        title: "Comparação concluída",
        description: `Foram analisados ${total1} registros do primeiro arquivo e ${total2} registros do segundo arquivo.`,
      });
    } catch (error) {
      console.error("Erro ao comparar arquivos:", error);
      toast({
        title: "Erro na comparação",
        description: "Ocorreu um erro ao comparar os arquivos. Verifique se o formato é válido.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para obter a classe CSS com base no status
  const getStatusClass = (status: 'igual' | 'diferente' | 'apenas-1' | 'apenas-2') => {
    switch (status) {
      case 'igual': return 'bg-green-50 border-green-200';
      case 'diferente': return 'bg-yellow-50 border-yellow-200';
      case 'apenas-1': return 'bg-blue-50 border-blue-200';
      case 'apenas-2': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  // Função para obter o ícone com base no status
  const getStatusIcon = (status: 'igual' | 'diferente' | 'apenas-1' | 'apenas-2') => {
    switch (status) {
      case 'igual': return <Check className="h-4 w-4 text-green-500" />;
      case 'diferente': return <FileDiff className="h-4 w-4 text-yellow-500" />;
      case 'apenas-1': return <ArrowRight className="h-4 w-4 text-blue-500 rotate-180" />;
      case 'apenas-2': return <ArrowRight className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  // Função para obter a badge com base no status
  const getStatusBadge = (status: 'igual' | 'diferente' | 'apenas-1' | 'apenas-2') => {
    switch (status) {
      case 'igual': return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Igual</Badge>;
      case 'diferente': return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Diferente</Badge>;
      case 'apenas-1': return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Apenas no arquivo 1</Badge>;
      case 'apenas-2': return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Apenas no arquivo 2</Badge>;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Arquivo TXT 1</CardTitle>
              <CardDescription>
                Carregue o primeiro arquivo TXT para comparação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader
                accept=".txt,text/plain"
                onFileSelect={setTxtFile1}
                label={txtFile1 ? `${txtFile1.name}` : "Arraste e solte o arquivo TXT"}
                description="ou clique para selecionar"
                className="mb-2"
              />
              {txtFile1 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {txtFile1.size / 1024 < 1024 
                    ? `${(txtFile1.size / 1024).toFixed(2)} KB` 
                    : `${(txtFile1.size / (1024 * 1024)).toFixed(2)} MB`}
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Arquivo TXT 2</CardTitle>
              <CardDescription>
                Carregue o segundo arquivo TXT para comparação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader
                accept=".txt,text/plain"
                onFileSelect={setTxtFile2}
                label={txtFile2 ? `${txtFile2.name}` : "Arraste e solte o arquivo TXT"}
                description="ou clique para selecionar"
                className="mb-2"
              />
              {txtFile2 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {txtFile2.size / 1024 < 1024 
                    ? `${(txtFile2.size / 1024).toFixed(2)} KB` 
                    : `${(txtFile2.size / (1024 * 1024)).toFixed(2)} MB`}
                </p>
              )}
            </CardContent>
          </Card>
          
          <Button 
            onClick={compararArquivos} 
            disabled={!txtFile1 || !txtFile2 || isLoading} 
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Comparando...
              </>
            ) : (
              <>
                <FileDiff className="mr-2 h-4 w-4" />
                Comparar Arquivos
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Resultado da Comparação</CardTitle>
          <CardDescription>
            Diferenças encontradas entre os arquivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center gap-4">
              <RefreshCw className="h-12 w-12 text-muted-foreground animate-spin" />
              <p className="text-muted-foreground">Comparando arquivos...</p>
            </div>
          ) : resumoComparacao.length > 0 ? (
            <div className="space-y-6">
              <div className="p-4 border rounded-md bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm">Arquivo 1</h3>
                    <p className="text-xs text-muted-foreground">{txtFile1?.name}</p>
                    <p className="text-lg font-bold">{totalRegistros1} registros</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Arquivo 2</h3>
                    <p className="text-xs text-muted-foreground">{txtFile2?.name}</p>
                    <p className="text-lg font-bold">{totalRegistros2} registros</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Diferença total: </span>
                      <span className={Math.abs(totalRegistros1 - totalRegistros2) > 0 ? 'text-red-500 font-bold' : 'text-green-500'}>
                        {Math.abs(totalRegistros1 - totalRegistros2)} registros
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Status: </span>
                      {totalRegistros1 === totalRegistros2 ? (
                        <span className="text-green-500">Mesma quantidade de registros</span>
                      ) : (
                        <span className="text-red-500">Quantidade diferente de registros</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                <h3 className="font-medium mb-2">Detalhamento por tipo de registro:</h3>
                {resumoComparacao.map((item) => (
                  <div 
                    key={item.codigo} 
                    className={`p-3 rounded-md border ${getStatusClass(item.status)}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <div>
                          <div className="font-medium">{item.codigo}</div>
                        </div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Arquivo 1: </span>
                        <span className="font-medium">{item.contador1}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Arquivo 2: </span>
                        <span className="font-medium">{item.contador2}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Diferença: </span>
                        <span className={item.diferenca > 0 ? "font-medium text-red-500" : "font-medium text-green-500"}>
                          {item.diferenca}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p>Nenhum resultado para exibir. Selecione dois arquivos e clique em Comparar.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompareTxtTab;
