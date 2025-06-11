// src/api/reembolsoApi.ts

import apiClient from './client';

export interface Reembolso {
    Id: number;
    NumeroRegistro: number;
    Periodo: string;
    ValorSolicitado: number;
    Status: string;
    DataEnvio: string;
    // outros campos que você tiver na API
}

const endpoint = "/Reembolsos"

const listar = async (): Promise<Reembolso[]> => {
    const response = await apiClient.get<Reembolso[]>(`${endpoint}/meus`);
    return response.data;
};

const editar = async (reembolso: Partial<Reembolso>): Promise<void> => {
    await apiClient.put(endpoint, reembolso);
};

const excluir = async (id: number): Promise<void> => {
    await apiClient.delete(`${endpoint}/${id}`, {
        data: { id }, // se sua API DELETE espera body com { id }
    });
};

/**
 * Envia a solicitação de reembolso para a API.
 * @param formData - Objeto FormData com os dados da solicitação.
 * @returns true se o envio for bem-sucedido.
 */
const solicitarReembolso = async (formData: FormData): Promise<boolean> => {
    await apiClient.post(`${endpoint}/solicitar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return true;
};

export const reembolsoApi = {
    listar,
    editar,
    excluir,
    solicitarReembolso,
};
