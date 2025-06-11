// pages/LoginPage.tsx
import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Button,
    Typography,
    Container,
    Alert,
    Divider,
    Link,
} from '@mui/material';
import {
    Person as PersonIcon,
    Business as BusinessIcon,
    SupervisorAccount as SupervisorIcon,
    AdminPanelSettings as AdminIcon,
    Microsoft as MicrosoftIcon,
} from '@mui/icons-material';
import LoginModal from './components/LoginModal';

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        userType: 'empregado' | 'rh' | 'gerente_rh' | 'admin';
    }>({
        isOpen: false,
        userType: 'empregado'
    });

    const openModal = (userType: 'empregado' | 'rh' | 'gerente_rh' | 'admin') => {
        setModalState({ isOpen: true, userType });
    };

    const closeModal = () => {
        setModalState({ ...modalState, isOpen: false });
    };

    const handleLogin = async (role: string) => {
        setLoading(true);
        setError('');

        try {
            // Redirecionar baseado no perfil
            switch (role) {
                case 'empregado':
                    openModal('empregado')
                    break;
                case 'rh':
                    openModal('rh');
                    break;
                case 'gerente_rh':
                    openModal('gerente_rh');
                    break;
                case 'admin':
                    openModal('admin');
                    break;
                default:
                    openModal('admin');
            }

        } catch {
            setError('Erro interno. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const loginOptions = [
        {
            role: 'empregado',
            label: 'Entrar como Empregado',
            icon: <PersonIcon />,
            color: '#1976d2',

        },
        {
            role: 'rh',
            label: 'Entrar como RH',
            icon: <BusinessIcon />,
            color: '#2e7d32',
        },
        {
            role: 'gerente_rh',
            label: 'Entrar como Gerente RH',
            icon: <SupervisorIcon />,
            color: '#7b1fa2',
        },
        {
            role: 'admin',
            label: 'Entrar como Admin',
            icon: <AdminIcon />,
            color: '#424242',
        },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                minWidth: '100vw',
                background: 'linear-gradient(135deg, rgb(203, 220, 226) 0%, rgb(176, 181, 189) 50%, rgb(220, 221, 223) 100%)', // tons cinza claro Petrobras
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container maxWidth="sm">
                <Card
                    sx={{
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(8px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.85)', // branco Petrobras com leve transparência
                        border: '2px solid rgba(0, 94, 70, 0.3)', // verde Petrobras
                    }}
                >
                    <CardContent sx={{ p: 5 }}>
                        {/* Logo e Título */}
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <i
                                style={{ color: 'rgb(37 99 235)', margin: "1rem 0rem" }} // verde Petrobras
                                className="fas fa-shield-alt fa-4x"
                            ></i>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                BAS Assist Saúde
                            </Typography>
                            <Typography variant="subtitle1">
                                Acesse sua conta
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Botões de Login */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
                            {loginOptions.map((option) => (
                                <Button
                                    key={option.role}
                                    variant="contained"
                                    size="large"
                                    startIcon={option.icon}
                                    onClick={() => handleLogin(option.role)}
                                    disabled={loading}
                                    sx={{
                                        backgroundColor: option.color ?? '#005E46', // verde Petrobras como padrão
                                        '&:hover': {
                                            backgroundColor: option.color ?? '#004D3A', // tom mais escuro no hover
                                            opacity: 0.9,
                                        },
                                        py: 1.5,
                                    }}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </Box>

                        {/* Divider e SSO */}
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <Divider color="text.secondary">
                                Ou use sua conta corporativa
                            </Divider>
                        </Box>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<MicrosoftIcon />}
                            fullWidth
                            disabled={loading}
                            sx={{
                                mb: 2,
                                color: '#0078D4', // azul Microsoft
                                borderColor: '#0078D4',
                                backgroundColor: 'rgb(247, 247, 247)',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: 'rgb(213, 218, 223)',
                                    borderColor: '#0078D4',
                                },
                            }}
                        >
                            Entrar com Azure AD (SSO)
                        </Button>

                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Link href="/recuperar-senha" underline="hover" color="info.main" variant="body1">
                                Esqueceu a senha?
                            </Link>
                        </Box>
                    </CardContent>
                </Card>
                {/* Modal de Login */}
                <LoginModal
                    open={modalState.isOpen}
                    onClose={closeModal}
                    userType={modalState.userType}
                />
            </Container>
        </Box>

    );
};

export default LoginPage;