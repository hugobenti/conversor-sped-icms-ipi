
import * as XLSX from 'xlsx';

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

// Function to convert 2D array to XLSX
export const convertArrayToXlsx = (data: string[][]): Blob => {
  // Create a worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);
  
  // Create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "EFD ICMS IPI");
  
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
        
        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to array of arrays
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        resolve(jsonData);
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
