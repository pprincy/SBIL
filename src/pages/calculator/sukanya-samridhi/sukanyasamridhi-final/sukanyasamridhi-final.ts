import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, LoadingController, MenuController } from 'ionic-angular';
import * as HighCharts from 'highcharts';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import {MyApp} from '../../../../app/app.component';
import { DecimalPipe } from '@angular/common';
@IonicPage()
@Component({
  selector: 'page-sukanyasamridhi-final',
  templateUrl: 'sukanyasamridhi-final.html',
})
export class SukanyasamridhiFinalPage {
  @ViewChild(Content) content: Content;
  public steps = 100;
  public amountD1;
  public amountD2;
  public amountD1Comma;
  public amountD2Comma;
  public minValue;
  public maxValue;
  public isBtnActive: boolean = false;
  public status: boolean = false;
  public pageLoader : boolean = false;
  public Daughter1: any = {};
  public Daughter2: any = {};
  public disclaimer : any = false;
  paramsData: any;
  loading: any;
  timerStart: boolean = false;
  timer: any;
  graphData: any = {};
  pagerHide: boolean = false;
  selectedDrop; public rangeDataUi: any = {};
  public headerYear;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public utilitiesProvider: UtilitiesProvider,
    private restapiProvider: RestapiProvider,
    private loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    private numberPipe: DecimalPipe,
    public myApp : MyApp) {
    this.paramsData = this.navParams.get('data');
    // console.log(this.paramsData)
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

  ionViewDidLeave(){
    localStorage.removeItem("temp")
  }

  ionViewDidLoad() {
    this.myApp.updatePageUseCount("14");
    this.utilitiesProvider.googleAnalyticsTrackView('Sukannya Samridhi');
    // this.scrollToTop();
    this.yearCal();
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


    // console.log(this.utilitiesProvider.defaultCalData)
    this.loadData();
    $('.swiper-pagination-bullet').hide();

   this.utilitiesProvider.upshotScreenView('SukanyaSamriddhiFInal');
  }

  menuToggle() {
    this.menuCtrl.open();
  }
  loadData() {
    this.minValue = parseInt(this.utilitiesProvider.defaultCalData.data.investmentamount_pm.min);
    this.maxValue = parseInt(this.utilitiesProvider.defaultCalData.data.investmentamount_pm.max);
    this.Daughter1 = this.paramsData.result.Daughter1;
    this.Daughter2 = this.paramsData.result.Daughter2;
    this.amountD1 = parseFloat(this.paramsData.result.Daughter1.AmountInvestedPerMnth);
    this.amountD1Comma = "₹" + (this.numberPipe.transform(this.amountD1.toString().replaceAll(",","")));
    if (this.Daughter2) {
      $('.swiper-pagination-bullet').show();
      this.pagerHide = true;
      this.amountD2 = parseFloat(this.paramsData.result.Daughter2.AmountInvestedPerMnth);
      this.amountD2Comma = "₹" + (this.numberPipe.transform(this.amountD2.toString().replaceAll(",","")));
      this.graphData = {
        "d1": [parseInt(this.Daughter1.MaturityAmt), parseInt(this.Daughter2.MaturityAmt)],
        "gColor": ["#2A2076", "#27AE60"]
      }
    }
    else {
      $('.swiper-pagination-bullet').hide();
      this.pagerHide = false;
      this.graphData = {
        "d1": [parseInt(this.Daughter1.TotalInvestment), parseInt(this.Daughter1.InterestEarned)],
        "gColor": ["#27AE60", "#2A2076"]
      }
    }
    // console.log(this.graphData)
    var myChart = HighCharts.chart('networth_chart', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        margin: [0, 0, 0, 0],
        spacingTop: 0,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0,
        width: 250,
        height: 200
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      plotOptions: {
        pie: {
          size: '100%',
          shadow: false,
          dataLabels: {
            enabled: true,
            connectorWidth: 0,
            format: '{point.percentage:.1f}%',
          },
          states: {
            hover: {
              halo: {
                size: 0,
              }
            }
          }
        }
      },
      series: [{
        type: 'pie',
        name: '',
        innerSize: '80%',
        data: [{
          // name: this.graphData.d1[2],
          color: this.graphData.gColor[0],
          y: this.graphData.d1[1],
          z: 214.5,
          dataLabels: {
            distance: -45,
            color: this.graphData.gColor[0],
          }
        }, {
          // name: this.graphData.d1[3],
          color: this.graphData.gColor[1],
          y: this.graphData.d1[0],
          z: 235.6,
          dataLabels: {
            distance: -45,
            color: this.graphData.gColor[1],
          }
        }]
      },
      {
        type: "pie",
        name: "OuterBorder",
        size: "100%",
        innerSize: "98%",
        animation: false,
        showInLegend: false,
        data: [
          {
            name: "",
            y: 1,
            color: "#5C2483",
          },
        ],
      },
      {
        type: "pie",
        name: "InnerBorder",
        size: "76%",
        innerSize: "98%",
        animation: false,
        showInLegend: false,
        data: [
          {
            name: "",
            y: 1,
            color: "#5C2483",
          },
        ],
      },
    
    ]
    });
    if (this.Daughter2) {
      var myChart1 = HighCharts.chart('sukanya_chart', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false,
          margin: [0, 0, 0, 0],
          spacingTop: 0,
          spacingBottom: 0,
          spacingLeft: 0,
          spacingRight: 0,
          width: 250,
          height: 200
        },
        title: {
          text: ''
        },
        credits: {
          enabled: false
        },
        tooltip: {
          enabled: false
        },
        plotOptions: {
          pie: {
            size: '100%',
            shadow: false,
            borderColor: '#ffffff',
            borderRadius: '50%',
            dataLabels: {
              enabled: true,
              connectorWidth: 0,
              format: '{point.percentage:.1f}%',
            },
            states: {
              hover: {
                halo: {
                  size: 0,
                }
              }
            }
          }
        },
        series: [{
          type: 'pie',
        name: '',
        innerSize: '80%',
          data: [{
            // name: this.graphData.d1[2],
            color: '#27AE60',
            y: this.graphData.d1[1],
            z: 214.5,
            dataLabels: {
              distance: -45,
              color: '#27AE60'
            }
          }, {
            // name: this.graphData.d1[1],
            color: '#2A2076',
            y: this.graphData.d1[0],
            z: 235.6,
            dataLabels: {
              distance: -45,
              color: '#2A2076'
            }
          }]
        },
        {
          type: "pie",
          name: "OuterBorder",
          size: "100%",
          innerSize: "98%",
          animation: false,
          showInLegend: false,
          data: [
            {
              name: "",
              y: 1,
              color: "#5C2483",
            },
          ],
        },
        {
          type: "pie",
          name: "InnerBorder",
          size: "76%",
          innerSize: "98%",
          animation: false,
          showInLegend: false,
          data: [
            {
              name: "",
              y: 1,
              color: "#5C2483",
            },
          ],
        },
      ]
      });
    }
    else {
      setTimeout(() => {
        $('.swiper-pagination-bullet').hide();
      }, 1000);
    }
  }

  doSomethingD1(e, type) {
    // if (this.timerStart) {
    //   clearTimeout(this.timer);
    // }
    if (this.amountD1 >= (this.maxValue / 3) && this.amountD1 <= (this.maxValue / 2)) {
      this.steps = 1000;
      // console.log("steps 1000 --" + this.amountD1)
    }
    else if (this.amountD1 >= (this.maxValue / 2)) {
      this.steps = 2000;
      // console.log("steps 2000 --" + this.amountD1)
    }
    else {
      // console.log("steps 100 --" + this.amountD1)
    }
    // this.getSukanyaSamridhi();
    if(type == 'range') {
      this.amountD1Comma = "₹" + (this.numberPipe.transform(this.amountD1.toString().replaceAll(",","")));
      this.amountD2Comma = "₹" + (this.numberPipe.transform(this.amountD2.toString().replaceAll(",","")));
    }
  }
  doSomethingD2(e, type) {
    // if (this.timerStart) {
    //   clearTimeout(this.timer);
    // }
    if (this.amountD2 >= (this.maxValue / 3) && this.amountD2 <= (this.maxValue / 2)) {
      this.steps = 1000;
      // console.log("steps 1000 --" + this.amountD2)
    }
    else if (this.amountD2 >= (this.maxValue / 2)) {
      this.steps = 2000;
      // console.log("steps 2000 --" + this.amountD2)
    }
    else {
      // console.log("steps 100 --" + this.amountD2)
    }
    // this.getSukanyaSamridhi();
    if(type == 'range') {
      this.amountD1Comma = "₹" + (this.numberPipe.transform(this.amountD1.toString().replaceAll(",","")));
      this.amountD2Comma = "₹" + (this.numberPipe.transform(this.amountD2.toString().replaceAll(",","")));
    }
  }
  toggleClass(id) {
    $('#' + id).toggleClass('active')
  }

  showOverlay(type) {
    this.selectedDrop = type;
    this.status = !this.status;
    $('.header').addClass('headerOverlay');
    $('.scroll-content').addClass('scrollOverlay');
    let minAge = parseInt(this.utilitiesProvider.defaultCalData.sliderConfig.age_of_child.min);
    let maxAge = parseInt(this.utilitiesProvider.defaultCalData.sliderConfig.age_of_child.max);
    //maturityperiod
    if (this.selectedDrop == "Daughter1") {
      this.utilitiesProvider.rangeData = parseFloat(this.paramsData.result.InvestmentPeriod);
      this.rangeDataUi = {
        "steps": 1,
        "amount": this.paramsData.result.InvestmentPeriod,
        "min": parseInt(this.utilitiesProvider.defaultCalData.data.maturityperiod.min),
        "max": parseInt(this.utilitiesProvider.defaultCalData.data.maturityperiod.max),
        "title": this.utilitiesProvider.commonLangMsg['duration'],
        "type": "",
        "info" : ""
      }
    }
    if (this.selectedDrop == "Daughter2") {
      this.utilitiesProvider.rangeData = parseFloat(this.paramsData.result.InvestmentPeriod);
      this.rangeDataUi = {
        "steps": 1,
        "amount": this.paramsData.postData.InvestmentPeriod,
        "min": parseInt(this.utilitiesProvider.defaultCalData.data.maturityperiod.min),
        "max": parseInt(this.utilitiesProvider.defaultCalData.data.maturityperiod.max),
        "title": this.utilitiesProvider.commonLangMsg['duration'],
        "type": "",
        "info" : ""
      }
    }
  }


  done() {
    let d = parseFloat(this.utilitiesProvider.rangeData);
    if (d) {
      if (d < parseFloat(this.rangeDataUi.min) || d > parseFloat(this.rangeDataUi.max)) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterNumberBetween']+ " " + this.rangeDataUi.min + " " + this.utilitiesProvider.jsErrorMsg['to'] + " " + this.rangeDataUi.max)
      }
      else {
        if (this.selectedDrop == "Daughter1") {
          this.status = !this.status;
          $('.header').removeClass('headerOverlay');
          $('.scroll-content').removeClass('scrollOverlay');
          this.paramsData.postData.InvestmentPeriod = this.utilitiesProvider.rangeData;
          this.getSukanyaSamridhi();
        }
        if (this.selectedDrop == "Daughter2") {
          this.status = !this.status;
          $('.header').removeClass('headerOverlay');
          $('.scroll-content').removeClass('scrollOverlay');
          this.paramsData.postData.InvestmentPeriod = this.utilitiesProvider.rangeData;
          this.getSukanyaSamridhi();
        }
      }
    }
  }

  recalculate() {
    this.setUpshotEvent('Recalculate');

    this.navCtrl.setRoot('SukanyaSamridhiPage');
  }

  takeScreenshot() {
    this.utilitiesProvider.screenShotURI();

    this.utilitiesProvider.setUpshotShareEvent('Tool', 'Sukanyasamriddhi Caculator');
  }

  checkSukanyaAmt(daughter){
    if (daughter == 'D1' && (parseFloat(this.amountD1) < this.minValue || parseFloat(this.amountD1) > this.maxValue)) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " + this.minValue + " " + this.utilitiesProvider.jsErrorMsg['to'] + " " + this.maxValue);
    }
    if (daughter == 'D2' && (parseFloat(this.amountD2) < this.minValue || parseFloat(this.amountD2) > this.maxValue)) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " + this.minValue + " " + this.utilitiesProvider.jsErrorMsg['to'] + " " + this.maxValue);
    }
  }

  checkCalculateSukanya(daughter){
    if (daughter == 'D1' && (parseFloat(this.amountD1) < this.minValue || parseFloat(this.amountD1) > this.maxValue)) {
      return;
    }
    if (daughter == 'D2' && (parseFloat(this.amountD2) < this.minValue || parseFloat(this.amountD2) > this.maxValue)) {
      return;
    }
    else{
      this.getSukanyaSamridhi();
    }
  }

  getSukanyaSamridhi() {
    this.timerStart = true;
      let request = this.paramsData.postData;
      request.Daughter1.AmountInvestedPerMnth = this.amountD1;
      if (request.Daughter2) {
        request.Daughter2.AmountInvestedPerMnth = this.amountD2;
      }
      this.pageLoader = true;
      request.CustId = this.restapiProvider.userData['CustomerID'];
      request.TokenId = this.restapiProvider.userData['tokenId'];
      // localStorage.setItem("temp", JSON.stringify(request))

      return this.restapiProvider.sendRestApiRequest(request, 'GetSukanyaSamriddhiValues').subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          this.paramsData = {
            "postData": request,
            "result": response.Data
          }
          // console.log(this.paramsData);
          this.loadData();
        }
        else {
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }

  goToGoalsListing() {
    this.setUpshotEvent('Start Planning');

    this.navCtrl.setRoot('ListingScreenGoalPage', { pageFrom: 'Sukanya Samriddhi' })
  }
  goNotificationList(){
    this.navCtrl.push('NotificationPage');
  }
  yearCal(){
    let headYear = new Date().getFullYear();
    this.headerYear =  headYear + parseInt(this.paramsData.result.MaturityPeriod);
  }

  setUpshotEvent(action) {
    try{
      let payload = {
        "Appuid": this.utilitiesProvider.upshotUserData.appUId,
        "Language": this.utilitiesProvider.upshotUserData.lang,
        "City": this.utilitiesProvider.upshotUserData.city,
        "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
        "DrivenFrom": this.navParams.get('pageFrom') || '',
        "Daughter1Age": this.Daughter1["Age"],
        "Daughter2Age": this.Daughter2?this.Daughter2["Age"]:"",
        "MIDaughter1": this.amountD1,
        "MIDaughter2": this.amountD2,
        "MaturityCorpus": this.paramsData.result.TotalMaturityAmt,
        "MaturityYear": this.headerYear,
        "D1TotalInvest": this.Daughter1.TotalInvestment,
        "D1TotalInterest": this.Daughter1.InterestEarned,
        "D2TotalInvest": this.Daughter2?this.Daughter2.TotalInvestment:"",
        "D2TotalInterest": this.Daughter2?this.Daughter2.InterestEarned:"",
        "RateofInterest": this.paramsData.result.RateOfInterestInPerc,
        "Duration": this.paramsData.result.InvestmentPeriod,
        "Action": action
      }
      console.log(payload)
      this.utilitiesProvider.upshotCustomEvent('SukanyaSamriddhi', payload, false);
    }
    catch(e){
      console.log(e)
    }
    
  }

  formatAmount(val, type) {
    let amount : number = 0;
    let amountStr : String = "";
    if(val && val.trim() != "₹") {
      amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }
    
    if(type == "D1") {
      this.amountD1Comma = "₹" + amountStr;
      this.amountD1 = amount;
    }
    else if(type == "D2") {
      this.amountD2Comma = "₹" + amountStr;
      this.amountD2 = amount;
    }
  }
}
