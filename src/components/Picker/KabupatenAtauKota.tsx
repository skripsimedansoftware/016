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
  provinsi: string | undefined;
};

const KabupatenAtauKotaPicker = <T extends FieldValues>({
  size,
  label,
  name,
  rules,
  control,
  enabled,
  provinsi,
}: Props<T>) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const {request} = useApp();
  const loadData = React.useCallback(() => {
    setLoading(true);
    request.get('/meta-data/regencies/' + provinsi).then(
      response => {
        if (response.data?.rows) {
          const items = response.data.rows.map(
            (row: {id: number; name: string}) => {
              return (
                <Picker.Item key={row.id} label={row.name} value={row.id} />
              );
            },
          );
          setData(items);
          setLoading(false);
        }
      },
      err => {
        setLoading(false);
        console.log(err.response.data);
      },
    );
  }, [request, provinsi]);

  React.useEffect(() => {
    if (enabled) {
      loadData();
    }
  }, [loadData, enabled, provinsi]);

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
              enabled={enabled || !loading}
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

export default KabupatenAtauKotaPicker;
