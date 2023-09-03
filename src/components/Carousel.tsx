import React from 'react';
import {Image} from '@gluestack-ui/themed';
import {Animated, Dimensions, ScrollView, StyleSheet, View} from 'react-native';

const {width} = Dimensions.get('window');
const data = Array.from({length: 10});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 0,
    height: 20,
  },
  indicatorConatiner: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#00000044',
    marginHorizontal: 5,
  },
  activeIndicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
});

const Indicator = () => <View style={styles.indicator} />;

const Carousel = () => {
  const scrollValue = React.useRef(new Animated.Value(0)).current;
  const translateX = scrollValue.interpolate({
    inputRange: [0, width + width / 5],
    outputRange: [0, 26],
  });
  const inputRange = [0];
  const scaleOutputRange = [1];

  data.forEach(
    (_, i) =>
      i !== 0 && inputRange.push(...[(width * (2 * i - 1)) / 2, width * i]),
  );
  data.forEach((_, i) => i !== 0 && scaleOutputRange.push(...[1, 1]));

  const scaleX = scrollValue.interpolate({
    inputRange,
    outputRange: scaleOutputRange,
  });

  const additionalStyles = StyleSheet.create({
    image: {
      borderWidth: 0,
      borderColor: 'black',
      alignSelf: 'center',
      marginHorizontal: 4.8,
    },
    animatedView: {
      position: 'absolute',
      transform: [{translateX}, {scaleX}],
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollValue}}}],
          {
            useNativeDriver: false,
          },
        )}>
        {data.map((val, key) => (
          <Image
            source={{
              uri: 'https://cloud.jpnn.com/photo/arsip/normal/2023/06/05/pekan-raya-sumatera-utara-prsu-ke-49-akan-kembali-digelar-5p-0grn.jpg',
            }}
            alt="Image"
            size="xl"
            w={width - 42}
            h="100%"
            key={key}
            borderRadius={10}
            style={additionalStyles.image}
            backgroundColor="transparent"
          />
        ))}
      </ScrollView>
      <View style={styles.indicatorConatiner} pointerEvents="none">
        {data.map((val, key) => (
          <Indicator key={key} />
        ))}
        <Animated.View
          style={[styles.activeIndicator, additionalStyles.animatedView]}
        />
      </View>
    </View>
  );
};

export default Carousel;
