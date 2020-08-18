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
  FlatList,
} from 'react-native';
import {
  Header,
  Loading,
  Text,
  ThemedView,
  Badge,
  ListItem,
} from 'src/components';
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

import {authStack, profileStack} from 'src/config/navigator';
import {margin, padding, borderRadius} from 'src/components/config/spacing';
import {grey6} from 'src/components/config/colors';
import unescape from 'lodash/unescape';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

class OfflineCustomer extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      customerList: [],
      check: '',
    };
  }
  async componentDidMount() {
    this.setState({
      check: await AsyncStorage.getItem('Salepersonid'),
    });
    console.log('salespersonid', this.state.check);

    axios
      .get('https://bd.zhingtard.com/apidata.php', {
        params: {
          login: '1',
          spid: this.state.check,
        },
      })
      .then(response => {
        console.log(response.data);
        console.log(response.data.data);
        this.setState({
          customerList: response.data.data,
        });
        console.log('customer list', this.state.customerList);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  goToDetails = Userid => {
    const {navigation} = this.props;
    //console.log('customer is click');
    axios
      .get('https://bd.zhingtard.com/apidata.php', {
        params: {
          spid: this.state.check,
          userid: Userid,
          action: 'edit',
        },
      })
      .then(async response => {
        console.log(response.data);
        if (response.data.status === 'true') {
          await AsyncStorage.setItem('@userid', response.data.data.user_id);
          await AsyncStorage.setItem(
            '@firstname',
            response.data.data.first_name,
          );
          await AsyncStorage.setItem('@lastname', response.data.data.last_name);
          await AsyncStorage.setItem(
            '@username',
            response.data.data.user_login,
          );
          await AsyncStorage.setItem('@website', response.data.data.website);
          await AsyncStorage.setItem('@email', response.data.data.email);

          const router = profileStack.editcustomer;
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

    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={
            <TextHeader title={t('common:text_ofline_customer_data')} />
          }
        />

        <Container style={styles.content}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => `${item.user_id}`}
            data={[
              {first_name: 'Test'},
              {first_name: 'Test'},
              {first_name: 'Test'},
              {first_name: 'Test'},
              {first_name: 'Test'},
              {first_name: 'Test'},
              {first_name: 'Test'},
              {first_name: 'Test'},
              {first_name: 'Test'},
              {first_name: 'Test'},
            ]}
            renderItem={({item}) => (
              <ListItem
                title={unescape(item.first_name)}
                titleProps={{
                  h4: true,
                }}
                chevron
                onPress={() => this.goToDetails(item.user_id)}
                style={styles.item}
                containerStyle={{paddingVertical: padding.base}}
              />
            )}
          />
        </Container>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  notification: {
    marginBottom: margin.base,
    marginTop: margin.large,
  },
  content: {
    flex: 1,
  },
  item: {
    marginBottom: margin.base,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: borderRadius.base + 1,
  },
  textBadge: {
    lineHeight: 18,
    color: grey6,
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

export default connect(mapStateToProps)(OfflineCustomer);
