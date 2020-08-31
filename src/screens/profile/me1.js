import React, {Component} from 'react';
import {connect} from 'react-redux';

import {StyleSheet, ScrollView, View, Linking} from 'react-native';
import {Header, ThemedView, Text} from 'src/components';

import HeaderMe from './containers/HeaderMe';
import AddOption from './addoptions';

import InformationMe from './containers/InformationMe';
import Container from 'src/containers/Container';
import SocialIcon from 'src/containers/SocialIcon';
import {TextHeader, CartIcon} from 'src/containers/HeaderComponent';

import {authSelector} from 'src/modules/auth/selectors';
import {wishListSelector, configsSelector} from 'src/modules/common/selectors';

import {grey5} from 'src/components/config/colors';
import {margin} from 'src/components/config/spacing';
import AsyncStorage from '@react-native-community/async-storage';

class MeScreen1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      check: '',
    };
  }
  async componentDidMount() {
    this.setState({
      check: await AsyncStorage.getItem('logincheck'),
    });
    console.log('login check', this.state.check);
  }
  static navigationOptions = {
    header: null,
  };
  icon = name => {
    return {
      name: name,
      size: 18,
      color: grey5,
    };
  };

  handleLinkUrl = url => {
    Linking.openURL(url);
  };

  goPageOther = router => {
    this.props.navigation.navigate(router);
  };
  handleClick = () => this.props.navigation.goBack();
  render() {
    const {
      configs,
      auth: {isLogin},
      screenProps: {t},
    } = this.props;

    return (
      <ThemedView isFullView>
        {/* <Header centerComponent={<TextHeader title={t('common:text_me_screen')} />} rightComponent={<CartIcon />} /> */}
        <ScrollView>
          <Container style={styles.viewContent}>
            {/* <HeaderMe /> */}
            {/* <InformationMe
              isLogin={isLogin}
              clickPage={this.goPageOther}
            /> */}

            <AddOption
              isLogin={isLogin}
              clickPage={this.goPageOther}
              goPhone={this.handleLinkUrl}
              phonenumber={configs.get('phone')}
              handleClick={this.handleClick}
            />
          </Container>
        </ScrollView>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  viewContent: {
    marginTop: margin.large,
    marginBottom: margin.big,
  },
  viewSocial: {
    flexDirection: 'row',
    // justifyContent: 'center',
    marginVertical: margin.large + 4,
  },
  socialIconStyle: {
    width: 32,
    height: 32,
    margin: 0,
    marginHorizontal: margin.small / 2,
    paddingTop: 0,
    paddingBottom: 0,
  },
});

const mapStateToProps = state => {
  return {
    auth: authSelector(state),
    wishList: wishListSelector(state),
    configs: configsSelector(state),
  };
};

export default connect(mapStateToProps)(MeScreen1);
