// pages/EmployeeDashboard.tsx
import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import { Reembolsos } from './pages/Reembolsos';
import { NovaSolicitacao } from './pages/NovaSolicitacao';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PoliticaBas from './pages/PolíticaBas';
import { WelcomeScreen, type MotivationalMessage, type QuickAction, type WelcomeCard } from '../../components/Layout/WelcomeScreen';
import { HealthAndSafety, Notifications, Schedule, TrendingUp } from '@mui/icons-material';
import { authService } from 'service/authService';

const EmployeeDashboard: React.FC = () => {

    const navigate = useNavigate();

    // const token = authService.getToken();
    const perfil = authService.getPerfil();
    // const matricula = authService.getMatricula();
    const nome = authService.getNome();

    const menuItems = [
        { label: 'Início', path: '/empregado', icon: <HomeIcon /> },
        { label: 'Meus Reembolsos', path: '/empregado/meus-reembolsos', icon: <ReceiptIcon /> },
        { label: 'Nova Solicitação', path: '/empregado/nova-solicitacao', icon: <PostAddIcon /> },
        { label: 'Política BAS', path: '/empregado/politica-bas', icon: <PlagiarismIcon /> },
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
            icon: <PostAddIcon />,
            title: 'Nova Solicitação',
            subtitle: 'Solicite seu reembolso aqui',
            onClick: () => navigate('/empregado/nova-solicitacao'),
        },
        {
            icon: <ReceiptIcon />,
            title: 'Meus Reembolsos',
            subtitle: 'Acompanhe suas solicitações',
            onClick: () => navigate('/empregado/meus-reembolsos'),
        },
    ];

    const healthMessage: MotivationalMessage = {
        title: 'Cuidamos da sua saúde com dedicação',
        description: 'Estamos aqui para facilitar o acesso aos seus benefícios de saúde. Qualquer dúvida, nossa equipe está pronta para ajudar!',
        emoji: '💙'
    };

    return (
        <DashboardLayout title="Empregado" menuItems={menuItems}>
            <Routes>
                <Route index element={
                    <WelcomeScreen
                        userName={nome}
                        userRole={perfil}
                        systemName="sistema BAS Saúde"
                        cards={healthCards}
                        quickActions={healthActions}
                        motivationalMessage={healthMessage}
                        primaryColor="rgb(30 41 59)"
                        gradientColors={['rgb(30 41 59)', '#006064']}
                    />
                }
                />
                <Route path="meus-reembolsos" element={<Reembolsos />} />
                <Route path="nova-solicitacao" element={
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <NovaSolicitacao />
                    </LocalizationProvider>
                } />
                <Route path="politica-bas" element={<PoliticaBas />} />
            </Routes>
        </DashboardLayout>
    );
};

export default EmployeeDashboard;