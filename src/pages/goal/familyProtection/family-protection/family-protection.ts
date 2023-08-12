import { Component,ViewChild, ChangeDetectorRef  } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides, LoadingController} from 'ionic-angular';
import  '../../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import {UtilitiesProvider} from '../../../../providers/utilities/utilities';
import { Keyboard } from '@ionic-native/keyboard';
import {MyApp} from '../../../../app/app.component';
import { DecimalPipe } from '@angular/common';
@IonicPage()
@Component({
  selector: 'page-family-protection',
  templateUrl: 'family-protection.html',
})
export class FamilyProtectionPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  public selectHomeBar : any = [];
  public steps = 100;
  public amount;
  public minMonthlyExpenses; maxMonthlyExpenses; monthlyExpenses; minDownPayPer; maxDownPayPer; 
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
  public minMonthlyIncome;
  public maxMonthlyIncome;
  public monthlyIncome:any;
  public monthlyIncomeRange:any;
  public breakupArray : any = [];
  public getBreakUpData : any = [];
  public showBreakUp : boolean = false;
  public qThree : any = [];
  public qFour : any = [];
  public popupShow : boolean = false;
  public popupText;
  public pageFrom;
  public currentAge: boolean = false;
  public retireAge: boolean = false;
  public diffVal;
  public ageStatus = "retire";
  public sliderAgeNowAge;
  public selectedDuringAge;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider : UtilitiesProvider,
    private loadingCtrl: LoadingController,
    private keyboard: Keyboard,
    private cdr: ChangeDetectorRef,
    private numberPipe: DecimalPipe,
    public myApp : MyApp) {
      this.keyboard.onKeyboardShow().subscribe(data => {
        this.keyboardShow = true;
      });
      this.keyboard.onKeyboardHide().subscribe(data => {
        this.keyboardShow = false;
      });

      this.pageFrom = this.navParams.get('pageFrom')
  }
  ionViewDidEnter(){
    // console.log("Previous Page is called = " + this.navCtrl.last().name);
      if(this.navCtrl.last().name == "FamilyProtectionFinalPage"){
        this.slides.lockSwipes(false);
       let currentIndex = this.slides.getActiveIndex();
       if(currentIndex == 4){
         this.slides.slideTo(2, 500);
         this.activateBar();
         this.slides.lockSwipes(true);
       }
     }
    
    this.userAge = this.restapiProvider.userData['age'];
    this.slides.lockSwipes(true);
    this.slides.update();
   let a =  $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
    if(a){
      this.scrollHeight= a;
    }

    this.utilitiesProvider.upshotScreenView('FamilyProtectionGoal');
  }

  ionViewDidLoad() {
    let monthIncome:any;
    this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item2.goals.family_protection;
    this.minMonthlyIncome = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_income.min);
    this.maxMonthlyIncome = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_income.max);

 if(this.restapiProvider.userData['userPersonalDetails']){
      monthIncome =parseInt(JSON.parse(this.restapiProvider.userData['userPersonalDetails']).Table[0].ActualIncome);
    this.monthlyIncomeRange = this.minMonthlyIncome> monthIncome ? this.minMonthlyIncome:parseInt(monthIncome);
    
    let amount : number = 0;
    let amountStr : String = "";
    if(this.monthlyIncomeRange) {
      amount = Number(this.monthlyIncomeRange.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }
    
    this.monthlyIncome = "₹" + amountStr;
  }else{
    this.monthlyIncomeRange = this.monthlyIncome=  this.monthlyIncome;
  }

    this.minMonthlyExpenses = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_expense.min);
    this.maxMonthlyExpenses = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_expense.max);
      this.startLoad();
      if(this.utilitiesProvider.UserProfileMaster){
        this.breakUp = this.utilitiesProvider.UserProfileMaster.Table;
        // console.log(this.breakUp);
        for(let i=0; i < this.breakUp.length ; i++){
          this.breakUp[i].amount = '';
          this.breakUp[i].id = this.breakUp[i].MonthlyExpenseID;
        }
        
        // console.log("this.breakUp***",this.breakUp)
        this.getUserDetails();
       }


      this.qThree = this.utilitiesProvider.langJsonData['familyProtection']['sliderThreeArray'];
      this.qFour = this.utilitiesProvider.langJsonData['familyProtection']['sliderFourArray'];
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
          // console.log(curAge);
      
          if(curAge == that.userAge)
          {
          $(this).not('.slick-cloned').trigger('click');
          }
          })
    
          if(parseInt(this.userAge) > 60){
            $(".tell_us_slider.retirementAge div").each(function(){
              var curAge = parseInt($(this).find('.tell_us_slider_age').html());
              if(curAge == ((parseInt(that.userAge) + 1)))
              {
              $(this).not('.slick-cloned').trigger('click');
              }
              })
          }
          if(parseInt(this.userAge) < 60){
            $(".tell_us_slider.retirementAge div").each(function(){
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
    that.sliderAgeNowAge = parseInt($(".sliderAgeNow.tell_us_slider .slick-active.slick-current .tell_us_slider_age").text());
    that.selectedDuringAge = parseInt($(".retirementAge.tell_us_slider .slick-active.slick-current .tell_us_slider_age").text());
    let diff = that.selectedDuringAge  -  that.sliderAgeNowAge;
    
    $(".diff").html(diff);
    that.diffVal = diff;
    // $(".diff").html(diff + " years");

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
    this.monthlyIncome = "₹" + (this.monthlyIncomeRange ? this.numberPipe.transform(this.monthlyIncomeRange.toString().replaceAll(",","")) : "");
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
    if(currentIndex == 3){
         this.calculateFamilyProtectionGoal()
    }
    if(currentIndex == 2){
      if(this.qThree[0].value == "No" && this.qThree[1].value=="No"){
        this.calculateFamilyProtectionGoal();
      }
      else{
        this.slides.slideTo(currentIndex + 1, 500);
        this.activateBar();
        this.slides.lockSwipes(true);
      }
    }
    else{
       if(this.goalTime <= 0){
        this.backBtnhide = true;
        this.slides.lockSwipes(true);
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
  

  calculateFamilyProtectionGoal(){
  let quesAns = [];
  for (let i = 0; i < this.qFour.length; i++) {
    let a= {
      "QuestionID" : this.qFour[i].QuestionID,
      "AnswerID" : this.qFour[i].AnswerID
    }
    quesAns.push(a);
  }
    this.pageLoader = true;
      let request = {
        "CustId": this.restapiProvider.userData['CustomerID'],
        'TokenId' : this.restapiProvider.userData['tokenId'],
        "Age": $(".sliderAgeNow.tell_us_slider .slick-current .tell_us_slider_age").text(),
        // "Age":"40",
        "RetirementAge":$(".retirementAge.tell_us_slider .slick-current .tell_us_slider_age").text(),
        "Income": this.monthlyIncomeRange.toString(),
        "ExistingCover" : 0,
        "QuesAns" : quesAns,
        "ADB_Req" : this.qThree[0].value,
        "TPD_Req" : this.qThree[1].value
         }
         console.log(JSON.stringify(request))
    return this.restapiProvider.sendRestApiRequest(request, 'CalculateFamilyProtectionGoalNew').subscribe((response) => {
      setTimeout(() => {
        this.pageLoader = false; 
      }, 1500);
      if (response.IsSuccess == true) {
          //this.myApp.initData();
          response.Data['adb'] = this.qThree[0].value;
          response.Data['tpd'] = this.qThree[1].value;
          response.Data.Table[0].Income = response.Data.Table[0].Income / 12;
          let paramsData = {
            "request" : request,
            "response" : response.Data,
            "adb" : this.qThree[0].value,
            "tpd" : this.qThree[1].value
          }
          this.navCtrl.push('FamilyProtectionFinalPage', {data : paramsData, drivenFrom: this.pageFrom});
        }
      },
      (error) => {
        this.pageLoader = false;
      })
  }
 
  showMore(t){
    this.showBreakUp = ! this.showBreakUp;
    this.dropType = t;
    this.monthlyExpenses = 0;
    this.setDefaultAmount();
    // for(let i=0; i < this.breakUp.length ; i ++){
    //  // this.breakUp[i].amount = '';
    // }
    // if(t == true){
    //   this.monthlyExpenses = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_expense.default);
    //   this.breakupArray = [];
    // }
    // else{
    //   this.monthlyExpenses  = 0;
    //     this.setDefaultAmount();
    // }
  }
  breakUpChange(MonthlyExpense) {
    if (MonthlyExpense) {
      for (let i = 0; i <= this.breakUp.length; i++) {
        if (MonthlyExpense.MonthlyExpenseID == this.breakUp[i].MonthlyExpenseID) {
          this.breakUp[i].amount = $('.input#' + MonthlyExpense.MonthlyExpenseID + ' .text-input').val();
          this.monthlyExpenses = this.utilitiesProvider.getTotal(this.breakUp);
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
    // for (let i = 0; i < this.breakupArray.length; i++) {
    //   this.breakupArray[i].MonthlyExpenseName = ""
    // }
    let a = [];
    for (let i = 0; i < this.breakupArray.length; i++) {
    let b = {
      "MonthlyExpenseID":this.breakupArray[i].MonthlyExpenseID,
      "amount" :  this.breakupArray[i].amount,
      "id" :  this.breakupArray[i].MonthlyExpenseID
    }
    a.push(b);
    }
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "Products":  a
    }
    // console.log(request)
    this.restapiProvider.sendRestApiRequest(request, 'UpdateUserMonthlyExpense').subscribe((response) => {
      this.pageLoader = false;
      // console.log(request)
      if(this.restapiProvider.userData['getUserProfileMaster']){
        this.utilitiesProvider.UserProfileMaster =  JSON.parse(this.restapiProvider.userData['getUserProfileMaster']);
      }    
      if (response.IsSuccess == true) {
        if (response.Data.Table[0].Status == 'Success'){
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
      //  if(!this.dropType){
        this.setDefaultAmount();
       // }
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
        this.breakUp[j].amount = parseInt(this.getBreakUpData[i].ExpenseValue);
        this.monthlyExpenses  = (this.monthlyExpenses ? this.monthlyExpenses : 0) + parseInt(this.getBreakUpData[i].ExpenseValue)
        this.breakupArray.push(this.breakUp[j]);
        
        this.cdr.detectChanges();
       }
    }
    }
  }
  else{
    this.monthlyExpenses  = 0;
  }
}

info(i){
this.popupShow = !this.popupShow;
if(i.id == 1){
  this.popupText = this.utilitiesProvider.langJsonData['familyProtection']['adbPopup'];
}
if(i.id == 2){
  this.popupText = this.utilitiesProvider.langJsonData['familyProtection']['tpdPopup'];
}
}
hideDisclaimer(){
  this.popupShow = !this.popupShow;
}

formatAmount(val) {
  let amount : number = 0;
  let amountStr : String = "";
  if(val && val.trim() != "₹") {
    amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
    amountStr = amount.toLocaleString('en-IN');
  }
  
  this.monthlyIncome = "₹" + amountStr;
  this.monthlyIncomeRange = amount;
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

