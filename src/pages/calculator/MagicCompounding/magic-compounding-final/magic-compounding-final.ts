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

@IonicPage()
@Component({
  selector: 'page-magic-compounding-final',
  templateUrl: 'magic-compounding-final.html',
})
export class MagicCompoundingFinalPage {

  @ViewChild(Content) content: Content;
  public selectedDrop;
  public isBtnActive: boolean = false;
  public status: boolean = false;
  public pageLoader : boolean = false;

  public maturityAmt;
  public moreSavingsAmount;
  public excessSavings;
  public expectedRate;
  public incrSavingsRate;
  public tenure;
  public maturityYear;
  public savingsAmount;
  public minSavingsAmount;
  public maxSavingsAmount;

  public bigSteps = 1000;
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
    this.maturityAmt   = parseFloat(this.navParams.get("data").MaturityValue)
    this.moreSavingsAmount   = parseFloat(this.navParams.get("data").MaturityValueFor10PercMoreSaving)
    this.excessSavings   = parseFloat(this.navParams.get("data").ExcessSaving)
    this.expectedRate  = parseFloat(this.navParams.get("data").ExpectedRateOfReturn )
    this.incrSavingsRate =  parseFloat(this.navParams.get("data").IncrementalSavings)
    this.savingsAmount   = parseFloat(this.navParams.get("data").SavingsPerMonth)
    this.tenure = parseInt(this.navParams.get("data").Tenure);
    this.maturityYear  = parseInt(this.tenure) + new Date().getFullYear();
    this.minSavingsAmount = parseFloat(this.utilitiesProvider.defaultGoalData.data.mnthly_inv.min);
    this.maxSavingsAmount = parseFloat(this.utilitiesProvider.defaultGoalData.data.mnthly_inv.max);
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
    this.myApp.updatePageUseCount("19");
    this.utilitiesProvider.googleAnalyticsTrackView('Magic Of Compounding');
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

    this.utilitiesProvider.upshotScreenView('MagicofCompoundingFinal');
  }

  menuToggle() {
    this.menuCtrl.open();
  }

  chartLoad() {
    var that = this;
    var myChart = HighCharts.chart('compounding_chart', {
      chart: {
        type: 'column',
    },
    title: {
        text: ''
    },
    credits: {
      enabled: false
    },
    xAxis: {
      startOnTick: true,
        endOnTick: true,
        tickPosition: 'inside',
      labels: {
        style: {
          fontWeight: '700',
          color: '#2A2076',
          fontSize: '12px',
          fontFamily: 'Lato'

        }
    },
        categories: [this.utilitiesProvider.langJsonData['magicOfCompounding']['yourSavings'] + ' ' +this.utilitiesProvider.getRoundingFigure(this.savingsAmount) + ' ' + this.utilitiesProvider.commonLangMsg['pm'],
        this.utilitiesProvider.langJsonData['magicOfCompounding']['yourSavings'] + ' ' +this.utilitiesProvider.getRoundingFigure(this.savingsAmount+(0.1*this.savingsAmount)) + ' ' + this.utilitiesProvider.commonLangMsg['pm']],
      },
    yAxis: {
        min: 500,
        gridLineWidth:0,
        labels: {
          enabled: false
        },
        title: {
          text: null
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: '700',
                color: '#2A2076',
                fontSize: '12px'
            },
            formatter: function () {
              return "₹" + that.utilitiesProvider.getRoundingFigure(this.total);
            }
        }
    },
    
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        // pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
        formatter: function () {
          return this.series.name+': ' + that.utilitiesProvider.getRoundingFigure(this.y);
        }
    },
    plotOptions: {
        column: {
          // borderRadiusTopLeft: 5,
          // borderRadiusTopRight: 5,
            stacking: 'normal',
            borderWidth: 0
        },
        series: {
          pointWidth: 100
      },

    },
    legend:{
      enabled: false,
      legendColor: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
            [0, '#301F6C'],
            [1, '#D60D47']
        ]
    },
    },
    series: [{
      // enableMouseTracking: false,
        name: this.utilitiesProvider.langJsonData['magicOfCompounding']['monthlysavings'],
        data: [{y:0,
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 }, 
            stops: [[0, '#301F6C'], [1, '#D60D47']]}},
            {y:this.excessSavings,color:'#FFCC00'}]
      },
      {
        name: this.utilitiesProvider.langJsonData['magicOfCompounding']['excessAmount'],
        data: [{y:this.maturityAmt,
          color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
              [0, '#301F6C'],
              [1, '#D60D47'],
          ]
      }},{y:this.maturityAmt,
        color:{
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
            [0, '#301F6C'],
            [1, '#D60D47'],
            // [, '#FFCC00']
        ]
    }}]
      }]
    });
  }
  toggleClass(id) {
    $('#' + id).toggleClass('active')
  }
  showOverlay(type) {
    this.status = !this.status;
    $('.header').addClass('headerOverlay');
    $('.scroll-content').addClass('scrollOverlay');
    this.selectedDrop = type;
    if (type == "interestRate") {
      this.utilitiesProvider.rangeData = parseFloat(this.expectedRate);
      this.rangeDataUi = {
        "steps" : this.smallSteps,
        "amount": parseFloat(this.expectedRate),
        "min"   : parseFloat(this.utilitiesProvider.defaultGoalData.data.rate_of_return.min),
        "max"   : parseFloat(this.utilitiesProvider.defaultGoalData.data.rate_of_return.max),
        "title" : this.utilitiesProvider.langJsonData['magicOfCompounding']['rateOfreturn'],
        "type"  : "",
        "info"  : this.utilitiesProvider.infoPopupText[3].desc
      }
    }
    if (type == "incrSavingsRate") {
      this.utilitiesProvider.rangeData = parseFloat(this.incrSavingsRate);
      this.rangeDataUi = {
        "steps" : this.smallSteps,
        "amount": parseFloat(this.incrSavingsRate),
        "min"   : parseFloat(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.min),
        "max"   : parseFloat(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.max),
        "title" :this.utilitiesProvider.langJsonData['magicOfCompounding']['increasingsavingsRate'],
        "type"  : "",
        "info"  : this.utilitiesProvider.infoPopupText[1].desc
      }
    }
    if (type == "monthlySavings") {
      this.utilitiesProvider.rangeData = parseFloat(this.savingsAmount);
      this.rangeDataUi = {
        "steps" : this.bigSteps,
        "amount": parseFloat(this.savingsAmount),
        "min"   : parseFloat(this.utilitiesProvider.defaultGoalData.data.mnthly_inv.min),
        "max"   : parseFloat(this.utilitiesProvider.defaultGoalData.data.mnthly_inv.max),
        "title" : this.utilitiesProvider.langJsonData['magicOfCompounding']['monthlysavings'],
        "type"  : "r",
        "info"  : ""
      }
    }
    if (type == "tenure") {
      this.utilitiesProvider.rangeData = parseFloat(this.tenure);
      this.rangeDataUi = {
        "steps" : this.smallSteps,
        "amount": parseInt(this.tenure),
        "min"   : parseInt(this.utilitiesProvider.defaultGoalData.data.tenure_in_yr.min),
        "max"   : parseInt(this.utilitiesProvider.defaultGoalData.data.tenure_in_yr.max),
        "title" :this.utilitiesProvider.commonLangMsg['duration'],
        "type"  : "",
        "info"  : ""
      }
    }
  }

  done() {
    let rangeValue = parseFloat(this.utilitiesProvider.rangeData);
    // if (rangeValue) {
      if (rangeValue < parseInt(this.rangeDataUi.min) || rangeValue > parseInt(this.rangeDataUi.max)) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterNumberBetween'] + " " + this.rangeDataUi.min + this.utilitiesProvider.jsErrorMsg['to'] + this.rangeDataUi.max)
      }
      else {
        this.status = !this.status;
          
	     $('.header').removeClass('headerOverlay');
       $('.scroll-content').removeClass('scrollOverlay');
        if (this.selectedDrop == "interestRate") {
          this.expectedRate = rangeValue;
        }
        if (this.selectedDrop == "incrSavingsRate") {
          this.incrSavingsRate = rangeValue;
        }
        if (this.selectedDrop == "monthlySavings") {
          this.savingsAmount = rangeValue
        }
        if (this.selectedDrop == "tenure") {
          this.tenure = rangeValue
          this.maturityYear  = parseInt(this.tenure) + new Date().getFullYear();
        }
        this.CalculateEMIAmount();
      }
    // }
  }

  isAmount(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseNumbers']);
      return false;
    }
    return true;
  }

  CalculateEMIAmount() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "MonthlyInvestment":this.savingsAmount,
      "Tenure":this.tenure,
      "RateOfReturn":this.expectedRate,
      "IncrementalSavingsRate": this.incrSavingsRate
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetCompoundingValues')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          // console.log(response);
          this.maturityAmt   = parseFloat(response.Data.MaturityValue)
          this.moreSavingsAmount   = parseFloat(response.Data.MaturityValueFor10PercMoreSaving)
          this.excessSavings   = parseFloat(response.Data.ExcessSaving)
          this.expectedRate  = parseFloat(response.Data.ExpectedRateOfReturn)
          this.incrSavingsRate =  parseFloat(response.Data.IncrementalSavings)
          this.savingsAmount   = parseFloat(response.Data.SavingsPerMonth)
          this.tenure = parseInt(response.Data.Tenure);
          this.maturityYear  = parseInt(this.tenure) + new Date().getFullYear();
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
    this.navCtrl.setRoot('MagicCompoundingPage');
  }
  //ScreenShot Code
  takeScreenshot() {
    this.utilitiesProvider.screenShotURI();

    this.utilitiesProvider.setUpshotShareEvent('Tool', 'Magic Compounding Caculator');
  }

  goToGoalsListing() {
    this.setUpshotEvent('Start Planning');
    this.navCtrl.setRoot('ListingScreenGoalPage', { pageFrom: 'Magic of Compounding' })
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
      "Duration": this.tenure,
      "EstdMonthlySaving": this.savingsAmount,
      "MaturityValue": this.maturityAmt,
      "ROR": this.expectedRate,
      "ISR": this.incrSavingsRate,
      "Action": action
    }
    console.log(payload)
    this.utilitiesProvider.upshotCustomEvent('MagicOfCompounding', payload, false);
  }
}
