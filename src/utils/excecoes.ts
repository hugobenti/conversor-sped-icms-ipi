/* ---------- Tipo base ---------- */

export type ContextoExcecao = 
  | { tipo: 'linha'; texto: string }
  | { tipo: 'campo'; registro: string; colunaIndex: number; valorAtual: string };

export type Excecao = {
  id: string;
  nome: string;
  descricao?: string;
  aplicaEm: 'linha' | 'campo';
  registros?: string[]; // se aplicaEm === 'campo', define em quais registros atua
  aplicar: (contexto: ContextoExcecao) => string;
};

/* ---------- Exceção que atua em LINHA ---------- */

const excecaoSubstituirBarraComEspacos: Excecao = {
  id: 'substituir-barra-espacos',
  nome: 'Substituir " | " por " "',
  descricao: 'Remove espaços antes e depois de barras verticais.',
  aplicaEm: 'linha',
  aplicar: (contexto) => {
    if (contexto.tipo === 'linha') {
      return contexto.texto.replace(/ \| /g, ' ');
    }
    return contexto.valorAtual ?? '';
  }
};

/* ---------- Exceção que atua em CAMPO (vários registros) ---------- */

const excecaoLimpar11111111EmVariosRegistros: Excecao = {
  id: 'limpar-11111111-em-varios-registros',
  nome: 'Limpar "11111111" em vários registros',
  descricao: 'Limpa "11111111" em campo 2 dos registros 0100 e 0110.',
  aplicaEm: 'campo',
  registros: ['0100', '0110'],
  aplicar: (contexto) => {
    if (contexto.tipo === 'campo') {
      if (contexto.colunaIndex === 1 && contexto.valorAtual === '11111111' && 
          (contexto.registro && ['0100', '0110'].includes(contexto.registro))) {
        return '';
      }
      return contexto.valorAtual;
    }
    return contexto.texto ?? '';
  }
};

/* ---------- Lista única de exceções ---------- */

export const listaExcecoes: Excecao[] = [
  excecaoSubstituirBarraComEspacos,
  // excecaoLimpar11111111EmVariosRegistros,
  // outras exceções aqui
];
