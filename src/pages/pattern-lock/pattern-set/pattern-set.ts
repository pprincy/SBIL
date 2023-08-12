import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import * as $ from 'jquery';
import * as patternLock from 'PatternLock';
import { TabsPage } from '../../dashboard/tabs/tabs';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { Network } from '@ionic-native/network';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { MyApp } from '../../../app/app.component';
@IonicPage()
@Component({
  selector: 'page-pattern-set',
  templateUrl: 'pattern-set.html',
})
export class PatternSetPage {
  public lock: any;
  public setPattern = '';
  public confirmPattern = '';
  public patternSteps = 1;
  public isProceedEnabled = false;
  public pageLoader: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    private network: Network,
    public utilitiesProvider: UtilitiesProvider,
    public platform: Platform,
    public myApp: MyApp) {
  }
  ionViewDidLeave() {
    $('.patternWrong').addClass('hide');
  }
  ionViewDidEnter() {
    console.log("@@@@@@@@@@@ pattern step #############", this.patternSteps);
    setTimeout(() => {
      var that = this;
      this.lock = new patternLock('#patternHolder1', {
        onDraw: function (pattern) {
          if (pattern.length < 4) {
            that.lock.error();
            $('.wrong_otp_msg').removeClass('hide');
          }
          else {
            if (that.patternSteps == 1) {
              that.setPattern = pattern;

            }
            if (that.patternSteps == 2) {
              that.confirmPattern = pattern;
              if (that.setPattern == that.confirmPattern) {
                that.isProceedEnabled = true;
                $('.patternWrong').addClass('hide');
              }
              else {
                $('.patternWrong').removeClass('hide');
                that.lock.error();
              }
            }
          }
        }
      });
    }, 1000);
  }
  removePatternWrong() {
    $('.patternWrong').addClass('hide');
  }
  next() {
    if (this.patternSteps == 1) {
      this.patternSteps++;
      this.lock.reset();
    }
    if (this.patternSteps == 2) {
      if (this.setPattern == this.confirmPattern && this.setPattern != '' && this.confirmPattern != '') {
        //this.patternSteps++;
        this.updateProfile();
      }
      else {
        if (this.confirmPattern != '') {
          $('.patternWrong').removeClass('hide');

          this.lock.error();
        }
      }
    }
  }
  back() {
    this.patternSteps--;
    this.confirmPattern = '';
    this.lock.reset();
    $('.patternWrong').addClass('hide');
  }
  goMpinLock() {
    this.navCtrl.push('MpinPage');
  }
  resetPattern() {
    this.lock.reset();
  }
  errorPattern() {
    this.lock.error();
  }
  gotIt() {
    this.navCtrl.setRoot(TabsPage);
  }
  updateProfile() {
    if (this.network.type === 'none') {
      this.restapiProvider.noInternetPromt();
    }
    else {
      this.pageLoader = true;
      let requestUpdateProfile = {
        "LoginSource": "APP",
        "CustId": this.restapiProvider.userData['CustomerID'],
        "Gender": this.restapiProvider.userData['gender'],
        "MPIN": this.confirmPattern,
        "MpinType": "pattern",
        "Age": this.restapiProvider.userData['age'],
        "MaritalStatus": this.restapiProvider.userData['maritialStatus'],
        "IncomeGroup": this.restapiProvider.userData['incomeGroup'],
        "SegmentId": null,
        "OccupationId": this.restapiProvider.userData['occupationID'],
        "PersonaId": null,
        "TokenId": this.restapiProvider.userData['tokenId'],
        "Image": this.restapiProvider.userData['profileImg']
      }
      this.restapiProvider.sendRestApiRequest(requestUpdateProfile, 'updateProfile')
        .subscribe((response) => {
          this.pageLoader = false;
          if (response.IsSuccess == true) {
            this.patternSteps++;
            this.myApp.updatePageUseCount("50");
            this.utilitiesProvider.googleAnalyticsTrackView('PatternSet');
            this.restapiProvider.userData['MPINFlag'] = true;
            this.restapiProvider.userData['MPINTYPE'] = 'pattern';
            this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
            if (this.platform.is('core') || this.platform.is('mobileweb')) {
              localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData))
            }
          }
        }, (error) => {
          this.pageLoader = false;
        })
    }
  }
}
