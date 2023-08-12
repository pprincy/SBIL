import { Component, ViewChild } from '@angular/core';
import { App, IonicPage, NavController, NavParams, Platform, Content, MenuController, Config, Nav, ModalController } from 'ionic-angular';
import '../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { MyApp } from '../../../app/app.component';
import { DecimalPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { config } from '../../../shared/config';
import { DropDowmSelctionPage } from '../../../components/modals/drop-dowm-selction/drop-dowm-selction';
import { CalendarPage } from '../../../components/modals/calendar/calendar';
declare var cordova: any;
declare var upshot: any;
@IonicPage()
@Component({
  selector: 'page-user-edit',
  templateUrl: 'user-edit.html',
})
export class UserEditPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Nav) nav: Nav;
  public minLumpSumAmt = 0;
  public minEmergencyAmt = 0;
  public minAncestorAmt = 0;
  public minMonthlyExpenseAmt = 0;
  public maxLumpSumAmt = 10000000;
  public maxEmergencyAmt = 1000000;
  public maxAncestorAmt = 50000000;
  public maxMonthlyExpenseAmt = 500000;
  public mobileDisabled: boolean = false;
  public emailDisabled: boolean = false;
  public mobileNo: any;
  public emailID: any;
  public age: any;
  public ageArr: any = [];
  public pageLoader: boolean = false;
  // public noOfFamilyMembers: any = [];
  public sliderOptionsArr: any = [];
  public profileData: any = [];
  public familyMembersArr: any = [];
  public assetDetailsArr: any = [];
  public liabilitiesArr: any = [];
  public expenseArr: any = [];
  public investTypeArr: any = [];
  public hobbiesArr: any = [];
  public userHobbiesArr: any = [];
  public childrenArr: any = [];
  public otherMembersArr: any = [];
  public location: any = null;
  public childrenCount: any = 0;
  public firstName: any = null;
  public lastName: any = null;
  public dob: any;
  public lifeStageArr: any = [];
  public lifeStageID: any;
  public lifeStageImgs: any = [];
  public educationArr: any = [];
  public education: any;
  public educationID: any;
  public selectedLifeGoal: any;
  public occupationArr: any = [];
  public occupation: any = null;
  public incomeRangeArr: any = [];
  public incomeRange: any = null;
  public workIndustryArr: any = [];
  public workIndustry: any = null;
  public designationArr: any = [];
  public designation: any = null;
  public experience: any;
  public incomeGroup: any;
  public incomeGroupID: any;
  public relationshipArr: any = [];
  public assetBreakFlag: boolean = false;
  public liabilityBreakFlag: boolean = false;
  public expenseBreakFlag: boolean = false;
  public allAssetList: any = [];
  public allLiabilitiesList: any = [];
  public allExpenseList: any = [];
  public allInvestList: any = []
  public assetPageStep: any = 1;
  public liabilitiesPageStep: any = 1;
  public expensePageStep: any = 1;
  public totalAsset: any = 0;
  public totalLiabilities: any = 0;
  public totalExpenses: any = 0;
  public relationship: any;
  public hobbyImgDict: any;
  public imgURL: any;
  public titleFlag: boolean = true;
  public postProfileImage: any;
  public steps = 100;
  public isBtnActive: boolean = false;
  backBtnhide: boolean = true;
  public showTabItm = 0;
  scrollHeight;
  lumsumComma;
  emergencyFundsComma;
  ancestorPropertyComma;
  montlyExpenseComma;
  assetValueComma;
  public langName;
  public maritalStatus;
  public username; 
  public modal;
  liabilitiesValue: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    private imagePicker: ImagePicker,
    public menuCtrl: MenuController,
    public app: App,
    public myApp: MyApp,
    private numberPipe: DecimalPipe,
    public translate: TranslateService,
    public platform: Platform,
    public config: Config,
    public modalCtrl: ModalController) {
    this.username = this.restapiProvider.userData['customerName'];
    this.setLanguage();  
    if (this.navParams.get('data')) {
      this.showTabItm = parseInt(this.navParams.get('data'));
    }
    this.sliderOptionsArr = this.utilitiesProvider.langJsonData['myProfile']['tabs'];
    this.lifeStageImgs = [
      'lifeStyle/single.png',
      'lifeStyle/married.png',
      'lifeStyle/married_with_1kid.png',
      'lifeStyle/married_with_2kids_or_more.png',
      'lifeStyle/independent.png'
    ];
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
    // this.noOfFamilyMembers = [0];
    this.mobileNo = this.restapiProvider.userData['mobileNo']
    this.emailID = this.restapiProvider.userData['emailId']
    this.age = this.restapiProvider.userData['age']
    // this.dob = this.completeYear(this.restapiProvider.userData['dob']).split('-').reverse().join('-');
    this.dob = this.restapiProvider.userData['dob'].split('-').reverse().join('-');
    var appDataMaster = JSON.parse(this.restapiProvider.userData['appDataMaster'])
    var userProfileMaster = JSON.parse(this.restapiProvider.userData['getUserProfileMaster'])
    this.lifeStageArr = appDataMaster.Table2;
    this.occupationArr = appDataMaster.Table1;
    this.educationArr = appDataMaster.Table6;
    this.hobbiesArr = userProfileMaster.Table3;
    this.allAssetList = userProfileMaster.Table1;
    this.allLiabilitiesList = userProfileMaster.Table2;
    this.allExpenseList = userProfileMaster.Table;
    this.allInvestList = userProfileMaster.Table4;
    this.breakName();
    this.setDisabledInputs();
    for (let j = 0; j < this.hobbiesArr.length; j++) {
      this.hobbiesArr[j].IsActive = 0
    }
    this.relationshipArr = userProfileMaster.Table7;
    this.designationArr = userProfileMaster.Table6
    this.workIndustryArr = userProfileMaster.Table5;
    this.incomeRangeArr = appDataMaster.Table;
    // for (let k = 0; k < appDataMaster.Table.length; k++) {
    //   this.incomeRangeArr.push(appDataMaster.Table[k].IncomeName)
    // }
    for (let i = 0; i < this.lifeStageArr.length; i++) {
      this.lifeStageArr[i].img = this.lifeStageImgs[i];
    }
    this.setDOB();
    this.getUserProfileData();
  }
  ionViewDidEnter() {
    let a = $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
    if (a) {
      this.scrollHeight = a;
    }
    this.openDetails(this.showTabItm);

    this.utilitiesProvider.upshotScreenView('EditProfile');
  }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("11");
    this.utilitiesProvider.googleAnalyticsTrackView('Edit User Profile');
    $('.tell_us_cont .tell_us_slider .slick-slide-item:nth-child(' + (this.showTabItm + 1) + ')').addClass('slick-current').siblings('.slick-slide-item').removeClass('slick-current');
  }
  errorPic() {
    if (this.restapiProvider.userData['gender'] == "Male" || this.restapiProvider.userData['gender'] == "") {
      this.profileData.ImagePath = this.utilitiesProvider.noProfileImg;
    }
    else {
      this.profileData.ImagePath = this.utilitiesProvider.noProfileImgFemale;
    }
  }
  uploadImg() {
    const options: ImagePickerOptions = {
      quality: 100,
      maximumImagesCount: 1,
      width: 450,
      height: 270,
      outputType: 0
    }
    this.imagePicker.hasReadPermission().then((response) => {
      if (response) {
        this.imagePicker.getPictures(options).then((results) => {
          // if (results && results != "OK" && results[0].length) {
          //   //  this.profileImage = 'data:image/png;base64,' +  results[0];
          //   this.postProfileImage = 'data:image/png;base64,' + results[0];
          //   this.updateUserImage();
          //   //  this.restapiProvider.userData['profileImg'] = this.profileImage;
          // }
          if (results && results != "OK" && results.length > 0) {
            this.utilitiesProvider.cropImg(results[0]).then((cropResults) => {
              if (cropResults.status == 'success') {
                this.postProfileImage = cropResults.img;
                this.updateUserImage();
              }
            }, (err) => {
              this.postProfileImage = results[0];
              this.updateUserImage();
            });
          }
        }, (err) => {
          console.log(err)
        });
      }
      else {
        this.imagePicker.requestReadPermission();
      }
    })
  }
  updateUserImage() {
    this.pageLoader = true;
    let request = {
      "CustID": this.restapiProvider.userData['CustomerID'],
      "TokenID": this.restapiProvider.userData['tokenId'],
      "Image": this.postProfileImage
    }
    return this.restapiProvider.sendRestApiRequest(request, 'UpdateUserImage')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          this.profileData.ImagePath = this.postProfileImage;
          this.restapiProvider.userData['profileImg'] = this.profileData.ImagePath;
          this.postProfileImage = "";
          this.myApp.getUserPersonalDetails();
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  goToRiskAssessment() {
    this.navCtrl.push('RiskAssesmentPage')
  }
  getUserProfileData() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId']
    }
    this.restapiProvider.sendRestApiRequest(request, 'GetUserDetails').subscribe((response) => {
      if (response.IsSuccess == true) {
        // this.restapiProvider.userData['getUserProfileMaster'] = JSON.stringify(response.Data);
        this.restapiProvider.userData['userPersonalDetails'] = JSON.stringify(response.Data);
        this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
        this.profileData = response.Data.Table[0];
        this.assetValueComma = "₹" + (this.profileData.Asset_value ? this.numberPipe.transform(this.profileData.Asset_value.toString().replaceAll(",","")) : "");
        this.lumsumComma = "₹" + (this.profileData.LumpSum ? this.numberPipe.transform(this.profileData.LumpSum.toString().replaceAll(",","")) : "");
        this.emergencyFundsComma = "₹" + (this.profileData.EmergencyFunds ? this.numberPipe.transform(this.profileData.EmergencyFunds.toString().replaceAll(",","")) : "");
        this.ancestorPropertyComma = "₹" + (this.profileData.AncestorProperty ? this.numberPipe.transform(this.profileData.AncestorProperty.toString().replaceAll(",","")) : "");
        this.montlyExpenseComma = "₹" + (this.profileData.MontlyExpense ? this.numberPipe.transform(this.profileData.MontlyExpense.toString().replaceAll(",","")) : "");
        this.familyMembersArr = response.Data.Table1;
        this.assetDetailsArr = response.Data.Table2;
        this.liabilitiesArr = response.Data.Table3;
        this.liabilitiesValue = "₹ "+this.profileData.Liabilites;
        this.expenseArr = response.Data.Table4;
        this.investTypeArr = response.Data.Table5;
        this.userHobbiesArr = response.Data.Table6
        this.education = this.profileData.EducationName;
        this.maritalStatus = this.profileData.MaritialStatus;
        this.location = this.profileData.CityOfResidence;
        this.occupation = this.profileData.OccupationName;
        this.workIndustry = this.profileData.Industry;
        this.designation = this.profileData.DesignationName;
        this.selectedLifeGoal = this.profileData.MaritialStatus;
        this.lifeStageID = this.profileData.MaritalID;
        this.experience = this.profileData.Experiance;
        this.incomeGroup = this.profileData.IncomeGroup;
        console.log("income", this.profileData.IncomeName, this.profileData.IncomeGroup, this.profileData.incomeRange);
        this.incomeGroupID = this.profileData.IncomeGroupID;
        this.martialStatusClick();
        this.setFamilyMembers();
        this.setHobbies();
        this.mapUserAssets();
        this.mapUserLiabilities();
        this.mapExpenses();
        this.mapInvestments();
        this.pageLoader = false;
      }
      else {
      }
    },
      (error) => {
        this.pageLoader = false;
      });
  }
  mapUserAssets() {
    for (let i = 0; i < this.allAssetList.length; i++) {
      this.allAssetList[i].IsActive = 0;
    }
    for (let i = 0; i < this.allAssetList.length; i++)
      for (let j = 0; j < this.assetDetailsArr.length; j++)
        if (this.assetDetailsArr[j].AssetID == this.allAssetList[i].id) {
          this.allAssetList[i].IsActive = 1;
          this.allAssetList[i].amount = this.assetDetailsArr[j].AssetValue
          break;
        }
    for (let i = 0; i < this.allAssetList.length; i++) {
      this.totalAsset = this.totalAsset + this.allAssetList[i].amount
    }
  }
  mapUserLiabilities() {
    for (let i = 0; i < this.allLiabilitiesList.length; i++) {
      this.allLiabilitiesList[i].IsActive = 0;
    }
    for (let i = 0; i < this.allLiabilitiesList.length; i++)
      for (let j = 0; j < this.liabilitiesArr.length; j++)
        if (this.liabilitiesArr[j].DebtID == this.allLiabilitiesList[i].id) {
          this.allLiabilitiesList[i].IsActive = 1;
          this.allLiabilitiesList[i].amount = this.liabilitiesArr[j].DebtValue
          break;
        }
    for (let i = 0; i < this.allLiabilitiesList.length; i++) {
      this.totalLiabilities = this.totalLiabilities + this.allLiabilitiesList[i].amount
    }
  }
  mapExpenses() {
    for (let i = 0; i < this.allExpenseList.length; i++) {
      this.allExpenseList[i].IsActive = 0;
    }
    for (let i = 0; i < this.allExpenseList.length; i++)
      for (let j = 0; j < this.expenseArr.length; j++)
        if (this.expenseArr[j].ExpenseID == this.allExpenseList[i].MonthlyExpenseID) {
          this.allExpenseList[i].IsActive = 1;
          this.allExpenseList[i].amount = this.expenseArr[j].ExpenseValue
          break;
        }
    for (let i = 0; i < this.allExpenseList.length; i++) {
      if (this.allExpenseList[i].IsActive == 1)
        this.totalExpenses = this.totalExpenses + this.allExpenseList[i].amount
    }
  }
  mapInvestments() {
    for (let i = 0; i < this.allInvestList.length; i++) {
      this.allInvestList[i].IsActive = 0;
    }
    for (let i = 0; i < this.allInvestList.length; i++)
      for (let j = 0; j < this.investTypeArr.length; j++)
        if (this.investTypeArr[j].PII == this.allInvestList[i].InvestmentID) {
          this.allInvestList[i].IsActive = 1;
          break;
        }
  }
  setDisabledInputs() {
    if (this.restapiProvider.userData['mobileNo'] == null || this.restapiProvider.userData['mobileNo'] == undefined) {
      this.mobileDisabled = false;
    }
    else {
      this.mobileDisabled = true;
    }
    if (this.restapiProvider.userData['emailId'] == null || this.restapiProvider.userData['emailId'] == undefined) {
      this.emailDisabled = true;
    }
    else {
      this.emailDisabled = true;
    }
  }
  setFamilyMembers() {
    if (this.familyMembersArr.length == 0) {
      this.familyMembersArr.push({
        "CustomerID": this.restapiProvider.userData['CustomerID'],
        "DepAge": null,
        "DepRelationShip": null,
        "DepedentName": null,
        "RelationshipID": null
      })
    }
  }
  breakName() {
    var splitName = this.restapiProvider.userData['customerName'].toString().split(" ");
    this.firstName = splitName[0];
    this.lastName = splitName[1];
  }
  setDOB() {
    // var yearDOB = parseInt(this.restapiProvider.userData['age'])
    var currYear = new Date().getFullYear()
    var birthYear = currYear - parseInt(this.age);
    var tempDOB = this.dob.split('-');
    tempDOB[0] = birthYear.toString();
    this.dob = tempDOB.join('-');
  }
  setHobbies() {
    for (let i = 0; i < this.hobbiesArr.length; i++)
      for (let j = 0; j < this.userHobbiesArr.length; j++) {
        if (this.userHobbiesArr[j].Hobbies == this.hobbiesArr[i].HobbyID)
          this.hobbiesArr[i].IsActive = 1;
      }
  }
  checkHobbies(hobby) {
    for (let i = 0; i < this.hobbiesArr.length; i++) {
      if(this.hobbiesArr[i].HobbyID == hobby.HobbyID) {
        if(this.hobbiesArr[i].IsActive) {
          this.hobbiesArr[i].IsActive = 0;
        }
        else {
          this.hobbiesArr[i].IsActive = 1;
        }
      }
    }
    // if (this.hobbiesArr[hobby.HobbyID - 1].IsActive) {
    //   this.hobbiesArr[hobby.HobbyID - 1].IsActive = 0;
    // }
    // else {
    //   this.hobbiesArr[hobby.HobbyID - 1].IsActive = 1;
    // }
  }
  checkAssets(asset) {
    for (let i = 0; i < this.allAssetList.length; i++) {
      if (this.allAssetList[i].id == asset.id) {
        if (this.allAssetList[i].IsActive == 0) {
          this.allAssetList[i].IsActive = 1;
        }
        else {
          this.allAssetList[i].IsActive = 0;
        }
        this.allAssetList[i].amount = 0;
        break;
      }
    }
  }
  checkLiabilities(liability) {
    for (let i = 0; i < this.allLiabilitiesList.length; i++) {
      if (this.allLiabilitiesList[i].id == liability.id) {
        if (this.allLiabilitiesList[i].IsActive == 0) {
          this.allLiabilitiesList[i].IsActive = 1;
        }
        else {
          this.allLiabilitiesList[i].IsActive = 0;
        }
        this.allLiabilitiesList[i].amount = 0;
        break;
      }
    }
  }
  checkExpenses(expense) {
    for (let i = 0; i < this.allExpenseList.length; i++) {
      if (this.allExpenseList[i].MonthlyExpenseID == expense.MonthlyExpenseID) {
        if (this.allExpenseList[i].IsActive == 0) {
          this.allExpenseList[i].IsActive = 1;
        }
        else {
          this.allExpenseList[i].IsActive = 0;
        }
        this.allExpenseList[i].amount = 0;
        break;
      }
    }
  }
  checkInvestment(investment) {
    for (let i = 0; i < this.allInvestList.length; i++) {
      if (this.allInvestList[i].InvestmentID == investment.InvestmentID) {
        if (this.allInvestList[i].IsActive == 0) {
          this.allInvestList[i].IsActive = 1;
        }
        else {
          this.allInvestList[i].IsActive = 0;
        }
        break;
      }
    }
  }
  addMembers() {
    // this.noOfFamilyMembers.push(index);
    // this.slickSliderLoad(item + index)
    this.familyMembersArr.push({
      "CustomerID": this.restapiProvider.userData['CustomerID'],
      "DepAge": null,
      "DepRelationShip": null,
      "DepedentName": null,
      "RelationshipID": null
    })
  }
  removeMembers(i) {
    this.familyMembersArr.splice(i, 1);
  }
  martialStatusClick() {
    var that = this;
    setTimeout(() => {
      $(".car_goal_slider .car_goal_slider_item").each(function () {
        var curMaritialID = parseInt($(this).find('.life_style').attr('id'));
        if (curMaritialID == that.lifeStageID) {
          $(this).not('.slick-cloned').trigger('click');
          return true;
        }
      });
      $('.car_goal_slider').on('afterChange', function (event, slick, currentSlide, nextSlide) {
        that.lifeStageID = $('.car_goal_slider .slick-current .life_style').attr('id');
      });
    }, 500);
  }
  yrExpClick() {
    var that = this;
    setTimeout(() => {
      $(".expSlider .slick-slide").each(function () {
        var curExp = parseInt($(this).find('.tell_us_slider_age').text());
        if (curExp == parseInt(that.experience)) {
          $(this).not('.slick-cloned').trigger('click');
        }
      });
      $('.expSlider').on('afterChange', function (event, slick, currentSlide, nextSlide) {
        that.experience = $('.expSlider .slick-current .tell_us_slider_age').text()
      });
    }, 500)
  }
  incomeClick() {
    var that = this;
    setTimeout(() => {
      $(".incomerange_slider_slick .slick-slide").each(function () {
        var curIncome = $(this).find('.tell_us_slider_age').text();
        if (curIncome == that.incomeGroup) {
          $(this).not('.slick-cloned').trigger('click');
        }
      })
      $('.incomerange_slider_slick').on('afterChange', function (event, slick, currentSlide, nextSlide) {
        that.incomeGroupID = $('.incomerange_slider_slick .slick-current .tell_us_slider_age').attr('id');
        that.incomeGroup = $('.incomerange_slider_slick .slick-current .tell_us_slider_age').text();
      });
    }, 500)
  }
  openDetails(i) {
    this.showTabItm = i;
    $('.tell_us_cont .tell_us_slider .slick-slide-item:nth-child(' + (this.showTabItm + 1) + ')').addClass('slick-current').siblings('.slick-slide-item').removeClass('slick-current');
    setTimeout(() => {
      if ($('.needSlick').hasClass('slick-initialized')) {
        $('.needSlick,.incomerange_slider .incomerange_slider_slick').slick('unslick');
        $('.needSlick').slick({
          focusOnSelect: true, dots: false, infinite: true,
          speed: 300, cssEase: 'linear', slidesToShow: 7, slidesToScroll: 1,
          centerMode: true, variableWidth: true, arrows: false
        });
        //$('.needSlick .slick-current').trigger('click');
        $('.needSlick').css('opacity', 1);

        $('.incomerange_slider .incomerange_slider_slick').slick({
          focusOnSelect: true, dots: false, infinite: true,
          speed: 300, cssEase: 'linear', slidesToShow: 1, slidesToScroll: 1,
          centerMode: true, variableWidth: true, arrows: false
        });
        // $('.incomerange_slider .incomerange_slider_slick .slick-current').trigger('click');
        $('.incomerange_slider .incomerange_slider_slick').css('opacity', 1);

      }
      else {
        $('.needSlick').slick({
          focusOnSelect: true, dots: false, infinite: true,
          speed: 300, cssEase: 'linear', slidesToShow: 7, slidesToScroll: 1,
          centerMode: true, variableWidth: true, arrows: false
        });
        //$('.needSlick .slick-current').trigger('click');
        $('.needSlick').css('opacity', 1);

        $('.incomerange_slider .incomerange_slider_slick').slick({
          focusOnSelect: true, dots: false, infinite: true,
          speed: 300, cssEase: 'linear', slidesToShow: 1, slidesToScroll: 1,
          centerMode: true, variableWidth: true, arrows: false
        });
        // $('.incomerange_slider .incomerange_slider_slick .slick-current').trigger('click');
        $('.incomerange_slider .incomerange_slider_slick').css('opacity', 1);
      }
      if ($('.car_goal_slider').hasClass('.slick-initialized')) {
        $('.car_goal_slider').slick('unslick');
        $('.car_goal_slider').slick({
          focusOnSelect: true, dots: false, infinite: true,
          speed: 300, cssEase: 'linear', slidesToShow: 3,
          slidesToScroll: 1, centerMode: true, swipe: true, arrows: false
        });
        $('.car_goal_slider_wrap').css('opacity', 1);
      }
      else {
        $('.car_goal_slider').slick({
          focusOnSelect: true, dots: false, infinite: true,
          speed: 300, cssEase: 'linear', slidesToShow: 3,
          slidesToScroll: 1, centerMode: true, swipe: true, arrows: false
        });
        $('.car_goal_slider_wrap').css('opacity', 1);
      }
    }, 200);
    this.martialStatusClick();
    this.yrExpClick();
    this.incomeClick();
  }
  toggleClass(id) {
    $('#' + id).toggleClass('active')
  }
  onSliderChange() {
    var totalHeight = $('.swiper-slide-active .slide-zoom').height();
    var slide_heading = $('.age_slider_heading').height();
    var nps_first = $('.nps_age_first').height();
    var actualheight = slide_heading + nps_first * 1.5;
    $('.tell_us_cont_common').height(totalHeight - actualheight);
  }
  
  clearStartZero(option) {
    if (option == 'lumpsum') {
      if (this.profileData.LumpSum == 0 ||
        isNaN(this.profileData.LumpSum) ||
        this.profileData.LumpSum == null) {
        this.profileData.LumpSum = null;
        this.lumsumComma = "₹" + "";
      }
    }
    if (option == 'emergency') {
      if (this.profileData.EmergencyFunds == 0 ||
        isNaN(this.profileData.EmergencyFunds) ||
        this.profileData.EmergencyFunds == null) {
        this.profileData.EmergencyFunds = null;
        this.emergencyFundsComma = "₹" + "";
      }
    }
    if (option == 'ancestor') {
      if (this.profileData.AncestorProperty == 0 ||
        isNaN(this.profileData.AncestorProperty) ||
        this.profileData.AncestorProperty == null) {
        this.profileData.AncestorProperty = null;
        this.ancestorPropertyComma = "₹" + "";
      }
    }
    if (option == 'monthly') {
      if (this.profileData.MontlyExpense == 0 ||
        isNaN(this.profileData.MontlyExpense) ||
        this.profileData.MontlyExpense == null) {
        this.profileData.MontlyExpense = null;
        this.montlyExpenseComma = "₹" + "";
      }
    }
    if (option == 'assets') {
      if (this.profileData.Asset_value == 0 ||
        isNaN(this.profileData.Asset_value) ||
        this.profileData.Asset_value == null) {
          this.profileData.Asset_value = null;
        // this.assetValueComma = "₹" + "";
      }
    }
    if (option == 'liabilities') {
      if (this.profileData.Liabilites == 0 ||
        isNaN(this.profileData.Liabilites) ||
        this.profileData.Liabilites == null) {
        this.profileData.Liabilites = null;
      }
    }
  }
  clearStartingZero(value) {
    if (value.amount == 0 ||
      isNaN(value.amount) ||
      value.amount == null) {
      value.amount = null;
    }
  }
  checkAmt(option) {
    if (option == 'lumpsum') {
      if (this.profileData.LumpSum == null ||
        this.profileData.LumpSum == undefined ||
        this.profileData.LumpSum < 0 ||
        this.profileData.LumpSum > this.maxLumpSumAmt ||
        this.profileData.LumpSum < this.minLumpSumAmt) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " + this.minLumpSumAmt + this.utilitiesProvider.jsErrorMsg['to'] + this.maxLumpSumAmt);
      }
    }
    if (option == 'emergency') {
      if (this.profileData.EmergencyFunds == null ||
        this.profileData.EmergencyFunds == undefined ||
        this.profileData.EmergencyFunds < 0 ||
        this.profileData.EmergencyFunds > this.maxEmergencyAmt ||
        this.profileData.EmergencyFunds < this.minEmergencyAmt) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " + this.minEmergencyAmt + this.utilitiesProvider.jsErrorMsg['to'] + this.maxEmergencyAmt);
      }
    }
    if (option == 'ancestor') {
      if (this.profileData.AncestorProperty == null ||
        this.profileData.AncestorProperty == undefined ||
        this.profileData.AncestorProperty < 0 ||
        this.profileData.AncestorProperty > this.maxAncestorAmt ||
        this.profileData.AncestorProperty < this.minAncestorAmt) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " + this.minAncestorAmt + this.utilitiesProvider.jsErrorMsg['to'] + this.maxAncestorAmt);
      }
    }
    if (option == 'monthly') {
      if (this.profileData.MontlyExpense == null ||
        this.profileData.MontlyExpense == undefined ||
        this.profileData.MontlyExpense < 0 ||
        this.profileData.MontlyExpense > this.maxMonthlyExpenseAmt ||
        this.profileData.MontlyExpense < this.minMonthlyExpenseAmt) {

        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " + this.minMonthlyExpenseAmt + this.utilitiesProvider.jsErrorMsg['to'] + this.maxMonthlyExpenseAmt);
      }
    }
    if (option == 'assets') {
      if (this.profileData.Asset_value == null ||
        this.profileData.Asset_value == undefined ||
        this.profileData.Asset_value < 0) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterValidAmountForAssets']);
      }
    }
    if (option == 'liabilities') {
      if (this.profileData.Liabilites == null ||
        this.profileData.Liabilites == undefined ||
        this.profileData.Liabilites < 0) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterValidAmountForLiabilities']);
      }
    }
  }
  doSomething(e, option) {
    if (option == 'lumpsum') {
      if (this.profileData.LumpSum >= (this.maxLumpSumAmt / 3) && this.profileData.LumpSum <= (this.maxLumpSumAmt / 2)) {
        this.steps = 1000;
      }
      else if (this.profileData.LumpSum >= (this.maxLumpSumAmt / 2)) {
        this.steps = 2000;
      }
      this.lumsumComma = "₹" + (this.profileData.LumpSum ? this.numberPipe.transform(this.profileData.LumpSum.toString().replaceAll(",","")) : "");
    }
    if (option == 'emergency') {
      if (this.profileData.EmergencyFunds >= (this.maxEmergencyAmt / 3) && this.profileData.LumpSum <= (this.maxEmergencyAmt / 2)) {
        this.steps = 1000;
      }
      else if (this.profileData.EmergencyFunds >= (this.maxEmergencyAmt / 2)) {
        this.steps = 2000;
      }
      this.emergencyFundsComma = "₹" + (this.profileData.EmergencyFunds ? this.numberPipe.transform(this.profileData.EmergencyFunds.toString().replaceAll(",","")) : "");
    }
    if (option == 'ancestor') {
      if (this.profileData.AncestorProperty >= (this.maxAncestorAmt / 3) && this.profileData.AncestorProperty <= (this.maxAncestorAmt / 2)) {
        this.steps = 1000;
      }
      else if (this.profileData.AncestorProperty >= (this.maxAncestorAmt / 2)) {
        this.steps = 2000;
      }
      this.ancestorPropertyComma = "₹" + (this.profileData.AncestorProperty ? this.numberPipe.transform(this.profileData.AncestorProperty.toString().replaceAll(",","")) : "");
    }
    if (option == 'monthly') {
      if (this.profileData.MontlyExpense >= (this.maxMonthlyExpenseAmt / 3) && this.profileData.MontlyExpense <= (this.maxMonthlyExpenseAmt / 2)) {
        this.steps = 1000;
      }
      else if (this.profileData.MontlyExpense >= (this.maxMonthlyExpenseAmt / 2)) {
        this.steps = 2000;
      }
      this.montlyExpenseComma = "₹" + (this.profileData.MontlyExpense ? this.numberPipe.transform(this.profileData.MontlyExpense.toString().replaceAll(",","")) : "");
    }
  }
  showAssetBreakup() {
    this.titleFlag = false;
    this.assetBreakFlag = true;
    this.assetPageStep = 1;
    //this.viewInitilize();
    this.hideScroll();
  }
  showLiabilityBreakup() {
    this.titleFlag = false;
    this.liabilityBreakFlag = true;
    //this.viewInitilize();
    this.liabilitiesPageStep = 1;
    this.hideScroll();
  }
  showExpenseBreakup() {
    this.titleFlag = false;
    this.expenseBreakFlag = true;
    //this.viewInitilize();
    this.expensePageStep = 1;
    this.hideScroll();
  }
  nextAssetPage() {
    if (this.assetPageStep == 1) {
      this.assetPageStep = 2;
    }
    else if (this.assetPageStep == 2) {
      this.titleFlag = true;
      this.assetBreakFlag = false;
      this.assetPageStep = 1;
      this.profileData.Asset_value = "₹" + this.totalAsset;
      this.updateUserAssets();
    }
    this.hideScroll();
  }
  nextLiabilitiesPage() {
    if (this.liabilitiesPageStep == 1) {
      this.liabilitiesPageStep = 2;
    }
    else if (this.liabilitiesPageStep == 2) {
      this.titleFlag = true;
      this.liabilityBreakFlag = false;
      this.liabilitiesPageStep = 1;
      this.profileData.Liabilites = this.totalLiabilities;
      this.updateUserLiabilities();
    }
    this.hideScroll();
  }
  nextExpensesPage() {
    if (this.expensePageStep == 1) {
      this.expensePageStep = 2;
    }
    else if (this.expensePageStep == 2) {
      this.titleFlag = true;
      this.expenseBreakFlag = false;
      this.expensePageStep = 1;
      this.profileData.MontlyExpense = this.totalExpenses;
      this.updateUserMonthlyExpense();
    }
    this.hideScroll();
  }
  goBackAsset() {
    if (this.assetPageStep == 2) {
      this.assetPageStep = 1;
    }
    else if (this.assetPageStep == 1) {
      this.titleFlag = true;
      this.assetBreakFlag = false;
      // this.assetPageStep = 1;
    }
    this.hideScroll();
  }
  goBackLiabilities() {
    if (this.liabilitiesPageStep == 2) {
      this.liabilitiesPageStep = 1;
    }
    else if (this.liabilitiesPageStep == 1) {
      this.titleFlag = true;
      this.liabilityBreakFlag = false;
      // this.assetPageStep = 1;
    }
    this.hideScroll();
  }
  goBackExpenses() {
    if (this.expensePageStep == 2) {
      this.expensePageStep = 1;
    }
    else if (this.expensePageStep == 1) {
      this.titleFlag = true;
      this.expenseBreakFlag = false;
      // this.assetPageStep = 1;
    }
    this.hideScroll();
  }
  calculateAllAssets() {
    this.totalAsset = 0;
    for (let i = 0; i < this.allAssetList.length; i++) {
      if (this.allAssetList[i].IsActive == 1) {
        this.totalAsset = this.totalAsset + parseInt(this.allAssetList[i].amount);
      }
    }
  }
  calculateAllLiabilities() {
    this.totalLiabilities = 0;
    for (let i = 0; i < this.allLiabilitiesList.length; i++) {
      if (this.allLiabilitiesList[i].IsActive == 1) {
        this.totalLiabilities = this.totalLiabilities + parseInt(this.allLiabilitiesList[i].amount);
      }
    }
  }
  calculateAllExpenses() {
    this.totalExpenses = 0;
    for (let i = 0; i < this.allExpenseList.length; i++) {
      if (this.allExpenseList[i].IsActive == 1) {
        this.totalExpenses = this.totalExpenses + parseInt(this.allExpenseList[i].amount);
      }
    }
  }
  insertRelationID(relationship, pos) {
    for (let i = 0; i < this.relationshipArr.length; i++) {
      if (relationship == this.relationshipArr[i].Relationship) {
        this.familyMembersArr[pos].RelationshipID = this.relationshipArr[i].RelationshipID;
        break;
      }
    }
  }
  changeAge() {
    this.age = this.calcAge(this.dob)
  }
  calcAge(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
  }
  validatePersonalDetails() {
    if (this.dob == null || this.dob == undefined || this.dob.length <= 0) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterValidDOB']);
      return false;
    }
    else if (this.education == null || this.education == undefined || this.education.length <= 0) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['selectValidEducationOption']);
      return false;
    }
    else if (this.maritalStatus == null || this.maritalStatus == undefined || this.maritalStatus.length <= 0) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['selectValidLifeStageOption']);
      return false;
    }
    else if (!this.checkFamilyMembers()) {
      return false
    }
    else {
      return true
    }
  }
  validateProfessionalDetails() {
    if (this.occupation == null || this.occupation == undefined || this.occupation.length <= 0) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['selectValidOccupation']);
      return false;
    }
    else if (this.workIndustry == null || this.workIndustry == undefined || this.workIndustry.length <= 0) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['selectValidWorkIndustry']);
      return false;
    }
    else if (this.designation == null || this.designation == undefined || this.designation.length <= 0) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['selectValidDesignation']);
      return false;
    }
    else {
      return true
    }
  }
  checkFamilyMembers() {
    let errorFlag: boolean = false;
    for (let i = 0; i < this.familyMembersArr.length; i++) {
      if (this.familyMembersArr[i].DepRelationShip == null ||
        this.familyMembersArr[i].DepRelationShip == undefined ||
        this.familyMembersArr[i].DepRelationShip.length <= 0) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['selectValidRelationshipMember'] + " " + (i + 1));
        errorFlag = true;
        return false;
      }
      if (this.familyMembersArr[i].DepAge == null ||
        this.familyMembersArr[i].DepAge == undefined ||
        isNaN(parseInt(this.familyMembersArr[i].DepAge)) ||
        parseInt(this.familyMembersArr[i].DepAge) <= 0) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['selectValidRelationshipMember'] + " " + (i + 1));
        errorFlag = true;
        return false
      }
      if (this.familyMembersArr[i].DepedentName == null ||
        this.familyMembersArr[i].DepedentName == undefined ||
        this.familyMembersArr[i].DepedentName.length <= 0) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['selectValidRelationshipMember'] + " " + (i + 1));
        errorFlag = true;
        return false
      }
    }
    if (!errorFlag) {
      return true;
    }
    else {
      return false;
    }
  }
  validateInvestmentDetails() {
    if (this.profileData.Asset_value == undefined ||
      this.profileData.Asset_value == null ||
      this.profileData.Asset_value < 0) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterValidAssetValue']);
      return false;
    }
    if (this.profileData.Liabilites == undefined ||
      this.profileData.Liabilites == null ||
      this.profileData.Liabilites < 0) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterValidAssetValue']);
      return false;
    }
  }
  isAmount(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseNumbers']);
      return false;
    }
    return true;
  }
  updateUserAssets() {
    this.pageLoader = true
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "Products": []
    }
    for (let i = 0; i < this.allAssetList.length; i++) {
      if (this.allAssetList[i].IsActive == 1) {
        let b = {
          "amount": this.allAssetList[i].amount,
          "id": this.allAssetList[i].id
        }
        request.Products.push(b);
      }
    }
    this.restapiProvider.sendRestApiRequest(request, 'UpdateUserAssets').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        if (response.Data.Table[0].Status == 'Success')
          this.restapiProvider.presentToastBottom(this.utilitiesProvider.jsErrorMsg['assetBreakupSavedSuccessfully']);
        else
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['assetBreakupCouldNotSaved']);
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['assetBreakupCouldNotSaved']);
      }
    },
      (error) => {
        this.pageLoader = false;
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['assetBreakupCouldNotSaved']);
      });
  }
  updateUserLiabilities() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "Products": []
    }
    for (let i = 0; i < this.allLiabilitiesList.length; i++) {
      if (this.allLiabilitiesList[i].IsActive == 1) {
        let b = {
          "amount": this.allLiabilitiesList[i].amount,
          "id": this.allLiabilitiesList[i].id
        }
        request.Products.push(b);
      }
    }
    this.restapiProvider.sendRestApiRequest(request, 'UpdateUserLiabilities').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        if (response.Data.Table[0].Status == 'Success')
          this.restapiProvider.presentToastBottom(this.utilitiesProvider.jsErrorMsg['liabilitiesBreakupSavedSuccessfully']);
        else
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['liabilitiesBreakupCouldNotSaved']);
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['liabilitiesBreakupCouldNotSaved']);
      }
    },
      (error) => {
        this.pageLoader = false;
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['liabilitiesBreakupCouldNotSaved']);
      });
  }
  updateUserMonthlyExpense() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "Products": []
    }
    for (let i = 0; i < this.allExpenseList.length; i++) {
      if (this.allExpenseList[i].IsActive == 1) {
        let b = {
          "MonthlyExpenseID": this.allExpenseList[i].MonthlyExpenseID,
          "amount": this.allExpenseList[i].amount,
          "id": this.allExpenseList[i].MonthlyExpenseID
        }
        // this.allExpenseList[i].id = this.allExpenseList[i].MonthlyExpenseID
        request.Products.push(b);
      }
    }
    this.restapiProvider.sendRestApiRequest(request, 'UpdateUserMonthlyExpense').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        if (response.Data.Table[0].Status == 'Success')
          this.restapiProvider.presentToastBottom(this.utilitiesProvider.jsErrorMsg['monthlyExpenseBreakupSavedSuccessfully']);
        else
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['monthlyExpenseSaved']);
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['monthlyExpenseSaved']);
      }
    },
      (error) => {
        this.pageLoader = false;
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['monthlyExpenseSaved']);
      });
  }
  sendUserDependentsReq() {
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "Dependents": []
    }
    for (let i = 0; i < this.familyMembersArr.length; i++) {
      request.Dependents.push({
        "Name": this.familyMembersArr[i].DepedentName,
        "Relationship": this.familyMembersArr[i].RelationshipID,
        "Age": this.familyMembersArr[i].DepAge
      });
    }
    return request
  }
  sendUserDetailsReq() {
    let educationID = 0;
    let occupationID = 0;
    let workIndustryID = 0;
    let designationID = 0;
    let allInvestments = "";
    let allHobbies = "";
    for (let i = 0; i < this.educationArr.length; i++) {
      if (this.education == this.educationArr[i].EducationName) {
        educationID = this.educationArr[i].EducationID;
        break;
      }
    }
    for (let i = 0; i < this.occupationArr.length; i++) {
      if (this.occupation == this.occupationArr[i].OccupationName) {
        occupationID = this.occupationArr[i].OccupationID;
        break;
      }
    }
    for (let i = 0; i < this.workIndustryArr.length; i++) {
      if (this.workIndustry == this.workIndustryArr[i].SectName) {
        workIndustryID = this.workIndustryArr[i].SectorID;
        break;
      }
    }
    for (let i = 0; i < this.designationArr.length; i++) {
      if (this.designation == this.designationArr[i].DesignationName) {
        designationID = this.designationArr[i].DesignationID;
        break;
      }
    }
    for (let i = 0; i < this.allInvestList.length; i++) {
      if (this.allInvestList[i].IsActive == 1) {
        allInvestments = allInvestments + this.allInvestList[i].InvestmentID.toString() + ',';
      }
    }
    allInvestments = allInvestments.slice(0, -1)
    for (let i = 0; i < this.hobbiesArr.length; i++) {
      if (this.hobbiesArr[i].IsActive == 1) {
        allHobbies = allHobbies + this.hobbiesArr[i].HobbyID.toString() + ',';
      }
    }
    allHobbies = allHobbies.slice(0, -1);
    let request = {
      "Age": this.age,
      "CustID": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "FirstName": this.firstName,
      "LastName": this.lastName,
      "MaritalId": this.lifeStageID,
      "CityOfResidence": this.location,
      "MobileNo": this.mobileNo,
      "EmailId": this.emailID,
      "LifeStageID": this.lifeStageID,
      "EducationId": educationID,
      "MotherTongue": this.restapiProvider.userData['MotherTongue'],
      "OccupationId": occupationID,
      "WorkingSector": workIndustryID,
      "Designation": designationID,
      "Experience": this.experience,
      "IncomeGroup": this.incomeGroupID,
      "Lumpsum": this.profileData.LumpSum,
      "EmergencyFunds": this.profileData.EmergencyFunds,
      "AncestorProperty": this.profileData.AncestorProperty,
      "PII": allInvestments,
      "Hobbies": allHobbies,
      "TotalMonthlyExpense": this.profileData.MontlyExpense.toString(),
      "TotalAssetValue": this.profileData.Asset_value.toString(),
      "TotalLiabilityValue": this.liabilitiesValue.toString()
    }
    return request
  }
  saveDetails(option) {
    this.pageLoader = true;
    let depReq = this.sendUserDependentsReq();
    let userReq = this.sendUserDetailsReq();
    let depURL = this.restapiProvider.sendRestApiRequest(depReq, 'UpdateUserDependents');
    let userURL = this.restapiProvider.sendRestApiRequest(userReq, 'UpdateUserDetails');
    return forkJoin([userURL, depURL]).subscribe(results => {
      this.pageLoader = false;
      let userResponse = results[0];
      let depResponse = results[1];
      if (userResponse.IsSuccess == true) {
        if (userResponse.Data.Table3[0].Status == "Success") {
          this.restapiProvider.userData['location'] = this.location;
          let revDOB = this.dob.split("-").reverse()
          revDOB[2] = revDOB[2].slice(-2);
          this.restapiProvider.userData['dob'] = revDOB.join("-");
          this.restapiProvider.userData['age'] = this.age;
          this.restapiProvider.userData['mobileNo'] = this.mobileNo;
          this.restapiProvider.userData['emailId'] = this.emailID;
          this.restapiProvider.userData['age'] = this.age;
          if (this.platform.is('core') || this.platform.is('mobileweb')) {
            localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData))
          }
          else {
            this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');

            /**Update Upshot Profile added 07-12-2020 */
            if(this.restapiProvider.userData['CustomerID'] && this.restapiProvider.userData['customerName']) {
              this.updateUphotUserProfile();
            }
          }
        }
        else {
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['couldNotSaveDetailsCorrectly'])
        }
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['couldNotSaveDetailsCorrectly'])
      }
      if (depResponse.IsSuccess == true) {
        if (depResponse.Data.Table[0].Status == "Success") {
        }
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['couldNotSaveDetailsCorrectly'])
      }
      if (option == 'final')
        this.app.getRootNav().setRoot('CompletePage')
      else
        this.navCtrl.pop();
    },
      error => {
        this.pageLoader = false;
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['couldNotSaveDetailsCorrectly'])
      })
  }
  // goToFinalPage() {
  //   this.app.getRootNav().setRoot('CompletePage')
  // }

  slickSliderLoad(slickName) {
    setTimeout(() => {
      $('.' + slickName).slick({
        focusOnSelect: true, dots: false, infinite: true,
        speed: 300, cssEase: 'linear', slidesToShow: 7, slidesToScroll: 5,
        centerMode: true, variableWidth: true, arrows: false
      });
      $('.' + slickName + '.slick-current').trigger('click');
      $('.' + slickName).css('opacity', 1);
    }, 200);
  }
  menuToggle() {
    this.menuCtrl.open();
  }
  hideScroll() {
    // if(this.assetBreakFlag == true || this.liabilityBreakFlag == true || this.expenseBreakFlag == true)
    // $('.scroll-content').addClass('scrollOverlay');
    // else
    // $('.scroll-content').removeClass('scrollOverlay');
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

  formatAmount(val, type) {
    if(type == "lumsum") {
      let amount : number = 0;
      let amountStr : String = "";
      if(val && val.trim() != "₹") {
        amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
        amountStr = amount.toLocaleString('en-IN');
      }
      this.lumsumComma = "₹" + amountStr;
      this.profileData.LumpSum = amount;
    }
    else if(type == "emergency") {
      let amount : number = 0;
      let amountStr : String = "";
      if(val && val.trim() != "₹") {
        amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
        amountStr = amount.toLocaleString('en-IN');
      }
      this.emergencyFundsComma = "₹" + amountStr;
      this.profileData.EmergencyFunds = amount;
    }
    else if(type == "ancestor") {
      let amount : number = 0;
      let amountStr : String = "";
      if(val && val.trim() != "₹") {
        amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
        amountStr = amount.toLocaleString('en-IN');
      }
      this.ancestorPropertyComma = "₹" + amountStr;
      this.profileData.AncestorProperty = amount;
    }
    else if(type == "expense") {
      let amount : number = 0;
      let amountStr : String = "";
      if(val && val.trim() != "₹") {
        amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
        amountStr = amount.toLocaleString('en-IN');
      }
      this.montlyExpenseComma = "₹" + amountStr;
      this.profileData.MontlyExpense = amount;
    }
    else if(type == "assets") {
      let amount : number = 0;
      let amountStr : String = "";
      if(val && val.trim() != "₹") {
        amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
        amountStr = amount.toLocaleString('en-IN');
      }
      this.assetValueComma = "₹" + amountStr;
      this.profileData.Asset_value = amount;
    }
    else if(type == "liabilities") {
      let amount : number = 0;
      let amountStr : String = "";
      if(val && val.trim() != "₹") {
        amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
       
      }
      amountStr = amount.toLocaleString('en-IN');
      this.liabilitiesValue = amountStr;
      this.profileData.liabilities = amount;
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

  async OccupationList(){
    let commonList = this.occupationArr.map(el => {
      const obj = {
        name: el.OccupationName,
        value: el.OccupationName
      };
      return obj;
    }
      
    );
    // console.log("pass data", commonList);
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { commonList: commonList,
        selectOption: this.occupation },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
      this.occupation = data;        
    })
  }

  async IndustryList(){
    let commonList = this.workIndustryArr.map(el => {
      const obj = {
        name: el.SectName,
        value: el.SectName
      };
      return obj;
    }
      
    );
    // console.log("pass data", commonList);
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { commonList: commonList,
        selectOption: this.workIndustry },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
      this.workIndustry = data;        
    })    
  }

  async WorkExpList(){
    let commonList = this.utilitiesProvider.workExp2to50.map(el => {
      const obj = {
        name: el,
        value: el
      };
      return obj;
    }
      
    );
    // console.log("pass data", commonList);
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { commonList: commonList,
        selectOption: this.experience },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
      this.experience = data;        
    })    
  }

  async IncomeGroupList(){
    let commonList = this.incomeRangeArr.map(el => {
      const obj = {
        name: el.IncomeName,
        value: el.IncomeName
      };
      return obj;
    }
      
    );
    // console.log("pass data", commonList);
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { commonList: commonList,
        selectOption: this.incomeGroup },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
      this.incomeGroup = data;        
    })
  }

  async openCalendar() {
    let fromDate  = new Date();
    let toDate  = new Date();
    let selectedDate  = new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 65);
    toDate.setFullYear(toDate.getFullYear() - 18);
    if(this.dob) {
      selectedDate = new Date(this.dob);
    } else {
      selectedDate = toDate;
    }
    
    this.modal = this.modalCtrl.create(
      CalendarPage,
      {
        fromDate: fromDate,
        toDate: toDate,
        selectedDate: selectedDate
      },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss((data) => {
      if(data != null) {
        let date = data.getDate() > 9 ? data.getDate().toString() : '0'+data.getDate();
        let month = (data.getMonth()+1) > 9 ? (data.getMonth()+1).toString() : '0'+(data.getMonth()+1);
        this.dob = data.getFullYear() +"-"+ month +"-"+ date;
      }
    });
  }

  async educationList(){
    let commonList = this.educationArr.map(el => {
      const obj = {
        name: el.EducationName,
        value: el.EducationName
      };
      return obj;
    }
      
    );
    // console.log("pass data", commonList);
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { commonList: commonList,
        selectOption: this.education },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
      this.education = data;        
    })
  }

  async lifeStageList(){
    let commonList = this.lifeStageArr.map(el => {
      const obj = {
        name: el.MaritalStatus,
        value: el.MaritalStatus
      };
      return obj;
    }
      
    );
    // console.log("pass data", commonList);
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { commonList: commonList,
        selectOption: this.maritalStatus },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
      this.maritalStatus = data;        
    })
  }
}
