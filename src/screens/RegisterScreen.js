import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, RadioButton } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { emailValidator } from '../helpers/emailValidator';
import { passwordValidator } from '../helpers/passwordValidator';
import { nameValidator } from '../helpers/nameValidator';
import { phoneValidator } from '../helpers/phoneValidator';
import { getDriverByPhone } from '../apis/driver';
import { register } from '../apis/auth';
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/authSlice';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' });
  const [phone, setPhone] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const phoneError = phoneValidator(phone.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || phoneError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setPhone({ ...name, error: phoneError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });

      return;
    }

    try {
      const data = {
        phone: phone.value,
        password: password.value,
        fullName: name.value,
        email: email.value
      };

      const res = await register(data);

      delete data.password;

      const infoRes = await getDriverByPhone({ phone: phone.value });

      dispatch(
        setAuth({
          ...res,
          ...infoRes
        })
      );
      navigation.navigate('DrawerStack');
    } catch (e) {
      console.log({ e });
      setError(e?.response?.data?.error?.message || 'Hệ thống bảo trì');
    }
  };

  return (
    <Background>
      <Logo />
      <Header>Create Account</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => {
          setName({ value: text, error: '' });
          setError('');
        }}
        error={!!name.error}
        errorText={name.error}
      />
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
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => {
          setEmail({ value: text, error: '' });
          setError('');
        }}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
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
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4
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
