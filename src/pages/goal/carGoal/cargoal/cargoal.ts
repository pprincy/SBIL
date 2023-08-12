import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides, LoadingController} from 'ionic-angular';
import  '../../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import {UtilitiesProvider} from '../../../../providers/utilities/utilities';
import { DecimalPipe } from '@angular/common';
import { config } from '../../../../shared/config';


@IonicPage()
@Component({
  selector: 'page-cargoal',
  templateUrl: 'cargoal.html',
})
export class CargoalPage {
  @ViewChild(Content) content: Content;
  public steps = 20000;
  public amount; public minValue;
  public maxValue; public minCarCost;
  public maxCarCost; public carCost;carCostComma;
  public minTimeToBuyCar; public maxTimeToBuyCar;
  public minDownPayPer; public maxDownPayPer; 
  public  downPaymentPer; public downPayment;downPaymentComma;
  public minDownPayment; public maxDownPayment;
  public timeToBuyCarRange :  any = [];
  public isBtnActive:boolean = false;
  public status:boolean = false;
  public postJson : any = {};
  public backBtnhide : boolean = true;
  public carList : any = [];
  public imgURL;
  public imgURLNew;
  public pageLoader : boolean = false;
  public timeToGoalTemp;
  public pageFrom;
  public selectedCar = "Hatch Back";

  @ViewChild(Slides) slides: Slides;
  loading :any;scrollHeight;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider : UtilitiesProvider,
    private numberPipe: DecimalPipe,
    private loadingCtrl: LoadingController) {
      this.pageFrom = this.navParams.get('pageFrom');
  }
  ionViewDidEnter(){
    if(this.navParams.get("data")){
     this.timeToGoalTemp = parseInt(this.navParams.get("data"))
    }
    else{
      this.timeToGoalTemp =  0;
    }
    this.imgURL = this.restapiProvider.getImageURL();
    this.imgURLNew = config.imgURLNew;
    this.slides.lockSwipes(true);
    this.slides.update();
   let a =  $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
   if(a){
    this.scrollHeight= a;
   }
    //$('.scroll_div .scroll-content').attr('style',this.scrollHeight);
   // $('.scroll_div .fixed-content').attr('style',this.scrollHeight);

   this.utilitiesProvider.upshotScreenView('CarGoal');
  }
  ionViewDidLoad() {
    this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item2.goals.car;
    this.minCarCost = parseInt(this.utilitiesProvider.defaultGoalData.data.cost.min);
    this.maxCarCost = parseInt(this.utilitiesProvider.defaultGoalData.data.cost.max);
    this.carCost = parseInt(this.utilitiesProvider.defaultGoalData.data.cost.min);
    
    let amount : number = 0;
    let amountStr : String = "";
    if(this.carCost) {
      amount = Number(this.carCost.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }

    this.carCostComma = "₹" + amountStr;
    
    this.minTimeToBuyCar =parseInt(this.utilitiesProvider.defaultGoalData.data.duration_in_yr.min);
    this.maxTimeToBuyCar =parseInt(this.utilitiesProvider.defaultGoalData.data.duration_in_yr.max);
    this.minDownPayPer = parseInt(this.utilitiesProvider.defaultGoalData.data.downpayment_perc.min);
    this.maxDownPayPer = parseInt(this.utilitiesProvider.defaultGoalData.data.downpayment_perc.max);
    this.downPaymentPer = parseInt(this.utilitiesProvider.defaultGoalData.data.downpayment_perc.default);
    this.downPayment = this.minCarCost;
    this.downPaymentComma = "₹" + (this.downPayment ? this.numberPipe.transform(this.downPayment.toString().replaceAll(",","")) : "0");
    this.minDownPayment =  this.minCarCost;
    this.maxDownPayment = this.minCarCost;
    // console.log(this.utilitiesProvider.defaultGoalData);  
      for(let i = this.minTimeToBuyCar;i <= this.maxTimeToBuyCar; i++){
        this.timeToBuyCarRange.push(i);
      }
    this.startLoad();
    this.pageLoader = true;
  }
 startLoad(){
 this.slides.lockSwipes(true);   
  setTimeout(()=>{
    this.carList = this.utilitiesProvider.defaultGoalData.data.cost.default.type;
    this.pageLoader = false;
    // for(let i=0; i < this.carList.length; i++){
    //   this.carList[i].imagepath = this.carList[i].imagepath;
    // }
    $('.tell_us_slider').not('.slick-initialized').slick({
      focusOnSelect: true,dots: false,infinite: true,
      speed: 300,cssEase: 'linear',slidesToShow: 7,slidesToScroll: 5,
     centerMode: true,variableWidth: true, arrows: false
    }); 
  $('.tell_us_slider .slick-current').trigger('click');
  $('.tell_us_slider').css('opacity',1);
  },500);

  setTimeout(()=>{ 
  $('.car_goal_slider').slick({
    focusOnSelect: true, dots: false,infinite: true,
    speed: 300,cssEase: 'linear', slidesToShow: 3,
    slidesToScroll: 1,centerMode: true,swipe:false,arrows: false
}); 
$('.car_goal_slider_wrap').css('opacity',1);
},500);

setTimeout(()=>{
  let that = this;
  if(this.timeToGoalTemp > 0){
  $(".tell_us_slider.dOneSlider div").each(function(){
    var curAge = parseInt($(this).find('.tell_us_slider_age').html());
    if(curAge == that.timeToGoalTemp)
    {
        $(this).not('.slick-cloned').trigger('click');
    }
    })
  }
},1500)



  setTimeout(function(){
    var totalHeight = $('.swiper-slide-active').outerHeight();
    var slide_heading = $('.age_slider_heading').outerHeight();
    var nps_first =  $('.nps_age_first').outerHeight();
    var actualheight= slide_heading + nps_first*1.5;
     $('.tell_us_cont_common').height(totalHeight - actualheight);
  },1500);
  $('.tell_us_slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
    let retirementCorpusDateVar = new Date();
    let d = retirementCorpusDateVar.getFullYear();
    let selectedYearHome = parseInt($(".tell_us_slider .slick-current .tell_us_slider_age").text());
      $('.diffYear').html(d + selectedYearHome);
    });
     var that = this;
    $('.car_goal_slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
        that.changeCar("0", '');
      });
 }

 changeCar(cost, name){
  this.selectedCar = name;
  let amount : number = 0;
  let amountStr : String = "";
  if(cost) {
    amount = Number(cost.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
    amountStr = amount.toLocaleString('en-IN');
  }

  this.carCostComma = "₹" + amountStr;
  this.carCost = amount;
 }
  doSomething(e){
    if(this.carCost >= (this.maxCarCost / 3) && this.carCost <= (this.maxCarCost / 2)){
      this.steps = 50000;
    }
    else if(this.carCost >= (this.maxCarCost / 2) ){
    this.steps = 75000;
    }
    this.carCostComma = "₹" + (this.carCost ? this.numberPipe.transform(this.carCost.toString().replaceAll(",","")) : "");      
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
        this.maxDownPayment = this.carCost;
        this.downPayment = (this.maxDownPayment * this.downPaymentPer) / 100;
        this.downPaymentComma = "₹" + (this.downPayment ? this.numberPipe.transform(this.downPayment.toString().replaceAll(",","")) : "0");
      }
       if(currentIndex == 2){
        let minDown  = (this.maxDownPayment * this.minDownPayPer) / 100;
        if(this.downPayment  <  minDown ||   this.downPayment > this.maxDownPayment){
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterDownPaymentBetween'] +  " " + this.minDownPayment + " " + this.utilitiesProvider.jsErrorMsg['to'] + " " +  this.maxDownPayment)
        }
        else{
        this.CalculateCarGoal();
        }
      }
      else{
        if(this.carCost  <  this.minCarCost ||   this.carCost > this.maxCarCost){
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterAmountBetween']+ " " +  this.minCarCost + " " +this.utilitiesProvider.jsErrorMsg['to'] + " " + this.maxCarCost)
        }
        else{
          this.slides.slideTo(currentIndex + 1, 500);
          this.activateBar();
          this.slides.lockSwipes(true);
        }
          
      }
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
    changeDownPayment(type){
      this.maxDownPayment = this.carCost;
      if(type == "range"){
        this.downPayment = (this.maxDownPayment * this.downPaymentPer) / 100;

        let amountStr : String = "";
        if(this.downPayment) {
          amountStr = this.downPayment.toLocaleString('en-IN');
        }
        this.downPaymentComma = "₹" + amountStr;
      }
      if(type == "input"){
        let amount : number = 0;
        let amountStr : String = "";
        if(this.downPaymentComma) {
          amount = Number(this.downPaymentComma.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
          amountStr = amount.toLocaleString('en-IN');
        }

        this.downPaymentComma = "₹" + amountStr;
        this.downPayment = amount;
        let per  =  (this.downPayment * 100) / this.maxDownPayment;
        this.downPaymentPer = per.toLocaleString('en-IN', {minimumFractionDigits: 2});  
      }
    }
  
    CalculateCarGoal() {
      this.pageLoader = true;
      let request = {
        "CustId": this.restapiProvider.userData['CustomerID'],
        'TokenId': this.restapiProvider.userData['tokenId'],
        "CurrentAmount": this.carCost,
        "Period": $(".tell_us_slider .slick-current .tell_us_slider_age").text(), 
        "LumpsumAvailable":parseFloat(this.utilitiesProvider.defaultGoalData.data.lumpsum_avlbl.default),
        "Inflation":parseFloat(this.utilitiesProvider.defaultGoalData.data.inflation_rate.default), 
        "IncrementalSavings":parseFloat(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.default),
        "LumpsumCompound":parseFloat(this.utilitiesProvider.defaultGoalData.data.lumpsum_compound.default),
        "RiskProfile":"", 
        "DownPaymentPerc": this.downPaymentPer,
        "EMIInterest":parseFloat(this.utilitiesProvider.defaultGoalData.data.emi_int_rate.min), 
        "LoanAmount": "",
        "LoanDuration": parseFloat(this.utilitiesProvider.defaultGoalData.data.loan_duration_yr.min)
        }
        // console.log(request)
      return this.restapiProvider.sendRestApiRequest(request, 'CalculateCarGoal').subscribe((response) => {
          if (response.IsSuccess == true) {
            this.pageLoader = false;
            let carTypeName = $(".car_goal_slider .slick-current .car_goal_slider_item_inner h4").text();
            this.navCtrl.push('CargoalfinalPage', {data : response.Data, drivenFrom: this.pageFrom, carType: carTypeName});
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

      this.carCostComma = "₹" + amountStr;
      this.carCost = amount;
    }
}

