
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
import { TxtToXlsxTab } from "@/components/TxtToXlsxTab";
import { XlsxToTxtTab } from "@/components/XlsxToTxtTab";

const FileConverterTabs = () => {
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
        <TxtToXlsxTab
          txtFile={txtFile}
          setTxtFile={setTxtFile}
          parsedData={parsedData}
          isLoading={isLoading.txt}
          onFileSelect={handlePreviewTxtFile}
          onConvert={handleTxtToXlsx}
        />
      </TabsContent>
      
      <TabsContent value="xlsx-to-txt">
        <XlsxToTxtTab
          xlsxFile={xlsxFile}
          setXlsxFile={setXlsxFile}
          isLoading={isLoading.xlsx}
          onConvert={handleXlsxToTxt}
        />
      </TabsContent>
    </Tabs>
  );
};

export default FileConverterTabs;
