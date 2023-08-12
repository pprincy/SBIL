import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Screenshot } from '@ionic-native/screenshot';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ToastController, Platform, App } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { Crop } from '@ionic-native/crop';
import { OneSignal } from '@ionic-native/onesignal';
import { config } from '../../shared/config';
import html2canvas from 'html2canvas';
import { TranslateService } from '@ngx-translate/core';
declare var cordova: any;
declare var upshot: any;
@Injectable()
export class UtilitiesProvider {
  public langJsonData: any = {};
  public sidemenuMenu: any = [];
  public sidemenuSubmenu: any = [];
  public tempValue: any;
  public tabsActive = 0;
  public savedGoalTabsSelectedIndex = 1;
  public rangeData;
  public jsErrorMsg: any = {};
  public commonLangMsg: any = {};
  public age18 = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65];
  public age40 = [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70];
  public age1To30 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
  public age1to80 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
    51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
    61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
    71, 72, 73, 74, 75, 76, 77, 78, 79, 80];
  public age100 = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
  public workExp2to50 = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]
  public screen: any = {};
  public state;
  public defaultCalData: any = {};
  public defaultGoalData: any = {};
  public defaultData: any = {};
  public UserProfileMaster: any = {};
  public GetMasterData: any = [];
  public noProfileImg = "assets/imgs/male_icon.svg";
  public noProfileImgFemale = "assets/imgs/female_icon.svg";
  public assetsGraphColor = ['color_fr', 'color_sec', 'color_tr', 'color_for', 'color_fi', 'color_si', 'color_sev', 'color_eig', 'color_nin', 'color_ten'];
  public goalsList: any = [];
  public calculatorList: any = [];
  public disclaimerText = '<p>The information, material, advices, suggestions, illustrations notifications, circulars etc. are collectively stated "the content" in this application. If the said content contains any mistakes, omissions, inaccuracies and typographical errors, etc. SBI Life assumes no responsibility thereof. </p>' +
    '<p>SBI Life makes no warranty or representation regarding any content provided through this application and disclaims its liabilities in respect thereof. Any action on your part on the basis of the said content is at your own risk and responsibility.</p>' +
    '<p>SBI Life reserves its right to correct any part of the said content at any time as and when required at its sole discretion. The content of this application shall not be displayed or printed in any form in part or whole without the prior written approval of SBI Life.</p>' +
    '<p>E-mail messages sent to SBI Life over the Internet cannot be guaranteed to be completely secure. The integrity of such messages cannot be guaranteed on the Internet and SBI Life will not be responsible for any damages incurred by users due to messages send or received by them to and from SBI Life. </p>' +
    '<p>SBI Life does not send emails from other than domain names - sbilife.co.in & sbi-life.com. Please do not respond to any mails other than email IDs with this domain name as same may be fraudulent/phishing emails.</p>'
  public infoPopupText: any = [];
  public isReplyQuiz = false;
  public isCheckQuiz = false;
  public isFromMenu = false; //for quiz/survey result close redirection
  public upshotUserData = {
    userId: "",
    appUId: "",
    lang: "",
    city: "",
    ageGroup: ""
  }
  public isResumePauseListenerSet = false; //setting listener for app open/close only once
  public redirPageName = "";
  public redirArticleID = "";
  public userProfileDetailEn; // for uphot profile reference (key values of breakup)

  constructor(public http: Http,
    public screenshot: Screenshot,
    public socialSharing: SocialSharing,
    public toastCtrl: ToastController,
    public ga: GoogleAnalytics,
    public firebaseAnalytics: FirebaseAnalytics,
    public platform: Platform,
    public crop: Crop,
    public oneSignal: OneSignal,
    public translateService: TranslateService,
    private app: App
  ) {
  }
  getTotal(totData): number {
    let total: number = 0;
    totData.forEach((e: any) => {
      total = total + Number(e.amount.toString().replaceAll(",",""));
    });
    return total;
  }
  //ScreenShot Code
  reset() {
    var self = this;
    setTimeout(function () {
      self.state = false;
    }, 1000);
  }
  screenShotURI() {
    this.screenshot.URI(80).then(res => {
      this.screen = res.URI;
      this.share(this.screen);
      this.state = true;
      this.reset();
    }, (err) => {
    });
  }
  share(a) {
    this.socialSharing.share('', '', a, '').then(() => {
    }).catch(() => {
    });
  }
  getRoundingFigure(val) {
    var vals = [];
    if (typeof val === 'number') {
    }
    else {
      val = parseFloat(val);
    }
    if (val < 100 || isNaN(val)) {
      vals[0] = val;
      vals[1] = '';
      vals[2] = '';
    }
    else if (val < 100000) {
      //   vals[0] = this.rounding(val / 1000, 2);
      //   vals[1] = 'K';
      //   vals[2] = 'K';
      vals[0] = val.toLocaleString('en-IN', { minimumFractionDigits: 0 });
      vals[1] = '';
      vals[2] = '';
    }
    else if (val < 10000000) {
      vals[0] = this.rounding(val / 100000, 2);
      vals[1] = 'L';
      vals[2] = 'Lacs';
    }
    else {
      vals[0] = this.rounding(val / 10000000, 2);
      vals[1] = 'Cr.';
      vals[2] = 'Cr';
    }
    // console.log(vals)
    return vals[0] + " " + vals[1];
  }
  // ==============================================
  rounding(a, b) {
    if (b > 0)
      return Math.round(a * Math.pow(10, b)) / Math.pow(10, b);
    else
      return Math.round(Math.round(a * Math.pow(10, b)) / Math.pow(10, b));
  }
  seperateCurrentDate() {
    let n = [];
    let retirementCorpusDateVar = new Date();
    n[0] = retirementCorpusDateVar.getFullYear();
    n[1] = retirementCorpusDateVar.getMonth();
    n[2] = retirementCorpusDateVar.getDate();
    return n;
  }
  savingSuggestedTipsTest(suggetedSaving) {
    let tipsText = "Save by not buying coffee daily";
    if (suggetedSaving <= 0) {
      tipsText = "Well planned you've already Saved enough";
    }
    else if (suggetedSaving > 0 && suggetedSaving < 5000) {
      tipsText = "Save by not buying coffee daily";
    }
    else if (suggetedSaving >= 5000 && suggetedSaving < 25000) {
      tipsText = "Save by not eating out daily";
    }
    else if (suggetedSaving >= 25000 && suggetedSaving < 100000) {
      tipsText = "Save by taking public transport daily";
    }
    else if (suggetedSaving >= 100000) {
      tipsText = "Save by not spending on drinks daily";
    }
    return tipsText;
  }
  public presentToastTop(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    })
    toast.present();
  }
  showEllipsisTitle(text) {
    let t;
    if (text) {
      if (text.length > 60) {
        t = text.substring(0, 60) + "...";
      }
      else {
        t = text
      }
      return t
    }
    else {
      return "";
    }

  }
  //Crop Image
  cropImg(imgPath) {
   
    let returnPara = {};
    return this.crop.crop(imgPath).then(newImage => {
      return this.toBase64(newImage).then((base64Img) => {
        return returnPara = {
          "status": "success",
          "img": base64Img
        }
      });
    }, error => {
      return this.toBase64(imgPath).then((base64Img) => {
        return returnPara = {
          "status": "success",
          "img": base64Img
        }
      });
    }
    );
  }
  toBase64(url: any) {
    return new Promise<any>(function (resolve) {
      
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function () {
          var reader = new FileReader();
          reader.onloadend = function () {
              resolve(reader.result);
          }
          reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url, false);
      xhr.send();
  });
  }
  //Google Analytics
  googleAnalyticsTrackView(viewName) {
    if (config['isLive'] == 'Yes') {
      if (this.platform.is('core') || this.platform.is('mobileweb')) {
      }
      else {
        this.ga.trackView(viewName);
        this.firebaseAnalytics.setCurrentScreen(viewName)
          .then((res: any) => console.log(res))
          .catch((error: any) => console.error(error));
      }
      // cordova.plugins.UpshotPlugin.createPageViewEvent(viewName.replace(" ",""))
      
      // this.firebaseAnalytics.logEvent('sbi_page_view', {page: viewName})
      // .then((res: any) => console.log(res))
      // .catch((error: any) => console.error(error));
    }
  }

  upshotScreenView(viewName) {
    try {
      console.log("upshotScreenView()")
      // if (config['isLive'] == 'Yes') {
      if (this.platform.is('core') || this.platform.is('mobileweb')) {
      }
      else {
        cordova.plugins.UpshotPlugin.createPageViewEvent(viewName);
      }
      // }
    }
    catch (e) {
      console.log(e)
    }
  }

  upshotCustomEvent(eventName, payload, isTimedEvent) {
    try {
      console.log("upshotCustomEvent()")
      // if (config['isLive'] == 'Yes') {
      if (this.platform.is('core') || this.platform.is('mobileweb')) {
      }
      else {
        cordova.plugins.UpshotPlugin.createCustomEvent(eventName, payload, isTimedEvent);
      }
      // }
    }
    catch (e) {
      console.log(e)
    }
  }

  upshotTagEvent(tagName) {
    try {
      console.log("upshotTagEvent() ::", tagName)
      // if (config['isLive'] == 'Yes') {
      if (this.platform.is('core') || this.platform.is('mobileweb')) {
      }
      else {
        let _that = this;
        cordova.plugins.UpshotPlugin.getActivity('UpshotActivityTypeAny', tagName,
          {
            willAppear: function (activityName) {
              console.log(activityName)
            },
            didAppear: function (activityName) {
              console.log(activityName)
            },
            didDismiss: function (activityName) {
              console.log(activityName)
            },
            shareCallback: function (data, activityName) {
              console.log("share data", data)
              console.log("share activity", activityName)
              // let a = {
              //   image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwA…BWipAsGrpxvO2EfBR4P8AIynWLuGhZVsAAAAASUVORK5CYII=",
              //   text: "",
              //   activityName: "UpshotActivityTypeInAppMessage"
              // }

              if (data["image"]) {
                _that.upshotSharing(data["text"], data["image"])
              }
            },
            deeplinkCallback: function (data, activityName) { //Tags Callback
              console.log("deeplink data", data)
              console.log("deeplink activity", activityName)
              if (data) {
                if (data.deeplink) {
                  let deepLinkStr = data.deeplink;
                  let deepLinkArr = deepLinkStr.split(",");

                  if (deepLinkArr.length == 2) {
                    if (deepLinkArr[0].indexOf("PageName") > -1 && (deepLinkArr[0].indexOf("ArticleDetailsPage") > -1 || deepLinkArr[0].indexOf("InfographicsDetailsPage") > -1)) {
                      if (deepLinkArr[1].indexOf("ArticleID") > -1) {
                        let pageName = deepLinkArr[0].split("=")[1];
                        let articleID = deepLinkArr[1].split("=")[1];
                        if (articleID) {
                          console.log(articleID)
                          _that.app.getRootNav().push(pageName, { data: articleID, fromPage: "Tag Action" });
                        }
                      }
                    }
                  }
                  else {
                    if (deepLinkArr[0].indexOf("PageName") > -1 && deepLinkArr[0].indexOf("=") > -1) {
                      let pageName = deepLinkArr[0].split("=")[1];
                      if (pageName) {
                        console.log(pageName)
                        _that.app.getRootNav().push(pageName, { pageFrom: "Tag Action" });
                      }
                    }
                  }
                }
              }
            }
          }
        );
      }
      // }
    }
    catch (e) {
      console.log(e)
    }
  }

  

  setUpshotShareEvent(module, cat) {
    let payload = {
      "Appuid": this.upshotUserData.appUId,
      "Language": this.upshotUserData.lang,
      "City": this.upshotUserData.city,
      "AgeGroup": this.upshotUserData.ageGroup,
      "Category": cat,
      "Module": module
    }
    console.log(payload)
    this.upshotCustomEvent('Share', payload, false);
  }

  initGoogleAnalytics() {
    if (config['isLive'] == 'Yes') {
      //  this.ga.startTrackerWithId('UA-108809014-5')   //  Finoux
      this.ga.startTrackerWithId('UA-20377002-5') //  Paisa Genie
        .then(() => {
        })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
    }
  }
  //One signal Push Notification
  oneSignalPushInit() {
    if (config['isLive'] == 'Yes') {
      this.oneSignal.startInit('9303b312-afcb-4259-a469-07af42740384', '123275891232');  //  Paisa Genie Live
      // this.oneSignal.startInit('d028358c-736e-4452-8ccc-9ae5145e9fe7', '940659848289'); //testing 

    }
    else {
      //this.oneSignal.startInit('9303b312-afcb-4259-a469-07af42740384', '123275891232'); //  Paisa Genie Live
      // this.oneSignal.startInit('9780168f-c429-4eec-afdb-cb89aa796548', '675053805628'); //  Finoux
      this.oneSignal.startInit('d028358c-736e-4452-8ccc-9ae5145e9fe7', '940659848289');
    }
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.endInit();
    // var notificationOpenedCallback = function(jsonData) {
    //   alert(JSON.stringify(jsonData));
    //   console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    // };
  }
  initLangLable() {
    let lang = localStorage.getItem("lang") ? localStorage.getItem("lang") : "en";
    this.http.get('assets/i18n/' + lang + '.json').map(res => res.json()).subscribe(data => {
      this.langJsonData = data;
      this.goalsList = this.langJsonData['goalListing']['goalList'];
      this.sidemenuMenu = this.langJsonData['sidemenu']['menuPage'];
      this.sidemenuSubmenu = this.langJsonData['sidemenu']['subMenu'];
      this.calculatorList = this.langJsonData['tools']['toolsListing'];
      this.jsErrorMsg = this.langJsonData['errorMsg'];
      this.commonLangMsg = this.langJsonData['common'];
      this.infoPopupText = this.langJsonData['infoPopup']
    });
  }

  htmlToCanvas(id) {
    return new Promise((resolve) => {
      const node = document.getElementById(id);
      setTimeout(() => {
        let option = {foreignObjectRendering: true};
        html2canvas(node, option).then((canvas) => {
          // console.log(canvas)
          var dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          // console.log(dataUrl)
          this.share(dataUrl);
          resolve(true);
        })
          .catch(err => {
            console.log(err)
            resolve(false);
          })
      }, 1000);
      
    })
  }

  setBreakupDetails(req, personalDetails) {
    if(personalDetails.Table2.length) { //assets breakup
      personalDetails.Table2.forEach(el => {
        let keysVal = this.userProfileDetailEn.Table1.filter(elem=>elem.id == el.AssetID);
        if(keysVal[0]["value"]) {
          if(!(("Asset" + keysVal[0].value.replace(/ /g, '')) in req.others)) {
            req.others["Asset" + keysVal[0].value.replace(/ /g, '')] = el.AssetValue;
          }
        }
      });
    }

    if(personalDetails.Table3.length) { //liabilities breakup
      personalDetails.Table3.forEach(el => {
        let keysVal = this.userProfileDetailEn.Table2.filter(elem=>elem.id == el.DebtID);
        if(keysVal[0]["value"]) {
          if(!(("Liability" + keysVal[0].value.replace(/ /g, '')) in req.others)) {
            req.others["Liability" + keysVal[0].value.replace(/ /g, '')] = el.DebtValue;
          }
        }

        
      });
    }

    if(personalDetails.Table4.length) { //expense breakup
      personalDetails.Table4.forEach(el => {
        let keysVal = this.userProfileDetailEn.Table.filter(elem=>elem.MonthlyExpenseID == el.ExpenseID);
        if(keysVal[0]["MonthlyExpenseName"]) {
          if(!(("Expense" + keysVal[0].MonthlyExpenseName.replace(/ /g, '')) in req.others)) {
            req.others["Expense" + keysVal[0].MonthlyExpenseName.replace(/ /g, '')] = el.ExpenseValue;
          }
        }
      });
    }

    return req
  }

  setFamilyMemberDetails(req, personalDetails) {
    if(personalDetails.Table1.length) {
      personalDetails.Table1.forEach((el, i) => {
        req.others["mobileNumber"+(i+1)+"Relation"] = el.DepRelationShip;
        req.others["mobileNumber"+(i+1)+"Name"] = el.DepedentName;
        req.others["mobileNumber"+(i+1)+"Age"] = el.DepAge;
      });
    }
    return req
  }

  getUpshotGenderFormat(gender) {
    if ((gender || '').toLowerCase() == 'male') {
      return upshot.profile.gender.male
    }
    else if ((gender || '').toLowerCase() == 'female') {
      return upshot.profile.gender.female
    }
    else {
      return upshot.profile.gender.other
    }
  }

  getUpshotMaritalFormat(maritalStatus) {
    if ((maritalStatus || '').toLowerCase().indexOf('married') > -1) {
      return upshot.profile.maritalStatus.married
    }
    else {
      return upshot.profile.maritalStatus.single
    }
  }

  getUpshotDOBFormat(dob) {
    if (dob) {
      let day = Number(dob.split('-')[0]);
      let month = Number(dob.split('-')[1]);
      let year = Number(dob.split('-')[2]);
      if (day && month && year) {
        return {
          day: day,
          month: month,
          year: (new Date(year, month-1, day)).getFullYear()
        }
      }
      else {
        return {};
      }
    }
    else {
      return {};
    }
  }

  getHobbiesList(hobbiesArr) {
    let list = "";
    if(hobbiesArr.length) {
      hobbiesArr.forEach(el => {
        list += el.HobbyName + ", ";
      });
    }
    return list;
  }

  getPreferenceList(preferArr) {
    let list = "";
    let len = preferArr.length;
    if(preferArr.length) {
      preferArr.forEach(el => {
        list += el.InvestmentName + (len > 1 ? ", " : "");
      });
    }
    return list;
  }

  getAgeGroup(age) {
    if(age < 25) {
      return "<25";
    }
    else if(age >= 25 || age <= 35) {
      return "25 - 35"
    }
    else if(age >= 36 || age <= 45) {
      return "36 - 45"
    }
    else if(age >= 46 || age <= 55) {
      return "46 - 55"
    }
    else if(age >= 56 || age <= 60) {
      return "56 - 60"
    }
    else if(age > 60) {
      return "60+"
    }
    else {
      return ""
    }
  }

  registerUpshotLaunchEvent() {
    console.log("AppLaunch event")
    this.upshotCustomEvent('AppLaunch', {}, false);
  }

  registerUpshotSessionEndEvent() {
    console.log("SessionEnd event ")
    this.upshotCustomEvent('SessionEnd', {}, false);
  }

  getLocaleLang() {
    return this.translateService.getBrowserCultureLang();
  }

  upshotSharing(text, image) {
    text = text || '';
    this.socialSharing.share(text, '', image, '').then(() => {
    }).catch(() => {
    });
  }
}
