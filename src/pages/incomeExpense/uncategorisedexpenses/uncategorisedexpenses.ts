import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import * as HighCharts from 'highcharts';
import { MyApp } from '../../../app/app.component';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { DropDowmSelctionPage } from '../../../components/modals/drop-dowm-selction/drop-dowm-selction';
import { config } from '../../../shared/config';
@IonicPage()
@Component({
  selector: 'page-uncategorisedexpenses',
  templateUrl: 'uncategorisedexpenses.html',
})
export class UncategorisedexpensesPage {
  public pageLoader: boolean = true;
  public expensesDate: any;
  public unCategoriesExpenseCount;
  public unCategoriesExpenseList;
  public chartInput: any = [];
  public xAxisData: any = [];
  public yAxisData: any = [];
  public getDate;
  public dateList: any;
  public categoryList;
  public selectCategory: boolean = false;
  public expenseId;
  public categoryID;
  public imgURL;
  public isData: boolean = false;
  public selectedDate: any;
  public categoryName;
  public categoryDate;
  public categoryid;
  public indexValue;
  public placeDate;
  public modal;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public restapiProvider: RestapiProvider,
    public myApp: MyApp,
    public utilitiesProvider: UtilitiesProvider,
    public modalCtrl: ModalController) {
    this.imgURL = config.imgURLNew;
  }
  ionViewWillEnter() {
    this.myApp.updatePageUseCount("66");
    this.utilitiesProvider.googleAnalyticsTrackView('Uncategorised Expense');
    if (this.navParams.get('data').cn) {
      let data = this.navParams.get('data');
      this.categoryName = data["cn"];
      this.categoryDate = data["cd"];
      this.categoryid = data["ci"];
      this.getMonthYearDropDown(this.categoryDate.MonthYearDropDown);
    }
    setTimeout(() => {
      this.masterCall();
      this.pageLoader = false;
    }, 1000)
  }
  getUnCategoriesExpense(date) {
    this.selectedDate = date;
    this.pageLoader = true;
    this.xAxisData = [];
    this.yAxisData = [];
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'Month': date.SMSMonth,
      'Year': date.SMSYear,
      'LangId': localStorage.getItem('langId'),
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetUnCategoriesExpense')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          if ((response.Data.Table.length != [])) {
            this.unCategoriesExpenseCount = (response["Data"]["Table"][0]["UncategoriesExpenseCount"]);
          }
          this.unCategoriesExpenseList = response["Data"]["Table2"];
          this.chartInput = response["Data"]["Table1"];
          for (var i = 0; i < this.chartInput.length; i++) {
            this.xAxisData.push(this.chartInput[i]["Weeks"]);
            this.yAxisData.push(this.chartInput[i]["Expense"]);
          }
          if (response.Data.Table2.length != 0) {
            this.isData = true;
            this.chartLoad();
          }
          else {
            this.isData = false;
          }
        }
        setTimeout(() => {
          this.pageLoader = false;
        }, 1000)
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  chartLoad() {
    var myChart = HighCharts.chart('unCategoriesExpense_trend', {
      chart: {
        type: 'column'
      },
      title: {
        text: '',
        floating: true
      },
      xAxis: {
        categories: this.xAxisData
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
          borderRadiusTopLeft: 10,
          borderRadiusTopRight: 10,
          states: {
            hover: {
              color: '#259bff'
            }
          }
        },
        series: {
          cursor: 'pointer',
          events: {
          },
          pointWidth: 15,
          color: '#3a99f7',
          name: 'Expense'
        }
      },
      tooltip: { enabled: true },
      series: [{
        data: this.yAxisData
      }]
    });

  }
  getMonthYearDropDown(date) {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID']
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetMonthYearList')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.dateList = response["Data"]["Table"];
          for (var i = 0; i < response.Data.Table.length; i++) {
            if (response.Data.Table[i]["MonthYearDropDown"] == date) {
              this.indexValue = i;
            }
          }
        }
        this.getUnCategoriesExpense(this.dateList[this.indexValue]);
        this.expensesDate = date;
        this.placeDate = date;
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  masterCall() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'LangId': localStorage.getItem('langId')
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetIncomeExpenses')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.categoryList = response.Data.Table1;
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  addUnCategoriesTransaction(CategoryId) {
    this.categoryID = CategoryId;
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'ExpenseId': this.expenseId,
      'CategoryId': this.categoryID
    }
    return this.restapiProvider.sendRestApiRequest(request, 'AddUnCategoriesTransaction')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
        }
        this.getUnCategoriesExpense(this.selectedDate);
        this.hidePopupSelectCategory();
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  showPopupunCategorised(expensesId) {
    this.expenseId = expensesId;
    this.selectCategory = true;
  }
  hidePopupSelectCategory() {
    this.selectCategory = false;
  }
  addExpense(categoryName, categoryDate, categoryValue, categoryId, subCategoryName, expenseId) {
    let categorylist = { cn: categoryName, cd: categoryDate, cv: categoryValue, ci: categoryId, cs: subCategoryName, ei: expenseId }
    this.navCtrl.push('AddexpensesPage', { data: categorylist });
  }

  async MonthListExpense(){
    let commonList = this.dateList.map(el => {
      const obj = {
        name: el.MonthYearDropDown,
        value: el.MonthYearDropDown
      };
      return obj;
    }
      
    );
    // console.log("pass data", commonList);
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
          this.getUnCategoriesExpense(element);
        }
        
      }); 
        
    })

  }
}
