import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Button,
    Box
} from '@mui/material';
import { Download } from 'lucide-react';
import apiClient from 'api/client';

interface Politica {
    Id: number;
    Codigo: string;
    Revisao: string;
    DataPublicacao: string;
    CaminhoArquivo: string;
    Vigente: boolean;
}

export default function PoliticaBas() {
    const [politica, setPolitica] = useState<Politica | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolitica = async () => {
            try {
                const { data } = await apiClient.get<Politica[]>('/Politicas/ativas');
                if (data.length > 0) {
                    // Seleciona a mais recente
                    const maisRecente = data.reduce((a, b) =>
                        new Date(a.DataPublicacao) > new Date(b.DataPublicacao) ? a : b
                    );

                    setPolitica(maisRecente);

                    // Baixa o PDF (como Blob)
                    const response = await apiClient.get(`/Politicas/download/${maisRecente.Id}`, {
                        responseType: 'blob'
                    });

                    const blobUrl = URL.createObjectURL(response.data);
                    setPdfUrl(blobUrl);
                }
            } catch (error) {
                console.error('Erro ao buscar política:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPolitica();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!politica || !pdfUrl) {
        return (
            <Typography color="error" align="center" mt={4}>
                Nenhuma política disponível no momento.
            </Typography>
        );
    }

    return (
        <Card className="p-6">
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Política de Reembolso BAS
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                    {politica.Codigo} - Revisão {politica.Revisao} (
                    {new Date(politica.DataPublicacao).toLocaleDateString()})
                </Typography>

                <Box
                    mt={2}
                    mb={2}
                    sx={{
                        height: 500,
                        border: '1px solid #ccc',
                        borderRadius: 1,
                        overflow: 'hidden'
                    }}
                >
                    <iframe
                        src={pdfUrl}
                        width="100%"
                        height="100%"
                        title="Política BAS"
                        style={{ border: 'none' }}
                    />
                </Box>

                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Download />}
                    href={pdfUrl}
                    download={politica.CaminhoArquivo}
                    target="_blank"
                >
                    {politica.Codigo} - Revisão {politica.Revisao}
                </Button>
            </CardContent>
        </Card>
    );
}
