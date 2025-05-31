/* ---------- Tipo base ---------- */

export type ContextoExcecao =
  | { tipo: "linha"; texto: string }
  | {
      tipo: "campo";
      registro: string;
      colunaIndex: number;
      valorAtual: string;
    };

export type Excecao = {
  id: string;
  nome: string;
  descricao?: string;
  aplicaEm: "linha" | "campo";
  registros?: string[]; // se aplicaEm === 'campo', define em quais registros atua
  aplicar: (contexto: ContextoExcecao) => string;
};

/* ---------- Exceção que atua em LINHA ---------- */

const excecaoSubstituirBarraComEspacos: Excecao = {
  id: "substituir-barra-espacos",
  nome: 'Substituir " | " por " "',
  descricao: "Remove espaços antes e depois de barras verticais.",
  aplicaEm: "linha",
  aplicar: (contexto) => {
    if (contexto.tipo === "linha") {
      return contexto.texto.replace(/ \| /g, " ");
    }
    return contexto.valorAtual ?? "";
  },
};

/* ---------- Exceção que atua em CAMPO (vários registros) ---------- */

const excecao1111111registro0200: Excecao = {
  id: "excecao1111111registro0200",
  nome: "Limpa 1111111 do registro 0200",
  descricao: "Limpa  1111111 do 0200",
  aplicaEm: "campo",
  registros: ["0200"],
  aplicar: (contexto) => {
    if (contexto.tipo === "campo") {
      if (contexto.colunaIndex === 12)
        if (contexto.valorAtual === "1111111") return "";
      return contexto.valorAtual;
    }
    return contexto.texto ?? "";
  },
};

const excecaoCfopLinha0400: Excecao = {
  id: "excecaoCfopLinha0400",
  nome: "excecao Cfop Linha 0400",
  descricao: "Limpa  valor Cfop do 0400",
  aplicaEm: "campo",
  registros: ["0400"],
  aplicar: (contexto) => {
    if (contexto.tipo === "campo") {
      if (contexto.colunaIndex === 1) {
        if (contexto.valorAtual === "1405") return "1403";
        if (contexto.valorAtual === "2405") return "2403";
        // if (contexto.valorAtual === "1929") return apagar a linha
      }
      return contexto.valorAtual;
    }
    return contexto.texto ?? "";
  },
};

const excecaoCfopLinhaC170C190: Excecao = {
  id: "excecaoCfopLinhaC170C190",
  nome: "excecao Cfop Linha C170 C190",
  descricao: "Limpa  valor Cfop do C170",
  aplicaEm: "campo",
  registros: ["C170", "C190"],
  aplicar: (contexto) => {
    if (contexto.tipo === "campo") {
      if (
        (contexto.registro === "C170" &&
          (contexto.colunaIndex === 10 || contexto.colunaIndex === 11)) ||
        (contexto.registro === "C190" && contexto.colunaIndex === 2)
      ) {
        if (contexto.valorAtual === "1405") return "1403";
        if (contexto.valorAtual === "2405") return "2403";
        if (contexto.valorAtual === "1929") return "1102";
      }
      return contexto.valorAtual;
    }
    return contexto.texto ?? "";
  },
};

/* ---------- Lista única de exceções ---------- */

export const listaExcecoes: Excecao[] = [
  excecaoSubstituirBarraComEspacos,
  excecao1111111registro0200,
  excecaoCfopLinha0400,
  excecaoCfopLinhaC170C190,
  // excecaoLimpar11111111EmVariosRegistros,
  // outras exceções aqui
];
