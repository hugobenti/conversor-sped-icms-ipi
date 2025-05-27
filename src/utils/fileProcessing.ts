import * as XLSX from 'xlsx';
import { obterMapeamentoPorCodigo } from './registrosMapeamento';

/* ---------- UTILITÁRIO PARA NOME DE ABA ---------- */
const sanitizeSheetName = (name: string) =>
  name.replace(/[\[\]:*?/\\]/g, '').substring(0, 31);

/* ---------- PARSE TXT → ARRAY ---------- */
export const parseTxtToArray = (text: string): string[][] => {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');

  return lines.map(line => {
    const safeLine = line.startsWith('|') ? line : `|${line}`;
    const finalLine = safeLine.endsWith('|') ? safeLine : `${safeLine}|`;

    // Corrige campos vazios || → | |
    const fixedLine = finalLine.replace(/\|\|/g, '| |');

    const fields = fixedLine.split('|').slice(1, -1); // remove pipe inicial e final

    return fields;
  });
};

/* ---------- AGRUPAR COM ORDEM ---------- */
interface AgrupamentoPorRegistro {
  ordem: string[];
  grupos: Record<string, string[][]>;
}

export const agruparPorRegistroComOrdem = (data: string[][]): AgrupamentoPorRegistro => {
  const grupos: Record<string, string[][]> = {};
  const ordem: string[] = [];

  data.forEach(row => {
    if (row.length > 0) {
      const tipoRegistro = row[0];

      if (!grupos[tipoRegistro]) {
        grupos[tipoRegistro] = [];
        ordem.push(tipoRegistro);
      }

      grupos[tipoRegistro].push(row);
    }
  });

  return { grupos, ordem };
};

/* ---------- CONVERTER ARRAY → XLSX ---------- */
export const convertArrayToXlsx = (data: string[][]): Blob => {
  const { grupos, ordem } = agruparPorRegistroComOrdem(data);

  const wb = XLSX.utils.book_new();

  ordem.forEach(tipoRegistro => {
    const linhas = grupos[tipoRegistro];
    const mapeamento = obterMapeamentoPorCodigo(tipoRegistro);

    let dadosComCabecalho: string[][] = [...linhas];

    if (mapeamento && mapeamento.cabecalho.length > 0) {
      dadosComCabecalho = [mapeamento.cabecalho, ...linhas];
    }

    const ws = XLSX.utils.aoa_to_sheet(dadosComCabecalho);

    // Forçar tudo como texto
    Object.keys(ws).forEach(cell => {
      if (cell.startsWith('!')) return;
      ws[cell].z = '@';
      ws[cell].t = 's';
    });

    const nomeAba = mapeamento
      ? sanitizeSheetName(`${tipoRegistro} - ${mapeamento.descricao.substring(0, 20)}`)
      : `Reg ${tipoRegistro}`;

    try {
      XLSX.utils.book_append_sheet(wb, ws, nomeAba);
    } catch {
      XLSX.utils.book_append_sheet(wb, ws, `Reg ${tipoRegistro}`);
    }
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
                newRow.push('');
              }
              return newRow;
            });

            const primeiraLinha = sheetFixed[0];

            const isHeader = /^REG$/i.test(String(primeiraLinha[0] ?? '').trim());

            if (isHeader) {
              allData = [...allData, ...sheetFixed.slice(1)];
            } else {
              allData = [...allData, ...sheetFixed];
            }
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

/* ---------- ARRAY → TXT ---------- */
export const convertArrayToTxt = (data: string[][]): string => {
  return data
    .map(row => {
      const linha = row.map(col => col.trim()).join('|');
      return `|${linha}|`;
    })
    .join('\n');
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
