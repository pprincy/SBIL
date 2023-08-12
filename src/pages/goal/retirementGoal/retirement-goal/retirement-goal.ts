import { Component,ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides, LoadingController} from 'ionic-angular';
import  '../../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import {UtilitiesProvider} from '../../../../providers/utilities/utilities';
import { Keyboard } from '@ionic-native/keyboard';
import { DecimalPipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-retirement-goal',
  templateUrl: 'retirement-goal.html',
})
export class RetirementGoalPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  public selectHomeBar : any = [];
  public steps = 100;
  public amount;
  public minMonthlyExpenses; maxMonthlyExpenses; minDownPayPer; maxDownPayPer; 
  public monthlyExpenses : any;
  public monthlyExpensesComma : any;
  public status:boolean = false;
  public loading :any;
  public keyboardShow : boolean = false;
  public backBtnhide : boolean = true;
  public ageNow; ageDuring; scrollHeight; goalTime = 0;
  public courseType ="UG";
  public courseFieldList : any = [];
  public courseField;
  public collegeIsIndia :any = "yes";
  public countryList : any = [];
  public country;
  public dropType : boolean = true;
  public breakUp : any = [];
  public pageLoader : boolean = false;
  public userAge;
  public breakupArray : any = [];
  public getBreakUpData : any = [];
  public pageFrom;
  public currentAge: boolean = false;
  public retireAge: boolean = false;
  public diffVal;
  public ageStatus = "retire";
  public sliderAgeNowAge;
  public selectedDuringAge;
  public showMoreOptions = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider : UtilitiesProvider,
    private loadingCtrl: LoadingController,
    private numberPipe: DecimalPipe,
    private keyboard: Keyboard,
    private cdr: ChangeDetectorRef) {
    
      this.keyboard.onKeyboardShow().subscribe(data => {
        this.keyboardShow = true;
      });
      this.keyboard.onKeyboardHide().subscribe(data => {
        this.keyboardShow = false;
      });
     if(this.utilitiesProvider.UserProfileMaster){
      this.breakUp = this.utilitiesProvider.UserProfileMaster.Table;
      for(let i=0; i < this.breakUp.length ; i ++){
        this.breakUp[i].amount = '';
        this.breakUp[i].id = this.breakUp[i].MonthlyExpenseID;
      }
      this.getUserDetails();
      // console.log("this.breakUp***",this.breakUp)
     }

     this.pageFrom = this.navParams.get('pageFrom');
  }
  ionViewDidEnter(){
    this.userAge = this.restapiProvider.userData['age'];
    this.slides.lockSwipes(true);
    this.slides.update();
   let a =  $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
    if(a){
      this.scrollHeight= a;
    }

   this.utilitiesProvider.upshotScreenView('RetirementGoal');
  }

  ionViewDidLoad() {
    // console.log("retirments--",this.utilitiesProvider.defaultData.Item2.goals)
    this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item2.goals.retirement;
    this.minMonthlyExpenses = parseInt(this.utilitiesProvider.defaultGoalData.data.curr_mnthly_exp.min);
    this.maxMonthlyExpenses = parseInt(this.utilitiesProvider.defaultGoalData.data.curr_mnthly_exp.max);
      this.startLoad();
   //   this.courseFieldFun();

      $('.showmore .shmore').click(function () {
        $(this).toggle();
        $(this).siblings().show();
        $('.calculator_grid_wrapper').show();
      });
      $('.showmore .lessmore').click(function () {
        $(this).toggle();
        $(this).siblings().show();
        $('.calculator_grid_wrapper').hide();
      });

      this.monthlyExpenses = this.minMonthlyExpenses;
      let amount : number = 0;
          let amountStr : String = "";
          if(this.monthlyExpenses) {
            amount = Number(this.monthlyExpenses.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
            amountStr = amount.toLocaleString('en-IN');
          }
     this.monthlyExpensesComma = "₹" + amountStr;
  }
 startLoad(){
  this.ageNow= this.utilitiesProvider.age18;
  this.ageDuring=this.utilitiesProvider.age40;
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
  $('.tell_us_cont_common').css('opacity',1);
  this.slides.lockSwipes(true);
  },500);

  setTimeout(()=>{
    let that = this;
       $(".tell_us_slider.sliderAgeNow div").each(function(){
      var curAge = parseInt($(this).find('.tell_us_slider_age').html());
      if(curAge == that.userAge)
      {
      $(this).not('.slick-cloned').trigger('click');
      }
      })

      if(parseInt(this.userAge) > 60){
        $(".tell_us_slider.sliderDuring div").each(function(){
          var curAge = parseInt($(this).find('.tell_us_slider_age').html());
          if(curAge == ((parseInt(that.userAge) + 1)))
          {
          $(this).not('.slick-cloned').trigger('click');
          }
          })
      }
      if(parseInt(this.userAge) < 60){
        $(".tell_us_slider.sliderDuring div").each(function(){
          var curAge = parseInt($(this).find('.tell_us_slider_age').html());
          if(curAge == 60)
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
  let that = this;
  $('.tell_us_slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
    that.sliderAgeNowAge = parseInt($(".sliderAgeNow.tell_us_slider .slick-current .tell_us_slider_age").text());
    that.selectedDuringAge = parseInt($(".sliderDuring.tell_us_slider .slick-current .tell_us_slider_age").text());
    let diff = that.selectedDuringAge  -  that.sliderAgeNowAge;
    $(".diff").html(diff);
    that.diffVal = diff;
    if(that.selectedDuringAge <= that.sliderAgeNowAge){
    $('.year_cal').addClass('display_error');
    }
    else{
      $('.year_cal').removeClass('display_error');
    }
    });
 }

  doSomething(e){
    if(this.monthlyExpenses >= (this.maxMonthlyExpenses / 3) && this.amount <= (this.maxMonthlyExpenses / 2)){
      this.steps = 1000;
    }
    else if(this.monthlyExpenses >= (this.maxMonthlyExpenses / 2) ){
    this.steps = 2000;
    }
    this.monthlyExpensesComma = "₹" + (this.monthlyExpenses ? this.numberPipe.transform(this.monthlyExpenses.toString().replaceAll(",","")) : "");
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
    if(this.diffVal <=0) return;
    let timeTogoal = $('.diff').text();
    let a =  timeTogoal.split(" ");
    this.goalTime = parseInt(a[0]);
    this.backBtnhide = false;
    this.slides.lockSwipes(false);
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex == 1){
      if(this.monthlyExpenses > this.maxMonthlyExpenses || this.monthlyExpenses < this.minMonthlyExpenses){
        this.restapiProvider.presentToastTop("Please enter your monthly expenses between " + this.minMonthlyExpenses + " to " + this.maxMonthlyExpenses)
      }
      else{
        this.calculateRetirementGoal()
       
      }
    }
    else{
      
       if(this.goalTime <= 0){
        this.backBtnhide = true;
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
  

  calculateRetirementGoal(){
    this.pageLoader = true;
      let request = {
        "CustId": this.restapiProvider.userData['CustomerID'],
        'TokenId': this.restapiProvider.userData['tokenId'],
        "CurrentAge": parseInt($(".sliderAgeNow.tell_us_slider .slick-current .tell_us_slider_age").text()),
        "RetirementAge":parseInt($(".sliderDuring.tell_us_slider .slick-current .tell_us_slider_age").text()),
        "CurrentExpenditure":this.monthlyExpenses,
        "LumpsumAvailable":parseFloat(this.utilitiesProvider.defaultGoalData.data.lumpsum_avlbl.default),
        "Inflation": parseFloat(this.utilitiesProvider.defaultGoalData.data.inflation_rate.default), 
        "IncrementalSavings":parseFloat(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.default),
        "LumpsumCompound":parseFloat(this.utilitiesProvider.defaultGoalData.data.lumpsum_compound.default),
        "RiskProfile":""
         }
    return this.restapiProvider.sendRestApiRequest(request, 'CalculateRetirementGoal').subscribe((response) => {
      this.pageLoader = false; 
      if (response.IsSuccess == true) {
        if(this.breakupArray.length > 0){
          this.updateUserMonthlyExpense();
        }
          this.navCtrl.push('RetirementGoalFinalPage', {data : response.Data, drivenFrom: this.pageFrom, breakup: this.breakUp});
        }
        else {
          // console.log(response);
        }
      },
      (error) => {
        this.pageLoader = false;
      })
  }
 
  showMore(t){
    this.dropType = t;
    this.monthlyExpenses = 0;
    this.monthlyExpensesComma = "₹" ;
    this.setDefaultAmount();
    // if(t == true){
    //   this.monthlyExpenses = parseInt(this.utilitiesProvider.defaultGoalData.data.curr_mnthly_exp.default);
    // }
    // else{
    //   this.monthlyExpenses = 0;
    //   this.setDefaultAmount();
    // }
  }
  // breakUpChanges(id) {
  //   if (id) {
  //     for (let i = 0; i <= this.breakUp.length; i++) {
  //       if (id == this.breakUp[i].MonthlyExpenseID) {
  //         this.breakUp[i].amount = $('.input#' + id + ' .text-input').val();
  //         this.monthlyExpenses = this.utilitiesProvider.getTotal(this.breakUp);
  //         console.log(this.monthlyExpenses )
  //         break;
  //       }
  //     }
  //   }
  //   else {
  //     $("#" + id).focus()
  //   }
  // }
  breakUpChange(MonthlyExpense) {
    if (MonthlyExpense) {
      for (let i = 0; i <= this.breakUp.length; i++) {
        if (MonthlyExpense.MonthlyExpenseID == this.breakUp[i].MonthlyExpenseID) {
          let val = $('.input#' + MonthlyExpense.MonthlyExpenseID + ' .text-input').val();

          let amount : number = 0;
          let amountStr : String = "";
          if(val) {
            amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
            amountStr = amount.toLocaleString('en-IN');
          }
          this.breakUp[i].amount = amountStr;
          this.monthlyExpenses = this.utilitiesProvider.getTotal(this.breakUp);
          
          let amount2 : number = 0;
          let amountStr2 : String = "0";
          if(this.monthlyExpenses) {
            amount2 = Number(this.monthlyExpenses.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
            amountStr2 = amount2.toLocaleString('en-IN');
          }
          this.monthlyExpensesComma = "₹" + amountStr2;
          // console.log(this.monthlyExpenses )
          break;
        }
      }
      
      if(this.breakupArray.length > 0){
     for(let j = 0; j < this.breakupArray.length; j++){
      if(MonthlyExpense.MonthlyExpenseID == this.breakupArray[j].MonthlyExpenseID){
        this.breakupArray[j].amount = MonthlyExpense.amount;
          // console.log(this.breakupArray);
          break;
      }
      else{
        if(j == (this.breakupArray.length - 1)){
          setTimeout(()=>{
            this.breakupArray.push(MonthlyExpense);
            // console.log(this.breakupArray)
          },500)
        }
      }
     }
    }
      else{
        setTimeout(()=>{
          this.breakupArray.push(MonthlyExpense);
          // console.log(this.breakupArray)
        },500)
      }
      
    }
    else {
      $("#" + MonthlyExpense.MonthlyExpenseID).focus()
    }
  }
 

  updateUserMonthlyExpense() {
    this.pageLoader = true;
    let a = [];
    for (let i = 0; i < this.breakupArray.length; i++) {
    let b = {
      "MonthlyExpenseID":this.breakupArray[i].MonthlyExpenseID,
      "amount" :  this.breakupArray[i].amount.toString().replaceAll(",",""),
      "id" :  this.breakupArray[i].MonthlyExpenseID
    }
    a.push(b);
    }
  
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "Products": a
    }
    this.restapiProvider.sendRestApiRequest(request, 'UpdateUserMonthlyExpense').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        if (response.Data.Table[0].Status == 'Success'){
          //this.breakupArray = JSON.parse(a);
          // if(this.restapiProvider.userData['getUserProfileMaster']){
          //   this.utilitiesProvider.UserProfileMaster =  JSON.parse(this.restapiProvider.userData['getUserProfileMaster']);
          // //  this.breakUp = this.utilitiesProvider.UserProfileMaster.Table;
          // }   
        }
      }
    },
      (error) => {
        this.pageLoader = false;
      });
  }



  getUserDetails() {
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId']
    }
    this.restapiProvider.sendRestApiRequest(request, 'GetUserDetails').subscribe((response) => {
      if (response.IsSuccess == true) {
        this.getBreakUpData = response.Data.Table4;
          this.setDefaultAmount();
      }
      else {
      }
    },
      (error) => {
      });
  }

setDefaultAmount(){
  this.breakupArray = [];
  if(this.getBreakUpData.length > 0){
    for(let i = 0; i < this.getBreakUpData.length ; i ++){
    for(let j = 0 ; j < this.breakUp.length; j++ ){
       if(this.breakUp[j].MonthlyExpenseID == this.getBreakUpData[i].ExpenseID){
        this.breakUp[j].amount = parseInt(this.getBreakUpData[i].ExpenseValue).toLocaleString('en-IN');
        this.monthlyExpenses  = (this.monthlyExpenses ? this.monthlyExpenses : 0)  + parseInt(this.getBreakUpData[i].ExpenseValue)
        
        let amount : number = 0;
        let amountStr : String = "";
        if(this.monthlyExpenses) {
          amount = Number(this.monthlyExpenses.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
          amountStr = amount.toLocaleString('en-IN');
        }
        this.monthlyExpensesComma = "₹" + amountStr;
        this.breakupArray.push(this.breakUp[j]);
        this.cdr.detectChanges();
       }
    }
    }
  }
  else{
    this.monthlyExpenses = parseInt(this.utilitiesProvider.defaultGoalData.data.curr_mnthly_exp.default);
  }
}

formatAmount(val) {
  let amount : number = 0;
  let amountStr : String = "";
  if(val && val.trim() != "₹") {
    amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
    amountStr = amount.toLocaleString('en-IN');
  }
  
  this.monthlyExpensesComma = "₹" + amountStr;
  this.monthlyExpenses = amount;
}

setAgeState(ageState){
  $('.tell_us_slider .slick-current').trigger('click');
  console.log("agests",ageState);
  if(ageState == "age")
  {
    this.ageStatus = ageState;
    this.currentAge = true;
    this.retireAge = true;
  }
  else if(ageState == "retire"){
    this.ageStatus = ageState;
    this.retireAge = false;
    this.currentAge = false;
  }
  // console.log("#####################");
  // console.log(this.currentAge);
  // console.log(this.retireAge);
  // console.log("#####################");
  // console.log(this.ageStatus);
}

}

