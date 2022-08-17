import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

// drawer stack
import DrawerStack from './DrawerStack';

// screens
import LoginScreen from '../screens/LoginScreen';
import ModalQRCode from '../screens/ModalQRCode';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default () => {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: 'fullScreenModal'
      }}
    >
      <Stack.Screen
        name="DrawerStack"
        component={DrawerStack}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="ModalQRCode"
        component={ModalQRCode}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};
