import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';

// screens
import Home from '../screens/Home';

// components
import { useDispatch, useSelector } from 'react-redux';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { resetAuth } from '../redux/authSlice';

const Drawer = createDrawerNavigator();

export default ({ navigation }) => {
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!auth.accessToken) {
      navigation.navigate('LoginScreen');
    }
  });

  React.useEffect(() => {
    dispatch(resetAuth());
  }, []);

  if (!auth.accessToken) return null;

  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
};
