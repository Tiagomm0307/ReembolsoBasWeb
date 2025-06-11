import type { Navigation } from '@toolpad/core/AppProvider';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';

export const AppNavigation: Navigation = [
    { kind: 'header', title: 'Empregado' },
    {
        segment: 'meusReembolsos',
        title: 'Meus Reembolsos',
        icon: <ReceiptIcon />,
    },
    {
        segment: 'novaSolicitacao',
        title: 'Nova Solicitação',
        icon: <PostAddIcon />,
    },
    { kind: 'divider' },
    {
        segment: 'politicaBas',
        title: 'Política BAS',
        icon: <PlagiarismIcon />,
    },
];
