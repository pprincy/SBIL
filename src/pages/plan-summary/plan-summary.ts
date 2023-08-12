import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import * as $ from 'jquery';
import { RestapiProvider } from '../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../providers/utilities/utilities'
import { config } from '../../shared/config';
@IonicPage()
@Component({
  selector: 'page-plan-summary',
  templateUrl: 'plan-summary.html',
})
export class PlanSummaryPage {
  public savedGoalList: any = [];
  public imgURL;
  public graphData: any = [];
  public titleText;
  public IncomePer;
  public MonthlyExpensePer;
  public RequieredSavingPer;
  public Income;
  public MonthlyExpense;
  public RequieredSaving;
  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider) {
    this.savedGoalList = this.navParams.get('data').goalSavedData;
    this.graphData = this.navParams.get('data').graphData;
    this.Income = this.graphData.Income ? this.graphData.Income : 0;
    this.MonthlyExpense = this.graphData.MonthlyExpense ? this.graphData.MonthlyExpense : 0;
    this.RequieredSaving = this.graphData.RequieredSaving ? this.graphData.RequieredSaving : 0;
    if (this.Income <= (this.MonthlyExpense + this.RequieredSaving)) {
      this.titleText = this.utilitiesProvider.langJsonData['Saved']['canPlanBetter'];
      this.IncomePer = (this.Income / (this.MonthlyExpense + this.RequieredSaving)) * 100;
      this.MonthlyExpensePer = (this.MonthlyExpense / (this.MonthlyExpense + this.RequieredSaving)) * 100;
      this.RequieredSavingPer = (this.RequieredSaving / (this.MonthlyExpense + this.RequieredSaving)) * 100;
    }
    if (this.Income > (this.MonthlyExpense + this.RequieredSaving)) {
      this.titleText = this.utilitiesProvider.langJsonData['Saved']['wellPlanned'];
      this.IncomePer = 100;
      this.MonthlyExpensePer = (this.MonthlyExpense / this.Income) * 100;
      this.RequieredSavingPer = (this.RequieredSaving / this.Income) * 100;
    }
    this.imgURL = config.imgURLNew;
  }
  top = 0;
  scrollToTop() {
    setTimeout(() => {
      this.cssCahnge();
    }, 100);
  }
  cssCahnge() {
    if (this.top > $('.plan_sum_top_no_doc').offset().top) {
      $('.plan_sum_top_mobile').show(100);
      $('.plan_sum_top_mobile').addClass('shrink');
    }
    else {
      $('.plan_sum_top_mobile').hide(100);
      $('.plan_sum_top_mobile').removeClass('shrink');
    }
  }
  ionViewDidEnter() {
    this.utilitiesProvider.upshotScreenView('MyPlanSummary');
    this.utilitiesProvider.upshotTagEvent('MyPlanSummary');
  }
  ionViewDidLoad() {
    this.scrollToTop();
    this.content.ionScroll.subscribe((data) => {
      if (data) {
        this.top = data.scrollTop;
        this.cssCahnge();
      }
    });
    this.content.ionScrollStart.subscribe((data) => {
      if (data) {
        this.top = data.scrollTop;
        this.cssCahnge();
      }
    });
  }
  goNext(type) {
    if (type == 'newplan') {
      this.navCtrl.setRoot('ListingScreenGoalPage', { pageFrom: 'Plan Summary' });
    }
    else {
      this.navCtrl.setRoot('ArticlesPage', { source: 'Trends', header: this.utilitiesProvider.langJsonData['collections']['collections'], categoryID: '' });
    }
  }
  goNotificationList() {
    this.navCtrl.push('NotificationPage');
  }
  takeScreenshot() {
    this.utilitiesProvider.screenShotURI();
  }
  search() {
    this.navCtrl.push('SearchPage');
  }
}
