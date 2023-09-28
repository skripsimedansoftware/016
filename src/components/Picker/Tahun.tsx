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

type Props<T extends FieldValues> = {
  size?: 'sm' | 'md' | 'lg';
  label: string;
  name: Path<T>;
  rules?: RegisterOptions;
  control: Control<T>;
  enabled?: boolean;
};

const TahunPicker = <T extends FieldValues>({
  size,
  label,
  name,
  rules,
  control,
  enabled,
}: Props<T>) => {
  const [data, setData] = React.useState<React.ReactElement[]>([]);
  const loadData = React.useCallback(() => {
    const years: number[] = [];
    for (let year = 2018; year <= 2040; year++) {
      years.push(year);
    }

    const items = years
      .sort((a, b) => b - a)
      .map((val, key) => (
        <Picker.Item key={key} label={val.toString()} value={val.toString()} />
      ));

    setData(items);
  }, []);

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
              enabled={enabled}
              mode="dialog"
              selectedValue={value}
              onValueChange={itemValue => {
                onChange(itemValue);
              }}>
              {data}
            </Picker>
          );
        }}
      />
    </FormControl>
  );
};

export default TahunPicker;
