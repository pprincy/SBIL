import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, IonicPage, ModalController } from 'ionic-angular';
import { UtilitiesProvider } from '../../providers/utilities/utilities'
import { RestapiProvider } from '../../providers/restapi/restapi';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import * as $ from 'jquery';
import { TermsConditionPage } from '../../components/modals/terms-condition/terms-condition';
import { DisclaimerPage } from '../../components/modals/disclaimer/disclaimer';
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public calList: any = [];
  public status: boolean = false;
  public pageLoader: boolean = false;
  public showId;
  public isMpinEnable: boolean = true;
  public modal;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public utilitiesProvider: UtilitiesProvider,
    private restapiProvider: RestapiProvider,
    public geolocation: Geolocation,
    public geocoder: NativeGeocoder,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController) {
  }
  ionViewDidLoad() {
    if (this.restapiProvider.userData['MPINTYPE']) {
      this.isMpinEnable = false;
    }
    else {
      this.isMpinEnable = true;
    }

    this.utilitiesProvider.upshotScreenView('Setting');
  }
  userSettings(option) {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "NotificationFlag": this.restapiProvider.userData['NotificationFlag'] ? 1 : 0,
      "MPINFlag": this.restapiProvider.userData['MPINFlag'] ? 1 : 0,
      "LocationFlag": this.restapiProvider.userData['LocationFlag'] ? 1 : 0,
      "SMSFlag": this.restapiProvider.userData['SMSFlag'] ? 1 : 0
    }
    console.log("settingPage",request);
    return this.restapiProvider.sendRestApiRequest(request, 'UpdateUserSettingsFlag').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        if (response.Data.Table[0].MSG == "Success") {
          this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
        }
        else {
          this.restapiProvider.presentToastTop("Could save the settings!");
          this.restapiProvider.userData[option] = this.restapiProvider.userData[option] ? false : true;
        }
      }
      else {
        this.restapiProvider.presentToastTop("Could save the settings!");
        this.restapiProvider.userData[option] = this.restapiProvider.userData[option] ? false : true;
      }
    },
      (error) => {
        this.restapiProvider.presentToastTop("Could save the settings!");
        this.restapiProvider.userData[option] = this.restapiProvider.userData[option] ? false : true;
        this.pageLoader = false;
      })
  }
  showContent(i) {
    this.status = !this.status;
    this.showId = i
    if (this.status == true) {
      $('.content_wrap').show();
      $('.footer').addClass('footerOverlay');
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
    else {
      $('.content_wrap').hide();
      $('.footer').removeClass('footerOverlay');
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
    }
  }
  closeContent() {
    this.status = !this.status;
    if (this.status == true) {
      $('.content_wrap').show();
      $('.footer').addClass('footerOverlay');
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
    else {
      $('.content_wrap').hide();
      $('.footer').removeClass('footerOverlay');
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
    }
  }
  menuToggle() {
    this.menuCtrl.open();
  }
  toggleClass(id) {
    $('#' + id).toggleClass('active')
  }
  goNotificationList() {
    this.navCtrl.push('NotificationPage');
  }
  search() {
    this.navCtrl.push('SearchPage');
  }

  async termCondModal(){
    this.modal = await this.modalCtrl.create(
     TermsConditionPage,
     null,
     {
       showBackdrop: true,
       enableBackdropDismiss: true,
     }
   );
   await this.modal.present();
 }

 async disclaimerModal(){
   this.modal = await this.modalCtrl.create(
    DisclaimerPage,
    null,
    {
      showBackdrop: true,
      enableBackdropDismiss: true,
    }
  );
  await this.modal.present();
}
}

