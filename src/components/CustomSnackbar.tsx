// src/components/MessageSnackbar.tsx

import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface CustomSnackbarProps {
    open: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    autoHideDuration?: number; // em ms, padrão 4000ms
    onClose: () => void;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
    open,
    type,
    message,
    autoHideDuration = 4000,
    onClose,
}) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert severity={type} onClose={onClose} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomSnackbar;
