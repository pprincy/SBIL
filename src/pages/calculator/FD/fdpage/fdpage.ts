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
  selector: 'page-fdpage',
  templateUrl: 'fdpage.html',
})
export class FdpagePage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;

  public steps            : number = 10000;
  public minDepositAmt    : number = 0;
  public maxDepositAmt    : number = 0;
  public minInterestRate  : number = 0;
  public maxInterestRate  : number = 0;
  public minTenure        : number = 0;
  public maxTenure        : number = 0;
  public depositAmt       : number = 0;
  public depositAmtComma = "0";
  public depositTenure    : number = 0;
  public yearDiff         : number = 0;
  public depositType;
  public selectTenureBar  : any = [];
  public tenureArr        : any = [];
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
    this.utilitiesProvider.defaultCalData = this.utilitiesProvider.defaultData.Item1.calculators.fd;
    this.minDepositAmt = parseFloat(this.utilitiesProvider.defaultCalData.data.amt.min);
    this.maxDepositAmt = parseFloat(this.utilitiesProvider.defaultCalData.data.amt.max);
    this.depositAmt = this.minDepositAmt;

    let amount : number = 0;
    let amountStr : String = "";
    if(this.depositAmt) {
      amount = Number(this.depositAmt.toString().replace(/,/g,"").replace(/₹/g,"").replace(/ /g,""));
      amountStr = amount.toLocaleString('en-IN');
    }
    
    this.depositAmtComma = "₹" + amountStr;

    this.minTenure = parseFloat(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.min);
    this.maxTenure = parseFloat(this.utilitiesProvider.defaultCalData.data.tenure_in_yr.max);
    for (let i = this.minTenure; i <= this.maxTenure; i++) {
      this.selectTenureBar.push(i);
    }

    this.depositTenure = this.selectTenureBar[0];
    this.tenureArr = this.utilitiesProvider.langJsonData['fixedDepositCalculator']['interest_rate_frequency'];
    this.depositType = this.tenureArr[0].id;

    this.minInterestRate = parseFloat(this.utilitiesProvider.defaultCalData.data.interest_rate.min);
    this.maxInterestRate = parseFloat(this.utilitiesProvider.defaultCalData.data.interest_rate.max);
    this.startLoad();

   this.utilitiesProvider.upshotScreenView('FixedDeposit');
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
      that.depositTenure = selectedYearHome;
      // console.log(that.depositTenure)
      that.yearDiff = d + selectedYearHome;
      $('.diffYear').html(that.yearDiff)
    });
  }



  doSomething(e) {
    if (this.depositAmt >= (this.maxDepositAmt / 3) && this.depositAmt <= (this.maxDepositAmt / 2)) {
      this.steps = 50000;
    }
    else if (this.depositAmt >= (this.maxDepositAmt / 2)) {
      this.steps = 100000;
    } 
    this.depositAmtComma = "₹" + this.numberPipe.transform(this.depositAmt);
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
      if (this.depositAmt <= 0 || this.depositAmt >  this.maxDepositAmt || this.depositAmt <  this.minDepositAmt) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " + this.minDepositAmt + this.utilitiesProvider.jsErrorMsg['to'] + this.maxDepositAmt);
      }
      else {
        this.goToNextSlide();
      }
    }
    if (currentIndex == 1) {
      if (this.depositTenure > this.selectTenureBar[this.selectTenureBar.length - 1]) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterTenureBetween'] + " "  + this.selectTenureBar[0] + this.utilitiesProvider.jsErrorMsg['to'] + this.selectTenureBar[this.selectTenureBar.length - 1]);
      }
      else {
        this.goToNextSlide();
      }
    }
    if (currentIndex == 2) {
      this.CalculateFDValue();
      // if(this.depositType in this.tenureArr){
      //   this.navCtrl.push('FdFinalPage');
      // }
      // else{
      //   this.restapiProvider.presentToastTop("Please select appropriate tenure type");
      // }
    }
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

  checkDepositAmt() {
    if (this.depositAmt <= 0                  || 
        this.depositAmt >  this.maxDepositAmt || 
        this.depositAmt <  this.minDepositAmt) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " + this.minDepositAmt + this.utilitiesProvider.jsErrorMsg['to'] + this.maxDepositAmt);
    }
  }

  clearStartZero(option){
    if(this.depositAmt == 0     ||
      isNaN(this.depositAmt)    ||
      this.depositAmt == null){
      this.depositAmt = null;
    this.depositAmtComma = "₹" + "";

    }
  }

  selectedDuration(tenure, index) {
    this.depositType = tenure.id;
    // console.log(tenure)
    $('#tenure-' + index).addClass('active');
    $('#tenure-' + index).parents('.row').siblings('.row').find('.button').removeClass('active');
  }

  goToNextSlide() {
    let currentIndex = this.slides.getActiveIndex();
    this.slides.slideTo(currentIndex + 1, 500);
    this.activateBar();
    this.slides.lockSwipes(true);
  }

  // Tenure(in yrs)
  //Interest Frequency (as per tenureArr mapping)
  //InterestRate (minInterest Rate in data)
  CalculateFDValue() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "Amount": this.depositAmt,
      "Tenure": this.depositTenure,
      "InterestRate": this.minInterestRate,
      "InterestRateFrequency": this.depositType
    }
    console.log("#############",request);
    return this.restapiProvider.sendRestApiRequest(request, 'GetFDValue').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        
        // console.log("Final: ", response);
        this.navCtrl.push('FdFinalPage', { data: response.Data, pageFrom: this.pageFrom });
      }
      else {
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

    this.depositAmtComma = "₹" + amountStr;
    this.depositAmt = amount;
  }
}

