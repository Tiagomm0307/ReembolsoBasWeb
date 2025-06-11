import React from 'react';
import { TextField, Box } from '@mui/material';
import { ControllerRenderProps } from 'react-hook-form';
import { ParamType } from 'types/paramType';

interface Props {
    param: ParamType;
    field: ControllerRenderProps<Record<string, unknown>, string>;
}

const TextFieldTime: React.FC<Props> = ({ param, field }) => {
    return (
        <Box mb={2}>
            <TextField
                fullWidth
                type="time"
                label={param.label}
                slotProps={{ inputLabel: { shrink: true } }}
                {...field}
            />
        </Box>
    );
};

export default TextFieldTime;
