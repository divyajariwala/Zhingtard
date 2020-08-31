import {profileStack} from 'src/config/navigator';

import {createStackNavigator} from 'react-navigation-stack';

import MeScreen from 'src/screens/profile/me';
import SettingScreen from 'src/screens/profile/setting';
import HelpScreen from 'src/screens/profile/help';
import PrivacyScreen from 'src/screens/profile/privacy';
import ContactScreen from 'src/screens/profile/contact';
import AboutScreen from 'src/screens/profile/about';
import AccountScreen from 'src/screens/profile/account';
import ChangePasswordScreen from 'src/screens/profile/change-password';
import AddressBookScreen from 'src/screens/profile/address-book';
import OrderList from 'src/screens/profile/orders';
import OrderDetail from 'src/screens/profile/order';
import NotificationList from 'src/screens/profile/notifications';
import NotificationDetail from 'src/screens/profile/notification';
import DemoConfig from 'src/screens/profile/demo-config';
import Vendors from 'src/screens/profile/vendors';
import ChatVendor from 'src/screens/profile/chat-vendor';
import EditAccount from 'src/screens/profile/edit-account';
import Report from 'src/screens/profile/report';
import Salesperformance from 'src/screens/profile/salesperformance';
import Addcustomer from 'src/screens/profile/addcustomer';
import AddOption from 'src/screens/profile/addoptions';
import Mescreen1 from 'src/screens/profile/me1';
import CustomerList from 'src/screens/profile/customerlist';
import SalesReportOptions from 'src/screens/profile/salesreportoption';
import MeScreen2 from 'src/screens/profile/me2';
import OfflineCustomer from 'src/screens/profile/offlinecustomer';
import Salesreportcustomer from 'src/screens/profile/salesreportcustomer';
import editcustomer from 'src/screens/profile/editcustomer';
import salesreportc from 'src/screens/profile/salesreportc';
import editsalescustomer from 'src/screens/profile/editsalescustomer';
import customerpurchase from 'src/screens/profile/customerpurchase';
import showsalescustomer from 'src/screens/profile/showsalescustomer';

export default createStackNavigator(
  {
    [profileStack.me]: MeScreen,
    [profileStack.setting]: SettingScreen,
    [profileStack.help]: HelpScreen,
    [profileStack.privacy]: PrivacyScreen,
    [profileStack.contact]: ContactScreen,
    [profileStack.about]: AboutScreen,
    [profileStack.account]: AccountScreen,
    [profileStack.change_password]: ChangePasswordScreen,
    [profileStack.address_book]: AddressBookScreen,
    [profileStack.order_list]: OrderList,
    [profileStack.order_detail]: OrderDetail,
    [profileStack.notification_list]: NotificationList,
    [profileStack.notification_detail]: NotificationDetail,
    [profileStack.demo_config]: DemoConfig,
    [profileStack.vendors]: Vendors,
    [profileStack.chat_vendor]: ChatVendor,
    [profileStack.edit_account]: EditAccount,
    [profileStack.report]: Report,
    [profileStack.salesperformance]: Salesperformance,
    [profileStack.addcustomer]: Addcustomer,
    [profileStack.addoptions]: AddOption,
    [profileStack.me1]: Mescreen1,
    [profileStack.customerlist]: CustomerList,
    [profileStack.salesreportoption]: SalesReportOptions,
    [profileStack.me2]: MeScreen2,
    [profileStack.offlinecustomer]: OfflineCustomer,
    [profileStack.salesreportcustomer]: Salesreportcustomer,
    [profileStack.editcustomer]: editcustomer,
    [profileStack.salesreportc]: salesreportc,
    [profileStack.editsalescustomer]: editsalescustomer,
    [profileStack.customerpurchase]: customerpurchase,
    [profileStack.showsalescustomer]: showsalescustomer,
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);
