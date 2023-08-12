import { Component, ViewChild } from '@angular/core';
import { App, Platform, NavController, Nav, LoadingController, Content, ToastController, Config, Modal, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestapiProvider } from '../providers/restapi/restapi';
import { UtilitiesProvider } from '../providers/utilities/utilities';
import { Sim } from '@ionic-native/sim';
import { Device } from '@ionic-native/device';
import { OneSignal } from '@ionic-native/onesignal';
import { Network } from '@ionic-native/network';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import * as $ from 'jquery';
import { TabsPage } from '../pages/dashboard/tabs/tabs';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { AppRate } from '@ionic-native/app-rate';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { Badge } from '@ionic-native/badge';
import { HTTP } from '@ionic-native/http';
import { TranslateService } from '@ngx-translate/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SettingsPage } from '../pages/settings/settings';
import { AboutusPage } from '../pages/aboutus/aboutus';
import { config } from '../shared/config';
import { AppVersion } from '@ionic-native/app-version';
import { ModalController } from 'ionic-angular';
import { SelectLanguagePage } from '../components/modals/select-language/select-language';
declare var cordova: any;
declare var upshot: any;
declare var IRoot: any;

window["$"] = $;
window["jQuery"] = $;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  loading: any;
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Content) content: Content;
  pages: Array<{ title: string, component: any, name: any }>;
  subpages: Array<{ title: string, component: any, name: any }>;
  public username;
  public profileScore;
  public profileData: any = {};
  public pageLoader: boolean = false;
  public logoutConfirmationPopup: boolean = false
  public showAntiforgery: boolean = false;
  public langName;
  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public restapiProvider: RestapiProvider,
    public sim: Sim,
    public network: Network,
    public oneSignal: OneSignal,
    public device: Device,
    public geolocation: Geolocation,
    public geocoder: NativeGeocoder,
    public loadingCtrl: LoadingController,
    public app: App,
    public utilitiesProvider: UtilitiesProvider,
    public mobileAccessibility: MobileAccessibility,
    public ga: GoogleAnalytics,
    public appRate: AppRate,
    public firebaseAnalytics: FirebaseAnalytics,
    public badge: Badge,
    public http: HTTP,
    public HttpService: Http,
    public toastCtrl: ToastController,
    public translate: TranslateService,
    public appVersion: AppVersion,
    public config: Config,
    public modalCtrl: ModalController,
    public menuCtrl: MenuController,) {
    platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#053072');
      this.splashScreen.hide();
      this.setLanguage();
      setTimeout(() => {
        if (this.platform.is("cordova")) {
          this.initializeUpshot();
        }
      }, 200);
      setTimeout(() => {
        this.mobileAccessibility.usePreferredTextZoom(false);
        this.utilitiesProvider.initGoogleAnalytics();
        this.utilitiesProvider.oneSignalPushInit();
        if (this.restapiProvider.userData['isNotificationRegister'] != "Yes" && this.restapiProvider.userData['isLogin'] == "Yes") {
          this.getOneSignalPushIds();
        }
      }, 500);
      this.network.onConnect().subscribe(() => { });
      this.getUserDataAvailabity(platform, splashScreen);
      setTimeout(() => {
        //rooted device check added on 13-06-2022
        if (this.platform.is("cordova") && this.platform.is("android")) {
          if (typeof (IRoot) !== 'undefined' && IRoot) {
            IRoot.isRooted((data) => {
              // alert(data);
              if (data == false) {
                this.antiforgeryToken();
                // console.log("device not rooted!!!");
              } else {
                // console.log("rooted device!!!");
              }
            }, (data) => {
              this.antiforgeryToken();
              // console.log("routed device detection failed case", data);
            });
          }
          else {
            this.antiforgeryToken();
          }
        }
        else {
          this.antiforgeryToken();
        }
      }, 200);
    }).catch(e => {
      // console.log(e)
    });
  }

  setLanguage() {
    var userLang = navigator.language.split('-')[0];
    userLang = localStorage.getItem("lang") != null ? localStorage.getItem("lang") : "en";

    if (userLang == 'en') {
      localStorage.setItem("langId", "1");
      localStorage.setItem("langName", "English");
    }
    else if (userLang == 'hi') {
      localStorage.setItem("langId", "2");
      localStorage.setItem("langName", "हिंदी");
    }
    else {
      userLang = 'en';
      localStorage.setItem("lang", userLang);
      localStorage.setItem("langId", "1");
      localStorage.setItem("langName", "English");
    }
    userLang = /(en|de|it|fr|es|hi)/gi.test(userLang) ? userLang : 'en';
    this.translate.use(userLang);
    this.langName = localStorage.getItem("langName");
    let langId = localStorage.getItem("langId");
    if (langId == "2") {
      this.config.set('ios', 'backButtonText', 'पीछे जाये');
      $('.app-root').addClass('hindi_font');
    }
    else {
      this.config.set('ios', 'backButtonText', 'Back');
      $('.app-root').removeClass('hindi_font');
    }

    this.utilitiesProvider.initLangLable();
    setTimeout(() => {
      this.utilitiesProvider.initLangLable();

    }, 1000);
    //this.pages = this.utilitiesProvider.langJsonData['sidemenu']['menuPage']
  }

  getUserDataAvailabity(platform, splashScreen) {
    this.restapiProvider.getIntelData('userData')
      .then(instanceID => {
        if (instanceID != undefined && instanceID != '') {
          this.restapiProvider.dataFromIntelInstaceID(instanceID)
            .then(response => {
              // console.log("User is already logged in!!!");
              if (response != undefined && response != '') {
                if (response['pushID'] == undefined || response['pushID'] == '') {
                  this.getOneSignalPushIds()
                    .then(resp => console.log("Onesignal ID generated."))
                    .catch(error => console.log("Error in Onesignal ID generation."))
                }
                if (response['imei'] == undefined || response['imei'] == '' ||
                  response['simSerialNumber'] == undefined || response['simSerialNumber'] == '' ||
                  response['uuid'] == undefined || response['uuid'] == '') {
                  this.getAllSimPhoneData(platform)
                }
                if (response['CustomerID'] == undefined || response['CustomerID'] == '' || response['CustomerID'].length < 2) {
                  this.initAllData(platform, splashScreen);
                }
                this.restapiProvider.userData = response;
                // this.pageRedirection();//. 
                splashScreen.hide();
                return true;
              }
              else {
                this.nav.setRoot('AppIntroPage');
                this.initAllData(platform, splashScreen);
                splashScreen.hide();
                return false;
              }
            })
            .catch((error) => {
              // console.log("Error from InstanceID");
              this.initAllData(platform, splashScreen);
              this.nav.setRoot('AppIntroPage');
              splashScreen.hide();
              return false;
            });
        }
        else {
          // console.log("Please Login!!!");
          this.initAllData(platform, splashScreen);
          splashScreen.hide();
          return false;
        }
      })
      .catch(error => {
        // console.log("Error from Data storage");
        this.initAllData(platform, splashScreen);
        splashScreen.hide();
        return false;
      });
  }

  handleNotifications() {
    this.oneSignal.handleNotificationReceived().subscribe(res => {
      // console.log("notification recieved",res)
      this.restapiProvider.presentToastTop("New Notification");
      this.notification();
    });
    this.oneSignal.handleNotificationOpened().subscribe(res => {
      // console.log("notification opened",res)
      this.restapiProvider.presentToastTop("New Notification");
      this.notification();
    });
  }

  getOneSignalPushIds() {
    return this.oneSignal.getIds().then(resp => {
      this.restapiProvider.userData['pushID'] = resp.userId;
      if (this.restapiProvider.userData['isNotificationRegister'] != "Yes" && this.restapiProvider.userData['isLogin'] == 'Yes') {
        this.updateUserNotificationId(resp.userId);
      }
      this.handleNotifications();
      return true;
    })
      .catch(error => {
        // console.log('Error occured. Please try again.');
        return false;
      });
  }

  initAllData(platform, splashScreen) {
    this.getAllSimPhoneData(platform)
    this.getOneSignalPushIds().then(response => {
      splashScreen.hide();
    })
      .catch(error => {
        splashScreen.hide();
      })
  }

  getAllSimPhoneData(platform) {
    if (platform.is('android')) {
      // this.getSimPermissionsInfo('android');
    }
    if (platform.is('ios')) {
      // this.getSimPermissionsInfo('ios');
    }
    this.getDeviceInfo();
  }

  getSimPermissionsInfo(platform) {
    if (platform == 'android') {
      this.sim.hasReadPermission()
        .then(info => {
          if (!info) {
            this.getSimReadPersmissions();
          }
          if (info) {
            this.getSimInformation();
          }
        },
          reject => {
            this.getSimReadPersmissions();
          }
        )
    }
    if (platform == 'ios') {
      this.getSimInformation();
    }
  }

  getSimReadPersmissions() {
    this.sim.requestReadPermission().then(
      () => {
        // console.log('Permission granted');
        this.getSimInformation();
      },
      () => {
        // console.log('Permission denied');

      }
    );
  }

  getSimInformation() {
    this.sim.getSimInfo().then(
      info => {

        this.restapiProvider.userData['imei'] = info.deviceId;
        this.restapiProvider.userData['simSerialNumber'] = info.simSerialNumber;
      },
      err => console.log('Unable to get sim info: ' + err))
  }

  getDeviceInfo() {
    this.restapiProvider.userData['uuid'] = this.device.uuid;
  }

  openPage(page) {
    if (page.component == '') {
      this.restapiProvider.presentToastBottom("Coming Soon...");
    }
    else if (page.component == 'TabsPage' || page.component == 'TabsPage') {
      let type = page.name == 'Icons_Discover_New' ? 0 : 1;
      this.utilitiesProvider.tabsActive = type;
      this.nav.setRoot(TabsPage);
    }
    else if (page.component == 'ArticlesPage') {
      this.nav.push(page.component, { source: 'Trends', header: this.utilitiesProvider.langJsonData['collections']['collections'], categoryID: '' });
    }
    else if (page.component == 'RiskAssesmentPage') {
      if (this.restapiProvider.userData['riskAssess']) {
        let riskAssess = JSON.parse(this.restapiProvider.userData['riskAssess']);
        if (riskAssess && riskAssess.length > 0) {
          this.nav.push('RiskassesmentFinalPage', { data: riskAssess[0] })
        }
        else {
          this.nav.push(page.component);
        }
      }
      else {
        this.nav.push(page.component);
      }
    }
    else if (page.component == 'QuizSurveyListPage') {
      this.utilitiesProvider.isFromMenu = true;
      this.nav.push(page.component);
    }
    else if(page.component == 'ListingScreenGoalPage') {
      this.nav.push(page.component, { pageFrom: 'Goal' });
    }
    else if(page.component == 'CalculatorlistingPage') {
      this.nav.push(page.component, { pageFrom: 'Tools' });
    }
    else {
      this.nav.push(page.component);
    }
  }
  goToDefaultProfile() {
    this.nav.push('UserDefaultPage');
    // this.nav.push('UserEditPage');
  }

  logout(type) {
    this.logoutConfirmationPopup = !this.logoutConfirmationPopup;
    if (type == 'yes') {
      this.loaderShow();
      let request = { "CustId": this.restapiProvider.userData['CustomerID'] }
      // console.log("Request: " + JSON.stringify(request));
      return this.restapiProvider.sendRestApiRequest(request, 'Logout')
        .subscribe((response) => {
          this.pageLoader = false;
          if (response.IsSuccess == true) {
            this.restapiProvider.userData['CustomerID'] = "";
            this.restapiProvider.userData['isLogin'] = "";
            this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
            localStorage.removeItem("isLogin");
            this.nav.setRoot('LoginPage');
          }
        }, (error) => {
          this.pageLoader = false;
        })
    }
  }

  settingClick(p) {
    if (p.title == 'Log out') {
      this.logoutConfirmationPopup = !this.logoutConfirmationPopup;
    }
    else if (p.component == 'RateUs') {
      this.rateUs();
    }
    else if (p.component == 'AboutusPage') {
      this.pageLoader = true;
      setTimeout(() => {
        this.pageLoader = false;
      }, 2000)
      this.nav.push(p.component);
    }
    else if (p.title == 'Privacy Policy') {
      window.open('https://www.sbilife.co.in/en/privacy-policy', '_system');
    }
    else {
      this.nav.push(p.component);
    }
  }

  
  public modal: Modal;
  async languageClick() {
    //this.nav.push('PreferableLanguagePage');
    this.modal = this.modalCtrl.create(
      SelectLanguagePage,
      { allowDismiss: true },
      {
        showBackdrop: true,
        enableBackdropDismiss: false,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss((langId)=>{
      if(langId != null 
        && langId != "" 
        && langId != localStorage.getItem("langId")) {
        this.changeLanguage(langId);
        this.menuCtrl.close();
      }
    });
  }

  changeLanguage(langId: string) {
    if (this.network.type === 'none') {
      this.restapiProvider.noInternetPromt();
    } else {
      if (langId) {
        localStorage.setItem("lang", langId == "2" ? 'hi' : 'en');
        localStorage.setItem("langId", langId);
        this.setLanguage();
        setTimeout(() => {
          this.utilitiesProvider.initLangLable();
        }, 200);
        this.loadDefaultData();
      }
    }
  }

  loaderShow() {
    this.pageLoader = true;
  }
  errorPic() {
    if (this.restapiProvider.userData['gender'] == "Male" || this.restapiProvider.userData['gender'] == "") {
      this.restapiProvider.userData['profileImg'] = this.utilitiesProvider.noProfileImg;
    }
    else {
      this.restapiProvider.userData['profileImg'] = this.utilitiesProvider.noProfileImgFemale;
    }
  }
  getUserPersonalDetails() {
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      this.restapiProvider.userData = JSON.parse(localStorage.getItem("userData"))
    }
    else {
      this.restapiProvider.userData = this.restapiProvider.userData;
    }

    if (this.restapiProvider.userData['userPersonalDetails']) {
      this.profileData = JSON.parse(this.restapiProvider.userData['userPersonalDetails']).Table[0];
    }
    this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
    this.username = this.restapiProvider.userData['customerName'];

    this.checkAndUpdateUpshotProfile();
  }
  settingGo() {
    this.nav.push('SettingsPage');
  }

  notification() {
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
    }
    // console.log("Request: " + JSON.stringify(request));
    return this.restapiProvider.sendRestApiRequest(request, 'UserNotificationCountNList')
      .subscribe((response) => {
      //   response = {
      //     "Type": "SUCCESS",
      //     "IsSuccess": true,
      //     "Data": {
      //         "Table": [
      //             {
      //                 "CustomerID": "3EB9DEA5-806A-4838-BB92-2F6C22440D49",
      //                 "NotificationCount": 5
      //             }
      //         ],
      //         "Table1": [
      //             {
      //                 "CustomerID": "3EB9DEA5-806A-4838-BB92-2F6C22440D49",
      //                 "NotificationID": 1028,
      //                 "ArticleID": 4807,
      //                 "CatID": 3,
      //                 "CatName": "Article",
      //                 "Title": "Protect Your Future with Life Insurance - Why life insurance is important",
      //                 "ShortDesc": "Explains the importance of life insurance in securing your family's financial future in your absence",
      //                 "SmallImage": "/Images/ArticleImages/Article_Small_010623133129.png",
      //                 "Keyword": "life insurance, financial security, family protection",
      //                 "IsRead": false,
      //                 "IsNotified": true,
      //                 "PublishDate": "Jun 5, 2023",
      //                 "PublishTime": "9:14 AM"
      //             },
      //             {
      //               "CustomerID": "3EB9DEA5-806A-4838-BB92-2F6C22440D49",
      //               "NotificationID": 1028,
      //               "ArticleID": 4807,
      //               "CatID": 3,
      //               "CatName": "Article",
      //               "Title": "Protect Your Future with Life Insurance - Why life insurance is important",
      //               "ShortDesc": "Explains the importance of life insurance in securing your family's financial future in your absence",
      //               "SmallImage": "/Images/ArticleImages/Article_Small_010623133129.png",
      //               "Keyword": "life insurance, financial security, family protection",
      //               "IsRead": false,
      //               "IsNotified": true,
      //               "PublishDate": "Jun 5, 2023",
      //               "PublishTime": "9:14 AM"
      //           }
      //         ]
      //     },
      //     "Message": "",
      //     "StatusCode": null
      // };
        if (response.IsSuccess == true) {
          // console.log("Notification", response)
          if (response.Data.Table.length > 0) {
            this.restapiProvider.notificationCount = response.Data.Table[0].NotificationCount;
            this.badge.set(parseInt(this.restapiProvider.notificationCount));
          }
          else {
            this.restapiProvider.notificationCount = 0;
          }
          this.addNFormatNotificationList(response.Data.Table1); // Merging Upshot Notification List, Filtering and Formatting
        }
      }, (error) => {
      })
  }

  addNFormatNotificationList(notificationArr) { //notificationArr >>> DB Notifications; notificationListUpshot >>> Upshot Notifications
    if(this.platform.is("cordova")) {
      let _that = this;
      let notificationListUpshot = [];
      cordova.plugins.UpshotPlugin.getNotifications(false, (response) => {
        // console.log("Upshot Notification Response", response)
        if(response["statusCode"] == 200) {
          notificationListUpshot = response["data"];
          if(notificationListUpshot.length > 0) {
            // Formatting n filter n add list
            notificationListUpshot = notificationListUpshot.filter(res => _that.filterUpshotNotif(res.date));
            notificationListUpshot = notificationListUpshot.map(res => ({...res, Title: res.title, ShortDesc: res.message, PublishDate: _that.formatPublishDate(res.date), PublishTime: _that.formatPublishTime(res.date)}));

            notificationArr = notificationArr.map(res => ({...res, date: _that.getMillisecDate(res.PublishDate, res.PublishTime)}));

            let finalNotifList = notificationArr.concat(notificationListUpshot);

            finalNotifList.sort((a,b)=> b.date - a.date);
            // console.log("merge notification list", finalNotifList)
            _that.restapiProvider.notificationList = finalNotifList;
          }
          else {
            if (notificationArr.length > 0) {
              _that.restapiProvider.notificationList = notificationArr;
            }
            else {
              _that.restapiProvider.notificationList = [];
            }
          }
        }
        else {
          if (notificationArr.length > 0) {
            _that.restapiProvider.notificationList = notificationArr;
          }
          else {
            _that.restapiProvider.notificationList = [];
          }
        }
      })
    }
    else {
      if (notificationArr.length > 0) {
        this.restapiProvider.notificationList = notificationArr;
      }
      else {
        this.restapiProvider.notificationList = [];
      }
    }
  }

  filterUpshotNotif(d) {
    let tDate = new Date();
    let nDate = new Date(d);

    let diffTime = Math.abs(tDate.getTime() - nDate.getTime());
    let diffDays = diffTime / (1000 * 60 * 60 * 24);

    if(diffDays > 15) {
      return false;
    }
    else {
      return true;
    }
  }

  formatPublishDate(d) {
    let tDate = new Date();
    let nDate = new Date(d);
    let monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let d1 = monthArr[nDate.getMonth()] + " " + (nDate.getDate() < 10 ? ('0' + nDate.getDate()) : nDate.getDate()) + " " + nDate.getFullYear();
    let d2 = monthArr[tDate.getMonth()] + " " + (tDate.getDate() < 10 ? ('0' + tDate.getDate()) : tDate.getDate()) + " " + tDate.getFullYear();

    if(d1 == d2) {
      return "Today";
    }
    else {
      return d1;
    }
  }

  formatPublishTime(d) {
    let tDate = new Date();
    let nDate = new Date(d);
    let monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let d1 = monthArr[nDate.getMonth()] + " " + nDate.getDate() + " " + nDate.getFullYear();
    let d2 = monthArr[tDate.getMonth()] + " " + tDate.getDate() + " " + tDate.getFullYear();

    if(d1 == d2) {
      let hr = (nDate.getHours() % 12) || 12;
      let mm = nDate.getMinutes();
      let ampm = (nDate.getHours() < 12 || nDate.getHours() === 24) ? "AM" : "PM";

      return (hr < 10 ? ('0' + hr) : hr) + ":" + (mm < 10 ? ('0' + mm) : mm) + " " + ampm;
    }
    else {
      return "";
    }
  }

  getMillisecDate(date, time) { //date >>> 'Today' or 'Nov 22 2021'; time: 12:00 AM
    if(date == 'Today') {
      let d = new Date();

      let ampm = time.indexOf("AM") > -1 ? "AM" : "PM";
      let hrMin = time.slice(0, time.indexOf(ampm));
      let hrs = hrMin.split(":")[0];
      let min = hrMin.split(":")[1];
      if(ampm == "AM") {
        d.setHours(hrs, min);
      }
      else {
        hrs = hrs + 12;
        d.setHours(hrs, min);
      }

      return d.getTime();
    }
    else {
      let d = new Date(date);
      return d.getTime();
    }
  }


  pageRedirection() {
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      if (localStorage.getItem("isLogin") == "Yes") {
        this.getUserPersonalDetails();
        this.storeLocation();
        // setTimeout(() => {
        //   this.loadDefaultData();
        // }, 1000);
        // let mpin = this.restapiProvider.userData['MPINFlag'];
        let mpin = false;
        
        if (mpin) {
          if (this.restapiProvider.userData['MPINTYPE'] == 'mpin') {
            this.nav.setRoot('MpinLoginPage');
          }
          else {
            this.nav.setRoot('PatternLockPage');
          }

          //this.nav.setRoot('MpinLoginPage');
        }
        else {
          this.nav.setRoot(TabsPage);
        }
      }
      else {
        this.nav.setRoot('AppIntroPage');
      }
    }
    else {
      if (this.restapiProvider.userData['isLogin'] == 'Yes') {
        this.getUserPersonalDetails();
        this.storeLocation();
        // this.loadDefaultData();
        // let mpin = this.restapiProvider.userData['MPINFlag'];
        let mpin = false;
        if (mpin) {
          if (this.restapiProvider.userData['MPINTYPE'] == 'mpin') {
            this.nav.setRoot('MpinLoginPage');
          }
          else {
            this.nav.setRoot('PatternLockPage');
          }
        }
        else {
          this.nav.setRoot(TabsPage);
        }

      }
      else {
        this.nav.setRoot('AppIntroPage');
      }
    }
  }

  storeLocation() {
    if (this.restapiProvider.userData['LocationFlag']) {
      this.geolocate();
    }
  }

  geolocate() {
    let options = {
      enableHighAccuracy: true,
      timeout: 10000
    };
    this.geolocation.getCurrentPosition(options).then((position: Geoposition) => {
      this.getcountry(position);
    }).catch((err) => {
      this.restapiProvider.userData['location'] = " ";
      this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
    })
  }

  getcountry(pos) {
    this.geocoder.reverseGeocode(pos.coords.latitude, pos.coords.longitude).then((res: NativeGeocoderReverseResult[]) => {
      this.restapiProvider.userData['location'] = res[0].locality;
      if (res[0].locality && res[0].locality != undefined && res[0].locality != null) {
        this.UpdateUserLocation(res[0].locality);
      }
      this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
    }).catch((err) => {
      this.restapiProvider.userData['location'] = " ";
      this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
    })
  }

  UpdateUserLocation(location) {
    let request = {
      "CustID": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "LocationName": location ? location : ""
    }
    this.restapiProvider.sendRestApiRequest(request, 'UpdateUserLocation').subscribe((response) => {
      if (response.IsSuccess == true) {
        // if (response.Data.Table[0].MSG == 'Success')
        //   console.log(response)
        // else
        //   console.log("Could not store location: ",response)
      }
      else {
        // console.log("Could not store location: ",response)
      }
    }, (error) => {
    })
  }



  rateUs() {
    if (this.platform.is('cordova')) {
   this.appRate.preferences = {
      usesUntilPrompt: 3,
      storeAppURL: {
        ios: '1392403705',
        android: 'market://details?id=com.paisagenie.paisagenie',
        windows: 'ms-windows-store://review/?ProductId=com.paisagenie.paisagenie'
      }
    };
    this.appRate.navigateToAppStore();
  }
  }

  menuOpened() {
    this.content.scrollToTop();
  }


  updatePageUseCount(pageId) {
    if (this.network.type === 'none') { }
    else {
      let request = {
        "CustId": this.restapiProvider.userData['CustomerID'],
        "TokenId": this.restapiProvider.userData['tokenId'],
        "PageId": pageId
      }
      this.restapiProvider.sendRestApiRequest(request, 'UpdatePageUseCount').subscribe((response) => {
      });
    }
  }

  updateUserNotificationId(notificationId) {
    if (this.network.type === 'none') { }
    else {
      let request = {
        "CustId": this.restapiProvider.userData['CustomerID'],
        "TokenId": this.restapiProvider.userData['tokenId'],
        "NotificationId": notificationId
      }
      this.restapiProvider.sendRestApiRequest(request, 'UpdateUserNotificationId').subscribe((response) => {
      });
    }
  }

  initData() {
    if (this.restapiProvider.userData['defaultData']) {
      this.utilitiesProvider.defaultData = JSON.parse(this.restapiProvider.userData['defaultData']);
    }
    if (this.restapiProvider.userData['GetMasters']) {
      this.utilitiesProvider.GetMasterData = JSON.parse(this.restapiProvider.userData['GetMasters']);
    }
    if (this.restapiProvider.userData['getUserProfileMaster']) {
      this.utilitiesProvider.UserProfileMaster = JSON.parse(this.restapiProvider.userData['getUserProfileMaster']);
      // console.log("this.utilitiesProvider.UserProfileMaster :", this.utilitiesProvider.UserProfileMaster)
    }
  }

  antiforgeryToken() {
    this.pageLoader = true;
    if (this.network.type === 'none') {
      this.pageLoader = false;
      this.toastWithCancel('No internet connection');
    }
    else {
      return this.restapiProvider.sendRestApiRequest('', 'AntiforgeryToken').subscribe((res) => {
        this.pageLoader = false;
        this.showAntiforgery = false
        this.restapiProvider.userData['AntiForgeryToken'] = res["AntiForgeryToken"];
        if (this.platform.is('core') || this.platform.is('mobileweb')) {
          if (localStorage.getItem("isLogin") == "Yes") {
            this.loadDefaultData();
          }
          else {
            this.nav.setRoot('AppIntroPage');
          }
        }
        else {
          if (this.restapiProvider.userData['isLogin'] == 'Yes') {
            this.loadDefaultData();
          }
          else {
            this.nav.setRoot('AppIntroPage');
          }
        }
      }, (error) => {
        console.log("Error in AntiforgeryToken API::", error);
        this.toastWithCancel('Please try again.');
        // this.showAntiforgery = true
        this.pageLoader = false;
      })
    }
  }

  toastWithCancel(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      showCloseButton: true,
      closeButtonText: "Retry"
    });
    toast.onDidDismiss(() => {
      this.antiforgeryToken();
    });
    toast.present();
  }




  loadDefaultData() {
    this.pageLoader = true;
    let request = {
      "data": "All",
      "LangId": localStorage.getItem("langId")
    }
    return this.restapiProvider.sendRestApiRequest(request, 'DefaultData')
      .subscribe((response) => {
        if(config['isLive'] == 'No'){
          response = {"Item1":{"calculators":{"networth":{"data":{"assets":[{"id":"1","value":"Cash In hand","amount":""},{"id":"2","value":"PF/PPF","amount":""},{"id":"3","value":"PF/RD","amount":""},{"id":"4","value":"Gold","amount":""},{"id":"5","value":"Property other than one living in","amount":""},{"id":"6","value":"MF - Equity","amount":""},{"id":"7","value":"MF- Debt","amount":""},{"id":"8","value":"Protection/Term plan","amount":""},{"id":"9","value":"Sukanya","amount":""},{"id":"10","value":"NSC/KVP","amount":""},{"id":"11","value":"NPS","amount":""},{"id":"12","value":"Direct Equity","amount":""},{"id":"13","value":"Bond","amount":""},{"id":"14","value":"Child Plan","amount":""},{"id":"15","value":"Pension Plan","amount":""},{"id":"16","value":"Health Insurance","amount":""},{"id":"17","value":"Endowment Plan","amount":""},{"id":"18","value":"Unit linked policy","amount":""},{"id":"19","value":"Arbitrage Funds","amount":""},{"id":"20","value":"RBI Bonds","amount":""},{"id":"21","value":"Index Funds","amount":""},{"id":"22","value":"Others","amount":""}],"liabilities":[{"id":"1","value":"Vehicle Loan","amount":""},{"id":"2","value":"Home Loan","amount":""},{"id":"3","value":"Personal Loan","amount":""},{"id":"4","value":"Credit Card Debt","amount":""},{"id":"5","value":"Education Loan","amount":""},{"id":"6","value":"Agriculture/ Business Loan","amount":""},{"id":"7","value":"Others","amount":""}]},"sliderConfig":{"assets":{"min":"0","max":"100000000","steps":"100"},"liabilities":{"min":"0","max":"100000000","steps":"100"}}},"sukanyasamriddhi":{"data":{"investmentamount_pm":{"min":"250","max":"12500","default":""},"rateofinterest":{"min":"","max":"","default":"8.1"},"investmentperiod":{"min":"","max":"","default":"14"},"maturityperiod":{"min":"14","max":"21","default":"21"}},"sliderConfig":{"age_of_child":{"min":"1","max":"10","steps":"1"}}},"ppf":{"data":{"tenure_prev_inv":{"min":"1","max":"15","default":"1"},"amount":{"min":"500","max":"150000","default":"500"},"existamount":{"min":"0","max":"5000000","default":"0"},"tenure_in_yr":{"min":"15","max":"30","default":"15"},"rateofreturn":{"min":"","max":"","default":"7.1"}}},"epf":{"data":{"current_age":{"min":"18","max":"57","default":"18"},"retirement_age":{"min":"25","max":"58","default":"25"},"basic_pay_increment_rate":{"min":"0","max":"30","default":"5"},"rateofinterest":{"min":"5","max":"15","default":"8.75"},"own_contribution_perc":{"min":"10","max":"12","default":"12"},"company_contribution_perc":{"min":"3.76","max":"12","default":"3.76"}}},"nps":{"data":{"rateofinterest":{"min":"4.0","max":"12.0","default":"8.0"},"percpensionreinvestedinannuity":{"min":"40.0","max":"100.0","default":"40.0"},"incr_saving_rate":{"min":"0","max":"10","default":"5"}},"sliderConfig":{"current_age":{"min":"18","max":"65","steps":"1"},"retirement_age":{"min":"18","max":"70","steps":"1"},"monthly_contri_pa":{"min":"500","max":"83334"}}},"loaneligibility":{"data":{"amount_reqd":{"min":"10000","max":"400000","default":"10000"},"interest_rate":{"min":"4","max":"14","default":""},"tenure_in_yr":{"min":"3","max":"30","default":""}}},"target":{"data":{"target_amt":{"min":"20000","max":"100000000","default":""},"duration_in_yr":{"min":"1","max":"50","default":""},"rate_of_return":{"min":"6","max":"12","default":""},"lumpsum_avlbl":{"min":"0","max":"100000000","default":"0"},"inflation_rate":{"min":"2","max":"12","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"}}},"emi":{"data":{"amt":{"min":"100000","max":"20000000","default":"100000"},"tenure_in_yr":{"min":"1","max":"30","default":""},"interest_rate":{"min":"4","max":"40","default":""}}},"fd":{"data":{"amt":{"min":"10000","max":"5000000","default":"10000"},"tenure_in_yr":{"min":"1","max":"10","default":""},"interest_rate":{"min":"5","max":"9","default":""},"interest_rate_frequency":["Monthly","Quarterly","Half Yearly","Yearly"]}},"sip":{"data":{"mnthly_inv":{"min":"500","max":"100000","default":"500"},"tenure_in_yr":{"min":"1","max":"40","deafult":""},"rate_of_return":{"min":"6","max":"12","default":"8"},"incr_saving_rate":{"min":"0","max":"10","default":"5"}}},"magic_of_compounding":{"data":{"mnthly_inv":{"min":"1000","max":"100000","default":"1000"},"tenure_in_yr":{"min":"1","max":"40","deafult":""},"rate_of_return":{"min":"6","max":"12","default":"8"},"incr_saving_rate":{"min":"0","max":"10","default":"5"}}},"smokingless":{"data":{"no_of_ciggarettes_per_day":{"min":"1","max":"40","default":"5"},"cost_per_ciggarette":{"min":"5","max":"20","deafult":"10"},"expected_rate_of_return":{"min":"6","max":"12","default":"8"},"years_ive_been_smoking":{"min":"1","max":"40","default":"1"},"tar_per_cig":{"min":"","max":"","default":"0.007"},"saving_growth_rate":{"min":"","max":"","default":"8"},"reduction_in_life_per_cig_minutes":{"min":"","max":"","default":"11"}}},"crorepati":{"data":{"expected_rate_of_return":{"min":"6","max":"12","default":"8"},"i_want_be_a_crorepati_in":{"min":"1","max":"30","deafult":"1"},"you_have_already_saved":{"min":"0","max":"","default":""},"increasing_savings_rate":{"min":"0","max":"10","default":"5"},"amount":{"min":"0","max":"10000000","default":"0"},"growth_rate_of_lumpsum":{"min":"","max":"","default":"6"},"rate_of_increment_yearly":{"min":"0","max":"10","default":"5"}}},"eatingout":{"outings_per_month":{"min":"1","max":"20","default":"8"},"avg_cost_per_outings":{"min":"500","max":"10000","default":"1000"},"expected_rate_of_return":{"min":"6","max":"12","default":"8"},"reduction_in_outing":{"min":"1","max":"","default":""},"duration":{"default":"5"}}}},"Item2":{"goals":{"target":{"data":{"amount_reqd":{"min":"100000","max":"3000000","default":"100000"},"duration_in_yr":{"min":"1","max":"50","default":"1"},"lumpsum_avlbl":{"min":"0","max":"100000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"lumpsum_compound":{"default":"6"}}},"car":{"data":{"cost":{"min":"100000","max":"3000000","default":{"type":[{"name":"Hatch Back","cost":"500000","imagepath":"/Images/App/HatchBack.png"},{"name":"Sedan","cost":"800000","imagepath":"/Images/App/Sedan.png"},{"name":"SUV","cost":"1200000","imagepath":"/Images/App/SUV.png"},{"name":"Luxury","cost":"2500000","imagepath":"/Images/App/Luxury.png"}]}},"duration_in_yr":{"min":"1","max":"10","default":"1"},"downpayment_perc":{"min":"10","max":"100","default":"100"},"lumpsum_avlbl":{"min":"0","max":"100000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"emi_int_rate":{"min":"5","max":"15","default":"5"},"loan_duration_yr":{"min":"1","max":"7","default":"1"},"lumpsum_compound":{"default":"6"}}},"home":{"data":{"cost":{"min":"1000000","max":"30000000","default":"1000000"},"duration_in_yr":{"min":"1","max":"30","default":"1"},"downpayment_perc":{"min":"10","max":"100","default":"20"},"lumpsum_avlbl":{"min":"0","max":"100000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"emi_int_rate":{"min":"5","max":"15","default":"5"},"loan_duration_yr":{"min":"1","max":"30","default":"20"},"lumpsum_compound":{"default":"6"},"risk_profile":{"default":"moderate investor"}}},"education":{"data":{"cost":{"min":"100000","max":"17000000","default":"100000"},"duration_in_yr":{"min":"1","max":"30","default":"1"},"lumpsum_avlbl":{"min":"0","max":"30000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"lumpsum_compound":{"default":"6"}}},"wedding":{"data":{"cost":{"min":"100000","max":"5000000","default":"100000"},"duration_in_yr":{"min":"1","max":"30","default":"1"},"lumpsum_avlbl":{"min":"0","max":"50000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"lumpsum_compound":{"default":"6"}}},"retirement":{"data":{"current_age":{"min":"18","max":"69","default":"18"},"retirement_age":{"min":"19","max":"70","default":"19"},"curr_mnthly_exp":{"min":"5000","max":"500000","default":"5000"},"lumpsum_avlbl":{"min":"0","max":"20000000","default":"0"},"inflation_rate":{"min":"2","max":"6","default":"5.5"},"incr_saving_rate":{"min":"0","max":"10","default":"5"},"lumpsum_compound":{"default":"6"}}},"insurance":{"data":{"inflation_rate":{"min":"2","max":"6","default":"5.5"}}},"family_protection":{"data":{"current_age":{"min":"20","max":"60","default":"20"},"retirement_age":{"min":"45","max":"65","default":"45"},"monthly_income":{"min":"5000","max":"500000","default":"5000"},"existing_cover":{"min":"0","max":"","default":"0"},"monthly_expense":{"min":"5000","max":"500000","default":"5000"},"inflation_rate":{"min":"","max":"","default":"6"}}}}}};
        }
        this.restapiProvider.userData['defaultData'] = JSON.stringify(response);
        this.utilitiesProvider.defaultData = response;
        this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
        this.getUserProfileMaster();
      },
        (error) => {
          this.pageLoader = false;
        })
  }

  getUserProfileMaster() {
    let request = {
      "LangId": localStorage.getItem("langId"),
      'TokenId': this.restapiProvider.userData['tokenId'],
    };
    return this.restapiProvider.sendRestApiRequest(request, 'GetUserProfileMaster')
      .subscribe((response) => {
        this.restapiProvider.userData['getUserProfileMaster'] = JSON.stringify(response.Data);
        this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
        this.utilitiesProvider.defaultData = response;
        this.getUserProfile();
      },
        (error) => {
          this.pageLoader = false;
        })
  }

  getUserProfile() {
    this.pageLoader = true;
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "LangId": localStorage.getItem("langId")
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetUserDetails')
      .subscribe((response) => {
        this.GetMasters();
        // console.log("appComponent",response);
        if (response.IsSuccess == true) {
          this.restapiProvider.userData['profileImg'] = response.Data.Table[0].ImagePath;
          this.restapiProvider.userData['userPersonalDetails'] = JSON.stringify(response.Data);
          this.restapiProvider.userData['MPINFlag'] = response.Data.Table[0].MPINFlag;
          this.restapiProvider.userData['MPINTYPE'] = response.Data.Table[0].MPINTYPE;
          this.restapiProvider.userData['SMSFlag'] = response.Data.Table[0].SMSFlag;
          this.restapiProvider.userData['NotificationFlag'] = response.Data.Table[0].NotificationFlag;
          this.restapiProvider.userData['riskAssess'] = JSON.stringify(response.Data.Table7);
        }
        else {
          this.pageLoader = false;
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }


  GetMasters() {
    let request = {
      "IsCache": false,
      "LangId": localStorage.getItem("langId"),
      'TokenId': this.restapiProvider.userData['tokenId'],
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetMasters')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          this.restapiProvider.userData['GetMasters'] = JSON.stringify(response.Data);
          this.restapiProvider.userData['appDataMaster'] = JSON.stringify(response.Data);
          if (this.platform.is('core') || this.platform.is('mobileweb')) {
            localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData));
          }
          else {
            this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
          }
          this.utilitiesProvider.initLangLable();
        }
        this.pageRedirection();
      },
        (error) => {
          this.pageLoader = false;
        })
  }

  initializeUpshot() {
    this.appVersion.getVersionNumber().then((version) => {
      var params = {
        'UpshotApplicationID': config["UpshotApplicationID"],
        'UpshotApplicationOwnerID': config["UpshotApplicationOwnerID"],
        'UpshotFetchLocation': true,
        'UpshotApplicationLaunchOptions': config["UpshotApplicationLaunchURL"],
        'upshotHybridApp': true,
        'appVersion': version,
        'buildVersion': version,
        'enableDebugLogs': true,
        'subscribePush': false,
        'upshotNewInstall': false,
        'mergeUserProfile': true,
        'retainSession': false,
        'deeplinkRedirection': true
      }
      console.log(cordova)
      cordova.plugins.UpshotPlugin.initialize(params);
      console.log("upshot userid >>>",cordova.plugins.UpshotPlugin.getUserId());
      
      let upshotID = cordova.plugins.UpshotPlugin.getUserId();
      if(upshotID) {
        this.utilitiesProvider.upshotUserData.userId = upshotID;
      }

      this.utilitiesProvider.registerUpshotLaunchEvent();
      this.upshotRuleBasedCallback();
      this.registerUpshotPush();
    });
  }

  checkAndUpdateUpshotProfile() {
    try {
      let upshotProfile = cordova.plugins.UpshotPlugin.getCurrentProfile();

      if (!upshotProfile["appuid"] || !upshotProfile["userName"]) {
        if (this.restapiProvider.userData['CustomerID'] && this.restapiProvider.userData['customerName']) {
          this.updateUphotUserProfile();
        }
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  /**Update Upshot Profile added 07-12-2020 */
  updateUphotUserProfile() {
    try {
      console.log('updateUphotUserProfile()')

      let request = {
        "LangId": "1",
        'TokenId': this.restapiProvider.userData['tokenId'],
      };
      return this.restapiProvider.sendRestApiRequest(request, 'GetUserProfileMaster')
        .subscribe((response) => {
          if (response.IsSuccess == true) {
            this.utilitiesProvider.userProfileDetailEn = response.Data;
            let personalDetails = JSON.parse(this.restapiProvider.userData["userPersonalDetails"]);
            var req = {
              "appuid": this.restapiProvider.userData['CustomerID'],
              // "userName": this.restapiProvider.userData['customerName'],
              // "language": localStorage.getItem("langId") == "2" ? "Hindi" : "English",
              // "phone": this.restapiProvider.userData['mobileNo'] || '',
              // "email": this.restapiProvider.userData['emailId'] || '',
              // "qualification": personalDetails.Table[0]['EducationName'] || '',
              // "occupation": personalDetails.Table[0]['OccupationName'] || '',
              // "age": Number(personalDetails.Table[0]['Age']) || 0,
              // "gender": this.utilitiesProvider.getUpshotGenderFormat(this.restapiProvider.userData['gender']),
              // "maritalStatus": this.utilitiesProvider.getUpshotMaritalFormat(personalDetails.Table[0]['MaritialStatus']),
              // "dob": this.utilitiesProvider.getUpshotDOBFormat(this.restapiProvider.userData['dob']),
              // "localeCode": localStorage.getItem("langId") == "2" ? "hi_IN" : "en_US",
              "others": {
                // "profileCompletion": personalDetails.Table[0]['ProfileScore'],
                // "livingIn": personalDetails.Table[0]['CityOfResidence'],
                "lifeStage": personalDetails.Table[0]['MaritialStatus'],
                // "familyMemberCount": personalDetails.Table1.length,
                // "industry": personalDetails.Table[0]['Industry'],
                // "designation": personalDetails.Table[0]['DesignationName'],
                // "workExperience": personalDetails.Table[0]['Experiance'],
                "incomeRange": personalDetails.Table[0]['IncomeGroup'],
                "riskAssessmentResult": personalDetails.Table[0]['Risk_AssestMent_Output'],
                // "lumpsumSavings": personalDetails.Table[0]['LumpSum'],
                // "emergencyFunds": personalDetails.Table[0]['EmergencyFunds'],
                // "assetsValueTotal": personalDetails.Table[0]['Asset_value'],
                // "monthlyExpensesTotal": personalDetails.Table[0]['MontlyExpense'],
                // "estimatedTotalLiabilities": personalDetails.Table[0]['Liabilites'],
                // "ancestorProperty": personalDetails.Table[0]['AncestorProperty'],
                "preferredInvestment": this.utilitiesProvider.getPreferenceList(personalDetails.Table5),
                // "hobbies": this.utilitiesProvider.getHobbiesList(personalDetails.Table6),
                // "city": personalDetails.Table[0]['CityOfResidence'],
                "ageGroup": this.utilitiesProvider.getAgeGroup(Number(personalDetails.Table[0]['Age'])),
                // "motherTongue": personalDetails.Table[0]['MotherTongue']
              }
            }

            // req = this.utilitiesProvider.setFamilyMemberDetails(req, personalDetails);
            // req = this.utilitiesProvider.setBreakupDetails(req, personalDetails);

            // if (!req.email) { // remove email property if not available
            //   delete req.email;
            // }

            // if (!req.phone) { // remove phone property in case not available
            //   delete req.phone;
            // }

            // if (req.phone) { // adding country code if not present (required in upshot)
            //   if (req.phone.indexOf('+') == -1) {
            //     req.phone = "+91" + req.phone;
            //   }
            // }

            console.log("UPSHOT PROFILE REQUEST:: >>>", req)

            cordova.plugins.UpshotPlugin.updateUserProfile(req);
          }
        },
          (error) => {
            // this.pageLoader = false;
          })
    }
    catch (err) {
      console.log(err)
    }
  }

  registerUpshotPush() {
    let _that = this;
    cordova.plugins.UpshotPlugin.registerForPushWithForeground(true, status);

    cordova.plugins.UpshotPlugin.getDeviceToken(function (response) {
      //get device token from response and send to Upshot based on platfrom
      console.log("get device token",response);
      if (_that.platform.is('ios')) {
        cordova.plugins.UpshotPlugin.sendDeviceToken(response, 'ios');
      }
      else if (_that.platform.is('android')) {
        cordova.plugins.UpshotPlugin.sendDeviceToken(response, 'android');
      }
      cordova.plugins.UpshotPlugin.getPushPayload(function (payload) {
        //get push payload from response and send to Upshot
        console.log("push payload",payload);
        cordova.plugins.UpshotPlugin.pushClickEvent(payload);
        // cordova.plugins.UpshotPlugin.sendPushDetails(payload, function (res) {
        //   console.log(res)
        // });
        console.log("current page", _that.nav.getActive())
        payload = payload;
        if(payload["bk"]) {
          if (payload.appData) {
            let redirectData = {};
            if (typeof payload.appData == "string") {
              redirectData = JSON.parse(payload.appData);
            }
            else {
              redirectData = payload.appData;
            }
            if (redirectData["PageName"]) {
              _that.pushRedirection(redirectData);
            }
          }
        }
        else {
          console.log("onesignal notification recieved", payload)
          _that.restapiProvider.presentToastTop("New Notification");
          _that.notification();
        }
      });
      cordova.plugins.UpshotPlugin.subscribePush();
    }, function (err) {
      //failed to get device token
      console.log("getDeviceToken error", err)
    });
  }

  pushRedirection(redirectData) {
    this.utilitiesProvider.redirPageName = redirectData.PageName;
    if (redirectData.PageName == "ArticleDetailsPage" || redirectData.PageName == "InfographicsDetailsPage") {
      this.utilitiesProvider.redirArticleID = redirectData.ArticleID;
    }

    if (this.nav.getActive()) { // this will run when app is in open status on push click
      if (this.utilitiesProvider.redirPageName == "ArticleDetailsPage" || this.utilitiesProvider.redirPageName == "InfographicsDetailsPage") {
        if (this.utilitiesProvider.redirArticleID) {
          this.nav.push(this.utilitiesProvider.redirPageName, {
            data: this.utilitiesProvider.redirArticleID,
            fromPage: "Push Notification"
          });
          this.utilitiesProvider.redirPageName = "";
          this.utilitiesProvider.redirArticleID = "";
        }
      }
      else {
        this.nav.push(this.utilitiesProvider.redirPageName, { pageFrom: "Push Notification" });
        this.utilitiesProvider.redirPageName = "";
        this.utilitiesProvider.redirArticleID = "";
      }
    }
  }

  upshotRuleBasedCallback() {
    console.log("add rule base callback")
    let _that = this;
    window.addEventListener('UpshotActivityShared', function (e) {
      console.log("UpshotActivityShared", e);
      // let a = {
      //   image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwA…BWipAsGrpxvO2EfBR4P8AIynWLuGhZVsAAAAASUVORK5CYII=",
      //   text: "",
      //   activityName: "UpshotActivityTypeInAppMessage"
      // }

      if(e["image"]) {
        _that.utilitiesProvider.upshotSharing(e["text"], e["image"])
      }
    });

    window.addEventListener('UpshotActivityDeeplinkCallback', function (e) { //Custom Event Callback
      console.log("UpshotActivityDeeplinkCallback", e);
      if (e["detail"]) {
        if (e["detail"]["deeplink"]) {
          let deepLinkStr = e["detail"]["deeplink"];
          let deepLinkArr = deepLinkStr.split(",");

          if (deepLinkArr.length == 2) {
            if (deepLinkArr[0].indexOf("PageName") > -1 && (deepLinkArr[0].indexOf("ArticleDetailsPage") > -1 || deepLinkArr[0].indexOf("InfographicsDetailsPage") > -1)) {
              if (deepLinkArr[1].indexOf("ArticleID") > -1) {
                let pageName = deepLinkArr[0].split("=")[1];
                let articleID = deepLinkArr[1].split("=")[1];
                if (articleID) {
                  _that.nav.push(pageName, { data: articleID, fromPage: "Event Action" });
                }
              }
            }
          }
          else {
            if (deepLinkArr[0].indexOf("PageName") > -1 && deepLinkArr[0].indexOf("=") > -1) {
              let pageName = deepLinkArr[0].split("=")[1];
              if (pageName) {
                _that.nav.push(pageName, { pageFrom: "Event Action" });
              }
            }
          }
        }
      }
    });
  }
}
