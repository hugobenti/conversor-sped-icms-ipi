
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
    cabecalho: [
      "REG",
      "Código da versão do leiaute",
      "Código da finalidade",
      "Data inicial",
      "Data final",
      "Nome empresarial",
      "CNPJ",
      "CPF",
      "UF",
      "Inscrição Estadual",
      "Código do município",
      "Inscrição Municipal",
      "Inscrição na SUFRAMA",
      "Perfil do arquivo fiscal",
      "Tipo de atividade"
    ]
  },
  {
    codigo: "0001",
    descricao: "Abertura do Bloco 0",
    cabecalho: ["REG", "IND_MOV"]
  },
  {
    codigo: "0005",
    descricao: "Dados Complementares da entidade",
    cabecalho: ["REG", "BAIRRO", "CEP", "COMPL", "EMAIL", "END", "FANTASIA", "FAX", "FONE", "NUM"]
  },
  {
    codigo: "0015",
    descricao: "Dados do Contribuinte Substituto",
    cabecalho: ["REG", "IE_ST", "UF_ST"]
  },
  {
    codigo: "0100",
    descricao: "Dados do Contabilista",
    cabecalho: ["REG","IND_MOV","REG","NOME","CPF","CRC","CNPJ","CEP","END","NUM","COMPL","BAIRRO","FONE","FAX","EMAIL","COD_MUN"]
  },
  {
    codigo: "0150",
    descricao: "Tabela de Cadastro do Participante",
    cabecalho: ["REG", "BAIRRO", "CNPJ", "COD_MUN", "COD_PAIS", "COD_PART", "COMPL", "CPF", "END", "IE", "NOME", "NUM", "SUFRAMA"]
  },
  {
    codigo: "0175",
    descricao: "Alteração da Tabela de Cadastro de Participante",
    cabecalho: ["REG", "CONT_ANT", "DT_ALT", "NR_CAMPO"]
  },
  {
    codigo: "0190",
    descricao: "Identificação das Unidades de Medida",
    cabecalho: ["REG", "DESCR", "UNID"]
  },
  {
    codigo: "0200",
    descricao: "Tabela de Identificação do Item",
    cabecalho: ["REG", "COD_ITEM", "DESCR_ITEM", "COD_BARRA", "COD_ANT_ITEM", "UNID_INV", "TIPO_ITEM", "COD_NCM", "EX_IPI", "COD_GEN", "COD_LST", "ALIQ_ICMS", "CEST"]
  },
  {
    codigo: "0205",
    descricao: "Alteração do Item",
    cabecalho: ["REG", "COD_ANT_ITEM", "DESCR_ANT_ITEM", "DT_FIM", "DT_INI"]
  },
  {
    codigo: "0206",
    descricao: "Código de produto conforme Tabela ANP",
    cabecalho: ["REG", "COD_COMB"]
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
    codigo: "0460",
    descricao: "Tabela de Observações do Lançamento Fiscal",
    cabecalho: ["REG", "COD_OBS", "TXT"]
  },
  {
    codigo: "0500",
    descricao: "Plano de Contas Contábeis",
    cabecalho: ["REG", "COD_CTA", "NOME_CTA", "DT_ALT", "COD_NAT_CC", "IND_CTA"]
  },
  {
    codigo: "0600",
    descricao: "Centro de Custos",
    cabecalho: ["REG", "COD_CCUS", "CCUS", "DT_ALT"]
  },
  {
    codigo: "0990",
    descricao: "Encerramento do Bloco 0",
    cabecalho: ["REG", "QTD_LIN_0"]
  },
  {
    codigo: "B001",
    descricao: "Abertura do Bloco B",
    cabecalho: ["REG", "IND_DAD"]
  },
  {
    codigo: "B020",
    descricao: "Nota Fiscal (código 01), Nota Fiscal de Serviços (código 03), Nota Fiscal de Serviços Avulsa (código 3B)",
    cabecalho: ["REG", "CHV_NFE", "COD_MOD", "COD_MUN_SE", "COD_PART", "COD_SIT", "DT_DOC", "IND_EMIT", "IND_OPER", "NUM_DOC", "SER", "VL_BC_ISS", "VL_CONT", "VL_DED_BC", "VL_ISNT_ISS", "VL_MAT_TER", "VL_SUB"]
  },
  {
    codigo: "B420",
    descricao: "Totalização dos Valores de ISS por Código de Serviço",
    cabecalho: ["REG", "ALIQ_ISS", "COD_SERV", "VL_BC_ISS", "VL_CONT", "VL_ISNT_ISS", "VL_ISS"]
  },
  {
    codigo: "B440",
    descricao: "Totalização dos Valores Retidos",
    cabecalho: ["REG", "COD_PART", "IND_OPER"]
  },
  {
    codigo: "B990",
    descricao: "Encerramento do Bloco B",
    cabecalho: ["REG", "QTD_LIN_B"]
  },
  {
    codigo: "C001",
    descricao: "Abertura do Bloco C",
    cabecalho: ["REG", "IND_MOV"]
  },
  {
    codigo: "C100",
    descricao: "Nota Fiscal (código 01), Nota Fiscal Avulsa (código 1B), Nota Fiscal de Produtor (código 04), NF-e (código 55) e NFC-e (código 65)",
    cabecalho: ["REG", "IND_OPER", "IND_EMIT", "COD_PART", "COD_MOD", "COD_SIT", "SER", "NUM_DOC", "CHV_NFE", "DT_DOC", "DT_E_S", "VL_DOC", "IND_PGTO", "VL_DESC", "VL_ABAT_NT", "VL_MERC", "IND_FRT", "VL_FRT", "VL_SEG", "VL_OUT_DA", "VL_BC_ICMS", "VL_ICMS", "VL_BC_ICMS_ST", "VL_ICMS_ST", "VL_IPI", "VL_PIS", "VL_COFINS"]
  },
  {
    codigo: "C101",
    descricao: "Informação complementar dos documentos fiscais quando das operações interestaduais destinadas a consumidor final não contribuinte EC 87/15",
    cabecalho: ["REG", "VL_FCP_UF_DEST", "VL_ICMS_UF_DEST"]
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
    cabecalho: ["REG", "ALIQ_ICMS", "CFOP", "CST_ICMS", "VL_BC_ICMS", "VL_ICMS", "VL_OPR"]
  },
  {
    codigo: "C500",
    descricao: "Nota Fiscal/Conta de Energia Elétrica (código 06), Nota Fiscal/Conta de fornecimento dágua canalizada (código 29) e Nota Fiscal/Consumo Fornecimento de Gás (código 28)",
    cabecalho: ["REG", "IND_OPER", "IND_EMIT", "COD_PART", "COD_MOD", "COD_SIT", "SER", "SUB", "NUM_DOC", "DT_DOC", "DT_E_S", "VL_DOC", "VL_DESC", "VL_FORN", "VL_SERV_NT", "VL_TERC", "VL_DA", "VL_BC_ICMS", "VL_ICMS", "VL_BC_ICMS_ST", "VL_ICMS_ST", "COD_INF", "VL_PIS", "VL_COFINS", "TP_LIGACAO", "COD_GRUPO_TENSAO"]
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
    codigo: "D100",
    descricao: "Nota Fiscal de Serviço de Transporte (código 07) e Conhecimentos de Transporte Rodoviário de Cargas (código 08), Conhecimento de Transporte de Cargas Avulso (código 8B), Aquaviário de Cargas (código 09), Aéreo (código 10), Ferroviário de Cargas (código 11), Multimodal de Cargas (código 26), Nota Fiscal de Transporte Ferroviário de Cargas (código 27), Conhecimento de Transporte Eletrônico – CT-e (código 57), Bilhete de Passagem Eletrônico - BP-e (código 63) e Conhecimento de Transporte Eletrônico para Outros Serviços - CT-e OS (código 67)",
    cabecalho: ["REG", "IND_OPER", "IND_EMIT", "COD_PART", "COD_MOD", "COD_SIT", "SER", "SUB", "NUM_DOC", "CHV_CTE", "DT_DOC", "DT_A_P", "TP_CT-e", "CHV_CTE_REF", "VL_DOC", "VL_DESC", "IND_FRT", "VL_SERV", "VL_BC_ICMS", "VL_ICMS", "VL_NT", "COD_INF", "COD_CTA", "COD_MUN_ORIG", "COD_MUN_DEST"]
  },
  {
    codigo: "D190",
    descricao: "Registro Analítico dos Documentos de Transporte (Código 07, 08, 8B, 09, 10, 11, 26, 27, 57, 63 e 67)",
    cabecalho: ["REG", "ALIQ_ICMS", "CFOP", "CST_ICMS", "VL_BC_ICMS", "VL_ICMS", "VL_OPR"]
  },
  {
    codigo: "E001",
    descricao: "Abertura do Bloco E",
    cabecalho: ["REG", "IND_MOV"]
  },
  {
    codigo: "E100",
    descricao: "Período da Apuração do ICMS",
    cabecalho: ["REG", "DT_INI", "DT_FIN"]
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
    codigo: "H001",
    descricao: "Abertura do Bloco H",
    cabecalho: ["REG", "IND_MOV"]
  },
  {
    codigo: "H005",
    descricao: "Totais do Inventário",
    cabecalho: ["REG", "DT_INV", "VL_INV", "MOT_INV"]
  },
  {
    codigo: "H010",
    descricao: "Inventário",
    cabecalho: ["REG", "COD_ITEM", "UNID", "QTD", "VL_UNIT", "VL_ITEM", "IND_PROP", "COD_PART", "TXT_COMPL", "COD_CTA", "VL_ITEM_IR"]
  },
  {
    codigo: "K001",
    descricao: "Abertura do Bloco K",
    cabecalho: ["REG", "IND_MOV"]
  },
  {
    codigo: "K100",
    descricao: "Período de Apuração do ICMS/IPI",
    cabecalho: ["REG", "DT_INI", "DT_FIN"]
  },
  {
    codigo: "K200",
    descricao: "Estoque Escriturado",
    cabecalho: ["REG", "DT_EST", "COD_ITEM", "QTD", "IND_EST"]
  },
  {
    codigo: "1001",
    descricao: "Abertura do Bloco 1",
    cabecalho: ["REG", "IND_MOV"]
  },
  {
    codigo: "1010",
    descricao: "Obrigatoriedade de registros do Bloco 1",
    cabecalho: ["REG", "IND_EXP", "IND_CCRF", "IND_COMB", "IND_USINA", "IND_VA", "IND_EE", "IND_CART", "IND_FORM", "IND_AER", "IND_GIAF1", "IND_GIAF3", "IND_GIAF4", "IND_REST_RESSARC_COMPL_ICMS"]
  },
  {
    codigo: "9001",
    descricao: "Abertura do Bloco 9",
    cabecalho: ["REG", "IND_MOV"]
  },
  {
    codigo: "9900",
    descricao: "Registros do Arquivo",
    cabecalho: ["REG", "REG_BLC", "QTD_REG_BLC"]
  },
  {
    codigo: "9990",
    descricao: "Encerramento do Bloco 9",
    cabecalho: ["REG", "QTD_LIN_9"]
  },
  {
    codigo: "9999",
    descricao: "Encerramento do Arquivo Digital",
    cabecalho: ["REG", "QTD_LIN"]
  }
];

// // Function to add or update record mappings
// export const atualizarMapeamentos = (novosMapeamentos: Record<string, string[]>) => {
//   // For each new mapping
//   Object.entries(novosMapeamentos).forEach(([codigo, cabecalho]) => {
//     // Find if the record already exists
//     const indiceExistente = registrosMapeamento.findIndex(reg => reg.codigo === codigo);
    
//     if (indiceExistente >= 0) {
//       // Update existing record
//       registrosMapeamento[indiceExistente].cabecalho = cabecalho;
//     } else {
//       // Add new record
//       registrosMapeamento.push({
//         codigo,
//         descricao: `Registro ${codigo}`,
//         cabecalho
//       });
//     }
//   });
// };

// Update with the new mappings
// atualizarMapeamentos({
//   "C800": ["REG", "UF", "VL_BC_ICMS_ST", "VL_ICMS_ST", "VL_RED_BC", "COD_OBS"],
//   "C850": ["REG", "CST_ICMS", "CFOP", "ALIQ_ICMS", "VL_OPR", "VL_BC_ICMS", "VL_ICMS", "COD_OBS"],
//   "C990": ["REG", "QTD_LIN_C"],
//   "D990": ["REG", "QTD_LIN_D"],
//   "E990": ["REG", "QTD_LIN_E"],
//   "G990": ["REG", "QTD_LIN_G"],
//   "H990": ["REG", "QTD_LIN_H"],
//   "K990": ["REG", "QTD_LIN_K", "IND_MOV"],
//   "1990": ["REG", "QTD_LIN_1", "IND_MOV", "REG_BLC", "QTD_REG_BLC"]
// });

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

