
// Mapeamento dos tipos de registros com seus cabeçalhos
export interface RegistroMapeamento {
  codigo: string;
  descricao: string;
  cabecalho: string[];
}

// Lista de mapeamentos de registros com seus cabeçalhos
export const registrosMapeamento: RegistroMapeamento[] = [
  {
    codigo: "0000",
    descricao: "Abertura do Arquivo Digital e Identificação da entidade",
    cabecalho: ["REG", "COD_VER", "COD_FIN", "DT_INI", "DT_FIN", "NOME", "CNPJ", "CPF", "UF", "IE", "COD_MUN", "IM", "SUFRAMA", "IND_PERFIL", "IND_ATIV"]
  },
  {
    codigo: "0005",
    descricao: "Dados Complementares da entidade",
    cabecalho: ["REG", "FANTASIA", "CEP", "END", "NUM", "COMPL", "BAIRRO", "FONE", "FAX", "EMAIL"]
  },
  {
    codigo: "0100",
    descricao: "Dados do Contabilista",
    cabecalho: ["REG", "NOME", "CPF", "CRC", "CNPJ", "CEP", "END", "NUM", "COMPL", "BAIRRO", "FONE", "FAX", "EMAIL", "COD_MUN"]
  },
  {
    codigo: "0150",
    descricao: "Tabela de Cadastro do Participante",
    cabecalho: ["REG", "COD_PART", "NOME", "COD_PAIS", "CNPJ", "CPF", "IE", "COD_MUN", "SUFRAMA", "END", "NUM", "COMPL", "BAIRRO"]
  },
  {
    codigo: "0190",
    descricao: "Identificação das Unidades de Medida",
    cabecalho: ["REG", "UNID", "DESCR"]
  },
  {
    codigo: "0200",
    descricao: "Tabela de Identificação do Item",
    cabecalho: ["REG", "COD_ITEM", "DESCR_ITEM", "COD_BARRA", "COD_ANT_ITEM", "UNID_INV", "TIPO_ITEM", "COD_NCM", "EX_IPI", "COD_GEN", "COD_LST", "ALIQ_ICMS", "CEST"]
  },
  {
    codigo: "0400",
    descricao: "Tabela de Natureza da Operação/Prestação",
    cabecalho: ["REG", "COD_NAT", "DESCR_NAT"]
  },
  {
    codigo: "0450",
    descricao: "Tabela de Informação Complementar do documento fiscal",
    cabecalho: ["REG", "COD_INF", "TXT"]
  },
  {
    codigo: "B001",
    descricao: "Abertura do Bloco B",
    cabecalho: ["REG", "IND_DAD"]
  },
  {
    codigo: "C110",
    descricao: "Informação Complementar da Nota Fiscal",
    cabecalho: ["REG", "COD_INF", "TXT_COMPL"]
  },
  {
    codigo: "C170",
    descricao: "Itens do Documento Fiscal",
    cabecalho: ["REG", "NUM_ITEM", "COD_ITEM", "DESCR_COMPL", "QTD", "UNID", "VL_ITEM", "VL_DESC", "IND_MOV", "CST_ICMS", "CFOP", "COD_NAT", "VL_BC_ICMS", "ALIQ_ICMS", "VL_ICMS", "VL_BC_ICMS_ST", "ALIQ_ST", "VL_ICMS_ST", "IND_APUR", "CST_IPI", "COD_ENQ", "VL_BC_IPI", "ALIQ_IPI", "VL_IPI", "CST_PIS", "VL_BC_PIS", "ALIQ_PIS", "QUANT_BC_PIS", "ALIQ_PIS_QUANT", "VL_PIS", "CST_COFINS", "VL_BC_COFINS", "ALIQ_COFINS", "QUANT_BC_COFINS", "ALIQ_COFINS_QUANT", "VL_COFINS", "COD_CTA", "VL_ABAT_NT"]
  },
  {
    codigo: "C190",
    descricao: "Registro Analítico do Documento",
    cabecalho: ["REG", "CST_ICMS", "CFOP", "ALIQ_ICMS", "VL_OPR", "VL_BC_ICMS", "VL_ICMS", "VL_BC_ICMS_ST", "VL_ICMS_ST", "VL_RED_BC", "VL_IPI", "COD_OBS"]
  },
  {
    codigo: "C850",
    descricao: "Registro Analítico do CF-e-SAT",
    cabecalho: ["REG", "CST_ICMS", "CFOP", "ALIQ_ICMS", "VL_OPR", "VL_BC_ICMS", "VL_ICMS", "COD_OBS"]
  },
  {
    codigo: "D001",
    descricao: "Abertura do Bloco D",
    cabecalho: ["REG", "IND_MOV"]
  },
  {
    codigo: "E110",
    descricao: "Apuração do ICMS - Operações Próprias",
    cabecalho: ["REG", "VL_TOT_DEBITOS", "VL_AJ_DEBITOS", "VL_TOT_AJ_DEBITOS", "VL_ESTORNOS_CRED", "VL_TOT_CREDITOS", "VL_AJ_CREDITOS", "VL_TOT_AJ_CREDITOS", "VL_ESTORNOS_DEB", "VL_SLD_CREDOR_ANT", "VL_SLD_APURADO", "VL_TOT_DED", "VL_ICMS_RECOLHER", "VL_SLD_CREDOR_TRANSPORTAR", "DEB_ESP"]
  },
  {
    codigo: "G001",
    descricao: "Abertura do Bloco G",
    cabecalho: ["REG", "IND_MOV"]
  },
  {
    codigo: "H005",
    descricao: "Totais do Inventário",
    cabecalho: ["REG", "DT_INV", "VL_INV", "MOT_INV"]
  },
  {
    codigo: "K001",
    descricao: "Abertura do Bloco K",
    cabecalho: ["REG", "IND_MOV"]
  },
  {
    codigo: "1010",
    descricao: "Obrigatoriedade de registros do Bloco 1",
    cabecalho: ["REG", "IND_EXP", "IND_CCRF", "IND_COMB", "IND_USINA", "IND_VA", "IND_EE", "IND_CART", "IND_FORM", "IND_AER", "IND_GIAF1", "IND_GIAF3", "IND_GIAF4", "IND_REST_RESSARC_COMPL_ICMS"]
  }
];

// Função para obter o mapeamento de um registro pelo código
export const obterMapeamentoPorCodigo = (codigo: string): RegistroMapeamento | undefined => {
  // Remover zeros à esquerda para comparação (ex: "0000" -> "0")
  const codigoNormalizado = codigo.replace(/^0+/, '');
  
  return registrosMapeamento.find(registro => {
    const codigoRegistroNormalizado = registro.codigo.replace(/^0+/, '');
    return codigoRegistroNormalizado === codigoNormalizado;
  });
};

// Função para obter o ícone correspondente a um código de registro
export const obterIconePorCodigo = (codigo: string): string => {
  // Remover zeros à esquerda para comparação
  const codigoNormalizado = codigo.replace(/^0+/, '');
  
  // Lista de códigos que têm ícones disponíveis na biblioteca lucide-react
  const iconesDisponiveis = [
    "0", "5", "100", "150", "190", "200", "400", "450",
    "B001", "C110", "C170", "C190", "C850", "D001", "E110",
    "G001", "H005", "K001", "1010"
  ];
  
  // Verificar se existe um ícone para o código
  if (iconesDisponiveis.includes(codigoNormalizado) || 
      iconesDisponiveis.includes(codigo)) {
    return codigoNormalizado || codigo;
  }
  
  // Retornar ícone padrão se não encontrar um específico
  return "file-text";
};
