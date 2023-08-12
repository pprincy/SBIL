import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , MenuController} from 'ionic-angular';
import {UtilitiesProvider} from '../../../providers/utilities/utilities'
import { RestapiProvider } from '../../../providers/restapi/restapi';
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-listing-screen-goal',
  templateUrl: 'listing-screen-goal.html',
})
export class ListingScreenGoalPage {
 public goalList;
 public pageFrom;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public utilitiesProvider : UtilitiesProvider,
              private restapiProvider: RestapiProvider,
              public menuCtrl: MenuController) {
                this.pageFrom = this.navParams.get('pageFrom')
                console.log(this.pageFrom)
  }

  ionViewDidEnter() {
    this.utilitiesProvider.upshotScreenView('MyGoals');
    this.utilitiesProvider.upshotTagEvent('MyGoals');
  }

  ionViewDidLoad() {
   this.goalList = this.utilitiesProvider.goalsList;
  }
  goalClick(p){
    if(p.className == ""){
      this.restapiProvider.presentToastTop("Coming Soon...");
    }
    else{

      let payload = {
        "Appuid": this.utilitiesProvider.upshotUserData.appUId,
        "Language": this.utilitiesProvider.upshotUserData.lang,
        "City": this.utilitiesProvider.upshotUserData.city,
        "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
        "DrivenFrom": this.pageFrom || '',
        "Goal": p.goalName || ''
      }
      this.utilitiesProvider.upshotCustomEvent('GoalSelected', payload, false);

      this.navCtrl.push(p.className, { pageFrom: 'Goal Plan Your Life' })
    }
  }
  menuToggle(){
    this.menuCtrl.open();
  }
  toggleClass(id){
      $('#' + id).toggleClass('active')
  }
  goSaved(){
    
    this.navCtrl.push("SavedArticleGoalPage");
  }
}
