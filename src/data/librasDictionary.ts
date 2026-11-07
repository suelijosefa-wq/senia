export interface LibrasTerm {
  id: string;
  word: string;
  context: string;
  signalDescription: string;
  handshape: string;
  movement: string;
  facialExpression: string;
  spellingDactylology: string[];
}

export const LIBRAS_EXECUTIVE_DICTIONARY: LibrasTerm[] = [
  {
    id: 'lib-1',
    word: 'Secretariado Executivo',
    context: 'Profissão estratégica de assessoria, governança e articulação corporativa.',
    signalDescription: 'Mão em configuração de "S" no peito, seguida do sinal de assessorar/organizar com movimento firme para a frente.',
    handshape: 'Configuração em "S" evoluindo para mãos espalmadas em concha.',
    movement: 'Movimento retilíneo para frente demonstrando apoio e liderança.',
    facialExpression: 'Expressão atenta, neutra e profissional.',
    spellingDactylology: ['S', 'E', 'C', 'R', 'E', 'T', 'A', 'R', 'I', 'A', 'D', 'O'],
  },
  {
    id: 'lib-2',
    word: 'Reunião',
    context: 'Encontro deliberativo de diretoria ou conselho.',
    signalDescription: 'Mãos em configuração aberta ou semi-abertas que se encontram em círculo convergente no espaço neutro.',
    handshape: 'Configuração em "5" com dedos levemente curvados.',
    movement: 'Movimento circular que se fecha ao centro, representando união de pessoas.',
    facialExpression: 'Olhar focado e sereno.',
    spellingDactylology: ['R', 'E', 'U', 'N', 'I', 'Ã', 'O'],
  },
  {
    id: 'lib-3',
    word: 'Ata de Reunião',
    context: 'Documento oficial de registro fiduciário e histórico das decisões.',
    signalDescription: 'Sinal de "escrever" com movimento firme sobre a palma da mão esquerda aberta (representando o livro/papel).',
    handshape: 'Mão passiva em "B" aberta para cima; mão ativa em pinça segurando caneta.',
    movement: 'Movimento linear de registro da esquerda para a direita.',
    facialExpression: 'Concentração analítica.',
    spellingDactylology: ['A', 'T', 'A'],
  },
  {
    id: 'lib-4',
    word: 'Diretoria / Liderança',
    context: 'Corpo decisório C-Level e governança da instituição.',
    signalDescription: 'Mão direita em "L" ou "D" erguida à altura da têmpora com movimento ascendente e firme.',
    handshape: 'Configuração em "D" ou "B" altiva.',
    movement: 'Movimento vertical ascendente.',
    facialExpression: 'Expressão de autoridade e respeito recíproco.',
    spellingDactylology: ['D', 'I', 'R', 'E', 'T', 'O', 'R', 'I', 'A'],
  },
  {
    id: 'lib-5',
    word: 'Inclusão & Acessibilidade',
    context: 'Garantia de participação plena e equitativa de todas as pessoas.',
    signalDescription: 'Mãos abertas que acolhem e integram todas as partes em um círculo de união compartilhada.',
    handshape: 'Mãos em concha aberta que se aproximam e se entrelaçam harmoniosamente.',
    movement: 'Movimento de acolhimento em direção ao centro do peito.',
    facialExpression: 'Sorriso cordial e expressão acolhedora (afeto profissional).',
    spellingDactylology: ['I', 'N', 'C', 'L', 'U', 'S', 'Ã', 'O'],
  },
  {
    id: 'lib-6',
    word: 'Ética e Sigilo',
    context: 'Princípio inegociável de confidencialidade e integridade no secretariado.',
    signalDescription: 'Indicador na frente dos lábios (sinal de sigilo) seguido da mão no coração (integridade moral).',
    handshape: 'Mão em "1" diante da boca, depois mão espalmada sobre o tórax esquerdo.',
    movement: 'Pausa reflexiva de 2 segundos.',
    facialExpression: 'Expressão solene de compromisso e fidelidade.',
    spellingDactylology: ['É', 'T', 'I', 'C', 'A'],
  },
  {
    id: 'lib-7',
    word: 'Oratória & Comunicação',
    context: 'Expressão verbal clara, persuasiva e elegante diante de audiências.',
    signalDescription: 'Mãos próximas à boca que se expandem para a frente em leque, emitindo ideias e diálogo.',
    handshape: 'Configuração em pinça que se abre em "5" expandido.',
    movement: 'Projeção ondulada para a frente.',
    facialExpression: 'Articulação orofacial viva e comunicativa.',
    spellingDactylology: ['O', 'R', 'A', 'T', 'Ó', 'R', 'I', 'A'],
  },
];
