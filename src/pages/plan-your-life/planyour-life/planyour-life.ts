import { Component, Input } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import * as $ from 'jquery';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { MyApp } from '../../../app/app.component';
import { config } from '../../../shared/config';
@IonicPage()
@Component({
  selector: 'page-planyour-life',
  templateUrl: 'planyour-life.html',
})
export class PlanyourLifePage {
  public plan_goal_modal: boolean = false;
  public pageLoader: boolean = false;
  public goalTypesList: any = [];
  public savedGoalsList: any = [];
  public imgURL: any;
  public name: any;
  public stage: any = 1;
  public selectedGoal: any;
  public yearsToGoal: any = 1;
  public deleteStatus: boolean = false;
  public goalToDelete: any;
  public minSlider;
  public maxSlider;
  public drivenFrom;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    public restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    public myApp: MyApp) {
    this.imgURL = config.imgURLNew;
    this.name = this.restapiProvider.userData['customerName'].split(' ')[0];
    this.GetUserTempGoalListing();

    this.drivenFrom = this.navParams.get('pageFrom');
  }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("36");
    this.utilitiesProvider.googleAnalyticsTrackView('Plan your life journey');

    this.utilitiesProvider.upshotScreenView('PlanYourLife');
  }
  GetUserTempGoalListing() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
    }
    this.restapiProvider.sendRestApiRequest(request, 'GetUserTempGoalListing').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        this.goalTypesList = response.Data.Table;
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['couldNotLoadGoalTypes']);
      }
    },
      (error) => {
        this.pageLoader = false;
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['couldNotLoadGoalTypes']);
      });
  }
  GetUserSavedTempGoalListing() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
    }
    this.restapiProvider.sendRestApiRequest(request, 'GetUserSavedTempGoalListing').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        this.savedGoalsList = response.Data.Table;
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['couldNotLoadGoalTypes']);
      }
    },
      (error) => {
        this.pageLoader = false;
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['couldNotLoadGoalTypes']);
      });
  }
  InsertUserTempGoals(goal) {
    this.pageLoader = true;
    let currYear = new Date().getFullYear();
    let goalYr = currYear + parseInt(this.yearsToGoal)
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "GoalTypeID": goal.GoalTypeID,
      "GoalYear": goalYr
    }
    this.restapiProvider.sendRestApiRequest(request, 'InsertUserTempGoals').subscribe((response) => {
      this.pageLoader = false;
      this.plan_goal_modalClose();
      this.setUpshotPersonalGoalsEvent(goal.GoalType, this.yearsToGoal);
      if (response.IsSuccess == true) {
        if (response.Data.Table[0].MSG == "Success") {
          this.GetUserTempGoalListing();
          setTimeout(() => {
            this.nextStage();
          }, 1000);
        }
        else
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['couldNotLoadGoalTypes']);
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['couldNotLoadGoalTypes']);
      }
    },
      (error) => {
        this.pageLoader = false;
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['couldNotLoadGoalTypes']);
      });
  }
  DeleteUserTempGoals(goal) {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "GoalSaveID": goal.GoalSaveID
    }
    this.restapiProvider.sendRestApiRequest(request, 'DeleteUserTempGoals').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        if (response.Data.Table[0].MSG == "Success") {
          this.GetUserSavedTempGoalListing();
        }
        else
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['goalDeletedSuccessfully']);
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['goalDeletedSuccessfully']);
      }
    },
      (error) => {
        this.pageLoader = false;
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['couldNotLoadGoalTypes']);
      });
  }
  nextStage() {
    if (this.stage == 1) {
      this.stage = 2;
      this.GetUserSavedTempGoalListing();
      this.myApp.updatePageUseCount("36");
      this.utilitiesProvider.googleAnalyticsTrackView('Plan your life journey');
      this.setUpshotViewMyGoalsEvent();
    }
    else if (this.stage == 2) {
      this.myApp.updatePageUseCount("37");
      this.stage = 1;
      this.GetUserTempGoalListing();
      this.utilitiesProvider.googleAnalyticsTrackView('Plan your life List');

      this.utilitiesProvider.upshotScreenView('MyPlanLife');

      this.drivenFrom = "AddPlan"
    }
  }
  showConfirmPopup(goal) {
    this.deleteStatus = !this.deleteStatus;
    this.goalToDelete = goal;
    if (this.deleteStatus == true) {
      $('.header').addClass('headerOverlay');
      $('.footer').addClass('footerOverlay');
    }
  }
  deleteGoal(type) {
    if (type == 'yes') {
      this.DeleteUserTempGoals(this.goalToDelete);
    }
    else {
      this.goalToDelete = null;
    }
    this.deleteStatus = !this.deleteStatus;
    if (this.deleteStatus == false) {
      $('.header').removeClass('headerOverlay');
      $('.footer').removeClass('footerOverlay');
    }
  }
  plan_goal_modalInfo(event, goal) {
    if(event.target && event.target.classList && event.target.classList.value && event.target.classList.value.indexOf('remove') >= 0) {
      this.nextStage();
    }
    else {
      this.plan_goal_modal = !this.plan_goal_modal;
      this.selectedGoal = goal;
      if (goal.GoalTypeID == 7) { this.minSlider = 1; this.maxSlider = 52 }
      else if (goal.GoalTypeID == 6) { this.minSlider = 1; this.maxSlider = 10 }
      else if (goal.GoalTypeID == 3) { this.minSlider = 1; this.maxSlider = 30 }
      else if (goal.GoalTypeID == 2) { this.minSlider = 1; this.maxSlider = 29 }
      else if (goal.GoalTypeID == 4) { this.minSlider = 1; this.maxSlider = 30 }
      else if (goal.GoalTypeID == 5) { this.minSlider = 1; this.maxSlider = 52 }
      else if (goal.GoalTypeID == 1) { this.minSlider = 1; this.maxSlider = 30 }
      else { this.minSlider = 1; this.maxSlider = 30 }
      if (this.plan_goal_modal == true) {
        $('.header').addClass('headerOverlay');
        $('.scroll-content').addClass('scrollOverlay');
      }
    }
  }
  plan_goal_modalClose() {
    this.plan_goal_modal = !this.plan_goal_modal;
    if (this.plan_goal_modal == false) {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
    }
  }
  errorPic() {
    if (this.restapiProvider.userData['gender'] == "Male" || this.restapiProvider.userData['gender'] == "") {
      this.restapiProvider.userData['profileImg'] = this.utilitiesProvider.noProfileImg;
    }
    else {
      this.restapiProvider.userData['profileImg'] = this.utilitiesProvider.noProfileImgFemale;
    }
  }
  popularGoalClick(p) {
    var timeInYrs = p.GoalYear - new Date().getFullYear()
    if (p.GoalTypeID == 8) { this.app.getRootNav().push('HealthInsurancePage', { data: timeInYrs, pageFrom: 'Plan Your Life' }); }
    if (p.GoalTypeID == 7) { this.app.getRootNav().push('FamilyProtectionPage', { data: timeInYrs, pageFrom: 'Plan Your Life' }); }
    if (p.GoalTypeID == 6) { this.app.getRootNav().push('CargoalPage', { data: timeInYrs, pageFrom: 'Plan Your Life' }); }
    if (p.GoalTypeID == 3) { this.app.getRootNav().push('HomeGoalPage', { data: timeInYrs, pageFrom: 'Plan Your Life' }); }
    if (p.GoalTypeID == 2) { this.app.getRootNav().push('ChildEducationPage', { data: timeInYrs, pageFrom: 'Plan Your Life' }); }
    if (p.GoalTypeID == 4) { this.app.getRootNav().push('MarriagePage', { data: timeInYrs, pageFrom: 'Plan Your Life' }); }
    if (p.GoalTypeID == 5) { this.app.getRootNav().push('RetirementGoalPage', { data: timeInYrs, pageFrom: 'Plan Your Life' }); }
    if (p.GoalTypeID == 1) { this.app.getRootNav().push('CustomGoalPage', { data: timeInYrs, pageFrom: 'Plan Your Life' }); } 
  }
  changeYear(value) {
    this.yearsToGoal = parseInt(value);
  }
  goNotificationList() {
    this.navCtrl.push('NotificationPage');
  }
  search() {
    this.navCtrl.push('SearchPage');
  }

  setUpshotViewMyGoalsEvent() {
    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup
    }
    this.utilitiesProvider.upshotCustomEvent('ViewMyGoals', payload, false);
  }

  setUpshotPersonalGoalsEvent(goal, time) {
    try {
      let payload = {
        "Appuid": this.utilitiesProvider.upshotUserData.appUId,
        "Language": this.utilitiesProvider.upshotUserData.lang,
        "City": this.utilitiesProvider.upshotUserData.city,
        "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
        "DrivenFrom": this.drivenFrom == 'Discover' ? 'StartPlanning' : 'AddPlan',
        "GoalSelected": goal,
        "AchieveTime": time
      }
      this.utilitiesProvider.upshotCustomEvent('PersonalGoal', payload, false);
    }
    catch (e) { console.log(e) }
  }
}
