import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities'
import { MyApp } from '../../../app/app.component';
import * as $ from 'jquery';
@IonicPage()
@Component({
  selector: 'page-infographics-landing',
  templateUrl: 'infographics-landing.html',
})
export class InfographicsLandingPage {
  public filterStatus: boolean = false;
  public pageLoader: boolean = false;
  public infographicList: any = [];
  public imgURL;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    public myApp: MyApp) {
    this.imgURL = this.restapiProvider.getImageURL();
  }
  ionViewDidLoad() {
    this.infographics();
  }

  ionViewDidEnter() {
    this.utilitiesProvider.upshotScreenView('InfographicsListing');
    this.utilitiesProvider.upshotTagEvent('InfographicsListing');
  }

  showFilter() {
    this.filterStatus = !this.filterStatus;
    if (this.filterStatus == true) {
      $('.articles_num').addClass('articles_num_overlay');
      $('.footer').addClass('footerOverlay');
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
  }
  filterHide() {
    this.filterStatus = !this.filterStatus;
    if (this.filterStatus == false) {
      $('.articles_num').removeClass('articles_num_overlay');
      $('.footer').removeClass('footerOverlay');
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
    }
  }
  goDetails(info) {
    this.navCtrl.push('InfographicsDetailsPage', { 'data': info.ArticleID });
  }
  goNotificationList() {
    this.navCtrl.push('NotificationPage');
  }
  search() {
    this.navCtrl.push('SearchPage');
  }
  infographics() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      // 'TopCount':'3'
    }
    this.pageLoader = true;
    return this.restapiProvider.sendRestApiRequest(request, 'Infographics')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          this.infographicList = response.Data.Table;
        }
        else {
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
}


