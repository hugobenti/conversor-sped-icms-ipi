// src/pages/api/convert.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import fs from "fs";
import readline from "readline";
import { Workbook } from "exceljs";

// 1) Configuração para permitir uploads grandes sem bodyParser do Next
export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "200mb", // ajustável para suportar arquivos maiores
  },
};


// 2) Mesmas funções auxiliares que você já usava:
//    a) parseTxtToArray (mas agora faremos parse linha a linha em vez de converter tudo de uma vez)
//    b) sanitizeSheetName
//    c) obterNomeDaAba
//    d) (não precisamos mais de getMaxColumns nem prepareSheetWithEmptyFlag, 
//       pois exceljs cuidará de empurrar cada array de colunas no streaming do XLSX)

function sanitizeSheetName(name: string): string {
  // Remove caracteres inválidos e limita a 31 chars
  return name.replace(/[\[\]:*?\/\\]/g, "").substring(0, 31);
}

function obterNomeDaAba(registro: string): string {
  if (registro.startsWith("0")) return "Abertura";
  if (registro.startsWith("9")) return "Encerramento";
  if (registro.startsWith("1")) return "Bloco 1";
  const pl = registro.charAt(0).toUpperCase();
  if (/[A-Z]/.test(pl)) return `Bloco ${pl}`;
  return "Outros";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ error: "Método não permitido. Use POST em /api/convert." });
  }

  // 3) Instancia IncomingForm do formidable para ler o multipart/form-data
  const form = new IncomingForm();

  // Ao chamar form.parse, o formidable grava automaticamente o arquivo em disco (diretório tmp).
  form.parse(req, async (err, _fields, files) => {
    if (err) {
      console.error("Erro ao parsear FormData:", err);
      return res
        .status(500)
        .json({ error: "Erro ao processar upload do arquivo." });
    }

    // 4) Esperamos que o campo do arquivo seja “file”
    const anyFiles = (files as any).file;
    const file = Array.isArray(anyFiles) ? anyFiles[0] : anyFiles;
    if (!file || typeof file === "string" || !(file as any).filepath) {
      console.error(
        "Campo 'file' inválido em files:",
        JSON.stringify(files, null, 2)
      );
      return res.status(400).json({ error: "Campo 'file' inválido." });
    }

    // Caminho temporário do TXT que o formidable salvou
    const txtPath = (file as any).filepath as string;

    // 5) Vamos ler o TXT linha a linha com readline (streaming puro)
    const fileStream = fs.createReadStream(txtPath, { encoding: "utf8" });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    // 6) Criamos um Workbook em streaming com exceljs
    const workbook = new Workbook();
    // exceljs, por padrão, mantém as planilhas em “workbook.xlsx” para escrita streaming
    // Vamos controlar cada aba via worksheetsMap:
    const worksheetsMap: Record<string, import("exceljs").Worksheet> = {};

    try {
      // 7) Para cada linha do TXT...
      for await (const rawLine of rl) {
        const line = rawLine.trim();
        if (!line) continue;

        // Divide por pipe, remove possíveis pipes vazios nas bordas:
        const partsFull = line.split("|");
        if (partsFull[0] === "") partsFull.shift();
        if (partsFull[partsFull.length - 1] === "") partsFull.pop();

        // Transforma cada campo: se for só espaços => '', senão .trim()
        const parts = partsFull.map((f) => (f.trim() === "" ? "" : f.trim()));

        // Primeiro campo (parts[0]) define o “registro” → define em qual aba vai
        const registro = parts[0] ?? "";
        const sheetNameRaw = obterNomeDaAba(registro);
        const sheetName = sanitizeSheetName(sheetNameRaw);

        // Se ainda não criamos essa aba, adicionamos pela primeira vez:
        if (!worksheetsMap[sheetName]) {
          worksheetsMap[sheetName] = workbook.addWorksheet(sheetName);
        }

        // Adiciona esta linha à aba correta:
        // exceljs aceitará um array de valores e preencherá as colunas em sequência.
        worksheetsMap[sheetName].addRow(parts);
      }

      // 8) Todos os dados já foram colocados linha a linha em worksheetsMap.
      //    Agora, vamos configurar os headers HTTP para enviar um XLSX “attachment”.
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="converted.xlsx"'
      );

      // 9) Escrever o XLSX em streaming diretamente na resposta
      //    A call abaixo fará com que o exceljs escreva o arquivo em pedaços para o `res` (pipe):
      await workbook.xlsx.write(res);

      // 10) Fecha a resposta
      res.end();
    } catch (e: any) {
      console.error("Erro ao gerar XLSX no servidor:", e);
      // Se der qualquer erro no loop ou no streaming, retornamos JSON de erro
      // (embora, se já começamos a mandar parte do XLSX pelo res, o client provavelmente verá um download corrompido.
      //  Mas, em um erro inicial, devolvemos 500 e o console.error aparecerá no terminal.)
      if (!res.headersSent) {
        res
          .status(500)
          .json({ error: "Erro interno ao gerar XLSX: " + e.message });
      } else {
        // Se os headers já foram enviados (quase não deve acontecer), apenas abortamos:
        res.end();
      }
    } finally {
      // 11) Opcional: podemos deletar o arquivo temporário que o formidable criou
      //     para não lotar o disco com .tmp. Se preferir, comente esta parte.
      fs.unlink(txtPath, (unlinkErr) => {
        if (unlinkErr) {
          console.warn("Não foi possível deletar TMP file:", txtPath, unlinkErr);
        }
      });
    }
  });
}
