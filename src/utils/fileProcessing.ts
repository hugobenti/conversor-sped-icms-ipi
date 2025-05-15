
import * as XLSX from 'xlsx';
import { obterMapeamentoPorCodigo, registrosMapeamento } from './registrosMapeamento';

// Function to read TXT file and parse it into a 2D array
export const parseTxtToArray = (text: string): string[][] => {
  // Split by lines
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
  
  // For each line, split by pipe and remove empty items at start/end
  return lines.map(line => {
    const fields = line.split('|');
    
    // Remove empty elements at start and end (caused by leading/trailing |)
    if (fields[0] === '') fields.shift();
    if (fields[fields.length - 1] === '') fields.pop();
    
    return fields;
  });
};

// Agrupar linhas por tipo de registro (primeiro campo)
export const agruparPorRegistro = (data: string[][]): Record<string, string[][]> => {
  const grupos: Record<string, string[][]> = {};
  
  data.forEach(row => {
    if (row.length > 0) {
      const tipoRegistro = row[0];
      
      if (!grupos[tipoRegistro]) {
        grupos[tipoRegistro] = [];
      }
      
      grupos[tipoRegistro].push(row);
    }
  });
  
  return grupos;
};

// Function to convert 2D array to XLSX with multiple sheets (one per register type)
export const convertArrayToXlsx = (data: string[][]): Blob => {
  // Agrupar os dados por tipo de registro
  const gruposPorRegistro = agruparPorRegistro(data);
  
  // Create a workbook
  const wb = XLSX.utils.book_new();
  
  // Para cada grupo de registros, criar uma aba
  Object.entries(gruposPorRegistro).forEach(([tipoRegistro, linhas]) => {
    const mapeamento = obterMapeamentoPorCodigo(tipoRegistro);
    
    // Adicionar cabeçalho se disponível no mapeamento
    let dadosComCabecalho: string[][] = [...linhas];
    
    if (mapeamento && mapeamento.cabecalho.length > 0) {
      dadosComCabecalho = [mapeamento.cabecalho, ...linhas];
    }
    
    // Criar worksheet
    const ws = XLSX.utils.aoa_to_sheet(dadosComCabecalho);
    
    // Nome da aba: código do registro + descrição (se disponível)
    let nomeAba = tipoRegistro;
    if (mapeamento) {
      // Limitar o comprimento do nome da aba para evitar erros no Excel
      const descricaoCurta = mapeamento.descricao.substring(0, 20);
      nomeAba = `${tipoRegistro} - ${descricaoCurta}`;
    }
    
    // Adicionar worksheet ao workbook
    try {
      XLSX.utils.book_append_sheet(wb, ws, nomeAba);
    } catch (error) {
      // Se ocorrer erro (por exemplo, nome de aba duplicado ou inválido),
      // usar apenas o código como nome da aba
      XLSX.utils.book_append_sheet(wb, ws, `Reg ${tipoRegistro}`);
    }
  });
  
  // Generate XLSX file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

// Function to read XLSX file and convert to 2D array
export const parseXlsxToArray = async (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Combinar dados de todas as abas em uma única matriz
        let allData: string[][] = [];
        
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to array of arrays, skip headers if present
          const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
          
          // Verificar se existem cabeçalhos e pulá-los
          if (sheetData.length > 0) {
            const primeiraLinha = sheetData[0];
            
            // Se a primeira célula contiver "REG", provavelmente é um cabeçalho
            if (primeiraLinha[0] === "REG") {
              // Adicionar apenas os dados (sem o cabeçalho)
              allData = [...allData, ...sheetData.slice(1)];
            } else {
              // Adicionar todos os dados se não encontrarmos um cabeçalho
              allData = [...allData, ...sheetData];
            }
          }
        });
        
        resolve(allData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Function to convert 2D array back to TXT format
export const convertArrayToTxt = (data: string[][]): string => {
  // For each row, add pipes between fields and at start/end
  return data.map(row => `|${row.join('|')}|`).join('\n');
};

// Function to create a downloadable file
export const createDownloadableFile = (content: Blob | string, fileName: string): void => {
  // Create a blob if content is string
  const blob = typeof content === 'string' 
    ? new Blob([content], { type: 'text/plain' }) 
    : content;
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // Simulate click to trigger download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
