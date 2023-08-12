import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Config } from 'ionic-angular';
import { Http } from '@angular/http';
import * as $ from 'jquery';
import { RestapiProvider } from '../../providers/restapi/restapi';
import {UtilitiesProvider} from '../../providers/utilities/utilities';
import {MyApp} from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-faqs',
  templateUrl: 'faqs.html',
})
export class FaqsPage {
    public faqsList: any = [];
    public information: any = [];
    public faqsSet: any;
    public faqResponseArr : any = [];
    public faqsArr: any = [];
    public faqsReqObject: any = [];
    public pageLoader : boolean = false;
    public showHideIcon : boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private restapiProvider: RestapiProvider,
              public utilitiesProvider : UtilitiesProvider,
              private http: Http,
              public config: Config,
              public myApp : MyApp) {
                this.faqsSet = new Set();
      // let localdata = http.get('assets/data/planData/information.json').map(res => res.json().items);
      // localdata.subscribe(data =>{
      //     this.information = data;
      // });
  }

  ionViewDidLoad() {
    this.FAQsFunc();
    this.myApp.updatePageUseCount("44");
    this.utilitiesProvider.googleAnalyticsTrackView('FAQ');

    this.utilitiesProvider.upshotScreenView('FAQs');
  }


  toggleSection(i) {
    this.faqsArr[i].open = ! this.faqsArr[i].open;
    // alert( this.faqsArr[i].open)
  }
 
  toggleItem(i, j) {
    this.faqsArr[i].QuesArr[j].open = !this.faqsArr[i].QuesArr[j].open;
    // console.log(this.faqsArr[i].QuesArr[j])
    if(this.faqsArr[i].QuesArr[j].open){
      if(this.faqsArr[i].QuesArr[j].FAQID){
        this.updateFAQReadCount(this.faqsArr[i].QuesArr[j].FAQID);
      }
    }

    if(this.faqsArr[i].QuesArr[j].open){
      let payload = {
        "Appuid": this.utilitiesProvider.upshotUserData.appUId,
        "Language": this.utilitiesProvider.upshotUserData.lang,
        "City": this.utilitiesProvider.upshotUserData.city,
        "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
        "Query": this.faqsArr[i].QuesArr[j].QUESTION
      }
      this.utilitiesProvider.upshotCustomEvent('FAQs', payload, false);
    }
    
  }

   
  //FAQs
  FAQsFunc(){
    this.pageLoader = true
    let request = {
       'CustId' :this.restapiProvider.userData['CustomerID'],
       'TokenId' : this.restapiProvider.userData['tokenId']
    }
    // console.log("Request: " + JSON.stringify(request));
    return this.restapiProvider.sendRestApiRequest(request, 'FAQs')
      .subscribe((response) => {
        this.pageLoader = false;

        if (response.IsSuccess == true) {
          this.faqsList = response.Data.Table;
          this.faqResponseArr =  response.Data.Table;
          this.mappingFaqs();
            // console.log(response.Data)
        }
        else {
        }
      },
      (error) => {
        this.pageLoader = false;
      })
  }


  mappingFaqs() {
    for (let i = 0; i < this.faqResponseArr.length; i++) {
      if (!this.faqsSet.has(this.faqResponseArr[i].CATID)) {
        this.faqsArr.push({
          "CATNAME": this.faqResponseArr[i].CATNAME,
          "CATID": this.faqResponseArr[i].CATID,
          "QuesArr": [{
            "ANSWER": this.faqResponseArr[i].ANSWER,
            "QUESTION": this.faqResponseArr[i].QUESTION,
            "FAQID" : this.faqResponseArr[i].FAQID
          }],
        })
        this.faqsSet.add(this.faqResponseArr[i].CATID);
      }
      else {
        for (let j = 0; j < this.faqsArr.length; j++) {
          if (this.faqResponseArr[i].CATID === this.faqsArr[j].CATID) {
            this.faqsArr[j]["QuesArr"].push({
              "ANSWER": this.faqResponseArr[i].ANSWER,
              "QUESTION": this.faqResponseArr[i].QUESTION,
              "FAQID" : this.faqResponseArr[i].FAQID
            })
            break;
          }
        }
      }
    }
    // console.log("Request faqsReqObject", this.faqsArr);
  }

  goNotificationList(){
    this.navCtrl.push('NotificationPage');
  }
  search(){
    this.navCtrl.push('SearchPage');
  }



  //UpdateFAQReadCount
  updateFAQReadCount(id){
    let request = {
       'FAQId' : id,
       'CustId' :this.restapiProvider.userData['CustomerID'],
       'TokenId' : this.restapiProvider.userData['tokenId']
    }
    // console.log("Request: " + JSON.stringify(request));
    return this.restapiProvider.sendRestApiRequest(request, 'UpdateFAQReadCount')
      .subscribe((response) => {
      },
      (error) => {
      })
  }

  
}
