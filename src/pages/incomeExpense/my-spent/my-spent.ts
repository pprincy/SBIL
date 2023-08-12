import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyApp } from '../../../app/app.component';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { CalendarComponentOptions } from 'ion2-calendar';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { config } from '../../../shared/config';
@IonicPage()
@Component({
  selector: 'page-my-spent',
  templateUrl: 'my-spent.html',
})
export class MySpentPage {
  public pageLoader: boolean = true;
  public expensesDate: any = {
    from: '',
    to: ''
  };
  public spendsType: string = "allSpends";
  public getDate: Date = new Date();
  public expenseDetail: any = [];
  public discreaId;
  public sDiscreaId;
  public nDiscreaId;
  public taxId;
  public typeId;
  public mySpendsList;
  public imgURLNew;
  public recentSpends;
  public isCalendar: boolean = false;
  public categoryList;
  public selectCategory: boolean = false;
  public filterCategoryList: any = [];
  public noPageData: boolean = false;
  public RecentSpendDate = { SMSMonth: (new Date().getMonth()) + 1, SMSYear: new Date().getFullYear() };
  public isShowReset: boolean = false;
  dateRange: { from: string; to: string; };
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range',
    showToggleButtons: true,
    showMonthPicker: false,
    from: new Date('0'),
    to: new Date()
  };
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public restapiProvider: RestapiProvider,
    public myApp: MyApp,
    public utilitiesProvider: UtilitiesProvider) {
    this.imgURLNew = config.imgURLNew;
    this.pageLoader = true;
  }
  ionViewDidEnter() {
    this.myApp.updatePageUseCount("64");
    this.utilitiesProvider.googleAnalyticsTrackView('My Spends');
    var day = new Date();
    var day1 = new Date();
    day1.setDate(day.getDate() - 364);
    this.expensesDate.to = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
    this.expensesDate.from = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
    this.masterCall();
    
    this.utilitiesProvider.upshotScreenView('MySpendAll');
  }
  addExpense(categoryName, categoryDate, categoryValue, categoryId, subCategoryName, expenseId, isRepeat) {
    let categorylist = { cn: categoryName == "" ? 'Uncategorized' : categoryName, cd: categoryDate, cv: categoryValue, ci: categoryId, cs: subCategoryName, ei: expenseId, ir: isRepeat }
    this.navCtrl.push('AddexpensesPage', { data: categorylist });
  }
  onChangeRange(res) {
    this.expensesDate.from = res.from._d.getFullYear() + "-" + (res.from._d.getMonth() + 1) + "-" + res.from._d.getDate();
    this.expensesDate.to = res.to._d.getFullYear() + "-" + (res.to._d.getMonth() + 1) + "-" + res.to._d.getDate();
  }
  masterCall() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'LangId': localStorage.getItem('langId')
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetIncomeExpenses')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          if (response.Data.Table1.length)
            this.categoryList = response.Data.Table1;
          if (response.Data.Table4.length) {
            this.expenseDetail = response.Data.Table4;
            // Extracting Id for Expenses
            for (var i = 0; i < this.expenseDetail.length; i++) {
              if (this.expenseDetail[i].ExpenseType == "Discretionary")
                this.discreaId = this.expenseDetail[i].ExpenseTypeId;
              if (this.expenseDetail[i].ExpenseType == "Semi discretionary")
                this.sDiscreaId = this.expenseDetail[i].ExpenseTypeId;
              if (this.expenseDetail[i].ExpenseType == "Non discretionary")
                this.nDiscreaId = this.expenseDetail[i].ExpenseTypeId;
              if (this.expenseDetail[i].ExpenseType == "emi")
                this.taxId = this.expenseDetail[i].ExpenseTypeId;
            }
            this.getExpenseTypeWiseReport(this.spendsType, '');
          }
          else {
            this.noPageData = false;
            this.isCalendar = false;
            this.pageLoader = false;
          }
        }
        else {
          this.noPageData = false;
          this.isCalendar = false;
          this.pageLoader = false;
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  getExpenseTypeWiseReport(Type, isReset) {
    this.pageLoader = true;
    this.mySpendsList = [];
    if (Type == "allSpends") {
      this.getRecentSpends();
      if (isReset) {
        this.pageLoader = true;
        setTimeout(() => {
          this.showPopupCategory();
          this.pageLoader = false;
        }, 2000);
      }
      return;
    }
    if (Type == "discrea") {
      this.typeId = 1;
    }
    if (Type == "nonDiscrea") {
      this.typeId = 3
    }
    if (Type == "semiDiscrea") {
      this.typeId = 2
    }
    if (Type == "emi") {
      this.typeId = 4
    }
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'ExpenseId': this.typeId,
      'FromDate': this.expensesDate.from,
      'ToDate': this.expensesDate.to,
      'LangId': localStorage.getItem('langId')
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetExpenseTypeWiseReport')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          if (response.Data.Table.length != 0) {
            this.mySpendsList = response.Data.Table;
            setTimeout(() => {
              this.pageLoader = false;
            }, 1000)
            this.isCalendar = false;
            this.noPageData = true;
            if (isReset) {
              this.showPopupCategory();
            }
          }
          else {
            this.noPageData = false;
            this.isCalendar = false;
            this.pageLoader = false;
          }
        }
        else {
          this.noPageData = false;
          this.isCalendar = false;
          this.pageLoader = false;
        }

      },
        (error) => {
          this.pageLoader = false;
        })
  }
  showCalendar() {
    this.isCalendar = !this.isCalendar;
  }
  showPopupCategory() {
    this.filterCategoryList = [];
    for (var i = 0; i < this.mySpendsList.length; i++) {
      for (var j = 0; j < this.categoryList.length; j++) {
        if (this.categoryList[j].CategoryId == this.mySpendsList[i].CategoryId) {
          this.filterCategoryList.push(this.categoryList[j])
        }
      }
    }
    this.filterCategoryList = new Set(this.filterCategoryList);
    if (this.filterCategoryList.size == 1) {
      this.isShowReset = true;
    }
    else {
      this.isShowReset = false;
    }
    this.selectCategory = true;
  }
  hidePopupSelectCategory() {
    this.selectCategory = false;
  }
  filterSpendsList(id) {
    var filterList = [];
    for (var i = 0; i < this.mySpendsList.length; i++) {
      if (this.mySpendsList[i].CategoryId == id) {
        filterList.push(this.mySpendsList[i]);
      }
    }
    this.mySpendsList = filterList;
    this.selectCategory = false;
  }
  getRecentSpends() {
    this.pageLoader = true;
    this.mySpendsList = [];
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'Month': this.RecentSpendDate.SMSMonth,
      'Year': this.RecentSpendDate.SMSYear,
      'TopCount': 0,
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetRecentSpends')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          if (response.Data.Table.length) {
            this.mySpendsList = response["Data"]["Table"]
            this.isCalendar = false;
            this.noPageData = true;
            this.pageLoader = false;
          }
          else {
            this.noPageData = false;
            this.isCalendar = false;
            this.pageLoader = false;
          }
        }
        else {
          this.noPageData = false;
          this.isCalendar = false;
          this.pageLoader = false;
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }

  myspentSegChange() {
    switch (this.spendsType) {
      case 'allSpends':
        this.utilitiesProvider.upshotScreenView('MySpendAll');
        break;

      case 'discrea':
        this.utilitiesProvider.upshotScreenView('MySpendOptionalSpend');
        break;

      case 'nonDiscrea':
        this.utilitiesProvider.upshotScreenView('MySpendRequirdSpends');
        break;

      case 'semiDiscrea':
        this.utilitiesProvider.upshotScreenView('MySpendSemiOptionallSpends');
        break;

      case 'emi':
        this.utilitiesProvider.upshotScreenView('MySpendEMI');
        break;

    }
  }

}
