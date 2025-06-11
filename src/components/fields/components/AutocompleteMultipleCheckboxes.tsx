import React from 'react';
import {
    Autocomplete,
    Checkbox,
    TextField,
    Box,
} from '@mui/material';
import { ControllerRenderProps } from 'react-hook-form';
import { ParamType } from 'types/paramType';

interface Props {
    param: ParamType;
    field: ControllerRenderProps<Record<string, unknown>, string>;
}

const AutocompleteMultipleCheckboxes: React.FC<Props> = ({ param, field }) => {
    const options = (param.options ?? []) as { label: string; value: string }[];
    const value = Array.isArray(field.value) ? field.value : [];

    return (
        <Box mb={2}>
            <Autocomplete
                multiple
                disableCloseOnSelect
                options={options}
                value={value}
                onChange={(_, newValue) => field.onChange(newValue)}
                isOptionEqualToValue={(option, val) => option === val}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Checkbox checked={selected} style={{ marginRight: 8 }} />
                        {typeof option === 'string' ? option : option.label}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField {...params} label={param.label} fullWidth />
                )}
                fullWidth
            />
        </Box>
    );
};

export default AutocompleteMultipleCheckboxes;
