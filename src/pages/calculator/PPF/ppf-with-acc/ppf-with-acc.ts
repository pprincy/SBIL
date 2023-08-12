import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides, LoadingController } from 'ionic-angular';
import '../../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { Keyboard } from '@ionic-native/keyboard';
import { DecimalPipe } from '@angular/common';


@IonicPage()
@Component({
  selector: 'ppf-with-acc',
  templateUrl: 'ppf-with-acc.html',
})
export class PpfWithAccPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;

  public isAccPresent: boolean = true;
  public existingPPFBal: number = 0;
  public existingPPFBalComma = "0";
  public prevInvestTenure: number = 0;
  public investAmt: number = 0;
  public investAmtComma = "0";
  public ppfAccTenure: number = 0;
  public rateOfReturn: number = 0;
  public minPrevInvestTenure: number = 0;
  public maxPrevInvestTenure: number = 0;
  public minPPFTenure: number = 0;
  public maxPPFTenure: number = 0;
  public minRateOfReturn: number = 0;
  public maxRateofReturn: number = 0;
  public minAmt: number = 0;
  public maxAmt: number = 0;
  public selectPrevInvestBar: any = [];
  public selectPPFTenureBar: any = [];
  public optionsArr: any = [];
  public futureInvestYear: number = 0;
  public futurePPFYear: number = 0;

  public retireAgeBar: any = [];
  public nowAgeBar: any = [];
  public steps = 100;
  public contribute;
  public minValue;
  public maxValue;
  public isBtnActive: boolean = false;
  public status: boolean = false;
  public pageLoader: boolean = false;
  ageDiff: number;
  loading: any;
  sliderRetireAge;
  sliderAgeNowAge;
  backBtnhide: boolean = true;
  scrollHeight;
  public minExistAmount;
  public maxExistAmount;
  public pageFrom;
  public existPPFAcc = '1';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    private numberPipe: DecimalPipe,
    private loadingCtrl: LoadingController) {
    this.utilitiesProvider.defaultCalData = this.utilitiesProvider.defaultData.Item1.calculators.ppf;
    // console.log( this.utilitiesProvider.defaultCalData)
    // Amount Min/Max/Default
    this.minAmt = parseFloat(this.utilitiesProvider.defaultCalData.data.amount.min);
    // this.minAmt = 1.0;
    this.maxAmt = parseFloat(this.utilitiesProvider.defaultCalData.data.amount.max);

  //existamount
  this.minExistAmount = parseFloat(this.utilitiesProvider.defaultCalData.data.existamount.min);
  this.maxExistAmount = parseFloat(this.utilitiesProvider.defaultCalData.data.existamount.max);
  this.existingPPFBal = parseFloat(this.utilitiesProvider.defaultCalData.data.existamount.default);
  this.existingPPFBalComma = "₹"+ (this.existingPPFBal ? this.numberPipe.transform(this.existingPPFBal) : "0");


    //Rate of Return
    this.minRateOfReturn = parseFloat(this.utilitiesProvider.defaultCalData.data.rateofreturn.min);
    this.maxRateofReturn = parseFloat(this.utilitiesProvider.defaultCalData.data.rateofreturn.max);

    // PPF Tenure
    this.minPPFTenure = parseInt(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.min);
    this.maxPPFTenure = parseInt(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.max);

    //Prev PPF Tenure
    this.minPrevInvestTenure = parseInt(this.utilitiesProvider.defaultCalData.data.tenure_prev_inv.min);
    this.maxPrevInvestTenure = parseInt(this.utilitiesProvider.defaultCalData.data.tenure_prev_inv.max);

    // Existing PPF Balance
    // this.existingPPFBal = 1.0; //Only for testing

    // Prev Investment Tenure
    for (let i = this.minPrevInvestTenure; i <= this.maxPrevInvestTenure; i++) {
      this.selectPrevInvestBar.push(i);
    }
    // this.prevInvestTenure = parseInt(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.default);
    this.prevInvestTenure = parseInt(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.min);  // Only for testing
    this.futureInvestYear = this.prevInvestTenure + new Date().getFullYear();

    // Investment Amount
    this.investAmt = parseFloat(this.utilitiesProvider.defaultCalData.data.amount.default);
    this.investAmtComma = "₹"+ (this.investAmt ? this.numberPipe.transform(this.investAmt) : "");

    //PPF Tenure
    for (let i = 1; i <= this.maxPPFTenure; i++) {
      this.selectPPFTenureBar.push(i);
      if (i == parseInt(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.default)) {
        this.ppfAccTenure = i;
      }
    }
    // this.ppfAccTenure = this.selectPPFTenureBar[0];
    this.futurePPFYear = this.ppfAccTenure + new Date().getFullYear() - this.futureInvestYear;

    // Rate of Return
    this.rateOfReturn = parseFloat(this.utilitiesProvider.defaultCalData.data.rateofreturn.default);

    this.pageFrom = this.navParams.get('pageFrom');
  }
  ionViewDidEnter() {
    this.slides.lockSwipes(false);
    this.slides.update();
    let a = $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
    if (a) {
      this.scrollHeight = a;
    }
    this.optionsArr = [
      {
        "id" : "1",
        "value" :  this.utilitiesProvider.commonLangMsg['yes'],
      },
      {
        "id" : "2",
        "value" :  this.utilitiesProvider.commonLangMsg['no'],
      }
    ]

    this.existPPFAcc = '1';

    this.utilitiesProvider.upshotScreenView('PPFCalculator');
  }


  ionViewDidLoad() {
    setTimeout(() => {
      var totalHeight = $('.swiper-slide-active').outerHeight();
      var slide_heading = $('.age_slider_heading').outerHeight();
      var nps_first = $('.nps_age_first').outerHeight();
      var actualheight = slide_heading + nps_first * 1.5;
      $('.tell_us_cont_common').height(totalHeight - actualheight);
    }, 1500);
  }

  onSliderChange() {
    // console.log('onSliderChange');
    var totalHeight = $('.swiper-slide-active .slide-zoom').height();
    var slide_heading = $('.age_slider_heading').height();
    var nps_first = $('.nps_age_first').height();
    var actualheight = slide_heading + nps_first * 1.5;
    $('.tell_us_cont_common').height(totalHeight - actualheight);
  }
  doSomething(e, option) {
    if (option == "existing") {
      if (this.existingPPFBal >= (this.maxValue / 3) && this.existingPPFBal <= (this.maxValue / 2)) {
        this.steps = 1000;
      }
      else if (this.existingPPFBal >= (this.maxValue / 2)) {
        this.steps = 2000;
      }
      this.existingPPFBalComma = "₹"+ (this.existingPPFBal ? this.numberPipe.transform(this.existingPPFBal) : "");
    }
    if (option == "invest") {
      if (this.investAmt >= (this.maxValue / 3) && this.investAmt <= (this.maxValue / 2)) {
        this.steps = 1000;
      }
      else if (this.investAmt >= (this.maxValue / 2)) {
        this.steps = 2000;
      }
      this.investAmtComma = "₹"+ (this.investAmt ? this.numberPipe.transform(this.investAmt) : "");
    }
  }
  toggleClass(id) {
    $('#' + id).toggleClass('active');
  }

  selectedOption(option, index) {
    this.existPPFAcc = option.id
    if (option.id == "1") {
      this.isAccPresent = true;
           this.existingPPFBal = 1.0; //Only for testing

      // this.prevInvestTenure = parseInt(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.default);
      this.prevInvestTenure = parseInt(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.min);  // Only for testing



    }
    else {
      this.isAccPresent = false;
      this.existingPPFBal = 0.0;
      this.existingPPFBalComma = "₹";
      this.prevInvestTenure = 0;
      this.investAmt = parseFloat(this.utilitiesProvider.defaultCalData.data.amount.default);
      this.investAmtComma = "₹"+ (this.investAmt ? this.numberPipe.transform(this.investAmt) : "");
    }
    
    $('#option-' + index).addClass('active');
    $('#option-' + index).parents('.row').siblings('.row').find('.button').removeClass('active');
  }

  isAmount(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseNumbers']);
      return false;
    }
    return true;
  }

  next() {
    var that = this;
    this.slides.lockSwipes(false);
    this.backBtnhide = false;
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == 0) {
      this.goToNextSlide();
    }
    if (this.isAccPresent) {
      if (currentIndex == 1) {
        if (this.existingPPFBal == null || isNaN(this.existingPPFBal) || this.existingPPFBal > this.maxExistAmount || this.existingPPFBal < this.minExistAmount) {
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " + this.minExistAmount + this.utilitiesProvider.jsErrorMsg['to'] + this.maxExistAmount);
        }
        else {
          this.goToNextSlide();
        }
      }
      if (currentIndex == 2) {
        if (this.prevInvestTenure > this.selectPrevInvestBar[this.selectPrevInvestBar.length - 1]) {
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " + this.selectPrevInvestBar[0] + this.utilitiesProvider.jsErrorMsg['to'] + this.selectPrevInvestBar[this.selectPrevInvestBar.length - 1]);
        }
        else {
          this.goToNextSlide();
        }
      }
      if (currentIndex == 3) {
        if (this.investAmt == null || isNaN(this.investAmt) || this.investAmt > this.maxAmt || this.investAmt < this.minAmt) {
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " + this.minAmt + this.utilitiesProvider.jsErrorMsg['to'] + this.maxAmt);
        }
        else {
          this.goToNextSlide();
        }
      }
      if (currentIndex == 4) {
        if (this.ppfAccTenure > this.selectPPFTenureBar[this.selectPPFTenureBar.length - 1]) {
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " + this.selectPPFTenureBar[0] + this.utilitiesProvider.jsErrorMsg['to'] + this.selectPPFTenureBar[this.selectPPFTenureBar.length - 1]);
        }
        else {
          this.GetPPFMaturityAmount();
        }
      }
    }
    else {
      if (currentIndex == 1) {
        if (this.investAmt == null || isNaN(this.investAmt) || this.investAmt > this.maxAmt || this.investAmt < this.minAmt) {
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " + this.minAmt + this.utilitiesProvider.jsErrorMsg['to'] + this.maxAmt);
        }
        else {
          this.goToNextSlide();
        }
      }
      if (currentIndex == 2) {
        if (this.ppfAccTenure > this.selectPPFTenureBar[this.selectPPFTenureBar.length - 1]) {
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " + this.selectPPFTenureBar[0] + this.utilitiesProvider.jsErrorMsg['to'] + this.selectPPFTenureBar[this.selectPPFTenureBar.length - 1]);
        }
        else {
          this.GetPPFMaturityAmount();
        }
      }
    }





    if (currentIndex == 1) {
      if ($('.prevYear').hasClass('slick-initialized')) {
        $('.prevYear').slick('unslick');
      }


      $('.prevYear').slick({
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

      var currentSlide = $('.prevYear').slick('slickCurrentSlide');
      $('.prevYear .slick-current').trigger('click');
      $('.tell_us_cont_common').css('opacity', 1);


      $('.prevYear').on('afterChange', function (event, slick, currentSlide, nextSlide) {
        that.prevInvestTenure = parseInt($(".prevYear.tell_us_slider .slick-current .tell_us_slider_age").text());
        that.futureInvestYear = that.prevInvestTenure + new Date().getFullYear();
      });


      // $('.PPFYear.tell_us_slider').on('afterChange', function (event, slick, currentSlide, nextSlide) {
      //   that.ppfAccTenure = parseInt($(".PPFYear.tell_us_slider .slick-current .tell_us_slider_age").text());
      //   that.futurePPFYear = that.ppfAccTenure + new Date().getFullYear();
      //   // that.tenureInMonths = that.tenure * 12;
      // });

      if ($('.PPFYear').hasClass('slick-initialized')) {
        $('.PPFYear').slick('unslick');
      }


      $('.PPFYear').slick({
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

      var currentSlideA = $('.PPFYear').slick('slickCurrentSlide');
      $('.PPFYear .slick-current').trigger('click');
      $('.tell_us_cont_common').css('opacity', 1);


      $('.PPFYear').on('afterChange', function (event, slick, currentSlideA, nextSlide) {
        that.ppfAccTenure = parseInt($(".PPFYear.tell_us_slider .slick-current .tell_us_slider_age").text());
        that.futurePPFYear = that.ppfAccTenure + new Date().getFullYear();
        // that.tenureInMonths = that.tenure * 12;
      });

    }
    else if (currentIndex == 3) {
      if ($('.PPFYear').hasClass('slick-initialized')) {
        $('.PPFYear').slick('unslick');
      }


      $('.PPFYear').slick({
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

      var currentSlides = $('.PPFYear').slick('slickCurrentSlide');
      // console.log(currentSlides);
      $('.PPFYear .slick-current').trigger('click');
      $('.tell_us_cont_common').css('opacity', 1);


      $('.PPFYear').on('afterChange', function (event, slick, currentSlides, nextSlide) {
        that.ppfAccTenure = parseInt($(".PPFYear.tell_us_slider .slick-current .tell_us_slider_age").text());
        that.futurePPFYear = that.ppfAccTenure + new Date().getFullYear();
        // that.tenureInMonths = that.tenure * 12;
      });



    }
  }

  clearStartZero(option) {
    if (option == 'existing' &&
      (this.existingPPFBal == 0 ||
        isNaN(this.existingPPFBal) ||
        this.existingPPFBal == null)) {
      this.existingPPFBal = null;
      this.existingPPFBalComma = "₹"+ "";
    }
    if (option == 'investAmt' &&
      (this.investAmt == 0 ||
        isNaN(this.investAmt) ||
        this.investAmt == null)) {
      this.investAmt = null;
      this.investAmtComma = "₹"+ "";
    }
  }

  goToNextSlide() {
    let currentIndex = this.slides.getActiveIndex();
    this.slides.slideTo(currentIndex + 1, 500);
    this.activateBar();
    this.slides.lockSwipes(true);
  }

  back() {
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == 1) {
      this.backBtnhide = true;
    }
    let yOffset = document.getElementById("stepsCount").offsetTop;
    this.content.scrollTo(0, yOffset, 0)
    this.slides.lockSwipes(false);
    this.slides.slideTo(currentIndex - 1, 500);
    this.slides.lockSwipes(true);
    this.activateBar();
  }


  activateBar() {
    let currentIndex = this.slides.getActiveIndex() + 1;
    let stepIndex = $('.calculator_steps .calculator_steps_com  .calculator_steps_com_num span').text();
    if (this.isAccPresent && currentIndex >= 2) {
      $('.calculator_steps .calculator_steps_com:nth-child(' + (currentIndex - 2) + ')').addClass('active');
      $('.calculator_steps .calculator_steps_com:nth-child(' + (currentIndex - 2) + ')').prevAll().addClass('active');
      $('.calculator_steps .calculator_steps_com:nth-child(' + (currentIndex - 2) + ')').nextAll().removeClass('active');
    }
    else {
      $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').addClass('active');
      $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').prevAll().addClass('active');
      $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').nextAll().removeClass('active');
    }
  }

  GetPPFMaturityAmount() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "HasExistingBalance": this.isAccPresent,
      "ExistingBalance": this.existingPPFBal,
      "PrevInvestTenure": this.prevInvestTenure,
      "AmountInvested": this.investAmt,
      "Tenure": this.ppfAccTenure,
      "RateOfReturn": this.rateOfReturn
    }

    // console.log("Request: " + JSON.stringify(request));
    return this.restapiProvider.sendRestApiRequest(request, 'GetPPFMaturityAmount')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          // console.log(response);
          if (this.isAccPresent) {
            this.navCtrl.push('PpfWithAccFinalPage', { data: response.Data, pageFrom: this.pageFrom })
          }
          else {
            this.navCtrl.push('PpfWithoutAccFinalPage', { data: response.Data, pageFrom: this.pageFrom })
          }
        }
        else {
          // console.log(response);
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }

  formatAmount(val, type) {
    let amount : number = 0;
    let amountStr : String = "";
    if(val && val.trim() != "₹") {
      amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }

    if(type == "balance") {
      this.existingPPFBalComma = "₹"+ amountStr;
      this.existingPPFBal = amount;
    }
    else if(type == "invest") {
      this.investAmtComma = "₹"+ amountStr;
      this.investAmt = amount;
    }
  }
}

