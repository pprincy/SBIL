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
  selector: 'page-ep-fwithout-balfinal',
  templateUrl: 'ep-fwithout-balfinal.html',
})
export class EpFwithoutBalfinalPage {

  @ViewChild(Content) content: Content;
  public selectedDrop;
  public isBtnActive: boolean = false;
  public status: boolean = false;

  public principalAmt;
  public interestEarned;
  public interestRate;
  public interestFreq;
  public maturityValue;
  public tenure;
  public maturityYear;
  public tenureArr: any = [];
  public bigSteps = 100;
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
    this.principalAmt   = this.navParams.get("data").Amount
    this.interestEarned = this.navParams.get("data").InterestEarned
    this.interestRate   = this.navParams.get("data").InterestRate
    this.interestFreq   = this.navParams.get("data").InterestRateFrequency
    this.maturityValue  = this.navParams.get("data").MaturityValue
    this.tenure         = this.navParams.get("data").Tenure
    this.maturityYear   = parseInt(this.tenure) + new Date().getFullYear()
    this.tenureArr      = this.utilitiesProvider.defaultCalData.data.interest_rate_frequency;
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
  //     // $('.fixed-content').css('margin-top', hedaerheight);
  //     //  $('.scroll-content').css('margin-top', hedaerheight);
  //     }, 100);
  //   }
  // }
  
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("20");
    this.utilitiesProvider.googleAnalyticsTrackView('EPF');
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
        width: 200,
        height: 200
      },
      title: {
        text: ''
      },
      tooltip: {
        headerFormat: '',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name} : </b>{point.y}'
      },
      credits: {
        enabled: false
      },
      //  tooltip: {
      //   enabled: true
      // },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          }
        }
      },
      series: [{
        zMin: 0,
        name: '',
        data: [{
          name: 'Principal Amount',
          color: '#489ee7',
          y: this.principalAmt,
          z: 214.5
        }, {
          name: 'Interest Earned',
          color: '#f2932d',
          y: this.interestEarned,
          z: 235.6
        }]
      }]
    });
  }
  toggleClass(id) {
    $('#' + id).toggleClass('active')
  }
  showOverlay(type) {
    this.status = !this.status;
    this.selectedDrop = type;
    if (type == "interestRate") {
      this.rangeDataUi = {
        "steps" : 1,
        "amount": parseFloat(this.interestRate),
        "min"   : parseFloat(this.utilitiesProvider.defaultCalData.data.interest_rate.min),
        "max"   : parseFloat(this.utilitiesProvider.defaultCalData.data.interest_rate.max),
        "title" : "Interest Rate"
      }
    }
    if (type == "principalAmt") {
      this.rangeDataUi = {
        "steps" : this.bigSteps,
        "amount": parseFloat(this.principalAmt),
        "min"   : parseFloat(this.utilitiesProvider.defaultCalData.data.amt.min),
        "max"   : parseFloat(this.utilitiesProvider.defaultCalData.data.amt.max),
        "title" : "Principal Amount"
      }
    }
    if (type == "tenure") {
      this.rangeDataUi = {
        "steps" : this.smallSteps,
        "amount": parseInt(this.tenure),
        "min"   : parseInt(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.min),
        "max"   : parseInt(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.max),
        "title" : "Tenure"
      }
    }
  }
  done() {
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
        if (this.selectedDrop == "principalAmt") {
          this.principalAmt = rangeValue;
        }
        if (this.selectedDrop == "tenure") {
          this.tenure = rangeValue;
        }
        this.CalculateFDValue();
      }
    }
  }


  CalculateFDValue() {
    this.loaderShow();
    // let request = {"CurrentSaving":1500,"Liability":1000}
    let request = {
      "CustID": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "Amount": this.principalAmt,
      "Tenure": this.tenure,
      "InterestRate": this.interestRate,
      "InterestRateFrequency": this.interestFreq
    }
    // console.log("Request: " + JSON.stringify(request));
    return this.restapiProvider.sendRestApiRequest(request, 'GetFDValue')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          // console.log(response);
          this.loading.dismiss();
          this.principalAmt   = response.Data.Amount
          this.interestEarned = response.Data.InterestEarned
          this.interestRate   = response.Data.InterestRate
          this.interestFreq   = response.Data.InterestRateFrequency
          this.maturityValue  = response.Data.MaturityValue
          this.tenure         = response.Data.Tenure
          this.maturityYear   = parseInt(this.tenure) + new Date().getFullYear()
          this.chartLoad();
        }
        else {
          this.loading.dismiss();
          // console.log(response);
        }
      },
        (error) => {
          this.loading.dismiss();
        })
  }
  loaderShow() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
  recalculate() {
    // this.navCtrl.pop();
    this.navCtrl.setRoot('EpFwithoutBalPage');
  }
  //ScreenShot Code
  takeScreenshot() {
    this.utilitiesProvider.screenShotURI();
  }
  goNotificationList(){
    this.navCtrl.push('NotificationPage');
  }
}
