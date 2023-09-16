import React from 'react';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from '@gluestack-ui/themed';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import {Picker} from '@react-native-picker/picker';
import {useApp} from '@/contexts/AppContext';

type Props<T extends FieldValues> = {
  size?: 'sm' | 'md' | 'lg';
  label: string;
  name: Path<T>;
  rules?: RegisterOptions;
  control: Control<T>;
  enabled?: boolean;
};

const JenisUsahaPicker = <T extends FieldValues>({
  size,
  label,
  name,
  rules,
  control,
  enabled,
}: Props<T>) => {
  // const [data, setData] = React.useState([]);
  const {request} = useApp();
  const loadData = React.useCallback(() => {
    request.get('/meta-data/jenis-usaha').then(
      response => {
        console.log(response.data.rows);
      },
      err => {
        console.log(err.response.data);
      },
    );
  }, [request]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <FormControl size={size}>
      <FormControlLabel>
        <FormControlLabelText fontWeight="bold">{label}</FormControlLabelText>
      </FormControlLabel>
      <Controller
        name={name}
        rules={rules}
        control={control}
        render={({field: {onChange, value}}) => {
          return (
            <Picker
              enabled={enabled || true}
              mode="dialog"
              selectedValue={value}
              onValueChange={itemValue => {
                onChange(itemValue);
              }}>
              {/* {PickerItems()} */}
            </Picker>
          );
        }}
      />
    </FormControl>
  );
};

export default JenisUsahaPicker;
