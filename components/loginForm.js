import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Icon, Layout, Input, Button } from '@ui-kitten/components';
import { login } from '../api/user';
import { sha1 } from 'react-native-sha1';
import { storeData } from '../util/storage';

const PersonIcon = (props) => <Icon {...props} name="person-outline" />;
const LockIcon = (props) => <Icon {...props} name="lock-outline" />;

export const LoginForm = ({ loadUser, from, navigateBack, navigatePostList }) => {
  const [user, setUser] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const loginUser = async () => {
    try {
      setError();
      if (!user || !password) return setError('user and password are obligatory');
      setLoading(true);
      const p = 'er@!$rjiajd0$!dkaopc350!Y%)--' + password + '--';
      const password_hash = await sha1(p);
      const response = await login({ user, password_hash });
      if (!response || !response.success) {
        setLoading(false);
        return setError('username or password is incorrect');
      }
      await storeData('user', { name: user.trim(), password_hash: password_hash.toLowerCase() });
      await loadUser();
      if (from === 'favorites' && navigateBack && navigatePostList) {
        navigateBack();
        navigatePostList('Favorites', true, 'Favorites', `vote:3:${user.trim()} order:vote`);
      }
    } catch (error) {
      console.log('LOGIN_ERROR: ', error);
      setLoading(false);
      setError('Error, please try again later :(');
    }
  };
  const onChangeUser = (user) => setUser(user);
  const onChangePassword = (password) => setPassword(password);
  return (
    <Layout style={styles.container}>
      {/* <Text category="h4">Login</Text> */}
      <Text appearance="hint" category="c2">
        Access to comments, scores and favorites
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
          label="Password"
          textContentType="password"
          size="large"
          autoCapitalize="none"
          secureTextEntry={true}
          style={styles.input}
          accessoryRight={LockIcon}
          value={password}
          onChangeText={onChangePassword}
        />
        {error && <Text category="c2">{error}</Text>}
        <Button style={{ width: '100%', marginTop: 24, marginBottom: 16 }} onPress={loginUser} disabled={loading}>
          {loading ? <ActivityIndicator /> : <Text category="h6">Login</Text>}
        </Button>
        <Button appearance="outline" style={{ width: '100%' }} disabled={loading}>
          <Text status={loading ? 'basic' : 'primary'} category="h6">
            Create account
          </Text>
        </Button>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  inputContainer: {
    flex: 1,
    padding: 8,
    paddingTop: 24,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  input: {
    marginVertical: 2,
  },
});
