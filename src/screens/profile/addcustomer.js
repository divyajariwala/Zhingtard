import React from 'react';

import {connect} from 'react-redux';
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import firebase from '@react-native-firebase/app';

import {
  StyleSheet,
  ScrollView,
  View,
  Switch,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {Header, Loading, Text, ThemedView} from 'src/components';
import Container from 'src/containers/Container';
import Input from 'src/containers/input/Input';
import InputMobile from 'src/containers/input/InputMobile';
import Button from 'src/containers/Button';
import TextHtml from 'src/containers/TextHtml';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';
// import ModalVerify from './containers/ModalVerify';
// import SocialMethods from './containers/SocialMethods';

import {signUpWithEmail} from 'src/modules/auth/actions';
import {authSelector} from 'src/modules/auth/selectors';
import {validatorRegister} from 'src/modules/auth/validator';
import {configsSelector, languageSelector} from 'src/modules/common/selectors';
import {checkPhoneNumber, checkInfo} from 'src/modules/auth/service';

import {rootSwitch, authStack, profileStack} from 'src/config/navigator';
import {margin, padding} from 'src/components/config/spacing';
import {lineHeights} from 'src/components/config/fonts';
import {changeColor} from 'src/utils/text-html';
import {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

class Addcustomer extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      first_name: '',
      last_name: '',
      name: '',
      website: '',
      email: '',
      password: '',
      phone_number: '+91',
      country_no: '+91',
      subscribe: false,

      user: null,
      confirmResult: null,
      visibleModal: false,
      loading: false,
      check: '',
      error: {
        message: null,
        errors: null,
      },
    };
    this.confirmation = null;
  }

  async componentDidMount() {
    this.setState({
      check: await AsyncStorage.getItem('Salepersonid'),
    });
    console.log('salespersonid', this.state.check);
  }

  /**
   * Handle User register
   */

  handleAddnewCustomer = () => {
    if (this.state.first_name === '') {
      alert('Plese enter your firstname');
    } else if (this.state.last_name === '') {
      alert('Plese enter your lastname');
    } else if (this.state.name === '') {
      alert('Plese enter your username');
    } else if (this.state.email === '') {
      alert('Plese enter your email address');
    } else if (this.state.password === '') {
      alert('Please enter your password');
    } else {
      this.apiCall();
    }
  };
  apiCall = () => {
    console.log('Customer add');
    const {navigation} = this.props;
    axios
      .get('https://bd.zhingtard.com/apidata.php', {
        params: {
          fname: this.state.first_name,
          lname: this.state.last_name,
          username: this.state.name,
          website: this.state.website,
          email: this.state.email,
          password: this.state.password,
          spid: this.state.check,
        },
      })
      .then(async function(response) {
        console.log(response.data);

        if (response.data.status === 'true') {
          const router = profileStack.me1;
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
      auth: {pending},
      screenProps: {t, theme},
      enablePhoneNumber,
    } = this.props;
    const {
      // data: {
      //   email,
      //   first_name,
      //   last_name,
      //   name,
      //   phone_number,
      //   country_no,
      //   password,
      //   subscribe,
      // },
      error: {message, errors},
      visibleModal,
      loading,
      user,
      confirmResult,
    } = this.state;
    const visible = visibleModal || !!(!user && confirmResult);
    return (
      <ThemedView isFullView>
        <Loading visible={pending} />
        <Header
          leftComponent={<IconHeader />}
          centerComponent={<TextHeader title={t('common:text_new_customer')} />}
        />
        <KeyboardAvoidingView
          behavior="height"
          style={styles.keyboard}
          // contentContainerStyle={{flex: 1}}
        >
          <ScrollView>
            <Container>
              {message ? (
                <TextHtml
                  value={message}
                  style={changeColor(theme.colors.error)}
                />
              ) : null}
              <Input
                label={t('auth:text_input_first_name')}
                value={this.state.first_name}
                onChangeText={value => this.setState({first_name: value})}
              />
              <Input
                label={t('auth:text_input_last_name')}
                value={this.state.last_name}
                onChangeText={value => this.setState({last_name: value})}
              />
              <Input
                label={t('auth:text_input_user')}
                value={this.state.name}
                onChangeText={value => this.setState({name: value})}
              />
              <Input
                label={t('auth:text_input_website')}
                value={this.state.website}
                onChangeText={value => this.setState({website: value})}
              />

              <Input
                label={t('auth:text_input_email')}
                value={this.state.email}
                onChangeText={value => this.setState({email: value})}
              />
              <Input
                label={t('auth:text_input_password')}
                value={this.state.password}
                secureTextEntry
                onChangeText={value => this.setState({password: value})}
              />
              <View style={styles.viewSwitch}>
                <Text style={styles.textSwitch} colorSecondary>
                  {t('auth:text_agree_register')}
                </Text>
                <Switch
                  value={this.state.subscribe}
                  onValueChange={value => this.setState({subscribe: value})}
                />
              </View>
              <Button
                title={t('common:text_new_customer')}
                onPress={this.handleAddnewCustomer}
                loading={loading}
              />
             
            </Container>
          </ScrollView>
        </KeyboardAvoidingView>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  viewSwitch: {
    marginVertical: margin.big,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textSwitch: {
    flex: 1,
    lineHeight: lineHeights.h4,
    marginRight: margin.large,
  },
  viewAccount: {
    marginVertical: margin.big,
  },
  textHaveAccount: {
    paddingVertical: padding.small,
    marginTop: margin.base,
    marginBottom: margin.big,
    textAlign: 'center',
  },
});

const mapStateToProps = state => {
  const configs = configsSelector(state);
  return {
    auth: authSelector(state),
    language: languageSelector(state),
    enablePhoneNumber: configs.get('toggleLoginSMS'),
  };
};

export default connect(mapStateToProps)(Addcustomer);
