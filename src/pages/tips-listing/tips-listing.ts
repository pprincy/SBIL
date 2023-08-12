import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestapiProvider } from '../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../providers/utilities/utilities'
import { MyApp } from '../../app/app.component';
@IonicPage()
@Component({
  selector: 'page-tips-listing',
  templateUrl: 'tips-listing.html',
})
export class TipsListingPage {

  public tipsList: any = [];
  public imgURL: any;
  public pageLoader: boolean = false;
  public loadMore : boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    public myApp: MyApp) {
    this.imgURL = this.restapiProvider.getImageURL();
    this.getTips();
  }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("40");
    this.utilitiesProvider.googleAnalyticsTrackView('Tips');
  }
  ionViewDidEnter() {
    this.utilitiesProvider.upshotScreenView('TipsForYou');
    this.utilitiesProvider.upshotTagEvent('TipsForYou');
  }
  getTips() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "TopCount": "0"
    }
    return this.restapiProvider.sendRestApiRequest(request, 'Tips').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        this.tipsList = response.Data.Table;
      }
      else {
      }
    },
      (error) => {
        this.pageLoader = false;
      })
  }
  goNotificationList() {
    this.navCtrl.push('NotificationPage');
  }
  search() {
    this.navCtrl.push('SearchPage');
  }

  LoadMore(){
    this.loadMore = true;
  }
}
