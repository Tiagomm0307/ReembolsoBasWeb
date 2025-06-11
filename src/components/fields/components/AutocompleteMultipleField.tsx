import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import { ControllerRenderProps } from 'react-hook-form';
import { ParamType } from 'types/paramType';

interface Props {
    param: ParamType;
    field: ControllerRenderProps<Record<string, unknown>, string>;
}

const AutocompleteMultipleField: React.FC<Props> = ({ param, field }) => {
    const options = (param.options ?? []) as { label: string; value: string }[];
    const value = Array.isArray(field.value) ? field.value : [];

    return (
        <Box mb={2}>
            <Autocomplete
                multiple
                options={options}
                getOptionLabel={(opt) => typeof opt === 'string' ? opt : opt.label}
                value={options.filter(opt =>
                    value.includes(typeof opt === 'string' ? opt : opt.value)
                )}
                onChange={(_, newValues) => {
                    const valuesOnly = newValues.map(v => typeof v === 'string' ? v : v.value);
                    field.onChange(valuesOnly);
                }}
                isOptionEqualToValue={(opt, val) =>
                    (typeof opt === 'string' ? opt : opt.value) ===
                    (typeof val === 'string' ? val : val.value)
                }
                renderInput={(params) => <TextField {...params} label={param.label} fullWidth />}
            />
        </Box>
    );
};

export default AutocompleteMultipleField;
