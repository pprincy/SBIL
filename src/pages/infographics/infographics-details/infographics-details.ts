import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Content } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import '../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { MyApp } from '../../../app/app.component';
@IonicPage()
@Component({
  selector: 'page-infographics-details',
  templateUrl: 'infographics-details.html',
})
export class InfographicsDetailsPage {
  public articleID;
  public infoDetails: any = {};
  public pageLoader: boolean = false;
  public imgURL;
  public infographicList: any = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    public myApp: MyApp) {
    this.imgURL = this.restapiProvider.getImageURL();
  }
  ionViewDidLoad() {
    this.articleID = this.navParams.get("data")
    this.getInfoDetails(this.articleID);
    this.infographics();
  }
  ionViewDidEnter() {
    this.utilitiesProvider.upshotScreenView('InfographicsDetail');
    this.utilitiesProvider.upshotTagEvent('InfographicsDetail');
  }
  getInfoDetails(type) {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "ArticleId": this.articleID
    }
    this.restapiProvider.sendRestApiRequest(request, 'ArticleDetails').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        this.infoDetails = response.Data.Table[0];
      }
    }, (error) => {
      this.pageLoader = false;
    })
  }
  infographics() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      'TopCount': '5'
    }
    return this.restapiProvider.sendRestApiRequest(request, 'Infographics')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.infographicList = response.Data.Table;
        }
      },
        (error) => {
        })
  }
  search() {
    this.navCtrl.push('SearchPage');
  }
  goNotificationList() {
    this.navCtrl.push('NotificationPage');
  }
  relatedInfo(i) {
    this.navCtrl.push('InfographicsDetailsPage', { 'data': i.ArticleID });
  }
}
