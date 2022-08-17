import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getPlaces } from '../apis/place';
import TextInput from '../components/TextInput';
import { colors, device, fonts } from '../constants';

// icons

const WhereTo = ({ onPlaceClick }) => {
  const [places, setPlaces] = React.useState([]);

  const debounceId = React.useRef();

  const handleTextChange = (text) => {
    if (debounceId.current) {
      clearTimeout(debounceId.current);
    }

    debounceId.current = setTimeout(async () => {
      if (!text) {
        setPlaces([]);
        if (onPlaceClick) onPlaceClick(undefined);
        return;
      }

      console.log('Call api');

      try {
        const res = await getPlaces({
          query: text,
          country: 'VN',
          limit: 5
        });

        setPlaces(res.data.data);
      } catch (e) {
        console.log(e);
      }
    }, 800);
  };

  const handlePlacePress = (place) => {
    if (onPlaceClick) {
      setPlaces([]);
      onPlaceClick(place);
    }
  };

  console.log(places);

  return (
    <View style={styles.container}>
      <View style={styles.containerBanner}>
        <Text style={styles.bannerText}>Nhập địa chỉ bạn muốn đến</Text>
        <Text style={styles.bannerMuted}>Bike</Text>
      </View>

      <View style={styles.containerInput}>
        <TextInput
          returnKeyType="next"
          onChangeText={handleTextChange}
          placeholder="Đi đến"
        />
      </View>

      {places.length > 0 && (
        <View style={styles.placeList}>
          {places.map((place, index) =>
            place.number && place.street ? (
              <Text
                style={styles.placeItem}
                key={index}
                onPress={() => handlePlacePress(place)}
              >{`${place.number || ''} ${place.street || ''} ${
                place.county || ''
              } ${place.region || ''} ${place.country || ''}`}</Text>
            ) : null
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    position: 'absolute',
    shadowColor: colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    top: device.iPhoneNotch ? 144 : 120,
    width: device.width - 40
  },
  containerBanner: {
    backgroundColor: colors.green,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  bannerText: {
    color: colors.white,
    fontFamily: fonts.uberMedium,
    fontSize: 12
  },
  bannerMuted: {
    color: colors.mint,
    fontFamily: fonts.uberMedium,
    fontSize: 12
  },
  containerInput: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flexDirection: 'row',
    height: 48
  },
  containerSquare: {
    alignItems: 'center',
    flex: 2
  },
  square: {
    backgroundColor: colors.black,
    height: 8,
    width: 8
  },
  text: {
    color: colors.greyAbbey,
    flex: 8,
    fontFamily: fonts.uberMedium,
    fontSize: 20
  },
  containerIcon: {
    alignItems: 'center',
    borderLeftColor: colors.greyMercury,
    borderLeftWidth: 1,
    flex: 2
  },
  placeList: {
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 2,
    padding: 16
  },
  placeItem: {
    marginTop: 16,
    fontSize: 16
  }
});

export default WhereTo;
