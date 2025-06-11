// src/contexts/SnackbarContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface SnackbarContextProps {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showInfo: (message: string) => void;
    showWarning: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error' | 'info' | 'warning'>('success');

    const showSnackbar = (msg: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setMessage(msg);
        setType(severity);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const value: SnackbarContextProps = {
        showSuccess: (msg) => showSnackbar(msg, 'success'),
        showError: (msg) => showSnackbar(msg, 'error'),
        showInfo: (msg) => showSnackbar(msg, 'info'),
        showWarning: (msg) => showSnackbar(msg, 'warning'),
    };

    return (
        <SnackbarContext.Provider value={value}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSnackbar = (): SnackbarContextProps => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar deve ser usado dentro do SnackbarProvider');
    }
    return context;
};
