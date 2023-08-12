import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import {MyApp} from '../../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-quiz-survey-list',
  templateUrl: 'quiz-survey-list.html',
})
export class QuizSurveyListPage {

  public quizSurveyList = [];
  public surveyList = [];
  public quizList = [];
  public isSurveyData = true;
  public isQuizData = true;
  public pageLoader = false;
  public noData = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    public myApp : MyApp
    ) {
  }

  ionViewDidLoad() {
    this.myApp.updatePageUseCount("68");
    this.utilitiesProvider.googleAnalyticsTrackView('Quiz Survey List');
    // console.log('ionViewDidLoad QuizSurveyListPage');
    this.getSurveyQuizList();
  }

  ionViewDidEnter() {
    this.utilitiesProvider.upshotScreenView('QuizAndSurvey');
    this.utilitiesProvider.upshotTagEvent('QuizAndSurvey');
  }

  goToSurveyPage(qbHeaderID) {
    this.navCtrl.push("SurveyQuestionsPage", {qbHeaderID: qbHeaderID});
  }

  goToQuizPage(qbHeaderID) {
    this.navCtrl.push("QuizQuestionsPage", {qbHeaderID: qbHeaderID});
  }

  goNotificationList(){
    this.navCtrl.push('NotificationPage');
  }

  getSurveyQuizList() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "LangId": localStorage.getItem('langId')
    }
    // console.log(request);
    this.restapiProvider.sendRestApiRequest(request, 'SurveyQuizHeader').subscribe((response) => {
      if (response.IsSuccess == true) {
        if (response.Data.Table.length) {
          // console.log(response)
          this.quizSurveyList =  response.Data.Table;
          this.surveyList = this.quizSurveyList.filter(res => res.Type == "S")
          this.quizList = this.quizSurveyList.filter(res => res.Type == "Q")
          // console.log(this.surveyList)
          // console.log(this.quizList)

          if(this.surveyList.length) {
            this.isSurveyData = false;
          }
          if(this.quizList.length) {
            this.isQuizData = false;
          }
          this.pageLoader = false;
          this.noData = false;
        }
        else {
          this.pageLoader = false;
          // this.utilitiesProvider.presentToastTop("Currently no quiz or survey available.")
          // this.navCtrl.pop();
          this.noData = true;
        }
      }
      else {
        this.pageLoader = false;
        // this.utilitiesProvider.presentToastTop("Currently no quiz or survey available.")
        // this.navCtrl.pop();
        this.noData = true;
      }
    },
      (error) => {
        this.pageLoader = false;
        // console.log(error)
        // this.utilitiesProvider.presentToastTop("Currently no quiz or survey available.")
        // this.navCtrl.pop();
        this.noData = true;
      })
  }

}
