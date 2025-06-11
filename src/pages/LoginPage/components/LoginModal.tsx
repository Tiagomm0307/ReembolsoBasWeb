
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    IconButton,
    Typography,
    Box,
    InputAdornment,
    Checkbox,
    FormControlLabel,
    Link,
    CircularProgress,
    Divider,
    Alert,
    Fade,
    Backdrop
} from '@mui/material';
import {
    Close as CloseIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    Person as PersonIcon,
    Business as BusinessIcon,
    SupervisorAccount as SupervisorIcon,
    AdminPanelSettings as AdminIcon,

} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { authApi } from "../../../api/authApi";
import { authService } from "../../../service/authService";
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

// Header customizado com gradiente
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

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
    userType: 'empregado' | 'rh' | 'gerente_rh' | 'admin';
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, userType }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth(); // Importante: pega função login do contexto


    const userTypeConfig = {
        empregado: {
            title: 'Login Empregado',
            color: '#1976d2',
            icon: <PersonIcon />,
        },
        rh: {
            title: 'Login RH',
            color: '#4caf50',
            icon: <BusinessIcon />,
        },
        gerente_rh: {
            title: 'Login Gerente RH',
            color: '#9c27b0',
            icon: <SupervisorIcon />,
        },
        admin: {
            title: 'Login Admin',
            color: '#616161',
            icon: <AdminIcon />,
        },
    };

    const config = userTypeConfig[userType];

    const handleInputChange = (field: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (field === 'rememberMe') {
            setFormData(prev => ({
                ...prev,
                [field]: event.target.checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: event.target.value
            }));
        }
        setError(''); // Limpar erro quando usuário digita
    };


    const handleSubmit = async () => {
        if (!formData.email || !formData.password) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Chamada real para API
            const response = await authApi.login({
                Email: formData.email,
                Senha: formData.password,
            });

            // Salvar dados da sessão
            authService.saveSession(response);

            // Atualizar contexto com os dados do usuário
            login({
                role: response.perfil,
                nome: response.nome,
                matricula: response.matricula,
            });

            // Verifica se perfil do response bate com o tipo de tela (userType)
            if (response.perfil !== userType) {
                setError('Perfil inválido para este tipo de login');
                authService.clearSession();
                return;
            }

            // Redirecionar baseado no perfil
            switch (response.perfil) {
                case 'empregado':
                    navigate('/empregado');
                    break;
                case 'rh':
                    navigate('/rh');
                    break;
                case 'gerente_rh':
                    navigate('/gerente_rh');
                    break;
                case 'admin':
                    navigate('/admin');
                    break;
                default:
                    break;
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro no login');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    const handleClose = () => {
        setFormData({ email: '', password: '', rememberMe: false });
        setShowPassword(false);
        setError('');
        setLoading(false);
        onClose();
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !loading) {
            handleSubmit();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)'
                    }
                }
            }}
        >
            <Fade in={open}>
                <div>
                    <StyledDialogTitle>
                        <Box display="flex" alignItems="center" gap={2}>
                            <i
                                className="fas fa-shield-alt fa-2x"
                            ></i>
                            <Box>
                                <Typography variant="h5" component="h2" fontWeight="bold">
                                    BAS Assist Saúde
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                    {config.title}
                                </Typography>
                            </Box>
                        </Box>
                        <StyledIconButton onClick={handleClose} disabled={loading}>
                            <CloseIcon />
                        </StyledIconButton>
                    </StyledDialogTitle>

                    <DialogContent sx={{ p: 4 }}>
                        <Box sx={{ mt: 2 }}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" fontWeight="medium" gutterBottom>
                                    Email
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="email"
                                    placeholder="seu.email@empresa.com"
                                    value={formData.email}
                                    onChange={handleInputChange('email')}
                                    onKeyDown={handleKeyPress}
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mt: 1 }}
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" fontWeight="medium" gutterBottom>
                                    Senha
                                </Typography>
                                <TextField
                                    fullWidth
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleInputChange('password')}
                                    onKeyDown={handleKeyPress}
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    disabled={loading}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mt: 1 }}
                                />
                            </Box>

                            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.rememberMe}
                                            onChange={handleInputChange('rememberMe')}
                                            disabled={loading}
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" color="textSecondary">
                                            Lembrar-me
                                        </Typography>
                                    }
                                />
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={() => console.log('Esqueceu senha')}
                                    disabled={loading}
                                    sx={{ textDecoration: 'none', fontWeight: 500 }}
                                >
                                    Esqueceu a senha?
                                </Link>
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleSubmit}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : config.icon}
                                sx={{
                                    backgroundColor: config.color,
                                    '&:hover': {
                                        backgroundColor: config.color,
                                        filter: 'brightness(0.9)',
                                    },
                                    mb: 3
                                }}
                            >
                                {loading ? 'Entrando...' : 'Entrar'}
                            </Button>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="caption" color="textSecondary" align="center" display="block">
                                Ao fazer login, você concorda com nossos{' '}
                                <Link component="button" variant="caption" sx={{ textDecoration: 'none' }}>
                                    Termos de Uso
                                </Link>{' '}
                                e{' '}
                                <Link component="button" variant="caption" sx={{ textDecoration: 'none' }}>
                                    Política de Privacidade
                                </Link>
                            </Typography>
                        </Box>
                    </DialogContent>
                </div>
            </Fade>
        </Dialog>
    );
};

export default LoginModal;