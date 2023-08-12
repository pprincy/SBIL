import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import * as HighCharts from 'highcharts';
import { MyApp } from '../../../app/app.component';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { DropDowmSelctionPage } from '../../../components/modals/drop-dowm-selction/drop-dowm-selction';
import { config } from '../../../shared/config';
import { AmountFormatPipe } from '../../../pipes/amount-format/amount-format';
@IonicPage()
@Component({
  selector: 'page-expense-listing',
  templateUrl: 'expense-listing.html',
  providers: [AmountFormatPipe]
})
export class ExpenseListingPage {
  public pageLoader: boolean = true;
  public expensesDate = { SMSMonth: (new Date().getMonth()) + 1, SMSYear: new Date().getFullYear() };
  public chartInput: any = [];
  public xAxisData: any = [];
  public yAxisData: any = [];
  public getDate: Date = new Date();
  public dateList: any;
  public imgURLNew;
  public isData: boolean = false;
  public categoryList: any = [];
  public categoryName;
  public categoryDate;
  public categoryid;
  public placeDate;
  public indexValue;
  public selectedDate: any;
  public modal;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public restapiProvider: RestapiProvider,
    public myApp: MyApp,
    public utilitiesProvider: UtilitiesProvider,
    public modalCtrl: ModalController,
    public amountFormatter: AmountFormatPipe) {
    this.imgURLNew = config.imgURLNew;
  }
  ionViewWillEnter() {
    if (this.navParams.get('data').cn) {
      let data = this.navParams.get('data');
      this.categoryName = data["cn"];
      this.categoryDate = data["cd"];
      this.categoryid = data["ci"];
      this.getMonthYearDropDown(this.categoryDate.MonthYearDropDown);
    }
    setTimeout(() => {
      this.pageLoader = false;
    }, 1000)
  }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("62");
    this.utilitiesProvider.googleAnalyticsTrackView('Expense Listing');
  }
  addExpense(categoryName, categoryDate, categoryValue, categoryId, subCategoryName, expenseId, isRepeat) {
    let categorylist = { cn: categoryName, cd: categoryDate, cv: categoryValue, ci: categoryId, cs: subCategoryName, ei: expenseId, ir: isRepeat }
    this.navCtrl.push('AddexpensesPage', { data: categorylist });
  }
  getCategoriesExpense(date) {
    this.pageLoader = true;
    this.selectedDate = date;
    if (localStorage.getItem("dateStateObj")) {
      var dateObj = JSON.parse(localStorage.getItem("dateStateObj"))
      dateObj.categoryReport = this.selectedDate;
      localStorage.setItem("dateStateObj", JSON.stringify(dateObj));
    }
    this.xAxisData = [];
    this.yAxisData = [];
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'Month': date.SMSMonth,
      'Year': date.SMSYear,
      'CategoryId': this.categoryid,
      'LangId': localStorage.getItem('langId'),
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetCategoriesExpense')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.categoryList = response["Data"]["Table1"];
          this.chartInput = response["Data"]["Table"];
          for (var i = 0; i < this.chartInput.length; i++) {
            this.xAxisData.push(this.chartInput[i]["Weeks"]);
            this.yAxisData.push(this.chartInput[i]["Expense"]);
          }
          if (response.Data.Table1.length != 0) {
            this.isData = false;
            this.chartLoad();
          }
          // If No Data
          else {
            this.isData = true;
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
    let _that = this;
    HighCharts.chart('categoriesExpense_trend', {
      chart: {
        type: 'column'
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
        },
        series: {
          cursor: 'pointer',
          pointWidth: 45,
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
        this.getCategoriesExpense(this.dateList[this.indexValue]);
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
        }
      },
        (error) => {
          this.pageLoader = false;
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
          this.getCategoriesExpense(element);
        }
        
      }); 
        
    })

  }
}
