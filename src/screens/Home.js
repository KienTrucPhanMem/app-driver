import * as Location from 'expo-location';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import Button from '../components/Button';
import { colors, device, fonts, gStyle } from '../constants';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// components
import TouchText from '../components/TouchText';
import { updateFCMToken } from '../apis/driver';
import { useSelector } from 'react-redux';

import * as TaskManager from 'expo-task-manager';
// icons

const { PROVIDER_GOOGLE } = MapView;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

const Home = ({ navigation }) => {
  const auth = useSelector((state) => state.auth);

  const [showMap, setShowMap] = React.useState(false);
  const [coordinates, setCoords] = React.useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  });
  const [destination, setDestination] = React.useState();
  const [step, setStep] = React.useState(0);
  const [active, setActive] = React.useState(false);

  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  const handleToggleStatus = () => {
    //Call to server
    if (auth) {
      setActive((state) => !state);

      registerForPushNotificationsAsync()
        .then(async (token) => {
          try {
            console.log(auth);
            const res = await updateFCMToken({ id: auth._id, token });

            console.log(res);
          } catch (e) {
            console.log(e);
          }
        })
        .catch((e) => console.log(e));

      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log({ notification });
        });

      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log({ response });
        });
    }
  };

  TaskManager.defineTask(
    'UPDATE_LOCATION',
    ({ data: { locations }, error }) => {
      if (error) {
        // check `error.message` for more details.
        return;
      }
      console.log('Received new locations', locations);
    }
  );

  //Get location
  React.useEffect(() => {
    const getLocation = async () => {
      // get exisiting locaton permissions first
      const { status: existingStatus } =
        await Location.requestForegroundPermissionsAsync();
      let finalStatus = existingStatus;

      // ask again to grant locaton permissions (if not already allowed)
      if (existingStatus !== 'granted') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
      }

      // still not allowed to use location?
      if (finalStatus !== 'granted') {
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync();

      setCoords((state) => ({
        ...state,
        latitude: coords.latitude,
        longitude: coords.longitude
      }));
      setShowMap(true);
    };

    getLocation().catch(console.error);
  }, []);

  React.useEffect(() => {
    Location.startLocationUpdatesAsync('UPDATE_LOCATION', {
      deferredUpdatesInterval: 500
    });

    return () => Location.stopLocationUpdatesAsync('UPDATE_LOCATION');
  }, []);

  //Get notification
  React.useEffect(() => {
    return () => {
      if (notificationListener.current && responseListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [auth]);

  console.log(coordinates);

  return (
    <View style={gStyle.container}>
      {showMap && (
        <MapView
          followsUserLocation
          provider={PROVIDER_GOOGLE}
          region={coordinates}
          showsUserLocation
          style={styles.map}
        >
          {destination ? (
            <Polyline
              coordinates={[coordinates, destination]}
              strokeColor={'21E1E1'}
              strokeWidth={6}
              lineDashPattern={[1]}
            />
          ) : null}
        </MapView>
      )}

      {!showMap && (
        <View style={styles.containerNoLocation}>
          <Text style={styles.textLocationNeeded}>
            We need your location data...
          </Text>
          <TouchText
            onPress={() => Linking.openURL('app-settings:')}
            style={styles.btnGoTo}
            styleText={styles.btnGoToText}
            text="Go To Permissions"
          />
        </View>
      )}

      <View style={styles.toggleStatus}>
        <Button mode="contained" onPress={handleToggleStatus}>
          {active ? 'Dừng nhận chuyến' : 'Bắt đầu nhận chuyến'}
        </Button>
      </View>

      {step !== 0 && (
        <View style={styles.bookButton}>
          {step === 1 && <Button mode="contained">Đặt xe</Button>}

          {step == 2 && (
            <Text style={styles.findingDriver}>Đang tìm tài xế ...</Text>
          )}
        </View>
      )}
    </View>
  );
};

Home.propTypes = {
  // required
  navigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    height: device.height,
    position: 'absolute',
    width: device.width
  },
  containerNoLocation: {
    alignItems: 'center',
    height: device.height,
    justifyContent: 'center',
    position: 'absolute',
    width: device.width
  },
  textLocationNeeded: {
    fontFamily: fonts.uberMedium,
    fontSize: 16,
    marginBottom: 16
  },
  btnGoTo: {
    backgroundColor: colors.black,
    borderRadius: 3,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  btnGoToText: {
    color: colors.white,
    fontFamily: fonts.uberMedium,
    fontSize: 16
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: device.iPhoneNotch ? 58 : 34
  },
  help: {
    textAlign: 'center',
    width: 32
  },
  placeholder: {
    height: 32,
    width: 32
  },
  rightContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    right: 16,
    width: 40
  },
  icon: {
    borderRadius: 18,
    height: 36,
    shadowColor: colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    width: 36
  },
  iconQRCode: {
    backgroundColor: colors.blue,
    marginBottom: 16
  },
  iconShield: {
    backgroundColor: colors.white
  },
  bookButton: {
    position: 'absolute',
    bottom: 60,
    width: device.width - 40,
    alignSelf: 'center'
  },
  toggleStatus: {
    position: 'absolute',
    top: 80,
    width: device.width - 40,
    alignSelf: 'center'
  }
});

export default Home;

async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    });
  }

  return token;
}
