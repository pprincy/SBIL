import { Component, ViewChild } from '@angular/core';
import { App, IonicPage, NavController, Nav, NavParams, Content } from 'ionic-angular';
import '../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
@IonicPage()
@Component({
  selector: 'page-complete',
  templateUrl: 'complete.html',
})
export class CompletePage {
  @ViewChild(Content) content: Content;
  public isBtnActive: boolean = false;
  public pageLoader: boolean = false;
  public profileData: any;
  backBtnhide: boolean = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public nav: Nav,
    public app: App,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider) {
    this.getUserProfileData();
  }

  ionViewDidEnter() {
    this.utilitiesProvider.upshotScreenView('ThankProfile');
  }

  getUserProfileData() {
    this.pageLoader = true
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId']
    }
    this.restapiProvider.sendRestApiRequest(request, 'GetUserDetails').subscribe((response) => {
      this.pageLoader = false
      if (response.IsSuccess == true) {
        this.profileData = response.Data.Table[0];
      }
      else {
      }
    },
      (error) => {
        this.pageLoader = false
      });
  }
  errorPic() {
    if (this.restapiProvider.userData['gender'] == "Male" || this.restapiProvider.userData['gender'] == "") {
      this.profileData.ImagePath = this.utilitiesProvider.noProfileImg;
    }
    else {
      this.profileData.ImagePath = this.utilitiesProvider.noProfileImgFemale;
    }
  }
  goToPlan() {
    this.app.getRootNav().setRoot('UserDefaultPage')
  }
  toggleClass(id) {
    $('#' + id).toggleClass('active')
  }

}

