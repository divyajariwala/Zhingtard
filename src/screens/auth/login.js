import React from 'react';
import {connect} from 'react-redux';

import {
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  AsyncStorage,
  Alert,
} from 'react-native';
import {Header, Divider, Text, ThemedView} from 'src/components';
import Container from 'src/containers/Container';
import Input from 'src/containers/input/Input';
import Button from 'src/containers/Button';
import TextHtml from 'src/containers/TextHtml';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';
import SocialMethods from './containers/SocialMethods';
import {rootSwitch, authStack} from 'src/config/navigator'; 

import {signInWithEmail} from 'src/modules/auth/actions';
import {authSelector} from 'src/modules/auth/selectors';
import {requiredLoginSelector} from 'src/modules/common/selectors';
import {margin} from 'src/components/config/spacing';

import {NavigationActions} from 'react-navigation';

import {changeColor} from 'src/utils/text-html';
import axios from 'axios';

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isLogin: 0,
      username1: 'abc@gmail.com',
      password1: 'text@123',
      sales: '',
    };
  }

  handleLogin = async () => {
    
    if (this.state.username === '' && this.state.password === '') {
      alert('Please Fill the details');
    } else {
      this.apiCall();
    }
  };
  apiCall = () => {
    console.log('Login button is clicked');
    const {navigation} = this.props;
    axios
      .get('https://bd.zhingtard.com/apidata.php', {
        params: {
          username: this.state.username,
          password: this.state.password,
        },
      })
      .then(async function(response) {
        console.log(response.data);
        console.log(response.data.data.user_id);
        const salespersonid = response.data.data.user_id;
        console.log('salespersonid', salespersonid);
        if (response.data.status === 'true') {
          if (response.data.data.user_role === 'sales_person') {
            await AsyncStorage.setItem('logincheck', 'sales_person');
            await AsyncStorage.setItem('Salepersonid', salespersonid);
          } else {
            await AsyncStorage.setItem('logincheck', 'customer');
          }

          const router = rootSwitch.main;
          navigation.navigate(router);
        } else {
          alert('Please check your login details');
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    const {
      navigation,
      auth: {pending, loginError},
      requiredLogin,
      screenProps: {t, theme},
    } = this.props;
    const {username, password} = this.state;
    const {message, errors} = loginError;

    return (
      <ThemedView isFullView>
        <Header
          leftComponent={
            !requiredLogin && (
              // <IconHeader
              //   name="x"
              //   size={24}
              //   onPress={() => navigation.navigate(rootSwitch.main)}
              // />
              <View />
            )
          }
          centerComponent={<TextHeader title={t('common:text_signin')} />}
        />
        <KeyboardAvoidingView behavior="height" style={styles.keyboard}>
          <ScrollView>
            <Container>
              {message ? (
                <TextHtml
                  value={message}
                  style={changeColor(theme.colors.error)}
                />
              ) : null}
              <Input
                label={t('auth:text_input_email_address')}
                value={username}
                onChangeText={value => this.setState({username: value})}
                error={errors && errors.username}
              />
              <Input
                label={t('auth:text_input_password')}
                value={password}
                secureTextEntry
                onChangeText={value => this.setState({password: value})}
                error={errors && errors.password}
              />
              <Button
                title={t('common:text_signin')}
                loading={pending}
                onPress={this.handleLogin}
                containerStyle={styles.margin}
              />
              <Text
                onPress={() => navigation.navigate(authStack.forgot)}
                style={styles.textForgot}
                medium>
                {t('auth:text_forgot')}
              </Text>
              <View style={[styles.viewOr, styles.margin]}>
                <Divider style={styles.divOr} />
                <Text style={styles.textOr} colorThird>
                  {t('auth:text_or')}
                </Text>
                <Divider style={styles.divOr} />
              </View>
              <SocialMethods style={styles.viewSocial} />
            </Container>
          </ScrollView>
        </KeyboardAvoidingView>
        <Container style={styles.margin}>
          <Text h6 colorThird style={styles.textAccount}>
            {t('auth:text_have_account')}
          </Text>
          <Button
            title={t('auth:text_register')}
            type="outline"
            onPress={() => navigation.navigate(authStack.register)}
          />
        </Container>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  textForgot: {
    textAlign: 'center',
  },
  viewOr: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divOr: {
    flex: 1,
  },
  textOr: {
    marginHorizontal: margin.base,
  },
  textAccount: {
    textAlign: 'center',
    marginBottom: margin.base,
  },
  margin: {
    marginVertical: margin.big,
  },
  viewSocial: {
    marginBottom: margin.big,
  },
});

const mapStateToProps = state => {
  return {
    auth: authSelector(state),
    requiredLogin: requiredLoginSelector(state),
  };
};

export default connect(mapStateToProps)(LoginScreen);
