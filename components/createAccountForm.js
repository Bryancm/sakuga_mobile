import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { Text, Icon, Layout, Input, Button } from '@ui-kitten/components';
import { registerUser } from '../api/user';
import { sha1 } from 'react-native-sha1';
import { storeData } from '../util/storage';
import { scale } from 'react-native-size-matters';

const EmailIcon = (props) => <Icon {...props} name="email-outline" />;
const PersonIcon = (props) => <Icon {...props} name="person-outline" />;
const LockIcon = (props) => <Icon {...props} name="lock-outline" />;

export const CreateAccountForm = ({ loadUser, from, navigateBack, navigatePostList }) => {
  const [user, setUser] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const error = (errors) => {
    setLoading(false);
    setErrors(errors);
  };

  const createAccount = async () => {
    try {
      setLoading(true);
      setErrors([]);
      if (!user || !password) return error(['user and password are obligatory']);
      if (password !== confirmPassword) return error(['passwords not match']);
      const response = await registerUser({ user, email, password, confirmPassword });
      if (response.errors) return error(response.errors);
      if (response.name && response.pass_hash) {
        await storeData('user', { name: response.name.trim(), password_hash: response.pass_hash.toLowerCase() });
      }
      setLoading(false);
      navigateBack();
      navigateBack();
    } catch (e) {
      console.log('CREATE_ACCOUNT_ERROR: ', e);
      error(['Error, please try again later :(']);
    }
  };
  const openUrl = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const openTerms = () => openUrl('https://www.sakugabooru.com/static/terms_of_service');
  const onChangeUser = (user) => setUser(user);
  const onChangeEmail = (email) => setEmail(email);
  const onChangePassword = (password) => setPassword(password);
  const onChangeConfirmPassword = (confirmPassword) => setConfirmPassword(confirmPassword);

  return (
    <Layout style={styles.container}>
      <Text appearance="hint" category="c2">
        By creating an account, you are agreeing to sakugabooru{' '}
        <Text status="primary" category="c2" onPress={openTerms}>
          terms of service
        </Text>
      </Text>
      <Layout style={styles.inputContainer}>
        <Input
          label="User"
          textContentType="username"
          size="large"
          autoCapitalize="none"
          style={styles.input}
          accessoryRight={PersonIcon}
          value={user}
          onChangeText={onChangeUser}
        />
        <Input
          label="Email (optional)"
          keyboardType="email-address"
          textContentType="emailAddress"
          size="large"
          autoCapitalize="none"
          style={styles.input}
          accessoryRight={EmailIcon}
          value={email}
          onChangeText={onChangeEmail}
        />
        <Input
          label="Password"
          textContentType="newPassword"
          size="large"
          autoCapitalize="none"
          secureTextEntry={true}
          style={styles.input}
          accessoryRight={LockIcon}
          value={password}
          onChangeText={onChangePassword}
        />
        <Input
          label="Confirm password"
          textContentType="password"
          size="large"
          autoCapitalize="none"
          caption="5 characters minimum"
          secureTextEntry={true}
          style={styles.input}
          accessoryRight={LockIcon}
          value={confirmPassword}
          onChangeText={onChangeConfirmPassword}
          onSubmitEditing={createAccount}
        />
        {errors.map((e) => (
          <Text category="c2">{e}</Text>
        ))}
        <Button
          style={{ width: scale(220), marginTop: 24, marginBottom: 16 }}
          onPress={createAccount}
          disabled={loading}>
          {loading ? <ActivityIndicator /> : <Text category="h6">Create account</Text>}
        </Button>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    padding: 8,
    paddingTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginVertical: 2,
    width: scale(220),
  },
});
