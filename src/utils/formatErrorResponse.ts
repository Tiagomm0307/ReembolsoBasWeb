// src/utils/formatErrorResponse.ts

type ErrorResponse = {
    errors?: Record<string, string[]>;
    title?: string;
};

export const formatErrorResponse = (error: unknown): string => {
    if (isErrorResponse(error)) {
        const messages = Object.values(error.errors ?? {})
            .flat()
            .filter(Boolean);

        return messages.length > 0
            ? messages.join('\n')
            : error.title || 'Ocorreu um erro desconhecido.';
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'Ocorreu um erro inesperado.';
};

function isErrorResponse(error: unknown): error is ErrorResponse {
    return (
        typeof error === 'object' &&
        error !== null &&
        ('errors' in error || 'title' in error)
    );
}
