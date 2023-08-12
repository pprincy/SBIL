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
import { MyApp } from '../../../../app/app.component';

@IonicPage()
@Component({
  selector: 'ppf-with-acc-final',
  templateUrl: 'ppf-with-acc-final.html',
})
export class PpfWithAccFinalPage {

  @ViewChild(Content) content: Content;
  public selectedDrop;
  public isBtnActive: boolean = false;
  public status: boolean = false;
  public pageLoader: boolean = false;

  public corpusAccumlated;
  public rateOfReturn;
  public existingPPFAmt;
  public existingPPFTenure;
  public investedAmt;
  public investedTenure;
  public maturityAmtNew;
  public interestEarned;
  public amtContribPPF;
  public futureYears;
  public futureValOfCurrBal;

  // public principalAmt;
  // public interestEarned;
  // public interestRate;
  // public interestFreq;
  // public maturityValue;
  // public tenure;
  // public maturityYear;
  // public tenureArr: any = [];
  public bigSteps = 100;
  public smallSteps = 1;
  rangeDataUi: any = {};
  config: any;
  loading: any;
  public disclaimer: any = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public utilitiesProvider: UtilitiesProvider,
    private restapiProvider: RestapiProvider,
    private loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    public myApp: MyApp) {
    // console.log("Navparams: ", this.navParams.get("data"))
    this.corpusAccumlated = parseFloat(this.navParams.get("data").FinalMaturityAmount)
    this.rateOfReturn = parseFloat(this.navParams.get("data").RateOfReturn)
    this.existingPPFAmt = parseFloat(this.navParams.get("data").ExistingBalance)
    this.existingPPFTenure = parseFloat(this.navParams.get("data").PrevInvestTenure)
    this.investedAmt = parseFloat(this.navParams.get("data").AmountInvested)
    this.investedTenure = parseFloat(this.navParams.get("data").Tenure)
    this.maturityAmtNew = parseFloat(this.navParams.get("data").MaturityAmountNewInv)
    this.interestEarned = parseFloat(this.navParams.get("data").InterestEarned)
    this.amtContribPPF = parseFloat(this.navParams.get("data").AmountContributedToPPF)
    this.futureValOfCurrBal = parseFloat(this.navParams.get("data").FutureValueOfCurrentBalance)
    this.futureYears = this.investedTenure + new Date().getFullYear()
  }
  disclaimerInfo() {
    this.disclaimer = !this.disclaimer;
    if (this.disclaimer == true) {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
  }

  disclaimerClose() {
    this.disclaimer = !this.disclaimer;

    if (this.disclaimer == false) {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
    }
  }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("21");
    this.utilitiesProvider.googleAnalyticsTrackView('PPF With');
    this.chartLoad();
    // this.scrollToTop();
    // this.content.ionScroll.subscribe((data) => {
    //   if (data) {
    //     this.top = data.scrollTop;
    //     this.cssCahnge();
    //   }
    // });

    // this.content.ionScrollStart.subscribe((data) => {
    //   if (data) {
    //     this.top = data.scrollTop;
    //     this.cssCahnge();
    //   }
    // });
    // $(function (H) {
    //   H.wrap(H.Legend.prototype, 'colorizeItem', function (proceed, item, visible) {
    //     item.legendColor = item.options.legendColor;
    //       proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    //   });
    // }(HighCharts));

    this.utilitiesProvider.upshotScreenView('PPFCalculatorFinal');
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


  menuToggle() {
    this.menuCtrl.open();
  }

  chartLoad() {
    var that = this;
    var myChart = HighCharts.chart('ppf_chart', {
      chart: {
        type: 'column',
        events: {
          load: function () {
            var xAxis = this.xAxis[0],
            key, tick;
            for (key in xAxis.ticks) {
              tick = xAxis.ticks[key];

              if(!(tick.pos==3 || tick.pos==-1))
              tick.mark.attr({ stroke: 'transparent' });
            }
          }
        }
      },
      legend: {
        enabled: false
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
          enabled: false
        },
      },
      yAxis: {
        // min: 500,
        gridLineWidth: 0,
        labels: {
          enabled: false
        },
        title: {
          text: null
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
          },
          formatter: function () {
            return '<span class="rs_icon">`</span> ' + that.utilitiesProvider.getRoundingFigure(this.total);
          }
        }
      },

      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        // pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
        formatter: function () {
          return this.series.name + ': ' + that.utilitiesProvider.getRoundingFigure(this.y);
        }
      },
      plotOptions: {
        column: {
          borderWidth: 0,
          stacking: 'normal',
          events: {
            legendItemClick: function () {
              return false;
            }
          }
        },
        allowPointSelect: false,
      },
      series: [
        {
        legendColor: 'red',
        name: this.utilitiesProvider.langJsonData['PPFCalculator']['interestEarned'],
        data: [{ y: this.interestEarned, color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, '#301F6C'],
                    [1, '#D60D47']
                ]
            }
          },
          { y: 0, color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                  [0, '#301F6C'],
                  [1, '#D60D47']
              ]
          }
        }, { y: this.interestEarned, color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
                [0, '#301F6C'],
                [1, '#D60D47']
            ]
        }
      }
    ]
      },
      {
        legendColor: 'blue',
        name: this.utilitiesProvider.langJsonData['PPFCalculator']['amountinvested'],
        data: [{ y: this.amtContribPPF,color: '#2A2076'}, { y: 0, color: '#2A2076' }, { y: this.amtContribPPF, color: '#2A2076' }]
      },
      {
        legendColor: 'yellow',
        name: this.utilitiesProvider.langJsonData['PPFCalculator']['futureValueOfExistingbalance'],
        data: [{ y: 0, color: '#F57721' }, { y: this.futureValOfCurrBal, color: '#F57721' }, { y: this.futureValOfCurrBal, color: '#F57721' }]
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
    if (type == "existingBalance") {
      this.utilitiesProvider.rangeData = parseFloat(this.existingPPFAmt);
      this.rangeDataUi = {
        "steps": this.bigSteps,
        "amount": parseFloat(this.existingPPFAmt),
        "min": parseFloat(this.utilitiesProvider.defaultCalData.data.amount.min),
        "max": parseFloat(this.utilitiesProvider.defaultCalData.data.amount.max),
        "title": this.utilitiesProvider.langJsonData['PPFCalculator']['existingBalance'],
        "type": "r",
        "info": ""
      }
    }
    if (type == "tenureOfExistBal") {
      this.utilitiesProvider.rangeData = parseFloat(this.existingPPFTenure);
      this.rangeDataUi = {
        "steps": this.smallSteps,
        "amount": parseInt(this.existingPPFTenure),
        "min": parseInt(this.utilitiesProvider.defaultCalData.data.tenure_prev_inv.min),
        "max": parseInt(this.utilitiesProvider.defaultCalData.data.tenure_prev_inv.max),
        "title": this.utilitiesProvider.langJsonData['PPFCalculator']['tenureOfExistingBalance'],
        "type": "",
        "info": ""
      }
    }
    if (type == "amtInvested") {
      this.utilitiesProvider.rangeData = parseFloat(this.investedAmt);
      this.rangeDataUi = {
        "steps": this.bigSteps,
        "amount": parseFloat(this.investedAmt),
        "min": parseFloat("1.0"),
        "max": parseFloat(this.utilitiesProvider.defaultCalData.data.amount.max),
        "title": this.utilitiesProvider.langJsonData['PPFCalculator']['amountinvested'],
        "type": "r",
        "info": ""
      }
    }
    if (type == "tenure") {
      this.utilitiesProvider.rangeData = parseFloat(this.investedTenure);
      this.rangeDataUi = {
        "steps": this.smallSteps,
        "amount": parseFloat(this.investedTenure),
        "min": parseInt(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.min),
        "max": parseInt(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.max),
        "title": this.utilitiesProvider.langJsonData['PPFCalculator']['tenure'],
        "type": "",
        "info": ""
      }
    }
  }
  done() {
    let rangeValue = parseFloat(this.utilitiesProvider.rangeData);
    if (rangeValue) {
      if (rangeValue < parseFloat(this.rangeDataUi.min) || rangeValue > parseFloat(this.rangeDataUi.max)) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterNumberBetween'] + " " + this.rangeDataUi.min + this.utilitiesProvider.jsErrorMsg['to'] + this.rangeDataUi.max)
      }
      else {
        this.status = !this.status;
        $('.header').removeClass('headerOverlay');
        $('.scroll-content').removeClass('scrollOverlay');
        if (this.selectedDrop == "existingBalance") {
          this.existingPPFAmt = rangeValue;
        }
        if (this.selectedDrop == "tenureOfExistBal") {
          this.existingPPFTenure = rangeValue;
        }
        if (this.selectedDrop == "amtInvested") {
          this.investedAmt = rangeValue;
        }
        if (this.selectedDrop == "tenure") {
          this.investedTenure = rangeValue;
        }
        this.GetPPFMaturityAmount();
      }
    }
  }


  GetPPFMaturityAmount() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "HasExistingBalance": true,
      "ExistingBalance": this.existingPPFAmt,
      "PrevInvestTenure": this.existingPPFTenure,
      "AmountInvested": this.investedAmt,
      "Tenure": this.investedTenure,
      "RateOfReturn": this.rateOfReturn
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetPPFMaturityAmount')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          // console.log(response);
          this.corpusAccumlated = parseFloat(response.Data.FinalMaturityAmount)
          this.rateOfReturn = parseFloat(response.Data.RateOfReturn)
          this.existingPPFAmt = parseFloat(response.Data.ExistingBalance)
          this.existingPPFTenure = parseFloat(response.Data.PrevInvestTenure)
          this.investedAmt = parseFloat(response.Data.AmountInvested)
          this.investedTenure = parseFloat(response.Data.Tenure)
          this.maturityAmtNew = parseFloat(response.Data.MaturityAmountNewInv)
          this.interestEarned = parseFloat(response.Data.InterestEarned)
          this.amtContribPPF = parseFloat(response.Data.AmountContributedToPPF)
          this.futureValOfCurrBal = parseFloat(response.Data.FutureValueOfCurrentBalance)
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


  goNotificationList() {
    this.navCtrl.push('NotificationPage');
  }

  setUpshotEvent(action) {
    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "DrivenFrom": this.navParams.get('pageFrom') || '',
      "PPFAccount": "Yes",
      "ExistingAmount": this.existingPPFAmt,
      "ExistingDuration": this.existingPPFTenure,
      "PlanToInvest": this.investedAmt,
      "DurationPPFAmt": this.investedTenure,
      "AmountInvested": this.investedAmt,
      "InterestEarned": this.interestEarned,
      "ROR": this.rateOfReturn,
      "Action": action
    }
    console.log(payload)
    this.utilitiesProvider.upshotCustomEvent('PPFCalculator', payload, false);
  }
}
