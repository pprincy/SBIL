import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, LoadingController, MenuController } from 'ionic-angular';
import * as HighCharts from 'highcharts';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { debounce } from 'ionic-angular/util/util';
import {MyApp} from '../../../../app/app.component';
@IonicPage()
@Component({
  selector: 'nps-final',
  templateUrl: 'nps-final.html',
})
export class NpsFinalPage {
  @ViewChild(Content) content: Content;
  public steps = 100;
  public amount;
  public minValue;
  public maxValue;
  public minPer;
  public maxPer;
  public amountPer;
  public isBtnActive: boolean = false;
  public pageLoader: boolean = false;
  public status: boolean = false;
  public finalValue: any = {};
  loading: any;
  timer: any;
  timerStart: boolean = false;
  rangeDataUi: any;
  toolTip;
  selectedDrop;
  retirementCorpusDate;
  public disclaimer : any = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    private loadingCtrl: LoadingController,
    public utilitiesProvider: UtilitiesProvider,
    public menuCtrl: MenuController,
    public myApp : MyApp) {

    this.finalValue = this.navParams.get("data");
    let retirementCorpusDateVar = new Date();
    let n = retirementCorpusDateVar.getFullYear();
    this.retirementCorpusDate = n + (this.finalValue.RetirementAge - this.finalValue.CurrentAge);
    this.minValue = parseInt(this.utilitiesProvider.defaultCalData.sliderConfig.monthly_contri_pa.min);
    this.maxValue = parseInt(this.utilitiesProvider.defaultCalData.sliderConfig.monthly_contri_pa.max);
    this.amount = this.finalValue.MonthlyContribution;
    this.ammunityFun();
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
  //    //   $('.scroll-content').css('margin-top', hedaerheight);
  //     }, 100);
  //   }

  // }

  			  
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

  ionViewDidLoad() {
    this.myApp.updatePageUseCount("13");
    this.loadChart();
    this.utilitiesProvider.googleAnalyticsTrackView('NPS');
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

    this.utilitiesProvider.upshotScreenView('NPSCalculatorFinal');
  }
  menuToggle() {
    this.menuCtrl.open();
  }
  
  loadChart() {
    this.toolTip = this.utilitiesProvider.getRoundingFigure(this.finalValue.InterestEarned);
    var tooltipval = this.toolTip;
    $('.toolTipValue').text(this.toolTip);
    
    var myChart = HighCharts.chart('networth_chart', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        type: 'pie',
        margin: [0, 0, 0, 0],
        spacing: [0, 0, 0, 0],
      },
      title: {
        text: "₹" + this.toolTip,
        align: 'center',
        verticalAlign: 'middle',
        y: -70,
        color: '#2A2076',
        style: {
          color: '#2A2076',
          fontFamily: 'Lato',
          fontWeight: '700',
          fontSize: '24px'
    
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
          borderColor: '#ffffff',
          borderRadius: '50%',
          allowPointSelect: false,
          cursor: 'pointer',
            dataLabels: {
                enabled: false,
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '35%'],
            // size: '90%'
        }
    },
      series: [{
        size: '60%',
        type: 'pie',
        innerSize: '80%',
        enableMouseTracking: false,
        data: [
           {
            name: 'Total  interest earned',
            // color: '#D60D47',
            y: this.finalValue.InterestEarned,
            z: 214.5,
            color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                  [0, '#301F6C'],
                  [1, '#D60D47']
              ]
          }
          },
          {
            name: 'Total investment',
            color: '#5C2483',
            y: this.finalValue.AmountInvested,
            z: 235.6
          },],
        point: {
          events: {
            click: function (e) {
              let val = e.point.y;
              var vals = [];
              if (typeof val === 'number') {
              }
              else {
                val = parseFloat(val);
              }
              if (val < 100 || isNaN(val)) {
                vals[0] = val;
                vals[1] = '';
                vals[2] = '';
              }
              else if (val < 100000) {
                vals[0] = val.toLocaleString('en-IN', { minimumFractionDigits: 0 });
                vals[1] = '';
                vals[2] = '';
              }
              else if (val < 10000000) {
                vals[0] = Math.round((val / 100000) * Math.pow(10, 2)) / Math.pow(10, 2);
                vals[1] = 'L';
                vals[2] = 'Lacs';
              }
              else {
                vals[0] = Math.round((val / 10000000) * Math.pow(10, 2)) / Math.pow(10, 2);
                vals[1] = 'Cr.';
                vals[2] = 'Cr';
              }
              // console.log(vals)
              // return vals[0] + " " + vals[2];

              // rounding(a, b) {
              //   if (b > 0)
              //       return Math.round(a * Math.pow(10, b)) / Math.pow(10, b);
              //   else
              //       return Math.round(Math.round(a * Math.pow(10, b)) / Math.pow(10, b));
              // }

              $('.toolTipValue').text(vals[0] + " " + vals[2]);
            }
          }
        }
      }]
    });
  }
  changePer() {
    if (this.timerStart) {
      clearTimeout(this.timer);
    }
    this.GetNPS();
  }
  toggleClass(id) {
    $('#' + id).toggleClass('active')
  }


  showOverlay(type) {
    this.selectedDrop = type;
    this.status = !this.status;
    $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    if (this.selectedDrop == "monthlyContribution") {
      this.utilitiesProvider.rangeData = parseFloat(this.finalValue.MonthlyContribution);
      this.rangeDataUi = {
        "steps": this.steps,
        "amount": this.finalValue.MonthlyContribution,
        "min": this.minValue,
        "max": this.maxValue,
        "title": this.utilitiesProvider.langJsonData['NPSCalculator']['monthlyContribution'],
        "type": "r",
        "info" : ""
      }
    }
    if (this.selectedDrop == "rateOfReturn") {
      this.utilitiesProvider.rangeData = parseFloat(this.finalValue.ExpectedReturnsInPerc);
      this.rangeDataUi = {
        "steps": 1,
        "amount": this.finalValue.ExpectedReturnsInPerc,
        "min": parseInt(this.utilitiesProvider.defaultCalData.data.rateofinterest.min),
        "max": parseInt(this.utilitiesProvider.defaultCalData.data.rateofinterest.max),
        "title":this.utilitiesProvider.langJsonData['NPSCalculator']['expectedRateOfReturn'],
        "type": "",
        "info" : this.utilitiesProvider.infoPopupText[3].desc
      }
    }
    if (this.selectedDrop == "ageRetirement") {
      this.utilitiesProvider.rangeData = parseFloat(this.finalValue.RetirementAge);
      this.rangeDataUi = {
        "steps": 1,
        "amount": this.finalValue.RetirementAge,
        "min": parseInt(this.utilitiesProvider.defaultCalData.sliderConfig.retirement_age.min),
        "max": parseInt(this.utilitiesProvider.defaultCalData.sliderConfig.retirement_age.max),
        "title": this.utilitiesProvider.langJsonData['familyProtection']['retirementAge'],
        "type": "",
        "info" : ""
      }
    }
    if (this.selectedDrop == "incrementalSavaing") {
      this.utilitiesProvider.rangeData = parseFloat(this.finalValue.IncrementalSavingsRate);
      this.rangeDataUi = {
        "steps": 1,
        "amount": this.finalValue.IncrementalSavingsRate,
        "min": parseInt(this.utilitiesProvider.defaultCalData.data.incr_saving_rate.min),
        "max": parseInt(this.utilitiesProvider.defaultCalData.data.incr_saving_rate.max),
        "title": this.utilitiesProvider.langJsonData['NPSCalculator']['increasingSavingsRate'],
        "type": "",
        "info" :this.utilitiesProvider.infoPopupText[1].desc
      }
    }
  }
  done() {
    let d = parseFloat(this.utilitiesProvider.rangeData);
     if (d) {
    if (d < parseFloat(this.rangeDataUi.min) || d > parseFloat(this.rangeDataUi.max)) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterNumberBetween'] + this.rangeDataUi.min + " " +  this.utilitiesProvider.jsErrorMsg['to'] + " " + this.rangeDataUi.max)
    }
    else {
      if (this.selectedDrop == "monthlyContribution") {
        this.status = !this.status;
        $('.header').removeClass('headerOverlay');
        $('.scroll-content').removeClass('scrollOverlay');
        this.finalValue.MonthlyContribution = this.utilitiesProvider.rangeData;
        this.GetNPS();
      }
      if (this.selectedDrop == "rateOfReturn") {
        this.status = !this.status;
        $('.header').removeClass('headerOverlay');
        $('.scroll-content').removeClass('scrollOverlay');
        this.finalValue.ExpectedReturnsInPerc = this.utilitiesProvider.rangeData;
        this.GetNPS();
      }
      if (this.selectedDrop == "ageRetirement") {
        if (this.utilitiesProvider.rangeData < this.finalValue.CurrentAge) {
          this.restapiProvider.presentToastTop("Age today has to be less than age at retirement");
        }
        else {
          this.status = !this.status;
          $('.header').removeClass('headerOverlay');
          $('.scroll-content').removeClass('scrollOverlay');
          this.finalValue.RetirementAge = parseInt(this.utilitiesProvider.rangeData);
          if (this.finalValue.RetirementAge < 60) {

            if (this.amountPer < 80) {
              this.amountPer = 80;
            }
            if (this.amountPer > 80) {
              this.amountPer = 40;
            }
          }
          else {
            if (parseInt(this.finalValue.CurrentAge) > 60) {
              if ((parseInt(this.finalValue.RetirementAge) - parseInt(this.finalValue.CurrentAge)) < 3) {
                if (this.amountPer < 80) {
                  this.amountPer = 80;
                }
              }
            }
          }
          this.GetNPS();
        }
      }
      if (this.selectedDrop == "incrementalSavaing") {
        this.status = !this.status;
        $('.header').removeClass('headerOverlay');
        $('.scroll-content').removeClass('scrollOverlay');
        this.finalValue.IncrementalSavingsRate = this.utilitiesProvider.rangeData;
        this.GetNPS();
      }
    }
     }
  }
  GetNPS() {
    this.pageLoader = true;
    this.timerStart = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "CurrentAge": parseInt(this.finalValue.CurrentAge),
      "RetirementAge": parseInt(this.finalValue.RetirementAge),
      "MonthlyContri": parseFloat(this.finalValue.MonthlyContribution),
      "PercPensionReinvestedInAnnuity": parseFloat(this.amountPer),
      "RateOfInterest": parseFloat(this.finalValue.ExpectedReturnsInPerc),
      "IncrementalSavingsRate": parseFloat(this.finalValue.IncrementalSavingsRate),
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetNPSValues')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          this.finalValue = response.Data;
          this.ammunityFun();
          // console.log(this.finalValue);
          this.loadChart();
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
    this.setUpshotEvent('Recalculate');
    this.navCtrl.setRoot('NpsPage');
  }

  takeScreenshot() {
    this.utilitiesProvider.screenShotURI();

    this.utilitiesProvider.setUpshotShareEvent('Tool', 'NPS Caculator');
  }
  ammunityFun() {
    if (this.finalValue.RetirementAge < 60) {
      this.minPer = 80;
      this.maxPer = 100;
      this.amountPer = parseInt(this.finalValue.PensionWealthReinvestedInAnnuityInPerc);
    }
    else {
      if (parseInt(this.finalValue.CurrentAge) > 60) {
        if ((parseInt(this.finalValue.RetirementAge) - parseInt(this.finalValue.CurrentAge)) < 3) {
          this.minPer = 80;
          this.maxPer = 100;
          this.amountPer = parseInt(this.finalValue.PensionWealthReinvestedInAnnuityInPerc);
        }
        else {
          this.minPer = parseInt(this.utilitiesProvider.defaultCalData.data.percpensionreinvestedinannuity.min);
          this.maxPer = parseInt(this.utilitiesProvider.defaultCalData.data.percpensionreinvestedinannuity.max);
          this.amountPer = parseInt(this.finalValue.PensionWealthReinvestedInAnnuityInPerc);
        }
      }
      else {
        this.minPer = parseInt(this.utilitiesProvider.defaultCalData.data.percpensionreinvestedinannuity.min);
        this.maxPer = parseInt(this.utilitiesProvider.defaultCalData.data.percpensionreinvestedinannuity.max);
        this.amountPer = parseInt(this.finalValue.PensionWealthReinvestedInAnnuityInPerc);
      }
    }
  }

  goToGoalsListing() {
    this.setUpshotEvent('Start Planing');

    this.navCtrl.setRoot('ListingScreenGoalPage', { pageFrom: 'NPS' })
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
      "RetirementAge": this.finalValue.RetirementAge,
      "CurrentAge":  this.finalValue.CurrentAge,
      "MonthlyContribution": this.finalValue.MonthlyContribution,
      "RetirementCorpus": this.finalValue.PensionWealthCreated,
      "MonthlyPension": this.finalValue.PensionPerMonthAfetrRetirement,
      "AmountWithdrawn": this.finalValue.LumpsumWithdrawn,
      "Action": action
    }
    // console.log(payload)
    this.utilitiesProvider.upshotCustomEvent('NPSCalculator', payload, false);
  }
}
