import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import { ControllerRenderProps } from 'react-hook-form';
import { ParamType } from 'types/paramType';

interface Props {
    param: ParamType;
    field: ControllerRenderProps<Record<string, unknown>, string>;

}

const AutocompleteField: React.FC<Props> = ({ param, field }) => {
    const options = (param.options ?? []) as { label: string; value: string }[];

    return (
        <Box mb={2}>
            <Autocomplete
                options={options}
                getOptionLabel={(opt) => typeof opt === 'string' ? opt : opt.label}
                value={options.find(o => o.value === field.value) ?? null}
                onChange={(_, newValue) => field.onChange(newValue?.value ?? '')}
                isOptionEqualToValue={(opt, val) =>
                    (typeof opt === 'string' ? opt : opt.value) ===
                    (typeof val === 'string' ? val : val.value)
                }
                renderInput={(params) => (
                    <TextField {...params} label={param.label} fullWidth />
                )}
                fullWidth

                disabled={param.disabled}
            />
        </Box>
    );
};

export default AutocompleteField;
