import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { ControllerRenderProps } from 'react-hook-form';
import { ParamType } from 'types/paramType';

interface Props {
    param: ParamType;
    field: ControllerRenderProps<Record<string, unknown>, string>;
}

const DatepickerField: React.FC<Props> = ({ param, field }) => {
    const parsedValue = typeof field.value === 'string'
        ? dayjs(field.value, 'DD/MM/YYYY')
        : dayjs.isDayjs(field.value)
            ? field.value
            : null;
    return (
        <Box mb={2}>
            <DatePicker
                label={param.label}
                value={parsedValue}
                onChange={(newValue) => {
                    if (dayjs.isDayjs(newValue) && newValue.isValid()) {
                        field.onChange(newValue.format('DD/MM/YYYY'));
                    }
                }}
                format="DD/MM/YYYY"
                slotProps={{
                    textField: {
                        fullWidth: true,
                    },
                }}
            />
        </Box>
    );
};

export default DatepickerField;
