import React from 'react';
import { Grid } from '@mui/material';
import { Control, Controller, ControllerRenderProps } from 'react-hook-form';
import { ParamType } from 'types/paramType';

import TextFieldWithCharacterCounter from './components/TextFieldWithCharacterCounter';
import TextFieldEmail from './components/TextFieldEmail';
import TextFieldTime from './components/TextFieldTime';
import AutocompleteField from './components/AutocompleteField';
import AutocompleteMultipleField from './components/AutocompleteMultipleField';
import AutocompleteMultipleCheckboxes from './components/AutocompleteMultipleCheckboxes';
import RadioField from './components/RadioField';
import DatepickerField from './components/DatepickerField';
import DateTimePickerField from './components/DateTimePickerField';
import CurrencyField from './components/CurrencyField';
import MonthYearField from './components/MonthYearField';

// Tipagem do field
type RHFField = ControllerRenderProps<Record<string, unknown>, string>;

// Cada componente recebe param + field
type FieldComponent = React.ComponentType<{ param: ParamType; field: RHFField }>;

// Registry
const componentRegistry: Record<string, FieldComponent> = {
    text: TextFieldWithCharacterCounter,
    email: TextFieldEmail,
    time: TextFieldTime,
    autocomplete: AutocompleteField,
    autocompleteMultiple: AutocompleteMultipleField,
    autocompleteMultipleGroup: AutocompleteMultipleCheckboxes,
    radio: RadioField,
    datepicker: DatepickerField,
    datepickerRange: DatepickerField,
    dateTimePicker: DateTimePickerField,
    currency: CurrencyField,
    monthYear: MonthYearField
};

interface FormDynamicFieldProps {
    params: ParamType[];
    control: Control<Record<string, unknown>>;
}

const FormDynamicField: React.FC<FormDynamicFieldProps> = ({ params, control }) => {
    return (
        <Grid container spacing={2}>
            {params.map((param) => {
                const Component = componentRegistry[param.type];
                if (!Component) return null;

                return (
                    <Grid size={param.gridSize ?? 12} key={param.name}>
                        <Controller
                            name={param.name}
                            control={control}
                            defaultValue={param.value ?? ''}
                            render={({ field }) => <Component param={param} field={field} />}
                        />
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default FormDynamicField;
