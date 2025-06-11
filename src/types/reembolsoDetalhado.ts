// Para o detalhe/edição:
export interface LancamentoDetalhado {
    Id: number;
    ReembolsoId: number;
    Beneficiario: string;
    GrauParentesco: number;
    DataPagamento: string;
    ValorPago: number;
    ValorRestituir: number;
}

export interface ReembolsoDetalhado {
    Id: number;
    NumeroRegistro: string;
    MatriculaEmpregado?: string;
    TipoSolicitacao: number;
    Periodo: string;
    Status: string;
    DataEnvio: string;
    ValorSolicitado: number;
    ValorReembolsado?: number;
    MotivoReprovacao?: string | null;
    CaminhoDocumentos?: string;
    Empregado?: {
        Id: number;
        Matricula: string;
        Nome: string;
        Diretoria: string;
        Superintendencia: string;
        Cargo: string;
        Ativo: boolean;
        ValorMaximoMensal: number;
    };
    Lancamentos: LancamentoDetalhado[];
    // outros campos detalhados
}
