import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides, LoadingController } from 'ionic-angular';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { Keyboard } from '@ionic-native/keyboard';
import '../../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { DecimalPipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-loanemi-calculator',
  templateUrl: 'loanemi-calculator.html',
})
export class LoanemiCalculatorPage {

  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;

  public steps            : number = 50000;
  public minLoanAmt       : number = 0;
  public maxLoanAmt       : number = 0;
  public minInterestRate  : number = 0;
  public maxInterestRate  : number = 0;
  public minTenure        : number = 0;
  public maxTenure        : number = 0;
  public loanAmt          : number = 0;
  public loanAmtComma = "0";
  public loanTenure       : number = 0;
  public loanInMonths     : number = 0;
  public selectLoanBar    : any = [];
  public amount_error     : boolean = false;
  public pageLoader       : boolean = false;
  backBtnhide             : boolean = true;
  keyboardShow            : boolean = false;
  loading                 : any;  
  public pageFrom;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    private loadingCtrl: LoadingController,
    private numberPipe: DecimalPipe,
    private keyboard: Keyboard) {

    this.keyboard.onKeyboardShow().subscribe(data => {
      this.keyboardShow = true;
    });
    this.keyboard.onKeyboardHide().subscribe(data => {
      this.keyboardShow = false;
    });

    this.pageFrom = this.navParams.get('pageFrom');
  }
  ionViewDidLoad() {
    // console.log("Data:", this.utilitiesProvider.defaultData)
    this.utilitiesProvider.defaultCalData = this.utilitiesProvider.defaultData.Item1.calculators.emi;
    this.minLoanAmt = parseFloat(this.utilitiesProvider.defaultCalData.data.amt.min);
    this.maxLoanAmt = parseFloat(this.utilitiesProvider.defaultCalData.data.amt.max);
    this.loanAmt = this.minLoanAmt;

    let amount : number = 0;
    let amountStr : String = "";
    if(this.loanAmt) {
      amount = Number(this.loanAmt.toString().replace(/,/g,"").replace(/₹/g,"").replace(/ /g,""));
      amountStr = amount.toLocaleString('en-IN');
    }

    this.loanAmtComma = "₹" + amountStr;

    this.minTenure = parseFloat(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.min);
    this.maxTenure = parseFloat(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.max);
    for (let i = this.minTenure; i <= this.maxTenure; i++) {
      this.selectLoanBar.push(i);
    }
    this.loanTenure = this.selectLoanBar[0];
    this.loanInMonths = this.loanTenure * 12;

    this.minInterestRate = parseFloat(this.utilitiesProvider.defaultCalData.data.interest_rate.min);
    this.maxInterestRate = parseFloat(this.utilitiesProvider.defaultCalData.data.interest_rate.max);
    this.startLoad();

   this.utilitiesProvider.upshotScreenView('LoanEMI');
  }

  startLoad() {
    var that = this;
    this.slides.lockSwipes(false);
    setTimeout(() => {
      $('.tell_us_slider').not('.slick-initialized').slick({
        focusOnSelect: true,
        dots: false,
        infinite: true,
        speed: 300,
        cssEase: 'linear',
        slidesToShow: 7,
        slidesToScroll: 5,
        centerMode: true,
        variableWidth: true,
        arrows: false
      });
      $('.tell_us_slider .slick-current').trigger('click');
      $('.tell_us_slider').css('opacity', 1);
      this.slides.lockSwipes(true);
    }, 500);

    $('.tell_us_cont .ion-ios-add-circle-outline').click(function (e) {
      e.stopPropagation();
      $(this).parents('.tell_us_cont').addClass('active');
      $('.tell_us_slider .slick-current').trigger('click');
    });

    $('.tell_us_cont .ion-md-create').click(function (e) {
      e.stopPropagation();
      //  isReadonly = false;

      $(this).toggle();
      $(this).siblings('.icon').toggle();

    });
    setTimeout(function () {
      var totalHeight = $('.swiper-slide-active').outerHeight();
      var slide_heading = $('.age_slider_heading').outerHeight();
      var nps_first = $('.nps_age_first').outerHeight();
      var actualheight = slide_heading + nps_first * 1.5;
      $('.tell_us_cont_common').height(totalHeight - actualheight);
    }, 1500);


    $('.tell_us_slider').on('afterChange', function (event, slick, currentSlide, nextSlide) {
      let retirementCorpusDateVar = new Date();
      let d = retirementCorpusDateVar.getFullYear();
      let selectedYearHome = parseInt($(".homeYear.tell_us_slider .slick-current .tell_us_slider_age").text());
      that.loanTenure = selectedYearHome;
      // console.log(that.loanTenure)
      that.loanInMonths = selectedYearHome * 12;
      $('.diffYear').html(that.loanInMonths);
    });
  }



  doSomething(e) {
    if (this.loanAmt >= (this.maxLoanAmt / 3) && this.loanAmt <= (this.maxLoanAmt / 2)) {
      this.steps = 500000;
    }
    else if (this.loanAmt >= (this.maxLoanAmt / 2)) {
      this.steps = 1000000;
    }
    this.loanAmtComma = "₹" + (this.loanAmt ? this.numberPipe.transform(this.loanAmt) : "0");
    // console.log(this.costOfHome) 
    // console.log(this.steps) 
  }

  toggleClass(id) {
    $('#' + id).toggleClass('active')
  }


  activateBar() {
    let currentIndex = this.slides.getActiveIndex() + 1;
    let stepIndex = $('.calculator_steps .calculator_steps_com  .calculator_steps_com_num span').text();
    // if(currentIndex == stepIndex)
    $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').prevAll().addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').nextAll().removeClass('active');
    this.slides.lockSwipes(true);
  }
  onSliderChange() {
    var totalHeight = $('.swiper-slide-active .slide-zoom').height();
    var slide_heading = $('.age_slider_heading').height();
    var nps_first = $('.nps_age_first').height();
    var actualheight = slide_heading + nps_first * 1.5;
    $('.tell_us_cont_common').height(totalHeight - actualheight);
  }

  back() {
    this.slides.lockSwipes(false);
    let yOffset = document.getElementById("stepsCount").offsetTop;
    this.content.scrollTo(0, yOffset, 0)

    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == 1) {
      this.backBtnhide = true;
    }
    this.slides.slideTo(currentIndex - 1, 500);
    this.activateBar();
  }

  next() {
    this.slides.lockSwipes(false);
    this.backBtnhide = false;
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == 0) {
      if (this.loanAmt <= 0                     || 
          this.loanAmt >  this.maxLoanAmt       || 
          this.loanAmt <  this.minLoanAmt) {
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " + this.minLoanAmt + this.utilitiesProvider.jsErrorMsg['to'] + this.maxLoanAmt);
      }
      else {
        this.goToNextSlide();
      }
    }
    if (currentIndex == 1) {
      if (this.loanTenure > this.selectLoanBar[this.selectLoanBar.length - 1]) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " + this.minLoanAmt + this.utilitiesProvider.jsErrorMsg['to'] + this.maxLoanAmt);
      }
      else {
        this.CalculateLoanEMI();
      }
    }
    // if (currentIndex == 2) {
  
    // }
  }

  isAmount(event) {
    this.amount_error = false;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseNumbers']);
      return false;
    }
    return true;
  }

  checkLoanAmt() {  
    if (this.loanAmt <= 0                     || 
        this.loanAmt >  this.maxLoanAmt       || 
        this.loanAmt <  this.minLoanAmt) {
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " + this.minLoanAmt + this.utilitiesProvider.jsErrorMsg['to'] + this.maxLoanAmt);    }
  }

  clearStartZero(option){
    if(this.loanAmt == 0     ||
      isNaN(this.loanAmt)    ||
      this.loanAmt == null){
      this.loanAmt = null;
      this.loanAmtComma = "₹" + "";
    }
  }

  goToNextSlide() {
    let currentIndex = this.slides.getActiveIndex();
    this.slides.slideTo(currentIndex + 1, 500);
    this.activateBar();
    this.slides.lockSwipes(true);
  }

  CalculateLoanEMI() {
    this.pageLoader = true;
    let request = {
      "CustId"       : this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "Amount"       : this.loanAmt,
      "Tenure"       : this.loanTenure,
      "InterestRate" : this.minInterestRate
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetEMIValue').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        // console.log("Final: ", response);
        this.navCtrl.push('LoanemiCalculatorFinalPage', { data: response.Data, pageFrom: this.pageFrom });
      }
      else {
        this.pageLoader = false;
        // console.log(response);
      }
    },
      (error) => {
        this.pageLoader = false;
      })
  }

  formatAmount(val) {
    let amount : number = 0;
    let amountStr : String = "";
    if(val && val.trim() != "₹") {
      amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }

    this.loanAmtComma = "₹" + amountStr;
    this.loanAmt = amount;
  }
}


