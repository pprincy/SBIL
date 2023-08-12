import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { TabsPage } from '../../../pages/dashboard/tabs/tabs';
import {MyApp} from '../../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-survey-result',
  templateUrl: 'survey-result.html',
})
export class SurveyResultPage {

  public imgURL;
  public allArticlesList = [];
  public relatedArticles = [];
  public pageLoader = false;
  public qbHeaderID;
  public resultObj;

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
  }

  ionViewDidLoad() {
    this.myApp.updatePageUseCount("72");
    this.utilitiesProvider.googleAnalyticsTrackView('Survey Final');
    // console.log('ionViewDidLoad SurveyResultPage');
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
