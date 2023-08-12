import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides, LoadingController} from 'ionic-angular';
import  '../../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import {UtilitiesProvider} from '../../../../providers/utilities/utilities';
import { DecimalPipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-marriage',
  templateUrl: 'marriage.html',
})
export class MarriagePage {

  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  public steps = 20000;
  public minDownPayPer;
  public maxDownPayPer;
  public status:boolean = false;
  public loading :any;
  public backBtnhide : boolean = true;
  public minCostWedding;
  public maxCostWedding;
  public costOfWedding;
  public costOfWeddingComma;
  public whenWeddingBar : any = [];
  public yearDiff;
  public pageLoader : boolean = false;
  public timeToGoalTemp;
  public pageFrom;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider : UtilitiesProvider,
    private numberPipe: DecimalPipe,
    private loadingCtrl: LoadingController) {
      this.pageFrom = this.navParams.get('pageFrom');
  }
  ionViewDidLoad() {
    
   if(this.navParams.get("data")){
    this.timeToGoalTemp = parseInt(this.navParams.get("data"))
   }
   else{
     this.timeToGoalTemp =  0;
   }
    this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item2.goals.wedding;
    // console.log(this.utilitiesProvider.defaultData.Item2.goals.wedding) 
    this.minCostWedding = parseInt(this.utilitiesProvider.defaultGoalData.data.cost.min);
    this.maxCostWedding = parseInt(this.utilitiesProvider.defaultGoalData.data.cost.max);
     this.costOfWedding = this.minCostWedding;
     
     let amount : number = 0;
          let amountStr : String = "";
          if(this.costOfWedding) {
            amount = Number(this.costOfWedding.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
            amountStr = amount.toLocaleString('en-IN');
          }
     this.costOfWeddingComma = "₹" + amountStr;
    
    let minYear = parseInt(this.utilitiesProvider.defaultGoalData.data.duration_in_yr.min) ;
    let maxYear = parseInt(this.utilitiesProvider.defaultGoalData.data.duration_in_yr.max) ;
      for(let i = minYear;i <= maxYear; i++){
        this.whenWeddingBar.push(i);
      }
      this.startLoad();
  }
  ionViewDidEnter() {
    this.utilitiesProvider.upshotScreenView('MarriageGoal');
  }
 startLoad(){
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

  $('.tell_us_cont .ion-ios-add-circle-outline').click(function(e){
    e.stopPropagation();
    $(this).parents('.tell_us_cont').addClass('active');
    $('.tell_us_slider .slick-current').trigger('click');
  });

  $('.tell_us_cont .ion-md-create').click(function(e){
    e.stopPropagation();
  $(this).toggle();
    $(this).siblings('.icon').toggle();
  });


  setTimeout(()=>{
    let that = this;
    if(this.timeToGoalTemp > 0){
    $(".tell_us_slider.WeddingYear div").each(function(){
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
    let selectedYearHome = parseInt($(".WeddingYear.tell_us_slider .slick-current .tell_us_slider_age").text());
    this.yearDiff =  d + selectedYearHome;
      $('.diffYear').html(this.yearDiff)
    });
 }

 

  doSomething(e){
    if(this.costOfWedding >= (this.maxCostWedding / 3) && this.costOfWedding <= (this.maxCostWedding / 2)){
      this.steps = 50000;
    }
    else if(this.costOfWedding >= (this.maxCostWedding / 2) ){
    this.steps = 200000;
    } 
    this.costOfWeddingComma = "₹" + (this.costOfWedding ? this.numberPipe.transform(this.costOfWedding.toString().replaceAll(",","")) : "0");    
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
    if(currentIndex == 1){
      if(this.costOfWedding > this.maxCostWedding || this.costOfWedding < this.minCostWedding){
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterWeddingCostBetween']+ " " + this.minCostWedding + " " + this.utilitiesProvider.jsErrorMsg['to'] + " "+ this.maxCostWedding)
      }
      else{
        this.CalculateMarriageGoal();
      }
    }
    else{
        this.slides.slideTo(currentIndex + 1, 500);
        this.activateBar();
        this.slides.lockSwipes(true);
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

  CalculateMarriageGoal() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "CurrentAmount":this.costOfWedding,
      "Period":$(".WeddingYear.tell_us_slider .slick-current .tell_us_slider_age").text(),
      "LumpsumAvailable":parseFloat(this.utilitiesProvider.defaultGoalData.data.lumpsum_avlbl.default),
      "Inflation":parseFloat(this.utilitiesProvider.defaultGoalData.data.inflation_rate.default), 
      "IncrementalSavings":parseFloat(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.default),
      "LumpsumCompound":parseFloat(this.utilitiesProvider.defaultGoalData.data.lumpsum_compound.default),
      "RiskProfile":""
       }
    return this.restapiProvider.sendRestApiRequest(request, 'CalculateWeddingGoal').subscribe((response) => {
         this.pageLoader = false;
       if (response.IsSuccess == true) {
          this.navCtrl.push('MarriageFinalPage', {data : response.Data, drivenFrom: this.pageFrom});
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
    
    this.costOfWeddingComma = "₹" + amountStr;
    this.costOfWedding = amount;
  }
}

