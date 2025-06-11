// pages/HRManagerDashboard.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Typography, Grid, Card, CardContent } from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';

const HRManagerHome: React.FC = () => (
    <Grid container spacing={3}>
        <Grid size={8}>
            <Typography variant="h4" gutterBottom>
                Dashboard do Gerente RH
            </Typography>
        </Grid>
        <Grid size={3}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Total Funcionários
                    </Typography>
                    <Typography variant="h3" color="primary">
                        1.2K
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={3}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Custo Mensal
                    </Typography>
                    <Typography variant="h3" color="warning.main">
                        R$ 89K
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={3}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Satisfação
                    </Typography>
                    <Typography variant="h3" color="success.main">
                        94%
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={3}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Departamentos
                    </Typography>
                    <Typography variant="h3" color="info.main">
                        12
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
);

const HRManagerDashboard: React.FC = () => {
    const menuItems = [
        { label: 'Início', path: '/gerente_rh', icon: '🏠' },
        { label: 'Departamentos', path: '/gerente_rh/departments', icon: '🏢' },
        { label: 'Orçamento', path: '/gerente_rh/budget', icon: '💰' },
        { label: 'Estratégia', path: '/gerente_rh/strategy', icon: '📈' },
        { label: 'Relatórios Exec.', path: '/gerente_rh/executive-reports', icon: '📋' },
    ];

    return (
        <DashboardLayout title="Gerente RH" menuItems={menuItems}>
            <Routes>
                <Route index element={<HRManagerHome />} />
                <Route path="departments" element={<Typography>Gestão de Departamentos</Typography>} />
                <Route path="budget" element={<Typography>Controle Orçamentário</Typography>} />
                <Route path="strategy" element={<Typography>Planejamento Estratégico</Typography>} />
                <Route path="executive-reports" element={<Typography>Relatórios Executivos</Typography>} />
            </Routes>
        </DashboardLayout>
    );
};

export default HRManagerDashboard;