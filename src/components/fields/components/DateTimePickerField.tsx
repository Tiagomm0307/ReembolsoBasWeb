import React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { ControllerRenderProps } from 'react-hook-form';
import { ParamType } from 'types/paramType';

interface Props {
    param: ParamType;
    field: ControllerRenderProps<Record<string, unknown>, string>;
}

const DateTimePickerField: React.FC<Props> = ({ param, field }) => {
    const value = typeof field.value === 'string' ? dayjs(field.value) : null;

    return (
        <Box mb={2}>
            <DateTimePicker
                label={param.label}
                value={value}
                onChange={(newValue) => {
                    if (dayjs.isDayjs(newValue)) {
                        field.onChange(newValue.toISOString());
                    }
                }}
                slotProps={{
                    textField: {
                        fullWidth: true,
                    },
                }}
            />
        </Box>
    );
};

export default DateTimePickerField;
