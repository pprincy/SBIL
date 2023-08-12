import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , MenuController} from 'ionic-angular';
import {UtilitiesProvider} from '../../../providers/utilities/utilities'
import { RestapiProvider } from '../../../providers/restapi/restapi';
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-calculatorlisting',
  templateUrl: 'calculatorlisting.html',
})
export class CalculatorlistingPage {
  public calList : any = [];
  public pageFrom;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public utilitiesProvider : UtilitiesProvider,
    private restapiProvider: RestapiProvider,
    public menuCtrl: MenuController) {
      this.pageFrom = this.navParams.get('pageFrom')
  }

  ionViewDidEnter() {
    this.utilitiesProvider.upshotScreenView('Tools');
    this.utilitiesProvider.upshotTagEvent('Tools');
  }

  ionViewDidLoad() {
    this.calList = this.utilitiesProvider.calculatorList;
    // console.log("Initial CalList:>>", this.calList)
    for (let i = 0; i < this.calList.length; i++) {
      if (this.calList[i].className == "EatingOutPage") {
        console.log("page name:>>", this.calList[i].className)
        this.calList.pop(this.calList[i])
        // console.log("CalList:>>", this.calList)
      }
    }
  }
  calClick(c){
    if(c.className == ""){
      this.restapiProvider.presentToastTop("Coming Soon...");
    }
    else{

      let payload = {
        "Appuid": this.utilitiesProvider.upshotUserData.appUId,
        "Language": this.utilitiesProvider.upshotUserData.lang,
        "City": this.utilitiesProvider.upshotUserData.city,
        "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
        "DrivenFrom": this.pageFrom || '',
        "ToolName": c.calName || ''
      }
      this.utilitiesProvider.upshotCustomEvent('SelectTools', payload, false);

      this.navCtrl.push(c.className, { pageFrom: 'Tools' });
    }
  }
  menuToggle(){
    this.menuCtrl.open();
  }
  toggleClass(id){
      $('#' + id).toggleClass('active')
  }

}
