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

import {Searchbar} from 'react-native-paper';
const Data = [
  {name: 'Test', product: 'Grand Fix'},
  {name: 'Test', product: 'Grand Fix'},
  {name: 'Test', product: 'Grand Fix'},
  {name: 'Test', product: 'Grand Fix'},
  {name: 'Test', product: 'Grand Fix'},
  {name: 'Test', product: 'Grand Fix'},
  {name: 'Test', product: 'Grand Fix'},
];
class Salesperformance extends React.Component {
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
            <TextHeader title={t('common:text-sales-performance')} />
          }
        />

        <Container style={styles.content}>
          <Searchbar
            placeholder="Search"
            onChangeText={text => this.SearchFilterFunction(text)}
            value={this.state.searchQuery}
          />

          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => `${item.user_id}`}
            data={Data}
            renderItem={({item}) => (
              <ListItem
                title={unescape(item.name)}
                titleProps={{
                  h4: true,
                }}
                chevron
                style={styles.item}
                containerStyle={{paddingVertical: padding.base}}
                onPress={() => this.goToDetails(item.Id)}
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
});

const mapStateToProps = state => {
  const configs = configsSelector(state);
  return {
    auth: authSelector(state),
    language: languageSelector(state),
    enablePhoneNumber: configs.get('toggleLoginSMS'),
  };
};

export default connect(mapStateToProps)(Salesperformance);
