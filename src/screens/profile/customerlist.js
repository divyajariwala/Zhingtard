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

class CustomerList extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props, context) {
    super(props, context);
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
      .then(function(response) {
        console.log(response.data);
        console.log(response.data.data);
        this.state.customerList = response.data.data;
        console.log('customer list', this.state.customerList);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  goProducts = () => {
    console.log('customer is click');
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
            <TextHeader title={t('common:text_customer_list')} />
          }
        />
        <KeyboardAvoidingView
          behavior="height"
          style={styles.keyboard}
          // contentContainerStyle={{flex: 1}}
        >
          <Container style={styles.content}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => `${item.id}`}
              data={this.state.customerList}
              renderItem={({item}) => (
                <ListItem
                  title={unescape(item.name)}
                  titleProps={{
                    h4: true,
                  }}
                  rightIcon={
                    <Badge
                      status="grey2"
                      value={item.count}
                      badgeStyle={styles.badge}
                      textStyle={styles.textBadge}
                    />
                  }
                  chevron
                  onPress={() => this.goProducts(item)}
                  style={styles.item}
                  containerStyle={{paddingVertical: padding.base}}
                />
              )}
            />
          </Container>
        </KeyboardAvoidingView>
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

export default connect(mapStateToProps)(CustomerList);
