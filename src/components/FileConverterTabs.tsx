"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useToast } from "../hooks/use-toast";
import { FileText, FileSpreadsheet } from "lucide-react";

import {
  parseXlsxToArray,
  convertArrayToTxt,
  createDownloadableFile,
  parseTxtToArray,
} from "../utils/fileProcessing"; // funções de cliente
import { listaExcecoes } from "../utils/excecoes";
import { TxtToXlsxTab } from "./TxtToXlsxTab";
import { XlsxToTxtTab } from "./XlsxToTxtTab";

const FileConverterTabs = () => {
  const { toast } = useToast();
  const [txtFile, setTxtFile] = useState<File | null>(null);
  const [xlsxFile, setXlsxFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState<{ txt: boolean; xlsx: boolean }>({
    txt: false,
    xlsx: false,
  });

  const [excecoesAtivasIds, setExcecoesAtivasIds] = useState<string[]>([]);
  const excecoesAtivas = listaExcecoes.filter((ex) =>
    excecoesAtivasIds.includes(ex.id)
  );

  const readFileAsText = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });

  // → Preview do TXT
  const handlePreviewTxtFile = async (file: File) => {
    try {
      toast({
        title: "Carregando arquivo",
        description: "Lendo dados do arquivo, por favor aguarde...",
      });
      let text = await readFileAsText(file);
      excecoesAtivas.forEach((ex) => {
        if (ex.aplicaEm === "linha") {
          text = ex.aplicar({ tipo: "linha", texto: text });
        }
      });
      let data = parseTxtToArray(text);
      data = data.map((row) => {
        const registro = row[0]?.trim() ?? "";
        return row.map((valor, index) => {
          let novoValor = valor;
          excecoesAtivas.forEach((ex) => {
            if (ex.aplicaEm === "campo" && ex.registros?.includes(registro)) {
              novoValor = ex.aplicar({
                tipo: "campo",
                registro,
                colunaIndex: index,
                valorAtual: novoValor,
              });
            }
          });
          return novoValor;
        });
      });
      setParsedData(data);
      toast({
        title: "Preview gerado",
        description:
          `${file.name} carregado. Clique em "Converter para XLSX" quando quiser baixar.`,
      });
    } catch (error) {
      console.error("Erro ao carregar TXT para preview:", error);
      toast({
        title: "Erro ao carregar arquivo",
        description: "Não foi possível ler o arquivo TXT.",
        variant: "destructive",
      });
    }
  };

  // → Converter TXT → XLSX via API Next.js
  const handleTxtToXlsx = async () => {
    if (!txtFile) {
      toast({
        title: "Arquivo não selecionado",
        description: "Selecione um arquivo TXT antes de converter.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading((p) => ({ ...p, txt: true }));
    toast({
      title: "Enviando para servidor",
      description: "Sua conversão está em andamento. Aguarde...",
    });
    try {
      const formData = new FormData();
      formData.append("file", txtFile);

      const resp = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const blob = await resp.blob();
      createDownloadableFile(
        blob,
        txtFile.name.replace(/\.[^/.]+$/, "") + ".xlsx"
      );
      toast({
        title: "Conversão concluída",
        description:
          "Arquivo XLSX gerado com sucesso! O download começa em breve.",
      });
    } catch (error) {
      console.error("Erro na conversão TXT→XLSX:", error);
      toast({
        title: "Erro na conversão",
        description:
          "Falha ao converter no servidor. Veja o console para mais detalhes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading((p) => ({ ...p, txt: false }));
    }
  };

  // → Converter XLSX → TXT no cliente
  const handleXlsxToTxt = async () => {
    if (!xlsxFile) {
      toast({
        title: "Arquivo não selecionado",
        description: "Selecione um arquivo XLSX antes de converter.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading((p) => ({ ...p, xlsx: true }));
    toast({
      title: "Processando",
      description: "Convertendo XLSX para TXT...",
    });
    try {
      const data = await parseXlsxToArray(xlsxFile);
      const txtContent = convertArrayToTxt(data);
      createDownloadableFile(
        txtContent,
        xlsxFile.name.replace(/\.[^/.]+$/, "") + ".txt"
      );
      toast({
        title: "Conversão concluída",
        description:
          "Arquivo TXT gerado com sucesso! O download começa em breve.",
      });
    } catch (error) {
      console.error("Erro ao converter XLSX→TXT:", error);
      toast({
        title: "Erro na conversão",
        description: "Não foi possível converter o arquivo XLSX.",
        variant: "destructive",
      });
    } finally {
      setIsLoading((p) => ({ ...p, xlsx: false }));
    }
  };

  return (
    <>
      {/* Painel de exceções */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Tratamentos de exceção:</h3>
        {listaExcecoes.map((ex) => (
          <label key={ex.id} className="flex items-center mb-1">
            <input
              type="checkbox"
              checked={excecoesAtivasIds.includes(ex.id)}
              onChange={(e) => {
                setExcecoesAtivasIds((prev) =>
                  e.target.checked
                    ? [...prev, ex.id]
                    : prev.filter((id) => id !== ex.id)
                );
              }}
              className="mr-2"
            />
            {ex.nome}
          </label>
        ))}
      </div>

      {/* Tabs */}
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
    </>
  );
};

export default FileConverterTabs;
