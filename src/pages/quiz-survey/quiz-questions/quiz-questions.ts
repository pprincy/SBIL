import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import {MyApp} from '../../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-quiz-questions',
  templateUrl: 'quiz-questions.html',
})
export class QuizQuestionsPage {

  public quizQuestionArr = [];
  public quizQuestionArrCopy = [];
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
    this.myApp.updatePageUseCount("69");
    this.utilitiesProvider.googleAnalyticsTrackView('Quiz Questions');
    this.utilitiesProvider.isCheckQuiz = false;
    this.utilitiesProvider.isReplyQuiz = false;
    // console.log("ionViewDidLoad()")
    this.getQuizQuestions();
  }

  ionViewWillEnter() {
    // console.log("isReplyQuiz", this.utilitiesProvider.isReplyQuiz)
    if (this.utilitiesProvider.isReplyQuiz) {
      this.resetAll();
    }
    // console.log("ionViewWillEnter()")
  }

  getQuizQuestions() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "QuestionType": "Q",
      "QBHeaderID": this.qbHeaderID,
      "LangId": localStorage.getItem('langId')
    }
    // console.log(request);
    this.restapiProvider.sendRestApiRequest(request, 'SurveyQuizQuestion').subscribe((response) => {
      if (response.IsSuccess == true) {
        if (response.Data.Table.length) {
          this.quizQuestionArr = response.Data.Table;
          this.formatQuestionList();
          this.questionHeader = this.quizQuestionArr[0].QB_Header_Name;

          this.pageLoader = false;
          this.showButton = true;
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

    this.quizQuestionArr.sort((a, b) => a.QB_ID - b.QB_ID); //sort question list array in ascending wrt QB_ID

    var lastID;
    this.quizQuestionArr.forEach(el => { // Formatting question list array for diplay
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
    this.quizQuestionArrCopy = result;
  }

  submitAnswer() {
    this.isSubmitAnswer = true;
    // console.log(this.quizQuestionArrCopy)

    var ansArr = [];

    this.quizQuestionArrCopy.forEach(el => {
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
      this.insertUserAnswer(ansArr);
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
      "QBHeaderID": this.quizQuestionArr[0].QB_Header_ID,
      "QBResponses": ansArr
    }
    // console.log("insertUserAnswer", request);

    this.restapiProvider.sendRestApiRequest(request, 'SubmitSurveyQuizAnswer').subscribe((response) => {
      if (response.IsSuccess == true) {
        if (response.Data.Table[0].Msg == "Success") {
          var percResult;
          var totalQues = this.quizQuestionArrCopy.length;
          var totalCorrectAns = 0;

          this.quizQuestionArrCopy.forEach(el => {
            var userSelectedAns = el.ResponseArr.filter(elem => elem.QB_Response_ID == el.UserSelectedResponse)[0];
            if (userSelectedAns.IsRightResponse) {
              totalCorrectAns++;
            }
          })

          percResult = (totalCorrectAns / totalQues) * 100;

          var resultObj = {
            "PercResult": percResult,
            "TotalQues": totalQues,
            "CorrectAns": totalCorrectAns,
            "QBHeaderID": this.quizQuestionArr[0].QB_Header_ID
          }

          // console.log(resultObj)
          this.pageLoader = false;
          this.navCtrl.push("QuizResultPage", { resultObj: resultObj });
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
    this.quizQuestionArrCopy.forEach(el => {
      el.UserSelectedResponse = undefined;
    })
  }

  goNotificationList() {
    this.navCtrl.push('NotificationPage');
  }

}
