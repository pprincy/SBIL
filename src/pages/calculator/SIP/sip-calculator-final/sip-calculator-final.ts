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
import { DecimalPipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-sip-calculator-final',
  templateUrl: 'sip-calculator-final.html',
})
export class SipCalculatorFinalPage {

  @ViewChild(Content) content: Content;
  public selectedDrop;
  public isBtnActive: boolean = false;
  public status: boolean = false;
  public pageLoader : boolean = false;

  public maturityAmt;
  public SIPAmtInvested;
  public interestEarned
  public expectedRate;
  public incrSavingsRate;
  public tenure;
  public maturityYear;
  public SIPAmount;
  public SIPAmountComma;
  public minSIPamount;
  public maxSIPamount;

  public bigSteps = 500;
  public smallSteps = 1;
  rangeDataUi: any = {};
  config: any;
  loading: any;
  public disclaimer : any = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public utilitiesProvider: UtilitiesProvider,
    public restapiProvider: RestapiProvider,
    public loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    private numberPipe: DecimalPipe,
    public myApp : MyApp) {
    this.maturityAmt   = parseFloat(this.navParams.get("data").MaturityValue)
    this.SIPAmtInvested = parseFloat(this.navParams.get("data").AmountInvested)
    this.interestEarned = parseFloat(this.navParams.get("data").InterestEarned)
    this.SIPAmount = parseFloat(this.navParams.get("data").MonthlyInvestment)
    
    let amount : number = 0;
    let amountStr : String = "";
    if(this.SIPAmount) {
      amount = Number(this.SIPAmount.toString().replace(/,/g,"").replace(/₹/g,"").replace(/ /g,""));
      amountStr = amount.toLocaleString('en-IN');
    }
    this.SIPAmountComma = "₹" + amountStr;
    
    this.tenure = parseInt(this.navParams.get("data").Tenure);
    this.maturityYear  = parseInt(this.tenure) + new Date().getFullYear();
    this.expectedRate  = parseFloat(this.navParams.get("data").RateOfReturn )
    this.incrSavingsRate =  parseFloat(this.navParams.get("data").IncrementalSavings)
    this.minSIPamount = parseFloat(this.utilitiesProvider.defaultGoalData.data.mnthly_inv.min);
    this.maxSIPamount = parseFloat(this.utilitiesProvider.defaultGoalData.data.mnthly_inv.max);
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
  //     }, 100);
  //   }

  // }

  ionViewDidLoad() {
    this.myApp.updatePageUseCount("15");
    this.utilitiesProvider.googleAnalyticsTrackView('SIP');
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

   this.utilitiesProvider.upshotScreenView('SIPCalculatorFinal');
  }

  menuToggle() {
    this.menuCtrl.open();
  }

  chartLoad() {
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
        text: '' ,
      },
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
        enableMouseTracking: false,
        data: [ {
          name: 'SIP amount invested',
          y: this.SIPAmtInvested,
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
          name: 'Interest Earned',
          y: this.interestEarned,
          color: '#5C2483',
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
    if (type == "rateOfReturn") {
      this.utilitiesProvider.rangeData = parseFloat(this.expectedRate);
      this.rangeDataUi = {
        "steps" : this.smallSteps,
        "amount": parseFloat(this.expectedRate),
        "min"   : parseFloat(this.utilitiesProvider.defaultGoalData.data.rate_of_return.min),
        "max"   : parseFloat(this.utilitiesProvider.defaultGoalData.data.rate_of_return.max),
        "title" : "Expected Rate of Return",
        "type"  : "" ,
        "info"  : this.utilitiesProvider.infoPopupText[5].desc
      }
    }
    if (type == "incrSavingsRate") {
      this.utilitiesProvider.rangeData = parseFloat(this.incrSavingsRate);
      this.rangeDataUi = {
        "steps" : this.smallSteps,
        "amount": parseFloat(this.incrSavingsRate),
        "min"   : parseFloat(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.min),
        "max"   : parseFloat(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.max),
        "title" : "Increasing savings rate",
        "type"  : "" ,
        "info"  : this.utilitiesProvider.infoPopupText[1].desc
      }
    }
    if (type == "maturityYear") {
      this.utilitiesProvider.rangeData = parseFloat(this.tenure);
      this.rangeDataUi = {
        "steps" : this.smallSteps,
        "amount": parseInt(this.tenure),
        "min"   : parseInt(this.utilitiesProvider.defaultGoalData.data.tenure_in_yr.min),
        "max"   : parseInt(this.utilitiesProvider.defaultGoalData.data.tenure_in_yr.max),
        "title" : "SIP Tenure",
        "type"  : "" ,
        "info"  : ""
      }
    }
  }
  doSomething(e){
    if(this.SIPAmount >= (this.maxSIPamount / 3) && this.SIPAmount <= (this.maxSIPamount / 2)){
      this.bigSteps = 1000;
    }
    else if(this.maxSIPamount >= (this.maxSIPamount / 2) ){
    this.bigSteps = 1000;
    }
    this.SIPAmountComma = "₹" + (this.SIPAmount ? this.numberPipe.transform(this.SIPAmount) : "0");
    this.CalculateEMIAmount();
  }

  done() {
    let rangeValue = parseFloat(this.utilitiesProvider.rangeData);
      if (rangeValue < parseInt(this.rangeDataUi.min) || rangeValue > parseInt(this.rangeDataUi.max)) {
        this.restapiProvider.presentToastTop("Please enter number between " + this.rangeDataUi.min + " to " + this.rangeDataUi.max)
      }
      else {
        this.status = !this.status;
        if(this.status == false)
     {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
     }
    
        if (this.selectedDrop == "rateOfReturn") {
          this.expectedRate = rangeValue;
        }
        if (this.selectedDrop == "incrSavingsRate") {
          this.incrSavingsRate = rangeValue;
        }
        if (this.selectedDrop == "maturityYear") {
          this.tenure = rangeValue
          this.maturityYear = this.tenure + new Date().getFullYear();
        }
        this.CalculateEMIAmount();
      }
  }

  isAmount(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      this.restapiProvider.presentToastTop("Please enter only numbers");
      return false;
    }
    return true;
  }

  checkSIPAmt() {
    if (this.SIPAmount < this.minSIPamount || this.SIPAmount > this.maxSIPamount) {
      this.restapiProvider.presentToastTop("Please enter deposit amount between " + this.minSIPamount + " to " + this.maxSIPamount);
    }
  }

  checkCalculateSIPAmount(){
    if (this.SIPAmount < this.minSIPamount || this.SIPAmount > this.maxSIPamount) {
      return;
    }
    else{
      this.CalculateEMIAmount();
    }
  }


  CalculateEMIAmount() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "MonthlyInvestment":this.SIPAmount,
      "Tenure":this.tenure,
      "RateOfReturn":this.expectedRate,
      "IncrementalSavingsRate": this.incrSavingsRate
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetSIPValues')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          // console.log(response);
          this.maturityAmt   = parseFloat(response.Data.MaturityValue)
          this.SIPAmtInvested = parseFloat(response.Data.AmountInvested)
          this.interestEarned = parseFloat(response.Data.InterestEarned)
          this.SIPAmount = parseFloat(response.Data.MonthlyInvestment)
          
          let amount : number = 0;
          let amountStr : String = "";
          if(this.SIPAmount) {
            amount = Number(this.SIPAmount.toString().replace(/,/g,"").replace(/₹/g,"").replace(/ /g,""));
            amountStr = amount.toLocaleString('en-IN');
          }
          this.SIPAmountComma = "₹" + amountStr;
          
          this.tenure = parseInt(response.Data.Tenure);
          this.maturityYear  = this.tenure + new Date().getFullYear();
          this.expectedRate  = parseFloat(response.Data.RateOfReturn )
          this.incrSavingsRate =  parseFloat(response.Data.IncrementalSavings)
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
    this.navCtrl.setRoot('SipCalculatorPage');
  }
  //ScreenShot Code
  takeScreenshot() {
    this.utilitiesProvider.screenShotURI();

    this.utilitiesProvider.setUpshotShareEvent('Tool', 'SIP Caculator');
  }

  goToGoalsListing() {
    this.setUpshotEvent('Start Planning');
    this.navCtrl.setRoot('ListingScreenGoalPage', { pageFrom: 'SIP' })
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
      "MonthlyInvestAmt": this.SIPAmount,
      "Duration": this.tenure,
      "Corpus": this.maturityAmt,
      "InterestEarned": this.interestEarned,
      "SIPAmtInvested": this.SIPAmtInvested,
      "ExpROR": this.expectedRate,
      "ISR": this.incrSavingsRate,
      "Action": action
    }
    console.log(payload)
    this.utilitiesProvider.upshotCustomEvent('SIPCalculator', payload, false);
  }

  formatAmount(val) {
    let amount : number = 0;
    let amountStr : String = "";
    if(val && val.trim() != "₹") {
      amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }
    
    this.SIPAmountComma = "₹" + amountStr;
    this.SIPAmount = amount;
  }
}
