import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Navbar } from 'ionic-angular';
import { UtilitiesProvider } from '../../providers/utilities/utilities'
import { RestapiProvider } from '../../providers/restapi/restapi';
import * as $ from 'jquery';
import { MyApp } from '../../app/app.component'
import { Badge } from '@ionic-native/badge';
@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  public calList: any = [];
  @ViewChild(Navbar) navBar: Navbar;
  public hideHomeIcon: boolean = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public utilitiesProvider: UtilitiesProvider,
    private restapiProvider: RestapiProvider,
    public menuCtrl: MenuController,
    public myApp: MyApp,
    public badge: Badge) {
  }
  ionViewDidLoad() {
    this.calList = this.utilitiesProvider.calculatorList;
    this.badge.clear();
    this.navBar.backButtonClick = (e: UIEvent) => {
      this.hideHomeIcon = false;
      this.navCtrl.pop();
    }

    this.utilitiesProvider.upshotScreenView('Notification');
  }
  calClick(c) {
    if (c.className == "") {
      this.restapiProvider.presentToastTop("Coming Soon...");
    }
    else {
      this.navCtrl.setRoot(c.className);
    }
  }
  menuToggle() {
    this.menuCtrl.open();
  }
  toggleClass(id) {
    $('#' + id).toggleClass('active')
  }
  notificationClick(n) {
    if(!n.appData) { // DB Notification
      if (n.CatID == 3 || n.CatID == 9 || n.CatID == 2) {
        this.updateNotificationReadCount(n.NotificationID);
        this.navCtrl.push('ArticleDetailsPage', { data: n.ArticleID });
      }
      else {
        this.navCtrl.pop();
        this.myApp.notification();
      }
    }
    else { // Upshot notification
      if (n.appData.PageName == "ArticleDetailsPage" || n.appData.PageName == "InfographicsDetailsPage") {
        if (n.appData.ArticleID) {
          this.navCtrl.push(n.appData.PageName, {
            data: n.appData.ArticleID,
            fromPage: "Push Notification"
          });
        }
      }
      else if(n.appData.PageName) {
        this.navCtrl.push(n.appData.PageName, { pageFrom: "Push Notification" });
      }
    }
  }
  doRefresh(refresher) {
    this.myApp.notification()
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  goBack() {
    this.hideHomeIcon = false;
    this.navCtrl.pop();
  }
  updateNotificationReadCount(id) {
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "NotificationId": id
    }
    return this.restapiProvider.sendRestApiRequest(request, 'UpdateNotificationReadCount')
      .subscribe((response) => {
        this.myApp.notification();
      },
        (error) => {
        })
  }
}

