import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import {MyApp} from '../../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-survey-questions',
  templateUrl: 'survey-questions.html',
})
export class SurveyQuestionsPage {

  public surveyQuestionArr = [];
  public surveyQuestionArrCopy = [];
  public questionHeader;
  public isSubmitAnswer = true;
  public qbHeaderID;
  public pageLoader = false;
  public showButton = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    public myApp : MyApp
  ) {
    this.qbHeaderID = this.navParams.get('qbHeaderID')
  }

  ionViewDidLoad() {
    this.myApp.updatePageUseCount("70");
    this.utilitiesProvider.googleAnalyticsTrackView('Survey Questions');
    // console.log('ionViewDidLoad SurveyQuestionsPage');
    this.getSurveyQuestions();
  }

  ionViewWillEnter() {
    // console.log("ionViewWillEnter()")
  }

  getSurveyQuestions() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "QuestionType": "S",
      "QBHeaderID": this.qbHeaderID,
      "LangId": localStorage.getItem('langId')
    }
    // console.log(request);
    this.restapiProvider.sendRestApiRequest(request, 'SurveyQuizQuestion').subscribe((response) => {
      if (response.IsSuccess == true) {
        if (response.Data.Table.length) {
          this.surveyQuestionArr = response.Data.Table;
          this.formatQuestionList();
          this.questionHeader = this.surveyQuestionArr[0].QB_Header_Name;

          this.showButton = true;
          this.pageLoader = false;
        }
        else {
          this.pageLoader = false;
          this.utilitiesProvider.presentToastTop("no questions available")
          this.navCtrl.pop();
        }
      }
      else {
        this.pageLoader = false;
        this.navCtrl.pop();
      }
    },
      (error) => {
        this.pageLoader = false;
        // console.log(error)
        this.navCtrl.pop();
      })
  }

  formatQuestionList() {
    var result = []

    this.surveyQuestionArr.sort((a, b) => a.QB_ID - b.QB_ID); //sort question list array in ascending wrt QB_ID

    var lastID;
    this.surveyQuestionArr.forEach(el => { // Formatting question list array for diplay
      var ansObj = {
        "QB_Response_ID": el.QB_Response_ID,
        "Response_Text": el.Response_Text,
        "Response_Position": el.Response_Position,
        "IsRightResponse": el.IsRightResponse
      }

      if (lastID != el.QB_ID) {
        var quesObj = {
          "QB_Header_ID": el.QB_Header_ID,
          "QB_Header_Name": el.QB_Header_Name,
          "QB_ID": el.QB_ID,
          "QB_Quetion": el.QB_Quetion,
          "Language": el.Language,
          "LangName": el.LangName,
          "UserSelectedResponse": undefined,
          "ResponseArr": []
        }
        quesObj.ResponseArr.push(ansObj)
        result.push(quesObj)
        lastID = el.QB_ID
      }
      else {
        result[result.length - 1].ResponseArr.push(ansObj);
      }
    })

    result.forEach(el => {
      el.ResponseArr.sort((a, b) => a.Response_Position - b.Response_Position); //sorting array in ascending wrt Response_Position
    })

    // console.log(result)
    this.surveyQuestionArrCopy = result;
  }

  submitAnswer() {
    this.isSubmitAnswer = true;
    // console.log(this.surveyQuestionArrCopy)

    var ansArr = [];

    this.surveyQuestionArrCopy.forEach(el => {
      if (el.UserSelectedResponse != undefined || el.UserSelectedResponse != null) {
        var userSelectedAns = el.ResponseArr.filter(elem => elem.QB_Response_ID == el.UserSelectedResponse)[0];
        var ansObj = {
          "QuestionID": el.QB_ID,
          "AnswerID": userSelectedAns.QB_Response_ID,
          "AnswerText": "NA"
        }
        ansArr.push(ansObj)
      }
      else {
        this.isSubmitAnswer = false;
      }
    })

    if (this.isSubmitAnswer) {
      this.insertUserAnswer(ansArr)
    }
    else {
      this.utilitiesProvider.presentToastTop("Please attempt all the questions")
    }

  }

  insertUserAnswer(ansArr) {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "LangId": localStorage.getItem('langId'),
      "QBHeaderID": this.surveyQuestionArr[0].QB_Header_ID,
      "QBResponses": ansArr
    }
    // console.log("insertUserAnswer", request);

    this.restapiProvider.sendRestApiRequest(request, 'SubmitSurveyQuizAnswer').subscribe((response) => {
      if (response.IsSuccess == true) {
        if (response.Data.Table[0].Msg == "Success") {
          this.pageLoader = false;

          var resultObj = { "QBHeaderID": this.surveyQuestionArr[0].QB_Header_ID }
          this.navCtrl.push("SurveyResultPage", { resultObj: resultObj });
        }
        else {
          this.pageLoader = false;
        }
      }
      else {
        this.pageLoader = false;
      }
    },
      (error) => {
        this.pageLoader = false;
        // console.log(error)
      })
  }

  resetAll() {
    this.surveyQuestionArrCopy.forEach(el => {
      el.UserSelectedResponse = undefined;
    })
  }

  goNotificationList() {
    this.navCtrl.push('NotificationPage');
  }

}
