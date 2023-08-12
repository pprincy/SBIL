import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides, LoadingController} from 'ionic-angular';
import  '../../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import {UtilitiesProvider} from '../../../../providers/utilities/utilities';
import { DecimalPipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-custom-goal',
  templateUrl: 'custom-goal.html',
})
export class CustomGoalPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;

  public steps = 10000;
  public amount;
  public minValue;
  public maxValue;
  public minCarCost; maxCarCost;carCost;
  public minTimeToGoal; maxTimeToGoal;
  public minDownPayPer; maxDownPayPer; downPaymentPer; downPayment; minDownPayment;maxDownPayment;
  public timeToGoalArray :  any = [];
  public isBtnActive:boolean = false;
  public status:boolean = false;
  public postJson : any = {};
  public backBtnhide : boolean = true;
  public carList : any = [];
  public loading :any; 
  public scrollHeight;
  public myGoal : any = [];
  public myGoalName;
  public timeToGoal;
  public minCostOfDream; maxCostOfDream; costOfDream; costOfDreamComma;
  public pageLoader : boolean = false;
  public selectedGoal = 0;
  public selectedGoalName;
  public timeToGoalTemp;
  public pageFrom;
  public yearsVal = 0;
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

    this.pageLoader = true;
    this.myGoal = this.utilitiesProvider.langJsonData['customGoal']['goalList']
    setTimeout(() => {
      this.pageLoader = false;
    }, 1000)
      
    
    this.myGoalName = this.myGoal[this.selectedGoal].goalName
      
    this.slides.lockSwipes(true);
    this.slides.update();
   let a =  $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
   if(a){
    this.scrollHeight= a;
   }
    //$('.scroll_div .scroll-content').attr('style',this.scrollHeight);
   // $('.scroll_div .fixed-content').attr('style',this.scrollHeight);
   this.utilitiesProvider.upshotScreenView('CustomGoal');
  }
  ionViewDidLoad() {
    // console.log(this.utilitiesProvider.defaultData.Item2.goals)
    this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item2.goals.target;
    this.minCostOfDream = parseInt(this.utilitiesProvider.defaultGoalData.data.amount_reqd.min);
    this.maxCostOfDream = parseInt(this.utilitiesProvider.defaultGoalData.data.amount_reqd.max);
    this.carCost = parseInt(this.utilitiesProvider.defaultGoalData.data.amount_reqd.min);
    this.minTimeToGoal =parseInt(this.utilitiesProvider.defaultGoalData.data.duration_in_yr.min);
    this.maxTimeToGoal =parseInt(this.utilitiesProvider.defaultGoalData.data.duration_in_yr.max);
      this.costOfDream = this.minCostOfDream;
      
      let amount : number = 0;
      let amountStr : String = "";
      if(this.costOfDream) {
        amount = Number(this.costOfDream.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
        amountStr = amount.toLocaleString('en-IN');
      }
      this.costOfDreamComma = "₹" + amountStr;
    
    // console.log(this.utilitiesProvider.defaultGoalData);  
      for(let i = this.minTimeToGoal;i <= this.maxTimeToGoal; i++){
        this.timeToGoalArray.push(i);
      }
    this.startLoad();
  }
 startLoad(){
 this.slides.lockSwipes(true);   
  setTimeout(()=>{
    $('.tell_us_slider').not('.slick-initialized').slick({
      focusOnSelect: true,dots: false,infinite: true,
      speed: 300,cssEase: 'linear',slidesToShow: 7,slidesToScroll: 5,
     centerMode: true,variableWidth: true, arrows: false
    }); 
       $('.tell_us_slider .slick-current').trigger('click');
      $('.tell_us_slider').css('opacity',1);
    },900);

  setTimeout(()=>{ 
  $('.car_goal_slider').not('.slick-initialized').slick({
    focusOnSelect: true, dots: false,infinite: true,
    speed: 300,cssEase: 'linear', slidesToShow: 3,centerPadding:'20px',
    slidesToScroll: 1,centerMode: true,arrows: false
}); 
$('.car_goal_slider_wrap').css('opacity',1);
},1200);
  setTimeout(function(){
    var totalHeight = $('.swiper-slide-active').outerHeight();
    var slide_heading = $('.age_slider_heading').outerHeight();
    var nps_first =  $('.nps_age_first').outerHeight();
    var actualheight= slide_heading + nps_first*1.5;
     $('.tell_us_cont_common').height(totalHeight - actualheight);
  },1500);

  let _that = this;
  $('.tell_us_slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
    let time2Goal = parseInt($(".tell_us_slider .slick-current .tell_us_slider_age").text());
    let d = new Date();
    _that.yearsVal = d.getFullYear() + time2Goal;
  });
 }

 GoalSelect(goalName, goalID){
  let selectedYearHome = goalName;
  this.selectedGoal = goalID;
  this.selectedGoalName = goalName;
  
  if(selectedYearHome == "Other"){
    this.myGoalName = "";
  }
  else{
    this.myGoalName = selectedYearHome;
  }
 }

  doSomething(){
    if(this.costOfDream >= (this.maxCostOfDream / 3) && this.costOfDream <= (this.maxCostOfDream / 2)){
      this.steps = 50000;
    }
    else if(this.costOfDream >= (this.maxCostOfDream / 2) ){
    this.steps = 75000;
    }  
    this.costOfDreamComma = "₹" + (this.costOfDream ? this.numberPipe.transform(this.costOfDream.toString().replaceAll(",","")) : "0");
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
       if(this.myGoalName){
        this.slides.slideTo(currentIndex + 1, 500);
        this.activateBar();
        this.slides.lockSwipes(true);
        this.selectTimeToGoal();
       }
       else{
        this.backBtnhide = true;
        this.slides.lockSwipes(true);
       }
      }
      if(currentIndex == 1){
      let time2Goal = parseInt($(".tell_us_slider .slick-current .tell_us_slider_age").text());
      if(time2Goal){
        this.slides.slideTo(currentIndex + 1, 500);
        this.activateBar();
        this.slides.lockSwipes(true);
      }
      }
      if(currentIndex == 2){
        if(this.costOfDream >= this.minCostOfDream && this.costOfDream <= this.maxCostOfDream ){
          this.calculateTargetGoal();
        }
        else{
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterAmountBetween'] + " " +  this.minCostOfDream +  " "+ this.utilitiesProvider.jsErrorMsg['to'] + " " +  this.maxCostOfDream)
        }
      }
              // this.navCtrl.push('CustomGoalFinalPage');

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

  
    calculateTargetGoal() {
      this.pageLoader = true;
      let request = {
        "CustId": this.restapiProvider.userData['CustomerID'],
        'TokenId': this.restapiProvider.userData['tokenId'],
        "TargetAmount": this.costOfDream,
        "Period":  parseInt($(".tell_us_slider .slick-current .tell_us_slider_age").text()), 
        "LumpsumAvailable":parseFloat(this.utilitiesProvider.defaultGoalData.data.lumpsum_avlbl.default),
        "Inflation":parseFloat(this.utilitiesProvider.defaultGoalData.data.inflation_rate.default), 
        "IncrementalSavings":parseFloat(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.default),
        "LumpsumCompound":parseFloat(this.utilitiesProvider.defaultGoalData.data.lumpsum_compound.default),
        "RiskProfile":"", 
        }
        // console.log(request)
      return this.restapiProvider.sendRestApiRequest(request, 'CalculateTargetGoal').subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
            response.Data.imgFilled   =   this.myGoal[this.selectedGoal].imgFilled  ;
            response.Data.imgUnFiled   =  this.myGoal[this.selectedGoal].imgUnFiled
            response.Data.goalId = this.myGoal[this.selectedGoal].goalId;
            response.Data.goalName = this.myGoal[this.selectedGoal].goalName;
            this.navCtrl.push('CustomGoalFinalPage', {data : response.Data, drivenFrom: this.pageFrom});
          }
          else {
          }
        },
        (error) => {
          this.pageLoader = false;
        })
    }

    selectTimeToGoal(){
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
      },500);
    }

    formatAmount(val) {
      let amount : number = 0;
      let amountStr : String = "";
      if(val && val.trim() != "₹") {
        amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
        amountStr = amount.toLocaleString('en-IN');
      }

      this.costOfDreamComma = "₹" + amountStr;
      this.costOfDream = amount;
    }
}


