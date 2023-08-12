import { Component } from '@angular/core';
import { ViewChild } from '@angular/core'
import { App, IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { TabsPage } from '../../dashboard/tabs/tabs'
import { Network } from '@ionic-native/network';
import { MyApp } from '../../../app/app.component';
import { Slides } from 'ionic-angular';
import * as HighCharts from 'highcharts';
import { DropDowmSelctionPage } from '../../../components/modals/drop-dowm-selction/drop-dowm-selction';
import { AmountFormatPipe } from '../../../pipes/amount-format/amount-format';
import { config } from '../../../shared/config';

@IonicPage()
@Component({
  selector: 'page-plan',
  templateUrl: 'plan.html',
  providers: [ AmountFormatPipe ]
})
export class PlanPage {
  @ViewChild(Slides) slides: Slides;
  public faqsList: any = [];
  public goalsList: any = [];
  public profileData: any = {};
  public calList: any = [];
  // public tipsList: any = [];
  public imgURL;
  public imgURLNew;
  public username;
  public emailId;
  public expenditure: string = 'spendometer';
  public dateList: any;
  public placeDate;
  public expReviewDate: any;
  public expensesDate: any;
  public expensesTrendDate: any;
  public monthIncome;
  public totalSpends;
  public savings;
  public totalSpendsPrecentage;
  public totalsavingsPrecentage;
  public requiredSaving;
  public userGoals;
  public needToSaveMore;
  public exisitingSaving;
  public moreSpends: boolean = false;
  public isGoals: boolean = false;
  public haveGoals: boolean = true;
  public isPageDataLoad: boolean = false;
  public recentSpendsDate = { SMSMonth: (new Date().getMonth()) + 1, SMSYear: new Date().getFullYear() };
  public selectedDate: any;
  public isPeerData: boolean = true;
  public peerBenchmarkArray: any = [];
  public showHideIcon = false;
  public modal;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    public tabsPage: TabsPage,
    public network: Network,
    public myApp: MyApp,
    public modalCtrl: ModalController,
    public amountFormatter: AmountFormatPipe
    ) {
    this.imgURL = this.restapiProvider.getImageURL();
    this.imgURLNew = config.imgURLNew;
    localStorage.removeItem("temp")
  }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("8");
    if (this.network.type === 'none') {
      this.restapiProvider.noInternetPromt();
    }
    else {
      this.utilitiesProvider.googleAnalyticsTrackView('Plan');
      this.FAQsFunc();
      // this.tipsFunc();
      this.popularGoals();
    }
    this.peerBenchmark();
  }

  loadChart() {
    let _that = this;
    HighCharts.chart('spend_review_chart', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        type: 'pie',
        margin: [0, 0, 0, 0],
        spacing: [0, 0, 0, 0],
        events: {
          load: function () {
            const edit = document.querySelector('#edit');
            edit.addEventListener('click', function() {
              _that.editincome();
            });
          }
        }
      },
      title: {
        useHTML: true,
        text: `<div class="chart_center_text">
          <div class="chart_center_title">Monthly Income</div>
          <div id="edit" class="chart_center_rs">₹`+this.amountFormatter.transform(this.monthIncome, 'S')+`<div style="width:10px"></div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_205_1610" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <rect width="24" height="24" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_205_1610)">
            <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3043 2.75 17.863 2.75C18.421 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.571 21.275 6.113C21.2917 6.65433 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#5C2483"/>
            </g>
            </svg>
          </div>
        </div>`,
        align: 'center',
        verticalAlign: 'middle',
        y: -40,
        color: '#5C2483',
        style: {
          color: '#5C2483',
          font: 'bold 20px Lato 700',
       }
      },
      credits: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
              enabled: false,
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '50%'],
        }
    },
      series: [{
        size: '70%',
        type: 'pie',
        innerSize: '80%',
        data: [
          {
            name: 'Total Monthly Spend',
            color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                  [0, '#301F6C'],
                  [1, '#D60D47']
              ]
            },
            y: this.totalSpends,
            z: 235.6
          }, {
            name: 'Monthly Savings',
            y: this.savings,
            z: 214.5,
            color: '#5C2483',
          }],
      }]
    });
  }

  ionViewWillEnter() {
    this.getMonthYearDropDown();
    setTimeout(() => {
      this.utilitiesProvider.initLangLable();
    }, 100);
    this.restapiProvider.sessionExpired();
    if (localStorage.getItem('tokenExpired') == "Yes") {
      this.navCtrl.setRoot("LoginPage");
    }
    this.calList = [];
    if (this.restapiProvider.userData['defaultData']) {
      this.utilitiesProvider.defaultData = JSON.parse(this.restapiProvider.userData['defaultData']);
    }
    if (this.restapiProvider.userData['userPersonalDetails']) {
      this.profileData = JSON.parse(this.restapiProvider.userData['userPersonalDetails']).Table[0];
    }

    for (let i = 0; i < 4; i++) {
      this.calList.push(this.utilitiesProvider.calculatorList[i])
    }
    this.username = this.restapiProvider.userData['customerName'];
    this.emailId = this.restapiProvider.userData['emailId'] ? this.restapiProvider.userData['emailId'] : this.restapiProvider.userData['mobileNo'];
    // this.calList =this.utilitiesProvider.calculatorList;

    this.utilitiesProvider.upshotScreenView('Plan');
    this.utilitiesProvider.upshotTagEvent('Plan');
  }

  toggleSection(i) {
    this.faqsList[i].open = !this.faqsList[i].open;
    if (this.faqsList[i].open && this.faqsList[i].FAQID) {
      this.updateFAQReadCount(this.faqsList[i].FAQID)
    }

    if(this.faqsList[i].open){
      let payload = {
        "Appuid": this.utilitiesProvider.upshotUserData.appUId,
        "Language": this.utilitiesProvider.upshotUserData.lang,
        "City": this.utilitiesProvider.upshotUserData.city,
        "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
        "Module": "Plan",
        "Category": "FAQs"
      }
      this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);
    }
  }
  toggleItem(i, j) {
    this.faqsList[i].children[j].open = !this.faqsList[i].children[j].open;
  }
  //UpdateFAQReadCount
  updateFAQReadCount(id) {
    let request = {
      'FAQId': id,
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId']
    }
    return this.restapiProvider.sendRestApiRequest(request, 'UpdateFAQReadCount')
      .subscribe((response) => {
      },
        (error) => {
          this.tabsPage.hideLoader();
        })
  }
  //CardsLifePlanListing
  popularGoals() {
    this.tabsPage.showLoader();
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId']
    }
    return this.restapiProvider.sendRestApiRequest(request, 'PopularGoals')
      .subscribe((response) => {
        console.log("res goals", response);
        if (response.IsSuccess == true) {
          this.goalsList = response.Data.Table;
          console.log("goals list",this.goalsList);
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

  //Tips
  // tipsFunc() {
  //   let request = {
  //     'CustId': this.restapiProvider.userData['CustomerID'],
  //     'TokenId': this.restapiProvider.userData['tokenId'],
  //     'TopCount': '3'
  //   }
  //   return this.restapiProvider.sendRestApiRequest(request, 'Tips')
  //     .subscribe((response) => {
  //       if (response.IsSuccess == true) {
  //         this.tipsList = response.Data.Table;
  //       }
  //       else {
  //       }
  //     },
  //       (error) => {

  //       })
  // }
  //FAQs
  FAQsFunc() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
    }
    return this.restapiProvider.sendRestApiRequest(request, 'FAQs')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.faqsList = response.Data.Table;
        }
        else {
        }
      },
        (error) => {
        })
  }

  errorPic() {
    if (this.restapiProvider.userData['gender'] == "Male" || this.restapiProvider.userData['gender'] == "") {
      this.profileData.ImagePath = this.utilitiesProvider.noProfileImg;
    }
    else {
      this.profileData.ImagePath = this.utilitiesProvider.noProfileImgFemale;
    }
  }
  calClick(c) {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Plan",
      "Category": "Tools"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    this.app.getRootNav().push(c.className, {pageFrom:'Plan'});
  }
  showMoreCal() {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Plan",
      "Category": "Tools"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    this.app.getRootNav().push('CalculatorlistingPage', {pageFrom:'Plan'});
  }
  riskPage() {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Plan",
      "Category": "Tell Us"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    let riskAssess = JSON.parse(this.restapiProvider.userData['riskAssess']);
    if (riskAssess && riskAssess.length > 0) {
      this.app.getRootNav().push('RiskassesmentFinalPage', { data: riskAssess[0] })
    }
    else {
      this.app.getRootNav().setRoot('RiskAssesmentPage');
    }
  }
  goToEditProfile() {
    this.app.getRootNav().push('UserDefaultPage');
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
  tipsGo() {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Plan",
      "Category": "Tips"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    this.app.getRootNav().push('TipsListingPage');
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
  faqFun() {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Plan",
      "Category": "FAQs"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    this.app.getRootNav().push('FaqsPage');
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
  incomeExpensePage() {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Plan",
      "Category": "Spend Manager"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    this.navCtrl.push('IncomeDashboardPage', { data: this.selectedDate });
  }
  addGoals() {
    this.app.getRootNav().push('ListingScreenGoalPage', { pageFrom: 'Plan' });
  }
  editincome() {

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Module": "Plan",
      "Category": "Spend Manager"
    }
    this.utilitiesProvider.upshotCustomEvent('HomeEvent', payload, false);

    this.navCtrl.push('EditincomePage', { data: this.monthIncome });
  }
  getMonthYearDropDown() {
    this.tabsPage.showLoader();
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID']
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetMonthYearList')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          if (response["Data"]["Table"].length != 0) {
            this.dateList = response["Data"]["Table"];
            this.placeDate = response.Data.Table[0]["MonthYearDropDown"];
            this.expenditureReview(this.dateList[0]);
            this.expReviewDate = this.expensesDate = this.expensesTrendDate = this.dateList[0].MonthYearDropDown;
          }
          else {
            this.tabsPage.hideLoader();
          }
        }
        else {
          this.tabsPage.hideLoader();
        }
      },
        (error) => {
          this.tabsPage.hideLoader();
        })
  }
  expenditureReview(date) {
    this.selectedDate = date;
    this.tabsPage.showLoader();
    let request = {
      'LangId': localStorage.getItem('langId'),
      'Month': date.SMSMonth,
      'Year': date.SMSYear,
      'CustId': this.restapiProvider.userData['CustomerID'],
    }
    return this.restapiProvider.sendRestApiRequest(request, 'ExpenditureReview')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          if (response.Data.Table.length != 0 || response.Data.Table1.length != 0 || response.Data.Table2.length != 0) {
            if (response.Data.Table.length) {
              this.monthIncome = response["Data"]["Table"][0]["TotalMonthIncome"]
              this.totalSpends = response["Data"]["Table"][0]["Total_Spends"]
              this.savings = response["Data"]["Table"][0]["Savings"] >= 0 ? response["Data"]["Table"][0]["Savings"] : (-1) * response["Data"]["Table"][0]["Savings"]
              this.totalSpendsPrecentage = this.totalSpends / this.monthIncome
              this.totalsavingsPrecentage = (response["Data"]["Table"][0]["Savings"] > 0 ? response["Data"]["Table"][0]["Savings"] : 1) / this.monthIncome
              this.moreSpends = response["Data"]["Table"][0]["Savings"] < 0 ? true : false;
              this.exisitingSaving = response["Data"]["Table"][0]["Savings"] >= 0 ? response["Data"]["Table"][0]["Savings"] : 0;
              setTimeout(() => {
                this.loadChart();
              }, 100);
            }
            if (response.Data.Table1.length) {
              this.requiredSaving = response["Data"]["Table1"][0]["RequiredSavings"] < 0 ? 0 : response["Data"]["Table1"][0]["RequiredSavings"];
              this.needToSaveMore = response["Data"]["Table1"][0]["Need_ToSaveMore"] < 0 ? 0 : response["Data"]["Table1"][0]["Need_ToSaveMore"];
            }
            if (response.Data.Table2.length) { this.userGoals = response["Data"]["Table2"] }
            if (this.userGoals == "" || this.userGoals == undefined) {
              this.isGoals = false;
              this.haveGoals = true;
            }
            else {
              this.haveGoals = false;
              this.isGoals = true;
            }
            // If No Data
            if (this.totalSpends == null || this.totalSpends == 0) {
              this.totalSpends = 0;
            }
            if (this.savings == null && this.exisitingSaving == null && this.needToSaveMore == null) {
              this.savings = this.exisitingSaving = this.monthIncome;
              this.needToSaveMore = (this.requiredSaving - this.exisitingSaving) < 0 ? 0 : (this.requiredSaving - this.exisitingSaving);
              this.totalsavingsPrecentage = 99;
            }
            else {
            }
            setTimeout(() => {
              this.tabsPage.hideLoader();
            }, 200)
          }
          else {
            this.tabsPage.hideLoader();
          }
        }
        else {
          this.tabsPage.hideLoader();
        }
        setTimeout(() => {
          this.isPageDataLoad = true;
          this.tabsPage.hideLoader();
        }, 200)
      },
        (error) => {
          this.tabsPage.hideLoader();
        })
  }
  peerBenchmark() {
    this.tabsPage.showLoader();
    let request = {
      'LangId': localStorage.getItem('langId'),
      'CustId': this.restapiProvider.userData['CustomerID'],
    }
    return this.restapiProvider.sendRestApiRequest(request, 'PeerBenchmark')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          if (response["Data"]["Table"].length != 0) {
            this.peerBenchmarkArray = response.Data.Table;
          }
          else {
            this.tabsPage.hideLoader();
            this.isPeerData = false;
          }
        }
        else {
          this.tabsPage.hideLoader();
          this.isPeerData = false;
        }
        setTimeout(() => {
          this.isPageDataLoad = true;
          this.tabsPage.hideLoader();
        }, 200)
      },
        (error) => {
          this.tabsPage.hideLoader();
        })
  }
  doRefresh(refresher) {
    this.getMonthYearDropDown();
    this.FAQsFunc();
    // this.tipsFunc();
    this.popularGoals();
    this.peerBenchmark();
    setTimeout(() => {
      refresher.complete();
    }, 1000)
  }
  restartSlides(event) {
    this.slides.startAutoplay();
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

  showHide(item){
    item.open = !item.open;
    
  }

  async MonthListExpenseReview(){
    let commonList = this.dateList.map(el => {
      const obj = {
        name: el.MonthYearDropDown,
        value: el.MonthYearDropDown,
      };
      return obj;
    }
      
    );
    // console.log("pass data", commonList);
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { commonList: commonList,
        selectOption: this.expReviewDate  
      },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
      this.expReviewDate = data;
      this.dateList.forEach(element => {
        if(element.MonthYearDropDown == data){
          this.expenditureReview(element);
        }
        
      }); 
        
    })

  }

}
