import { Stack, Typography } from '@mui/material';
import { ReembolsoPendentesRow } from 'types/reembolsoPendentesRow';

interface Props {
    row: ReembolsoPendentesRow;
}

export function TabsDadosEmpregado({ row }: Props) {
    return (
        <Stack spacing={1}>
            <Typography><b>Nome:</b>   Nome: Mariana Lima</Typography>
            <Typography><b>Cargo:</b> Cargo: Empregado (Exemplo)</Typography>
            <Typography><b>Valor Máximo Mensal do Perfil:</b>  Valor Máximo Mensal do Perfil: R$ 946,12 (Exemplo)</Typography>
        </Stack>
    );
}
