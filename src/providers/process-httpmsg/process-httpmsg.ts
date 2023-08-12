import { Injectable } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { App, Nav, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { config } from '../../shared/config';

@Injectable()
export class ProcessHttpmsgProvider {
  @ViewChild('content') nav: Nav;
  constructor(public http: Http,
    public utilitiesProvider: UtilitiesProvider,
    private app: App,
    public platform: Platform) {
  }
  public extractData(res: Response | any) {
    if (this.platform.is('core') || this.platform.is('mobileweb') || config['isHttpNative'] == "No") {
      let responseTemp = res;
      let responseData = JSON.parse(responseTemp['_body'])
      if (responseTemp['StatusCode'] == -1 && responseTemp['Message'] == "TOKEN EXPIRED") {
        //this.utilitiesProvider.presentToastTop("Session expired!!!");
        localStorage.setItem("tokenExpired", "Yes")
      }
      let body = res.json();
      return body || {};
    }
    else {
      let body = JSON.parse(res);
      if (body['StatusCode'] == -1 && body['Message'] == "TOKEN EXPIRED") {
        //this.utilitiesProvider.presentToastTop("Session expired!!!");
        localStorage.setItem("tokenExpired", "Yes")
      }
      return body || {};
    }
  }
  public handleError(error: Response | any) {
    if (this.platform.is('core') || this.platform.is('mobileweb') || config['isHttpNative'] == "No") {
      let errMsg: string;
      if (error instanceof Response) {
        // const body = error;
        if (error.status != 400) {
          const body = error.json();
          const err = body['error'] || JSON.stringify(body)
          errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        }
        else {
          errMsg = "Bad request"
        }
      }
      else {
        if (error.status != 400) {
          errMsg = error.message ? error.message : error.toString();
        }
        else {
          errMsg = error;
        }
      }
      console.log(errMsg)
      return Observable.throw(errMsg)
    }
    else {
      return JSON.parse(error);
    }
  }
}
