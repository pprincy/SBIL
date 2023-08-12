import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';
import { RestapiProvider } from '../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../providers/utilities/utilities'
import { MyApp } from '../../app/app.component';
import { config } from '../../shared/config';

@IonicPage()
@Component({
  selector: 'page-saved-article-goal',
  templateUrl: 'saved-article-goal.html',
})
export class SavedArticleGoalPage {
  public deleteStatus: boolean = false;
  public pageLoader: boolean = false;
  public allArticlesList: any = [];
  public savedGoal: any = [];
  public imgURL;
  public imgURLNew;
  public article = 'Yourarticles';
  public goalsSet: any;
  public goalResponseArr: any = [];
  public goalsArr: any = [];
  public delGoalId;
  public graphData: any = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    public myApp: MyApp) {
    this.goalsSet = new Set();
    this.imgURL = this.restapiProvider.getImageURL();
    this.imgURLNew = config.imgURLNew;
    // if (this.navCtrl.getActive().name == 'ListingScreenGoalPage') { //navCtrl.getActive().name not working in prod
    if (this.navCtrl.getActive().id == 'ListingScreenGoalPage') { //using navCtrl.getActive().id
      this.article = 'Mygoals'
    }
    this.savedGoalList();
  }
  ionViewDidEnter() {
    this.savedArticleList();

    if(this.article == 'Mygoals') {
      this.utilitiesProvider.upshotScreenView('SavedGoal');
      this.utilitiesProvider.upshotTagEvent('SavedGoal');
    }
    else if(this.article == 'Yourarticles') {
      this.utilitiesProvider.upshotScreenView('SavedArticle');
      this.utilitiesProvider.upshotTagEvent('SavedArticle');
    }
  }
  ionViewDidLeave() {
    this.allArticlesList = [];
  }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("42");
    this.utilitiesProvider.googleAnalyticsTrackView('Saved Article');
  }
  planSummary() {
    let planSummaryData = {
      "goalSavedData": this.goalsArr,
      "graphData": this.graphData
    }
    debugger
    this.navCtrl.push('PlanSummaryPage', { data: planSummaryData });
  }
  savedArticleList() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId']
    }
    this.restapiProvider.sendRestApiRequest(request, 'SavedArticleList').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        this.allArticlesList = response.Data.Table1;
      }
      else {
      }
    },
      (error) => {
        this.pageLoader = false;
      });
  }
  //Saved Goal List
  savedGoalList() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId']
    }
    this.restapiProvider.sendRestApiRequest(request, 'SavedGoalList').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        this.goalResponseArr = response.Data.Table;
        if (response.Data.Table1.length > 0) {
          this.graphData = response.Data.Table1[0];
        }
        else {
          this.graphData = {};
        }
        if (this.goalResponseArr.length > 0) {
          this.mappingGoalList();
        }
        else {
          this.goalsArr = [];
        }
      }
      else {
      }
    },
      (error) => {
        this.pageLoader = false;
      });
  }
  mappingGoalList() {
    for (let i = 0; i < this.goalResponseArr.length; i++) {
      if (!this.goalsSet.has(this.goalResponseArr[i].GoaltypeID)) {
        this.goalsArr.push({
          "GoalType": this.goalResponseArr[i].GoalType,
          "GoaltypeID": this.goalResponseArr[i].GoaltypeID,
          "ImagePath": this.goalResponseArr[i].ImagePath,
          "GoalArr": [{
            "PlannedDate": this.goalResponseArr[i].PlannedDate,
            "MonthlySavingRequied": this.goalResponseArr[i].MonthlySavingRequied,
            "ImagePath": this.goalResponseArr[i].ImagePath,
            "RequieredDownpayment": this.goalResponseArr[i].RequieredDownpayment,
            "TotalAmountRequiered": this.goalResponseArr[i].TotalAmountRequiered,
            "UserSaveGoalID": this.goalResponseArr[i].UserSaveGoalID,
            "tenure": this.goalResponseArr[i].tenure,
            "GoaltypeID": this.goalResponseArr[i].GoaltypeID
          }],
        })
        this.goalsSet.add(this.goalResponseArr[i].GoaltypeID);
      }
      else {
        for (let j = 0; j < this.goalsArr.length; j++) {
          if (this.goalResponseArr[i].GoaltypeID === this.goalsArr[j].GoaltypeID) {
            this.goalsArr[j]["GoalArr"].push({
              "PlannedDate": this.goalResponseArr[i].PlannedDate,
              "MonthlySavingRequied": this.goalResponseArr[i].MonthlySavingRequied,
              "ImagePath": this.goalResponseArr[i].ImagePath,
              "RequieredDownpayment": this.goalResponseArr[i].RequieredDownpayment,
              "TotalAmountRequiered": this.goalResponseArr[i].TotalAmountRequiered,
              "UserSaveGoalID": this.goalResponseArr[i].UserSaveGoalID,
              "tenure": this.goalResponseArr[i].tenure,
              "GoaltypeID": this.goalResponseArr[i].GoaltypeID
            })
            break;
          }
        }
      }
    }
    if (this.article == 'Mygoals') {
      this.segmentChange('Mygoals');
    }
  }
  viewHistory(index) {
    $('#' + index).toggleClass("goalClose");
    if ($('#' + index + '.card-content').hasClass('goalClose')) {
      $('#' + index + '.card-content > .row').hide();
      $('#' + index + '.card-content > .row').first().show();
    }
    else {
      $('#' + index + '.card-content > .row').show();
    }
    $('#arrow' + index).toggleClass("goalUp");
  }
  segmentChange(type) {
    if (type == "Mygoals") {
      this.myApp.updatePageUseCount("43");
      this.utilitiesProvider.googleAnalyticsTrackView('Saved Goal');
      setTimeout(() => {
        $('.mygoal > .item').each(function () {

          var rowlenght = $(this).find('.card-content .row').length;
          if (rowlenght > 1) {
            $(this).find('.card-content .row').hide();
            $(this).find('.card-content .row').first().show();
          }
        });
      }, 500);
    }
  }
  showConfirmPopup(g) {
    this.deleteStatus = !this.deleteStatus;
    this.delGoalId = g.UserSaveGoalID;
    if (this.deleteStatus == true) {
      $('.header').addClass('headerOverlay');
      $('.footer').addClass('footerOverlay');
    }
  }
  deleteGoal(type) {
    if (type == 'yes') {
      this.deleteUserGoal();

      this.setUpshotGoalDeleteEvent();
    }
    else {
      this.deleteStatus = !this.deleteStatus;
      if (this.deleteStatus == false) {
        $('.header').removeClass('headerOverlay');
        $('.footer').removeClass('footerOverlay');
      }
    }
  }
  deleteUserGoal() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "GoalSaveID": this.delGoalId
    }
    this.restapiProvider.sendRestApiRequest(request, 'DeleteUserGoal').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['goalDeletedSuccessfully'])
        this.goalsSet = new Set();
        this.goalsArr = [];
        this.savedGoalList();
        this.deleteStatus = !this.deleteStatus;
        if (this.deleteStatus == false) {
          $('.header').removeClass('headerOverlay');
          $('.footer').removeClass('footerOverlay');
        }
      }
      else {
      }
    },
      (error) => {
        this.pageLoader = false;
      });
  }
  yearCal(y) {
    let headYear = new Date().getFullYear();
    return headYear + y;
  }
  articleDetails(article) {
    this.navCtrl.push('ArticleDetailsPage', { data: article.ArticleID });
  }
  goNotificationList() {
    this.navCtrl.push('NotificationPage');
  }
  search() {
    this.navCtrl.push('SearchPage');
  }

  savedSegmentChange(){
    if(this.article == 'Mygoals') {
      this.utilitiesProvider.upshotScreenView('SavedGoal');
      this.utilitiesProvider.upshotTagEvent('SavedGoal');
    }
    else if(this.article == 'Yourarticles') {
      this.utilitiesProvider.upshotScreenView('SavedArticle');
      this.utilitiesProvider.upshotTagEvent('SavedArticle');
    }
  }

  setUpshotGoalDeleteEvent() {
    let goalName = "";
    this.goalsArr.forEach(el => {
      el.GoalArr.forEach(elem => {
        if (elem.UserSaveGoalID == this.delGoalId) {
          goalName = el.GoalType;
        }
      })
    })

    if(goalName) {
      let payload = {
        "Appuid": this.utilitiesProvider.upshotUserData.appUId,
        "Language": this.utilitiesProvider.upshotUserData.lang,
        "City": this.utilitiesProvider.upshotUserData.city,
        "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
        "Goal": goalName
      }
      console.log(payload)
      this.utilitiesProvider.upshotCustomEvent('DeleteGoal', payload, false);
    }
  }
}