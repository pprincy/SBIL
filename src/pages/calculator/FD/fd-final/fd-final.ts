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
  MenuController,
  ModalController
} from 'ionic-angular';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import * as HighCharts from 'highcharts';
import * as $ from 'jquery';
import {MyApp} from '../../../../app/app.component';
import { DropDowmSelctionPage } from '../../../../components/modals/drop-dowm-selction/drop-dowm-selction';


@IonicPage()
@Component({
  selector: 'page-fd-final',
  templateUrl: 'fd-final.html',
})
export class FdFinalPage {
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
  public bigSteps = 10000;
  public smallSteps = 1;
  public pageLoader : boolean = false;
  rangeDataUi: any = {};
  config: any;
  loading: any;
  public disclaimer : any = false;
  public modal;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public utilitiesProvider: UtilitiesProvider,
    private restapiProvider: RestapiProvider,
    private loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    public myApp : MyApp,
    public modalCtrl: ModalController) {
    // console.log("Navparams: ", this.navParams.get("data"))
    this.principalAmt   = parseFloat(this.navParams.get("data").Amount);
    this.interestEarned = this.navParams.get("data").InterestEarned
    this.interestRate   = this.navParams.get("data").InterestRate
    this.interestFreq   = this.navParams.get("data").InterestRateFrequency
    this.maturityValue  = this.navParams.get("data").MaturityValue
    this.tenure         = this.navParams.get("data").Tenure
    this.maturityYear   = parseInt(this.tenure) + new Date().getFullYear()
    this.tenureArr      = this.utilitiesProvider.langJsonData['fixedDepositCalculator']['interest_rate_frequency'];
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
    this.myApp.updatePageUseCount("16");
    this.utilitiesProvider.googleAnalyticsTrackView('Fixed Deposite');
    setTimeout(() => {

    this.chartLoad();
    },100)
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

   this.utilitiesProvider.upshotScreenView('FixedDepositFinal');
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
        data: [{
          name: this.utilitiesProvider.langJsonData['fixedDepositCalculator']['principalAmount'],
          // color: '#D60D47',
          y: this.principalAmt,
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
          y: this.interestEarned,
          z: 214.5
        }]
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
      this.utilitiesProvider.rangeData = parseFloat(this.interestRate);
      this.rangeDataUi = {
        "steps" : 1,
        "amount": parseFloat(this.interestRate),
        "min"   : parseFloat(this.utilitiesProvider.defaultCalData.data.interest_rate.min),
        "max"   : parseFloat(this.utilitiesProvider.defaultCalData.data.interest_rate.max),
        "title" : this.utilitiesProvider.langJsonData['fixedDepositCalculator']['rateOfinterest'],
        "type"  : "",
        "info"  : this.utilitiesProvider.infoPopupText[4].desc
      }
    }
    if (type == "principalAmt") {
      this.utilitiesProvider.rangeData = parseFloat(this.principalAmt);
      this.rangeDataUi = {
        "steps" : this.bigSteps,
        "amount": parseFloat(this.principalAmt),
        "min"   : parseFloat(this.utilitiesProvider.defaultCalData.data.amt.min),
        "max"   : parseFloat(this.utilitiesProvider.defaultCalData.data.amt.max),
        "title" : this.utilitiesProvider.langJsonData['fixedDepositCalculator']['amountInvested'],
        "type"  : "r",
        "info"  :  ""
      }
    }
    if (type == "tenure") {
      this.utilitiesProvider.rangeData = parseFloat(this.tenure);
      this.rangeDataUi = {
        "steps" : this.smallSteps,
        "amount": parseInt(this.tenure),
        "min"   : parseInt(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.min),
        "max"   : parseInt(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.max),
        "title" : this.utilitiesProvider.langJsonData['fixedDepositCalculator']['investmentDuration'],
        "type"  : "",
        "info"  :  ""
      }
    }
  }
  done() {
    let rangeValue = parseFloat(this.utilitiesProvider.rangeData);
    if (rangeValue) {
      if (rangeValue < parseInt(this.rangeDataUi.min) || rangeValue > parseInt(this.rangeDataUi.max)) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterNumberBetween'] + " " + this.rangeDataUi.min + " " + this.utilitiesProvider.jsErrorMsg['to'] + " " + this.rangeDataUi.max)
      }
      else {
        this.status = !this.status;
        $('.header').removeClass('headerOverlay');
        $('.scroll-content').removeClass('scrollOverlay');
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
    this.pageLoader = true;
    // let request = {"CurrentSaving":1500,"Liability":1000}
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "Amount": this.principalAmt,
      "Tenure": this.tenure,
      "InterestRate": this.interestRate,
      "InterestRateFrequency": this.interestFreq
    }
    // console.log("Request: " + JSON.stringify(request));
    return this.restapiProvider.sendRestApiRequest(request, 'GetFDValue')
      .subscribe((response) => {
        this.pageLoader = false
        if (response.IsSuccess == true) {
          // console.log(response);
          this.principalAmt   = parseFloat(response.Data.Amount)
          this.interestEarned = parseFloat(response.Data.InterestEarned)
          this.interestRate   = parseFloat(response.Data.InterestRate)
          this.interestFreq   = response.Data.InterestRateFrequency
          this.maturityValue  = parseFloat(response.Data.MaturityValue)
          this.tenure         = parseFloat(response.Data.Tenure)
          this.maturityYear   = parseInt(this.tenure) + new Date().getFullYear()
          this.chartLoad();
        }
        else {
          // console.log(response);
        }
      },
        (error) => {
          this.pageLoader = false
        })
  }
  recalculate() {
    // this.navCtrl.pop();
    this.setUpshotEvent('Recalculate');
    this.navCtrl.setRoot('FdpagePage');
  }
  //ScreenShot Code
  takeScreenshot() {
    this.utilitiesProvider.screenShotURI();

    this.utilitiesProvider.setUpshotShareEvent('Tool', 'FD Caculator');
  }

  goToGoalsListing() {
    this.setUpshotEvent('Start Planning');

    this.navCtrl.setRoot('ListingScreenGoalPage', { pageFrom: 'FD' })
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
      "DepositAmount": this.principalAmt,
      "Duration": this.tenure,
      "FrequencyofIR": this.tenureArr.filter(el=>el.id == this.interestFreq)[0]["name"],
      "MaturityCorpus": this.maturityValue,
      "AmountInvested": this.principalAmt,
      "InterestEarned": this.interestEarned,
      "RateofInterest": this.interestRate,
      "Action": action
    }
    console.log(payload)
    this.utilitiesProvider.upshotCustomEvent('FixedDeposit', payload, false);
  }

  async FDFreq(){
    let commonList = this.tenureArr.map(el => {
      const obj = {
        name: el.name,
        value: el.id
      };
      return obj;
    }
      
    );
    // console.log("country list", commonList);
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { commonList: commonList,
        selectOption: this.interestFreq },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
      this.interestFreq = data;
      
        // this.riskData.forEach(element => {
        //   if(element.ProfileID == data){
        //     this.riskProfile = element.Profiler_Name;
        //   }
        // });

        this.CalculateFDValue();
    })

  }
}
