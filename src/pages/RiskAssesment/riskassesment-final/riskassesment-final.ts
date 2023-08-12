import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { MyApp } from '../../../app/app.component';
@IonicPage()
@Component({
  selector: 'page-riskassesment-final',
  templateUrl: 'riskassesment-final.html',
})
export class RiskassesmentFinalPage {
  public profileType;
  public message;
  public profileCode;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public utilitiesProvider: UtilitiesProvider,
    public menuCtrl: MenuController,
    public restapiProvider: RestapiProvider,
    public myApp: MyApp) {
    this.profileType = this.navParams.get("data").RiskProfile;
    this.message = this.navParams.get("data").ProfileText;
    this.profileCode = this.navParams.get("data").ProfileCode;
  }
  goBack() {
    this.navCtrl.setRoot('RiskAssesmentPage', {pageFrom: 'Risk Assesment Final'})
  }
  menuToggle() {
    this.menuCtrl.open();
  }
  goToGoalListing() {
    this.navCtrl.setRoot('ListingScreenGoalPage', { pageFrom: 'Risk Assesment' })
  }
  takeScreenshot() {
    this.utilitiesProvider.screenShotURI();
  }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("9");
    this.utilitiesProvider.googleAnalyticsTrackView('Risk Assessment');

   this.utilitiesProvider.upshotScreenView('RiskAssessment');
   this.utilitiesProvider.upshotTagEvent('RiskAssessment');
  }
  goNotificationList() {
    this.navCtrl.push('NotificationPage');
  }
}
