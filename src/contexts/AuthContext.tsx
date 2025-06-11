// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from 'service/authService';

interface User {
    role: string;
    nome: string;
    matricula: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = authService.getToken();
        const perfil = authService.getPerfil();
        const nome = authService.getNome();
        const matricula = authService.getMatricula();

        if (token && perfil) {
            setUser({
                role: perfil,
                nome: nome ?? '',
                matricula: matricula ?? '',
            });
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        authService.clearSession();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
