import { Lancamento } from "./lançamentos";

export interface ReembolsoPendentes {
    Id: number;
    NumeroRegistro: string;
    MatriculaEmpregado: string;
    TipoSolicitacao: number;
    Periodo: string; // ISO string
    Status: string;
    DataEnvio: string; // ISO string
    MotivoReprovacao: string | null;
    CaminhoDocumentos: string;
    Solicitante: string;
    ValorSolicitado: number;
    ValorReembolsado: number;
    Lancamentos: Lancamento;
    acoes: boolean;
}