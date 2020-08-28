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

import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({
  name: 'SQLite.db',
});

class OfflineCustomer extends React.Component {
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
    db.transaction(tx => {
      tx.executeSql('select * from Userdata1 ', [], (tx, results) => {
        var resultItemIdArr = new Array();
        for (let i = 0; i < results.rows.length; i++) {
          resultItemIdArr.push(results.rows.item(i));
        }
        this.setState({
          customerList: resultItemIdArr,
          arrayholder: resultItemIdArr,
        });
      });
    });
  }
  submitDataOnline = async () => {
    db.transaction(tx => {
      tx.executeSql('select * from Userdata1 ', [], (tx, results) => {
        var resultItemIdArr = new Array();
        for (let i = 0; i < results.rows.length; i++) {
          resultItemIdArr.push(results.rows.item(i));
        }
        this.setState({
          customerList: resultItemIdArr,
        });
      });
    });
    console.log('Function call');

    for (let i = 0; i <= this.state.customerList.length; i++) {
      await axios
        .get('https://bd.zhingtard.com/apidata.php', {
          params: {
            action: 'addcd',
            photo: '',
            fname: this.state.customerList[i].FirstName,
            street: this.state.customerList[i].Street,
            area: this.state.customerList[i].Area,
            phnumber: this.state.customerList[i].PhoneNumber,
            notes: this.state.customerList[i].Notes,
            customercategory: this.state.customerList[i].CustomerCategory,
            currentlocation: 'current_loca',
            datetime: this.state.customerList[i].DateTime,
            filename: '',
          },
        })

        .then(response => {
          console.log(response.data);

          console.log('customer list', this.state.customerList);
          db.transaction(tx => {
            tx.executeSql('DELETE FROM Userdata1 ', [], (tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('All the recorad deleted');
              } else {
                console.log('Error in deleting recorad');
              }
            });
          });
        })

        .catch(function(error) {
          console.log(error);
        });
    }
  };
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
  goToDetails = Userid => {
    const {navigation} = this.props;
    db.transaction(tx => {
      tx.executeSql(
        'select * from Userdata1 where Id = ?',
        [Userid],
        async (tx, results) => {
          var len = results.rows.length;
          console.log('len', len);
          if (len > 0) {
            console.log('Result', results.rows);
            let res = results.rows.item(0);

            await AsyncStorage.setItem('@userid', JSON.stringify(res.Id));
            await AsyncStorage.setItem('@firstname', res.FirstName);
            await AsyncStorage.setItem('@street', res.Street);
            await AsyncStorage.setItem('@area', res.Area);
            await AsyncStorage.setItem(
              '@phonenumber',
              JSON.stringify(res.PhoneNumber),
            );
            await AsyncStorage.setItem('@notes', res.Notes);
            await AsyncStorage.setItem('@category', res.CustomerCategory);
            await AsyncStorage.setItem('@datetime', res.DateTime);
            const router = profileStack.editsalescustomer;
            navigation.navigate(router);
          } else {
            alert('No user found');
          }

          // var resultItemIdArr = new Array();
          // for (let i = 0; i < results.rows.length; i++) {
          //   resultItemIdArr.push(results.rows.item(i));
          // }
          // this.setState({
          //   customerList: resultItemIdArr,
          // });
        },
      );
    });
    const router = profileStack.editsalescustomer;
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
            <TextHeader title={t('common:text_ofline_customer_data')} />
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
                title={unescape(item.FirstName)}
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
          <Button
            onPress={() => this.submitDataOnline()}
            title={t('common:text_submit_data_online')}
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

export default connect(mapStateToProps)(OfflineCustomer);
