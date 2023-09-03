import React from 'react';
import {FlatList} from 'react-native';
import {Box, Text} from '@gluestack-ui/themed';
import {useApp} from '@/contexts/AppContext';
import ListEmptyItem from '@/components/ListEmptyItem';

type Activity = {
  id: string;
  name: string;
};

type RenderItemProp = {item: Activity};
const RenderItem: React.FC<RenderItemProp> = ({item}) => {
  return (
    <Box>
      <Text>{item.name}</Text>
    </Box>
  );
};

const ActivityScreen = () => {
  const [data, setData] = React.useState<Activity[]>([]);
  const {request, authInfo} = useApp();

  React.useEffect(() => {
    if (authInfo?.jabatan === 'admin') {
      request.get('/daftar-usaha/status/pengajuan').then(response => {
        if (response.data.rows) {
          setData(response.data.rows);
        }
      }, console.log);
    }
  }, [request, authInfo]);

  return (
    <Box flex={1} borderWidth={0} borderTopColor="black" borderTopWidth={1}>
      <FlatList
        data={data}
        renderItem={props => <RenderItem item={props.item} />}
        ListEmptyComponent={ListEmptyItem}
      />
    </Box>
  );
};

export default ActivityScreen;
