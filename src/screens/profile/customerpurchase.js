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
import Button from 'src/containers/Button';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';

import {authSelector} from 'src/modules/auth/selectors';
import {configsSelector, languageSelector} from 'src/modules/common/selectors';

import {authStack, profileStack} from 'src/config/navigator';
import {margin, padding, borderRadius} from 'src/components/config/spacing';
import {grey6} from 'src/components/config/colors';
import unescape from 'lodash/unescape';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const Data = [
  {Pname: 'Test', product: 'Grand Fix', commision: '5%', price: '500 Rs'},
  {Pname: 'Test', product: 'Grand Fix', commision: '5%', price: '500 Rs'},
  {Pname: 'Test', product: 'Grand Fix', commision: '5%', price: '500 Rs'},
  {Pname: 'Test', product: 'Grand Fix', commision: '5%', price: '500 Rs'},
  {Pname: 'Test', product: 'Grand Fix', commision: '5%', price: '500 Rs'},
  {Pname: 'Test', product: 'Grand Fix', commision: '5%', price: '500 Rs'},
  {Pname: 'Test', product: 'Grand Fix', commision: '5%', price: '500 Rs'},
];
class customerpurchase extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      customerList: [],
      check: '',
      searchQuery: '',
      arrayholder: [],
    };
  }

  componentDidMount() {}

  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    const newData = this.state.arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      // const itemData = item.c_fname
      //   ? item.c_fname.toUpperCase()
      //   : ''.toUpperCase();
      // const textData = text.toUpperCase();
      // return itemData.indexOf(textData) > -1;
      const query = text.toLowerCase();

      return (
        item.FirstName.toLowerCase().indexOf(query) >= 0 ||
        item.Area.toLowerCase().indexOf(query) >= 0 ||
        item.CustomerCategory.toLowerCase().indexOf(query) >= 0
      );
    });

    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      customerList: newData,
      searchQuery: text,
    });
  }
  goToDetails = () => {
    const {navigation} = this.props;

    const router = profileStack.customerpurchase;
    navigation.navigate(router);
  };
  listItem = item => {
    const {
      navigation,
      auth: {pending},
      screenProps: {t, theme},
      enablePhoneNumber,
      ...rest
    } = this.props;
    return (
      <View>
        <View style={styles.listheading}>
          <Text>{item.product}</Text>
          <Text>{item.price}</Text>
          <Text>{item.commision}</Text>
        </View>
      </View>
    );
  };
  render() {
    const {
      navigation,
      auth: {pending},
      screenProps: {t, theme},
      enablePhoneNumber,
      ...rest
    } = this.props;

    return (
      <ThemedView isFullView>
        <Header
          leftComponent={<IconHeader />}
          centerComponent={
            <TextHeader title={t('common:text_customer_purchase')} />
          }
        />

        <Container style={styles.content}>
          <View style={styles.textalign}>
            <Text medium style={styles.textstyle}>
              {t('common:text_customer_name')}
            </Text>
            <Text medium style={styles.textstyle}>{t('common:text_customer_text')}</Text>
          </View>
          <View style={styles.textalign}>
            <Text medium style={styles.textstyle}>{t('common:text_sales_person_name')}</Text>
            <Text medium style={styles.textstyle}>{t('common:text_customer_text')}</Text>
          </View>
          <Text medium style={styles.textstyle}>{t('common:text_product_details')}</Text>
          <View style={styles.listheading}>
            <Text medium style={styles.textstyle}>{t('common:text_product_name')}</Text>
            <Text medium style={styles.textstyle}>{t('common:text_product_price')}</Text>
            <Text medium style={styles.textstyle}>{t('common:text_commision')}</Text>
          </View>
          <View>
            <FlatList
              data={Data}
              renderItem={({item}) => this.listItem(item)}
            />
          </View>
          <View style={styles.textalign}>
            <Text medium style={styles.textstyle}>{t('common:text_total_commision')}</Text>
            <Text medium style={styles.textstyle}>{t('common:text_customer_text')}</Text>
          </View>
          <View style={styles.textalign}>
            <Text medium style={styles.textstyle}>{t('common:text_total')}</Text>
            <Text medium style={styles.textstyle}>{t('common:text_customer_text')}</Text>
          </View>
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
    marginTop: 10,
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
  textalign: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listheading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textstyle: {
    lineHeight: 40,
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

export default connect(mapStateToProps)(customerpurchase);
