import React from 'react';
import {
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputInput,
} from '@gluestack-ui/themed';
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  RegisterOptions,
  Path,
} from 'react-hook-form';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import {Picker} from '@react-native-picker/picker';

export type PickerItem = {label: string; value: string};
type Props<T extends FieldValues> = {
  name: Path<T>;
  size?: 'sm' | 'md' | 'lg';
  label: string;
  placeholder?: string;
  error: FieldError | undefined;
  required?: boolean;
  rules: RegisterOptions;
  invalid?: boolean;
  control: Control<T>;
  helperText?: string;
  isFile?: boolean;
  isImage?: boolean;
  isMultiple?: boolean;
  isPicker?: boolean;
  pickerData?: PickerItem[];
  pickerEnable?: boolean;
  pickerOnChange?: Function;
};

const Icon = (name: any, size: number) => <Ionicons name={name} size={size} />;

const AppForm = <T extends FieldValues>({
  name,
  size,
  label,
  placeholder,
  required,
  rules,
  invalid,
  control,
  helperText,
  error,
  isFile,
  isImage,
  isMultiple,
  isPicker,
  pickerData,
  pickerEnable,
  pickerOnChange,
}: Props<T>) => {
  const [cameraPermission, requestCameraPermission] =
    ImagePicker.useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  React.useEffect(() => {
    if (!mediaLibraryPermission?.granted) {
      requestCameraPermission();
    }

    if (!mediaLibraryPermission?.granted) {
      requestMediaLibraryPermission();
    }
  }, [
    cameraPermission,
    requestCameraPermission,
    mediaLibraryPermission,
    requestMediaLibraryPermission,
  ]);

  const PickerItems = () => {
    const items: React.ReactElement[] = [];
    console.log({pickerData});
    pickerData?.forEach((item, key) => {
      items.push(
        <Picker.Item key={key} label={item.label} value={item.value} />,
      );
    });

    return items;
  };

  return (
    <FormControl
      size={size}
      isInvalid={invalid || false}
      isRequired={required || false}
      shadowRadius={20}>
      <FormControlLabel>
        <FormControlLabelText fontWeight="bold">{label}</FormControlLabelText>
      </FormControlLabel>
      <Controller
        name={name}
        rules={rules}
        control={control}
        render={({field: {onBlur, onChange, value}}) => {
          if (isPicker && pickerData) {
            console.log('pickerData');
            return (
              <Picker
                enabled={pickerEnable || true}
                mode="dialog"
                selectedValue={value}
                onValueChange={itemValue => {
                  onChange(itemValue);
                  if (pickerOnChange) {
                    pickerOnChange(itemValue);
                  }
                }}>
                {PickerItems()}
              </Picker>
            );
          }
          return isFile ? (
            <Button
              size="sm"
              w={140}
              onPress={async () => {
                let result;
                if (isImage) {
                  const {assets, canceled} =
                    await ImagePicker.launchImageLibraryAsync({
                      mediaTypes: ImagePicker.MediaTypeOptions.Images,
                      quality: 1,
                    });

                  if (!canceled) {
                    if (isMultiple) {
                      result = assets.map(item => item.uri);
                    } else {
                      result = assets[0].uri;
                    }
                  }
                } else {
                  result = DocumentPicker.getDocumentAsync({
                    multiple: false,
                  });
                }

                if (result) {
                  onChange(result);
                }
              }}>
              <ButtonText>{label}</ButtonText>
            </Button>
          ) : (
            <Input>
              <InputInput
                type="text"
                placeholder={placeholder}
                placeholderTextColor={'gray'}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </Input>
          );
        }}
      />
      <FormControlHelper>
        <FormControlHelperText>{helperText}</FormControlHelperText>
      </FormControlHelper>
      {error?.message && (
        <FormControlError>
          <FormControlErrorIcon as={() => Icon('alert-circle-outline', 20)} />
          <FormControlErrorText>{error.message}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};

export default AppForm;