/**
 * Caso você queira separar logicamente as funções que só rodam no cliente (sem Worker),
 * crie este arquivo. Você pode importar dele em páginas/componentes.
 */

import * as XLSX from "xlsx";

export async function parseXlsxToArray(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, {
          type: "array",
          cellText: false,
          cellDates: false
        });

        const allData: string[][] = workbook.SheetNames.flatMap((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const sheetData = XLSX.utils.sheet_to_json<string[]>(worksheet, {
            header: 1,
            raw: false,
            blankrows: true
          });

          if (!sheetData || sheetData.length === 0) return [];

          const lengths = sheetData.map((r) =>
            Array.isArray(r) ? r.length : 0
          );
          const maxLength = lengths.length ? Math.max(...lengths) : 0;

          return sheetData.map((r) => {
            const newRow = Array.isArray(r) ? [...r] : [];
            while (newRow.length < maxLength) {
              newRow.push("__EMPTY__");
            }
            return newRow;
          });
        });

        resolve(allData);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

export function convertArrayToTxt(data: string[][]): string {
  const lines = data.map((row) => {
    const filtered = row.filter((col) => col !== "__EMPTY__");
    let linha = filtered
      .map((col) => (col.trim() === "" ? "" : col.trim()))
      .join("|");
    linha = `|${linha}|`;
    linha = linha.replace(/([A-Za-z0-9]) \|/g, "$1|");
    linha = linha.replace(/\|\s*\|/g, "||");
    return linha;
  });
  return lines.join("\n") + "\n";
}

export function createDownloadableFile(content: Blob | string, fileName: string) {
  const blob =
    typeof content === "string"
      ? new Blob([content], { type: "text/plain" })
      : content;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseTxtToArray(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const parts = line.split("|");
      if (parts[0] === "") parts.shift();
      if (parts[parts.length - 1] === "") parts.pop();
      return parts.map((f) => (f.trim() === "" ? "" : f.trim()));
    });
}
