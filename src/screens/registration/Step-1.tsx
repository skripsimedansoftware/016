import React from 'react';
import {Box, Button, ButtonText, HStack, VStack} from '@gluestack-ui/themed';
import {useForm} from 'react-hook-form';
import AppForm from '@/components/Form';

interface IForm {
  nik: string | number;
  nomor_hp: string | number;
  fotocopy_ktp: string | null;
  fotocopy_kk: string | null;
  fotocopy_npwp: string | null;
}

const RegistrationStep1 = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<IForm>({
    defaultValues: {
      nik: '',
      nomor_hp: '',
      fotocopy_kk: null,
      fotocopy_ktp: null,
      fotocopy_npwp: null,
    },
  });

  React.useEffect(() => {
    console.log({errors});
  }, [errors]);

  const onSubmit = (data: IForm) => {
    const formData = new FormData();

    // Menggunakan loop untuk mengakses properti-properti objek IForm
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key] as string);
      }
    }
    console.log('submited', formData, data);
  };

  return (
    <Box borderWidth={0} padding={20} borderTopWidth={1}>
      <HStack borderWidth={0} borderColor="red">
        <VStack space="md" borderWidth={0} width={'100%'}>
          <AppForm<IForm>
            control={control}
            name="nik"
            label="NIK"
            placeholder="NIK"
            helperText="Nomor Induk Kependudukan"
            rules={{required: 'Silahkan masukkan NIK Anda'}}
            invalid={typeof errors.nik?.message !== 'undefined'}
            required
            error={errors.nik}
          />
          <AppForm
            control={control}
            name="nomor_hp"
            label="Nomor HP"
            placeholder="Nomor HP"
            helperText="Nomor Seluler"
            rules={{required: 'Silahkan masukkan nomor HP Anda'}}
            invalid={typeof errors.nomor_hp?.type !== 'undefined'}
            required
            error={errors.nomor_hp}
          />
          <AppForm
            control={control}
            name="fotocopy_kk"
            label="Scan KK"
            helperText="Scan KK"
            rules={{required: 'Silahkan pilih file Scan KK Anda'}}
            invalid={typeof errors.fotocopy_kk?.type !== 'undefined'}
            required
            error={errors.fotocopy_kk}
            isFile
            isImage
          />
          <AppForm
            control={control}
            name="fotocopy_ktp"
            label="Scan KTP"
            helperText="Scan KTP"
            rules={{required: 'Silahkan pilih file scan KTP Anda'}}
            invalid={typeof errors.fotocopy_ktp?.type !== 'undefined'}
            required
            error={errors.fotocopy_ktp}
            isFile
            isImage
          />
          <AppForm
            control={control}
            name="fotocopy_npwp"
            label="Scan NPWP"
            helperText="Scan NPWP"
            rules={{required: 'Silahkan pilih file Scan NPWP Anda'}}
            invalid={typeof errors.fotocopy_npwp?.type !== 'undefined'}
            required
            error={errors.fotocopy_npwp}
            isFile
            isImage
          />
          <Button onPress={handleSubmit(onSubmit)}>
            <ButtonText>Kirim</ButtonText>
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
};

export default RegistrationStep1;
