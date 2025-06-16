import React, { useState } from 'react';
import {
    Box, Paper, Stack, Typography, Button, TextField, InputAdornment, Chip, IconButton
} from '@mui/material';
import { Download as DownloadIcon, Info as InfoIcon, Search as SearchIcon } from '@mui/icons-material';
import dayjs from 'dayjs';

// Mock de dados
const MOCK_ROWS = [
    {
        Matricula: '012345', Nome: 'Ana Silva', Diretoria: 'DAFC', Gerencia: 'TI',
        ValorMaxMes: 946.12, ValorSolicitado: 850, ValorReembolso: 850, Status: 'Aprovado'
    },
    {
        Matricula: '056789', Nome: 'Bruno Costa', Diretoria: 'Presidência', Gerencia: 'Gabinete',
        ValorMaxMes: 1786.49, ValorSolicitado: 1500, ValorReembolso: 0, Status: 'Reprovado'
    },
    {
        Matricula: '012347', Nome: 'Carla Dias', Diretoria: 'DAFC', Gerencia: 'Financeiro',
        ValorMaxMes: 946.12, ValorSolicitado: 400, ValorReembolso: 0, Status: 'Recusado por Prazo'
    },
    {
        Matricula: '012348', Nome: 'Daniel Faria', Diretoria: 'Operações', Gerencia: 'Logística',
        ValorMaxMes: 946.12, ValorSolicitado: 946.12, ValorReembolso: 946.12, Status: 'Aprovado'
    },
    {
        Matricula: '012349', Nome: 'Elisa Moreira', Diretoria: 'DAFC', Gerencia: 'Contratos',
        ValorMaxMes: 946.12, ValorSolicitado: null, ValorReembolso: null, Status: 'Não Solicitou'
    },
];

const statusChip = (status: string) => {
    switch (status) {
        case 'Aprovado':
            return <Chip label="Aprovado" color="success" size="small" />;
        case 'Reprovado':
            return <Chip label="Reprovado" color="error" size="small" />;
        case 'Recusado por Prazo':
            return <Chip label="Recusado por Prazo" color="default" size="small" />;
        case 'Não Solicitou':
            return <Chip label="Não Solicitou" color="default" size="small" />;
        default:
            return <Chip label={status} color="info" size="small" />;
    }
};

export default function RelatoriosReembolso() {
    const [competencia, setCompetencia] = useState(dayjs());
    const [busca, setBusca] = useState('');
    const [rows, setRows] = useState(MOCK_ROWS);

    // Filtrar ao digitar
    const filteredRows = rows.filter(row => {
        const value = `${row.Matricula} ${row.Nome} ${row.Diretoria} ${row.Gerencia}`.toLowerCase();
        return value.includes(busca.toLowerCase());
    });

    // Exportar Excel
    const handleExportar = (soAprovados = false) => {
        // Chamar API de export ou baixar o arquivo gerado
        alert(`Exportar Excel: ${soAprovados ? "Aprovados" : "Todos"}`);
    };

    return (
        <Box sx={{ p: 2 }}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h5" fontWeight="bold">
                        Relatórios BAS
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            color="success"
                            onClick={() => handleExportar(false)}
                        >
                            Exportar Excel (Todos)
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            color="primary"
                            onClick={() => handleExportar(true)}
                        >
                            Exportar Excel (Aprovados)
                        </Button>
                    </Stack>
                </Stack>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    alignItems={{ md: 'center' }}
                    mb={2}
                >
                    {/* Mês/Ano Competência */}
                    <TextField
                        label="Mês/Ano Competência"
                        type="month"
                        size="small"
                        value={competencia.format('YYYY-MM')}
                        onChange={e => setCompetencia(dayjs(e.target.value))}
                        sx={{ width: 220 }}
                        inputProps={{
                            max: dayjs().format('YYYY-MM')
                        }}
                    />

                    {/* Busca rápida */}
                    <TextField
                        label="Busca Rápida"
                        placeholder="Nome, Matrícula, Diretoria..."
                        size="small"
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                        sx={{ flex: 1, minWidth: 260 }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />
                </Stack>

                {/* Tabela */}
                <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead>
                            <tr style={{ background: '#f6f8fa' }}>
                                <th style={thStyle}>MATRÍCULA</th>
                                <th style={thStyle}>NOME</th>
                                <th style={thStyle}>DIRETORIA</th>
                                <th style={thStyle}>GERÊNCIA/SUPER</th>
                                <th style={thStyle}>VALOR MÁX. MÊS</th>
                                <th style={thStyle}>VALOR SOLICITADO</th>
                                <th style={thStyle}>VALOR REEMBOLSO</th>
                                <th style={thStyle}>STATUS</th>
                                <th style={thStyle}>LOG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.length === 0 ? (
                                <tr>
                                    <td colSpan={9} style={{ textAlign: 'center', padding: 24, color: '#888' }}>
                                        Nenhum registro encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredRows.map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={tdStyle}>{row.Matricula}</td>
                                        <td style={{ ...tdStyle, fontWeight: 500, color: '#003B4D' }}>{row.Nome}</td>
                                        <td style={tdStyle}>{row.Diretoria}</td>
                                        <td style={tdStyle}>{row.Gerencia}</td>
                                        <td style={tdStyle}>{row.ValorMaxMes !== null ? `R$ ${row.ValorMaxMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</td>
                                        <td style={tdStyle}>{row.ValorSolicitado !== null ? `R$ ${row.ValorSolicitado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</td>
                                        <td style={tdStyle}>{row.ValorReembolso !== null ? `R$ ${row.ValorReembolso.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</td>
                                        <td style={tdStyle}>{statusChip(row.Status)}</td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            <IconButton size="small" color="primary">
                                                <InfoIcon />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </Box>
            </Paper>
        </Box>
    );
}

// Estilos das células (pode jogar no sx se preferir MUI puro)
const thStyle: React.CSSProperties = {
    padding: '12px 8px',
    fontWeight: 600,
    fontSize: 14,
    color: '#444',
    borderBottom: '2px solid #e0e0e0',
    background: '#f7fafd'
};
const tdStyle: React.CSSProperties = {
    padding: '10px 8px',
    fontSize: 14,
    background: '#fff',
};

