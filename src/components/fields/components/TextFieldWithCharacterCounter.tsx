import React from 'react';
import { TextField, Typography, Box } from '@mui/material';
import { ControllerRenderProps } from 'react-hook-form';
import { ParamType } from 'types/paramType';

interface Props {
    param: ParamType;
    field: ControllerRenderProps<Record<string, unknown>, string>;
}

const TextFieldWithCharacterCounter: React.FC<Props> = ({ param, field }) => {
    const maxLength = param.maxLength ?? 100;
    const value = typeof field.value === 'string' ? field.value : '';

    return (
        <Box>
            <TextField
                fullWidth
                label={param.label}
                slotProps={{ htmlInput: { maxLength } }}
                {...field}
                value={value}
                disabled={param.disabled}
            />
            <Typography variant="caption" display="block" textAlign="right">
                {value.length}/{maxLength}
            </Typography>
        </Box>
    );
};

export default TextFieldWithCharacterCounter;
