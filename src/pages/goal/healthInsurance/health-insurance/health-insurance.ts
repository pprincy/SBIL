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
  selector: 'page-health-insurance',
  templateUrl: 'health-insurance.html',
})
export class HealthInsurancePage {
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
  public monthlyIncomeComma:any;
  public breakupArray : any = [];
  public getBreakUpData : any = [];
  public showBreakUp : boolean = false;
  public qThree : any = [];
  public qFour : any = [];

  public FamilyCoverReq  = "NO"
  public ageArray : any;
  public spouseAge = 23; spouseMonthlyIncome;childIncome;
  public isSpouse : boolean = false;
  public fatherAge = 45; fatherMonthlyIncome;
  public isFather : boolean = false;
  public motherAge  = 45; motherMonthlyIncome;
  public isMother : boolean = false;
  public childrenArray :  any = [];
  public isChildren : boolean = false;
  public fatherMotherAgeArray : any = [];
  public selectedChildAgeInput;
  public pageFrom;
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

    this.utilitiesProvider.upshotScreenView('HealthInsuranceGoal');
  }

  ionViewDidLoad() {
    let pushData = {
      "id" : this.childrenArray.length,
    }
    this.childrenArray.push(pushData);
    
    let monthIncome:any;
    this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item2.goals.family_protection;
    this.minMonthlyIncome = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_income.min);
    this.maxMonthlyIncome = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_income.max);

 if(this.restapiProvider.userData['userPersonalDetails']){
      monthIncome =parseInt(JSON.parse(this.restapiProvider.userData['userPersonalDetails']).Table[0].ActualIncome);
     this.monthlyIncome    = this.minMonthlyIncome> monthIncome ? this.minMonthlyIncome:parseInt(monthIncome);
     let amount : number = 0;
      let amountStr : String = "";
      if(this.monthlyIncome) {
        amount = Number(this.monthlyIncome.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
        amountStr = amount.toLocaleString('en-IN');
      }
     this.monthlyIncomeComma = "₹" + amountStr;
  }else{
       this.monthlyIncome=  this.monthlyIncome;
       let amount : number = 0;
      let amountStr : String = "";
      if(this.monthlyIncome) {
        amount = Number(this.monthlyIncome.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
        amountStr = amount.toLocaleString('en-IN');
      }
       this.monthlyIncomeComma = "₹" + amountStr;
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


       this.qThree = [
         {"id" : 1, "title" : "Accidental Death benefit rider ?", "value" : "Yes"},
         {"id" : 2, "title" : "Total Permanent Disablity rider?", "value" : "Yes"}
         ]

         this.qFour =  [
          {"id" : 1, "title" : "Do you drive long distance regularly?", "value" : "Yes","subTitle" : ""},
          {"id" : 2, "title" : "Do you travelby public transport regularly?", "value" : "Yes","subTitle" : ""},
          {"id" : 3, "title" : "Do you smoke?", "value" : "Yes","subTitle" : ""},
          {"id" : 4, "title" : "Are you suffering from any major illness", "value" : "Yes","subTitle" : "(requiring hospitalisation for more than 3 days)"},
          ];
  }


  selectFun(i){
    this.selectedChildAgeInput = i;
    let that = this;
    setTimeout(() => {
      $('.app-root .alert-button-group .alert-button:last-child').click(function(){
        let a = $('#'+ that.selectedChildAgeInput +'-ChildrenAge .select-text').text();
        if(parseInt(a) <= 17){
          $('#'+ that.selectedChildAgeInput +'-ChildrenIncome').css("display" , "none");
        }else{
          $('#'+ that.selectedChildAgeInput +'-ChildrenIncome').css("display" , "table-column");
        }
     });
    }, 1000);
  }
 startLoad(){
  this.ageNow= this.utilitiesProvider.age18;
  this.ageDuring=this.utilitiesProvider.age40;
  this.ageArray = this.utilitiesProvider.age1to80;
  this.fatherMotherAgeArray = this.utilitiesProvider.age100;
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
      },1500)

  setTimeout(function(){
    var totalHeight = $('.swiper-slide-active').outerHeight();
    var slide_heading = $('.age_slider_heading').outerHeight();
    var nps_first =  $('.nps_age_first').outerHeight();
    var actualheight= slide_heading + nps_first*1.5;
     $('.tell_us_cont_common').height(totalHeight - actualheight);
  },1500);
 }

  doSomething(e){
    if(this.monthlyExpenses >= (this.maxMonthlyExpenses / 3) && this.amount <= (this.maxMonthlyExpenses / 2)){
      this.steps = 1000;
    }
    else if(this.monthlyExpenses >= (this.maxMonthlyExpenses / 2) ){
    this.steps = 2000;
    }
    this.monthlyIncomeComma = this.monthlyIncome ? this.numberPipe.transform(this.monthlyIncome.toString().replaceAll(",","")) : "";
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
    let timeTogoal = $('.diff').text();
    let a =  timeTogoal.split(" ");
    this.goalTime = parseInt(a[0]);
    this.backBtnhide = false;
    this.slides.lockSwipes(false);
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex == 2){
      // if(this.monthlyExpenses > this.maxMonthlyExpenses || this.monthlyExpenses < this.minMonthlyExpenses){
      //   this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterMonthlyExpensesBetween'] + this.minMonthlyExpenses + this.utilitiesProvider.jsErrorMsg['to'] + this.maxMonthlyExpenses)
      // }
      // else{
         this.calculateFamilyProtectionGoal()
     // }
      //this.navCtrl.push('HealthInsuranceFinalPage');
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
    this.showBreakUp = false;
    if(this.isSpouse == false && this.isChildren == false && this.isFather == false && this.isMother == false && this.FamilyCoverReq == "YES"){
    }
    else{
    this.pageLoader = true;
     let dependantsArray = [];
     if(this.isSpouse){
            let s = {
              "Relation" : "Spouse",
              "Age" : this.spouseAge.toString(),
              "Income" : this.spouseMonthlyIncome ? this.spouseMonthlyIncome.toString().replaceAll(",","")  : 0
            }
            dependantsArray.push(s);
     }
     if(this.isFather){
            let f = {
              "Relation" : "Father",
              "Age" : this.fatherAge,
              "Income" : this.fatherMonthlyIncome ? this.fatherMonthlyIncome.toString().replaceAll(",","")  : 0
            }
            dependantsArray.push(f);
      }
        if(this.isMother){
          let m = {
            "Relation" : "Mother",
            "Age" : this.motherAge,
            "Income" : this.motherMonthlyIncome ? this.motherMonthlyIncome.toString().replaceAll(",","")  : 0
          }
          dependantsArray.push(m);
    }
    if(this.isChildren){
     for (let i = 0; i < this.childrenArray.length; i++) {
      let c = {
        "Relation" : "Child" + (i + 1),
        "Age" :     ($('#' + i + '-ChildrenAge').find('.select-text').text() ? $('#' + i + '-ChildrenAge').find('.select-text').text() : 0 ).toString(),
        "Income" : ($('#' + i + '-ChildrenIncome').find('.text-input').val() ? $('#' + i + '-ChildrenIncome').find('.text-input').val() : 0).toString()
      }
      dependantsArray.push(c);
     }
    }

   if(this.FamilyCoverReq == "NO"){
    dependantsArray = [];
    this.childrenArray = [];
    this.isChildren = false;
    this.isMother = false;
    this.isFather = false;
    this.isSpouse = false;
   }

    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "Age" : $(".sliderAgeNow.tell_us_slider .slick-current .tell_us_slider_age").text(),
      "Income" : this.monthlyIncome.toString(),
      "FamilyCover" : null,
      "SelfCover" : null,
      "FamilyCoverReq" : this.FamilyCoverReq,
      "Dependants" : dependantsArray
       }
      //  console.log(JSON.stringify(request));
    return this.restapiProvider.sendRestApiRequest(request, 'CalculateHealthInsuranceGoal').subscribe((response) => {
      setTimeout(() => {
        this.pageLoader = false; 
      }, 1500);
      if (response.IsSuccess == true) {
        // console.log(response);
        

        let isFatherMother = "NO"
        let cardOneImg;
        if(this.FamilyCoverReq == "NO"){
          cardOneImg = "hlv_singl";
        }
        else{
          if(this.isSpouse && !this.isChildren){
            cardOneImg = "hlv_SpouseChild";
          }
          if(!this.isSpouse && this.isChildren){
            cardOneImg = "hlv_SpouseChild";
          }
          if(!this.isSpouse && !this.isChildren){
            cardOneImg = "hlv_singl";
          }
          if(this.isSpouse && this.isChildren){
            if(this.childrenArray.length > 1){
              cardOneImg = "hlv_SpouseTwoChild";
            }
            else{
              cardOneImg = "hlv_SpouseChild";
            }
          }

          if(this.isMother || this.isFather){
            isFatherMother = "YES"
          }
        }
        

        response.Data.Table[0].SelfIncome = response.Data.Table[0].SelfIncome / 12;
        
       let paramsData = {
                          "type" : this.FamilyCoverReq,
                          "isFatherMother" : isFatherMother,
                          "cardOneImg" : cardOneImg,
                          "request" : request,
                          "response" :  response.Data
                        }
        
        this.navCtrl.push('HealthInsuranceFinalPage', {data : paramsData, drivenFrom: this.pageFrom});
                      }
      },
      (error) => {
        this.pageLoader = false;
     })
    }
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

addChildren(){
  let pushData = {
    "id" : this.childrenArray.length,
  }

  this.childrenArray.push(pushData);
  setTimeout(() => {
    $('#' + (this.childrenArray.length-1) +'-ChildrenAge .select').find('.select-text').removeClass('select-placeholder').text('1');  
    $('#'+ (this.childrenArray.length-1) +'-ChildrenIncome').css("display" , "none");
   }, 200);
}

childSelectFun(a, b){
// console.log(a + " ****** "+  b);
}

changeChildFunction(){
  // if(this.isChildren){
      setTimeout(() => {
      $('#0-ChildrenAge .select').find('.select-text').removeClass('select-placeholder').text('1');   
      $('#0-ChildrenIncome').css("display" , "none");
     }, 200);
   
  // }
}

formatAmount(val, type) {
  let amount : number = 0;
  let amountStr : String = "";
  if(val && val.trim() != "₹") {
    amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
    amountStr = amount.toLocaleString('en-IN');
  }

  if(type == "monthlyIncome") {
    this.monthlyIncomeComma = "₹" + amountStr;
    this.monthlyIncome = amount;
  }
  else if(type == "spouse") {
    this.spouseMonthlyIncome = amountStr;
  }
  else if(type == "child") {
    this.childIncome = amountStr;
  }
  else if(type == "father") {
    this.fatherMonthlyIncome = amountStr;
  }
  else if(type == "mother") {
    this.motherMonthlyIncome = amountStr;
  }
}
}

