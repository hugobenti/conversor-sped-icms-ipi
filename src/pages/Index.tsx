
import { useState } from "react";
import FileUploader from "@/components/FileUploader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { 
  parseTxtToArray, 
  convertArrayToXlsx, 
  parseXlsxToArray, 
  convertArrayToTxt, 
  createDownloadableFile 
} from "@/utils/fileProcessing";

const Index = () => {
  const { toast } = useToast();
  const [txtFile, setTxtFile] = useState<File | null>(null);
  const [xlsxFile, setXlsxFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState<{txt: boolean, xlsx: boolean}>({txt: false, xlsx: false});

  // Handle TXT to XLSX conversion
  const handleTxtToXlsx = async () => {
    if (!txtFile) {
      toast({
        title: "Arquivo não selecionado",
        description: "Por favor, selecione um arquivo TXT para converter.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(prev => ({...prev, txt: true}));
    
    try {
      // Read the TXT file
      const text = await readFileAsText(txtFile);
      
      // Parse TXT content into array
      const data = parseTxtToArray(text);
      setParsedData(data);
      
      // Convert to XLSX
      const xlsxBlob = convertArrayToXlsx(data);
      
      // Download the XLSX file
      createDownloadableFile(
        xlsxBlob, 
        txtFile.name.replace(/\.[^/.]+$/, "") + ".xlsx"
      );
      
      toast({
        title: "Conversão concluída",
        description: "Arquivo XLSX gerado com sucesso!",
      });
    } catch (error) {
      console.error("Error converting TXT to XLSX:", error);
      toast({
        title: "Erro na conversão",
        description: "Ocorreu um erro ao converter o arquivo. Verifique o formato.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({...prev, txt: false}));
    }
  };

  // Handle XLSX to TXT conversion
  const handleXlsxToTxt = async () => {
    if (!xlsxFile) {
      toast({
        title: "Arquivo não selecionado",
        description: "Por favor, selecione um arquivo XLSX para converter.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(prev => ({...prev, xlsx: true}));
    
    try {
      // Parse XLSX to array
      const data = await parseXlsxToArray(xlsxFile);
      
      // Convert array to TXT format
      const txtContent = convertArrayToTxt(data);
      
      // Download the TXT file
      createDownloadableFile(
        txtContent, 
        xlsxFile.name.replace(/\.[^/.]+$/, "") + ".txt"
      );
      
      toast({
        title: "Conversão concluída",
        description: "Arquivo TXT gerado com sucesso!",
      });
    } catch (error) {
      console.error("Error converting XLSX to TXT:", error);
      toast({
        title: "Erro na conversão",
        description: "Ocorreu um erro ao converter o arquivo. Verifique o formato.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({...prev, xlsx: false}));
    }
  };

  // Helper function to read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // Handler for previewing TXT file
  const handlePreviewTxtFile = async (file: File) => {
    try {
      const text = await readFileAsText(file);
      const data = parseTxtToArray(text);
      setParsedData(data);
      toast({
        title: "Arquivo carregado",
        description: `${file.name} foi carregado com sucesso. Clique em "Converter para XLSX" para baixar o arquivo convertido.`,
      });
    } catch (error) {
      console.error("Error previewing TXT file:", error);
      toast({
        title: "Erro ao carregar arquivo",
        description: "Não foi possível ler o arquivo TXT. Verifique o formato.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-fiscal-blue text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">Conversor EFD ICMS IPI</h1>
          <p className="text-center mt-2 text-blue-100">
            Ferramenta para converter arquivos fiscais entre formatos TXT e XLSX
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="txt-to-xlsx" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="txt-to-xlsx" className="text-lg py-3">
              <FileText className="mr-2 h-4 w-4" />
              TXT para XLSX
            </TabsTrigger>
            <TabsTrigger value="xlsx-to-txt" className="text-lg py-3">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              XLSX para TXT
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="txt-to-xlsx">
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
                      handlePreviewTxtFile(file);
                    }}
                    label="Arraste e solte seu arquivo TXT"
                    description="ou clique para selecionar"
                    className="mb-6"
                  />
                  
                  <Button 
                    onClick={handleTxtToXlsx} 
                    disabled={!txtFile || isLoading.txt} 
                    className="w-full"
                  >
                    {isLoading.txt ? (
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
          </TabsContent>
          
          <TabsContent value="xlsx-to-txt">
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
                
                <Button 
                  onClick={handleXlsxToTxt} 
                  disabled={!xlsxFile || isLoading.xlsx} 
                  className="w-full"
                >
                  {isLoading.xlsx ? (
                    "Processando..."
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Converter para TXT
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-2xl font-bold text-fiscal-blue mb-4">Sobre esta ferramenta</h2>
          <p className="mb-4">
            Esta é uma aplicação web 100% frontend para auxiliar empresas e contadores na conversão de arquivos fiscais da EFD ICMS IPI (TXT ↔ Excel).
          </p>
          <p className="mb-4">
            A ferramenta permite carregar arquivos .txt no formato SPED, convertê-los para Excel de forma organizada, e reconvertê-los de volta para TXT com a estrutura preservada.
          </p>
          <p className="font-medium">
            Nenhum dado é enviado para servidores — todo o processamento ocorre no navegador, garantindo privacidade e agilidade.
          </p>
        </div>
      </main>
      
      <footer className="bg-gray-100 border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Conversor EFD ICMS IPI</p>
          <p className="text-sm mt-2">
            Esta ferramenta não possui vínculo com a Receita Federal ou qualquer órgão governamental.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
