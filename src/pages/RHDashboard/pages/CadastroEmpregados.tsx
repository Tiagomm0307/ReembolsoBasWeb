import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Paper,
    Stack,
    Typography,
    TextField,
} from '@mui/material';
import { Edit, Delete, UploadFile, Add } from '@mui/icons-material';
import DynamicTable from '../../../components/DinamicTables';
import { Functions } from 'utils/functions';
import { useSnackbar } from 'contexts/SnackbarContext';
import { empregadoApi } from 'api/empregadosApi';
import CustomModal from 'components/CustomModal';
import { Empregado } from 'types/empregado';
import { Control, useForm } from 'react-hook-form';
import FormDynamicField from 'components/fields/FormDynamicField';
import { ModalUploadEmpregados } from 'components/UploadEmpregados';


type EmpregadoPlanilha = {
    Id: number;
    Matricula: string;
    Nome: string;
    Diretoria: string;
    Superintendencia: string;
    Cargo: string;
    Ativo: boolean;
    ValorMaximoMensal: number;
};

interface CadastroEmpregadoRow {
    id: number;
    nome: string;
    matricula: string;
    diretoria: string;
    superintendencia: string;
    cargo: string;
    status: string;
    statusColor: string;
    ativo: boolean;
    valorMaximoMensal: number;
    acoes: boolean;
}

type FormEdit = {
    nome: string;
    matricula: string;
    diretoria: string;
    superintendencia: string;
    cargo: string;
    valorMaximoMensal: number;
};

const columns = [
    { key: 'nome', label: 'Nome Completo' },
    { key: 'matricula', label: 'Matrícula' },
    { key: 'diretoria', label: 'Diretoria' },
    { key: 'superintendencia', label: 'Superintendência/Gerência' },
    { key: 'cargo', label: 'Cargo' },
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
];

const cargoOptions = [
    { label: 'Admin', value: 'Admin' },
    { label: 'Diretor-Presidente', value: 'Diretor-Presidente' },
    { label: 'Diretor', value: 'Diretor' },
    { label: 'Empregado', value: 'Empregado' },
];

const camposEdicao = (item?: CadastroEmpregadoRow) => [
    {
        name: "nome",
        label: "Nome Completo",
        type: "text",
        required: true,
        defaultValue: item?.nome ?? "",
    },
    {
        name: "matricula",
        label: "Matrícula",
        type: "text",
        required: true,
        defaultValue: item?.matricula ?? "",
    },
    {
        name: "diretoria",
        label: "Diretoria",
        type: "text",
        required: true,
        defaultValue: item?.diretoria ?? "",
    },
    {
        name: "superintendencia",
        label: "Superintendência/Gerência",
        type: "text",
        required: true,
        defaultValue: item?.superintendencia ?? "",
    },
    {
        name: "cargo",
        label: "Cargo",
        type: "autocomplete",
        required: true,
        options: cargoOptions,
        defaultValue: item?.cargo ?? "",
    },
    {
        name: "valorMaximoMensal",
        label: "Valor Máximo Mensal",
        type: "number",
        required: true,
        defaultValue: item?.valorMaximoMensal ?? 0,
    },
];


export function CadastroEmpregados() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState<CadastroEmpregadoRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchTrigger, setFetchTrigger] = useState(true);

    // Para alteração de status
    const [openModalAltStatus, setOpenModalAltStatus] = useState(false);
    const [rowToEdit, setRowToEdit] = useState<CadastroEmpregadoRow | null>(null);
    const [novoStatus, setNovoStatus] = useState<boolean>(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openModalExcluir, setOpenModalExcluir] = useState(false);
    const [rowToDelete, setRowToDelete] = useState<CadastroEmpregadoRow | null>(null);
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [dados, setDados] = useState<EmpregadoPlanilha[]>([]);

    // React Hook Form para edição
    const { handleSubmit: handleEditSubmit, control: controlEdit, reset: resetEdit } = useForm<FormEdit>();
    const { showError, showSuccess } = useSnackbar();

    const fetchEmpregados = useCallback(async () => {
        setLoading(true);
        try {
            const response = await empregadoApi.listar();
            const mappedRows: CadastroEmpregadoRow[] = response.map((item) => ({
                id: item.Id,
                nome: item.Nome,
                matricula: item.Matricula,
                diretoria: item.Diretoria,
                superintendencia: item.Superintendencia,
                cargo: item.Cargo,
                status: item.Ativo ? 'Ativo' : 'Inativo',
                statusColor: Functions.mapStatusEmpregadoToColor(item.Ativo),
                ativo: item.Ativo,
                valorMaximoMensal: item.ValorMaximoMensal,
                acoes: true,
            }));
            setRows(mappedRows);
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    }, [showError]);

    useEffect(() => {
        if (!openUploadModal) {
            setArquivo(null);
            setDados([]);
        }
    }, [openUploadModal]);

    useEffect(() => {
        if (fetchTrigger) {
            fetchEmpregados();
            setFetchTrigger(false);
        }
    }, [fetchTrigger, fetchEmpregados]);

    const paginatedRows = rows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => setPage(newPage);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleNovoEmpregado = () => {
        resetEdit({
            nome: '',
            matricula: '',
            diretoria: '',
            superintendencia: '',
            cargo: '',
            valorMaximoMensal: 0,
        });
        setRowToEdit(null); // indica cadastro, não edição!
        setOpenEditModal(true);
    };

    const handleClickEditar = (row: CadastroEmpregadoRow) => {
        setRowToEdit(row);
        resetEdit({
            nome: row.nome,
            matricula: row.matricula,
            diretoria: row.diretoria,
            superintendencia: row.superintendencia,
            cargo: row.cargo,
            valorMaximoMensal: row.valorMaximoMensal,
        });
        setOpenEditModal(true);
    };

    // Quando usuário clica no switch, capturamos a linha e o novo valor
    const handleSwitchClick = (row: CadastroEmpregadoRow, checked: boolean) => {
        setRowToEdit(row);
        setNovoStatus(checked);  // aqui garante o valor atualizado!
        setOpenModalAltStatus(true);
    };

    const handleConfirmExcluir = async () => {
        if (!rowToDelete) {
            showError('Nenhum empregado selecionado para exclusão.');
            return;
        }
        try {
            await empregadoApi.excluir(rowToDelete.id);
            showSuccess('Empregado excluído com sucesso!');
            setOpenModalExcluir(false);
            setRowToDelete(null);
            await fetchEmpregados();
        } catch (err) {
            showError(err instanceof Error ? err.message : "Erro ao excluir empregado.");
            setOpenModalExcluir(false);
        }
    };

    const handleUploadFile = (file: File, preview: EmpregadoPlanilha[]) => {
        setArquivo(file);
        setDados(preview); // Mostra preview na tabela
    };

    const handleConfirmImportacao = async () => {
        if (!arquivo) return;
        try {
            await empregadoApi.uploadArquivo(arquivo);
            showSuccess("Arquivo importado com sucesso!");
            setOpenUploadModal(false);
            setArquivo(null);
            setDados([]);
            await fetchEmpregados();
        } catch (err) {
            showError(err instanceof Error ? err.message : "Erro ao importar arquivo.");
            setOpenUploadModal(false);
        }
    };

    const actions = [
        {
            icon: <Edit fontSize="small" color="info" />,
            onClick: handleClickEditar,
            shouldShowAction: () => true,
        },
        {
            label: 'Ativo/Inativo',
            type: 'switch' as const,
            checked: (row: CadastroEmpregadoRow) => row.ativo,
            onChange: handleSwitchClick,
            shouldShowAction: () => true,
        },
        {
            icon: <Delete fontSize="small" color="error" />,
            onClick: (row: CadastroEmpregadoRow) => {
                setRowToDelete(row);
                setOpenModalExcluir(true);
            },
            shouldShowAction: () => true,
        },
    ];

    const handleConfirmAltStatus = async () => {
        if (!rowToEdit) {
            showError('Nenhum empregado selecionado.');
            return;
        }

        const payload: Empregado = {
            Id: rowToEdit.id,
            Matricula: rowToEdit.matricula,
            Nome: rowToEdit.nome,
            Diretoria: rowToEdit.diretoria,
            Superintendencia: rowToEdit.superintendencia,
            Cargo: rowToEdit.cargo,
            Ativo: novoStatus,
            ValorMaximoMensal: rowToEdit.valorMaximoMensal,
        };

        try {
            await empregadoApi.atualizar(payload);
            showSuccess('Status do empregado alterado com sucesso!');
            setOpenModalAltStatus(false);
            await fetchEmpregados();
        } catch (err) {
            showError(
                err instanceof Error
                    ? err.message
                    : 'Erro desconhecido ao alterar status.'
            );
            setOpenModalAltStatus(false);
        }
    };


    return (
        <Box sx={{ p: 0 }}>
            <Paper sx={{ p: 3 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography variant="h5" color="text.primary">
                        Cadastro Empregados
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<Add />}
                            onClick={handleNovoEmpregado}
                        >
                            Novo Empregado
                        </Button>
                        <Button
                            variant="contained"
                            color="warning"
                            startIcon={<UploadFile />}
                            onClick={() => setOpenUploadModal(true)}
                        >
                            Upload Lista (Excel)
                        </Button>
                    </Stack>
                </Stack>

                <TextField
                    placeholder="Buscar por nome ou matrícula..."
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ mb: 2 }}
                />

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
                    noRecordsToDisplay={'Nenhum empregado foi encontrado'}
                />
            </Paper>
            {/* Modal Alterar Status */}
            <CustomModal
                open={openModalAltStatus}
                onClose={() => setOpenModalAltStatus(false)}
                title="Alteração de Status"
                subtitle="Empregado"
                icon={<Edit />}
                loading={false}
                maxWidth="sm"
            >
                <Typography
                    variant="h6"
                    fontWeight={'bold'}
                    margin={'1rem auto'}
                    gutterBottom
                >
                    Confirma a alteração do status do usuário?
                </Typography>

                <Box display="flex" justifyContent="center" gap={2} mt={3}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirmAltStatus}
                    >
                        Confirmar
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setOpenModalAltStatus(false)}
                    >
                        Cancelar
                    </Button>
                </Box>
            </CustomModal>
            {/* Modal Editar Empregado */}
            <CustomModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                title={rowToEdit ? "Editar Empregado" : "Novo Empregado"}
                subtitle="Empregado"
                icon={<Add />}
                loading={false}
                maxWidth="sm"
            >
                <form
                    onSubmit={handleEditSubmit(async (values) => {
                        try {
                            if (!rowToEdit) {
                                // CADASTRO
                                const payload = {
                                    Matricula: values.matricula,
                                    Nome: values.nome,
                                    Diretoria: values.diretoria,
                                    Superintendencia: values.superintendencia,
                                    Cargo: values.cargo,
                                    Ativo: true, // novo começa sempre ativo, ou conforme sua regra
                                    ValorMaximoMensal: Number(values.valorMaximoMensal),
                                };
                                await empregadoApi.criar(payload); // Não tem o campo Id
                                showSuccess("Empregado cadastrado com sucesso!");
                            } else {
                                // EDIÇÃO
                                const payload = {
                                    Id: rowToEdit.id,
                                    Matricula: values.matricula,
                                    Nome: values.nome,
                                    Diretoria: values.diretoria,
                                    Superintendencia: values.superintendencia,
                                    Cargo: values.cargo,
                                    Ativo: rowToEdit.ativo,
                                    ValorMaximoMensal: Number(values.valorMaximoMensal),
                                };
                                await empregadoApi.atualizar(payload);
                                showSuccess("Empregado atualizado com sucesso!");
                            }
                            setOpenEditModal(false);
                            await fetchEmpregados();
                        } catch (err) {
                            showError(err instanceof Error ? err.message : "Erro ao salvar empregado.");
                        }
                    })}
                >
                    <Box mt={4}>
                        <FormDynamicField
                            params={camposEdicao(rowToEdit ?? undefined)}
                            control={controlEdit as unknown as Control<Record<string, unknown>>}
                        />
                        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={() => setOpenEditModal(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="info"
                            >
                                Salvar
                            </Button>
                        </Box>
                    </Box>
                </form>
            </CustomModal>
            <CustomModal
                open={openModalExcluir}
                onClose={() => {
                    setOpenModalExcluir(false);
                    setRowToDelete(null);
                }}
                title="Excluir Empregado"
                subtitle="Empregado"
                icon={<Delete />}
                loading={false}
                maxWidth="sm"
            >
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    margin="1rem auto"
                    gutterBottom
                    textAlign="center"
                >
                    Tem certeza que deseja excluir o empregado{' '}
                    <span style={{ color: "#b71c1c" }}>
                        {rowToDelete?.nome}
                    </span>
                    ?
                </Typography>
                <Box display="flex" justifyContent="center" gap={2} mt={3}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirmExcluir}
                    >
                        Confirmar
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            setOpenModalExcluir(false);
                            setRowToDelete(null);
                        }}
                    >
                        Cancelar
                    </Button>
                </Box>
            </CustomModal>
            <CustomModal
                open={openUploadModal}
                onClose={() => setOpenUploadModal(false)}
                title="Upload de Empregados"
                subtitle="Importação de lista Excel"
                icon={<UploadFile />}
                maxWidth="md"
            >
                <ModalUploadEmpregados
                    dados={dados}
                    onFileUpload={handleUploadFile}         // função para ler arquivo
                    onConfirmImport={handleConfirmImportacao} // função para enviar à API
                    onClose={() => setOpenUploadModal(false)}
                    confirmDisabled={!arquivo}
                />
            </CustomModal>

        </Box>
    );
}
