/// <reference lib="webworker" />
import * as XLSX from "xlsx";

/* --------- UTILITÁRIO PARA NOME DE ABA --------- */
const sanitizeSheetName = (name: string) =>
  name.replace(/[\[\]:*?/\\]/g, "").substring(0, 31);

/* --------- DETERMINA O BLOCO --------- */
const obterNomeDaAba = (registro: string): string => {
  if (registro.startsWith("0")) return "Abertura";
  if (registro.startsWith("9")) return "Encerramento";
  if (registro.startsWith("1")) return "Bloco 1";

  const primeiraLetra = registro.charAt(0).toUpperCase();
  if (/[A-Z]/.test(primeiraLetra)) return `Bloco ${primeiraLetra}`;

  return "Outros";
};

/* --------- PARSE TXT → ARRAY --------- */
const parseTxtToArray = (text: string): string[][] => {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const parts = line.split("|");
      if (parts[0] === "") parts.shift();
      if (parts[parts.length - 1] === "") parts.pop();
      return parts.map((field) => (field.trim() === "" ? "" : field.trim()));
    });
};

/* --------- PREPARAR COM __EMPTY__ --------- */
const getMaxColumns = (rows: string[][]): number => {
  if (!rows || rows.length === 0) return 0;
  return rows.reduce((maxSoFar, row) => {
    const len = Array.isArray(row) ? row.length : 0;
    return len > maxSoFar ? len : maxSoFar;
  }, 0);
};

const prepareSheetWithEmptyFlag = (
  rows: string[][],
  maxColumns: number
): string[][] => {
  if (maxColumns <= 0) return [];
  return rows.map((row) => {
    const newRow = Array(maxColumns).fill("__EMPTY__");
    row.forEach((col, idx) => {
      newRow[idx] = typeof col === "string" ? col : "";
    });
    return newRow;
  });
};

/* --------- CONVERTER ARRAY → XLSX (RETORNA BLOB) --------- */
const convertArrayToXlsxBlob = (data: string[][]): Blob => {
  const gruposOriginais = new Map<string, string[][]>();
  data.forEach((row) => {
    const registro = row[0]?.trim();
    if (!registro) return;
    const nomeAba = obterNomeDaAba(registro);
    if (!gruposOriginais.has(nomeAba)) {
      gruposOriginais.set(nomeAba, []);
    }
    gruposOriginais.get(nomeAba)!.push(row);
  });

  const gruposPreenchidos = new Map<string, string[][]>();
  gruposOriginais.forEach((linhasOriginais, nomeAba) => {
    if (!linhasOriginais || linhasOriginais.length === 0) {
      gruposPreenchidos.set(nomeAba, []);
      return;
    }
    const maxColumns = getMaxColumns(linhasOriginais);
    if (maxColumns <= 0) {
      gruposPreenchidos.set(nomeAba, []);
      return;
    }
    const filledRows = prepareSheetWithEmptyFlag(
      linhasOriginais,
      maxColumns
    );
    gruposPreenchidos.set(nomeAba, filledRows);
  });

  const wb = XLSX.utils.book_new();
  gruposPreenchidos.forEach((filledRows, nomeAba) => {
    if (!filledRows || filledRows.length === 0) return;
    const ws = XLSX.utils.aoa_to_sheet(filledRows);
    Object.keys(ws).forEach((cell) => {
      if (cell.startsWith("!")) return;
      ws[cell].z = "@";
      ws[cell].t = "s";
    });
    XLSX.utils.book_append_sheet(wb, ws, sanitizeSheetName(nomeAba));
  });

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
};

/* --------- ONMESSAGE DO WORKER --------- */
self.onmessage = (ev: MessageEvent) => {
  if (typeof ev.data !== "string") {
    self.postMessage({
      success: false,
      error: "[Worker] payload inválido, esperava string"
    });
    return;
  }

  try {
    const texto: string = ev.data;
    const arrayDeLinhas = parseTxtToArray(texto);
    const blobResult = convertArrayToXlsxBlob(arrayDeLinhas);
    self.postMessage({ success: true, blob: blobResult });
  } catch (err) {
    const e = err as Error;
    self.postMessage({ success: false, error: e.message || String(e) });
  }
};

export {}; // evita poluir o escopo global
