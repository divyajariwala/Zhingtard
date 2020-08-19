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

class editcustomer extends React.Component {
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
      userid: '',

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
      userid: await AsyncStorage.getItem('@userid'),
      first_name: await AsyncStorage.getItem('@firstname'),
      last_name: await AsyncStorage.getItem('@lastname'),
      name: await AsyncStorage.getItem('@username'),
      website: await AsyncStorage.getItem('@website'),
      email: await AsyncStorage.getItem('@email'),
    });
    console.log('userid', this.state.userid);
    console.log('firstname', this.state.first_name);
    console.log('lastname', this.state.last_name);
    console.log('name', this.state.name);
    console.log('website', this.state.website);
    console.log('email', this.state.email);
  }

  /**
   * Handle User register
   */

  handleAddnewCustomer = () => {
    this.apiCall();
  };
  apiCall = () => {
    console.log('Customer add');
    const {navigation} = this.props;
    axios
      .get('https://bd.zhingtard.com/apidata.php', {
        params: {
          userid: this.state.userid,
          action: 'update',
          username: this.state.name,
          email: this.state.email,
          website: this.state.website,
        },
      })
      .then(function(response) {
        console.log(response.data);

        if (response.data.status === 'true') {
          const router = profileStack.me1;
          navigation.navigate(router);
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
          centerComponent={
            <TextHeader title={t('common:text_edit_customer')} />
          }
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
                editable={false}
              />
              <Input
                label={t('auth:text_input_last_name')}
                value={this.state.last_name}
                onChangeText={value => this.setState({last_name: value})}
                editable={false}
              />
              <Input
                label={t('auth:text_input_user')}
                value={this.state.name}
                onChangeText={value => this.setState({name: value})}
                editable={false}
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
                value={'••••••••••'}
                secureTextEntry
                onChangeText={value => this.setState({password: value})}
                editable={false}
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
                title={t('common:text_edit_customer')}
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

export default connect(mapStateToProps)(editcustomer);
