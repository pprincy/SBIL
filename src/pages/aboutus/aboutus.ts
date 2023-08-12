import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import * as $ from 'jquery';
import { AppVersion } from '@ionic-native/app-version';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { TermsConditionPage } from '../../components/modals/terms-condition/terms-condition';
import { DisclaimerPage } from '../../components/modals/disclaimer/disclaimer';


@IonicPage()
@Component({
  selector: 'page-aboutus',
  templateUrl: 'aboutus.html',
})
export class AboutusPage {
 public status:boolean = false;
 public versionCode;
 public showId;
 public pageLoader : boolean =true;
 public modal;
 constructor(public navCtrl: NavController, 
            public navParams: NavParams,
            public utilitiesProvider: UtilitiesProvider,
            private appVersion: AppVersion,
            public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
 this.appVersion.getVersionNumber().then((version) => {
    this.versionCode = version;
  },
      (error) => {
      });

 console.log("Version: ",this.versionCode);
 setTimeout(()=>{
  this.pageLoader = false;
 },1000)

 this.utilitiesProvider.upshotScreenView('AboutUs');
  }

  showContent(i){
    this.status = !this.status;
    this.showId= i
    if(this.status == true)  {
      $('.content_wrap').show();
      $('.footer').addClass('footerOverlay');
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
    else{
      $('.content_wrap').hide();
      $('.footer').removeClass('footerOverlay');
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
    }
  }
  closeContent(){
    this.status = !this.status;
    if(this.status == true)  {
      $('.content_wrap').show();
      $('.footer').addClass('footerOverlay');
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
    else{
      $('.content_wrap').hide();
      $('.footer').removeClass('footerOverlay');
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
    }
  }
  
  toggleClass(id) {
    $('#' + id).toggleClass('active')
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

