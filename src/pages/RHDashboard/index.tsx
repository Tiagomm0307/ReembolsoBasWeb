// pages/HRDashboard.tsx
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import DashboardLayout from '../../components/DashboardLayout';
import HomeIcon from '@mui/icons-material/Home';
import { WelcomeScreen, type QuickAction, type WelcomeCard } from '../../components/Layout/WelcomeScreen';
import { HealthAndSafety, Schedule, Notifications, TrendingUp } from '@mui/icons-material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { CadastroEmpregados } from './pages/CadastroEmpregados';
import { ValidarReembolsos } from './pages/ValidarReembolsos';
import { authService } from 'service/authService';

const RHDashboard: React.FC = () => {
    const navigate = useNavigate();

    const perfil = authService.getPerfil();
    const nome = authService.getNome();

    const menuItems = [
        { label: 'Início', path: '/rh', icon: <HomeIcon /> },
        { label: 'Cadastro Empregados', path: '/rh/cadastro-empregados', icon: <PersonAddIcon /> },
        { label: 'Aprovar/Validar Reembolso', path: '/rh/aprovar-validar-reembolso', icon: <DoneAllIcon /> },
        { label: 'Relatórios', path: '/rh/relatorios', icon: <TrendingUp /> },
        { label: 'Biblioteca de Documentos', path: '/rh/relatorios', icon: <AutoStoriesIcon /> },
    ];

    const healthCards: WelcomeCard[] = [
        {
            icon: <HealthAndSafety sx={{ fontSize: '3rem', color: '#4CAF50' }} />,
            title: 'Benefícios Ativos',
            value: 3,
            subtitle: 'Planos disponíveis',
            color: '#4CAF50'
        },
        {
            icon: <TrendingUp sx={{ fontSize: '3rem', color: '#2196F3' }} />,
            title: 'Reembolsos',
            value: 'R$ 450',
            subtitle: 'Aprovados este mês',
            color: '#2196F3'
        },
        {
            icon: <Schedule sx={{ fontSize: '3rem', color: '#FF9800' }} />,
            title: 'Pendentes',
            value: 2,
            subtitle: 'Aguardando análise',
            color: '#FF9800'
        },
        {
            icon: <Notifications sx={{ fontSize: '3rem', color: '#F44336' }} />,
            title: 'Notificações',
            value: 1,
            subtitle: 'Nova mensagem',
            color: '#F44336'
        },
    ];

    const healthActions: QuickAction[] = [
        {
            icon: <PersonAddIcon />,
            title: 'Cadastro Empregados',
            subtitle: 'Cadastro seu empregado aqui',
            onClick: () => navigate('/rh/cadastro-empregados'),
        },
        {
            icon: <DoneAllIcon />,
            title: 'Aprovar/Validar Reembolso',
            subtitle: 'Aprove as solicitações de Reembolso',
            onClick: () => navigate('/rh/aprovar-validar-reembolso'),
        },
    ];

    return (
        <DashboardLayout title="RH" menuItems={menuItems}>
            <Routes>
                <Route index element={
                    <WelcomeScreen
                        userName={nome}
                        userRole={perfil}
                        systemName="sistema BAS Saúde"
                        cards={healthCards}
                        quickActions={healthActions}
                        primaryColor="rgb(30 41 59)"
                        gradientColors={['rgb(30 41 59)', '#006064']}
                    />
                }
                />
                <Route path="cadastro-empregados" element={<CadastroEmpregados />} />
                <Route path="aprovar-validar-reembolso" element={<ValidarReembolsos />} />
                <Route path="reports" element={<Typography>Relatórios</Typography>} />
            </Routes>
        </DashboardLayout>
    );
};

export default RHDashboard;