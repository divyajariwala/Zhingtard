import React from 'react';
import {useTranslation} from 'react-i18next';

import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, ListItem, Header} from 'src/components';
import {grey4} from 'src/components/config/colors';
import {icon, titleProps} from './containers/config';
import {margin, padding} from 'src/components/config/spacing';
import {profileStack} from 'src/config/navigator';
import {connect} from 'react-redux';
import {signOut} from 'src/modules/auth/actions';
import {withNavigation} from 'react-navigation';
import {Icon as IconComponent} from 'src/components';
import {TextHeader, IconHeader} from 'src/containers/HeaderComponent';

const SalesReportOptions = ({
  isLogin,
  phonenumber,
  clickPage,
  goPhone,
  handleSignOut,
  check,
  onPress,
  navigation,
  handleClick,
}) => {
  const {t} = useTranslation();
  //const handleClick = onPress ? onPress : () => navigation.goBack();

  return (
    <>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => handleClick()}
          style={{
            padding: 1,
            color: grey4,
            marginTop: margin.big + 4,
            marginBottom: margin.small,
            marginRight: 2,
          }}>
          <IconComponent name="chevron-left" size={24} />
        </TouchableOpacity>
        <Text medium style={styles.title}>
          {t('common:text_sales_report')}
        </Text>
      </View>

      <ListItem
        leftIcon={icon(1)}
        title={t('common:text_add_new_customer_report')}
        type="underline"
        titleProps={titleProps}
        pad={padding.large}
        chevron
        onPress={() => clickPage(profileStack.salesreportcustomer)}
      />
      <ListItem
        leftIcon={icon(1)}
        title={t('text_ofline_customer_data')}
        type="underline"
        titleProps={titleProps}
        pad={padding.large}
        chevron
        onPress={() => clickPage(profileStack.offlinecustomer)}
      />
      <ListItem
        leftIcon={icon(0)}
        title={t('common:text_customer_list')}
        type="underline"
        titleProps={titleProps}
        pad={padding.large}
        chevron
        onPress={() => clickPage(profileStack.salesreportc)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: grey4,
    marginTop: margin.big + 6,
    marginBottom: margin.small,
  },
  phone: {
    marginHorizontal: margin.small / 2,
  },
  itemEnd: {
    borderBottomWidth: 0,
  },
});

SalesReportOptions.defaultProps = {
  isLogin: false,
  phonenumber: '',
  clickPage: () => {},
  goPhone: () => {},
  check: () => {},
  handleClick: () => {},
};
const mapDispatchToProps = {
  handleSignOut: signOut,
};
export default connect(
  null,
  mapDispatchToProps,
)(SalesReportOptions);
