import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides, LoadingController } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { Keyboard } from '@ionic-native/keyboard';
import '../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-risk-assesment',
  templateUrl: 'risk-assesment.html',
})
export class RiskAssesmentPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  public questAnsRespArr: any = [];
  public questAnsArr: any = [];
  public imgArr: any = [];
  public status: boolean = false;
  public pageLoader: boolean = false;
  public questSet: any;
  public questAnsReqObject: any = [];
  loading: any;
  keyboardShow: boolean = false;
  backBtnhide: boolean = true;
  scrollHeight;
  public pageFrom;
  public answerID = 47;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    private loadingCtrl: LoadingController,
    private keyboard: Keyboard) {
    this.keyboard.onKeyboardShow().subscribe(data => {
      this.keyboardShow = true;
    });
    this.keyboard.onKeyboardHide().subscribe(data => {
      this.keyboardShow = false;
    });
    this.imgArr = ['risk_assessment_step1.png', 'risk_assessment_step2.png', 'risk_assessment_step3.png', 'risk_assessment_step4.png']
    this.questSet = new Set();

    this.pageFrom = this.navParams.get('pageFrom');
  }
  ionViewDidEnter() {
    this.slides.lockSwipes(true);
    this.slides.update();
    let a = $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
    if (a) {
      this.scrollHeight = a;
    }
    // $('.scroll_div .scroll-content').attr('style', this.scrollHeight);
    // $('.scroll_div .fixed-content').attr('style', this.scrollHeight);
   this.utilitiesProvider.upshotScreenView('RiskAssessmentInitiation');
  }
  bringToFirstPage() {
    let currentIndex = this.slides.getActiveIndex();
    while (currentIndex != 0) {
      this.back();
      currentIndex = this.slides.getActiveIndex();
    }
  }
  ionViewDidLoad() {
    this.loadQuestions();
    this.startLoad();
  }
  ionViewWillEnter() {
    this.bringToFirstPage();
  }
  mappingQuestAns() {
    for (let i = 0; i < this.questAnsRespArr.length; i++) {
      if (!this.questSet.has(this.questAnsRespArr[i].QuestionID)) {
        this.questAnsArr.push({
          "QueDispOrder": this.questAnsRespArr[i].QueDispOrder,
          "Question": this.questAnsRespArr[i].Question,
          "QuestionID": this.questAnsRespArr[i].QuestionID,
          "AnswersArr": [{
            "AnsDispOrder": this.questAnsRespArr[i].AnsDispOrder,
            "Answer": this.questAnsRespArr[i].Answer,
            "AnswerID": this.questAnsRespArr[i].AnswerID,
          }],
          "Score": this.questAnsRespArr[i].Score,
          "Weightage": this.questAnsRespArr[i].Weightage,
          // "Type":this.questAnsRespArr[i].Type,
          // "RiskCategory":this.questAnsRespArr[i].RiskCategory
        })
        this.questSet.add(this.questAnsRespArr[i].QuestionID);
      }
      else {
        for (let j = 0; j < this.questAnsArr.length; j++) {
          if (this.questAnsRespArr[i].QuestionID === this.questAnsArr[j].QuestionID) {
            this.questAnsArr[j]["AnswersArr"].push({
              "AnsDispOrder": this.questAnsRespArr[i].AnsDispOrder,
              "Answer": this.questAnsRespArr[i].Answer,
              "AnswerID": this.questAnsRespArr[i].AnswerID,
            })
            break;
          }
        }
      }
    }
    for (let i = 0; i < this.questAnsArr.length; i++)
      for (let j = 0; j < this.questAnsArr[i].AnswersArr.length; j++) {
        if (this.questAnsArr[i].AnswersArr[j].AnsDispOrder == 1) {
          this.questAnsReqObject.push({ "QuestionID": this.questAnsArr[i].QuestionID, "AnswerID": this.questAnsArr[i].AnswersArr[j].AnswerID })
          break;
        }
      }
  }
  loadQuestions() {
    this.pageLoader = true;
    let request = {
      "CustID": this.restapiProvider.userData['CustomerID'],
      "TokenID": this.restapiProvider.userData['tokenId'],
    }
    return this.restapiProvider.sendRestApiRequest(request, 'RiskAssessmentQues').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        this.questAnsRespArr = response.Data.Table;
        this.mappingQuestAns();
      }
      else {
      }
    },
      (error) => {
        this.pageLoader = false;
      });
  }
  startLoad() {
    this.slides.lockSwipes(false);
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
      $('.tell_us_slider .slick-current').trigger('click');
      $('.tell_us_slider').css('opacity', 1);
      this.slides.lockSwipes(true);
    }, 500);
    $('.tell_us_cont .ion-ios-add-circle-outline').click(function (e) {
      e.stopPropagation();
      $(this).parents('.tell_us_cont').addClass('active');
      $('.tell_us_slider .slick-current').trigger('click');
    });
    $('.tell_us_cont .ion-md-create').click(function (e) {
      e.stopPropagation();
      $(this).toggle();
      $(this).siblings('.icon').toggle();
    });
    setTimeout(function () {
      var totalHeight = $('.swiper-slide-active').outerHeight();
      var slide_heading = $('.age_slider_heading').outerHeight();
      var nps_first = $('.nps_age_first').outerHeight();
      var actualheight = slide_heading + nps_first * 1.5;
      $('.tell_us_cont_common').height(totalHeight - actualheight);
    }, 1500);
    $('.tell_us_slider').on('afterChange', function (event, slick, currentSlide, nextSlide) {
      let retirementCorpusDateVar = new Date();
      let d = retirementCorpusDateVar.getFullYear();
      let selectedYearHome = parseInt($(".homeYear.tell_us_slider .slick-current .tell_us_slider_age").text());
      this.yearDiff = d + selectedYearHome;
      $('.diffYear').html(this.yearDiff)
    });
  }
  setAnswers(questionID, quesIndex, answerID, ansIndex) {
    this.answerID = answerID;
    console.log("anser idddddddd", this.answerID);
    for (let i = 0; i < this.questAnsReqObject.length; i++) {
      if (parseInt(this.questAnsReqObject[i].QuestionID) == parseInt(questionID)) {
        this.questAnsReqObject[i].AnswerID = parseInt(answerID)
        break;
      }
    }
  }
  toggleClass(id) {
    $('#' + id).toggleClass('active')
  }
  activateBar() {
    let currentIndex = this.slides.getActiveIndex() + 1;
    let stepIndex = $('.calculator_steps .calculator_steps_com  .calculator_steps_com_num span').text();
    $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').prevAll().addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').nextAll().removeClass('active');
    this.slides.lockSwipes(true);
  }
  onSliderChange() {
    var totalHeight = $('.swiper-slide-active .slide-zoom').height();
    var slide_heading = $('.age_slider_heading').height();
    var nps_first = $('.nps_age_first').height();
    var actualheight = slide_heading + nps_first * 1.5;
    $('.tell_us_cont_common').height(totalHeight - actualheight);
  }
  next() {
    this.backBtnhide = false;
    this.slides.lockSwipes(false);
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == 0) {
      this.goToNextSlide()
      this.answerID = 52
    }
    if (currentIndex == 1) {
      this.goToNextSlide()
      this.answerID = 57
    }
    if (currentIndex == 2) {
      this.goToNextSlide()
      this.answerID = 61
    }
    if (currentIndex == 3) {
      this.CalculateRiskProfile(); 
    }
  }
  goToNextSlide() {
    let currentIndex = this.slides.getActiveIndex();
    this.slides.slideTo(currentIndex + 1, 500);
    this.activateBar();
    this.slides.lockSwipes(true);
  }
  back() {
    this.slides.lockSwipes(false);
    let yOffset = document.getElementById("stepsCount").offsetTop;
    this.content.scrollTo(0, yOffset, 0)
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == 1) {
      this.backBtnhide = true;
    }
    this.slides.slideTo(currentIndex - 1, 500);
    this.activateBar();

    if (currentIndex == 1) {
      this.answerID = 47
    }
    if (currentIndex == 2) {
      this.answerID = 52
    }
    if(currentIndex == 3){
      this.answerID = 57
    }
  }
  CalculateRiskProfile() {
    this.pageLoader = true;
    let request = {
      "CustID": this.restapiProvider.userData['CustomerID'],
      "TokenID": this.restapiProvider.userData['tokenId'],
      "QuesAns": this.questAnsReqObject
    }
    return this.restapiProvider.sendRestApiRequest(request, 'InsertRiskAssessmentQA').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        this.restapiProvider.userData['riskAssess'] = JSON.stringify(response.Data.Table);
        this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
        this.navCtrl.push('RiskassesmentFinalPage', { data: response.Data.Table[0] });

        this.setUpshotEvent(response.Data.Table[0].RiskProfile)
      }
      else {
      }
    },
      (error) => {
        this.pageLoader = false;
      })
  }

  setUpshotEvent(riskProf) {
    try {
      let payload = {
        "Appuid": this.utilitiesProvider.upshotUserData.appUId,
        "Language": this.utilitiesProvider.upshotUserData.lang,
        "City": this.utilitiesProvider.upshotUserData.city,
        "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
        "DrivenFrom": this.navParams.get('pageFrom') == "Risk Assesment Final" ? 'Reassess' : 'First Time',
        "DescibeMyself": this.questAnsArr[0]['AnswersArr'].filter(el => el.AnswerID == this.questAnsReqObject[0].AnswerID)[0]['Answer'],
        "RiskAppettite": this.questAnsArr[1]['AnswersArr'].filter(el => el.AnswerID == this.questAnsReqObject[1].AnswerID)[0]['Answer'],
        "RiskScenarioSelected": this.questAnsArr[2]['AnswersArr'].filter(el => el.AnswerID == this.questAnsReqObject[2].AnswerID)[0]['Answer'],
        "DefineRisk": this.questAnsArr[3]['AnswersArr'].filter(el => el.AnswerID == this.questAnsReqObject[3].AnswerID)[0]['Answer'],
        "RiskProfile": riskProf
      }
      console.log(payload)
      this.utilitiesProvider.upshotCustomEvent('RiskAssessment', payload, false);
    }
    catch (e) {
      console.log(e)
    }
  }
}
