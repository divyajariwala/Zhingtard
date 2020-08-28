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

import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';
// import ModalVerify from './containers/ModalVerify';
// import SocialMethods from './containers/SocialMethods';

import {authSelector} from 'src/modules/auth/selectors';
import {validatorRegister} from 'src/modules/auth/validator';
import {configsSelector, languageSelector} from 'src/modules/common/selectors';

import {authStack, profileStack} from 'src/config/navigator';
import {margin, padding, borderRadius} from 'src/components/config/spacing';
import {grey6} from 'src/components/config/colors';
import unescape from 'lodash/unescape';
import axios from 'axios';
import {Searchbar} from 'react-native-paper';

class salesreportc extends React.Component {
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
  async componentDidMount() {
    axios
      .get('https://bd.zhingtard.com/apidata.php', {
        params: {
          action: 'get_customer_data',
        },
      })
      .then(response => {
        console.log(response.data);
        console.log(response.data.data);
        this.setState({
          customerList: response.data.data,
          arrayholder: response.data.data,
        });
        console.log('customer list', this.state.customerList);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
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
        item.c_fname.toLowerCase().indexOf(query) >= 0 ||
        item.c_category.toLowerCase().indexOf(query) >= 0 ||
        item.c_area.toLowerCase().indexOf(query) >= 0
      );
    });

    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      customerList: newData,
      searchQuery: text,
    });
  }

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
            data={this.state.customerList}
            renderItem={({item}) => (
              <ListItem
                title={unescape(item.c_fname)}
                titleProps={{
                  h4: true,
                }}
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

export default connect(mapStateToProps)(salesreportc);
