import React, { useState } from 'react';
import {
    Box,
    Checkbox,
    Chip,
    Paper,
    Stack,
    Typography,
    Alert,
} from '@mui/material';
import { CheckCircle, Cancel, FolderOpen } from '@mui/icons-material';
import DynamicTable from '../../../components/DinamicTables';

export interface ValidaReembolsoProps {
    numero: string;
    empregado: string;
    valor: string;
    dataEnvio: string;
    status: string;
}

export function ValidarReembolsos() {
    const [selectAll, setSelectAll] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleValidar = (row: ValidaReembolsoProps) => {
        alert(`Validado ${row.empregado}`);
    };

    const handleReprovar = (row: ValidaReembolsoProps) => {
        alert(`Reprovado ${row.empregado}`);
    };

    const handleAbrir = (row: ValidaReembolsoProps) => {
        alert(`Abrir documentos de ${row.empregado}`);
    };

    const columns = [
        { key: 'numero', label: 'Nº' },
        { key: 'empregado', label: 'EMPREGADO' },
        { key: 'valor', label: 'VALOR SOLIC.' },
        { key: 'dataEnvio', label: 'DATA ENVIO' },
        {
            key: 'status',
            label: 'STATUS',
            render: (value: string) => {
                const statusMap: { [key: string]: { color: 'warning' | 'info' | 'default' | 'error' | 'success' } } = {
                    'Pendente': { color: 'warning' },
                    'Validado pelo RH': { color: 'info' },
                    'Recusado por Prazo': { color: 'default' },
                    'Devolvido (Corrigido)': { color: 'error' },
                    'Aprovado': { color: 'success' },
                };
                return (
                    <Chip
                        label={value}
                        color={statusMap[value]?.color || 'default'}
                        variant="outlined"
                    />
                );
            },
        },
    ];

    const rows: ValidaReembolsoProps[] = [
        {
            numero: 'R00123',
            empregado: 'Carlos Pereira',
            valor: 'R$ 450,00',
            dataEnvio: '02/06/2025',
            status: 'Pendente',
        },
        {
            numero: 'R00124',
            empregado: 'Mariana Lima',
            valor: 'R$ 1.500,00',
            dataEnvio: '03/06/2025',
            status: 'Validado pelo RH',
        },
        {
            numero: 'R00125',
            empregado: 'Julio Alves',
            valor: 'R$ 950,00',
            dataEnvio: '01/06/2025',
            status: 'Recusado por Prazo',
        },
        {
            numero: 'R00126',
            empregado: 'Sofia Mendes',
            valor: 'R$ 300,00',
            dataEnvio: '28/05/2025',
            status: 'Devolvido (Corrigido)',
        },
        {
            numero: 'R00127',
            empregado: 'Pedro Antunes',
            valor: 'R$ 700,00',
            dataEnvio: '04/06/2025',
            status: 'Aprovado',
        },
    ];

    // Actions que serão renderizadas como botões com labels em linha
    const actions = [
        {
            icon: <FolderOpen />,
            label: '',
            color: 'primary' as const,
            onClick: (row: ValidaReembolsoProps) => handleAbrir(row),
            shouldShowAction: () => true, // Sempre mostrar
            showLabel: true,
        },
        {
            icon: <CheckCircle />,
            label: 'Validar',
            color: 'success' as const,
            onClick: (row: ValidaReembolsoProps) => handleValidar(row),
            shouldShowAction: (row: ValidaReembolsoProps) =>
                ['Pendente', 'Recusado por Prazo', 'Devolvido (Corrigido)'].includes(row.status),
            showLabel: true,
        },
        {
            icon: <Cancel />,
            label: 'Reprovar',
            color: 'error' as const,
            onClick: (row: ValidaReembolsoProps) => handleReprovar(row),
            shouldShowAction: (row: ValidaReembolsoProps) =>
                ['Pendente', 'Recusado por Prazo', 'Devolvido (Corrigido)'].includes(row.status),
            showLabel: true,
        },
        // Texto informativo baseado no status
        {
            label: (row: ValidaReembolsoProps) => {
                if (row.status === 'Validado pelo RH') return 'Aguardando Gerente';
                if (row.status === 'Aprovado') return 'Aprovado';
                return '';
            },
            color: (row: ValidaReembolsoProps) => {
                if (row.status === 'Validado pelo RH') return 'warning' as const;
                if (row.status === 'Aprovado') return 'success' as const;
                return 'default' as const;
            },
            shouldShowAction: (row: ValidaReembolsoProps) =>
                ['Validado pelo RH', 'Aprovado'].includes(row.status),
            showLabel: true,
            isTextOnly: true, // Flag para identificar que é apenas texto
        },
    ];

    const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ p: 0 }}>
            <Paper sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" color="text.primary">
                        Validar Reembolsos
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Checkbox
                            checked={selectAll}
                            onChange={(e) => setSelectAll(e.target.checked)}
                        />
                        <Typography>Selecionar todos para validação em lote</Typography>
                    </Stack>
                </Stack>

                <Alert severity="info" sx={{ mb: 2 }}>
                    Reembolsos solicitados de <strong>01/05/2025</strong> a <strong>05/06/2025</strong>.
                    Prazo RH: Validação até <strong>10/06</strong>, Aprovação de recusados por prazo até <strong>12/06</strong>.
                </Alert>

                <DynamicTable
                    rows={paginatedRows}
                    columns={columns}
                    actions={actions}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    totalRegistros={rows.length}
                    pagination={false}
                    loading={false}
                    noRecordsToDisplay="Nenhum reembolso encontrado"
                />

            </Paper>
        </Box>
    );
}