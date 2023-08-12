import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { RestapiProvider } from '../../providers/restapi/restapi';
import { MenuController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {
  errorMessage: string;
  loading: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private restapiProvider: RestapiProvider,
    public menu: MenuController) {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.menu.enable(false, 'sidemenu');
  }
  guestLogin(event) {
    this.loading.present();
    let request = {
      "DeviceId": this.restapiProvider.userData['uuid'],
      "SimId": this.restapiProvider.userData['simSerialNumber'],
      "NotificationId": this.restapiProvider.userData['pushID']
    }
    this.restapiProvider.sendRestApiRequest(request, 'guestUserLogin')
      .subscribe((response) => {
        if (response.Data.Table[0].Status == 'Success') {
          this.restapiProvider.userData['custID'] = response.Data.Table[0].CustomerID;
          this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
          this.loading.dismiss();
          this.navCtrl.setRoot('HomePage', 'Guest');
        }
        else {
          this.loading.dismiss();
          this.errorMessage = 'Could not register user.';
        }
      });
  }
  login(event) {
    this.navCtrl.setRoot('LoginPage');
  }
}
