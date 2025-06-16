// src/api/reembolsoApi.ts

import { Reembolso } from 'types/reembolso';
import apiClient from './client';
import { ReembolsoDetalhado } from 'types/reembolsoDetalhado';
import { ReembolsoPendentes } from 'types/reembolsoPendentes';

const endpoint = "/Reembolsos"

const listarById = async (id: number): Promise<ReembolsoDetalhado> => {
    const response = await apiClient.get<ReembolsoDetalhado>(`${endpoint}/meus?id=${id}`);
    return response.data;
};

const listar = async (): Promise<Reembolso[]> => {
    const response = await apiClient.get<Reembolso[]>(`${endpoint}/meus`);
    return response.data;
};

const listarTodos = async (): Promise<ReembolsoPendentes[]> => {
    const response = await apiClient.get<ReembolsoPendentes[]>(`${endpoint}/todos`);
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

/**
 * Atualiza uma solicitação de reembolso existente.
 * @param id - ID do reembolso a ser atualizado.
 * @param formData - FormData com os dados da solicitação.
 * @returns true se a atualização for bem-sucedida.
 */
const atualizarReembolso = async (id: number, formData: FormData): Promise<boolean> => {
    await apiClient.put(`${endpoint}/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return true;
};

export const reembolsoApi = {
    listar,
    listarTodos,
    listarById,
    editar,
    excluir,
    solicitarReembolso,
    atualizarReembolso
};
