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
    id: number;
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
        // 1. Faz o login
        const response = await apiClient.post<LoginResponse>('/Auth/login', data);
        const loginData = response.data;

        // 2. Salva o token imediatamente
        sessionStorage.setItem('token', loginData.token);

        // 3. Agora pode chamar os outros endpoints que precisam do token
        const empregadoResp = await apiClient.get<EmpregadoResponse>(`/Empregados/${loginData.id}`);
        const empregado = empregadoResp.data;

        return {
            ...loginData,
            diretoria: empregado.Diretoria,
            superintendencia: empregado.Superintendencia,
        };
    },
};

