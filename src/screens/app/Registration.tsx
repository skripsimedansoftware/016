import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import asyncStorage from '@react-native-async-storage/async-storage';
import {useApp} from '@/contexts/AppContext';
import {UsahaStatus} from '@/interfaces/App';
import LottieLoader from '@/components/LottieLoader';
import {
  AppStackNavigatorParams,
  RegistrationStep,
} from '@/interfaces/NavigatorParams';
import RegistrationStep1 from '../registration/Step-1';
import RegistrationStep2 from '../registration/Step-2';
import RegistrationStep3 from '../registration/Step-3';
import RegistrationStep4 from '../registration/Step-4';
import RegistrationStep5 from '../registration/Step-5';
import RegistrationOverview from '../registration/Overview';

type Props = NativeStackScreenProps<AppStackNavigatorParams, 'Registration'>;

type SavedState = {
  step: RegistrationStep;
  data: any;
};

const RegistrationScreen: React.FC<Props> = ({route, navigation}) => {
  const [usahaStatus, setUsahaStatus] = React.useState<UsahaStatus>(
    route.params?.usahaStatus || 'melengkapi',
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [savedRegistration, setSavedRegistration] = React.useState<SavedState>({
    step: undefined,
    data: {},
  });
  const {request} = useApp();

  const checkRegistrationStatus = React.useCallback(async () => {
    setIsLoading(true);
    const lastSaved = await asyncStorage.getItem('registration');

    if (!route.params?.skipCheck) {
      request
        .get<{id: number; owner: number; status: UsahaStatus}>(
          '/daftar-usaha/mine',
        )
        .then(
          response => {
            setIsLoading(false);
            setUsahaStatus(response.data.status);
            if (savedRegistration.step && !route.params?.step) {
              navigation.setParams({
                ...route.params,
                step: savedRegistration.step,
              });
            }
          },
          () => {
            setIsLoading(false);
          },
        );
    } else {
      setIsLoading(false);
    }

    if (lastSaved !== null) {
      const parsed = JSON.parse(lastSaved);
      setSavedRegistration(parsed);
    }
  }, [route.params, navigation, savedRegistration.step, request]);

  if (route.params?.submitStep) {
    const newData = Object.assign(savedRegistration.data, {
      [`step_${route.params.submitStep.step}`]: route.params.submitStep.data,
    });

    asyncStorage.setItem(
      'registration',
      JSON.stringify({
        step: route.params.step,
        data: newData,
      }),
    );
  }

  React.useEffect(() => {
    checkRegistrationStatus();
  }, [checkRegistrationStatus]);

  if (isLoading) {
    return <LottieLoader message="Mengambil Sesi" />;
  }

  switch (route.params?.step) {
    case 1:
      return (
        <RegistrationStep1
          savedForm={savedRegistration.data[`step_${route.params.step}`]}
        />
      );
    case 2:
      return (
        <RegistrationStep2
          savedForm={savedRegistration.data[`step_${route.params.step}`]}
        />
      );
    case 3:
      return (
        <RegistrationStep3
          savedForm={savedRegistration.data[`step_${route.params.step}`]}
        />
      );
    case 4:
      return (
        <RegistrationStep4
          savedForm={savedRegistration.data[`step_${route.params.step}`]}
        />
      );
    case 5:
      return (
        <RegistrationStep5
          savedForm={savedRegistration.data[`step_${route.params.step}`]}
        />
      );
    default:
      return <RegistrationOverview status={usahaStatus} />;
  }
};

export default RegistrationScreen;
