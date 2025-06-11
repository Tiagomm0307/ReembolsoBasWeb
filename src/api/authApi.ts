import apiClient from './client';

interface LoginRequest {
    Email: string;
    Senha: string;
}

interface LoginResponse {
    token: string;
    perfil: string;
    matricula: string;
    nome: string;
    diretoria: string;
    superintendencia: string;
}

interface EmpregadoResponse {
    Id: number;
    Matricula: string;
    Nome: string;
    Diretoria: string;
    Superintendencia: string;
    Cargo: string;
    Ativo: boolean;
    ValorMaximoMensal: number;
}

export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        // Primeira chamada: login
        const response = await apiClient.post<LoginResponse>('/Auth/login', data);
        const loginData = response.data;

        // Segunda chamada: buscar dados do empregado (por enquanto fixo: id = 3)
        const empregadoResp = await apiClient.get<EmpregadoResponse>('/Empregados/4');
        const empregado = empregadoResp.data;

        return {
            ...loginData,
            diretoria: empregado.Diretoria,
            superintendencia: empregado.Superintendencia,
        };
    },
};
