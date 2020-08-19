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
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
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

class Salesreportcustomer extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: {
        first_name: '',
        last_name: '',
        name: '',
        email: '',
        password: '',
        phone_number: '+91',
        country_no: '+91',
        subscribe: false,
      },
      user: null,
      filePath: '',
      Image: '',
      customerCategory: '',
      confirmResult: null,
      visibleModal: false,
      loading: false,
      currentLongitude: '',
      currentLatitude: '',
      error: {
        message: null,
        errors: null,
      },
    };
    this.confirmation = null;
  }

  componentDidMount() {}
  getLocation = () => {
    console.log('this function is called ');
    var that = this;
    //Checking for the permission just after component loaded
    if (Platform.OS === 'ios') {
      this.callLocation(that);
    } else {
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          ); //alert massage aavyo ...callLocation called
          // that.callLocation(that);
          console.log('permision is granted');
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            //  this.callLocation(that);
            that.callLocation(that);
            console.log('call location is called');
            // this.props.dispatch('signup2')
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
  };
  callLocation(that) {
    // alert("callLocation Called");
    console.log('this fun is call');
    // Geocoder.init("AIzaSyB9zJVLaYLD2yLMtc5cI28mg-m9-9bfyZo");

    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
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
      //getting the Latitude from the location json
      this.setState({currentLongitude: currentLongitude});
      //console.log("state longi",this.state.currentLongitude);
      //Setting state Longitude to re re-render the Longitude Text

      this.setState({currentLatitude: currentLatitude});
    });
  }

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
          image: response.data,
        });
        console.log('Image file path', this.state.filePath);
      }
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
      data: {
        email,
        first_name,
        last_name,
        name,
        phone_number,
        country_no,
        password,
        subscribe,
      },
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
                value={first_name}
                onChangeText={value => this.changeData({first_name: value})}
                error={errors && errors.first_name}
              />
              <Input
                label={t('auth:text_street_name')}
                value={first_name}
                onChangeText={value => this.changeData({first_name: value})}
                error={errors && errors.first_name}
              />
              <Input
                label={t('auth:text_area_name')}
                value={first_name}
                onChangeText={value => this.changeData({first_name: value})}
                error={errors && errors.first_name}
              />
              {enablePhoneNumber ? (
                <InputMobile
                  value={phone_number}
                  onChangePhoneNumber={({value, code}) =>
                    this.changeData({phone_number: value, country_no: code})
                  }
                  error={errors && errors.phone_number}
                />
              ) : null}
              <Input
                label={t('auth:text_notes')}
                multiline={true}
                numberOfLines={6}
                value={first_name}
                onChangeText={value => this.changeData({first_name: value})}
                error={errors && errors.first_name}
              />
              <DropDownPicker
                items={[
                  {
                    label: 'Warm',
                    value: 'warm',
                  },
                  {
                    label: 'Heat',
                    value: 'heat',
                  },
                  {
                    label: 'Cold',
                    value: 'cold',
                  },
                ]}
                defaultValue={this.state.customerCategory}
                containerStyle={{height: 50}}
                style={{backgroundColor: '#fafafa'}}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={{backgroundColor: '#fafafa'}}
                onChangeItem={item =>
                  this.setState({
                    country: item.value,
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
              <Button
                title={t('common:text_submit')}
                onPress={this.handleRegister}
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

export default connect(mapStateToProps)(Salesreportcustomer);
