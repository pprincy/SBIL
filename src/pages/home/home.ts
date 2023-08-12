import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestapiProvider } from '../../providers/restapi/restapi';
import {UtilitiesProvider} from '../../providers/utilities/utilities'

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider : UtilitiesProvider) {
  }

  ionViewWillEnter() {
    if(this.restapiProvider.userData['defaultData']){
      this.utilitiesProvider.defaultData =  JSON.parse(this.restapiProvider.userData['defaultData']);
    }
    // if(this.navParams.data == 'Login' ||
    // this.navParams.data == 'Skip'  ||
    // this.navParams.data == 'Home'){
    //   console.log("From login")
    // }
    // else{
    //   let pageToPush:any = this.checkQuizAnswers();
    //   this.navCtrl.push(pageToPush,'Home');
    //   // if(pageToPush == 'QuizAgePage'){
    //   //   this.navCtrl.push(pageToPush,'Home');
    //   // }
    // }
    // console.log('ionViewWillEnter HomePage');
  }

  // checkQuizAnswers(){
  //   let age             = this.restapiProvider.userData['age'];
  //   let incomeGroup     = this.restapiProvider.userData['incomeGroup'];
  //   let maritialStatus  = this.restapiProvider.userData['maritialStatus'];
  //   if (age == null || age == '' || age == undefined || isNaN(parseInt(age))) {
  //     return 'QuizAgePage';
  //   }
  //   if ((incomeGroup    == null || incomeGroup    == '' || incomeGroup    == undefined) ||
  //       (maritialStatus == null || maritialStatus == '' || maritialStatus == undefined)) {
  //     return 'QuizLifestylePage';
  //   }
  //   else{
  //     return 'FirstPage'
  //   }
  // }
  
}
