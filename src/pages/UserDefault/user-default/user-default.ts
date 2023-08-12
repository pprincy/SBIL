import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides, LoadingController, Config } from 'ionic-angular';
import '../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { MyApp } from '../../../app/app.component';
import { TranslateService } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-user-default',
  templateUrl: 'user-default.html',
})
export class UserDefaultPage {

  @ViewChild(Content) content: Content;
  public sliderOptionsArr: any = []
  public profileData: any = [];
  public familyMembersArr: any = [];
  public assetDetailsArr: any = [];
  public liabilitiesArr: any = [];
  public expenseArr: any = [];
  public investTypeArr: any = [];
  public hobbiesArr: any = [];
  public childrenArr: any = [];
  public otherMembersArr: any = [];
  public popupDataObj: any;
  public hobbyImgDict: any;
  public lifeStyleImgDict: any;
  public imgURL: any;
  public childrenCount: any = 0;
  public pageLoader: boolean = false;
  public steps = 100;
  public amount;
  public minValue;
  public maxValue;
  public dob;
  minCarCost; maxCarCost; carCost;
  minTimeToBuyCar; maxTimeToBuyCar;
  minDownPayPer; maxDownPayPer; downPaymentPer; downPayment; minDownPayment; maxDownPayment;
  public isBtnActive: boolean = false;
  public status: boolean = false;
  postJson: any = {};
  backBtnhide: boolean = true;
  carList: any = [];
  public showTabItm = 0;
  @ViewChild(Slides) slides: Slides;
  loading: any; scrollHeight;
  public langName;
  public username;
  public maritalStatus;
  public montlyExpenseComma;
  public lumsumComma;
  public emergencyFundsComma;
  public ancestorPropertyComma;
  public assetValue;
  public liabilitiesValue;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    public myApp: MyApp,
    private loadingCtrl: LoadingController,
    public translate: TranslateService,
    public config: Config,
    private numberPipe: DecimalPipe,
    ) {
    this.username = this.restapiProvider.userData['customerName'];
    this.setLanguage();
    this.sliderOptionsArr = this.utilitiesProvider.langJsonData['myProfile']['tabs'];
    this.imgURL = this.restapiProvider.getImageURL();
    
    let revDOB = this.restapiProvider.userData['dob'].split("-").reverse();
    this.dob = revDOB.join("-");
    
    this.hobbyImgDict = {
      1: "reading",
      2: "watching",
      3: "family_time",
      4: "moview",
      5: "fishing",
      6: "exercise",
      7: "music",
      8: "shopping",
      9: "travel",
      28: "others"
    }
    this.lifeStyleImgDict = {
      1: "single.png",
      2: "married.png",
      3: "married_with_1kid.png",
      4: "married_with_2kids_or_more.png",
      5: "independent.png"
    }
  }
  ionViewDidEnter() {
    let a = $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
    if (a) {
      this.scrollHeight = a;
    }
    this.myApp.getUserPersonalDetails();
    this.myApp.updatePageUseCount("10");
    this.utilitiesProvider.googleAnalyticsTrackView('Default user profile');
    $('.tell_us_cont .tell_us_slider .slick-slide-item:nth-child(' + (this.showTabItm + 1) + ')').addClass('slick-current').siblings('.slick-slide-item').removeClass('slick-current');
    this.getUserProfileData();
    this.startLoad();

    this.utilitiesProvider.upshotScreenView('MyProfile');
    this.utilitiesProvider.upshotTagEvent('MyProfile');
  }
  ionViewDidLoad() {
  }
  goToEditProfile() {
    this.navCtrl.push('UserEditPage', { data: this.showTabItm });
  }
  getUserProfileData() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId']
    }
    this.restapiProvider.sendRestApiRequest(request, 'GetUserDetails').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        this.restapiProvider.userData['userPersonalDetails'] = JSON.stringify(response.Data);
        this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
        // this.restapiProvider.userData['getUserProfileMaster'] = JSON.stringify(response.Data);
        this.profileData = response.Data.Table[0];
        this.assetValue = "₹ "+this.profileData.Asset_value;
        this.liabilitiesValue = "₹ "+this.profileData.Liabilites;
        this.familyMembersArr = response.Data.Table1;
        this.assetDetailsArr = response.Data.Table2;
        this.liabilitiesArr = response.Data.Table3;
        this.expenseArr = response.Data.Table4;
        this.investTypeArr = response.Data.Table5;
        this.hobbiesArr = response.Data.Table6;
        this.maritalStatus = this.profileData.MaritialStatus;
        this.montlyExpenseComma = this.profileData.MontlyExpense ? "₹ "+this.numberPipe.transform(this.profileData.MontlyExpense.toString().replaceAll(",","")) : "";
        this.lumsumComma = this.profileData.LumpSum ? "₹ "+this.numberPipe.transform(this.profileData.LumpSum.toString().replaceAll(",","")) : "";
        this.emergencyFundsComma = this.profileData.EmergencyFunds ? "₹ "+this.numberPipe.transform(this.profileData.EmergencyFunds.toString().replaceAll(",","")) : "";
        this.ancestorPropertyComma = this.profileData.AncestorProperty ? "₹ "+this.numberPipe.transform(this.profileData.AncestorProperty.toString().replaceAll(",","")) : "";
        
        this.getChildren()
      }
      else {
      }
    },
      (error) => {
        this.pageLoader = false;
      });
  }
  getChildren() {
    for (let i = 0; i < this.familyMembersArr.length; i++) {
      var relationship = this.familyMembersArr[i].DepRelationShip.DepRelationShip
      if (relationship == "Daughter" || relationship == "Son") {
        this.childrenArr.push(this.familyMembersArr[i])
        // this.childrenCount++;
      }
      else {
        this.otherMembersArr.push(this.familyMembersArr[i])
      }
    }
  }
  startLoad() {
    setTimeout(() => {
      $('.car_goal_slider').slick({
        focusOnSelect: true, dots: false, infinite: true,
        speed: 300, cssEase: 'linear', slidesToShow: 3,
        slidesToScroll: 1, centerMode: true, swipe: true, arrows: false
      });
      $('.car_goal_slider_wrap').css('opacity', 1);
    }, 500);
    setTimeout(function () {
      var totalHeight = $('.swiper-slide-active').outerHeight();
      var slide_heading = $('.age_slider_heading').outerHeight();
      var nps_first = $('.nps_age_first').outerHeight();
      var actualheight = slide_heading + nps_first * 1.5;
      $('.tell_us_cont_common').height(totalHeight - actualheight);
    }, 1500);
  }
  openDetails(i) {
    this.showTabItm = i;
    //  this.showTabItm = this.showTabItm + 1;
    $('.tell_us_cont .tell_us_slider .slick-slide-item:nth-child(' + (this.showTabItm + 1) + ')').addClass('slick-current').siblings('.slick-slide-item').removeClass('slick-current');
    //$('.details_container:nth-child('+this.showTabItm+')').show().siblings('.details_content').hide();
  }
  viewBreakup(item) {
    this.status = !this.status;
    if (item == "close") {
      //$('.scroll-content').removeClass('scrollOverlay');
    }
    else {
      //$('.scroll-content').addClass('scrollOverlay');
    }
    if (item == "monthly" && this.status) {
      this.popupDataObj = {
        "type": "monthly",
        "header": this.utilitiesProvider.langJsonData['myProfile']['estimateAllMonthlyExpense'],
        "sub_head": this.utilitiesProvider.langJsonData['myProfile']['monthlyExpenses'],
        "total": this.profileData.MontlyExpense,
        "breakup": this.expenseArr
      }
      $('.footer').addClass('footerOverlay');
    }
    if (item == "asset" && this.status) {
      this.popupDataObj = {
        "type": "asset",
        "header": this.utilitiesProvider.langJsonData['myProfile']['estimateAllAssetsYouOwn'],
        "sub_head": this.utilitiesProvider.langJsonData['myProfile']['savingsAndInvestment'],
        "total": this.profileData.Asset_value,
        "breakup": this.assetDetailsArr
      }
      $('.footer').addClass('footerOverlay');
    }
    if (item == "liabilities" && this.status) {
      this.popupDataObj = {
        "type": "liabilities",
        "header": this.utilitiesProvider.langJsonData['myProfile']['estimateAllDebtsYouOwn'],
        "sub_head": this.utilitiesProvider.langJsonData['myProfile']['debts'],
        "total": this.profileData.Liabilites,
        "breakup": this.liabilitiesArr
      }
      $('.footer').addClass('footerOverlay');
    }
    else {
      $('.footer').removeClass('footerOverlay');
    }
  }
  toggleClass(id) {
    $('#' + id).toggleClass('active')
  }
  errorPic() {
    if (this.restapiProvider.userData['gender'] == "Male" || this.restapiProvider.userData['gender'] == "") {
      this.profileData.ImagePath = this.utilitiesProvider.noProfileImg;
    }
    else {
      this.profileData.ImagePath = this.utilitiesProvider.noProfileImgFemale;
    }
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

  languageClick() {
    // this.navCtrl.push('PreferableLanguagePage');
    this.myApp.languageClick();
  }

  back() {
    this.navCtrl.pop();
  }
}

