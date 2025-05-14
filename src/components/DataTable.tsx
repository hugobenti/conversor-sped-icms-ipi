
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface DataTableProps {
  data: string[][];
  headers?: string[];
}

const DataTable = ({ data, headers }: DataTableProps) => {
  // If we have no data, display a message
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum dado para exibir. Faça o upload de um arquivo para visualizar seu conteúdo.
      </div>
    );
  }

  // Map register codes to their descriptions
  const getRegisterTypeDescription = (code: string): string => {
    const registerTypes: Record<string, string> = {
      "0000": "Abertura do Arquivo",
      "0001": "Abertura do Bloco 0",
      "0005": "Dados Complementares da Entidade",
      "0100": "Dados do Contabilista",
      "0150": "Tabela de Cadastro do Participante",
      "0190": "Identificação das Unidades de Medida",
      "0200": "Tabela de Identificação do Item",
      "0220": "Fatores de Conversão de Unidades",
      "C100": "Nota Fiscal (Modelo 1, 1A, 55 e 65)",
      "C170": "Itens da Nota Fiscal",
      "C190": "Registro Analítico da Nota Fiscal",
      // Add more register types as needed
    };

    return registerTypes[code] || code;
  };

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
                      <Badge className="bg-fiscal-blue">
                        {cell} - {getRegisterTypeDescription(cell)}
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
