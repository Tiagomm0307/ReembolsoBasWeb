export interface Reembolso {
    Id: number;
    NumeroRegistro: number;
    Periodo: string;
    ValorSolicitado: number;
    Status: string;
    DataEnvio: string;
    // outros campos que você tiver na API
}