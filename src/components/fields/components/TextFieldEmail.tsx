import React from 'react';
import { TextField, Box } from '@mui/material';
import { ControllerRenderProps } from 'react-hook-form';
import { ParamType } from 'types/paramType';

interface Props {
    param: ParamType;
    field: ControllerRenderProps<Record<string, unknown>, string>;
}

const TextFieldEmail: React.FC<Props> = ({ param, field }) => (
    <Box mb={2}>
        <TextField
            fullWidth
            type="email"
            label={param.label}
            {...field} // inclui name, value, onChange, onBlur
        />
    </Box>
);

export default TextFieldEmail;
