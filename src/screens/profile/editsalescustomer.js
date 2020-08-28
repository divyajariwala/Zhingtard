import React from 'react';

import {connect} from 'react-redux';
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import firebase from '@react-native-firebase/app';
import Base64 from 'Base64';
import {
  StyleSheet,
  ScrollView,
  View,
  Switch,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
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

import {authStack} from 'src/config/navigator';
import {margin, padding} from 'src/components/config/spacing';
import {lineHeights} from 'src/components/config/fonts';
import {changeColor} from 'src/utils/text-html';
import {showMessage} from 'react-native-flash-message';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import normalize from 'react-native-normalize';
import DropDownPicker from 'react-native-dropdown-picker';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({
  name: 'SQLite.db',
});
class editsalescustomer extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      fisrt_name: '',
      street: '',
      area: '',
      phonenumber: '',
      phone_number: '+60',
      note: '',
      category: '',
      datetime: '',
      country_no: '+60',
      userid: '',
      filePath: '',
      Image: '',
      fileName: '',
      customerCategory: '',
      confirmResult: null,
      visibleModal: false,
      loading: false,
      currentLongitude: '',
      currentLatitude: '',
      dateTime: '',
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
      street: await AsyncStorage.getItem('@street'),
      area: await AsyncStorage.getItem('@area'),
      phone_number: await AsyncStorage.getItem('@phonenumber'),
      note: await AsyncStorage.getItem('@notes'),
      customerCategory: await AsyncStorage.getItem('@category'),
      datetime: await AsyncStorage.getItem('@datetime'),
    });
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();
    this.setState({
      dateTime:
        month + '/' + date + '/' + year + ' ' + hours + ':' + min + ':' + sec,
    });
  }
  updateQuery = () => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Userdata1 set FirstName=?, Street=? , Area=? ,PhoneNumber=?,Notes=?,CustomerCategory=? where Id=?',
        [
          this.state.first_name,
          this.state.street,
          this.state.area,
          this.state.phone_number,
          this.state.note,
          this.state.customerCategory,
          this.state.userid,
        ],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'User updated successfully',
              [
                {
                  text: 'Ok',
                 
                },
              ],
              {cancelable: false},
            );
          } else alert('Updation Failed');
        },
      );
    });
  };
  chooseFile = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;

        // You can also display the image using data:
        //let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath: source,
          Image: response.data,
          fileName: response.fileName,
        });
        // let decodeString = base64.decode(this.state.Image);
        // var text = utf8.decode(decodeString)

        const decoded = Base64.atob(this.state.Image);
        const encoded = Base64.btoa(decoded);
        console.log('Image data', this.state.Image);
        console.log('Image file path', this.state.filePath);
        console.log('File name', this.state.fileName);
        console.log('Decode String', encoded);
      }
    });
  };
  latlongApiCall = () => {
    axios
      .get('https://bd.zhingtard.com/apidata.php', {
        params: {
          lat: this.state.currentLatitude,
          lng: this.state.currentLongitude,
        },
      })
      .then(response => {
        console.log('response', response.data);
        if (response.data.status === 'true') {
          console.log('APi call');
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  render() {
    const {
      navigation,
      // auth: {pending},
      screenProps: {t, theme},
      enablePhoneNumber,
    } = this.props;
    const {
      error: {message, errors},
      visibleModal,
      loading,
      user,
      confirmResult,
    } = this.state;
    const visible = visibleModal || !!(!user && confirmResult);
    return (
      <ThemedView isFullView>
        {/* <Loading visible={pending} /> */}
        <Header
          leftComponent={<IconHeader />}
          centerComponent={
            <TextHeader title={t('common:text_customer_details')} />
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styles.avtarplaceholder}
                  onPress={this.chooseFile.bind(this)}>
                  <Image
                    source={{
                      uri: 'data:image/jpeg;base64,' + this.state.filePath.data,
                    }}
                    style={styles.avtar}
                  />
                  {this.state.filePath.data == null ? (
                    <Icon name="plus" size={30} color="black" />
                  ) : null}
                </TouchableOpacity>
                <Text style={styles.textSwitch} colorSecondary>
                  {t('common:text_upload_profile_picture')}
                </Text>
              </View>
              <Input
                label={t('auth:text_input_first_name')}
                value={this.state.first_name}
                onChangeText={value => this.setState({firstname: value})}
                error={errors && errors.firstname}
              />
              <Input
                label={t('auth:text_street_name')}
                value={this.state.street}
                onChangeText={value => this.setState({street: value})}
                error={errors && errors.street}
              />
              <Input
                label={t('auth:text_area_name')}
                value={this.state.area}
                onChangeText={value => this.setState({area: value})}
                error={errors && errors.area}
              />

              <InputMobile
                value={this.state.phone_number}
                onChangePhoneNumber={({value, code}) =>
                  this.setState({phone_number: value, country_no: code})
                }
                error={errors && errors.phone_number}
              />

              <Input
                label={t('auth:text_notes')}
                multiline={true}
                numberOfLines={6}
                value={this.state.note}
                onChangeText={value => this.setState({note: value})}
                error={errors && errors.notes}
              />
              <DropDownPicker
                items={[
                  {
                    label: 'Warm',
                    value: 'warm',
                  },
                  {
                    label: 'Hot',
                    value: 'hot',
                  },
                  {
                    label: 'Cold',
                    value: 'cold',
                  },
                ]}
                defaultValue={this.state.customerCategory}
                placeholder="Customer prospect"
                containerStyle={{height: 50}}
                style={{backgroundColor: '#fafafa'}}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={{backgroundColor: '#fafafa'}}
                onChangeItem={item =>
                  this.setState({
                    customerCategory: item.value,
                  })
                }
              />
              <View style={styles.viewSwitch}>
                <Text style={styles.textSwitch} colorSecondary>
                  {t('common:text_tap_for_the_current_location')}
                </Text>

                <Icon
                  onPress={this.getLocation}
                  name="map-pin"
                  size={30}
                  color="black"
                />
              </View>
              <View style={styles.viewSwitch}>
                <Text style={styles.textSwitch} colorSecondary>
                  {t('common:text_current_date_time')}
                </Text>
                <Text style={styles.textSwitch} colorSecondary>
                  {this.state.dateTime}
                </Text>
              </View>
              <Button
                title={t('common:text_update')}
                onPress={this.updateQuery}
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
    marginLeft: 10,
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

  avtar: {
    position: 'absolute',
    width: normalize(75),
    height: normalize(75),
    borderRadius: 50,
  },
  avtarplaceholder: {
    height: 70,
    width: 70,
    marginLeft: hp(2),
    borderRadius: hp(7),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: hp(0.1),
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

export default editsalescustomer;
