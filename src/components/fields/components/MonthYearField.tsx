import React from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { ControllerRenderProps } from 'react-hook-form';
import { ParamType } from 'types/paramType';

interface Props {
    param: ParamType;
    field: ControllerRenderProps<Record<string, unknown>, string>;
}

const MonthYearField: React.FC<Props> = ({ param, field }) => {
    const value = typeof field.value === 'string' ? dayjs(field.value, 'MM/YYYY') : null;

    return (
        <Box mb={2}>
            <DatePicker
                views={['year', 'month']}
                label={param.label}
                value={value}
                onChange={(newValue) => {
                    if (dayjs.isDayjs(newValue)) {
                        field.onChange(newValue.format('MM/YYYY'));
                    }
                }}
                format="MMMM [de] YYYY"
                slotProps={{ textField: { fullWidth: true } }}
            />
        </Box>
    );
};

export default MonthYearField;
