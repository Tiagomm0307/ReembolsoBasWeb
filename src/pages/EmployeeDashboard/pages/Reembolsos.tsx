import { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Paper,
    Stack,
    Typography,
    Alert,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DynamicTable from '../../../components/DinamicTables';
import { reembolsoApi } from 'api/reembolsoApi';
import { Functions } from 'utils/functions';
import dayjs from 'dayjs';
import { useSnackbar } from 'contexts/SnackbarContext';
import CustomModal from 'components/CustomModal';

interface ReembolsoRow {
    id: number;
    numero: number;
    competencia: string;
    valor: string;
    status: string;
    statusColor: string;
    dataEnvio: string;
    acoes: boolean;
}

const columns = [
    { key: 'numero', label: 'Nº Reemb.' },
    { key: 'competencia', label: 'Competência' },
    { key: 'valor', label: 'Valor Solicit.' },
    {
        key: 'status',
        label: 'Status',
        render: (value, row) => (
            <Chip
                label={value}
                color={row.statusColor}
                variant="filled"
                sx={{ maxWidth: 300 }}
            />
        ),
    },
    { key: 'dataEnvio', label: 'Data Envio' },
];

export function Reembolsos() {
    // Paginação e handlers para passar ao DynamicTable
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState<ReembolsoRow[]>([]);
    const [loading, setLoading] = useState(false);
    const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const navigate = useNavigate();
    const [fetchTrigger, setFetchTrigger] = useState(true);
    const [openDelete, setOpenDelete] = useState(false);
    const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);


    const { showSuccess, showError } = useSnackbar();

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const fetchReembolsos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await reembolsoApi.listar();
            const mappedRows: ReembolsoRow[] = response.map((item) => ({
                id: item.Id,
                numero: item.NumeroRegistro,
                competencia: dayjs(item.Periodo).format('MM/YYYY'),
                valor: `R$ ${item.ValorSolicitado.toFixed(2).replace('.', ',')}`,
                status: item.Status,
                statusColor: Functions.mapStatusReembolsoToColor(item.Status),
                dataEnvio: dayjs(item.DataEnvio).format('DD/MM/YYYY'),
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

    const actions = [
        {
            icon: <Edit fontSize="small" color='info' />,
            onClick: (row) => navigate('/empregado/nova-solicitacao', { state: { id: row.id } }),
            shouldShowAction: () => true,
        },
        {
            icon: <Delete fontSize="small" color='error' />,
            onClick: (row) => {
                setIdParaExcluir(row.id); // supondo que 'numero' é o id que você usa para excluir
                setOpenDelete(true);
            },
            shouldShowAction: () => true,
        },
    ];

    const handleConfirmDelete = async (idParaExcluir) => {
        try {
            if (!idParaExcluir) {
                showError("ID inválido para exclusão.");
                return;
            }

            await reembolsoApi.excluir(idParaExcluir);

            showSuccess("Reembolso excluído com sucesso!");

            setOpenDelete(false); // fecha o modal

            // atualizar a lista após excluir:
            await fetchReembolsos();

        } catch (err) {
            if (err instanceof Error) {
                showError(err.message);
            } else {
                showError("Erro desconhecido ao excluir reembolso.");
            }
        }
    };

    function getResumoPedidos(pedidos: ReembolsoRow[]) {
        if (pedidos.length === 0) {
            return null;
        }

        // Pega a competência do primeiro item (ou poderia pegar a mais recente/antiga)
        const competencia = pedidos[0].competencia;

        // Descobre os limites das datas de envio
        const datasEnvio = pedidos.map(p => p.dataEnvio);
        const dataMin = datasEnvio.reduce((min, d) => (new Date(min.split('/').reverse().join('-')) < new Date(d.split('/').reverse().join('-')) ? min : d));
        const dataMax = datasEnvio.reduce((max, d) => (new Date(max.split('/').reverse().join('-')) > new Date(d.split('/').reverse().join('-')) ? max : d));

        // Conta quantos estão com status "Pendente"
        const pedidosEmAnalise = pedidos.filter(p => p.status === 'Pendente').length;

        // Retorna formatado para o Alert
        return {
            competencia,
            dataInicio: dataMin,
            dataFim: dataMax,
            pedidosEmAnalise,
        };
    }

    const resumo = getResumoPedidos(rows);


    return (
        <Box sx={{ p: 0 }}>
            {/* {loading && <Loading />} */}
            <Paper sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" color="text.primary">
                        Meus Reembolsos
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<Add />}
                        onClick={() => navigate('/empregado/nova-solicitacao')}
                    >
                        Nova Solicitação
                    </Button>
                </Stack>

                {resumo && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Envios para <strong>{resumo.competencia}</strong> de <strong>{resumo.dataInicio}</strong> a{' '}
                        <strong>{resumo.dataFim}</strong>. Você pode ter até <strong>{resumo.pedidosEmAnalise} pedidos</strong> em análise.
                    </Alert>
                )}

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
                <CustomModal
                    open={openDelete}
                    onClose={() => setOpenDelete(false)}
                    title="Excluir"
                    subtitle="Meus Reembolsos"
                    icon={<Delete />}
                    loading={false}
                    maxWidth="sm"
                >
                    <Typography variant="h6" fontWeight={"bold"} margin={"1rem auto"} gutterBottom>
                        Confirma a exclusão do seu reembolso?
                    </Typography>

                    <Box display="flex" justifyContent="center" gap={2} mt={3}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleConfirmDelete(idParaExcluir)}
                        >
                            Confirmar
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setOpenDelete(false)}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </CustomModal>

            </Paper>
        </Box>
    );
}
