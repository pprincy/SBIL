import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { TabsPage } from '../../../pages/dashboard/tabs/tabs';
import {MyApp} from '../../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-quiz-result',
  templateUrl: 'quiz-result.html',
})
export class QuizResultPage {

  public resultObj;
  public allArticlesList = [];
  public relatedArticles = [];
  public imgURL;
  public langID = localStorage.getItem('langId');
  public pageLoader = false;
  public qbHeaderID;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    public myApp : MyApp
  ) {
    this.imgURL = this.restapiProvider.getImageURL();
    this.resultObj = this.navParams.get('resultObj');
    this.qbHeaderID = this.resultObj.QBHeaderID;
    // console.log("got params", this.resultObj)
  }

  ionViewDidLoad() {
    this.myApp.updatePageUseCount("71");
    this.utilitiesProvider.googleAnalyticsTrackView('Quiz Final');
    // console.log('ionViewDidLoad QuizResultPage');
    this.getReferenceArticles();
  }

  close() {
    if(this.utilitiesProvider.isFromMenu) {
      this.navCtrl.setRoot(TabsPage);
    }
    else {
      this.navCtrl.setRoot("DiscoverPage");
    }
  }

  checkAnswer() {
    this.utilitiesProvider.isCheckQuiz = true;
    this.utilitiesProvider.isReplyQuiz = false;
    this.navCtrl.pop();
  }

  playAgain() {
    this.utilitiesProvider.isReplyQuiz = true;
    this.utilitiesProvider.isCheckQuiz = false;
    this.navCtrl.pop();
  }

  getReferenceArticles() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "LangId": localStorage.getItem('langId'),
      "QBHeaderID": this.qbHeaderID
    }
    this.restapiProvider.sendRestApiRequest(request, 'SurveyQuizRefArticle').subscribe((response) => {
      if (response.IsSuccess == true) {
        this.relatedArticles = response.Data.Table;
        // console.log("related articles", this.relatedArticles)

        this.pageLoader = false;
      }
      else {
        this.pageLoader = false;
      }
    },
      (error) => {
        this.pageLoader = false;
        // console.log(error);
      });
  }

  relatedArt(i){
    this.navCtrl.push('ArticleDetailsPage', {data: i.ArticleID});
  }

}
