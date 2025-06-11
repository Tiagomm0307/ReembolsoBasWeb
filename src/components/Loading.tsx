// src/components/Loading.tsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingProps {
    message?: string;
    size?: number;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Carregando...', size = 60 }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            minHeight="200px"
        >
            <CircularProgress size={size} />
            <Typography variant="body1" mt={2}>
                {message}
            </Typography>
        </Box>
    );
};

export default Loading;
