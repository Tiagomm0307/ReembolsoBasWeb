import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Checkbox,
    Chip,
    Paper,
    Stack,
    Typography,
    Alert,
    Tabs,
    Tab,
    AppBar,
    Button,
    Divider,
} from '@mui/material';
import { CheckCircle, Cancel, FolderOpen } from '@mui/icons-material';
import DynamicTable from '../../../components/DinamicTables';
import { reembolsoApi } from 'api/reembolsoApi';
import dayjs from 'dayjs';
import { useSnackbar } from 'contexts/SnackbarContext';
import { ReembolsoPendentesRow } from 'types/reembolsoPendentesRow';
import CustomModal from 'components/CustomModal';
import { TabsDadosEmpregado } from './components/TabsDadosEmpregado';
import { TabsDocumentosAnexados } from './components/TabsDocumentosAnexados';

export function ValidarReembolsos() {
    const [selectAll, setSelectAll] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState<ReembolsoPendentesRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchTrigger, setFetchTrigger] = useState(true);
    const [openModal, setOpenModal] = useState(false);         // Controle de abertura
    const [modalType, setModalType] = useState<'validar' | 'reprovar' | 'abrir' | null>(null); // Tipo de modal
    const [selectedRow, setSelectedRow] = useState<ReembolsoPendentesRow | null>(null); // Registro selecionado
    const [tabIndex, setTabIndex] = useState(0);

    const { showError } = useSnackbar();

    const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleValidar = (row: ReembolsoPendentesRow) => {
        setSelectedRow(row);
        setModalType('validar');
        setOpenModal(true);
    };

    const handleReprovar = (row: ReembolsoPendentesRow) => {
        setSelectedRow(row);
        setModalType('reprovar');
        setOpenModal(true);
    };

    const handleAbrir = (row: ReembolsoPendentesRow) => {
        setSelectedRow(row);
        setModalType('abrir');
        setOpenModal(true);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const columns = [
        { key: 'NumeroRegistro', label: 'Nº' },
        { key: 'Solicitante', label: 'EMPREGADO' },
        { key: 'ValorSolicitado', label: 'VALOR SOLIC.' },
        { key: 'DataEnvio', label: 'DATA ENVIO' },
        {
            key: 'Status',
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
                        variant="filled"
                    />
                );
            },
        },
    ];

    // Actions que serão renderizadas como botões com labels em linha
    const actions = [
        {
            icon: <FolderOpen />,
            label: '',
            color: 'primary' as const,
            onClick: (row: ReembolsoPendentesRow) => handleAbrir(row),
            shouldShowAction: () => true, // Sempre mostrar
            showLabel: true,
        },
        {
            icon: <CheckCircle />,
            label: 'Validar',
            color: 'success' as const,
            onClick: (row: ReembolsoPendentesRow) => handleValidar(row),
            shouldShowAction: (row: ReembolsoPendentesRow) =>
                ['Pendente', 'Recusado por Prazo', 'Devolvido (Corrigido)'].includes(row.Status),
            showLabel: true,
        },
        {
            icon: <Cancel />,
            label: 'Reprovar',
            color: 'error' as const,
            onClick: (row: ReembolsoPendentesRow) => handleReprovar(row),
            shouldShowAction: (row: ReembolsoPendentesRow) =>
                ['Pendente', 'Recusado por Prazo', 'Devolvido (Corrigido)'].includes(row.Status),
            showLabel: true,
        },
        // Texto informativo baseado no status
        {
            label: (row: ReembolsoPendentesRow) => {
                if (row.Status === 'Validado pelo RH') return 'Aguardando Gerente';
                if (row.Status === 'Aprovado') return 'Aprovado';
                return '';
            },
            color: (row: ReembolsoPendentesRow) => {
                if (row.Status === 'Validado pelo RH') return 'warning' as const;
                if (row.Status === 'Aprovado') return 'success' as const;
                return 'default' as const;
            },
            shouldShowAction: (row: ReembolsoPendentesRow) =>
                ['Validado pelo RH', 'Aprovado'].includes(row.Status),
            showLabel: true,
            isTextOnly: true, // Flag para identificar que é apenas texto
        },
    ];

    const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const fetchReembolsos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await reembolsoApi.listarTodos();
            const mappedRows: ReembolsoPendentesRow[] = response.map((item) => ({
                Id: item.Id,
                NumeroRegistro: item.NumeroRegistro,
                TipoSolicitacao: item.TipoSolicitacao, // não esquecer esse campo!
                Status: item.Status,
                DataEnvio: dayjs(item.DataEnvio).format('DD/MM/YYYY'),
                Solicitante: item.Solicitante ?? '',
                ValorSolicitado: Number(item.ValorSolicitado),
                acoes: true,
            }));
            setRows(mappedRows);
        } catch (err) {
            if (err instanceof Error) {
                showError(err.message);
            } else {
                showError("Erro desconhecido");
            }
            return [];
        } finally {
            setLoading(false);
        }
    }, [showError]);

    useEffect(() => {
        if (fetchTrigger) {
            fetchReembolsos();
            setFetchTrigger(false);
        }
    }, [fetchTrigger, fetchReembolsos]);


    function renderModalContent() {
        if (!selectedRow) return null;

        switch (modalType) {
            case 'validar':
                return (
                    <>
                        <Box display="flex" justifyContent="center" gap={2} m={3}>
                            <Typography variant='h6' fontWeight={"bold"}>
                                {`Deseja validar o reembolso ${selectedRow.NumeroRegistro} no valor de R$ ${selectedRow.ValorSolicitado.toFixed(2).replace('.', ',')}?`}
                            </Typography>

                        </Box>
                        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={() => setOpenModal(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                color="info"
                                onClick={() => setOpenModal(false)}
                            >
                                Sim, Validar
                            </Button>
                        </Box>
                    </>
                );
            case 'reprovar':
                return (
                    <>
                        <Box display="flex" justifyContent="center" gap={2} m={3}>
                            <Typography variant='h6' fontWeight={"bold"}>
                                {`Deseja validar o reembolso ${selectedRow.NumeroRegistro} no valor de R$ ${selectedRow.ValorSolicitado.toFixed(2).replace('.', ',')}?`}
                            </Typography>

                        </Box>
                        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={() => setOpenModal(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setOpenModal(false)}
                            >
                                Enviar Reprovação
                            </Button>
                        </Box>
                    </>
                );
            case 'abrir':
                return (
                    <>
                        <AppBar position="static" sx={{ mt: 2 }}>
                            <Tabs
                                value={tabIndex}
                                onChange={handleTabChange}
                                indicatorColor="secondary"
                                textColor="inherit"
                                variant="fullWidth"
                                aria-label="full width tabs example"
                            >
                                <Tab label="Dados do Empregado" />
                                <Tab label="Documentos Anexados" />
                            </Tabs>
                        </AppBar>
                        <Box sx={{ p: 1 }}>
                            {tabIndex === 0 && <TabsDadosEmpregado row={selectedRow} />}
                            {tabIndex === 1 && <TabsDocumentosAnexados />}
                        </Box>
                        <Divider />
                        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={() => setOpenModal(false)}
                            >
                                Fechar
                            </Button>

                        </Box>
                    </>
                );
            default:
                return null;
        }
    }

    function getModalTitle() {
        if (!selectedRow) return '';
        if (modalType === 'validar') return `Validar - Reembolso ${selectedRow.NumeroRegistro}`;
        if (modalType === 'reprovar') return `Reprovar - Reembolso ${selectedRow.NumeroRegistro}`;
        if (modalType === 'abrir') return `Analisar Documentos - Reembolso ${selectedRow.NumeroRegistro}`;
        return '';
    }


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
                    pagination={true}
                    loading={loading}
                    noRecordsToDisplay={"Nenhum reembolso foi encontrado"}
                />

            </Paper>
            <CustomModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title={getModalTitle()}
                subtitle="Analisar/Validar Reembolso"
                icon={
                    modalType === 'validar' ? <CheckCircle color="success" />
                        : modalType === 'reprovar' ? <Cancel color="error" />
                            : modalType === 'abrir' ? <FolderOpen color="primary" />
                                : null
                }
                loading={false}
                maxWidth="md"
            >
                {renderModalContent()}
            </CustomModal>

        </Box>
    );
}