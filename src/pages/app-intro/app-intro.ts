import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { MyApp } from '../../app/app.component';
import { RestapiProvider } from '../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { Network } from '@ionic-native/network';
@IonicPage()
@Component({
  selector: 'page-app-intro',
  templateUrl: 'app-intro.html',
})
export class AppIntroPage {
  public versionCode;
  public isSubscPause = false;
  public isSubscResume = false;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public menu : MenuController,
              public appVersion: AppVersion,
              public ga: GoogleAnalytics,
              public myApp : MyApp,
              public network: Network,
              public utilitiesProvider: UtilitiesProvider,
              public restapiProvider: RestapiProvider,
              public platform: Platform
            ) {
                this.menu.enable(false, 'sidemenu');
     }

  ionViewDidLoad() {
     this.appVersion.getVersionNumber().then((version) => {
       this.versionCode = version;
        this.ga.setAppVersion(this.versionCode);
        },
        (error) => {
        });

    if (!this.utilitiesProvider.isResumePauseListenerSet) {
      this.utilitiesProvider.isResumePauseListenerSet = true;
      this.platform.pause.subscribe(() => { //added isSubscPause & isSubscResume bcoz its getting triggered on subscription
        if (this.isSubscPause) {
          console.log("platform pause >>>")
          this.utilitiesProvider.registerUpshotSessionEndEvent();
          this.isSubscPause = false;
          this.isSubscResume = true;
        }
        this.isSubscPause = true;
      });
      this.platform.resume.subscribe(() => {
        if (this.isSubscResume) {
          console.log("platform resume >>>")
          this.utilitiesProvider.registerUpshotLaunchEvent();
          this.isSubscPause = true;
          this.isSubscResume = false;
        }
        this.isSubscResume = true;
      });
    }
  }
  skip(){
    // if(this.navCtrl.getActive().name == "AppIntroPage"){ //this.navCtrl.getActive().name not working in prod
    if(this.navCtrl.getActive().id == "AppIntroPage"){ //replaced with this.navCtrl.getActive().id
      this.navCtrl.setRoot("LoginPage")
    }
  }
}
