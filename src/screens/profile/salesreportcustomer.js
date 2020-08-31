import React from 'react';

import {connect} from 'react-redux';
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import firebase from '@react-native-firebase/app';
// import {base-64} from 'react-native-base64';
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
  TouchableWithoutFeedback,
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

import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({
  name: 'SQLite.db',
});
class Salesreportcustomer extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props, context) {
    super(props, context);
    this.pressed = false;
    this.state = {
      fisrtname: '',
      street: '',
      area: '',
      phone_number: '+60',
      notes: '',
      contactname: '',
      country_no: '+60',
      user: null,
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
      isClickable: true,
      iconColour: 'black',
    };

    this.confirmation = null;
  }

  componentDidMount() {
    db.transaction(function(txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Userdata1'",
        [],
        function(tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Userdata1(Id INTEGER PRIMARY KEY AUTOINCREMENT,Profile VARCHAR(255),FirstName VARCHAR(25),Street VARCHAR(30),Area VARCHAR(30),PhoneNumber INTEGER,Notes VARCHAR(250),CustomerCategory VARCHAR(20),DateTime DATE)',
              [],
            );
          }
        },
      );
    });
    db.transaction(function(txn) {
      txn.executeSql('ALTER TABLE Userdata1 ADD Contactname VARCHAR(25)', []);
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
  SelectQuery = () => {
    console.log('This Function Call');
    const {firstname} = this.state;
    const {street} = this.state;
    const {area} = this.state;
    const {phone_number} = this.state;
    const {notes} = this.state;
    const {customerCategory} = this.state;
    const {dateTime} = this.state;
    const {contactname} = this.state;
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Userdata1(Profile,FirstName,Street,Area,PhoneNumber,Notes,CustomerCategory,DateTime,Contactname) VALUES(?,?,?,?,?,?,?,?,?)',
        [
          null,
          firstname,
          street,
          area,
          phone_number,
          notes,
          customerCategory,
          dateTime,
          contactname,
        ],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'You are Registered Successfully',
              [
                {
                  text: 'Ok',
                },
              ],
              {cancelable: false},
            );
          } else {
            alert('Registration Failed');
          }
        },
      );
    });
  };
  getLocation = async () => {
    if (!this.pressed) {
      this.pressed = true;
      this.setState({
        iconColour: 'grey',
      });
      var that = this;

      //Checking for the permission just after component loaded
      if (Platform.OS === 'ios') {
      } else {
        async function requestLocationPermission() {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Location Access Required',
                message: 'This App needs to Access your location',
              },
            );

            that.callLocation(that);

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              //To Check, If Permission is granted
              //  this.callLocation(that);
            } else {
              alert('Permission Denied');
            }
          } catch (err) {
            alert('err', err);
            console.warn(err);
          }
        }
        requestLocationPermission();
      }
    }
  };
  callLocation(that) {
    //  alert('callLocation Called');
    console.log('this fun is call');

    // Geocoder.init("AIzaSyB9zJVLaYLD2yLMtc5cI28mg-m9-9bfyZo");

    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        //getting the Longitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        //getting the Latitude from the location json
        //this.setState({ currentLongitude:currentLongitude });
        // console.log(currentLongitude);
        //Setting state Longitude to re re-render the Longitude Text
        //this.setState({ currentLatitude:currentLatitude });
        //  console.log('corent_let = ',currentLatitude);
        //Setting state Latitude to re re-render the Longitude Text
        //       Geocoder.init("AIzaSyCDsS5ac0CStUvHv39u8PXU6uFaSKwcMxg");
        //    Geocoder.from(position.coords.latitude, position.coords.longitude)
        //                 .then(json => {
        //                     console.log(json);
        //                     var addressComponent = json.results[0].address_components;
        //                     this.setState({
        //                         Address: addressComponent
        //                     })
        //                     console.log(addressComponent);
        //                 })
        //                 .catch(error => console.warn(error));
      },
      error => alert(error.message),
      {enableHighAccuracy: true, timeout: 100000, maximumAge: 1000},
    );

    this.watchID = Geolocation.watchPosition(position => {
      //Will give you the location on location change
      console.log('position = ', position);
      const currentLongitude = JSON.stringify(position.coords.longitude);
      console.log('longi', currentLongitude);
      //getting the Longitude from the location json
      const currentLatitude = JSON.stringify(position.coords.latitude);
      console.log('leti', currentLatitude);

      axios
        .get('https://bd.zhingtard.com/apidata.php', {
          params: {
            lat: currentLatitude,
            lng: currentLongitude,
          },
        })
        .then(async function(response) {
          console.log(response.data);
          console.log(response.data.address.suburb);

          if (response.data.status === 'true') {
            that.setState({
              street: response.data.address.suburb,
              area: response.data.address.neighbourhood,
            });

            console.log('location get');
          } else {
            alert('Please check your login details');
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      //console.log("state lati",this.state.currentLatitude);
      //Setting state Latitude to re re-render the Longitude Text
    });
  }
  componentWillUnmount = () => {
    Geolocation.clearWatch(this.watchID);
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
  latlongApiCall = async () => {
    await axios
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
                label={t('auth:text_customer_name')}
                value={this.state.firstname}
                onChangeText={value => this.setState({firstname: value})}
                error={errors && errors.firstname}
              />
              <Input
                label={t('auth:text_contact_name')}
                value={this.state.contactname}
                onChangeText={value => this.setState({contactname: value})}
                error={errors && errors.contactname}
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
                value={this.state.notes}
                onChangeText={value => this.setState({notes: value})}
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
                <TouchableWithoutFeedback onPress={this.getLocation}>
                  <Icon
                    name="map-pin"
                    size={30}
                    color={this.state.iconColour}
                  />
                </TouchableWithoutFeedback>
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
                title={t('common:text_submit')}
                onPress={this.SelectQuery}
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

export default Salesreportcustomer;
