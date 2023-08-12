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
  selector: 'page-magic-compounding',
  templateUrl: 'magic-compounding.html',
})
export class MagicCompoundingPage {

  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;

  public selectYearsBar : any = [];
  public steps = 1000;
  public savingsAmount: number = 0;
  public savingsAmountComma = "0";
  public minSavingsAmount: number = 0;
  public maxSavingsAmount: number = 0;

  public minInvestYears: number = 0;
  public maxInvestYears: number = 0;
  public investYears: number = 0;
  
  public rateOfReturn: number = 0;
  public incrSavingRate: number = 0;

  public status:boolean = false;
  public loading :any;
  public keyboardShow : boolean = false;
  public backBtnhide : boolean = true;
  public pageLoader : boolean = false;
  public pageFrom;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider : UtilitiesProvider,
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
    // console.log(this.utilitiesProvider.defaultData) 
    this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item1.calculators.magic_of_compounding;
    this.minSavingsAmount = parseFloat(this.utilitiesProvider.defaultGoalData.data.mnthly_inv.min);
    this.maxSavingsAmount = parseFloat(this.utilitiesProvider.defaultGoalData.data.mnthly_inv.max);
    this.savingsAmount = this.minSavingsAmount;
    
    let amount : number = 0;
    let amountStr : String = "";
    if(this.savingsAmount) {
      amount = Number(this.savingsAmount.toString().replace(/,/g,"").replace(/₹/g,"").replace(/ /g,""));
      amountStr = amount.toLocaleString('en-IN');
    }

    this.savingsAmountComma = "₹" + amountStr;
    this.minInvestYears = parseInt(this.utilitiesProvider.defaultGoalData.data.tenure_in_yr.min);
    this.maxInvestYears = parseInt(this.utilitiesProvider.defaultGoalData.data.tenure_in_yr.max);
    for(let i = this.minInvestYears;i<=this.maxInvestYears;i++){
      this.selectYearsBar.push(i)
    }
    this.investYears = this.selectYearsBar[0];

    this.rateOfReturn = parseFloat(this.utilitiesProvider.defaultGoalData.data.rate_of_return.default);
    this.incrSavingRate = parseFloat(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.default);

    this.startLoad();

    this.utilitiesProvider.upshotScreenView('MagicofCompounding');
  }
  startLoad(){
    var that = this;
    this.slides.lockSwipes(false);   
    setTimeout(()=>{ 
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
    $('.tell_us_slider').css('opacity',1);
    this.slides.lockSwipes(true);
    },500);

    setTimeout(function(){
      var totalHeight = $('.swiper-slide-active').outerHeight();
      var slide_heading = $('.age_slider_heading').outerHeight();
      var nps_first =  $('.nps_age_first').outerHeight();
      var actualheight= slide_heading + nps_first*1.5;
      $('.tell_us_cont_common').height(totalHeight - actualheight);
    },1500);


    $('.tell_us_slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
      that.investYears = parseInt($(".homeYear.tell_us_slider .slick-current .tell_us_slider_age").text());
    });
  }

  doSomething(e){
    if(this.savingsAmount >= (this.maxSavingsAmount / 3) && this.savingsAmount <= (this.maxSavingsAmount / 2)){
      this.steps = 1000;
    }
    else if(this.maxSavingsAmount >= (this.maxSavingsAmount / 2) ){
    this.steps = 1000;
    }

    this.savingsAmountComma = "₹" + (this.savingsAmount ? this.numberPipe.transform(this.savingsAmount) : "0");
  }
  toggleClass(id){
    $('#' + id).toggleClass('active')
  }

  activateBar(){
    let currentIndex = this.slides.getActiveIndex() + 1;
    let stepIndex = $('.calculator_steps .calculator_steps_com  .calculator_steps_com_num span').text();
    $('.calculator_steps .calculator_steps_com:nth-child('+currentIndex+')').addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child('+currentIndex+')').prevAll().addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child('+currentIndex+')').nextAll().removeClass('active');
    this.slides.lockSwipes(true);   
  }
  onSliderChange() {
    var totalHeight = $('.swiper-slide-active .slide-zoom').height();
    var slide_heading = $('.age_slider_heading').height();
    var nps_first =  $('.nps_age_first').height();
    var actualheight= slide_heading + nps_first*1.5;
    $('.tell_us_cont_common').height(totalHeight - actualheight);
    }
 
  next(){
    this.backBtnhide = false;
    this.slides.lockSwipes(false);
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex == 0){
      if(this.savingsAmount > this.maxSavingsAmount || 
         this.savingsAmount < this.minSavingsAmount){
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterAgeAmountBetween'] + " " + this.minSavingsAmount + this.utilitiesProvider.jsErrorMsg['to'] + this.maxSavingsAmount);
      }
      else{
        this.goToNextSlide();
      }
    }
    if(currentIndex == 1){
      if(this.investYears <= 0                    || 
         this.investYears > this.selectYearsBar[this.selectYearsBar.length - 1] || 
         this.investYears < this.selectYearsBar[0]){
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterIncomeAmountBetween'] + " " + this.selectYearsBar[0] + this.utilitiesProvider.jsErrorMsg['to'] + this.selectYearsBar[this.selectYearsBar.length - 1]);
      }
      else{
        this.CalculateCompounding();
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
    this.slides.lockSwipes(false);   
    let yOffset = document.getElementById("stepsCount").offsetTop;
    this.content.scrollTo(0, yOffset,0)
  
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex == 1){
      this.backBtnhide = true;
    }
    this.slides.slideTo(currentIndex - 1, 500);
    this.activateBar();
  }

  isAmount(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseNumbers']);
      return false;
    }
    return true;
  }

  checkSavingsAmt() {
    if (this.savingsAmount > this.maxSavingsAmount) {
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDepositAmountBetween'] + this.minSavingsAmount + this.utilitiesProvider.jsErrorMsg['to'] + this.maxSavingsAmount);
    }
  }

  CalculateCompounding() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "MonthlyInvestment":this.savingsAmount,
      "Tenure":this.investYears,
      "RateOfReturn":this.rateOfReturn,
      "IncrementalSavingsRate": this.incrSavingRate
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetCompoundingValues').subscribe((response) => {
      this.pageLoader = false;
        if (response.IsSuccess == true) {
          this.navCtrl.push('MagicCompoundingFinalPage', {data : response.Data, pageFrom: this.pageFrom});
          
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

    this.savingsAmountComma = "₹" + amountStr;
    this.savingsAmount = amount;
  }
}

