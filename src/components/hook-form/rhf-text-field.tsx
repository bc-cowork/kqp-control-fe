import type { InputLabelProps } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import { InputLabel } from '@mui/material';
import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  label?: string;
  InputLabelProps?: InputLabelProps;
};

export function RHFTextField({ name, helperText, type, label, InputLabelProps, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          {label && (
            <InputLabel htmlFor={name} sx={{ mb: 0.4 }} {...InputLabelProps}>
              {label}
            </InputLabel>
          )}
          <TextField
            {...field}
            fullWidth
            type={type}
            value={type === 'number' && field.value === 0 ? '' : field.value}
            onChange={(event) => {
              if (type === 'number') {
                field.onChange(Number(event.target.value));
              } else {
                field.onChange(event.target.value);
              }
            }}
            error={!!error}
            helperText={error?.message ?? helperText}
            inputProps={{
              autoComplete: 'off',
              id: name,
            }}
            {...other}
          />
        </>
      )}
    />
  );
}
