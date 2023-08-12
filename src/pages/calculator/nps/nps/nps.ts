import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides, LoadingController } from 'ionic-angular';
import '../../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { DecimalPipe } from '@angular/common';
import { config } from '../../../../shared/config';
import * as HighCharts from 'highcharts';

@IonicPage()
@Component({
  selector: 'nps-page',
  templateUrl: 'nps.html',
})
export class NpsPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  public retireAgeBar: any = [];
  public nowAgeBar: any = [];
  public steps = 100;
  public contribute;
  public contributeComma;
  public minValue;
  public maxValue;
  public isBtnActive: boolean = false;
  public status: boolean = false;
  public pageLoader: boolean = false;
  public ageDiff: number;
  public loading: any;
  public sliderRetireAge;
  public sliderAgeNowAge;
  public backBtnhide: boolean = true;
  public scrollHeight;
  public userAge;
  public pageFrom;
  public currentAge: boolean = false;
  public retireAge: boolean = false;
  public ageStatus = "retire";
  public diffVal;
  public ageYearError: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    private numberPipe: DecimalPipe,
    private loadingCtrl: LoadingController) {
    this.utilitiesProvider.defaultCalData = this.utilitiesProvider.defaultData.Item1.calculators.nps;
    this.minValue = parseInt(this.utilitiesProvider.defaultCalData.sliderConfig.monthly_contri_pa.min);
    this.maxValue = parseInt(this.utilitiesProvider.defaultCalData.sliderConfig.monthly_contri_pa.max);
    this.contribute = parseInt(this.utilitiesProvider.defaultCalData.sliderConfig.monthly_contri_pa.min);
    
    let amount : number = 0;
    let amountStr : String = "";
    if(this.contribute) {
      amount = Number(this.contribute.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }

    this.contributeComma = "₹" + amountStr;
    this.nowAgeBar = this.utilitiesProvider.age18;
    this.retireAgeBar = this.utilitiesProvider.age40;
    this.userAge = this.restapiProvider.userData['age'];
    // console.log(this.utilitiesProvider.defaultCalData)

    this.pageFrom = this.navParams.get('pageFrom');
  }
  ionViewDidEnter() {
    this.slides.lockSwipes(true);
    this.slides.update();
    let a = $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
    if (a) {
      this.scrollHeight = a;
    }
    //$('.scroll_div .scroll-content').attr('style',this.scrollHeight);
    // $('.scroll_div .fixed-content').attr('style',this.scrollHeight);

    this.utilitiesProvider.upshotScreenView('NPSCalaculator');
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true);
    setTimeout(() => {
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

      var currentSlide = $('.tell_us_slider').not('.slick-initialized').slick('slickCurrentSlide');
      // console.log(currentSlide);
      $('.tell_us_slider .slick-current').trigger('click');
      $('.tell_us_cont_common').css('opacity', 1);
    }, 500);

    setTimeout(() => {
      let that = this;
      $(".tell_us_slider.sliderAgeNow div").each(function(){
        var curAge = parseInt($(this).find('.tell_us_slider_age').html());
        if(curAge == that.userAge)
        {
        $(this).not('.slick-cloned').trigger('click');
        }
        });

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

      var totalHeight = $('.swiper-slide-active').outerHeight();
      var slide_heading = $('.age_slider_heading').outerHeight();
      var nps_first = $('.nps_age_first').outerHeight();
      var actualheight = slide_heading + nps_first * 1.5;
      $('.tell_us_cont_common').height(totalHeight - actualheight);
    }, 1500);

    setTimeout(() => {
      $(".sliderRetire.tell_us_slider .item").each(function (index) {
        //var curAge = 60;
        if (parseInt($(this).find('.tell_us_slider_age').text()) == 60) {
          $(this).not('.slick-cloned').trigger('click');
        }
      })
    }, 1000)
    let that = this;
    $('.tell_us_slider').on('afterChange', function (event, slick, currentSlide, nextSlide) {
      that.sliderRetireAge = parseInt($(".sliderRetire.tell_us_slider .slick-current .tell_us_slider_age").text());
      that.sliderAgeNowAge = parseInt($(".sliderAgeNow.tell_us_slider .slick-current .tell_us_slider_age").text());
      let diff = that.sliderRetireAge - that.sliderAgeNowAge;
      $(".diff").html(diff);
      that.diffVal = diff;
      if (that.sliderRetireAge <= that.sliderAgeNowAge) {
        $('.year_cal').addClass('display_error');
        that.ageYearError = true;
      }
      else {
        $('.year_cal').removeClass('display_error');
        that.ageYearError = false;
      }
    });
  }

  onSliderChange() {
    // console.log('onSliderChange');
    var totalHeight = $('.swiper-slide-active .slide-zoom').height();
    var slide_heading = $('.age_slider_heading').height();
    var nps_first = $('.nps_age_first').height();
    var actualheight = slide_heading + nps_first * 1.5;
    $('.tell_us_cont_common').height(totalHeight - actualheight);
  }
  doSomething(e) {
    if (this.contribute >= (this.maxValue / 3) && this.contribute <= (this.maxValue / 2)) {
      this.steps = 1000;
    }
    else if (this.contribute >= (this.maxValue / 2) && (this.maxValue -  this.contribute ) < 500 ) {
      this.steps = 2000;
    }
    else if((this.maxValue -  this.contribute ) > 500 ){
      this.steps = 1;
    }
    else {
    }
    this.contributeComma = "₹" + this.numberPipe.transform(this.contribute.toString().replaceAll(",","").replaceAll("₹",""))
  }
  toggleClass(id) {
    $('#' + id).toggleClass('active');
  }

  stepOneNext() {
    let sliderRetire = $(".sliderRetire.tell_us_slider .slick-current .tell_us_slider_age").text();
    let sliderAgeNow = $(".sliderAgeNow.tell_us_slider .slick-current .tell_us_slider_age").text();
    if (sliderAgeNow >= sliderRetire) {
    }
    else {
      let yOffset = document.getElementById("stepsCount").offsetTop;
      this.content.scrollTo(0, yOffset, 0);
      this.slides.lockSwipes(false);
      let currentIndex = this.slides.getActiveIndex();
      this.slides.slideTo(1, 500);
      this.slides.lockSwipes(true);
      this.activateBar();
      this.onSliderChange();
      this.backBtnhide = false;
    }
  }

  next() {
    let currentIndex = this.slides.getActiveIndex();

    if (currentIndex == 0) {
      this.stepOneNext();
    }
    if (currentIndex == 1) {
      this.done();
    }
  }
  back() {
    let currentIndex = this.slides.getActiveIndex();
    this.backBtnhide = true;
    let yOffset = document.getElementById("stepsCount").offsetTop;
    this.content.scrollTo(0, yOffset, 0)
    this.slides.lockSwipes(false);
    this.slides.slideTo(currentIndex - 1, 500);
    this.slides.lockSwipes(true);
    this.activateBar();
  }


  activateBar() {
    let currentIndex = this.slides.getActiveIndex() + 1;
    let stepIndex = $('.calculator_steps .calculator_steps_com  .calculator_steps_com_num span').text();
    // if(currentIndex == stepIndex)
    $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').prevAll().addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').nextAll().removeClass('active');
  }




  done() {
    let sliderRetire = $(".sliderRetire.tell_us_slider .slick-current .tell_us_slider_age").text();
    let sliderAgeNow = $(".sliderAgeNow.tell_us_slider .slick-current .tell_us_slider_age").text();
    if(!sliderAgeNow && config['isLive'] == 'No') sliderAgeNow = "40";
    //this.contribute 
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "CurrentAge": parseInt(sliderAgeNow),
      "RetirementAge": parseInt(sliderRetire),
      "MonthlyContri": this.contribute,
      "PercPensionReinvestedInAnnuity": this.ammunityFun(),
      "RateOfInterest": parseInt(this.utilitiesProvider.defaultCalData.data.rateofinterest.default),
      "IncrementalSavingsRate": parseInt(this.utilitiesProvider.defaultCalData.data.incr_saving_rate.default)
    }
    this.GetNPS(request)
  }

  GetNPS(request) {
    this.pageLoader = true;
    // console.log("Request: " + JSON.stringify(request));
    return this.restapiProvider.sendRestApiRequest(request, 'GetNPSValues')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          // console.log(response);
          // console.log(response.Data)
          this.navCtrl.push('NpsFinalPage', { data: response.Data, pageFrom: this.pageFrom })
        }
        else {
          // console.log(response);
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }

  ammunityFun() {
    let sliderRetire = $(".sliderRetire.tell_us_slider .slick-current .tell_us_slider_age").text();
    let sliderAgeNow = $(".sliderAgeNow.tell_us_slider .slick-current .tell_us_slider_age").text();
    let CurrentAge = parseInt(sliderAgeNow);
    let RetirementAge = parseInt(sliderRetire);
    if (RetirementAge < 60) {
      return 80;
    }
    else {
      if (CurrentAge > 60) {
        if ((RetirementAge - CurrentAge) < 3) {
          return 80;
        }
        else {
          return 40;
        }
      }
      else {
        return 40;
      }
    }
  }

  formatAmount(val) {
    let amount : number = 0;
    let amountStr : String = "";
    if(val && val.trim() != "₹") {
      amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }
    this.contributeComma = "₹" + amountStr;
    this.contribute = amount;
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
    console.log("#####################");
    console.log(this.currentAge);
    console.log(this.retireAge);
    console.log("#####################");
    console.log(this.ageStatus);
  }

//   chartLoad(){
//     var myCharts = HighCharts.chart('nps-cart', {

//     chart: {
//         plotBackgroundColor: null,
//         plotBorderWidth: 0,
//         plotShadow: false
//     },
//     tooltip: {
//         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//     },

//     accessibility: {
//         point: {
//             valueSuffix: '%'
//         }
//     },

//     plotOptions: {
//         pie: {
//             dataLabels: {
//                 enabled: true,
//                 distance: -50,
//                 style: {
//                     fontWeight: 'bold',
//                     color: 'white'
//                 }
//             },
//             startAngle: -90,
//             endAngle: 90,
//             center: ['50%', '75%'],
//             size: '70%'
//         }
//     },

//     series: [{
//         type: 'pie',
//         name: 'Browser share',
//         innerSize: '50%',
//         data: [
//             ['', 73.86],
//             ['', 11.97],
//             ['', 5.52],
//             ['', 2.98],
//             ['', 1.90],
//         ]
//     }]
// });
  // }
}
