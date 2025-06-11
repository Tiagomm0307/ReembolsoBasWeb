import React from 'react';
import {
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
} from '@mui/material';
import { ControllerRenderProps } from 'react-hook-form';
import { ParamType } from 'types/paramType';

interface Props {
    param: ParamType;
    field: ControllerRenderProps<Record<string, unknown>, string>;
}

const RadioField: React.FC<Props> = ({ param, field }) => {
    const options = (param.options ?? []) as string[];
    const value = typeof field.value === 'string' ? field.value : '';

    return (
        <Box mb={2}>
            <FormControl component="fieldset">
                <FormLabel component="legend">{param.label}</FormLabel>
                <RadioGroup {...field} value={value}>
                    {options.map((opt) => (
                        <FormControlLabel
                            key={opt}
                            value={opt}
                            control={<Radio />}
                            label={opt}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </Box>
    );
};

export default RadioField;
