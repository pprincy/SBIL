import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides, LoadingController} from 'ionic-angular';
import  '../../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import {UtilitiesProvider} from '../../../../providers/utilities/utilities';
import { Keyboard } from '@ionic-native/keyboard';
import { DecimalPipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-sukanya-samridhi',
  templateUrl: 'sukanya-samridhi.html',
})
export class SukanyaSamridhiPage {
  @ViewChild(Content) content: Content;
  public ageBar : any = [];
  public steps = 100;
  public amount;
  public minValue;
  public maxValue;
  public isBtnActive:boolean = false;
  public status:boolean = false;
  public isReadonlyD1:boolean = true;
  public isReadonlyD2:boolean = true;
  public pageLoader : boolean = false;
  daughterOne = "";
  daughterTwo = "";
  postJson : any = {};
  showInvestAmountTwo: boolean = false;
  daughterOneInvest;
  daughterTwoInvest;
  daughterOneInvestComma;
  daughterTwoInvestComma;
  calDefaultData : any = {};
  @ViewChild(Slides) slides: Slides;
  loading :any;
  keyboardShow : boolean = false;
  backBtnhide : boolean=  true;
  scrollHeight;
  public familyMembersArr : any = [];
  public isGetUserDetails : boolean = false;
  public pageFrom;
  public addMore: boolean = true;
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
    this.utilitiesProvider.defaultCalData =  this.utilitiesProvider.defaultData.Item1.calculators.sukanyasamriddhi;
     this.minValue = parseInt(this.utilitiesProvider.defaultCalData.data.investmentamount_pm.min) ;
     this.maxValue = parseInt(this.utilitiesProvider.defaultCalData.data.investmentamount_pm.max) ;
     this.daughterOneInvest = this.minValue;
     this.daughterTwoInvest = this.minValue;

     let amountStr1 : String = "0";
     if(this.daughterOneInvest) {
       let amount = Number(this.daughterOneInvest.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
       amountStr1 = amount.toLocaleString('en-IN');
     }

     let amountStr2 : String = "0";
     if(this.daughterTwoInvest) {
       let amount = Number(this.daughterTwoInvest.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
       amountStr2 = amount.toLocaleString('en-IN');
     }

     this.daughterOneInvestComma = amountStr1;
     this.daughterTwoInvestComma = amountStr2;
     this.amount = this.minValue;
     let minAge = parseInt(this.utilitiesProvider.defaultCalData.sliderConfig.age_of_child.min) ;
     let maxAge = parseInt(this.utilitiesProvider.defaultCalData.sliderConfig.age_of_child.max) ;
      for(let i = minAge;i <= maxAge; i++){
        this.ageBar.push(i);
      }
    this.startLoad();
    this.getUserDetails();
  }
  ionViewDidEnter(){
    this.slides.lockSwipes(true);
    this.slides.update();
   let a =  $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
   if(a){
    this.scrollHeight= a;
   }
    //$('.scroll_div .scroll-content').attr('style',this.scrollHeight);
    //$('.scroll_div .fixed-content').attr('style',this.scrollHeight);

   this.utilitiesProvider.upshotScreenView('SukanyaSamriddhi');
  }
 startLoad(){
  this.slides.lockSwipes(true);   
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
  },500);

  $('.tell_us_cont .ion-ios-add-circle-outline').click(function(e){
    e.stopPropagation();
    $(this).parents('.tell_us_cont').addClass('active');
    $('.tell_us_slider .slick-current').trigger('click');
   // this.showInvestAmountTwo = true;
  });

  $('.tell_us_cont .ion-ios-close-circle-outline').click(function(e){
      e.stopPropagation();
      this.daughterTwo = "";
      $(this).parents('.tell_us_cont').removeClass('active');
    //  this.showInvestAmountTwo = false;
  });
  setTimeout(function(){
    var totalHeight = $('.swiper-slide-active').outerHeight();
    var slide_heading = $('.age_slider_heading').outerHeight();
    var nps_first =  $('.nps_age_first').outerHeight();
    var actualheight= slide_heading + nps_first*1.5;
     $('.tell_us_cont_common').height(totalHeight - actualheight);
  },1500);
 }

  doSomething(e){
    if(this.amount >= (this.maxValue / 3) && this.amount <= (this.maxValue / 2)){
      this.steps = 1000;
    }
    else if(this.amount >= (this.maxValue / 2) ){
    this.steps = 2000;
    }   
    this.daughterOneInvestComma = this.numberPipe.transform(this.daughterOneInvest.toString().replaceAll(",",""))   
    this.daughterTwoInvestComma = this.numberPipe.transform(this.daughterTwoInvest.toString().replaceAll(",",""))   
    }
  toggleClass(id){
    $('#' + id).toggleClass('active')
 }

 
 stepOneNext() {
   let childOneAge = $(".dOneSlider.tell_us_slider .slick-current .tell_us_slider_age").text();
   let childTwoAge = $(".dTwoSlider.tell_us_slider .slick-current .tell_us_slider_age").text();
  if(this.daughterOne.trim() == ""){
    this.daughterOne =  "Daughter 1";
     }
  if(this.daughterTwo.trim() == ""){
    this.daughterTwo =  "Daughter 2";
  }
  this.postJson =  {
    "Daughter1":{"AmountInvestedPerMnth":0,"Age":parseInt(childOneAge), "Name" : this.daughterOne},
    "Daughter2":{"AmountInvestedPerMnth":0,"Age":parseInt(childTwoAge),"Name" : this.daughterTwo}
  }
  // this.showInvestAmountTwo = this.daughterTwo.trim() == ""? false : true;
  let yOffset = document.getElementById("stepsCount").offsetTop;
  this.content.scrollTo(0, yOffset,0)
  this.slides.lockSwipes(false);   
  let currentIndex = this.slides.getActiveIndex();
  this.slides.slideTo(1, 500);
  this.backBtnhide = false;
  this.slides.lockSwipes(true);   
  this.activateBar(); 
  this.onSliderChange();
  

  setTimeout(function(){
    var totalHeight = $('.swiper-slide-active').outerHeight();
    var slide_heading = $('.age_slider_heading').outerHeight();
    var nps_first =  $('.nps_age_first').outerHeight();
    var actualheight= slide_heading + nps_first*1.5;
     $('.tell_us_cont_common').height(totalHeight - actualheight);
  },500);
}

next(){
  let currentIndex = this.slides.getActiveIndex();
  if(currentIndex == 0){
    this.stepOneNext();
  }
  if(currentIndex == 1){
    this.done();
  }
 }
 back(){
  let currentIndex = this.slides.getActiveIndex();
  let yOffset = document.getElementById("stepsCount").offsetTop;
  this.content.scrollTo(0, yOffset,0)
  this.slides.lockSwipes(false);   
  this.slides.slideTo(currentIndex - 1, 500);
  this.slides.lockSwipes(true); 
  this.activateBar();  
  this.backBtnhide = true;

  
 }

  activateBar(){
    let currentIndex = this.slides.getActiveIndex() + 1;
    let stepIndex = $('.calculator_steps .calculator_steps_com  .calculator_steps_com_num span').text();
    // if(currentIndex == stepIndex)
    $('.calculator_steps .calculator_steps_com:nth-child('+currentIndex+')').addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child('+currentIndex+')').prevAll().addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child('+currentIndex+')').nextAll().removeClass('active');
  }
  onSliderChange() {
    var totalHeight = $('.swiper-slide-active .slide-zoom').height();
    var slide_heading = $('.age_slider_heading').height();
    var nps_first =  $('.nps_age_first').height();
    var actualheight= slide_heading + nps_first*1.5;
    $('.tell_us_cont_common').height(totalHeight - actualheight);
    }
    stepBack(n){
      let yOffset = document.getElementById("stepsCount").offsetTop;
      this.content.scrollTo(0, yOffset,0)
      this.slides.lockSwipes(false);   
      this.slides.slideTo(n, 500);
      this.slides.lockSwipes(true); 
      this.activateBar();  
    }
    done(){
      this.postJson.Daughter1.AmountInvestedPerMnth = this.daughterOneInvest;
      if(this.postJson.Daughter2){
        this.postJson.Daughter2.AmountInvestedPerMnth = this.daughterTwoInvest;
      }
      if(this.showInvestAmountTwo == false){
        this.postJson.Daughter2 = null;
      }
      this.postJson.ROIInPerc = 8.3;
      this.postJson.InvestmentPeriod = 14;
      this.postJson.MaturityPeriod = 21;
      this.getSukanyaSamridhi(this.postJson);
    }

  getSukanyaSamridhi(request) {
    this.pageLoader = true;
    request.CustId = this.restapiProvider.userData['CustomerID'];
    request.TokenId = this.restapiProvider.userData['tokenId'];
    // console.log(request)
    // localStorage.setItem("temp", JSON.stringify(request))
     this.restapiProvider.sendRestApiRequest(request, 'GetSukanyaSamriddhiValues').subscribe((response) => {
      this.pageLoader = false;
      // console.log(response)
      if (response.IsSuccess == true) {
          let  passToFinal = {
            "postData" : request,
            "result" : response.Data
          }
          this.navCtrl.push('SukanyasamridhiFinalPage', {'data' : passToFinal, pageFrom: this.pageFrom })
        if(this.familyMembersArr.length < 1 && this.isGetUserDetails){
          this.updateUserDependents()
        }
        }
      },
      (error) => {
        // console.log(error)
        this.pageLoader = false;
      })
  }

  
  loaderShow(){
    this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
        dismissOnPageChange: true
      });
    this.loading.present();
  }





  getUserDetails() {
  this.pageLoader = true;
  let request = {
    "CustId": this.restapiProvider.userData['CustomerID'],
    "TokenId": this.restapiProvider.userData['tokenId']
  }
  this.restapiProvider.sendRestApiRequest(request, 'GetUserDetails').subscribe((response) => {
    this.pageLoader = false;
    if (response.IsSuccess == true) {
      this.familyMembersArr = response.Data.Table1;
      this.isGetUserDetails = true
    }
    else {
    }
  },
    (error) => {
      this.pageLoader = false;
    });
}

//UpdateUserDependents
updateUserDependents(){
  let postData = {
    "CustId" : this.restapiProvider.userData['CustomerID'],
    "TokenId" : this.restapiProvider.userData['tokenId'],
    "Dependents" : []
  }
  postData.Dependents.push({"Name" : this.postJson.Daughter1.Name, "Relationship" : 2 , "Age" :this.postJson.Daughter1.Age })
  this.postJson.Daughter1.AmountInvestedPerMnth = this.daughterOneInvest;
  if(this.postJson.Daughter2){
    postData.Dependents.push({"Name" : this.postJson.Daughter2.Name, "Relationship" : 2 , "Age" :this.postJson.Daughter2.Age })
  }
   this.restapiProvider.sendRestApiRequest(postData, 'UpdateUserDependents').subscribe((response) => {
    },
    (error) => {
    })
}

formatAmount(val, type) {
  let amount : number = 0;
  let amountStr : String = "";
  if(val && val.trim() != "₹") {
    amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
    amountStr = amount.toLocaleString('en-IN');
  }

  if(type == "daughter1") {
    this.daughterOneInvestComma = amountStr;
    this.daughterOneInvest = amount;
  }
  else if(type == "daughter2") {
    this.daughterTwoInvestComma = amountStr;
    this.daughterTwoInvest = amount;
  }
}

HideAddMore(){
  this.showInvestAmountTwo = true;
  this.addMore = false;
}

ShowAddMore(){
  this.showInvestAmountTwo = false;
  this.addMore = true;
}

}
