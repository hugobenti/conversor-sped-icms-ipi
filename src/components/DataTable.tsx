
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, File, FileSpreadsheet, FileJson, FilePieChart, FileBarChart, 
  FileBox, FileCode, FileDigit, FileKey, FileLineChart, FileSearch, 
  FileStack, FileSymlink, FileType, FileUp, FileWarning, FileX, Folder
} from "lucide-react";
import { obterMapeamentoPorCodigo, obterIconePorCodigo } from "@/utils/registrosMapeamento";

interface DataTableProps {
  data: string[][];
  headers?: string[];
}

// Componente para renderizar o ícone com base no código
const RegistroIcon = ({ codigo }: { codigo: string }) => {
  const iconName = obterIconePorCodigo(codigo);
  
  // Map dos componentes de ícones disponíveis
  const icones: Record<string, React.ReactNode> = {
    "0": <FileDigit className="h-4 w-4" />,
    "5": <FileDigit className="h-4 w-4" />,
    "100": <FileDigit className="h-4 w-4" />,
    "150": <FileDigit className="h-4 w-4" />,
    "190": <FileDigit className="h-4 w-4" />,
    "200": <FileDigit className="h-4 w-4" />,
    "400": <FileDigit className="h-4 w-4" />,
    "450": <FileDigit className="h-4 w-4" />,
    "B001": <FileCode className="h-4 w-4" />,
    "C110": <FileSpreadsheet className="h-4 w-4" />,
    "C170": <FileSpreadsheet className="h-4 w-4" />,
    "C190": <FileSpreadsheet className="h-4 w-4" />,
    "C850": <FileSpreadsheet className="h-4 w-4" />,
    "D001": <FileBarChart className="h-4 w-4" />,
    "E110": <FilePieChart className="h-4 w-4" />,
    "G001": <FileJson className="h-4 w-4" />,
    "H005": <FileLineChart className="h-4 w-4" />,
    "K001": <FileKey className="h-4 w-4" />,
    "1010": <FileSearch className="h-4 w-4" />
  };
  
  // Retorna o ícone ou o ícone padrão
  return icones[iconName] || <FileText className="h-4 w-4" />;
};

const DataTable = ({ data, headers }: DataTableProps) => {
  // If we have no data, display a message
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum dado para exibir. Faça o upload de um arquivo para visualizar seu conteúdo.
      </div>
    );
  }

  // Get the first field from each row (register type)
  const registerTypes = data.map(row => row[0] || "");
  
  // Create column headers based on provided headers or the number of columns in first row
  const columnCount = data[0]?.length || 0;
  const defaultHeaders = Array.from({ length: columnCount }, (_, i) => `Campo ${i+1}`);
  const tableHeaders = headers || defaultHeaders;

  return (
    <div className="border rounded-lg">
      <ScrollArea className="h-[400px] w-full">
        <Table>
          <TableHeader className="bg-gray-50 sticky top-0 z-10">
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableHead key={index} className={index === 0 ? "w-[180px]" : ""}>
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>
                    {cellIndex === 0 ? (
                      <Badge className="bg-fiscal-blue flex items-center gap-1">
                        <RegistroIcon codigo={cell} />
                        {cell}
                        {obterMapeamentoPorCodigo(cell) && 
                          <span className="hidden sm:inline"> - {obterMapeamentoPorCodigo(cell)?.descricao}</span>
                        }
                      </Badge>
                    ) : (
                      cell || "-"
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default DataTable;
