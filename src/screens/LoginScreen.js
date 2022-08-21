import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { login } from '../apis/auth';
import { getDriverByPhone } from '../apis/driver';
import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import Logo from '../components/Logo';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import { passwordValidator } from '../helpers/passwordValidator';
import { phoneValidator } from '../helpers/phoneValidator';
import { setAuth } from '../redux/authSlice';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const onLoginPressed = async () => {
    const phoneError = phoneValidator(phone.value);
    const passwordError = passwordValidator(password.value);
    if (phoneError || passwordError) {
      setPhone({ ...phone, error: phoneError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      const res = await login({ phone: phone.value, password: password.value });
      const infoRes = await getDriverByPhone({ phone: phone.value });

      console.log(res);
      console.log(infoRes);

      dispatch(setAuth({ ...res, ...infoRes }));
      navigation.navigate('DrawerStack');
    } catch (e) {
      console.log({ e });
      setError(e?.response?.data?.error?.message || 'Hệ thống bảo trì');
    }
  };

  return (
    <Background>
      <Logo />
      <Header>Welcome back.</Header>
      <TextInput
        label="Phone"
        returnKeyType="next"
        value={phone.value}
        onChangeText={(text) => {
          setPhone({ value: text, error: '' });
          setError('');
        }}
        error={!!phone.error}
        errorText={phone.error}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => {
          setPassword({ value: text, error: '' });
          setError('');
        }}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24
  },
  row: {
    flexDirection: 'row',
    marginTop: 4
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  error: {
    color: 'red',
    marginTop: 4,
    marginBottom: 4
  }
});
