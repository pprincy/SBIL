import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides, LoadingController,
ModalController} from 'ionic-angular';
import  '../../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import {UtilitiesProvider} from '../../../../providers/utilities/utilities';
import { Keyboard } from '@ionic-native/keyboard';
import { DecimalPipe } from '@angular/common';
import { DropDowmSelctionPage } from '../../../../components/modals/drop-dowm-selction/drop-dowm-selction';

@IonicPage()
@Component({
  selector: 'page-child-education',
  templateUrl: 'child-education.html',
})
export class ChildEducationPage {

  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  public selectHomeBar : any = [];
  public steps = 25000;
  public amount;
  public minCostCourse; maxCostCourse; costOfCourse; minDownPayPer; maxDownPayPer; costOfCourseComma;
  public status:boolean = false;
  public loading :any;
  public keyboardShow : boolean = false;
  public backBtnhide : boolean = true;
  public ageNow; ageDuring; scrollHeight; goalTime = 0;
  public courseTypeList: any =[{
    "course":"Under Graduate",
    "course_id": "UG"
  },
  {
    "course":"Post Graduate",
    "course_id": "PG"
  }];
  public courseType ="UG";
  public courseFieldList : any = [];
  public courseField;
  public courseName;
  public collegeIsIndia :any = "yes";
  public countryList : any = [];
  public country;
  public pageLoader : boolean = false;
  public course_id;
  public pageFrom;
  public diffVal;
  public ageStatus = "currentAge";
  public ageCourseDuring;
  public currentChildAge;
  public modal;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider : UtilitiesProvider,
    private loadingCtrl: LoadingController,
    private numberPipe: DecimalPipe,
    private keyboard: Keyboard,
    public modalCtrl: ModalController) {
    
      this.keyboard.onKeyboardShow().subscribe(data => {
        this.keyboardShow = true;
      });
      this.keyboard.onKeyboardHide().subscribe(data => {
        this.keyboardShow = false;
      });

      this.pageFrom = this.navParams.get('pageFrom');
  }
  ionViewDidEnter(){
    this.slides.lockSwipes(true);
    this.slides.update();
   let a =  $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
   if(a){
    this.scrollHeight= a;
   }
   // $('.scroll_div .scroll-content').attr('style',this.scrollHeight);
    //$('.scroll_div .fixed-content').attr('style',this.scrollHeight);

    this.utilitiesProvider.upshotScreenView('EducationGoal');
  }
  ionViewDidLoad() {
    this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item2.goals.education;
    // console.log( this.utilitiesProvider.defaultData.Item2.goals) 
    this.minCostCourse = parseInt(this.utilitiesProvider.defaultGoalData.data.cost.min);
    this.maxCostCourse = parseInt(this.utilitiesProvider.defaultGoalData.data.cost.max);
    this.costOfCourse = parseInt(this.utilitiesProvider.defaultGoalData.data.cost.default);
    
    let amount : number = 0;
    let amountStr : String = "";
    if(this.costOfCourse) {
      amount = Number(this.costOfCourse.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }

    this.costOfCourseComma = "₹" + amountStr;
      this.startLoad();
      this.courseFieldFun();
  }
 startLoad(){
  this.ageNow= this.utilitiesProvider.age1To30;
  this.ageDuring=this.utilitiesProvider.age1To30;
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

  //sliderDuring
setTimeout(()=>{
  $(".tell_us_slider.sliderDuring div").each(function(){
    var durAge = parseInt($(this).find('.tell_us_slider_age').html());
    if(durAge == 2)
    {
    $(this).not('.slick-cloned').trigger('click');
    }
    })
},1000);

  setTimeout(function(){
    let that = this;
    var totalHeight = $('.swiper-slide-active').outerHeight();
    var slide_heading = $('.age_slider_heading').outerHeight();
    var nps_first =  $('.nps_age_first').outerHeight();
    var actualheight= slide_heading + nps_first*1.5;
     $('.tell_us_cont_common').height(totalHeight - actualheight);
  },1500);
let that = this;
  $('.tell_us_slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
    that.ageCourseDuring = parseInt($(".sliderDuring.tell_us_slider .slick-current .tell_us_slider_age").text());
    that.currentChildAge = parseInt($(".sliderAgeNow.tell_us_slider .slick-current .tell_us_slider_age").text());
    let diff = that.ageCourseDuring - that.currentChildAge;
    that.diffVal = diff;
    $(".diff").html(diff);
    });
 }

  doSomething(e){
    if(this.costOfCourse >= (this.maxCostCourse / 3) && this.costOfCourse <= (this.maxCostCourse / 2)){
      this.steps = 500000;
    }
    else if(this.costOfCourse >= (this.maxCostCourse / 2) ){
    this.steps = 750000;
    }     
    // console.log(this.costOfCourse) 
    // console.log(this.steps)
    
    this.costOfCourseComma = "₹" + (this.costOfCourse ? this.numberPipe.transform(this.costOfCourse.toString().replaceAll(",","")) : "");
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
    if(this.diffVal <= 0) return;
    let timeTogoal = this.diffVal;
    this.goalTime = timeTogoal;
    this.backBtnhide = false;
    this.slides.lockSwipes(false);
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex == 1){
      if(this.costOfCourse > this.maxCostCourse || this.costOfCourse < this.minCostCourse){
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterFeesBetween'] + " " + this.minCostCourse + " " + this.utilitiesProvider.jsErrorMsg['to'] + " " + this.maxCostCourse)
      }
      else{
        this.CalculateCourseGoal()
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
  fieldChange(){
    console.log("fieldchange called")
    this.GetCourseDetailsFun();
  }
  courseTypeCahnge(){
    // console.log(this.courseType)
    this.courseFieldFun();
  }
  isCountryIndiaFun(a){
  if(a == "yes"){
    this.countryChange("India");
  }
  }
  countryChange(c){
    for(let i = 0; i < this.countryList.length; i++){
      if(this.countryList[i].country == c){
        this.costOfCourse = parseInt(this.countryList[i].TotalCost);
        this.costOfCourseComma = "₹" + (this.numberPipe.transform(this.costOfCourse.toString().replaceAll(",","")));
        break;
      }
    }
  }

  CalculateCourseGoal() {
    this.pageLoader = true;
    let timeTogoal = this.diffVal;
    let a =  timeTogoal;
      let request = {
        "CustId": this.restapiProvider.userData['CustomerID'],
        'TokenId': this.restapiProvider.userData['tokenId'],
        "CurrentAmount": this.costOfCourse,
        "Period": a, 
        "LumpsumAvailable":parseFloat(this.utilitiesProvider.defaultGoalData.data.lumpsum_avlbl.default),
        "Inflation": parseFloat(this.utilitiesProvider.defaultGoalData.data.inflation_rate.default), 
        "IncrementalSavings":parseFloat(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.default),
        "LumpsumCompound":parseFloat(this.utilitiesProvider.defaultGoalData.data.lumpsum_compound.default),
        "RiskProfile":""
         }
    return this.restapiProvider.sendRestApiRequest(request, 'CalculateEducationGoal').subscribe((response) => {
        if (response.IsSuccess == true) {
          this.pageLoader = false;
          
          let sliderAgeNowAge = parseInt($(".sliderAgeNow.tell_us_slider .slick-current .tell_us_slider_age").text());
          let selectedDuringAge = parseInt($(".sliderDuring.tell_us_slider .slick-current .tell_us_slider_age").text());

          this.navCtrl.push('ChildeducationfinalPage', {data : response.Data, drivenFrom: this.pageFrom, 
            otherData: 
            {
              currentAge: sliderAgeNowAge, 
              ageDuringCoarse: selectedDuringAge,
              degree: this.courseType,
              courses: this.courseName,
              isInIndia: this.collegeIsIndia
            }
          });
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
 
  courseFieldFun(){
    this.pageLoader = true;
      let request = {
        "Course": this.courseType,
        "CustID": this.restapiProvider.userData['CustomerID'],
        'TokenId': this.restapiProvider.userData['tokenId']
        }
    return this.restapiProvider.sendRestApiRequest(request, 'GetCourseMaster').subscribe((response) => {
        if (response.IsSuccess == true) {
          this.pageLoader = false;
          this.courseFieldList = response.Data.Table;
          this.courseField = response.Data.Table[0].course_id;
          this.course_id = response.Data.Table[0].course_id;
          this.courseName = response.Data.Table[0].course_code;
          setTimeout(()=>{
            this.GetCourseDetailsFun();
          },100)
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

  GetCourseDetailsFun(){
    console.log("getcoursedetails called")
    this.pageLoader = true;
      let request = {
        "Course": this.courseType,
        "CourseStream": this.courseField,
        "CustID": this.restapiProvider.userData['CustomerID'],
        'TokenId': this.restapiProvider.userData['tokenId']
        }
    return this.restapiProvider.sendRestApiRequest(request, 'GetCourseDetails').subscribe((response) => {
      this.pageLoader = false; 
      if (response.IsSuccess == true) {
          this.countryList = response.Data.Table;
          if(this.collegeIsIndia == "yes"){
            for(let i = 0; i < this.countryList.length; i++){
              if(response.Data.Table[i].country == "India"){
                this.costOfCourse = parseInt(response.Data.Table[i].TotalCost);
                this.costOfCourseComma = "₹" + (this.numberPipe.transform(this.costOfCourse.toString().replaceAll(",","")));
                this.country = response.Data.Table[i].country;
                break;
              }
            }
          }
          else{
            if(response.Data.Table.length > 0){
              this.costOfCourse = parseInt(response.Data.Table[0].TotalCost);
              this.costOfCourseComma = "₹" + (this.numberPipe.transform(this.costOfCourse.toString().replaceAll(",","")));
              this.country = response.Data.Table[0].country
            }
          }
          // console.log(response.Data)
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
    
    this.costOfCourseComma = "₹" + amountStr;
    this.costOfCourse = amount;
  }

  setAgeState(ageState){
    $('.tell_us_slider .slick-current').trigger('click');
    this.ageStatus = ageState;
  }

  async CourseType(){
    let commonList = this.courseTypeList.map(el => {
      const obj = {
        name: el.course,
        value: el.course_id,
      };
      return obj;
    }
      
    );
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { 
        commonList: commonList,
        selectOption: this.courseType
      },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
        this.courseType = data;
        this.courseTypeCahnge();
    })

  }

  async CourseField(){
    let commonList = this.courseFieldList.map(el => {
      const obj = {
        name: el.course_code,
        value: el.course_code
      };
      return obj;
    }
      
    );
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { 
        commonList: commonList,
        selectOption: this.courseName
      },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
        this.courseField = data;
        this.courseFieldList.forEach(element => {
          if(element.course_code == data){
            this.courseName = element.course_code;
            this.courseField = element.course_id;
            this.course_id = element.course_id;
          }
        });
        // console.log("field", data);
        this.fieldChange();
    })

  }

  async CountrySelect(){
    let commonList = this.countryList.map(el => {
      const obj = {
        name: el.country,
        value: el.country,
      };
      return obj;
    }
      
    );
    console.log("country list", commonList);
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { 
        commonList: commonList,
        selectOption: this.country
      },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
        this.country = data;
        this.countryChange(data);
    })

  }
}
