// src/components/CustomModal.tsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Fade,
    Backdrop,
    Box,
    CircularProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Header com gradiente (reutilizado)
const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    background: 'linear-gradient(135deg,rgb(2, 24, 46) 0%, #1565c0 100%)',
    color: 'white',
    padding: theme.spacing(3),
    position: 'relative',
    '& .MuiTypography-root': {
        fontWeight: 600,
    },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: 'white',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
}));

interface CustomModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    loading?: boolean;
    children?: React.ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const CustomModal: React.FC<CustomModalProps> = ({
    open,
    onClose,
    title,
    subtitle,
    icon,
    loading = false,
    children,
    maxWidth = 'sm',
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    },
                },
                paper: {
                    sx: {
                        borderRadius: 2, // 4 * 8px = 32px — borda bem arredondada
                        overflow: 'hidden', // ajuda a manter o header com gradiente "cortado" certinho
                    }
                }
            }}
        >
            <Fade in={open}>
                <div>
                    <StyledDialogTitle>
                        <Box display="flex" alignItems="center" gap={2}>
                            {icon && <Box>{icon}</Box>}
                            <Box>
                                {title && (
                                    <Typography variant="h5" component="h2" fontWeight="bold">
                                        {title}
                                    </Typography>
                                )}
                                {subtitle && (
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                    >
                                        {subtitle}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        <StyledIconButton onClick={onClose} disabled={loading}>
                            <CloseIcon />
                        </StyledIconButton>
                    </StyledDialogTitle>

                    <DialogContent sx={{ p: 4 }}>
                        {loading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                                <CircularProgress />
                            </Box>
                        ) : (
                            children
                        )}
                    </DialogContent>
                </div>
            </Fade>
        </Dialog>
    );
};

export default CustomModal;
