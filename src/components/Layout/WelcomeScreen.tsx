import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Divider,
    Stack,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    WavingHand,
} from '@mui/icons-material';
import type { ReactNode } from 'react';

// Interfaces para tipagem das propriedades dinâmicas
export interface WelcomeCard {
    icon: ReactNode;
    title: string;
    value: string | number;
    subtitle: string;
    color?: string;
}

export interface QuickAction {
    icon: ReactNode;
    title: string;
    subtitle: string;
    onClick: () => void;
    color?: string;
}

export interface MotivationalMessage {
    title: string;
    description: string;
    emoji?: string;
    gradient?: string;
}

export interface WelcomeScreenProps {
    // Dados do usuário
    userName?: string | null;
    userRole?: string | null;

    // Configuração de cards informativos
    cards: WelcomeCard[];

    // Ações rápidas
    quickActions: QuickAction[];

    // Mensagem motivacional (opcional)
    motivationalMessage?: MotivationalMessage;

    // Configurações de layout
    systemName?: string;
    showRoleChip?: boolean;

    // Conteúdo adicional
    children?: ReactNode;

    // Customização de cores
    primaryColor?: string;
    gradientColors?: [string, string];
}

export const WelcomeScreen = ({
    userName = "Usuário",
    userRole = "Usuário",
    cards = [],
    quickActions = [],
    motivationalMessage,
    systemName = "Sistema",
    showRoleChip = true,
    children,
    primaryColor = 'rgb(30 41 59)',
    gradientColors = ['rgb(30 41 59)', '#006064'],
}: WelcomeScreenProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const defaultMotivationalMessage = {
        title: "Bem-vindo ao nosso sistema",
        description: "Estamos aqui para facilitar o seu trabalho e tornar sua experiência mais eficiente.",
        emoji: "💙",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    };

    const finalMotivationalMessage = motivationalMessage || defaultMotivationalMessage;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                width: '100%',
                minHeight: '100%',
                py: 2,
            }}
        >
            {/* Header de Boas-vindas */}
            <Box
                sx={{
                    textAlign: 'center',
                    mb: 4,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <WavingHand
                        sx={{
                            fontSize: { xs: '2rem', md: '3rem' },
                            color: '#FF9800',
                            animation: 'wave 2s ease-in-out infinite',
                            '@keyframes wave': {
                                '0%, 100%': { transform: 'rotate(0deg)' },
                                '25%': { transform: 'rotate(20deg)' },
                                '75%': { transform: 'rotate(-20deg)' },
                            },
                        }}
                    />
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 600,
                            color: primaryColor,
                            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                        }}
                    >
                        Olá, {userName}!
                    </Typography>
                </Box>

                <Typography
                    variant="h6"
                    sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '1rem', md: '1.25rem' },
                        mb: showRoleChip ? 1 : 0,
                    }}
                >
                    Bem-vindo(a) ao {systemName}
                </Typography>

                {showRoleChip && (
                    <Chip
                        label={userRole}
                        color="primary"
                        sx={{
                            bgcolor: primaryColor,
                            color: 'white',
                            fontWeight: 500,
                        }}
                    />
                )}
            </Box>

            {/* Cards de Informações */}
            {cards.length > 0 && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {cards.map((card, index) => (
                        <Grid key={index} size={isMobile ? 12 : 12 / Math.min(cards.length, 4)}>
                            <Card
                                elevation={3}
                                sx={{
                                    height: '100%',
                                    borderRadius: '16px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-6px)',
                                        boxShadow: theme.shadows[6],
                                    },
                                    backgroundColor: theme.palette.background.paper,
                                }}
                            >
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        py: 4,
                                    }}
                                >
                                    <Box sx={{ mb: 2 }}>
                                        {card.icon}
                                    </Box>
                                    <Typography variant="h6" gutterBottom>
                                        {card.title}
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            color: card.color || 'primary.main',
                                            fontWeight: 'bold',
                                            mb: 0.5
                                        }}
                                    >
                                        {card.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {card.subtitle}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Seção de Ações Rápidas */}
            {quickActions.length > 0 && (
                <Card elevation={1} sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                color: primaryColor,
                                fontWeight: 600
                            }}
                        >
                            🚀 Ações Rápidas
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            sx={{
                                // Se há mais de 2 ações, usar grid em telas maiores
                                ...(quickActions.length > 2 && {
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        sm: 'repeat(2, 1fr)',
                                        md: `repeat(${Math.min(quickActions.length, 3)}, 1fr)`
                                    },
                                    gap: 2,
                                })
                            }}
                        >
                            {quickActions.map((action, index) => (
                                <Card
                                    key={index}
                                    variant="outlined"
                                    onClick={action.onClick}
                                    sx={{
                                        flex: quickActions.length <= 2 ? 1 : 'unset',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            bgcolor: '#f5f5f5',
                                            borderColor: action.color || primaryColor,
                                        },
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Box sx={{ color: action.color || primaryColor }}>
                                                {action.icon}
                                            </Box>
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight="bold"
                                                color={action.color || primaryColor}
                                            >
                                                {action.title}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary">
                                            {action.subtitle}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>
            )}

            {/* Mensagem Motivacional */}
            {finalMotivationalMessage && (
                <Card
                    elevation={0}
                    sx={{
                        background: finalMotivationalMessage.gradient ||
                            `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`,
                        color: 'white',
                        textAlign: 'center',
                        mb: children ? 3 : 0,
                    }}
                >
                    <CardContent sx={{ py: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            {finalMotivationalMessage.emoji} {finalMotivationalMessage.title}
                        </Typography>
                        <Typography variant="body1">
                            {finalMotivationalMessage.description}
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* Conteúdo adicional */}
            {children}
        </Box>
    );
};