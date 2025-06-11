// pages/AdminDashboard.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Typography, Grid, Card, CardContent } from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';

const AdminHome: React.FC = () => (
    <Grid container spacing={3}>
        <Grid size={12}>
            <Typography variant="h4" gutterBottom>
                Dashboard do Administrador
            </Typography>
        </Grid>
        <Grid size={2}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Usuários
                    </Typography>
                    <Typography variant="h3" color="primary">
                        2.5K
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={2}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Uptime
                    </Typography>
                    <Typography variant="h3" color="success.main">
                        99.9%
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={2}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Logs
                    </Typography>
                    <Typography variant="h3" color="warning.main">
                        145
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={2}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Backups
                    </Typography>
                    <Typography variant="h3" color="info.main">
                        OK
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={2}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Segurança
                    </Typography>
                    <Typography variant="h3" color="success.main">
                        Alta
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid size={2}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Versão
                    </Typography>
                    <Typography variant="h3" color="text.secondary">
                        2.1.0
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
);

const AdminDashboard: React.FC = () => {
    const menuItems = [
        { label: 'Início', path: '/admin', icon: '🏠' },
        { label: 'Usuários', path: '/admin/users', icon: '👥' },
        { label: 'Sistema', path: '/admin/system', icon: '⚙️' },
        { label: 'Segurança', path: '/admin/security', icon: '🔒' },
        { label: 'Logs', path: '/admin/logs', icon: '📝' },
        { label: 'Configurações', path: '/admin/settings', icon: '🔧' },
    ];

    return (
        <DashboardLayout title="Administrador" menuItems={menuItems}>
            <Routes>
                <Route index element={<AdminHome />} />
                <Route path="users" element={<Typography>Gestão de Usuários</Typography>} />
                <Route path="system" element={<Typography>Configurações do Sistema</Typography>} />
                <Route path="security" element={<Typography>Configurações de Segurança</Typography>} />
                <Route path="logs" element={<Typography>Logs do Sistema</Typography>} />
                <Route path="settings" element={<Typography>Configurações Gerais</Typography>} />
            </Routes>
        </DashboardLayout>
    );
};

export default AdminDashboard;