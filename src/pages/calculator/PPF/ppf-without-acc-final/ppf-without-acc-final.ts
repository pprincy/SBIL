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


@IonicPage()
@Component({
  selector: 'ppf-without-acc-final',
  templateUrl: 'ppf-without-acc-final.html',
})
export class PpfWithoutAccFinalPage {

  @ViewChild(Content) content: Content;
  public selectedDrop;
  public isBtnActive: boolean = false;
  public status: boolean = false;
  public pageLoader : boolean = false;

  public corpusAccumlated;
  public investedAmt;
  public interestEarned;
  public rateOfReturn;
  public investedTenure;
  public futureYears;

  public bigSteps = 100;
  public smallSteps = 1;
  rangeDataUi: any = {};
  config: any;
  loading: any;
  public disclaimer : any = false;
  public AmountContributedToPPF;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public utilitiesProvider: UtilitiesProvider,
    private restapiProvider: RestapiProvider,
    private loadingCtrl: LoadingController,
    public menuCtrl: MenuController) {
    // console.log("Navparams: ", this.navParams.get("data"))
    this.corpusAccumlated   = parseFloat(this.navParams.get("data").MaturityAmount)
    this.rateOfReturn = parseFloat(this.navParams.get("data").RateOfReturn)
    this.investedAmt = parseFloat(this.navParams.get("data").AmountInvested)
    this.investedTenure = parseFloat(this.navParams.get("data").Tenure)
    this.interestEarned = parseFloat(this.navParams.get("data").InterestEarned)
    this.AmountContributedToPPF =  parseFloat(this.navParams.get("data").AmountContributedToPPF)
    this.futureYears = this.investedTenure + new Date().getFullYear()
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
  //     //  $('.fixed-content').css('margin-top', hedaerheight);
  //     //  $('.scroll-content').css('margin-top', hedaerheight);
  //     }, 100);
  //   }

  // }

  ionViewDidLoad() {
    this.utilitiesProvider.googleAnalyticsTrackView('PPF Without');
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

    this.utilitiesProvider.upshotScreenView('PPFCalculatorFinal');
  }
  // temp(){
  //   console.log("Hello");
  // }
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
          name: this.utilitiesProvider.langJsonData['PPFCalculator']['totalInvestedAmount'],
          y: this.AmountContributedToPPF,
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
          name: this.utilitiesProvider.langJsonData['PPFCalculator']['totalInterestEarned'],
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
    this.selectedDrop = type;
    if (type == "amtInvested") {
      this.utilitiesProvider.rangeData = parseFloat(this.investedAmt);
      this.rangeDataUi = {
        "steps" : this.bigSteps,
        "amount": parseFloat(this.investedAmt),
        "min"   : parseFloat("1.0"),
        "max"   : parseFloat(this.utilitiesProvider.defaultCalData.data.amount.max),
        "title" : this.utilitiesProvider.langJsonData['PPFCalculator']['amountinvested'],
        "type"  : "r",
        "info"  : ""
      }
    }
    if (type == "tenure") {
      this.utilitiesProvider.rangeData = parseFloat(this.investedTenure);
      this.rangeDataUi = {
        "steps" : this.smallSteps,
        "amount": parseFloat(this.investedTenure),
        "min"   : parseInt(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.min),
        "max"   : parseInt(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.max),
        "title" :  this.utilitiesProvider.langJsonData['PPFCalculator']['tenure'],
        "type"  : "",
        "info"  : ""
      }
    }
  }
  done() {
    let rangeValue = parseFloat(this.utilitiesProvider.rangeData);
    if (rangeValue) {
      if (rangeValue < parseInt(this.rangeDataUi.min) || rangeValue > parseInt(this.rangeDataUi.max)) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterNumberBetween'] + this.rangeDataUi.min + this.utilitiesProvider.jsErrorMsg['to'] + this.rangeDataUi.max)
      }
      else {
        this.status = !this.status;
        if (this.selectedDrop == "amtInvested") {
          this.investedAmt = rangeValue;
        }
        if (this.selectedDrop == "tenure") {
          this.investedTenure = rangeValue;
        }
        this.CalculateFDValue();
      }
    }
  }


  CalculateFDValue() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "HasExistingBalance": false,
      "ExistingBalance": 0.0,
      "PrevInvestTenure": 0.0,
      "AmountInvested" : this.investedAmt,
      "Tenure": this.investedTenure,
      "RateOfReturn": this.rateOfReturn
    }
    // console.log("Request: " + JSON.stringify(request));
    return this.restapiProvider.sendRestApiRequest(request, 'GetPPFMaturityAmount')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          // console.log(response);
          this.corpusAccumlated   = parseFloat(response.Data.MaturityAmount)
          this.rateOfReturn = parseFloat(response.Data.RateOfReturn)
          this.investedAmt = parseFloat(response.Data.AmountInvested)
          this.AmountContributedToPPF = parseFloat(response.Data.AmountContributedToPPF)
          this.investedTenure = parseFloat(response.Data.Tenure)
          this.interestEarned = parseFloat(response.Data.InterestEarned)
          this.futureYears = this.investedTenure + new Date().getFullYear()
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

    this.navCtrl.setRoot('PpfWithAccPage');
  }
  //ScreenShot Code
  takeScreenshot() {
    this.utilitiesProvider.screenShotURI();

    this.utilitiesProvider.setUpshotShareEvent('Tool', 'PPF Caculator');
  }

  goToGoalsListing() {
    this.setUpshotEvent('Start Planning');
    this.navCtrl.setRoot('ListingScreenGoalPage', { pageFrom: 'PPF' })
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
      "PPFAccount": "No",
      "ExistingAmount": "",
      "ExistingDuration": "",
      "PlanToInvest": this.investedAmt,
      "DurationPPFAmt": this.investedTenure,
      "AmountIested": this.investedAmt,
      "InterestEarned": this.interestEarned,
      "ROR": this.rateOfReturn,
      "Action": action
    }
    console.log(payload)
    this.utilitiesProvider.upshotCustomEvent('PPFCalculator', payload, false);
  }
}
