// src/api/empregadosApi.ts
import apiClient from './client';
import { Empregado } from 'types/empregado';

const base = '/Empregados';

export const empregadoApi = {
    /**
     * Lista todos os empregados (resumo).
     */
    listar: async (): Promise<Empregado[]> => {
        const response = await apiClient.get<Empregado[]>(base);
        return response.data;
    },

    /**
     * Retorna os detalhes de um empregado pelo ID.
     */
    getById: async (id: number): Promise<Empregado> => {
        const response = await apiClient.get<Empregado>(`${base}/${id}`);
        return response.data;
    },

    /**
     * Cria um novo empregado.
     * @param novo - objeto com os campos necessários para criação.
     */
    criar: async (novo: Omit<Empregado, 'Id'>): Promise<Empregado> => {
        const response = await apiClient.post<Empregado>(
            base,
            novo,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
    },

    /**
     * Atualiza um empregado existente.
     * @param id - ID do empregado a ser alterado.
     * @param dados - campos a serem atualizados.
     */
    atualizar: async (empregado: Empregado): Promise<void> => {
        const { Id } = empregado;
        if (Id == null) {
            throw new Error('Para editar, é preciso informar empregado.Id');
        }
        await apiClient.put(
            `${base}/${Id}`,
            empregado,
            { headers: { 'Content-Type': 'application/json' } }
        );
    },

    /**
     * Exclui um empregado.
     */
    excluir: async (id: number): Promise<void> => {
        await apiClient.delete(`${base}/${id}`);
    },

    uploadArquivo: async (arquivo: File): Promise<void> => {
        const formData = new FormData();
        formData.append('arquivo', arquivo);

        await apiClient.post(
            `${base}/upload`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        );
    },
};
