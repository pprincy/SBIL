import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Nav, Platform, App, Content } from 'ionic-angular';
//import  '../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { MyApp } from '../../../app/app.component';
import { MenuController, AlertController } from 'ionic-angular';
import { TabsPage } from '../../dashboard/tabs/tabs';
import { Network } from '@ionic-native/network';
import { AppVersion } from '@ionic-native/app-version';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { config } from '../../../shared/config';
import { DecimalPipe } from '@angular/common';
// declare var SMS: any;
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html',
})
export class DiscoverPage {
  @ViewChild(Content) content: Content;
  public loading: any;
  public recommendedArticlesList: any = [];
  public newsList: any = [];
  public articleCountByTagsList: any = [];
  public cardSliderList: any = [];
  public imgURL;
  public imgURLNew;
  public isApp;
  public planYourLife: any = [];
  public disclaimerShow: boolean = false;
  public textDisclaimer;
  public cardSliderListShow: boolean = false;
  public questAnsRespArr: any = [];
  public questSet: any;
  public questAnsArr: any = [];
  public questAnsReqObject: any = [];
  public monthlyExpensesArr: any = {};
  public yesNoArray: any = {};
  public showMonthlyExpenses: boolean = false;
  public showQues: boolean = false;
  public showThanksCard: boolean = false;
  public twoQuesAnsPara: any = [];
  public monthlyExpense;
  public minMonthlyExpense = 1000;
  public maxMonthlyExpense = 100000;
  public monthlyExpenseComma = "";
  public steps = 1000;
  public yesNoAns;
  public showQuesNumber;
  public infographicList: any = [];
  public versionCode = '2.1.4';
  public breakupArray: any = [];
  /***Quiz Survey 16-06-2020***/
  public quizSurveyList = [];
  public surveyList = [];
  public quizList = [];
  public isSurveyData = true;
  public isQuizData = true;
  /***Quiz Survey 16-06-2020***/
  public isSubscPause = false;
  public isSubscResume = false;
  public tipsList: any = [];
  public goalsList: any = []; //22-12-2022
  public showHideIcon = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private nav: Nav,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    private loadingCtrl: LoadingController,
    public platform: Platform,
    public myApp: MyApp,
    public menu: MenuController,
    public alertController: AlertController,
    public tabsPage: TabsPage,
    public androidPermissions: AndroidPermissions,
    public app: App,
    public network: Network,
    private numberPipe: DecimalPipe,
    public appVersion: AppVersion) {
    this.imgURL = this.restapiProvider.getImageURL();
    this.imgURLNew = config.imgURLNew;
    this.questSet = new Set();
    this.monthlyExpense = 1000;
    this.monthlyExpenseComma = "₹ 1,000";
    localStorage.removeItem("temp");
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.utilitiesProvider.initLangLable();
    }, 100);
    this.myApp.notification();
    this.restapiProvider.sessionExpired();
    if (localStorage.getItem('tokenExpired') == "Yes") {
      this.app.getRootNav().setRoot("LoginPage");
      localStorage.removeItem('tokenExpired');
    }

    this.appVersion.getVersionNumber().then((version) => {
      this.versionCode = version;
    },
      (error) => {
      });

    // console.log("Version: ", this.versionCode);
    this.utilitiesProvider.upshotScreenView('Discover');
    this.utilitiesProvider.upshotTagEvent('Discover');

    if(!this.utilitiesProvider.upshotUserData.userId || !this.utilitiesProvider.upshotUserData.appUId) {
      this.setUpshotEventsParam(); // set common params used in upshot custom events
    }
  }

  ionViewDidLoad() {
    this.popularGoals();
    console.log("redirPAge", this.utilitiesProvider.redirPageName);
    if (this.utilitiesProvider.redirPageName) {
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

    if (!this.utilitiesProvider.isResumePauseListenerSet) {
      this.utilitiesProvider.isResumePauseListenerSet = true;
      this.platform.pause.subscribe(() => { //added isSubscPause & isSubscResume bcoz its getting triggered on subscription
        if (this.isSubscPause) {
          console.log("platform pause >>>")
          this.utilitiesProvider.registerUpshotSessionEndEvent();
          this.isSubscPause = false;
          this.isSubscResume = true;
        }
        this.isSubscPause = true;
      });
      this.platform.resume.subscribe(() => {
        if (this.isSubscResume) {
          console.log("platform resume >>>")
          this.utilitiesProvider.registerUpshotLaunchEvent();
          this.isSubscPause = true;
          this.isSubscResume = false;
        }
        this.isSubscResume = true;
      });
    }

    this.myApp.updatePageUseCount("7");
    this.menu.enable(true, 'sidemenu');
    if (this.network.type === 'none') {
      this.restapiProvider.noInternetPromt();
    }
    else {
      this.utilitiesProvider.googleAnalyticsTrackView('Discover');
      this.cardsLifePlanListing();
      this.recommendedArticles();
      this.newsUpdates();
      this.articleCountByTags();
      this.userPriorityQuestionList();
      this.infographics();
      this.tipsFunc();
      // if (this.platform.is('core') || this.platform.is('mobileweb')) {
      // }
      // else {
      //   this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
      //     success => {
      //     },
      //     err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS));
      //   this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]).then(
      //     success => {
      //     },
      //     err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS));
      // }
    }
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
    this.myApp.getUserPersonalDetails();

    /***Quiz Survey 16-06-2020***/      
    this.getSurveyQuizList();
  }
  //Recommended Articles 
  recommendedArticles() {

    this.tabsPage.showLoader();
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId']
    }
    // console.log("Request: " + JSON.stringify(request));
    return this.restapiProvider.sendRestApiRequest(request, 'ArticleList')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.tabsPage.hideLoader();
        }
        else {
          this.tabsPage.hideLoader();
        }
      },
        (error) => {
          this.tabsPage.hideLoader();
        })
  }

  //News Details
  newsUpdates() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],

    }
    // console.log("Request: " + JSON.stringify(request));
    return this.restapiProvider.sendRestApiRequest(request, 'NewsUpdates')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.newsList = response.Data.Table;
        }
        else {
          this.newsList = [];
        }
      },
        (error) => {
        })
  }


  //Article Count By Tags
  articleCountByTags() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId']
    }
    // console.log("Request: " + JSON.stringify(request));
    return this.restapiProvider.sendRestApiRequest(request, 'ArticleCountByTags')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.articleCountByTagsList = response.Data.Table;
        }
        else {
        }
      },
        (error) => {
        })
  }

  //CardsLifePlanListing
  cardsLifePlanListing() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      'TopCount': '3',
      'VersionId': this.versionCode
    }
    return this.restapiProvider.sendRestApiRequest(request, 'CardsLifePlanListing')
      .subscribe((response) => {
        // console.log(response);
        if (response.IsSuccess == true) {
          this.cardSliderList = response.Data.Table;
          if (this.cardSliderList.length > 0) {
            this.cardSliderListShow = true;
          }
          this.planYourLife = response.Data.Table1;
          this.recommendedArticlesList = response.Data.Table2;
        }
        else {
        }
      },
        (error) => {
        })
  }

  //infographics
  infographics() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      'TopCount': '3'
    }
    return this.restapiProvider.sendRestApiRequest(request, 'Infographics')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.infographicList = response.Data.Table;
        }
        else {
        }
      },
        (error) => {
        })
  }

  toggleSection(i) {
    this.infographicList[i].open = ! this.infographicList[i].open;
  }

  //UserPriorityQuestionList
  userPriorityQuestionList() {
    this.questSet = new Set();
    this.questAnsRespArr = [];
    this.questAnsArr = [];
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "QuestionId": "",
      "Count": ""
    }
    if (localStorage.getItem("quesToHide")) {
      let quesCheck = JSON.parse(localStorage.getItem("quesToHide"))
      if (quesCheck.count == 10) {
        let qId = JSON.stringify(quesCheck.quesId);
        request.QuestionId = qId.replace("[", "").replace("]", "");
        request.Count = "10";
      }
      else {
        request.QuestionId = "";
        request.Count = "";
      }
    }
    return this.restapiProvider.sendRestApiRequest(request, 'UserPriorityQuestionList')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.restapiProvider;

          this.questAnsRespArr = response.Data.Table;

          if (this.questAnsRespArr) {
            if (this.questAnsRespArr.length > 0) {
              this.showQues = true;
              this.localSetQuesCount(this.questAnsRespArr)
              if (this.questAnsRespArr[0].QuestionID == 105) {
                this.monthlyExpensesArr = this.questAnsRespArr[0];
                this.showMonthlyExpenses = true;
                this.showQuesNumber = "Monthly";
              }
              else if (this.questAnsRespArr[0].QuestionID == 106) {
                this.yesNoArray = this.questAnsRespArr[0];
                this.showMonthlyExpenses = true;
                this.showQuesNumber = "yesNo";
              }
              else {
                this.showMonthlyExpenses = false;
                this.showQuesNumber = "multi";
                this.mappingQuestAns();
              }
            }
          }
        }
      },
        (error) => {
        })
  }

  localSetQuesCount(q) {
    let a = [];
    for (let i = 0; i < q.length; i++) {

      if (a.indexOf(q[i].QuestionID) == -1) {
        a.push(q[i].QuestionID);
        // console.log("***************************", a);
        // localStorage.setItem()
      }
      if (i == (q.length - 1)) {
        if (localStorage.getItem("quesToHide")) {
          let quesCheck = JSON.parse(localStorage.getItem("quesToHide"))

          if (a[0] == quesCheck.quesId[0]) {
            if (quesCheck.count == 10) {
              localStorage.removeItem("quesToHide");
            }
            else {
              quesCheck.count = quesCheck.count + 1;
              localStorage.setItem("quesToHide", JSON.stringify(quesCheck))
            }
          }
          else {
            localStorage.removeItem("quesToHide");
            let setQues = {
              "count": 1,
              "quesId": a
            }
            localStorage.setItem("quesToHide", JSON.stringify(setQues))
          }
        }
        else {
          let setQues = {
            "count": 1,
            "quesId": a
          }
          localStorage.setItem("quesToHide", JSON.stringify(setQues))
        }
      }
    }
  }
  checkQues() {

  }

  selectTwoQuesAns(ans) {
    if (this.twoQuesAnsPara.length > 0) {
      for (let i = 0; i < this.twoQuesAnsPara.length; i++) {
        if (this.twoQuesAnsPara[i].QuestionID == ans.QuestionID) {
          this.twoQuesAnsPara[i] = ans;
          // console.log(this.twoQuesAnsPara)
          break;
        }
        if ((this.twoQuesAnsPara.length - 1) == i) {
          this.twoQuesAnsPara.push(ans);
        }
      }
    }
    else {
      this.twoQuesAnsPara.push(ans);
    }
    // this.twoQuesAnsPara.push(ans);
  }
  submitQuesAns(type) {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      'QuesAns': []
    }
    if (type == 'twoQues') {
      if (this.questAnsArr.length == this.twoQuesAnsPara.length) {
        // console.log(this.twoQuesAnsPara)

        for (let i = 0; i < this.twoQuesAnsPara.length; i++) {
          this.twoQuesAnsPara[i]['Answer'] = "";
        }

        request.QuesAns = this.twoQuesAnsPara;
        this.updateUserPriorityQuestion(request);
      }
    }
    if (type == 'monthlyExpense') {
      request.QuesAns = [
        {
          "QuestionID": "105",
          "AnswerID": this.monthlyExpense
        }
      ]
      this.updateUserPriorityQuestion(request);
    }

    if (type == 'yesNoQues') {
      request.QuesAns = [
        {
          "QuestionID": "106",
          "AnswerID": this.yesNoAns
        }
      ]
      this.updateUserPriorityQuestion(request);
    }
  }

  yesNoQues(a) {
    this.yesNoAns = a;
  }

  //post Question Answer
  //UserPriorityQuestionList
  updateUserPriorityQuestion(request) {

    return this.restapiProvider.sendRestApiRequest(request, 'UpdateUserPriorityQuestion')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.showQues = false;
          this.showThanksCard = true;

        }
      },
        (error) => {
        })
  }

  proceed() {
    this.showThanksCard = false;

    this.userPriorityQuestionList();
  }



  //Go To ArticlesPage
  goToArticleCategory(header, categoryID) {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Discover",
      "Category": "Collection"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    this.app.getRootNav().push('ArticlesPage', { source: 'Collections', header: header, categoryID: categoryID });
  }

  goToArticles() {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Discover",
      "Category": "Latest News"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    this.app.getRootNav().push('ArticlesPage', { source: 'Collections', header: this.utilitiesProvider.langJsonData['collections']['collections'], categoryID: 102 });
  }

  goToAllArticles() {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Discover",
      "Category": "Personalized Reads"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    this.app.getRootNav().push('ArticlesPage', { source: 'Trends', header: this.utilitiesProvider.langJsonData['collections']['collections'], categoryID: '' });
  }

  showDisclaimer(sliderCard) {
    if (sliderCard.DisclaimerText) {
      this.disclaimerShow = !this.disclaimerShow;
      this.textDisclaimer = sliderCard.DisclaimerText;
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
  }
  hideDisclaimer() {
    this.disclaimerShow = !this.disclaimerShow;
    $('.header').removeClass('headerOverlay');
    $('.scroll-content').removeClass('scrollOverlay');
  }


  mappingQuestAns() {
    for (let i = 0; i < this.questAnsRespArr.length; i++) {
      if (!this.questSet.has(this.questAnsRespArr[i].QuestionID)) {
        this.questAnsArr.push({
          "Question": this.questAnsRespArr[i].Question,
          "QuestionID": this.questAnsRespArr[i].QuestionID,
          "AnswersArr": [{
            "Answer": this.questAnsRespArr[i].Answer,
            "AnswerID": this.questAnsRespArr[i].AnswerID,
            "QuestionID": this.questAnsRespArr[i].QuestionID,
          }],
        })
        this.questSet.add(this.questAnsRespArr[i].QuestionID);
      }
      else {
        for (let j = 0; j < this.questAnsArr.length; j++) {
          if (this.questAnsRespArr[i].QuestionID === this.questAnsArr[j].QuestionID) {
            this.questAnsArr[j]["AnswersArr"].push({
              "Answer": this.questAnsRespArr[i].Answer,
              "AnswerID": this.questAnsRespArr[i].AnswerID,
              "QuestionID": this.questAnsRespArr[i].QuestionID,
            })
            break;
          }
        }
      }
    }
    for (let i = 0; i < this.questAnsArr.length; i++)
      for (let j = 0; j < this.questAnsArr[i].AnswersArr.length; j++) {
        if (this.questAnsArr[i].AnswersArr[j].AnsDispOrder == 1) {
          this.questAnsReqObject.push({ "QuestionID": this.questAnsArr[i].QuestionID, "AnswerID": this.questAnsArr[i].AnswersArr[j].AnswerID })
          break;
        }
      }
    // console.log(this.questAnsArr);
    // console.log("Request: ", this.questAnsReqObject);
  }


  articleDetails(article, type) {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Discover",
      "Category": type == 'article'? "Personalized Reads" : "Latest News"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    this.app.getRootNav().push('ArticleDetailsPage', { data: article.ArticleID, fromPage: 'Discover' });
  }
  goNotificationList() {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Notification",
      "Category": "Notification"
    }
    console.log("HomeEvent>>>")
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    this.app.getRootNav().push('NotificationPage');
  }
  search() {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Search",
      "Category": "Search"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    this.app.getRootNav().push('SearchPage');
  }

  goToPlanLife() {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Discover",
      "Category": "Plan Your Life"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    this.app.getRootNav().push('PlanyourLifePage', {pageFrom: 'Discover'});
  }

  doRefresh(refresher) {
    this.cardsLifePlanListing();
    this.recommendedArticles();
    this.newsUpdates();
    this.articleCountByTags();
    this.userPriorityQuestionList();
    this.getSurveyQuizList();
    this.tipsFunc();
    setTimeout(() => {
      refresher.complete();
    }, 1000)
  }

  goToEditProfile() {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Discover",
      "Category": "Investment Choices"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    this.app.getRootNav().push('UserEditPage', { data: 2 });
  }

  cardClick(p) {
    if (p.GoalType == null || p.GoalTypeID == 7 || p.GoalType == "Family Protection") {
      // this.navCtrl.push('FamilyProtectionPage');
      this.app.getRootNav().push('FamilyProtectionPage', { pageFrom: 'Discover' });
    }
    else {
      this.app.getRootNav().push('ListingScreenGoalPage', { pageFrom: 'Discover' });
    }
  }

  infographicsDetails(a) {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Discover",
      "Category": "InfoGraphics"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    this.app.getRootNav().push('InfographicsDetailsPage', { 'data': a.ArticleID });
  }

  viewInfographics() {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Discover",
      "Category": "InfoGraphics"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    this.app.getRootNav().push('InfographicsLandingPage');
  }
  public splitQues(q) {
    let a = q.split("(");
    if (a.length > 0) {
      return a[1].replace(")", " ");
    }
    else {
      return a;
    }
  }

  /***Quiz Survey 16-06-2020***/      
  getSurveyQuizList() {
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "LangId": localStorage.getItem('langId')
    }
    // console.log(request);
    this.restapiProvider.sendRestApiRequest(request, 'SurveyQuizHeader').subscribe((response) => {
      if(config['isLive'] == 'No'){
        response = {
          "Type": "SUCCESS",
          "IsSuccess": true,
          "Data": {
              "Table": [
                  {
                      "QB_Header_ID": 84,
                      "QB_Header_Name": "3. Automobile - Quiz",
                      "Type": "S",
                      "Language": "1",
                      "LangName": "English",
                      "IsActive": 1
                  },
                  {
                      "QB_Header_ID": 86,
                      "QB_Header_Name": "4. Chocolate Quiz",
                      "Type": "S",
                      "Language": "1",
                      "LangName": "English",
                      "IsActive": 1
                  },
                  {
                      "QB_Header_ID": 87,
                      "QB_Header_Name": "5. gadgets Quiz ",
                      "Type": "Q",
                      "Language": "1",
                      "LangName": "English",
                      "IsActive": 1
                  },
                  {
                      "QB_Header_ID": 88,
                      "QB_Header_Name": "6. OTT Quiz",
                      "Type": "Q",
                      "Language": "1",
                      "LangName": "English",
                      "IsActive": 1
                  },
                  {
                      "QB_Header_ID": 89,
                      "QB_Header_Name": "7. current affairs Quiz",
                      "Type": "Q",
                      "Language": "1",
                      "LangName": "English",
                      "IsActive": 1
                  },
                  {
                      "QB_Header_ID": 90,
                      "QB_Header_Name": "8. Soft Drink - Quiz",
                      "Type": "Q",
                      "Language": "1",
                      "LangName": "English",
                      "IsActive": 1
                  }
              ]
          },
          "Message": "",
          "StatusCode": null
      }
      }
      if (response.IsSuccess == true) {
        if (response.Data.Table.length) {
          // console.log(response)
          this.quizSurveyList =  response.Data.Table;
          this.surveyList = this.quizSurveyList.filter(res => res.Type == "S")
          this.quizList = this.quizSurveyList.filter(res => res.Type == "Q")
          // console.log(this.surveyList)
          // console.log(this.quizList)

          if(this.surveyList.length) {
            this.isSurveyData = false;
          }
          if(this.quizList.length) {
            this.isQuizData = false;
          }
        }
      }
    },
      (error) => {
      })
  }

  goToSurveyPage(qbHeaderID) {
    this.utilitiesProvider.isFromMenu = false;
    this.navCtrl.push("SurveyQuestionsPage", {qbHeaderID: qbHeaderID});
  }

  goToQuizPage(qbHeaderID) {
    this.utilitiesProvider.isFromMenu = false;
    this.navCtrl.push("QuizQuestionsPage", {qbHeaderID: qbHeaderID});
  }

  setUpshotEventsParam() {
    try {
      let data = this.utilitiesProvider.upshotUserData;
      let personalDetails = JSON.parse(this.restapiProvider.userData["userPersonalDetails"]);
      if (!data.userId) { //user id
        let upshotID = cordova.plugins.UpshotPlugin.getUserId();
        if (upshotID) {
          this.utilitiesProvider.upshotUserData.userId = upshotID;
        }
      }

      if (!data.appUId) { // appuid
        this.utilitiesProvider.upshotUserData.appUId = this.restapiProvider.userData['CustomerID'];
      }

      if (!data.lang) {
        this.utilitiesProvider.upshotUserData.lang = (localStorage.getItem("langId") == "2" ? "Hindi" : "English") || '';
      }

      if (!data.city) {
        this.utilitiesProvider.upshotUserData.city = personalDetails.Table[0]['CityOfResidence'] || '';
      }

      if (!data.ageGroup) {
        this.utilitiesProvider.upshotUserData.ageGroup = this.utilitiesProvider.getAgeGroup(Number(personalDetails.Table[0]['Age']));
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  menuBtnClick() {
    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "SideMenu",
      "Category": "SideMenu"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);
  }

  //Tips
  tipsFunc() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      'TopCount': '3'
    }
    return this.restapiProvider.sendRestApiRequest(request, 'Tips') 
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.tipsList = response.Data.Table;
        }
        else {
        }
      },
        (error) => {

        })
  }

  tipsGo() {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Discover",
      "Category": "Tips"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    this.app.getRootNav().push('TipsListingPage');
  }

  isContentNew(d) {
    let d1 = new Date();
    let d2 = new Date(d);

    let diffTime = Math.abs(d1.getTime() - d2.getTime());
    let diffDays = diffTime / (1000 * 60 * 60 * 24);

    if(diffDays > 7) {
      return false;
    }
    else {
      return true;
    }
  }

  // forceUpdate(latestVer) {
  //   this.appVersion.getVersionNumber().then(currVersion => {
  //     if (this.isVersionLess(currVersion, latestVer)) {
  //       const alert = this.alertController.create({
  //         title: 'New update is Available!!',
  //         subTitle: 'Please Update to New Version ' + latestVer,
  //         buttons: [
  //           {
  //             text: 'Update',
  //             role: 'Okay',
  //             cssClass: 'secondary',
  //             handler: (blah) => {
  //               if (this.platform.is("android")) {
  //                 cordova.plugins.market.open('com.paisagenie.paisagenie')
  //               }
  //               else if (this.platform.is("ios")) {
  //                 cordova.plugins.market.open('id1392403705')
  //               }
  //             }
  //           },
  //         ],
  //         enableBackdropDismiss: false
  //       });
  //       alert.present();
  //     }
  //   });
  // }

  // isVersionLess(currVersion, latestVersion) {
  //   var currVerArr = currVersion.split('.');
  //   var latestVerArr = latestVersion.split('.');
  //   if(+currVerArr[0] < +latestVerArr[0]) {
  //     return true;
  //   }
  //   else {
  //     if(+currVerArr[0] > +latestVerArr[0]) {
  //       return false;
  //     }
  //     else {
  //       if(+currVerArr[1] < +latestVerArr[1]) {
  //         return true;
  //       }
  //       else {
  //         if(+currVerArr[1] > +latestVerArr[1]) {
  //           return false;
  //         }
  //         else {
  //           if(+currVerArr[2] < +latestVerArr[2]) {
  //             return true;
  //           }
  //           else {
  //             if(+currVerArr[2] > +latestVerArr[2]) {
  //               return false;
  //             }
  //             else {
  //               return false;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

   //CardsLifePlanListing
   popularGoals() {
    this.tabsPage.showLoader();
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId']
    }
    return this.restapiProvider.sendRestApiRequest(request, 'PopularGoals')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.goalsList = response.Data.Table;
          this.tabsPage.hideLoader();
        }
        else {
          this.tabsPage.hideLoader();
        }
      },
        (error) => {
          this.tabsPage.hideLoader();
        })
  }

  popularGoalClick(p) {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Plan",
      "Category": "Popular Goals"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    if (p.GoalTypeID == 8) { this.app.getRootNav().push('HealthInsurancePage', { pageFrom: 'Plan' }); }
    if (p.GoalTypeID == 7) { this.app.getRootNav().push('FamilyProtectionPage', { pageFrom: 'Plan' }); }
    if (p.GoalTypeID == 6) { this.app.getRootNav().push('CargoalPage', { pageFrom: 'Plan' }); }
    if (p.GoalTypeID == 3) { this.app.getRootNav().push('HomeGoalPage', { pageFrom: 'Plan' }); }
    if (p.GoalTypeID == 2) { this.app.getRootNav().push('ChildEducationPage', { pageFrom: 'Plan' }); }
    if (p.GoalTypeID == 4) { this.app.getRootNav().push('MarriagePage', { pageFrom: 'Plan' }); }
    if (p.GoalTypeID == 5) { this.app.getRootNav().push('RetirementGoalPage', { pageFrom: 'Plan' }); }
    if (p.GoalTypeID == 1) { this.app.getRootNav().push('CustomGoalPage', { pageFrom: 'Plan' }); }
  }

  showHide(){
    if(this.showHideIcon == false){
      this.showHideIcon = true;
    }else{
      this.showHideIcon = false;
    }
    
  }

  checkSteps(type) {
    switch (type) {
      case 'monthlyExpense':
        if (this.monthlyExpense >= (this.maxMonthlyExpense / 3) && this.monthlyExpense <= (this.maxMonthlyExpense / 2)) {
          this.steps = 1000;
        }
        else if (this.monthlyExpense >= (this.maxMonthlyExpense / 2)) {
          this.steps = 2000;
        }
        this.monthlyExpenseComma = "₹ " + (this.numberPipe.transform(this.monthlyExpense));
        break;

      default:
        break;
    }
  }

  formatAmount(val, type) {
    let amount : number = 0;
    let amountStr : String = "";
    if(val && val.trim() != "₹") {
      amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }
    if(type == "expense") {
      this.monthlyExpenseComma = "₹ " + amountStr;
      this.monthlyExpense = amount;
    }
  }
  
}

