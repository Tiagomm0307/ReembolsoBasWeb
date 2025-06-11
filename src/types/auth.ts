// types/auth.ts
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'empregado' | 'rh' | 'gerente_rh' | 'admin';
    avatar?: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, role: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}