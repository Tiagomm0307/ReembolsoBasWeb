import React, { useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Paper,
    Stack,
    Typography,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete
} from '@mui/material';
import { Add, Edit, Delete, UploadFile } from '@mui/icons-material';
import DynamicTable from '../../../components/DinamicTables';

export function CadastroEmpregados() {
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const cargoOptions = ['Diretor-Presidente', 'Diretor', 'Empregado'];

    const [form, setForm] = useState<{
        nome: string;
        matricula: string;
        diretoria: string;
        superintendencia: string;
        cargo: string | null;
    }>({
        nome: '',
        matricula: '',
        diretoria: '',
        superintendencia: '',
        cargo: '',
    });

    const handleChange = (field) => (event) => {
        setForm((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const handleSave = () => {
        console.log('Salvar empregado:', form);
        handleCloseModal();
    };

    const columns = [
        { key: 'nome', label: 'Nome Completo' },
        { key: 'matricula', label: 'Matrícula' },
        { key: 'diretoria', label: 'Diretoria' },
        { key: 'cargo', label: 'Cargo' },
        {
            key: 'status',
            label: 'Status',
            render: (value, row) => (
                <Chip
                    label={value}
                    color={row.statusColor}
                    variant="outlined"
                    sx={{ maxWidth: 300 }}
                />
            ),
        },
    ];

    const rows = [
        {
            nome: 'Ana Silva (Empregada)',
            matricula: '012345',
            diretoria: 'DAFC',
            cargo: 'Empregado',
            status: 'Ativo',
            statusColor: 'success',
            ativo: true,
        },
        {
            nome: 'João Costa (Diretor)',
            matricula: '056789',
            diretoria: 'Presidência',
            cargo: 'Diretor',
            status: 'Inativo',
            statusColor: 'error',
            ativo: false,
        },
    ];

    const actions = [
        {
            icon: <Edit fontSize="small" color='info' />,
            onClick: (row) => console.log(`Editar ${row.nome}`),
            shouldShowAction: () => true,
        },
        {
            label: 'Ativo/Inativo',
            type: 'switch',
            checked: (row) => row.ativo,
            onChange: (row, checked) => console.log(`Status ${row.nome}:`, checked),
            shouldShowAction: () => true,
        },
        {
            icon: <Delete fontSize="small" color='error' />,
            onClick: (row) => console.log(`Excluir ${row.nome}`),
            shouldShowAction: () => true,
        },
    ];

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ p: 0 }}>
            <Paper sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" color="text.primary">
                        Cadastro Empregados
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<Add />}
                            onClick={handleOpenModal}
                        >
                            Novo Empregado
                        </Button>
                        <Button
                            variant="contained"
                            color="warning"
                            startIcon={<UploadFile />}
                            onClick={() => alert('Upload de lista')}
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
                    pagination={false}
                    loading={undefined}
                    noRecordsToDisplay={undefined}
                />
            </Paper>

            {/* Modal Novo Empregado */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth >
                <DialogTitle>Novo Empregado</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Nome Completo"
                            value={form.nome}
                            onChange={handleChange('nome')}
                            fullWidth
                            required
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                        <TextField
                            label="Matrícula"
                            value={form.matricula}
                            onChange={handleChange('matricula')}
                            fullWidth
                            required
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                        <TextField
                            label="Diretoria"
                            value={form.diretoria}
                            onChange={handleChange('diretoria')}
                            fullWidth
                            required
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                        <TextField
                            label="Superintendência/Gerência"
                            value={form.superintendencia}
                            onChange={handleChange('superintendencia')}
                            fullWidth
                            required
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                        <Autocomplete
                            options={cargoOptions}
                            value={form.cargo}
                            onChange={(_, newValue) => {
                                setForm((prev) => ({ ...prev, cargo: newValue }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Cargo"
                                    required
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                            )}
                        />
                        <Typography variant="caption" color="text.secondary">
                            O cargo influenciará no valor máximo de reembolso mensal.
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ margin: "1rem 0rem" }}>
                    <Button onClick={handleCloseModal} variant="contained" color="inherit">
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} variant="contained" color="info">
                        Salvar Empregado
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
