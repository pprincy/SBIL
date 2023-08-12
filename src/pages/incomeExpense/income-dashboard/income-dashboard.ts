import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, App, ModalController } from 'ionic-angular';
import * as HighCharts from 'highcharts';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { Network } from '@ionic-native/network';
import 'rxjs/add/observable/forkJoin';
import { TranslateService } from '@ngx-translate/core';
import { MyApp } from '../../../app/app.component';
import { DecimalPipe } from '@angular/common';
import { DropDowmSelctionPage } from '../../../components/modals/drop-dowm-selction/drop-dowm-selction';
import { AmountFormatPipe } from '../../../pipes/amount-format/amount-format';
import { config } from '../../../shared/config';
declare var SMS: any;
declare var require: any
@IonicPage()
@Component({
  selector: 'page-income-dashboard',
  templateUrl: 'income-dashboard.html',
  providers: [AmountFormatPipe]
})
export class IncomeDashboardPage {
  @Input() rangeData
  public steps: any;
  public pageLoader: boolean = true;
  public expenditure: string = 'spendometer';
  public monthIncome;
  public totalSpends;
  public savings;
  public totalSpendsPrecentage;
  public totalsavingsPrecentage;
  public requiredSaving;
  public dumpDate;
  public moreSpends: boolean = false;
  public weekNum;
  public weekExpense;
  public isGoals: boolean = false;
  public haveGoals: boolean = true;
  public displayDate;
  public expReviewDate: any;
  public expensesDate: any;
  public expensesTrendDate: any;
  public recentSpendsDate = { SMSMonth: (new Date().getMonth()) + 1, SMSYear: new Date().getFullYear() };
  public userGoals;
  public needToSaveMore;
  public recentSpends: any = [];
  public imgURLNew;
  public expenseCategory: any = [];
  public isSpendViewMore: boolean = false;
  public expenseCat: any = [];
  public expenseCatVal: any = [];
  public expenseChartData: any = [];
  public dateList: any;
  public placeDate;
  public getDate: Date = new Date();
  public isSet: boolean = true;
  public totalExpense;
  public isExpensesData: boolean = false;
  public isTrendData: boolean = false;
  public isRecentData: boolean = true;
  public noSpendsData: boolean = true;
  public isWeekExpense: boolean = false;
  public isWeekExpenseBefore: boolean = true;
  public ListSms: any = [];
  public SMSId: any;
  public SMSTitle: any;
  public SMSBody: any;
  public SMSDate: any;
  public SMSTime: any;
  public date: any;
  public smsData: any;
  public chartInput: any = [];
  public xAxisData: any = [];
  public yAxisData: any = [];
  public chartColor: any = [];
  public selectedDate: any;
  private SMSDetails: any = [];
  public isPageDataLoad: boolean = false;
  public exisitingSaving;
  public totalSpendsForWeeks;
  public dateParam: any;
  public expPlaceDate;
  public trendDate: any = [];
  public reviewDate: any = [];
  public unCategoriesExpenseCount;
  public unCategorised: boolean = false;
  public lastSMSId;
  public totalSpendsText;
  public currentSavings;
  public needToSave;
  public totalCurrentSavingsPrecentage;
  public totalNeedToSavePrecentage;
  public goalsList: any = [];
  public categoryId;
  public assignValue = 100;
  public allCategories;
  public isSetCategory: boolean = false;
  public budgetName = "";
  public budgetId;
  public setBudget;
  public setBudgetComma;
  public customerBudgetList: any = [];
  public isScrapped: boolean = false;
  public expensepop: boolean = false;
  public showCategoryName;
  public minAmount = 0;
  public maxAmount = 100000;
  public delGoalId;
  public deleteStatus: boolean = false;
  public isCustomerBudget: boolean = false;
  public isArtificalIntelligence: boolean = false;
  public artificalIntelligence: any = [];
  public resetStatus: boolean = false;
  public budgetCategory;
  public allBudgetCat: any = [];
  public budget;
  public totalBudget;
  public isIncomeExpencePage;
  public modal;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public utilitiesProvider: UtilitiesProvider,
    private numberPipe: DecimalPipe,
    public restapiProvider: RestapiProvider,
    public network: Network,
    public platform: Platform,
    public translateService: TranslateService,
    public app: App,
    public myApp: MyApp,
    public amountFormatter: AmountFormatPipe,
    public modalCtrl: ModalController) {
    const borderRadius = require("highcharts-border-radius");
    borderRadius(HighCharts);

    this.imgURLNew = config.imgURLNew;
    this.dateParam = this.navParams.get('data');
  }
  ionViewWillEnter() {
    if (this.network.type === 'none') {
      this.restapiProvider.noInternetPromt();
    }
    else {
      if (localStorage.getItem("dateStateObj")) {
        var catDate = JSON.parse(localStorage.getItem("dateStateObj")).categoryReport
        var weekDate = JSON.parse(localStorage.getItem("dateStateObj")).weekReport
        var reviewDate = JSON.parse(localStorage.getItem("dateStateObj")).spendReview
        if(catDate && weekDate && reviewDate) {
          this.getRecentSpends();
          this.updateAllData();
          this.getMonthYearDropDown('Update');
        }
        else {
          this.getMonthYearDropDown('Enter');
          this.getRecentSpends();
          this.getIncomeExpenses();
          this.popularGoals();
          this.getCustomerBudgetExpense();
          // this.getSMSDumpDate();
        }
      }
      else {
        this.getMonthYearDropDown('Enter');
        this.getRecentSpends();
        this.getIncomeExpenses();
        this.popularGoals();
        this.getCustomerBudgetExpense();
        // this.getSMSDumpDate();
      }
    }
    this.translateService.get('incomeDashboard.totalSpends').subscribe(
      value => {
        this.totalSpendsText = value;
      }
    )

    if(this.expenditure == 'spendometer') {
      this.utilitiesProvider.upshotScreenView('SpendManagerSpendoMeter');
      this.utilitiesProvider.upshotTagEvent('SpendManagerSpendoMeter');
    }
    else if(this.expenditure == 'savings') {
      this.utilitiesProvider.upshotScreenView('SpendManagerSavings');
      this.utilitiesProvider.upshotTagEvent('SpendManagerSavings');
    }
  }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("58");
    if (this.network.type === 'none') {
      this.restapiProvider.noInternetPromt();
    }
    else {
      this.utilitiesProvider.googleAnalyticsTrackView('Income Dashboard');
      this.getMonthYearDropDown('Load');
      this.getRecentSpends();
      this.getIncomeExpenses();
      this.getCustomerBudgetExpense();
    }
  }
  incomeapproximation() {
    this.setDates();
    this.navCtrl.push('IncomeapproximationPage', { data: this.selectedDate });
  }
  expenses() {
    this.setDates();
    this.navCtrl.push('ExpensesPage', { data: this.expensesDate });
  }
  viewAll() {
    this.setDates();
    this.navCtrl.push('SavingPage');
  }
  editincome() {
    this.setDates();
    this.navCtrl.push('EditincomePage', { data: this.monthIncome });
  }
  addGoals() {
    this.setDates();
    this.navCtrl.push('ListingScreenGoalPage', { pageFrom: 'SpendManager' });
  }
  addExpense(categoryName, categoryDate, categoryValue, categoryId, subCategoryName, expenseId, isRepeat) {
    let categorylist = { cn: categoryName, cd: categoryDate, cv: categoryValue, ci: categoryId, cs: subCategoryName, ei: expenseId, ir: isRepeat }
    this.setDates();

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup
    }
    this.utilitiesProvider.upshotCustomEvent('AddSpendsClick', payload, false);

    this.navCtrl.push('AddexpensesPage', { data: categorylist });
  }
  report() {
    this.setDates();

    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup
    }
    this.utilitiesProvider.upshotCustomEvent('ViewReport', payload, false);

    this.navCtrl.push('ReportPage')
  }
  expenseTrends() {
    this.setDates();
    this.navCtrl.push('ExpensestrendPage', { data: this.trendDate });
  }
  recentSpendsPage() {
    this.setDates();
    this.navCtrl.push('RecentSpendsPage');
  }
  mySpendsPage() {
    this.setDates();
    this.navCtrl.push('MySpentPage');
  }
  uncategorisedExpense() {
    this.unCategorised = false;
    this.setDates();
    this.navCtrl.push('UncategorisedexpensesPage');
  }
  expenseListing(categoryName, categoryId) {
    let categorylist = { cn: categoryName, ci: categoryId, cd: this.selectedDate }
    this.setDates();
    if (categoryId !== null) {
      this.navCtrl.push('ExpenseListingPage', { data: categorylist });
    }
    else {
      this.navCtrl.push('UncategorisedexpensesPage', { data: categorylist });
    }
  }
  expenditureReview(date) {
    this.pageLoader = true;
    this.reviewDate = date;
    let request = {
      'LangId': localStorage.getItem('langId'),
      'Month': date.SMSMonth,
      'Year': date.SMSYear,
      'CustId': this.restapiProvider.userData['CustomerID'],
    }
    this.requiredSaving = "";
    this.needToSave = "";
    return this.restapiProvider.sendRestApiRequest(request, 'ExpenditureReview')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          if (response.Data.Table.length != 0 || response.Data.Table1.length != 0 || response.Data.Table2.length != 0) {
            if (response.Data.Table.length) {
              this.currentSavings = response["Data"]["Table1"][0]["CurrentSavings"] < 0 ? 0 : response["Data"]["Table1"][0]["CurrentSavings"];
              this.requiredSaving = response["Data"]["Table1"][0]["RequiredSavings"] == null ? 0 : response["Data"]["Table1"][0]["RequiredSavings"];
              this.needToSave = response["Data"]["Table1"][0]["Need_ToSaveMore"] == null || response["Data"]["Table1"][0]["Need_ToSaveMore"] < 0 ? ((this.requiredSaving - this.savings) < 0 ? 0 : (this.requiredSaving - this.savings)) : response["Data"]["Table1"][0]["Need_ToSaveMore"];
              this.monthIncome = response["Data"]["Table"][0]["TotalMonthIncome"]
              this.savings = response["Data"]["Table"][0]["Savings"] == null ? (this.monthIncome) : response["Data"]["Table"][0]["Savings"];
              this.totalCurrentSavingsPrecentage = this.savings / this.requiredSaving;
              this.totalNeedToSavePrecentage = ((this.requiredSaving - this.savings) / this.requiredSaving);
              this.userGoals = response["Data"]["Table2"];
              this.totalSpends = response["Data"]["Table"][0]["Total_Spends"]
              this.totalSpendsPrecentage = this.totalSpends / this.monthIncome;
              this.totalsavingsPrecentage = this.savings / this.monthIncome;
              this.moreSpends = response["Data"]["Table"][0]["Savings"] < 0 ? true : false;
              this.exisitingSaving = response["Data"]["Table"][0]["Savings"] >= 0 ? response["Data"]["Table"][0]["Savings"] : 0;
              if (this.totalSpendsPrecentage >= 1) {
                this.totalSpendsPrecentage = 0.99;
              }
              else if (this.totalSpendsPrecentage == 0) {
                this.totalSpendsPrecentage = 0.01
              }
              if (this.totalsavingsPrecentage >= 1) {
                this.totalsavingsPrecentage = 0.99;
              }
              else if (this.totalsavingsPrecentage == 0) {
                this.totalsavingsPrecentage = 0.01
              }
              if (this.totalCurrentSavingsPrecentage >= 1 || this.totalCurrentSavingsPrecentage == Infinity) {
                this.totalCurrentSavingsPrecentage = 0.99;
              }
              else if (this.totalCurrentSavingsPrecentage == 0) {
                this.totalCurrentSavingsPrecentage = 0.01
              }
              if (this.totalNeedToSavePrecentage >= 1 || this.totalNeedToSavePrecentage == Infinity) {
                this.totalNeedToSavePrecentage = 0.99;
              }
              else if (this.totalNeedToSavePrecentage <= 0) {
                this.totalNeedToSavePrecentage = 0.01
              }

              this.loadSpendReviewChart();
              this.setUpshotSpendoMeterEvent();
            }
            if (response.Data.Table1.length) {
              this.requiredSaving = response["Data"]["Table1"][0]["RequiredSavings"] == null ? 0 : response["Data"]["Table1"][0]["RequiredSavings"];
              this.needToSaveMore = response["Data"]["Table1"][0]["Need_ToSaveMore"] == null ? 0 : response["Data"]["Table1"][0]["Need_ToSaveMore"];
            }
            if (response.Data.Table2.length) { this.userGoals = response["Data"]["Table2"] }
            if (this.userGoals == "" || this.userGoals == undefined) {
              this.isGoals = false;
              this.haveGoals = true;
            }
            else {
              this.haveGoals = false;
              this.isGoals = true;
            }
            if (this.totalSpends == null || this.totalSpends == 0) {
              this.totalSpends = 0;
            }
            if (this.savings == null && this.exisitingSaving == null && this.needToSaveMore == null) {
              this.savings = this.exisitingSaving = this.monthIncome;
              this.needToSaveMore = (this.requiredSaving - this.exisitingSaving) < 0 ? 0 : (this.requiredSaving - this.exisitingSaving);
              this.totalsavingsPrecentage = 99;
              this.noSpendsData = false;
            }
            else {
              this.noSpendsData = true;
            }
            setTimeout(() => {
              this.pageLoader = false;
            }, 1000)
          }
          else {
            this.pageLoader = false;
          }
        }
        else {
          this.pageLoader = false;
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  expenceWeekReport(date) {
    this.pageLoader = true;
    this.trendDate = date;
    this.isWeekExpense = false;
    this.isWeekExpenseBefore = true;
    this.xAxisData = [];
    this.yAxisData = [];
    let request = {
      'LangId': localStorage.getItem('langId'),
      'Month': date.SMSMonth,
      'Year': date.SMSYear,
      'CustId': this.restapiProvider.userData['CustomerID'],
    }
    return this.restapiProvider.sendRestApiRequest(request, 'ExpenceReport')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          this.allBudgetCat = response.Data.Table;
          if (response.Data.Table1.length != 0 && response.Data.Table2.length != 0) {
            if (response.Data.Table2.length)
              this.totalSpendsForWeeks = response["Data"]["Table2"][0]["TotalExpense"]
            if (response.Data.Table1.length)
              this.chartInput = response["Data"]["Table1"];
            for (var i = 0; i < this.chartInput.length; i++) {
              this.xAxisData.push(this.chartInput[i]["Weeks"]);
              this.yAxisData.push(this.chartInput[i]["Expense"]);
            }
            if (this.yAxisData.length == 4) {
              if (this.yAxisData[0] != 0 || this.yAxisData[1] != 0 || this.yAxisData[2] != 0 || this.yAxisData[3] != 0) {
                this.isTrendData = true;
              }
              else {
                this.isTrendData = false;
              }
            }
            if (this.yAxisData.length == 5) {
              if (this.yAxisData[0] != 0 || this.yAxisData[1] != 0 || this.yAxisData[2] != 0 || this.yAxisData[3] != 0 || this.yAxisData[4] != 0) {
                this.isTrendData = true;
              }
              else {
                this.isTrendData = false;
              }
            }
            setTimeout(() => {
              this.chartLoad();
              this.pageLoader = false;
            }, 500)
          }
          else {
            this.pageLoader = false;
          }
        }
        else {
          this.pageLoader = false;
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  expenceCategoryReport(date) {
    console.log("date expenses", date);
    this.selectedDate = date;
    this.pageLoader = true;
    let request = {
      'LangId': localStorage.getItem('langId'),
      'Month': date.SMSMonth,
      'Year': date.SMSYear,
      'CustId': this.restapiProvider.userData['CustomerID'],
    }
    return this.restapiProvider.sendRestApiRequest(request, 'ExpenceReport')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          if (response.Data.Table.length != 0 && response.Data.Table2.length != 0) {
            var allCategoriesList = response.Data.Table;

            this.expenseChartData = [];
            this.expenseCategory = [];
            this.chartColor = [];
            if (response.Data.Table2.length) {
              this.totalBudget = response.Data.Table2[0].TotalBudget;
              if (((response.Data.Table2[0].TotalExpense)) == null) {
                this.isExpensesData = false;
              }
              else {
                this.totalExpense = ((response.Data.Table2[0].TotalExpense).toLocaleString(('en-IN')));
                this.isExpensesData = true;
              }
            }
            if (response.Data.Table.length) {
              for (var i = 0; i < response["Data"]["Table"].length; i++) {
                this.expenseCat[i] = response.Data.Table[i]["CategoryName"];
                this.expenseCatVal[i] = response.Data.Table[i]["Expense"];
                this.chartColor[i] = response.Data.Table[i]["CategoryColorCode"];
                this.expenseChartData.push([this.expenseCat[i], this.expenseCatVal[i]]);
              }
              if (response["Data"]["Table"].length > 3) {
                for (var i = 0; i < 3; i++) {
                  this.expenseCategory[i] = allCategoriesList.shift();
                }
              }
              else {
                this.expenseCategory = response["Data"]["Table"];
              }
            }
            var a = 0;
            for (var i = 0; i < this.expenseCategory.length; i++) {
              if (this.expenseCategory[i]["IncomeApproxBudgetStatus"] == "" || this.expenseCategory[i]["IncomeApproxBudgetStatus"] == undefined) {
                a++;
              }
            }
            if (a != 0)
              this.isSet = false;
            else
              this.isSet = true;
            this.totalExpenses();
            setTimeout(() => {
              this.pageLoader = false;
            }, 3000)
          }
          else {
            this.isExpensesData = false;
            this.isSet = true;
            this.pageLoader = false;
          }
        }
        else {
          this.isExpensesData = false;
          this.isSet = true;
          this.pageLoader = false;
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  getRecentSpends() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'Month': this.recentSpendsDate.SMSMonth,
      'Year': this.recentSpendsDate.SMSYear,
      'TopCount': 0,
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetRecentSpends')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.isRecentData = true;
          if (response.Data.Table.length != 0) {
            if (response["Data"]["Table"].length > 5) {
              for (var i = 0; i < 5; i++) {
                this.recentSpends[i] = response["Data"]["Table"].shift();
              }
              this.isSpendViewMore = true;
            }
            else {
              this.recentSpends = response["Data"]["Table"];
              this.isSpendViewMore = false;
            }
            if (response.Data.Table.length != 0) {
              this.isRecentData = true;
            }
            else {
              this.isRecentData = false;
            }
          }
          else {
            this.pageLoader = false;
            this.isRecentData = false;
          }
        }
        else {
          this.isRecentData = false;
          this.pageLoader = false;
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }

  totalExpenses() {
    HighCharts.chart('total_expenses', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        margin: [0, 0, 0, 0],
        spacingTop: 0,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0,

      },
      credits: {
        enabled: false
      },
      title: {
        text: '<div class="chart_center_text"><div class="chart_center_title f14">' + this.totalSpendsText + '</div><div class="chart_center_rs">₹' + this.totalExpense + '</div></div>',        useHTML: true,
        align: 'center',
        verticalAlign: 'middle',
        y: -18,
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>',
      },
      plotOptions: {
        pie: {
          size: '100%',
          shadow: false,
          dataLabels: {
            enabled: false
          },
          states: {
            hover: {
              halo: {
                size: 0,
              }
            }
          },
        }
      },
      colors: this.chartColor,
      series: [{
        type: 'pie',
        name: '',
        size: '96%',
        innerSize: '80%',
        borderColor: '#fff',
        borderWidth: 3,
        data: this.expenseChartData
      },
      {
        type: 'pie',
        name: 'OuterBorder',
        size: '100%',
        innerSize: '98%',
        animation: false,
        showInLegend: false,
        data: [{
          name: "",
          y: 1,
          color: '#5C2483',
        }]
      },
      {
        type: 'pie',
        name: 'InnerBorder',
        size: '72%',
        innerSize: '97.5%',
        animation: false,
        showInLegend: false,
        data: [{
          name: "",
          y: 1,
          color: '#5C2483',
        }]
      }
    ]
    });
  }
  
  chartLoad() {
    let _that = this;
    HighCharts.chart('expense_trend_dash', {
      chart: {
        type: 'column',
        events: {
          load: function () {
            var xAxis = this.xAxis[0],
            key, tick;
            for (key in xAxis.ticks) {
              tick = xAxis.ticks[key];

              if(!(tick.pos==3 || tick.pos==-1))
              tick.mark.attr({ stroke: 'transparent' });
            }
          }
        }
      },
      title: {
        text: '',
        floating: true
      },
      xAxis: {
        categories: this.xAxisData,
        startOnTick: true,
        endOnTick: true,
        tickPosition: 'inside',
        labels: {
          useHTML: true,
          formatter: function() {
            return "<span class='x_lable'>"+this.value+"</span>"
          }
        }
      },
      yAxis: {
        visible: false
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          borderRadiusTopLeft: 5,
          borderRadiusTopRight: 5,
          // minPointLength: 2,
        },
        series: {
          cursor: 'pointer',
          events: {
          },
          pointWidth: 45,
          point: {
            events: {
              unselect: this.hideWeekExpense()
            }
          },
          dataLabels: {
            enabled: true,
            useHTML: true,
            formatter: function() {
              return `<div class="data_lable_rs">₹`+_that.amountFormatter.transform(this.y, 'S')+`</div>`;
            }
          }
        }
      },
      tooltip: { enabled: false },
      series: [{
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
              [0, '#301F6C'],
              [1, '#D60D47']
          ]
        },
        data: this.yAxisData
      }]
    });
  }
  hideWeekExpense() {
    this.isWeekExpense = false;
    this.isWeekExpenseBefore = true;
  }
  getMonthYearDropDown(type) {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID']
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetMonthYearList')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          if (response.Data.Table.length != 0) {
            if (type == 'Enter') {
              this.pageLoader = true;
              this.dateList = response["Data"]["Table"];
              this.placeDate = response.Data.Table[0]["MonthYearDropDown"];
              this.expenceCategoryReport(this.dateList[0]);
              this.expenceWeekReport(this.dateList[0]);
              this.isPageDataLoad = true;
              this.pageLoader = false;
              if (this.dateParam) {
                this.expenditureReview(this.dateParam);
                this.expReviewDate = this.dateParam.MonthYearDropDown;
                this.expPlaceDate = this.dateParam.MonthYearDropDown;
              }
              else {
                this.expenditureReview(this.dateList[0]);
                this.expReviewDate = this.expensesDate = this.expensesTrendDate = this.dateList[0].MonthYearDropDown;
              }
              this.expensesDate = this.expensesTrendDate = this.dateList[0].MonthYearDropDown;
            }
            if (type == 'Load') {
              this.dateList = response["Data"]["Table"];
              this.getUnCategoriesExpense(this.dateList[0]);
            }
            if (type == 'Update') {
              this.dateList = response["Data"]["Table"];
            }
            else {
              this.pageLoader = false;
            }
          }
          else {
            this.pageLoader = false;
          }
        }
        else {
          this.pageLoader = false;
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  getIncomeExpenses() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'LangId': localStorage.getItem('langId'),
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetIncomeExpenses')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.allCategories = response["Data"]["Table1"];
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  getUnCategoriesExpense(date) {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'Month': date.SMSMonth,
      'Year': date.SMSYear,
      'LangId': localStorage.getItem('langId'),
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetUnCategoriesExpense')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          if (response["Data"]["Table"].length) {
            if (response["Data"]["Table"].length == 0) {
              this.unCategoriesExpenseCount = 0;
            }
            else {
              this.unCategoriesExpenseCount = response["Data"]["Table"][0]["UncategoriesExpenseCount"];
              if (this.unCategoriesExpenseCount >= 10) {
                this.unCategorised = true;
              }
              else {
                this.unCategorised = false;
              }
            }
          }
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  showPopupunCategorised() {
    this.unCategorised = false;
  }
  readListSMS() {
    this.SMSDetails = [];
    this.pageLoader = true;
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      this.pageLoader = false;
    }
    else {
      this.pageLoader = false;
      if (this.restapiProvider.userData['SMSFlag']) {
        this.platform.ready().then((readySource) => {
          let filter = {
            box: 'inbox', // 'inbox' (default), 'sent', 'draft'
            indexFrom: 0, // start from index 0
            maxCount: 500, // count of SMS to return each time
          };
          if (SMS) SMS.listSMS(filter, (ListSms) => {
            var newListSms = ListSms
            if (this.lastSMSId != 0) {
              for (var i = 0; i < ListSms.length; i++) {
                if (ListSms[i]._id == this.lastSMSId) {
                  newListSms = []
                  for (var j = 0; j < i; j++) {
                    newListSms.push(ListSms[j])
                  }
                }
              }
            }
            if (newListSms.length > 100) {
              var a = 0;
              var b = 100;
              for (var j = 0; j < Math.floor(newListSms.length / 100); j++) {
                this.SMSDetails = [];
                for (var i = a; i < b; i++) {
                  this.SMSId = newListSms[i]._id;
                  this.SMSTitle = newListSms[i].address;
                  this.SMSBody = newListSms[i].body.replace("’", "").replace("'", "").replace(":", "").replace("/", "").replace(">", "").replace("<", "").replace(/[^\x00-\x7F]/g, "");
                  this.date = new Date(newListSms[i].date);
                  var dd = this.date.getDate();
                  var mm = this.date.getMonth() + 1;
                  var yyyy = this.date.getFullYear();
                  var HH = this.date.getHours();
                  var MM = this.date.getMinutes();
                  this.SMSDate = yyyy + "-" + mm + "-" + dd;
                  this.SMSTime = HH + ":" + MM;
                  this.smsData = {
                    "SMSId": this.SMSId,
                    "SMSTitle": this.SMSTitle,
                    "SMSBody": this.SMSBody,
                    "SMSDate": this.SMSDate,
                    "SMSTime": this.SMSTime
                  }
                  this.SMSDetails.push(this.smsData);
                }
                var SMSDetailsArray = { "SMSDetails": this.SMSDetails, "CustId": this.restapiProvider.userData['CustomerID'] };
                this.restapiProvider.sendRestApiRequest(SMSDetailsArray, 'ImportUserSMS').subscribe((response) => {
                  if (response.IsSuccess == true) {
                  }
                })
                a = a + 100;
                b = b + 100;
              }
            }
            else {
              for (var i = 0; i < newListSms.length; i++) {
                this.SMSId = newListSms[i]._id;
                this.SMSTitle = newListSms[i].address;
                this.SMSBody = newListSms[i].body.replace("’", "").replace("'", "").replace(":", "").replace("/", "").replace(/[^\x00-\x7F]/g, "");
                this.date = new Date(newListSms[i].date);
                var dd = this.date.getDate();
                var mm = this.date.getMonth() + 1;
                var yyyy = this.date.getFullYear();
                var HH = this.date.getHours();
                var MM = this.date.getMinutes();
                this.SMSDate = yyyy + "-" + mm + "-" + dd;
                this.SMSTime = HH + ":" + MM;
                this.smsData = {
                  "SMSId": this.SMSId,
                  "SMSTitle": this.SMSTitle,
                  "SMSBody": this.SMSBody,
                  "SMSDate": this.SMSDate,
                  "SMSTime": this.SMSTime
                }
                this.SMSDetails.push(this.smsData);
              }
              var SMSDetailsArray = { "SMSDetails": this.SMSDetails, "CustId": this.restapiProvider.userData['CustomerID'] };
              this.restapiProvider.sendRestApiRequest(SMSDetailsArray, 'ImportUserSMS').subscribe((response) => {
                if (response.IsSuccess == true) {
                }
              })
            }
          },
            Error => {
              this.pageLoader = false;
            });
        });
      }

    }
    setTimeout(() => {
    this.pageLoader = false;
  }, 3000)
  }
  getSMSDumpDate() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetSMSDumpDate')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          if (response.Data.Table.length) {
            this.lastSMSId = response.Data.Table[0].MaxSMSID
            // this.readListSMS();
          }
        }
      },
        (error) => {
        })
  }
  setDates() {
    var dateObj = { spendReview: this.reviewDate, categoryReport: this.selectedDate, weekReport: this.trendDate };
    localStorage.setItem("dateStateObj", JSON.stringify(dateObj));
  }
  updateAllData() {
    var catDate = JSON.parse(localStorage.getItem("dateStateObj")).categoryReport
    var weekDate = JSON.parse(localStorage.getItem("dateStateObj")).weekReport
    var reviewDate = JSON.parse(localStorage.getItem("dateStateObj")).spendReview
    this.expenceCategoryReport(catDate);
    this.expenceWeekReport(weekDate);
    this.expenditureReview(reviewDate);
    this.isPageDataLoad = true;
    this.pageLoader = false;
    this.expensesDate = catDate.MonthYearDropDown
    this.expensesTrendDate = weekDate.MonthYearDropDown
    this.expReviewDate = reviewDate.MonthYearDropDown
    localStorage.removeItem("dateStateObj")
  }
  popularGoalClick(p) {
    localStorage.setItem("isExpensePage", "1");
    // if (p.GoalTypeID == 8) { this.app.getRootNav().push('HealthInsurancePage'); }
    // if (p.GoalTypeID == 7) { this.app.getRootNav().push('FamilyProtectionPage'); }
    if (p.GoalTypeID == 6) { this.app.getRootNav().push('CargoalPage', { pageFrom: 'Savings' }); }
    if (p.GoalTypeID == 3) { this.app.getRootNav().push('HomeGoalPage', { pageFrom: 'Savings' }); }
    if (p.GoalTypeID == 2) { this.app.getRootNav().push('ChildEducationPage', { pageFrom: 'Savings' }); }
    if (p.GoalTypeID == 4) { this.app.getRootNav().push('MarriagePage', { pageFrom: 'Savings' }); }
    if (p.GoalTypeID == 5) { this.app.getRootNav().push('RetirementGoalPage', { pageFrom: 'Savings' }); }
    if (p.GoalTypeID == 1) { this.app.getRootNav().push('CustomGoalPage', { pageFrom: 'Savings' }); }
  }
  popularGoals() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId']
    }
    return this.restapiProvider.sendRestApiRequest(request, 'PopularGoals')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.goalsList = response.Data.Table;
        }
        else {
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  addCategoryBudget() {
    if(this.budgetName && this.setBudget) {
      this.setUpshotBudgetEvent();
    }
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'CategoryId': this.budgetId,
      'BudgetValue': this.setBudget,
    }
    return this.restapiProvider.sendRestApiRequest(request, 'AddCategoryBudget')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.newValue();
          this.budgetId = "";
          this.setBudget = "";
          this.setBudgetComma = "";
          this.budgetName = "";
          this.expenceCategoryReport(this.selectedDate);
          this.expenditureReview(this.reviewDate);
          if (response.Data.Table[0].Status == 'Success') {

          }
        }
      },
        (error) => {
          this.pageLoader = false;
        })

  }
  selectCategoryPopUp() {
    this.isSetCategory = true;
  }
  hidePopupSelectCategory() {
    this.isSetCategory = false;
  }
  selectBudget(CategoryId, CategoryName, CategoryBudget) {
    this.budgetName = CategoryName;
    this.budgetId = CategoryId;
    this.setBudget = CategoryBudget;
    this.setBudgetComma = this.setBudget ? this.numberPipe.transform(this.setBudget.toString().replaceAll(",","")) : "";
    this.isSetCategory = false;
  }
  getCustomerBudgetExpense() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'LangId': localStorage.getItem('langId'),
      'TopCount': 2,
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetCustomerBudgetExpense')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          if (response.Data.Table.length > 0) {
            this.customerBudgetList = response.Data.Table;
            this.isCustomerBudget = true;
          }
          else {
            this.isCustomerBudget = false;
          }
          if (response.Data.Table1.length > 0) {
            // var id = response.Data.Table1[0].CategoryId
            // localStorage.setItem("id", id);
            if (localStorage.getItem("isArtificalIntelligence")) {
              this.artificalIntelligence = [];
              var value = localStorage.getItem("isArtificalIntelligence").split(";");
              if (new Date(value[1]) < new Date()) {
                localStorage.removeItem("isArtificalIntelligence");
              }
            }
            else {
              this.artificalIntelligence = response.Data.Table1;
              this.isArtificalIntelligence = true;
            }
          }
          else {
            this.isArtificalIntelligence = false;
          }
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  hideArtificalIntelligence(type) {
    if (type == 1) {
      var values = new Array();
      var oneday = new Date();
      oneday.setHours(oneday.getHours() + (24 * 30));
      values.push("hello world");
      values.push(oneday);
      try {
        localStorage.setItem("isArtificalIntelligence", values.join(";"));
        this.isArtificalIntelligence = false;
      }
      catch (e) { }
    }
    else {
      this.isArtificalIntelligence = false;
    }
  }
  showPopupExpenses(CategoryName, CategoryId, CategoryBudget) {
    this.expensepop = !this.expensepop;
    this.showCategoryName = CategoryName;
    this.budgetId = CategoryId;
    this.setBudget = CategoryBudget;
    this.setBudgetComma = this.setBudget ? this.numberPipe.transform(this.setBudget.toString().replaceAll(",","")) : "";
  }
  newValue() {
    this.addCategoryBudget();
    this.getCustomerBudgetExpense();
    this.expensepop = false;
  }
  resetBudget(CategoryId, CategoryName) {
    this.setBudget = ""
    this.budgetId = ""
    this.setBudget = 0;
    this.setBudgetComma = "0";
    this.budgetId = CategoryId;
    this.budgetCategory = CategoryName;
    this.resetStatus = true;
  }
  resetCatBudget(type) {
    if (type == 'yes') {
      this.addCategoryBudget();
      this.getCustomerBudgetExpense();
    }
    else {
      this.resetStatus = false;
    }
    this.resetStatus = false;
  }
  deleteGoals(UserSaveGoalID) {
    this.delGoalId = UserSaveGoalID;
    this.deleteStatus = true;
  }
  deleteUserGoal() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "GoalSaveID": this.delGoalId
    }
    this.restapiProvider.sendRestApiRequest(request, 'DeleteUserGoal').subscribe((response) => {
      if (this.dateParam) {
      }
      this.pageLoader = false;
    },
      (error) => {
        this.pageLoader = false;
      });
  }
  deleteGoal(type) {
    if (type == 'yes') {
      this.deleteUserGoal();
      this.expenditureReview(this.reviewDate);

      this.setUpshotGoalDeleteEvent();
    }
    else {
      this.deleteStatus = false;
    }
    this.deleteStatus = false;
  }

  spendManagerSegChange() {
    if(this.expenditure == 'spendometer') {
      this.utilitiesProvider.upshotScreenView('SpendManagerSpendoMeter');
      this.utilitiesProvider.upshotTagEvent('SpendManagerSpendoMeter');
    }
    else if(this.expenditure == 'savings') {
      this.utilitiesProvider.upshotScreenView('SpendManagerSavings');
      this.utilitiesProvider.upshotTagEvent('SpendManagerSavings');
    }
  }

  setUpshotGoalDeleteEvent() {
    let goalName = "";
    this.userGoals.forEach(el => {
      if (el.UserSaveGoalID == this.delGoalId) {
        goalName = el.UserGoalName;
      }
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

  setUpshotSpendoMeterEvent() {
    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "MonthlyIncome": this.monthIncome,
      "MonthlySpends": this.totalSpends || 0,
      "MonthlySavings": this.savings || 0
    }
    console.log(payload)
    this.utilitiesProvider.upshotCustomEvent('SpendoMeter', payload, false);
  }

  setUpshotBudgetEvent() {
    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "Category": this.budgetName,
      "Budget": this.setBudget
    }
    // console.log(payload)
    this.utilitiesProvider.upshotCustomEvent('SetBudget', payload, false);
  }

  formatAmount(val) {
    this.setBudgetComma = val ? this.numberPipe.transform(val.toString().replaceAll(",","")) : "";
    this.setBudget = val ? val.toString().replaceAll(",","") : "";
  }

  loadSpendReviewChart() {
    let _that = this;
    HighCharts.chart('spend_dashboard_chart', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        type: 'pie',
        margin: [0, 0, 0, 0],
        spacing: [0, 0, 0, 0],
        events: {
          load: function () {
            const edit = document.querySelector('#edit_income');
            edit.addEventListener('click', function() {
              _that.editincome();
            });
          }
        }
      },
      title: {
        useHTML: true,
        text: `<div class="chart_center_text">
          <div class="chart_center_title">Monthly Income</div>
          <div id="edit_income" class="chart_center_rs">₹`+this.amountFormatter.transform(this.monthIncome, 'S')+`<div style="width:10px"></div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_205_1610" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <rect width="24" height="24" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_205_1610)">
            <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3043 2.75 17.863 2.75C18.421 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.571 21.275 6.113C21.2917 6.65433 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#5C2483"/>
            </g>
            </svg>
          </div>
        </div>`,
        align: 'center',
        verticalAlign: 'middle',
        y: -40,
        color: '#5C2483',
        style: {
          color: '#5C2483',
          font: 'bold 20px Lato 700',
       }
      },
      credits: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
              enabled: false,
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '50%'],
        }
    },
      series: [{
        size: '70%',
        type: 'pie',
        innerSize: '80%',
        data: [
          {
            name: 'Total Monthly Spend',
            color: {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                  [0, '#301F6C'],
                  [1, '#D60D47']
              ]
            },
            y: this.totalSpends,
            z: 235.6
          }, {
            name: 'Monthly Savings',
            y: this.savings,
            z: 214.5,
            color: '#5C2483',
          }],
      }]
    });
  }

  async MonthListFunc(){
    let commonList = this.dateList.map(el => {
      const obj = {
        name: el.MonthYearDropDown,
        value: el.MonthYearDropDown,
      };
      return obj;
    }
      
    );
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { commonList: commonList,
        selectOption: this.expReviewDate },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
      this.expReviewDate = data;
      this.dateList.forEach(element => {
        if(element.MonthYearDropDown == data){
          this.expenditureReview(element);
        }
        
      }); 
    })

  }

  async MonthListExpense(){
    let commonList = this.dateList.map(el => {
      const obj = {
        name: el.MonthYearDropDown,
        value: el.MonthYearDropDown,
      };
      return obj;
    }
      
    );
    console.log("pass data", commonList);
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { commonList: commonList,
        selectOption: this.expensesDate },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
      this.expensesDate = data;
      this.dateList.forEach(element => {
        if(element.MonthYearDropDown == data){
          this.expenceCategoryReport(element);
        }
        
      }); 
        
    })

  }


  async MonthListExpenseTrend(){
    let commonList = this.dateList.map(el => {
      const obj = {
        name: el.MonthYearDropDown,
        value: el.MonthYearDropDown,
      };
      return obj;
    }
      
    );
    // console.log("pass data", commonList);
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { commonList: commonList,
        selectOption: this.expensesTrendDate },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
      this.expensesTrendDate = data;
      this.dateList.forEach(element => {
        if(element.MonthYearDropDown == data){
          this.expenceWeekReport(element);
        }
        
      }); 
        
    })

  }

  async MonthListExpenseReview(){
    let commonList = this.dateList.map(el => {
      const obj = {
        name: el.MonthYearDropDown,
        value: el.MonthYearDropDown,
      };
      return obj;
    }
      
    );
    // console.log("pass data", commonList);
    this.modal = await this.modalCtrl.create(
      DropDowmSelctionPage,
      { commonList: commonList,
        selectOption: this.expReviewDate },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss(data => {
      this.expReviewDate = data;
      this.dateList.forEach(element => {
        if(element.MonthYearDropDown == data){
          this.expenditureReview(element);
        }
        
      }); 
        
    })

  }

}