import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides, LoadingController } from 'ionic-angular';
import '../../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { Keyboard } from '@ionic-native/keyboard';


@IonicPage()
@Component({
  selector: 'page-ep-fwithout-bal',
  templateUrl: 'ep-fwithout-bal.html',
})
export class EpFwithoutBalPage {
@ViewChild(Content) content: Content;
@ViewChild(Slides) slides: Slides;
public retireAgeBar : any = [];
public nowAgeBar : any = [];
public steps = 100;
public contribute;
public minValue;
public maxValue;
public isBtnActive:boolean = false;
public status:boolean = false;
ageDiff : number;
loading :any;
sliderRetireAge;
sliderAgeNowAge;
backBtnhide : boolean=  true;
scrollHeight;
constructor(public navCtrl: NavController,
   public navParams: NavParams,
   private restapiProvider: RestapiProvider,
   public utilitiesProvider : UtilitiesProvider,
   private loadingCtrl: LoadingController) {
  this.utilitiesProvider.defaultCalData =  this.utilitiesProvider.defaultData.Item1.calculators.nps;
   this.minValue =parseInt(this.utilitiesProvider.defaultCalData.sliderConfig.monthly_contri_pa.min);
   this.maxValue = parseInt(this.utilitiesProvider.defaultCalData.sliderConfig.monthly_contri_pa.max);
   this.contribute = parseInt(this.utilitiesProvider.defaultCalData.sliderConfig.monthly_contri_pa.min);
   this.nowAgeBar =this.utilitiesProvider.age18;
   this.retireAgeBar = this.utilitiesProvider.age40;
  }
  ionViewDidEnter(){
    this.slides.lockSwipes(false);
    this.slides.update();
   let a =  $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
   if(a){
    this.scrollHeight= a;
   }
    //$('.scroll_div .scroll-content').attr('style',this.scrollHeight);
    //$('.scroll_div .fixed-content').attr('style',this.scrollHeight);
    
  }

ionViewDidLoad() {
  this.slides.lockSwipes(true);  
  setTimeout(()=>{ 
    $('.tell_us_slider').not('.slick-initialized').slick({
      focusOnSelect: true,
      dots: false,
      infinite: true,
      speed: 300,
      cssEase: 'linear',
      slidesToShow: 7,
     // slidesToScroll: 5,
    centerMode: true,
      variableWidth: true,
      arrows: false
    }); 

    var currentSlide = $('.tell_us_slider').slick('slickCurrentSlide');
    // console.log(currentSlide);

  $('.tell_us_slider .slick-current').trigger('click');
  $('.tell_us_cont_common').css('opacity',1);
  },500);
  setTimeout(()=>{ 
    var totalHeight = $('.swiper-slide-active').outerHeight();
    var slide_heading = $('.age_slider_heading').outerHeight();
    var nps_first =  $('.nps_age_first').outerHeight();
    var actualheight= slide_heading + nps_first*1.5;
    $('.tell_us_cont_common').height(totalHeight - actualheight);
  },1500);
  $('.tell_us_slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
  this.sliderRetireAge = parseInt($(".sliderRetire.tell_us_slider .slick-current .tell_us_slider_age").text());
  this.sliderAgeNowAge = parseInt($(".sliderAgeNow.tell_us_slider .slick-current .tell_us_slider_age").text());
  let diff = this.sliderRetireAge  -  this.sliderAgeNowAge;
  $(".diff").html(diff + " year" );
  if(this.sliderRetireAge < this.sliderAgeNowAge){
  $('.year_cal').addClass('display_error');
  }
  else{
    $('.year_cal').removeClass('display_error');
  }
  });
}

onSliderChange() {
  // console.log('onSliderChange');
  var totalHeight = $('.swiper-slide-active .slide-zoom').height();
  var slide_heading = $('.age_slider_heading').height();
  var nps_first =  $('.nps_age_first').height();
  var actualheight= slide_heading + nps_first*1.5;
  $('.tell_us_cont_common').height(totalHeight - actualheight);
  }
doSomething(e){
  if(this.contribute >= (this.maxValue / 3) && this.contribute <= (this.maxValue / 2)){
    this.steps = 1000;
    // console.log("steps 1000 --" + this.contribute)
  }
  else if(this.contribute >= (this.maxValue / 2) ){
  this.steps = 2000;
  // console.log("steps 2000 --" + this.contribute)
  }      
  else{
    // console.log("steps 100 --" + this.contribute)
  }
  }
  toggleClass(id){
    $('#' + id).toggleClass('active');
  }

  stepOneNext() {
    let sliderRetire = $(".sliderRetire.tell_us_slider .slick-current .tell_us_slider_age").text();
      let sliderAgeNow = $(".sliderAgeNow.tell_us_slider .slick-current .tell_us_slider_age").text();
    if(sliderAgeNow >= sliderRetire){
    }
    else{
      let yOffset = document.getElementById("stepsCount").offsetTop;
      this.content.scrollTo(0, yOffset,0);
      this.slides.lockSwipes(false);   
      let currentIndex = this.slides.getActiveIndex();
      this.slides.slideTo(1, 500);
      this.slides.lockSwipes(true);   
      this.activateBar(); 
      this.onSliderChange();
      this.backBtnhide = false;
    }
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
  this.backBtnhide = true;
  let yOffset = document.getElementById("stepsCount").offsetTop;
  this.content.scrollTo(0, yOffset,0)
  this.slides.lockSwipes(false);   
  this.slides.slideTo(currentIndex - 1, 500);
  this.slides.lockSwipes(true); 
  this.activateBar();  
 }

  
activateBar(){
 let currentIndex = this.slides.getActiveIndex() + 1;
 let stepIndex = $('.calculator_steps .calculator_steps_com  .calculator_steps_com_num span').text();
 // if(currentIndex == stepIndex)
 $('.calculator_steps .calculator_steps_com:nth-child('+currentIndex+')').addClass('active');
 $('.calculator_steps .calculator_steps_com:nth-child('+currentIndex+')').prevAll().addClass('active');
 $('.calculator_steps .calculator_steps_com:nth-child('+currentIndex+')').nextAll().removeClass('active');
}




 done(){
  let sliderRetire = $(".sliderRetire.tell_us_slider .slick-current .tell_us_slider_age").text();
  let sliderAgeNow = $(".sliderAgeNow.tell_us_slider .slick-current .tell_us_slider_age").text();
  //this.contribute 
let request = {
  "CustID": this.restapiProvider.userData['CustomerID'],
  'TokenId': this.restapiProvider.userData['tokenId'],
  "CurrentAge": parseInt(sliderAgeNow),
  "RetirementAge":parseInt(sliderRetire),
  "MonthlyContri":this.contribute,
  "PercPensionReinvestedInAnnuity": parseInt(this.utilitiesProvider.defaultCalData.data.incr_saving_rate.default),
  "RateOfInterest": parseInt(this.utilitiesProvider.defaultCalData.data.rateofinterest.default),
  "IncrementalSavingsRate" : parseInt(this.utilitiesProvider.defaultCalData.data.incr_saving_rate.default)
}
  this.GetNPS(request)
}

GetNPS(request) {
      this.loaderShow();
      // console.log("Request: " + JSON.stringify(request));
      return this.restapiProvider.sendRestApiRequest(request, 'GetNPSValues')
        .subscribe((response) => {
          if (response.IsSuccess == true) {
            // console.log(response);
            this.loading.dismiss();
            // console.log(response.Data)
            this.navCtrl.push('EpFwithoutBalPage', {data : response.Data})
          }
          else {
            this.loading.dismiss();
            // console.log(response);
          }
        },
        (error) => {
          this.loading.dismiss();
        })
    }
    loaderShow(){
      this.loading = this.loadingCtrl.create({
          content: 'Please wait...',
          dismissOnPageChange: true
        });
      this.loading.present();
    }
}

