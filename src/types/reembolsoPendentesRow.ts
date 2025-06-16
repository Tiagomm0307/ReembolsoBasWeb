
export interface ReembolsoPendentesRow {
    Id: number;
    NumeroRegistro: string;
    TipoSolicitacao: number;
    Status: string;
    DataEnvio: string; // ISO string
    ValorSolicitado: number;
    Solicitante: string;
    acoes: boolean;
}