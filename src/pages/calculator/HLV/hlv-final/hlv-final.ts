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
  selector: 'page-hlv-final',
  templateUrl: 'hlv-final.html',
})
export class HlvFinalPage {
  @ViewChild(Content) content: Content;
  public disclaimer : any = false;
  public finalValue: any = {};
  public minMonthlyIncome;
  public maxMonthlyIncome;
  public minMonthlyExpenses;
  public maxMonthlyExpenses;
  public minLiability = 1;
  public maxLiability = 5000000;
  public minInsuranceAmt = 1;
  public maxInsuranceAmt = 5000000;
  public selectedDrop;
  public status: boolean = false;
  public rangeDataUi: any;
  public steps = 100;
  public pageLoader: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    private loadingCtrl: LoadingController,
    public utilitiesProvider: UtilitiesProvider,
    public menuCtrl: MenuController,
    public myApp : MyApp) {
      this.finalValue = this.navParams.get("data");

      this.utilitiesProvider.defaultGoalData = this.utilitiesProvider.defaultData.Item2.goals.family_protection;
      this.minMonthlyIncome = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_income.min);
      this.maxMonthlyIncome = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_income.max);

      this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item2.goals.retirement;
      this.minMonthlyExpenses = parseInt(this.utilitiesProvider.defaultGoalData.data.curr_mnthly_exp.min);
      this.maxMonthlyExpenses = parseInt(this.utilitiesProvider.defaultGoalData.data.curr_mnthly_exp.max);
  }

  // top = 0;
  // scrollToTop() {
  //   setTimeout(() => {
  //     this.cssCahnge();
  //   }, 100);
  // }

  // cssCahnge() {
  //   if (this.top == 0) {
  //     $('.hlv_details').removeClass('shrink');
      

  //   }
  //   else {
  //     $('.hlv_details').addClass('shrink');
  //     setTimeout(function () {
  //       var hedaerheight = $('.shrink').parent().outerHeight();
  //     //  $('.fixed-content').css('margin-top', hedaerheight);
  //    //   $('.scroll-content').css('margin-top', hedaerheight);
  //     }, 100);
  //   }

  // }

  goToGoalsListing() {
    this.setUpshotEvent('Start Planing');

    this.navCtrl.setRoot('ListingScreenGoalPage', { pageFrom: 'HLV' })
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad HlvFinalPage');
    this.myApp.updatePageUseCount("73");
    this.utilitiesProvider.upshotScreenView('HLVCalculatorFinal');

    this.setPercentage(Number(this.finalValue.HappinessCoverPerc))
  }

  takeScreenshot() {
    this.utilitiesProvider.screenShotURI();

    this.utilitiesProvider.setUpshotShareEvent('Tool', 'HLV Caculator');
  }

  goNotificationList(){
    this.navCtrl.push('NotificationPage');
  }

  recalculate() {
    this.setUpshotEvent('Recalculate');
    this.navCtrl.setRoot('HlvCalculatorPage');
  }

  setUpshotEvent(action) {
    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "DrivenFrom": this.navParams.get('pageFrom') || '',
      "FinalHLVValue": this.finalValue.FinalHLVValue,
      "HappinessCoverPerc":  this.finalValue.HappinessCoverPerc,
      "FinalIncome": this.finalValue.FinalIncome,
      "FinalExpenditure": this.finalValue.FinalExpenditure,
      "FinalLiability": this.finalValue.FinalLiability,
      "FinalInsuranceCover": this.finalValue.FinalInsuranceCover,
      "Action": action
    }
    // console.log(payload)
    this.utilitiesProvider.upshotCustomEvent('HLVCalculator', payload, false);
  }

  showOverlay(type) {
    this.selectedDrop = type;
    this.status = !this.status;
    $('.header').addClass('headerOverlay');
    $('.scroll-content').addClass('scrollOverlay');
    switch (this.selectedDrop) {
      case "income":
        this.utilitiesProvider.rangeData = parseFloat(this.finalValue.FinalIncome);
        this.rangeDataUi = {
          "steps": this.steps,
          "amount": this.finalValue.FinalIncome,
          "min": this.minMonthlyIncome,
          "max": this.maxMonthlyIncome,
          "title": this.utilitiesProvider.langJsonData['hlvCalculator']['income'],
          "type": "r",
          "info": ""
        }
        break;

      case "expense":
        this.utilitiesProvider.rangeData = parseFloat(this.finalValue.FinalExpenditure);
        this.rangeDataUi = {
          "steps": this.steps,
          "amount": this.finalValue.FinalExpenditure,
          "min": this.minMonthlyExpenses,
          "max": this.maxMonthlyExpenses,
          "title": this.utilitiesProvider.langJsonData['hlvCalculator']['expenditure'],
          "type": "r",
          "info": ""
        }
        break;

      case "liability":
        this.utilitiesProvider.rangeData = parseFloat(this.finalValue.FinalLiability);
        this.rangeDataUi = {
          "steps": this.steps,
          "amount": this.finalValue.FinalLiability,
          "min": this.minLiability,
          "max": this.maxLiability,
          "title": this.utilitiesProvider.langJsonData['hlvCalculator']['currentLiabilities'],
          "type": "r",
          "info": ""
        }
        break;

      case "insurance":
        this.utilitiesProvider.rangeData = parseFloat(this.finalValue.FinalInsuranceCover);
        this.rangeDataUi = {
          "steps": this.steps,
          "amount": this.finalValue.FinalInsuranceCover,
          "min": this.minInsuranceAmt,
          "max": this.maxInsuranceAmt,
          "title": this.utilitiesProvider.langJsonData['hlvCalculator']['currentLifeInsuranceCoverage'],
          "type": "r",
          "info": ""
        }
        break;

      default:
        break;
    }
  }

  done() {
    let d = parseFloat(this.utilitiesProvider.rangeData);
    if (d) {
      if (d < parseFloat(this.rangeDataUi.min) || d > parseFloat(this.rangeDataUi.max)) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterNumberBetween'] + this.rangeDataUi.min + " " + this.utilitiesProvider.jsErrorMsg['to'] + " " + this.rangeDataUi.max)
      }
      else {
        this.status = !this.status;
        $('.header').removeClass('headerOverlay');
        $('.scroll-content').removeClass('scrollOverlay');
        switch (this.selectedDrop) {
          case "income":
            this.finalValue.FinalIncome = this.utilitiesProvider.rangeData;
            this.getFinalHLVResult();
            break;
          case "expense":
            this.finalValue.FinalExpenditure = this.utilitiesProvider.rangeData;
            this.getFinalHLVResult();
            break;
          case "liability":
            this.finalValue.FinalLiability = this.utilitiesProvider.rangeData;
            this.getFinalHLVResult();
            break;
          case "insurance":
            this.finalValue.FinalInsuranceCover = this.utilitiesProvider.rangeData;
            this.getFinalHLVResult();
            break;

          default:
            break;
        }
      }
    }
  }

  getFinalHLVResult() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "Name": this.finalValue.Name,
      "DOB": this.finalValue.DOB,
      "Age": this.finalValue.Age,
      "Gender": this.finalValue.Gender,
      "MonthlyIncome": this.finalValue.FinalIncome,
      "MonthlyExpenses": this.finalValue.FinalExpenditure,
      "Liabilities": this.finalValue.FinalLiability,
      "MaritalStatus": this.finalValue.MaritalStatus,
      "SpouseEarningStatus": this.finalValue.SpouseEarningStatus,
      "SpouseMonthlyIncome": this.finalValue.SpouseMonthlyIncome,
      "InsuranceStatus": this.finalValue.InsuranceStatus,
      "CurrentInsuranceCover": this.finalValue.FinalInsuranceCover
    }

    this.restapiProvider.sendRestApiRequest(request, 'GetHLVValues')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          this.finalValue = response.Data;
          this.setPercentage(Number(this.finalValue.HappinessCoverPerc))
        }
        else {
          this.restapiProvider.presentToastTop(response.Message);
        }
      },
        (error) => {
          this.pageLoader = false;
          this.restapiProvider.presentToastTop("Something wents wrong!");
        })
  }

  setPercentage(percentage) {
    if (percentage !== 0) {
      let timer = 50
      let dashArray = 546
      let per = dashArray / 100 * percentage
      let animateAngle = dashArray + per
      $(".animateCircle").animate({
        'stroke-dasharray': animateAngle
      }, timer * percentage);

      let count = 0
      let animatePer = setInterval(() => {
        count++
        $(".per").html(count);
        if (percentage == count) {
          clearInterval(animatePer);
        }
      }, timer);
    } else {
      $(".animateCircle").animate({
        'stroke-dasharray': 546
      }, 0);
      $(".per").html(percentage);
    }
  }
}
