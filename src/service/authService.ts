interface UserSession {
    token: string;
    perfil: string;
    matricula: string;
    nome: string;
    diretoria: string;
    superintendencia: string;
}

const TOKEN_KEY = 'token';
const PERFIL_KEY = 'perfil';
const MATRICULA_KEY = 'matricula';
const NOME_KEY = 'nome';
const DIRETORIA_KEY = 'diretoria';
const SUPERINTENDENCIA_KEY = 'superintendencia';

export const authService = {
    saveSession: (session: UserSession) => {
        sessionStorage.setItem(TOKEN_KEY, session.token);
        sessionStorage.setItem(PERFIL_KEY, session.perfil);
        sessionStorage.setItem(MATRICULA_KEY, session.matricula);
        sessionStorage.setItem(NOME_KEY, session.nome);
        sessionStorage.setItem(DIRETORIA_KEY, session.diretoria);
        sessionStorage.setItem(SUPERINTENDENCIA_KEY, session.superintendencia);
    },

    clearSession: () => {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(PERFIL_KEY);
        sessionStorage.removeItem(MATRICULA_KEY);
        sessionStorage.removeItem(NOME_KEY);
        sessionStorage.removeItem(DIRETORIA_KEY);
        sessionStorage.removeItem(SUPERINTENDENCIA_KEY);
    },

    getToken: (): string | null => sessionStorage.getItem(TOKEN_KEY),
    getPerfil: (): string | null => sessionStorage.getItem(PERFIL_KEY),
    getMatricula: (): string | null => sessionStorage.getItem(MATRICULA_KEY),
    getNome: (): string | null => sessionStorage.getItem(NOME_KEY),
    getDiretoria: (): string | null => sessionStorage.getItem(DIRETORIA_KEY),
    getSuperintendencia: (): string | null => sessionStorage.getItem(SUPERINTENDENCIA_KEY),
};
