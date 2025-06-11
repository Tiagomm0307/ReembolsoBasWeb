import {
    Box,
    Button,
    Checkbox,
    Collapse,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { Control, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { ParamType } from 'types/paramType';
import FormDynamicField from 'components/fields/FormDynamicField';
import { authService } from 'service/authService';
import { grey } from '@mui/material/colors';
import { DECLARACAO_REEMBOLSO } from 'texts';
import FileUploadComponent from 'components/FileUploadComponent';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import { Add, CheckCircle, Delete, PostAdd } from '@mui/icons-material';
import { useSnackbar } from 'contexts/SnackbarContext';
import { reembolsoApi } from 'api/reembolsoApi';
import { handleApiError } from 'utils/handleApiError';
import CustomModal from 'components/CustomModal';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useLocation, useNavigate } from 'react-router-dom';

interface Lancamento {
    id: number;
    beneficiario: string;
    tipo: string;
    data: string;
    valor: string;
}

interface FormValues {
    periodoSolicitacao: string;
    tipoSolicitacao: number;
    // além disso, teremos campos dinâmicos:
    [key: string]: string | number;
}

function formatPeriodo(periodo: string) {
    if (!periodo) return '';
    const d = new Date(periodo);
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${mes}/${ano}`;
}

export const NovaSolicitacao = () => {
    const { handleSubmit, control, watch, reset } = useForm<FormValues>();
    const { showError } = useSnackbar();

    const [aceite, setAceite] = useState(false);
    const [lancamentos, setLancamentos] = useState<Lancamento[]>([
        { id: 1, beneficiario: '', tipo: '', data: '', valor: '0,00' },
    ]);
    const [uploadedFiles, setUploadedFiles] = useState<(File | string)[]>([]);
    const [mostrarUpload, setMostrarUpload] = useState(false);
    const [openModalSucesso, setOpenModalSucesso] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    const navigate = useNavigate();

    const location = useLocation();
    const id = location.state?.id;
    const isEditMode = Boolean(id);

    const nome = authService.getNome();
    const matriculaRaw = authService.getMatricula();      // string | null
    const matricula = matriculaRaw ?? '';
    const diretoria = authService.getDiretoria();
    const superintendência = authService.getSuperintendencia();

    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // adiciona zero à esquerda
    const ano = hoje.getFullYear();
    const periodoAtual = `${mes}/${ano}`; // ex: "06/2025"

    // Função para adicionar
    const adicionarLinha = () => {
        setLancamentos((prev) => [
            ...prev,
            {
                id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 1,
                beneficiario: '',
                tipo: 'Titular',
                data: '',
                valor: '0,00',
            },
        ]);
    };

    // Função para remover
    const removerLinha = (id: number) => {
        setLancamentos((prev) => {
            if (prev.length <= 1) {
                showError("Informe pelo menos um lançamento."); // Mostra o alerta
                return prev;
            }

            return prev.filter((item) => item.id !== id);
        });
    };
    const handleFilesChange = (files) => {
        setUploadedFiles(files);
    };

    const handleNovaSolicitacao = () => {
        setOpenModalSucesso(false);
    };

    useEffect(() => {
        if (!openModalSucesso) {
            reset({
                periodoSolicitacao: periodoAtual,
                tipoSolicitacao: 1,
            });
            setLancamentos([{ id: 1, beneficiario: '', tipo: '', data: '', valor: '0,00' }]);
            setResetKey(prev => prev + 1);
        }
    }, [openModalSucesso, periodoAtual, reset]);

    const calcularSubtotal = () => {
        return lancamentos.reduce((total, item) => {
            const valorStr = watch(`valor_${item.id}`); // Ex: "123,45"
            const valorNum = parseFloat(String(valorStr).replace(',', '.')) || 0;
            return total + valorNum;
        }, 0);
    };

    const subtotal = calcularSubtotal();
    const totalGeral = (subtotal / 2).toFixed(2).replace('.', ','); // ou outro cálculo


    const camposFixos: ParamType[] = [
        {
            name: 'periodoSolicitacao',
            label: 'Período da Solicitação (Mês/Ano)',
            type: 'monthYear',
            value: '05/2025',
            gridSize: { xs: 12, md: 6 },
        },
        {
            name: 'tipoSolicitacao',
            label: 'Tipo de Solicitação',
            type: 'autocomplete',
            value: 'consultas',
            options: [
                { value: 1, label: 'Mensalidade de Plano de Saúde' },
                { value: 2, label: 'Consultas / Procedimentos Médicos & Plano de Saúde' },
            ],
            gridSize: { xs: 12, md: 6 },
        }
    ];

    const camposLancamento = (item: Lancamento): ParamType[] => [
        {
            name: `beneficiario_${item.id}`,
            label: 'Nome Benef./Depend.',
            type: 'text',
            value: item.beneficiario,
            gridSize: { xs: 12, md: 5 },
        },
        {
            name: `tipo_${item.id}`,
            label: 'Tipo',
            type: 'autocomplete',
            value: item.tipo,
            options: [
                { value: 1, label: 'Titular' },
                { value: 2, label: 'Cônjuge' },
                { value: 3, label: 'Filho' },
                { value: 4, label: 'Filho Estudante' },
            ],
            gridSize: { xs: 12, md: 2.33 },
        },
        {
            name: `data_${item.id}`,
            label: 'Data',
            type: 'datepicker',
            value: item.data,
            gridSize: { xs: 12, md: 2.33 },
        },
        {
            name: `valor_${item.id}`,
            label: 'Valor Pago',
            type: 'currency',
            value: item.valor,
            gridSize: { xs: 12, md: 2.33 },
        },
    ];

    const onSubmit = async (data: FormValues) => {
        const formData = new FormData();

        const [mes, ano] = (data.periodoSolicitacao ?? '').split('/');
        const periodoFormatado = `${ano}-${mes}`;

        formData.append('Matricula', matricula);
        formData.append('Periodo', periodoFormatado);
        formData.append('ValorSolicitado', subtotal.toString());
        formData.append('TipoSolicitacao', data.tipoSolicitacao.toString());

        uploadedFiles.forEach(file => formData.append('Documentos', file));

        lancamentos.forEach(item => {
            formData.append('Beneficiario', String(data[`beneficiario_${item.id}`]));
            formData.append('DataPagamento', String(data[`data_${item.id}`]));
            const vp = parseFloat(String(data[`valor_${item.id}`]).replace(',', '.')) || 0;
            formData.append('ValorPago', vp.toString());
            formData.append('GrauParentesco', String(data[`tipo_${item.id}`]));
        });

        try {
            if (isEditMode) {
                // Chama endpoint de edição
                await reembolsoApi.atualizarReembolso(id, formData);
            } else {
                // Chama endpoint de cadastro
                await reembolsoApi.solicitarReembolso(formData);
            }
            setOpenModalSucesso(true);
        } catch (err: unknown) {
            handleApiError(err, showError);
        }
    };

    useEffect(() => {
        if (!isEditMode || !id) return;

        const fetchReembolso = async () => {
            try {
                const dados = await reembolsoApi.listarById(id);  // retorna ReembolsoDetalhado

                // Prepara o objeto de reset
                const initialData: Partial<FormValues> = {
                    periodoSolicitacao: formatPeriodo(dados.Periodo),
                    tipoSolicitacao: dados.TipoSolicitacao,
                };

                // Campos dinâmicos
                const novosLancamentos: Lancamento[] = dados.Lancamentos.map(lanc => ({
                    id: lanc.Id,
                    beneficiario: lanc.Beneficiario,
                    tipo: lanc.GrauParentesco.toString(),
                    data: new Date(lanc.DataPagamento).toLocaleDateString('pt-BR'),
                    valor: lanc.ValorPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
                }));

                // Popula os campos dinâmicos no reset
                dados.Lancamentos.forEach(lanc => {
                    initialData[`beneficiario_${lanc.Id}`] = lanc.Beneficiario;
                    initialData[`tipo_${lanc.Id}`] = lanc.GrauParentesco;
                    initialData[`data_${lanc.Id}`] = new Date(lanc.DataPagamento).toLocaleDateString('pt-BR');
                    initialData[`valor_${lanc.Id}`] = lanc.ValorPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                });

                // Executa o reset uma única vez
                reset(initialData);
                setLancamentos(novosLancamentos);

                if (dados.CaminhoDocumentos) {
                    setUploadedFiles([dados.CaminhoDocumentos]);
                }
            } catch (err: unknown) {
                handleApiError(err, showError);
            }
        };

        fetchReembolso();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode, id]);  // <-- só depende de isEditMode e id

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" mb={2}>
                {isEditMode ? 'Editar Solicitação de Reembolso' : 'Nova Solicitação de Reembolso'}
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Typography>
                            <strong>Nome do Empregado:</strong> {nome}
                        </Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography>
                            <strong>Diretoria:</strong> {diretoria}
                        </Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography>
                            <strong>Matrícula:</strong> {matricula}
                        </Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography>
                            <strong>Superintendência/Gerência:</strong> {superintendência}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <form onSubmit={handleSubmit(onSubmit)}>
                <FormDynamicField params={camposFixos} control={control as unknown as Control<Record<string, unknown>>} />

                <Typography variant="h6" mb={1}>
                    Lançamentos
                </Typography>

                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                    {lancamentos.map((item) => (
                        <Box key={item.id} mb={2}>
                            {/* Campos dinâmicos */}
                            <FormDynamicField params={camposLancamento(item)} control={control as unknown as Control<Record<string, unknown>>} />

                            <Grid container spacing={2} alignItems="center">
                                <Grid size={4.7}>
                                    {/* Box com o cálculo */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 50,
                                            borderRadius: 1,
                                            bgcolor: grey[200],
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'end',
                                            pr: 2,
                                        }}
                                    >
                                        <Typography>
                                            R$ {(() => {
                                                const raw = watch(`valor_${item.id}`);
                                                const parsed = parseFloat(String(raw).replace(',', '.')) || 0;
                                                const metade = parsed / 2;
                                                return metade.toFixed(2).replace('.', ',');
                                            })()}
                                        </Typography>
                                    </Box>
                                </Grid>

                                {/* Botão de remover linha */}
                                <Grid >
                                    <IconButton color="error" onClick={() => removerLinha(item.id)} size="small">
                                        <Delete />
                                    </IconButton>
                                </Grid>
                            </Grid>

                            <Divider sx={{ mt: 2 }} />
                        </Box>
                    ))}

                    {/* Botão de adicionar nova linha */}
                    <Button onClick={adicionarLinha} size="small">
                        + Adicionar Linha
                    </Button>

                    {/* Rodapé alinhado à direita */}
                    <Box mt={3} mb={3} display="flex" flexDirection="column" alignItems="flex-end">
                        <Typography color='textSecondary'>
                            Subtotal: <strong>R$ {totalGeral}</strong>
                        </Typography>
                        <Typography color="primary">
                            Valor máximo deste benefício: até 50% limitado a R$ 946,12.
                        </Typography>
                        <Typography variant="h6">
                            Total Geral: <span style={{ color: 'green' }}>R$ {totalGeral}</span>
                        </Typography>
                    </Box>
                </Paper>

                <Box mt={3} mb={3}>
                    <Button variant="outlined" startIcon={<AssignmentAddIcon />} onClick={() => setMostrarUpload(prev => !prev)}>
                        Adicionar Comprovantes
                    </Button>

                    <Collapse in={mostrarUpload}>
                        <FileUploadComponent
                            onFilesChange={handleFilesChange}
                            maxFiles={5}
                            maxSizePerFile={10}
                            resetTrigger={resetKey}
                        />
                    </Collapse>
                    {uploadedFiles.length > 0 && !mostrarUpload && (
                        <Typography variant="body2">{uploadedFiles.length} arquivo(os) adicionado(os)</Typography>
                    )}
                </Box>

                <FormControlLabel
                    control={<Checkbox checked={aceite} onChange={(e) => setAceite(e.target.checked)} sx={{ alignSelf: "flex-start" }} />}
                    label={
                        <>
                            <Typography variant='body1' marginTop={"0.5rem"} color='textPrimary'>
                                Declaração de Responsabilidade *
                            </Typography>
                            <Typography variant='caption' color='textSecondary' >
                                {DECLARACAO_REEMBOLSO}
                            </Typography>
                        </>
                    }
                />
                <Divider sx={{ marginTop: 2 }} />
                <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
                    {isEditMode &&
                        <Button variant="outlined" onClick={() => navigate('/empregado/meus-reembolsos')}>
                            Cancelar
                        </Button>
                    }
                    <Button variant="contained" type="submit" disabled={!aceite}>
                        {isEditMode ? 'Salvar Alterações' : 'Enviar Solicitação'}
                    </Button>
                </Stack>
            </form>

            <CustomModal
                open={openModalSucesso}
                onClose={() => setOpenModalSucesso(false)}
                title={isEditMode ? 'Alteração de Reembolso' : "Solicitação de Reembolso"}
                subtitle="Meus Reembolsos"
                icon={<PostAdd />}
                loading={false}
                maxWidth="sm"
            >
                <Paper
                    elevation={3}
                    sx={{
                        backgroundColor: '#E6F4EA',
                        border: '1px solid #4CAF50',
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 2,
                        mt: 2
                    }}
                >
                    <CheckCircle sx={{ fontSize: 50, color: 'green', mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold" color="success.main" gutterBottom>
                        {isEditMode ? 'Alteração realizada com sucesso!' : "Solicitação enviada com sucesso!"}

                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Você poderá acompanhar o andamento em "Meus Reembolsos".
                    </Typography>
                </Paper>

                <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
                    {!isEditMode &&
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<Add />}
                            onClick={handleNovaSolicitacao}
                        >
                            Nova Solicitação
                        </Button>
                    }
                    <Button
                        variant="contained"
                        color="info"
                        startIcon={<ReceiptIcon />}
                        onClick={() => navigate('/empregado/meus-reembolsos')}
                    >
                        Meus Reembolsos
                    </Button>
                </Stack>

            </CustomModal>
        </Paper>
    );
};
