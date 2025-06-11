import React from 'react';
import { TextField, Box, InputAdornment } from '@mui/material';
import { ControllerRenderProps } from 'react-hook-form';
import { ParamType } from 'types/paramType';

interface Props {
    param: ParamType;
    field: ControllerRenderProps<Record<string, unknown>, string>;
}

const CurrencyField: React.FC<Props> = ({ param, field }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value.replace(/[^\d,]/g, '');
        field.onChange(rawValue);
    };

    const value = typeof field.value === 'string' ? field.value : '';

    return (
        <Box mb={2}>
            <TextField
                fullWidth
                label={param.label}
                value={value}
                onChange={handleChange}
                slotProps={{
                    input: { startAdornment: <InputAdornment position="start">R$</InputAdornment> }
                }}
            />
        </Box>
    );
};

export default CurrencyField;
