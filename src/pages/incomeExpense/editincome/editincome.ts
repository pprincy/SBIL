import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides, App, ModalController } from 'ionic-angular';
import '../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { Keyboard } from '@ionic-native/keyboard';
import { MyApp } from '../../../app/app.component';
import { DecimalPipe } from '@angular/common';
import { DropDowmSelctionPage } from '../../../components/modals/drop-dowm-selction/drop-dowm-selction';
@IonicPage()
@Component({
  selector: 'page-editincome',
  templateUrl: 'editincome.html',
})
export class EditincomePage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  public selectHomeBar: any = [];
  public steps = 1000;
  public amount;
  public minMonthlyExpenses; maxMonthlyExpenses; monthlyExpenses; minDownPayPer; maxDownPayPer;
  public status: boolean = false;
  public loading: any;
  public keyboardShow: boolean = false;
  public backBtnhide: boolean = true;
  public ageNow; ageDuring; scrollHeight; goalTime = 0;
  public courseType = "UG";
  public courseFieldList: any = [];
  public courseField;
  public collegeIsIndia: any = "yes";
  public countryList: any = [];
  public country;
  public dropType: boolean = true;
  public breakUp: any = [];
  public userAge;
  public minMonthlyIncome;
  public maxMonthlyIncome;
  public monthlyIncome: any;
  public breakupArray: any = [];
  public getBreakUpData: any = [];
  public showBreakUp: boolean = false;
  public qThree: any = [];
  public qFour: any = [];
  public FamilyCoverReq = "NO"
  public ageArray: any;
  public spouseAge = 23; spouseMonthlyIncome;
  public isSpouse: boolean = false;
  public fatherAge = 45; fatherMonthlyIncome;
  public isFather: boolean = false;
  public motherAge = 45; motherMonthlyIncome;
  public isMother: boolean = false;
  public childrenArray: any = [];
  public isChildren: boolean = false;
  public fatherMotherAgeArray: any = [];
  public selectedChildAgeInput;
  public isIncomeSource: boolean = false;
  public isAnotherSource: boolean = true;
  public incomeValue;
  public incomeValueComma;
  public isAddOtherOne: boolean = true;
  public isAddOtherTwo: boolean = false;
  public isAddOtherThree: boolean = false;
  public isSourceOne: boolean = false;
  public isSourceTwo: boolean = false;
  public isSourceThree: boolean = false;
  public isRemoveOne: boolean = false;
  public isRemoveTwo: boolean = false;
  public isRemoveThree: boolean = false;
  public sourceOne: any;
  public sourceOneTitle: any;
  public sourceTwo: any;
  public sourceTwoTitle: any;
  public sourceThree: any;
  public sourceThreeTitle: any;
  public sourceValueOne: any;sourceValueOneComma;
  public sourceValueTwo: any;sourceValueTwoComma;
  public sourceValueThree: any;sourceValueThreeComma;
  public isValidAmount: boolean = false;
  public isValidSource: boolean = false;
  public isValidIncome: boolean = false;
  public incomeList: any = [];
  public deleteStatus: boolean = false;
  public sourceList = [
    {
      "source":"Business Income",
      "sourceId": 1,
    },
    {
      "source": "Interest Income",
      "sourceId": 2,
    },
    {
      "source":"Other Income",
      "sourceId": 7,
    },
    {
      "source": "Rent",
      "sourceId": 9,
    }
  ];
  public modal;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    private keyboard: Keyboard,
    private cdr: ChangeDetectorRef,
    private numberPipe: DecimalPipe,
    public myApp: MyApp,
    public app: App,
    public modalCtrl: ModalController) {
    this.keyboard.onKeyboardShow().subscribe(data => {
      this.keyboardShow = true;
    });
    this.keyboard.onKeyboardHide().subscribe(data => {
      this.keyboardShow = false;
    });
  }
  ionViewDidEnter() {
    this.userAge = this.restapiProvider.userData['age'];
    this.slides.lockSwipes(true);
    this.slides.update();
    let a = $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
    if (a) {
      this.scrollHeight = a;
    }
  }

  ionViewDidLoad() {
    this.myApp.updatePageUseCount("59");
    this.utilitiesProvider.googleAnalyticsTrackView('Edit Income');
    this.expenditureReview();
    this.getIncomeExpenses();
    let monthIncome: any;
    this.utilitiesProvider.defaultGoalData = this.utilitiesProvider.defaultData.Item2.goals.family_protection;
    this.minMonthlyIncome = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_income.min);
    this.maxMonthlyIncome = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_income.max);
    if (this.restapiProvider.userData['userPersonalDetails']) {
      monthIncome = parseInt(JSON.parse(this.restapiProvider.userData['userPersonalDetails']).Table[0].ActualIncome);
      this.monthlyIncome = this.minMonthlyIncome > monthIncome ? this.minMonthlyIncome : parseInt(monthIncome);
    } else {
      this.monthlyIncome = this.monthlyIncome;
    }
    this.minMonthlyExpenses = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_expense.min);
    this.maxMonthlyExpenses = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_expense.max);
    if (this.utilitiesProvider.UserProfileMaster) {
      this.breakUp = this.utilitiesProvider.UserProfileMaster.Table;
      for (let i = 0; i < this.breakUp.length; i++) {
        this.breakUp[i].amount = '';
        this.breakUp[i].id = this.breakUp[i].MonthlyExpenseID;
      }
      this.getUserDetails();
    }
    this.doSomething('');
  }
  addIncomeSources() {
    if (this.isSourceOne || this.isSourceTwo || this.isSourceThree) {
      if (this.isSourceOne) {
        if (this.sourceOne == "" || this.sourceOne == null || this.sourceValueOne == "" || this.sourceValueOne == null) {
          this.isValidSource = true;
          setTimeout(() => {
            this.isValidSource = false;
          }, 3000);
          return;
        }
      }
      if (this.isSourceTwo) {
        if (this.sourceTwo == "" || this.sourceTwo == null || this.sourceValueTwo == "" || this.sourceValueTwo == null) {
          this.isValidSource = true;
          setTimeout(() => {
            this.isValidSource = false;
          }, 3000);
          return;
        }
      }
      if (this.isSourceThree) {
        if (this.sourceThree == "" || this.sourceThree == null || this.sourceValueThree == "" || this.sourceValueThree == null) {
          this.isValidSource = true;
          setTimeout(() => {
            this.isValidSource = false;
          }, 3000);
          return;
        }
      }
    }
    if (this.sourceOne == "" || this.sourceOne == undefined) {
      this.sourceOne = "";
      this.sourceValueOne = 0;
      this.sourceValueOneComma = "0";
    }
    if (this.sourceTwo == "" || this.sourceTwo == undefined) {
      this.sourceTwo = "";
      this.sourceValueTwo = 0;
      this.sourceValueTwoComma = "0";
    }
    if (this.sourceThree == "" || this.sourceThree == undefined) {
      this.sourceThree = "";
      this.sourceValueThree = 0;
      this.sourceValueThreeComma = "0";
    }
    if (this.incomeValue == 0 || this.incomeValue == null || this.incomeValue == undefined) {
      this.isValidAmount = true;
      return;
    }
    if (this.incomeValue < this.minMonthlyIncome || this.incomeValue > this.maxMonthlyIncome) {
      this.isValidIncome = true;
      return;
    }

    this.setUpshotEditincomeEvent();

    var request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "MonthlySalary": this.incomeValue,
      "IncomeSource": [{ "SourceId": this.sourceOne, "IncomeValue": this.sourceValueOne },
      { "SourceId": this.sourceTwo, "IncomeValue": this.sourceValueTwo },
      { "SourceId": this.sourceThree, "IncomeValue": this.sourceValueThree }]
    }
    return this.restapiProvider.sendRestApiRequest(request, 'AddIncomeSource')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.navCtrl.pop();
        }
      },
        (error) => {
        })
  }
  doSomething(e) {
    this.incomeValueComma = "₹" + (this.incomeValue ? this.numberPipe.transform(this.incomeValue.toString().replaceAll(",","").replaceAll("₹","")) : "");
    this.isValidAmount = false;
    if (this.incomeValue >= (this.maxMonthlyIncome / 3) && this.incomeValue <= (this.maxMonthlyIncome / 2)) {
      this.steps = 1000;
    }
    else if (this.incomeValue >= (this.maxMonthlyIncome / 2)) {
      this.steps = 2000;
    }
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
  getUserDetails() {
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId']
    }
    this.restapiProvider.sendRestApiRequest(request, 'GetUserDetails').subscribe((response) => {
      if (response.IsSuccess == true) {
        this.getBreakUpData = response.Data.Table4;
        this.setDefaultAmount();
      }
      else {
      }
    },
      (error) => {
      });
  }
  setDefaultAmount() {
    this.breakupArray = [];
    if (this.getBreakUpData.length > 0) {
      for (let i = 0; i < this.getBreakUpData.length; i++) {
        for (let j = 0; j < this.breakUp.length; j++) {
          if (this.breakUp[j].MonthlyExpenseID == this.getBreakUpData[i].ExpenseID) {
            this.breakUp[j].amount = parseInt(this.getBreakUpData[i].ExpenseValue);
            this.monthlyExpenses = (this.monthlyExpenses ? this.monthlyExpenses : 0) + parseInt(this.getBreakUpData[i].ExpenseValue)
            this.breakupArray.push(this.breakUp[j]);
            this.cdr.detectChanges();
          }
        }
      }
    }
    else {
      this.monthlyExpenses = 0;
    }
  }
  addChildren() {
    let pushData = {
      "id": this.childrenArray.length,
    }
    this.childrenArray.push(pushData);
    setTimeout(() => {
      $('#' + (this.childrenArray.length - 1) + '-ChildrenAge .select').find('.select-text').removeClass('select-placeholder').text('1');
      $('#' + (this.childrenArray.length - 1) + '-ChildrenIncome').css("display", "none");
    }, 200);
  }
  childSelectFun(a, b) {
  }
  changeChildFunction() {
    setTimeout(() => {
      $('#0-ChildrenAge .select').find('.select-text').removeClass('select-placeholder').text('1');
      $('#0-ChildrenIncome').css("display", "none");
    }, 200);
  }
  showSources() {
    if (this.isAddOtherOne) {
      this.isIncomeSource = true;
      this.isAnotherSource = false;
      this.isSourceOne = true;
      this.isAddOtherOne = false;
      this.isAddOtherTwo = true;
      this.isRemoveOne = true;
      this.isRemoveTwo = false;
      this.isRemoveThree = false;
    }
    else if (this.isAddOtherTwo) {
      this.isSourceTwo = true;
      this.isAddOtherTwo = false;
      this.isAddOtherThree = true;
      this.isRemoveOne = false;
      this.isRemoveTwo = true;
      this.isRemoveThree = false;
    }
    else if (this.isAddOtherThree) {
      this.isSourceThree = true;
      this.isAddOtherThree = false;
      this.isRemoveOne = false;
      this.isRemoveTwo = false;
      this.isRemoveThree = true;
    }
  }
  closeSources(closeNum) {
    if (closeNum == "1") {
      this.isSourceOne = false;
      this.sourceOne = "";
      this.sourceValueOne = null;
      this.sourceValueOneComma = "";

    }
    else if (closeNum == "2") {
      this.isSourceTwo = false;
      this.sourceTwo = "";
      this.sourceValueTwo = null;
      this.sourceValueTwoComma = "";
    }
    else if (closeNum == "3") {
      this.isSourceThree = false;
      this.sourceThree = "";
      this.sourceValueThree = null;
      this.sourceValueThreeComma = "";
    }
    if (this.isSourceOne == false && this.isSourceTwo == false && this.isSourceThree == false) {
      this.isIncomeSource = false;
      this.isAnotherSource = true;
      this.isAddOtherOne = true;
      this.isAddOtherTwo = false;
      this.isAddOtherThree = false;
    }
    else if (this.isSourceOne == true && this.isSourceTwo == false && this.isSourceThree == false) {
      this.isAddOtherOne = false;
      this.isAddOtherTwo = true;
      this.isAddOtherThree = false;
      this.isRemoveOne = true;
      this.isRemoveTwo = false;
      this.isRemoveThree = false;
    }
    else if (this.isSourceOne == true && this.isSourceTwo == true && this.isSourceThree == false) {
      this.isAddOtherOne = false;
      this.isAddOtherTwo = false;
      this.isAddOtherThree = true;
      this.isRemoveOne = false;
      this.isRemoveTwo = true;
      this.isRemoveThree = false;
    }
    else if (this.isSourceOne == true && this.isSourceTwo == true && this.isSourceThree == true) {
      this.isAddOtherOne = false;
      this.isAddOtherTwo = false;
      this.isAddOtherThree = false;
      this.isRemoveOne = false;
      this.isRemoveTwo = false;
      this.isRemoveThree = true;
    }
  }
  deleteSource(type) {
    if (type == "yes") {
      this.deleteStatus = false;
    }
    else {
      this.deleteStatus = false;
    }

  }
  changeInput(param) {
    if (param == "amt") {
      this.isValidAmount = false;
      this.isValidIncome = false;
    }
    if (param == "src") {
      this.isValidSource = false;
    }
  }
  expenditureReview() {
    let request = {
      'LangId': localStorage.getItem('langId'),
      'Month': new Date().getMonth() + 1,
      'Year': new Date().getFullYear(),
      'CustId': this.restapiProvider.userData['CustomerID'],
    }
    return this.restapiProvider.sendRestApiRequest(request, 'ExpenditureReview')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          if (response.Data.Table3.length != 0) {
            for (let i = 0; i < response.Data.Table3.length; i++) {
              if (i == 0) {
                this.sourceOne = response.Data.Table3[i].SourceId;
                this.sourceValueOne = response.Data.Table3[i].IncomeValue;
                this.sourceValueOneComma = this.sourceValueOne ? this.numberPipe.transform(this.sourceValueOne.toString().replaceAll(",","")) : "";
                this.isAddOtherOne = true;
                this.showSources();
              }
              else if (i == 1) {
                this.sourceTwo = response.Data.Table3[i].SourceId;
                this.sourceValueTwo = response.Data.Table3[i].IncomeValue;
                this.sourceValueTwoComma = this.sourceValueTwo ? this.numberPipe.transform(this.sourceValueTwo.toString().replaceAll(",","")) : "";
                this.isAddOtherTwo = true;
                this.showSources();
              }
              else if (i == 2) {
                this.sourceThree = response.Data.Table3[i].SourceId;
                this.sourceValueThree = response.Data.Table3[i].IncomeValue;
                this.sourceValueThreeComma = this.sourceValueThree ? this.numberPipe.transform(this.sourceValueThree.toString().replaceAll(",","")) : "";
                this.isAddOtherThree = true;
                this.showSources();
              }
            }
          }
          if (response.Data.Table.length != 0) {
            this.incomeValue = response.Data.Table[0].MonthIncome
            this.monthlyIncome = this.incomeValue;
            this.incomeValueComma = "₹" + (this.incomeValue ? this.numberPipe.transform(this.incomeValue.toString().replaceAll(",","").replaceAll("₹","")) : "");
          }
        }
      },
        (error) => {
        })
  }
  getIncomeExpenses() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'LangId': localStorage.getItem('langId'),
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetIncomeExpenses')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.incomeList = response.Data.Table;
        }
      },
        (error) => {
        })
  }

  setUpshotEditincomeEvent() {
    try {
      if (!this.sourceValueOne) {
        this.sourceValueOne = 0;
        this.sourceValueOneComma = "0";
      }
      if (!this.sourceValueTwo) {
        this.sourceValueTwo = 0;
        this.sourceValueTwoComma = "0";
      }
      if (!this.sourceValueThree) {
        this.sourceValueThree = 0;
        this.sourceValueThreeComma = "0";
      }
      let payload = {
        "Appuid": this.utilitiesProvider.upshotUserData.appUId,
        "Language": this.utilitiesProvider.upshotUserData.lang,
        "City": this.utilitiesProvider.upshotUserData.city,
        "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
        "MonthlyIncome": this.incomeValue,
        "SourceOfIncome": Number(this.sourceValueOne) + Number(this.sourceValueTwo) + Number(this.sourceValueThree)
      }
      this.utilitiesProvider.upshotCustomEvent('EditIncome', payload, false);
    }
    catch (err) {
      // console.log(err)
    }
  }

  formatAmount(val, type) {
    if(type == "income") {
      this.incomeValueComma = "₹" + (val ? this.numberPipe.transform(val.toString().replaceAll(",","").replaceAll("₹","")) : "");
      this.incomeValue = val ? val.toString().replaceAll(",","").replaceAll("₹","") : "";
    }
    else if(type == "source1") {
      this.sourceValueOneComma = val ? this.numberPipe.transform(val.toString().replaceAll(",","")) : "";
      this.sourceValueOne = val ? val.toString().replaceAll(",","") : "";
    }
    else if(type == "source2") {
      this.sourceValueTwoComma = val ? this.numberPipe.transform(val.toString().replaceAll(",","")) : "";
      this.sourceValueTwo = val ? val.toString().replaceAll(",","") : "";
    }
    else if(type == "source3") {
      this.sourceValueThreeComma = val ? this.numberPipe.transform(val.toString().replaceAll(",","")) : "";
      this.sourceValueThree = val ? val.toString().replaceAll(",","") : "";
    }
  }

  async SourceOneList(){
    let commonList = this.sourceList.map(el => {
      const obj = {
        name: el.source,
        value: el.sourceId,
        // selectOption: el.source
      };
      return obj;
    }
      
    );
    // console.log("pass data", commonList);
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { commonList: commonList },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
      this.sourceOne = data;
      this.sourceList.forEach(el => {
        if(el.sourceId == data){
          this.sourceOneTitle = el.source;
        }
      }) 

    })
  }

  async SourceTwoList(){
    let commonList = this.sourceList.map(el => {
      const obj = {
        name: el.source,
        value: el.sourceId,
        // selectOption: el.source
      };
      return obj;
    }
      
    );
    // console.log("pass data", commonList);
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { commonList: commonList },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
      this.sourceTwo = data;
      this.sourceList.forEach(el => {
        if(el.sourceId == data){
          this.sourceTwoTitle = el.source;
        }
      }) 

    })
  }

  async SourceThreeList(){
    let commonList = this.sourceList.map(el => {
      const obj = {
        name: el.source,
        value: el.sourceId,
        // selectOption: el.source
      };
      return obj;
    }
      
    );
    // console.log("pass data", commonList);
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { commonList: commonList },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
      this.sourceThree = data;
      this.sourceList.forEach(el => {
        if(el.sourceId == data){
          this.sourceThreeTitle = el.source;
        }
      }) 

    })
  }
}
