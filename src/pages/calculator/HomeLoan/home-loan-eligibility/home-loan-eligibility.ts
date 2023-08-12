import { Component,
         ViewChild          } from '@angular/core';
import { IonicPage,
         NavController,
         NavParams,
         Content,
         Slides,
         LoadingController  } from 'ionic-angular';
import { RestapiProvider    } from '../../../../providers/restapi/restapi';
import { UtilitiesProvider  } from '../../../../providers/utilities/utilities';
import { Keyboard           } from '@ionic-native/keyboard';
import  '../../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { json } from 'd3';
import { DecimalPipe } from '@angular/common';


@IonicPage()
@Component({
  selector    : 'page-home-loan-eligibility',
  templateUrl : 'home-loan-eligibility.html',
})
export class HomeLoanEligibilityPage {
  @ViewChild(Content) content : Content;
  @ViewChild(Slides)  slides  : Slides;

  public steps            : number = 5000;
  public selectAgeBar     : any = [];
  public selectTenureBar  : any = [];
  public age              : number = 0;
  public monthlyIncome    : number = 0;
  public monthlyIncomeComma = "0";
  public minMonthlyIncome : number = 0;
  public maxMonthlyIncome : number = 0;
  public interestRate     : number = 0;
  public minInterestRate  : number = 0;
  public maxInterestRate  : number = 0;
  public tenure           : number = 0;
  public maxTenure        : number = 0;
  public minTenure        : number = 0;
  public tenureInMonths   : number = 0;
  public status           : boolean = false;
  public loading          : any;
  public keyboardShow     : boolean = false;
  public backBtnhide      : boolean = true;
  public pageLoader       : boolean = false;
  public userAge;
  public pageFrom;
  constructor(public navCtrl           : NavController, 
              public navParams         : NavParams,
              private restapiProvider  : RestapiProvider,
              public utilitiesProvider : UtilitiesProvider,
              private loadingCtrl      : LoadingController,
              private numberPipe: DecimalPipe,
              private keyboard         : Keyboard) {
      this.keyboard.onKeyboardShow().subscribe(data => {
        this.keyboardShow = true;
      });
      this.keyboard.onKeyboardHide().subscribe(data => {
        this.keyboardShow = false;
      });
      this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item1.calculators.loaneligibility;
  // console.log( this.utilitiesProvider.defaultGoalData )
      this.pageFrom = this.navParams.get('pageFrom');
    }
  ionViewDidLoad() {
        let monthIncome:any;

    this.userAge = this.restapiProvider.userData['age'];
    for(let i=0;i<(this.utilitiesProvider.age18.length-8);i++){
      this.selectAgeBar.push(this.utilitiesProvider.age18[i]);
    }
    this.age = this.selectAgeBar[0];
    
    this.minMonthlyIncome = parseInt(this.utilitiesProvider.defaultGoalData.data.amount_reqd.min);
    this.maxMonthlyIncome = parseInt(this.utilitiesProvider.defaultGoalData.data.amount_reqd.max);
   if(this.restapiProvider.userData['userPersonalDetails']){
      monthIncome =parseInt(JSON.parse(this.restapiProvider.userData['userPersonalDetails']).Table[0].ActualIncome);
     this.monthlyIncome    = this.minMonthlyIncome> monthIncome ? this.minMonthlyIncome:parseInt(monthIncome);
  }else{
       this.monthlyIncome=this.minMonthlyIncome;
  }

    let amount : number = 0;
    let amountStr : String = "";
    if(this.monthlyIncome) {
      amount = Number(this.monthlyIncome.toString().replace(/,/g,"").replace(/₹/g,"").replace(/ /g,""));
      amountStr = amount.toLocaleString('en-IN');
    }

    this.monthlyIncomeComma = "₹" + amountStr;

    this.minInterestRate  = parseInt(this.utilitiesProvider.defaultGoalData.data.interest_rate.min);
    this.maxInterestRate  = parseInt(this.utilitiesProvider.defaultGoalData.data.interest_rate.max);
    this.interestRate     = this.minInterestRate;

    this.minTenure        = parseInt(this.utilitiesProvider.defaultGoalData.data.tenure_in_yr.min);
    this.maxTenure        = parseInt(this.utilitiesProvider.defaultGoalData.data.tenure_in_yr.max);
    for(let i = this.minTenure;i <= this.maxTenure; i++){
      this.selectTenureBar.push(i);
    }
    this.tenure           = this.selectTenureBar[0];
    this.tenureInMonths   = this.tenure * 12;
    this.startLoad();

   this.utilitiesProvider.upshotScreenView('HomeLoanEligibility');
  }
  startLoad(){
    var that = this;
    this.slides.lockSwipes(false);   
    setTimeout(()=>{ 
      $('.tell_us_slider').not('.slick-initialized').slick({
        focusOnSelect   : true,
        dots            : false,
        infinite        : true,
        speed           : 300,
        cssEase         : 'linear',
        slidesToShow    : 7,
        slidesToScroll  : 5,
        centerMode      : true,
        variableWidth   : true,
        arrows          : false
    }); 
    $('.tell_us_slider .slick-current').trigger('click');
    $('.tell_us_slider').css('opacity',1);
    this.slides.lockSwipes(true);
    },500);

    setTimeout(function(){
      
          var totalHeight   = $('.swiper-slide-active').outerHeight();
          var slide_heading = $('.age_slider_heading').outerHeight();
          var nps_first     = $('.nps_age_first').outerHeight();
          var actualheight= slide_heading + nps_first*1.5;
          $('.tell_us_cont_common').height(totalHeight - actualheight);
       
    },1000);
    setTimeout(() => {
      let that = this;
      $(".tell_us_slider.ageYear div").each(function(){
        var curAge = parseInt($(this).find('.tell_us_slider_age').html());
        // console.log(curAge)
        if(curAge == that.userAge)
        {
        $(this).not('.slick-cloned').trigger('click');
        }
        })
    }, 1500);
    
    $('.ageYear.tell_us_slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
        that.age = parseInt($(".ageYear.tell_us_slider .slick-current .tell_us_slider_age").text());
    });

    $('.tenureYear.tell_us_slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
        that.tenure         = parseInt($(".tenureYear.tell_us_slider .slick-current .tell_us_slider_age").text());
        that.tenureInMonths = that.tenure * 12;
    });
  }

  doSomething(e){
    if(this.monthlyIncome >= (this.maxMonthlyIncome / 3) && this.monthlyIncome <= (this.maxMonthlyIncome / 2)){
      this.steps = 7500;
    }
    else if(this.monthlyIncome >= (this.maxMonthlyIncome / 2) ){
    this.steps = 7500;
    }   
    this.monthlyIncomeComma = "₹" + (this.monthlyIncome ? this.numberPipe.transform(this.monthlyIncome) : "0");  
  }

  toggleClass(id){
    $('#' + id).toggleClass('active')
  }


  activateBar(){
    let currentIndex = this.slides.getActiveIndex() + 1;
    let stepIndex    = $('.calculator_steps .calculator_steps_com  .calculator_steps_com_num span').text();
    $('.calculator_steps .calculator_steps_com:nth-child('+currentIndex+')').addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child('+currentIndex+')').prevAll().addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child('+currentIndex+')').nextAll().removeClass('active');
    this.slides.lockSwipes(true);   
  }
  onSliderChange() {
    var totalHeight   = $('.swiper-slide-active .slide-zoom').height();
    var slide_heading = $('.age_slider_heading').height();
    var nps_first     =  $('.nps_age_first').height();
    var actualheight  = slide_heading + nps_first*1.5;
    $('.tell_us_cont_common').height(totalHeight - actualheight);
  }

  isAmount(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseNumbers']);
      return false;
    }
    return true;
  }

  checkSalaryAmt() {
    if (this.monthlyIncome <= 0                     || 
        this.monthlyIncome >  this.maxMonthlyIncome || 
        this.monthlyIncome <  this.minMonthlyIncome) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + " " +  this.minMonthlyIncome + this.utilitiesProvider.jsErrorMsg['to'] + this.maxMonthlyIncome);
    }
  }

  clearStartZero(option){
    if(this.monthlyIncome == 0     ||
      isNaN(this.monthlyIncome)    ||
      this.monthlyIncome == null){
      this.monthlyIncome = null;
      this.monthlyIncomeComma = "₹" + "";
    }
  }

  next(){
    this.slides.lockSwipes(false);
    this.backBtnhide = false;
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex == 0){
      if(this.age > this.selectAgeBar[this.selectAgeBar.length - 1] || 
         this.age < this.selectAgeBar[0]){
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterAgeAmountBetween'] + this.selectAgeBar[0] + this.utilitiesProvider.jsErrorMsg['to'] + this.selectAgeBar[this.selectAgeBar.length - 1]);
      }
      else{

        this.goToNextSlide();
      }
    }
    if(currentIndex == 1){
      if(this.monthlyIncome <= 0                    || 
         this.monthlyIncome > this.maxMonthlyIncome || 
         this.monthlyIncome < this.minMonthlyIncome){
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterIncomeAmountBetween'] + " " + this.maxMonthlyIncome + this.utilitiesProvider.jsErrorMsg['to'] + this.minMonthlyIncome);
      }
      else{
        this.goToNextSlide();
      }
    }
    if(currentIndex == 2){
      if(this.tenure > this.maxTenure || 
         this.tenure < this.minTenure){
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterIncomeAmountBetween'] + " " + this.maxTenure + this.utilitiesProvider.jsErrorMsg['to'] + this.minTenure);
      }
      if((this.age + this.tenure) > 60){
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['tenureMustBeBelow60']);
      }
      else{
        this.CalculateHomeLoanEligibility();
      }
    }
  }

  goToNextSlide() {
    let currentIndex = this.slides.getActiveIndex();
    this.slides.slideTo(currentIndex + 1, 500);
    this.activateBar();
    this.slides.lockSwipes(true);
  }

  back(){   
    let yOffset = document.getElementById("stepsCount").offsetTop;
    this.content.scrollTo(0, yOffset,0);
    this.slides.lockSwipes(false);
  
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex == 1){
      this.backBtnhide = true;
    }
    if(currentIndex == 0){
      this.monthlyIncome    = this.minMonthlyIncome;
      this.monthlyIncomeComma = "₹" + (this.monthlyIncome ? this.numberPipe.transform(this.monthlyIncome) : "0");
    }
    this.slides.slideTo(currentIndex - 1, 500);
    this.activateBar();
  }

  CalculateHomeLoanEligibility() {
    this.pageLoader = true;
    let request = {
      "CustId"        : this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "MonthlyIncome" : this.monthlyIncome,
      "Age"           : this.age,
      "InterestRate"  : this.interestRate,
      "Tenure"        : this.tenure
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetLoanEligibilityValue').subscribe((response) => {
      this.pageLoader = false;
        if (response.IsSuccess == true) {
          this.navCtrl.push('HomeLoanEligibilityFinalPage', {data : response.Data, pageFrom: this.pageFrom});
        }
        else {
        }
      },
      (error) => {
        this.pageLoader = false
      })
  }

  formatAmount(val) {
    let amount : number = 0;
    let amountStr : String = "";
    if(val && val.trim() != "₹") {
      amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }

    this.monthlyIncomeComma = "₹" + amountStr;
    this.monthlyIncome = amount;
  }
}


