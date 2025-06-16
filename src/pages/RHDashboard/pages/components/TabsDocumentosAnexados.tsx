import { Stack, Typography, Link, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

export function TabsDocumentosAnexados() {
    // Dados mockados igual à sua imagem
    const documentos = [
        { nomeArquivo: "comprovante_01.pdf", url: "#" },
        { nomeArquivo: "nota_fiscal_consulta.jpg", url: "#" },
    ];

    return (
        <Stack spacing={2}>
            <List>
                {documentos.map((doc, idx) => (
                    <ListItem key={idx} sx={{ p: 0, alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ minWidth: 0, mr: 1, mt: '3px' }}>
                            <Typography component="span" variant="body1" color="text.primary">•</Typography>
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Link
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="hover"
                                    color="primary"
                                    sx={{ fontWeight: 500, fontSize: '1rem', display: 'inline-flex', alignItems: 'center' }}
                                >
                                    {doc.nomeArquivo}
                                    <DownloadIcon fontSize="small" sx={{ ml: 1 }} />
                                </Link>
                            }
                        />
                    </ListItem>
                ))}
            </List>
            <Typography color="text.secondary" sx={{ mt: 2, fontSize: '0.95rem' }}>
                Clique nos links para o download.
            </Typography>
        </Stack>
    );
}
