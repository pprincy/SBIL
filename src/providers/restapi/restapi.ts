import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LoadingController, ToastController, AlertController, Platform } from 'ionic-angular';
import { ProcessHttpmsgProvider } from '../process-httpmsg/process-httpmsg';
import { config } from '../../shared/config';
import { Observable } from 'rxjs/Observable';
import { IntelSecurity } from '@ionic-native/intel-security';
import { Network } from '@ionic-native/network';
import * as $ from 'jquery';
import 'rxjs/add/observable/fromPromise';
import { UtilitiesProvider } from '../../providers/utilities/utilities';

declare var cordova;

@Injectable()
export class RestapiProvider {
  options: any;
  data: any;
  private headers: any;
  public userData: JSON;
  private noConnectionMsg: any = {};
  public loader;
  public notificationList: any = [];
  public notificationCount;
  constructor(public http: Http,
    public httpIonic: HTTP,
    public platform: Platform,
    private processHttpmsgService: ProcessHttpmsgProvider,
    private network: Network,
    private intelSecurity: IntelSecurity,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public utilitiesProvider: UtilitiesProvider,
  ) {
    this.intelSecurity = new IntelSecurity();
    this.noConnectionMsg = {
      "Type": "ERROR",
      "IsSuccess": false,
      "Message": this.utilitiesProvider.jsErrorMsg['noInternetConnection']
    }
    this.userData = JSON.parse('{}');
    this.initilizeToken();
  }
  initilizeToken() {
    if (this.platform.is('core') || this.platform.is('mobileweb') || config['isHttpNative'] == "No") {
      this.headers = new Headers();
      this.headers.append('Content-Type', 'application/json');
      this.headers.append('Authorization', 'Basic U0JJTDpTQklMQDEyMw==');
      if (this.userData['AntiForgeryToken']) {
        this.headers.append('XSRF-TOKEN', this.userData['AntiForgeryToken']);
      }
    }
    else {
      this.httpIonic.setHeader(config['domain'], 'Content-Type', 'application/json');
      this.httpIonic.setHeader(config['domain'], 'Authorization', 'Basic U0JJTDpTQklMQDEyMw==');
      if (this.userData['AntiForgeryToken']) {
        this.httpIonic.setHeader(config['domain'], 'XSRF-TOKEN', this.userData['AntiForgeryToken']);
      }
      this.headers = this.httpIonic.getHeaders(config['domain']);
      // this.httpIonic.enableSSLPinning(true);
      // this.httpIonic.setSSLCertMode('pinned');
      // cordova.plugin.http.enableSSLPinning(true, function(ress) {
      //   // console.log('pinning success!', ress);
      // }, function(err) {
      //   // console.log('pinning error');
      //   // console.log(err);
      // });
    }
  }
  sendRestApiRequest(request: any, apiName: string): Observable<any> {
    let enc_request;
    let postObj

    if (this.network.type === 'none') {
      this.presentToastBottom(this.utilitiesProvider.jsErrorMsg['noInternetConnection'])
      return this.noConnectionMsg;
    }
    else {
      this.initilizeToken();
      if (apiName != 'captureDeviceDetails' && apiName != 'SaveUserComment') {
        if (apiName == 'GetMasters' || apiName == 'GetUserProfileMaster' || apiName == 'DefaultData' || apiName == 'ImportUserSMS') { // || apiName == 'PopularGoals'
        }
        else {
          if (request) {
            request['LangId'] = localStorage.getItem('langId');
          }
        }
        enc_request = this.encryptData(JSON.parse(JSON.stringify(request)));
        postObj = {
          "data": enc_request,
          "CustId": this.userData['CustomerID'] ? this.userData['CustomerID'] : this.userData['TempCustomerID']
        }
      }
      else {
        postObj = request;
      }
      /******************** */

    // console.log(JSON.stringify(apiName))
    // console.log(JSON.stringify(request))

      /******************** */

      if (this.platform.is('core') || this.platform.is('mobileweb') || config['isHttpNative'] == "No") {

        return this.http.post(config.baseURL + config[apiName], postObj, { headers: this.headers })
          .map(res => {
            return this.processHttpmsgService.extractData(res)
          })
          .catch(error => { return this.processHttpmsgService.handleError(error) });
      }
      else {
        return Observable.fromPromise(this.httpIonic.post(config.baseURL + config[apiName], postObj, this.headers).then(data => {
          return this.processHttpmsgService.extractData(data.data)
        }).catch(error => {
          return this.processHttpmsgService.handleError(error.error)
        }))
      }
    }
  }
  getRestApiRequest(apiName: string, concate: string): Observable<any> {
    if (this.network.type === 'none') {
      this.presentToastBottom(this.utilitiesProvider.jsErrorMsg['noInternetConnection']);
      return this.noConnectionMsg;
    }
    else {
      this.initilizeToken();
      if (this.platform.is('core') || this.platform.is('mobileweb') || config['isHttpNative'] == "No") {
        return this.http.get(config.baseURL + config[apiName] + concate, { headers: this.headers })
          .map(res => { return this.processHttpmsgService.extractData(res) })
          .catch(error => { return this.processHttpmsgService.handleError(error) });
      }
      else {
        return Observable.fromPromise(this.httpIonic.get(config.baseURL + config[apiName] + concate, {}, this.headers).then(data => {
          return this.processHttpmsgService.extractData(data.data)
        }).catch(error => {
          return this.processHttpmsgService.handleError(error.error)
        }));
      }
    }
  }
  getImageURL() {
    return config.imgURL;
  }
  storeData(data: any, storageID: string) {
    this.intelSecurity.data.createFromData({ data: JSON.stringify(data) })
      .then((instanceID: Number) => {
        this.intelSecurity.storage.write({ id: storageID, instanceID: instanceID })
        return true;
      })
      .catch((error: any) => {
        return false;
      })
  }
  getIntelData(storageID: string): Promise<any> {
    return this.intelSecurity.storage.read({ id: storageID })
      .then((instanceID: number) => {
        return instanceID
      })
      .catch((error: any) => {
        this.intelSecurity = new IntelSecurity();
        return undefined;
      })
  }
  dataFromIntelInstaceID(instanceID): Promise<any> {
    return this.intelSecurity.data.getData(instanceID)
      .then((data: string) => {
        return JSON.parse(data);
      })
      .catch((error: any) => {
        return '';
      })
  }
  removeIntelData(storageID: string) {
    return this.intelSecurity.storage.delete({ id: storageID })
      .then(() => { return true; })
      .catch((error: any) => { return false; })
  }
  public showLoader() {
    this.loader = this.loadingCtrl.create({
      content: "Loading..."
    });
    this.loader.present();
    return this.loader;
  }
  public hideLoader(loaderHideObj) {
    loaderHideObj.dismiss();
    return this.loader;
  }
  public presentToastTop(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    })
    toast.present();
  }
  public presentToastBottom(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    })
    toast.present();
  }
  public alertPromt(title, subTitle, btnText) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [btnText]
    });
    alert.present();
  }
  public noInternetPromt() {
    this.presentToastBottom(this.utilitiesProvider.jsErrorMsg['noInternetConnection'])
    // let alert = this.alertCtrl.create({
    //   title: this.utilitiesProvider.jsErrorMsg['noInternetConnection'],
    //   subTitle:this.utilitiesProvider.jsErrorMsg['checkInternetConnection'],
    //   buttons: [this.utilitiesProvider.commonLangMsg['ok']]
    // });
    // alert.present();
  }
  //For Dummy Data
  getData(action: string, useToken: boolean = true) {
    let loader = this.showLoader();
    return new Promise(resolve => {
      this.http.get(action, this.options)
        .map(res => res.json()).subscribe(data => {
          this.data = data;
          loader.dismiss().then(() => resolve(this.data));
          return;
        }, err => {
          loader.dismiss();
          throw err;
        });
    });
  }
  encryptData(request) {
    let r = JSON.stringify(request);
    // console.log(r);
    let tempRequest = this.EncryptQS(r + "", this.userData['CustomerID'] ? this.userData['CustomerID'] : this.userData['TempCustomerID']);

    // for (var k in request) {
    //   if (typeof (request[k]) == "object") {
    //     for (var j in request[k]) {
    //       if (typeof (request[k][j]) == "object") {
    //         for (var l in request[k][j]) {
    //           if (request[k][j][l] + "") {
    //             request[k][j][l] = this.EncryptQS(request[k][j][l] + "", this.userData['CustomerID'] ? this.userData['CustomerID'] : this.userData['TempCustomerID']);
    //           }
    //         }
    //       }
    //       else {
    //         if (request[k][j] + "") {
    //           request[k][j] = this.EncryptQS(request[k][j] + "", this.userData['CustomerID'] ? this.userData['CustomerID'] : this.userData['TempCustomerID']);
    //         }
    //       }
    //     }
    //   }
    //   else if (k === "CustId" || k === "CustID") {
    //     continue;
    //   }
    //   else {
    //     if (request[k] + "") {
    //       request[k] = this.EncryptQS(request[k] + "", this.userData['CustomerID'] ? this.userData['CustomerID'] : this.userData['TempCustomerID']);
    //     }
    //   }
    // }
    return tempRequest
  }
  EncryptQS(str, key) {
    try {
      if (key == null || key.length <= 0) {
        return str
      }
      // if (key.toString().length > 8) key = key.substring(0, 8);
      var prand = "";
      for (var i = 0; i < key.length; i++) {
        prand += key.charCodeAt(i).toString()
      }
      var sPos = Math.floor(prand.length / 5),
        preMult = prand.charAt(sPos) == '0' ? '1' : prand.charAt(sPos);
      preMult = preMult + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5);
      var mult = parseInt(preMult),
        incr = Math.ceil(key.length / 2),
        modu = Math.pow(2, 31) - 1;
      if (mult < 2) {
        return null
      }
      var salt = Math.round(Math.random() * 1000000000) % 100000000;
      prand += salt;
      while (prand.length > 10) {
        prand = (parseInt(prand.substring(0, 10), 10)).toString()
      }
      var prand_new = (mult * parseInt(prand) + incr) % modu;
      var enc_chr,
        enc_str = "";
      for (var j = 0; j < str.length; j++) {
        enc_chr = parseInt((str.charCodeAt(j) ^ Math.floor((prand_new / modu) * 255)).toString());
        if (enc_chr < 16) {
          enc_str += "0" + enc_chr.toString(16)
        } else enc_str += enc_chr.toString(16);
        prand_new = (mult * prand_new + incr) % modu
      }
      // var salt_new = salt.toString(16);
      // while(salt_new.length < 8) {
      //   salt_new = "0" + salt;
      // }
      enc_str += salt;
      return enc_str
    } catch (error) {
      // console.log(error);
    }
  }
  sessionExpired() {
    if (localStorage.getItem('tokenExpired') == 'Yes') {
      this.userData['CustomerID'] = "";
      this.userData['isLogin'] = "";
      this.storeData(this.userData, 'userData');
      localStorage.removeItem("isLogin");
    }
  }
}
