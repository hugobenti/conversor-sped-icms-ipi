import * as XLSX from 'xlsx';
import { obterMapeamentoPorCodigo } from './registrosMapeamento';

/* ---------- UTILITÁRIO PARA NOME DE ABA ---------- */
const sanitizeSheetName = (name: string) =>
  name.replace(/[\[\]:*?/\\]/g, '').substring(0, 31);

/* ---------- DETERMINA O BLOCO ---------- */
const obterNomeDaAba = (registro: string): string => {
  if (registro.startsWith('0')) return 'Abertura';
  if (registro.startsWith('9')) return 'Encerramento';
  if (registro.startsWith('1')) return 'Bloco 1';

  const primeiraLetra = registro.charAt(0).toUpperCase();
  if (/[A-Z]/.test(primeiraLetra)) return `Bloco ${primeiraLetra}`;

  return 'Outros';
};

/* ---------- PARSE TXT → ARRAY ---------- */
export const parseTxtToArray = (text: string): string[][] => {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');

  return lines.map(line => {
    const safeLine = line.startsWith('|') ? line : `|${line}`;
    const finalLine = safeLine.endsWith('|') ? safeLine : `${safeLine}|`;

    const fixedLine = finalLine.replace(/\|\|/g, '| |');
    const fields = fixedLine.split('|').slice(1, -1);

    return fields;
  });
};

/* ---------- PREENCHER COM __EMPTY__ ---------- */
const getMaxColumns = (rows: string[][]): number =>
  Math.max(...rows.map(r => r.length));

const prepareSheetWithEmptyFlag = (rows: string[][]): string[][] => {
  const maxColumns = getMaxColumns(rows);

  return rows.map(row => {
    const padded = [...row];
    while (padded.length < maxColumns) {
      padded.push('__EMPTY__');
    }
    return padded;
  });
};

/* ---------- CONVERTER ARRAY → XLSX ---------- */
export const convertArrayToXlsx = (data: string[][]): Blob => {
  const wb = XLSX.utils.book_new();
  const grupos: Record<string, string[][]> = {};

  data.forEach(row => {
    const registro = row[0]?.trim();
    if (!registro) return;

    const nomeAba = obterNomeDaAba(registro);
    if (!grupos[nomeAba]) grupos[nomeAba] = [];
    grupos[nomeAba].push(row);
  });

  Object.entries(grupos).forEach(([nomeAba, linhas]) => {
    const dadosComEmpty = prepareSheetWithEmptyFlag(linhas);

    const ws = XLSX.utils.aoa_to_sheet(dadosComEmpty);

    Object.keys(ws).forEach(cell => {
      if (cell.startsWith('!')) return;
      ws[cell].z = '@';
      ws[cell].t = 's';
    });

    XLSX.utils.book_append_sheet(wb, ws, sanitizeSheetName(nomeAba));
  });

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
};

/* ---------- PARSE XLSX → ARRAY ---------- */
export const parseXlsxToArray = async (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, {
          type: 'array',
          cellText: false,
          cellDates: false,
        });

        let allData: string[][] = [];

        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];

          const sheetData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            raw: false,
            blankrows: true,
          }) as string[][];

          if (sheetData.length > 0) {
            const maxLength = Math.max(...sheetData.map(r => r.length));

            const sheetFixed = sheetData.map(r => {
              const newRow = [...r];
              while (newRow.length < maxLength) {
                newRow.push('__EMPTY__');
              }
              return newRow;
            });

            allData = [...allData, ...sheetFixed];
          }
        });

        resolve(allData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = error => reject(error);

    reader.readAsArrayBuffer(file);
  });
};

/* ---------- ARRAY → TXT (USANDO A FLAG __EMPTY__) ---------- */
export const convertArrayToTxt = (data: string[][]): string => {
  const linhas = data.map(row => {
    const linhaFiltrada = row.filter(col => col !== '__EMPTY__');
    let linha = linhaFiltrada
      .map(col => (col.trim() === '' ? '' : col.trim())) // <<< NÃO colocar espaço! apenas ''
      .join('|');

    linha = `|${linha}|`;

    // Substituição 1: " | " → " "
    linha = linha.replace(/ \| /g, ' ');

    // Substituição 2: "x |" → "x|"
    linha = linha.replace(/([A-Za-z0-9]) \|/g, '$1|');

    // Substituição 3: garantir que múltiplos vazios não causem " | |"
    linha = linha.replace(/\|\s*\|/g, '||');

    return linha;
  });

  return linhas.join('\n') + '\n'; // adiciona linha vazia no final
};


/* ---------- CRIAR DOWNLOAD ---------- */
export const createDownloadableFile = (content: Blob | string, fileName: string): void => {
  const blob =
    typeof content === 'string'
      ? new Blob([content], { type: 'text/plain' })
      : content;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
