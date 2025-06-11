// src/utils/handleApiError.ts
import axios from 'axios';
import { formatErrorResponse } from './formatErrorResponse';

/**
 * Trata um erro de API, exibindo a mensagem apropriada no Snackbar.
 * Evita o uso de "any" e lida com erros Axios e genéricos.
 */
export function handleApiError(err: unknown, showError: (msg: string) => void): void {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        const mensagem = formatErrorResponse(data || err.message);
        showError(mensagem);
    } else if (err instanceof Error) {
        showError(err.message);
    } else {
        showError('Erro inesperado ao processar a solicitação.');
    }
}
