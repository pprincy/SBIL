import {
  Component,
  ViewChild,
  Input,
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Content,
  LoadingController,
  MenuController
} from 'ionic-angular';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import * as HighCharts from 'highcharts';
import * as $ from 'jquery';
import {MyApp} from '../../../../app/app.component';
import { AmountFormatPipe } from '../../../../pipes/amount-format/amount-format';

@IonicPage()
@Component({
  selector: 'page-loanemi-calculator-final',
  templateUrl: 'loanemi-calculator-final.html',
})
export class LoanemiCalculatorFinalPage {
  @ViewChild(Content) content: Content;
  public selectedDrop;
  public isBtnActive: boolean = false;
  public status: boolean = false;
  public pageLoader : boolean = false;

  public loanAmt;
  public EMIAmt;
  public interestInccured;
  public interestRate;
  public loanAmtPayable;
  public tenure;
  public tenureInYears;
  public tenureInMonths;
  public bigSteps = 50000;
  public smallSteps = 1;
  rangeDataUi: any = {};
  config: any;
  loading: any;
  public disclaimer : any = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public utilitiesProvider: UtilitiesProvider,
    private restapiProvider: RestapiProvider,
    private loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    public myApp : MyApp) {
    // console.log("Navparams: ", this.navParams.get("data"))
    this.loanAmt   = parseFloat(this.navParams.get("data").Amount)
    this.EMIAmt = parseFloat(this.navParams.get("data").EMI)
    this.interestInccured = parseFloat(this.navParams.get("data").InterestPayable)
    this.interestRate   = parseFloat(this.navParams.get("data").InterestRate)
    this.loanAmtPayable  = parseFloat(this.navParams.get("data").MaturityValue)
    this.tenureInMonths  = parseFloat(this.navParams.get("data").Tenure) * 12
    this.tenureInYears = parseFloat(this.navParams.get("data").Tenure)
  }
			  
  disclaimerInfo(){
    this.disclaimer = !this.disclaimer;
    if(this.disclaimer == true)
    {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
  }

  disclaimerClose(){
    this.disclaimer = !this.disclaimer;
  
    if(this.disclaimer == false)
    {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
    }
  }

  // top = 0;
  // scrollToTop() {
  //   setTimeout(() => {
  //     this.cssCahnge();
  //   }, 100);
  // }

  // cssCahnge() {
  //   if (this.top == 0) {
  //     $('.networth_details').removeClass('shrink');
   

  //   }
  //   else {
  //     $('.networth_details').addClass('shrink');
  //     setTimeout(function () {
  //       var hedaerheight = $('.shrink').parent().outerHeight();
  //      // $('.fixed-content').css('margin-top', hedaerheight);
  //     //  $('.scroll-content').css('margin-top', hedaerheight);
  //     }, 100);
  //   }

  // }

  ionViewDidLoad() {
    this.myApp.updatePageUseCount("18");
    this.utilitiesProvider.googleAnalyticsTrackView('Loan EMI');
    this.chartLoad();
    // this.scrollToTop();
    // this.content.ionScroll.subscribe((data)=>{
    //   if(data){
    //     this.top  = data.scrollTop;
    //     this.cssCahnge();
    //   }
    //  });
      
    // this.content.ionScrollStart.subscribe((data)=>{
    //   if(data){
    //     this.top  = data.scrollTop;
    //     this.cssCahnge();
    //   }
    // });

   this.utilitiesProvider.upshotScreenView('LoanEMIFinal');
  }
  // temp(){
  //   console.log("Hello");
  // }
  menuToggle() {
    this.menuCtrl.open();
  }


  chartLoad() {
    let totalPayAmt = this.utilitiesProvider.getRoundingFigure(this.loanAmt + this.interestInccured);
    var myChart = HighCharts.chart('networth_chart', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        margin: [0, 0, 0, 0],
        spacing: [0, 10, 0, 10],
      },
      title: {
        useHTML: true,
        text: `<div class="chart_center_text">
          <div class="chart_center_title">Total Payable</div>
          <div id="edit" class="chart_center_rs">₹`+totalPayAmt+`</div>
          </div>
        </div>`,
        align: 'center',
        verticalAlign: 'middle',
        y: -40,
        color: '#5C2483',
        style: {
          color: '#5C2483',
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: 0.38  
        }
      },
      // subTitle:{
      //   text: "₹" + totalPayAmt,
      //   align: 'center',
      //   verticalAlign: 'middle',
      //   y: -30,
      //   color: '#5C2483',
      //   style: {
      //     color: '#5C2483',
      //     font: 'bold 20px Lato 700',
      //  }
      // },
      credits: {
        enabled: false
      },
       tooltip: {
        enabled: false
      },
      plotOptions: {
          pie: {
            borderColor: '#ffffff',
            borderRadius: '50%',
            allowPointSelect: false,
            cursor: 'pointer',
              dataLabels: {
                  enabled: false,
              },
              startAngle: -90,
              endAngle: 90,
              center: ['50%', '50%'],
              // size: '90%'
          }
      },
      series: [{
        size: '60%',
        type: 'pie',
        innerSize: '80%',
        name: '',
        enableMouseTracking: false,
        data: [ {
          name: this.utilitiesProvider.langJsonData['fixedDepositCalculator']['principalAmount'],
          // color: '#D60D47',
          y: this.loanAmt,
          z: 235.6,
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
                [0, '#301F6C'],
                [1, '#D60D47']
            ]
        }
        },
        {
          name: this.utilitiesProvider.langJsonData['fixedDepositCalculator']['interestEarned'],
          color: '#5C2483',
          y: this.interestInccured,
          z: 214.5
        },]
      }]
    });
  }
  toggleClass(id) {
    $('#' + id).toggleClass('active')
  }
  showOverlay(type) {
    this.status = !this.status;
    
    if(this.status == true)
    {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
    this.selectedDrop = type;
    if (type == "interestRate") {
      this.utilitiesProvider.rangeData = parseFloat(this.interestRate);
      this.rangeDataUi = {
        "steps" : 1,
        "amount": parseFloat(this.interestRate),
        "min"   : parseFloat(this.utilitiesProvider.defaultCalData.data.interest_rate.min),
        "max"   : parseFloat(this.utilitiesProvider.defaultCalData.data.interest_rate.max),
        "title" : this.utilitiesProvider.langJsonData['emiCalculator']['interestRate'],
        "type"  : "",
        "info"  : this.utilitiesProvider.infoPopupText[5].desc
      }
    }
    if (type == "loanAmt") {
      this.utilitiesProvider.rangeData = parseFloat(this.loanAmt);
      this.rangeDataUi = {
        "steps" : this.bigSteps,
        "amount": parseFloat(this.loanAmt),
        "min"   : parseFloat(this.utilitiesProvider.defaultCalData.data.amt.min),
        "max"   : parseFloat(this.utilitiesProvider.defaultCalData.data.amt.max),
        "title" : this.utilitiesProvider.langJsonData['emiCalculator']['loanamount'],
        "type"  : "r",
        "info"  : ""
      }
    }
    if (type == "tenure") {
      this.utilitiesProvider.rangeData = parseFloat(this.tenureInYears);
      this.rangeDataUi = {
        "steps" : this.smallSteps,
        "amount": parseInt(this.tenureInYears),
        "min"   : parseInt(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.min),
        "max"   : parseInt(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.max),
        "title" :  this.utilitiesProvider.langJsonData['emiCalculator']['EMIDuration'],
        "type"  : "",
        "info"  : ""
      }
    }
  }
  done() {
    $('.header').removeClass('headerOverlay');
    $('.scroll-content').removeClass('scrollOverlay');
    let rangeValue = parseFloat(this.utilitiesProvider.rangeData);
    if (rangeValue) {
      if (rangeValue < parseInt(this.rangeDataUi.min) || rangeValue > parseInt(this.rangeDataUi.max)) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterNumberBetween'] + " " + this.rangeDataUi.min + this.utilitiesProvider.jsErrorMsg['to'] + this.rangeDataUi.max)
      }
      else {
        this.status = !this.status;
        if (this.selectedDrop == "interestRate") {
          this.interestRate = rangeValue;
        }
        if (this.selectedDrop == "loanAmt") {
          this.loanAmt = rangeValue;
        }
        if (this.selectedDrop == "tenure") {
          this.tenureInYears = rangeValue
          this.tenureInMonths = rangeValue * 12;
        }
        this.CalculateEMIAmount();
      }
    }
  }


  CalculateEMIAmount() {
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "Amount": this.loanAmt,
      "Tenure": this.tenureInYears,
      "InterestRate": this.interestRate
    }
    // console.log("Request: " + JSON.stringify(request));
    return this.restapiProvider.sendRestApiRequest(request, 'GetEMIValue')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          // console.log(response);
          this.loanAmt   = parseFloat(response.Data.Amount);
          this.EMIAmt    = parseFloat(response.Data.EMI);
          this.interestInccured = parseFloat(response.Data.InterestPayable);
          this.interestRate   = parseFloat(response.Data.InterestRate);
          this.loanAmtPayable  = parseFloat(response.Data.TotalAmountPayable);
          this.tenure         = parseFloat(response.Data.Tenure);
          this.chartLoad();
        }
        else {
          // console.log(response);
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }

  recalculate() {
    // this.navCtrl.pop();
    this.setUpshotEvent('Recalculate');
    this.navCtrl.setRoot('LoanemiCalculatorPage');
  }
  //ScreenShot Code
  takeScreenshot() {
    this.utilitiesProvider.screenShotURI();

    this.utilitiesProvider.setUpshotShareEvent('Tool', 'Loan EMI Caculator');
  }

  goToGoalsListing() {
    this.setUpshotEvent('Start Planning');
    this.navCtrl.setRoot('ListingScreenGoalPage', { pageFrom: 'Loan EMI' })
  }

  goNotificationList(){
    this.navCtrl.push('NotificationPage');
  }

  setUpshotEvent(action) {
    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "DrivenFrom": this.navParams.get('pageFrom') || '',
      "LoanAmt": this.loanAmt,
      "LoanPeriod": this.tenureInYears,
      "EMI": this.EMIAmt,
      "Interest": this.interestInccured,
      "TotalPayableAmt": this.loanAmt + this.interestInccured,
      "RateofInterest": this.interestRate,
      "Action": action
    }
    console.log(payload)
    this.utilitiesProvider.upshotCustomEvent('LoanEMI', payload, false);
  }
}