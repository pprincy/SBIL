import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import * as HighCharts from 'highcharts';
import { MyApp } from '../../../app/app.component';
import { AmountFormatPipe } from '../../../pipes/amount-format/amount-format';
declare var require: any
@IonicPage()
@Component({
  selector: 'page-expensestrend',
  templateUrl: 'expensestrend.html',
  providers: [AmountFormatPipe]
})
export class ExpensestrendPage {
  public pageLoader: boolean = true;
  public monthType: string = "month";
  public expenseTrends;
  public placeDate;
  public totalExpense = 0;
  public xAxisData: any = [];
  public yAxisData: any = [];
  public chartInput: any = [];
  public isTrendData: boolean = false;
  public seriesData: any = []
  public isWeek: boolean = true;
  public isMonth: boolean = false;
  public firstWeek: any = [];
  public secondWeek: any = [];
  public thirdWeek: any = [];
  public fourthWeek: any = [];
  public fifthWeek: any = [];
  public sixthWeek: any = [];
  public seventhWeek: any = [];
  public eighthWeek: any = [];
  public ninthWeek: any = [];
  public tenthWeek: any = [];
  public eleventhWeek: any = [];
  public twelvethWeek: any = [];
  public dateParam: any;
  public expensesDate;
  public slectedDate: any;
  public maxDate;
  public minDate;
  public dateList;
  public CategoryNames: any = [];
  public categories: any = [];
  public noPageData: boolean = false;
  public categoryList: any = [];
  public isClick: boolean = false;
  public totalMonthExpense;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public utilitiesProvider: UtilitiesProvider,
    public restapiProvider: RestapiProvider,
    public amountFormatter: AmountFormatPipe,
    public myApp: MyApp) {
      // const borderRadius = require("highcharts-border-radius");
      // borderRadius(HighCharts);
  }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("67");
    this.utilitiesProvider.googleAnalyticsTrackView('Expense Trends');
    this.getIncomeExpenses();
    this.getMonthYearDropDown();
    this.dateParam = this.navParams.get('data');
    this.placeDate = this.dateParam.SMSFullMonthName;
    this.chartLoad();
  }
  getExpenseTrade(Type) {
    this.pageLoader = true;
    this.slectedDate = this.dateParam;
    if (Type == "month") {
      Type = 'M'
    }
    if (Type == "threeMonth") {
      Type = '3M'
    }
    if (Type == "sixMonth") {
      Type = '6M'
    }
    if (Type == "twelveMonth") {
      Type = '12M'
    }
    this.xAxisData = [];
    this.yAxisData = [];
    this.categories = [];
    this.firstWeek = [];
    this.secondWeek = [];
    this.thirdWeek = [];
    this.fourthWeek = [];
    this.fifthWeek = [];
    this.sixthWeek = [];
    this.seventhWeek = [];
    this.eighthWeek = [];
    this.ninthWeek = [];
    this.tenthWeek = [];
    this.eleventhWeek = [];
    this.twelvethWeek = [];
    if (this.expensesDate) {
      this.slectedDate = {
        SMSMonth: parseInt(this.expensesDate.slice(5, 7)),
        SMSYear: parseInt(this.expensesDate.slice(0, 4))
      }
    }
    for (let i = 0; i < this.dateList.length; i++) {
      if (this.slectedDate.SMSMonth == this.dateList[i].SMSMonth && this.slectedDate.SMSYear == this.dateList[i].SMSYear) {
        var date = this.dateList[i];
        if (localStorage.getItem("dateStateObj")) {
          var dateObj = JSON.parse(localStorage.getItem("dateStateObj"))
          dateObj.weekReport = date;
          localStorage.setItem("dateStateObj", JSON.stringify(dateObj));
        }
      }
    }
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'Month': this.slectedDate.SMSMonth,
      'Year': this.slectedDate.SMSYear,
      'MonthType': Type,
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetExpenseTrade')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          if (response.Data.Table.length != 0 && response.Data.Table1.length != 0 && response.Data.Table2.length != 0 && response.Data.Table3.length != 0) {
            this.totalExpense = response.Data.Table[0].TotalSpends;
            this.CategoryNames = response.Data.Table1
            this.chartInput = response.Data.Table2
            var weekData = response.Data.Table3
            //To extract simple week data
            for (var i = 0; i < this.chartInput.length; i++) {
              this.xAxisData.push(this.chartInput[i]["ExpenseMonthName"]);
              this.yAxisData.push(this.chartInput[i]["Week_TotalExpense"]);
            }
            //To extract Top3 & Others cat names
            for (var i = 0; i < this.CategoryNames.length; i++) {
              this.categories.push(this.CategoryNames[i]["CategoryName"]);
            }
            if (this.categories.length < 4) {
              if (this.categories.length == 1) {
                if (this.categories[0] != this.categoryList[0].CategoryName && this.categories[0] != this.categoryList[1].CategoryName) {
                  this.categories[1] = this.categoryList[0].CategoryName;
                  this.categories[2] = this.categoryList[1].CategoryName;
                  this.categories[3] = "Others";
                }
                else if (this.categories[0] != this.categoryList[2].CategoryName && this.categories[0] != this.categoryList[3].CategoryName) {
                  this.categories[1] = this.categoryList[2].CategoryName;
                  this.categories[2] = this.categoryList[3].CategoryName;
                  this.categories[3] = "Others";
                }
              }
              else if (this.categories.length == 2) {
                if (this.categories[0] != this.categoryList[0].CategoryName && this.categories[1] != this.categoryList[0].CategoryName) {
                  this.categories[2] = this.categoryList[0].CategoryName;
                  this.categories[3] = "Others";
                }
                else if (this.categories[0] != this.categoryList[1].CategoryName && this.categories[1] != this.categoryList[1].CategoryName) {
                  this.categories[2] = this.categoryList[1].CategoryName;
                  this.categories[3] = "Others";
                }
                else if (this.categories[0] != this.categoryList[2].CategoryName && this.categories[1] != this.categoryList[2].CategoryName) {
                  this.categories[2] = this.categoryList[2].CategoryName;
                  this.categories[3] = "Others";
                }
              }
              else if (this.categories.length == 3) {
                this.categories[3] = "Others";
              }
            }
            // this.seriesData = [{
            //   data: this.yAxisData
            // }];
            //To extract category-wise 1 Month data          
            if (Type == 'M') {
              if (this.yAxisData.length == 4) {
                for (var i = 0; i < weekData.length; i++) {
                  if (weekData[i]["Week_Number"] == this.chartInput[0]["Week_Number"]) {
                    // this.firstWeek.push(weekData[i]["CategoryExpense"])
                    if (weekData[i]["CategoryName"] == this.categories[0])
                      this.firstWeek[3] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[1])
                      this.firstWeek[2] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[2])
                      this.firstWeek[1] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[3])
                      this.firstWeek[0] = weekData[i]["CategoryExpense"];
                  }
                  if (weekData[i]["Week_Number"] == this.chartInput[1]["Week_Number"]) {
                    // this.secondWeek.push(weekData[i]["CategoryExpense"])
                    if (weekData[i]["CategoryName"] == this.categories[0])
                      this.secondWeek[3] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[1])
                      this.secondWeek[2] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[2])
                      this.secondWeek[1] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[3])
                      this.secondWeek[0] = weekData[i]["CategoryExpense"];
                  }
                  if (weekData[i]["Week_Number"] == this.chartInput[2]["Week_Number"]) {
                    // this.thirdWeek.push(weekData[i]["CategoryExpense"])
                    if (weekData[i]["CategoryName"] == this.categories[0])
                      this.thirdWeek[3] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[1])
                      this.thirdWeek[2] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[2])
                      this.thirdWeek[1] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[3])
                      this.thirdWeek[0] = weekData[i]["CategoryExpense"];
                  }
                  if (weekData[i]["Week_Number"] == this.chartInput[3]["Week_Number"]) {
                    // this.fourthWeek.push(weekData[i]["CategoryExpense"])
                    if (weekData[i]["CategoryName"] == this.categories[0])
                      this.fourthWeek[3] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[1])
                      this.fourthWeek[2] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[2])
                      this.fourthWeek[1] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[3])
                      this.fourthWeek[0] = weekData[i]["CategoryExpense"];
                  }
                }
                this.seriesData = [{
                  data: [this.firstWeek[3] ? this.firstWeek[3] : 0, this.secondWeek[3] ? this.secondWeek[3] : 0, this.thirdWeek[3] ? this.thirdWeek[3] : 0, this.fourthWeek[3] ? this.fourthWeek[3] : 0],
                  name: this.categories[0],
                }, {
                  data: [this.firstWeek[2] ? this.firstWeek[2] : 0, this.secondWeek[2] ? this.secondWeek[2] : 0, this.thirdWeek[2] ? this.thirdWeek[2] : 0, this.fourthWeek[2] ? this.fourthWeek[2] : 0],
                  name: this.categories[1]
                }, {
                  data: [this.firstWeek[1] ? this.firstWeek[1] : 0, this.secondWeek[1] ? this.secondWeek[1] : 0, this.thirdWeek[1] ? this.thirdWeek[1] : 0, this.fourthWeek[1] ? this.fourthWeek[1] : 0],
                  name: this.categories[2]
                }, {
                  data: [this.firstWeek[0] ? this.firstWeek[0] : 0, this.secondWeek[0] ? this.secondWeek[0] : 0, this.thirdWeek[0] ? this.thirdWeek[0] : 0, this.fourthWeek[0] ? this.fourthWeek[0] : 0],
                  name: this.categories[3]
                }];
              }
              if (this.yAxisData.length == 5) {
                for (var i = 0; i < weekData.length; i++) {
                  if (weekData[i]["Week_Number"] == this.chartInput[0]["Week_Number"]) {
                    // this.firstWeek.push(weekData[i]["CategoryExpense"])
                    if (weekData[i]["CategoryName"] == this.categories[0])
                      this.firstWeek[3] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[1])
                      this.firstWeek[2] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[2])
                      this.firstWeek[1] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[3])
                      this.firstWeek[0] = weekData[i]["CategoryExpense"];
                  }
                  if (weekData[i]["Week_Number"] == this.chartInput[1]["Week_Number"]) {
                    // this.secondWeek.push(weekData[i]["CategoryExpense"])
                    if (weekData[i]["CategoryName"] == this.categories[0])
                      this.secondWeek[3] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[1])
                      this.secondWeek[2] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[2])
                      this.secondWeek[1] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[3])
                      this.secondWeek[0] = weekData[i]["CategoryExpense"];
                  }
                  if (weekData[i]["Week_Number"] == this.chartInput[2]["Week_Number"]) {
                    // this.thirdWeek.push(weekData[i]["CategoryExpense"])
                    if (weekData[i]["CategoryName"] == this.categories[0])
                      this.thirdWeek[3] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[1])
                      this.thirdWeek[2] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[2])
                      this.thirdWeek[1] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[3])
                      this.thirdWeek[0] = weekData[i]["CategoryExpense"];
                  }
                  if (weekData[i]["Week_Number"] == this.chartInput[3]["Week_Number"]) {
                    // this.fourthWeek.push(weekData[i]["CategoryExpense"])
                    if (weekData[i]["CategoryName"] == this.categories[0])
                      this.fourthWeek[3] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[1])
                      this.fourthWeek[2] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[2])
                      this.fourthWeek[1] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[3])
                      this.fourthWeek[0] = weekData[i]["CategoryExpense"];
                  }
                  if (weekData[i]["Week_Number"] == this.chartInput[4]["Week_Number"]) {
                    // this.fifthWeek.push(weekData[i]["CategoryExpense"])
                    if (weekData[i]["CategoryName"] == this.categories[0])
                      this.fifthWeek[3] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[1])
                      this.fifthWeek[2] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[2])
                      this.fifthWeek[1] = weekData[i]["CategoryExpense"];
                    if (weekData[i]["CategoryName"] == this.categories[3])
                      this.fifthWeek[0] = weekData[i]["CategoryExpense"];
                  }
                }

                this.seriesData = [{
                  data: [this.firstWeek[3] ? this.firstWeek[3] : 0, this.secondWeek[3] ? this.secondWeek[3] : 0, this.thirdWeek[3] ? this.thirdWeek[3] : 0, this.fourthWeek[3] ? this.fourthWeek[3] : 0, this.fifthWeek[3] ? this.fifthWeek[3] : 0],
                  name: this.categories[0]
                }, {
                  data: [this.firstWeek[2] ? this.firstWeek[2] : 0, this.secondWeek[2] ? this.secondWeek[2] : 0, this.thirdWeek[2] ? this.thirdWeek[2] : 0, this.fourthWeek[2] ? this.fourthWeek[2] : 0, this.fifthWeek[2] ? this.fifthWeek[2] : 0],
                  name: this.categories[1]
                }, {
                  data: [this.firstWeek[1] ? this.firstWeek[1] : 0, this.secondWeek[1] ? this.secondWeek[1] : 0, this.thirdWeek[1] ? this.thirdWeek[1] : 0, this.fourthWeek[1] ? this.fourthWeek[1] : 0, this.fifthWeek[1] ? this.fifthWeek[1] : 0],
                  name: this.categories[2]
                }, {
                  data: [this.firstWeek[0] ? this.firstWeek[0] : 0, this.secondWeek[0] ? this.secondWeek[0] : 0, this.thirdWeek[0] ? this.thirdWeek[0] : 0, this.fourthWeek[0] ? this.fourthWeek[0] : 0, this.fifthWeek[0] ? this.fifthWeek[0] : 0],
                  name: this.categories[3]
                }];
              }
            }
            //To extract category-wise 3 Month data          
            if (Type == '3M') {
              for (var i = 0; i < weekData.length; i++) {
                if (weekData[i]["Week_Number"] == this.chartInput[0]["Week_Number"]) {
                  // this.firstWeek.push(weekData[i]["CategoryExpense"])
                  if (weekData[i]["CategoryName"] == this.categories[0])
                    this.firstWeek[3] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[1])
                    this.firstWeek[2] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[2])
                    this.firstWeek[1] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[3])
                    this.firstWeek[0] = weekData[i]["CategoryExpense"];
                }
                if (weekData[i]["Week_Number"] == this.chartInput[1]["Week_Number"]) {
                  // this.secondWeek.push(weekData[i]["CategoryExpense"])
                  if (weekData[i]["CategoryName"] == this.categories[0])
                    this.secondWeek[3] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[1])
                    this.secondWeek[2] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[2])
                    this.secondWeek[1] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[3])
                    this.secondWeek[0] = weekData[i]["CategoryExpense"];
                }
                if (weekData[i]["Week_Number"] == this.chartInput[2]["Week_Number"]) {
                  // this.thirdWeek.push(weekData[i]["CategoryExpense"])
                  if (weekData[i]["CategoryName"] == this.categories[0])
                    this.thirdWeek[3] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[1])
                    this.thirdWeek[2] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[2])
                    this.thirdWeek[1] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[3])
                    this.thirdWeek[0] = weekData[i]["CategoryExpense"];
                }
              }
              this.seriesData = [{
                data: [this.firstWeek[3] ? this.firstWeek[3] : 0, this.secondWeek[3] ? this.secondWeek[3] : 0, this.thirdWeek[3] ? this.thirdWeek[3] : 0],
                name: this.categories[0]
              }, {
                data: [this.firstWeek[2] ? this.firstWeek[2] : 0, this.secondWeek[2] ? this.secondWeek[2] : 0, this.thirdWeek[2] ? this.thirdWeek[2] : 0],
                name: this.categories[1]
              }, {
                data: [this.firstWeek[1] ? this.firstWeek[1] : 0, this.secondWeek[1] ? this.secondWeek[1] : 0, this.thirdWeek[1] ? this.thirdWeek[1] : 0],
                name: this.categories[2]
              }, {
                data: [this.firstWeek[0] ? this.firstWeek[0] : 0, this.secondWeek[0] ? this.secondWeek[0] : 0, this.thirdWeek[0] ? this.thirdWeek[0] : 0],
                name: this.categories[3]
              }];
            }
            //To extract category-wise 6 Month data          
            if (Type == '6M') {
              for (var i = 0; i < weekData.length; i++) {
                if (weekData[i]["Week_Number"] == this.chartInput[0]["Week_Number"]) {
                  // this.firstWeek.push(weekData[i]["CategoryExpense"])
                  if (weekData[i]["CategoryName"] == this.categories[0])
                    this.firstWeek[3] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[1])
                    this.firstWeek[2] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[2])
                    this.firstWeek[1] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[3])
                    this.firstWeek[0] = weekData[i]["CategoryExpense"];
                }
                if (weekData[i]["Week_Number"] == this.chartInput[1]["Week_Number"]) {
                  // this.secondWeek.push(weekData[i]["CategoryExpense"])
                  if (weekData[i]["CategoryName"] == this.categories[0])
                    this.secondWeek[3] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[1])
                    this.secondWeek[2] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[2])
                    this.secondWeek[1] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[3])
                    this.secondWeek[0] = weekData[i]["CategoryExpense"];
                }
                if (weekData[i]["Week_Number"] == this.chartInput[2]["Week_Number"]) {
                  // this.thirdWeek.push(weekData[i]["CategoryExpense"])
                  if (weekData[i]["CategoryName"] == this.categories[0])
                    this.thirdWeek[3] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[1])
                    this.thirdWeek[2] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[2])
                    this.thirdWeek[1] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[3])
                    this.thirdWeek[0] = weekData[i]["CategoryExpense"];
                }
                if (weekData[i]["Week_Number"] == this.chartInput[3]["Week_Number"]) {
                  // this.fourthWeek.push(weekData[i]["CategoryExpense"])
                  if (weekData[i]["CategoryName"] == this.categories[0])
                    this.fourthWeek[3] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[1])
                    this.fourthWeek[2] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[2])
                    this.fourthWeek[1] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[3])
                    this.fourthWeek[0] = weekData[i]["CategoryExpense"];
                }
                if (weekData[i]["Week_Number"] == this.chartInput[4]["Week_Number"]) {
                  // this.fifthWeek.push(weekData[i]["CategoryExpense"])
                  if (weekData[i]["CategoryName"] == this.categories[0])
                    this.fifthWeek[3] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[1])
                    this.fifthWeek[2] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[2])
                    this.fifthWeek[1] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[3])
                    this.fifthWeek[0] = weekData[i]["CategoryExpense"];
                }
                if (weekData[i]["Week_Number"] == this.chartInput[5]["Week_Number"]) {
                  // this.sixthWeek.push(weekData[i]["CategoryExpense"])
                  if (weekData[i]["CategoryName"] == this.categories[0])
                    this.sixthWeek[3] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[1])
                    this.sixthWeek[2] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[2])
                    this.sixthWeek[1] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[3])
                    this.sixthWeek[0] = weekData[i]["CategoryExpense"];
                }
              }
              this.seriesData = [{
                data: [this.firstWeek[3] ? this.firstWeek[3] : 0, this.secondWeek[3] ? this.secondWeek[3] : 0, this.thirdWeek[3] ? this.thirdWeek[3] : 0, this.fourthWeek[3] ? this.fourthWeek[3] : 0, this.fifthWeek[3] ? this.fifthWeek[3] : 0, this.sixthWeek[3] ? this.sixthWeek[3] : 0],
                name: this.categories[0]
              }, {
                data: [this.firstWeek[2] ? this.firstWeek[2] : 0, this.secondWeek[2] ? this.secondWeek[2] : 0, this.thirdWeek[2] ? this.thirdWeek[2] : 0, this.fourthWeek[2] ? this.fourthWeek[2] : 0, this.fifthWeek[2] ? this.fifthWeek[2] : 0, this.sixthWeek[2] ? this.sixthWeek[2] : 0],
                name: this.categories[1]
              }, {
                data: [this.firstWeek[1] ? this.firstWeek[1] : 0, this.secondWeek[1] ? this.secondWeek[1] : 0, this.thirdWeek[1] ? this.thirdWeek[1] : 0, this.fourthWeek[1] ? this.fourthWeek[1] : 0, this.fifthWeek[1] ? this.fifthWeek[1] : 0, this.sixthWeek[1] ? this.sixthWeek[1] : 0],
                name: this.categories[2]
              }, {
                data: [this.firstWeek[0] ? this.firstWeek[0] : 0, this.secondWeek[0] ? this.secondWeek[0] : 0, this.thirdWeek[0] ? this.thirdWeek[0] : 0, this.fourthWeek[0] ? this.fourthWeek[0] : 0, this.fifthWeek[0] ? this.fifthWeek[0] : 0, this.sixthWeek[0] ? this.sixthWeek[0] : 0],
                name: this.categories[3]
              }];
            }
            //To extract category-wise 12 Month data          
            if (Type == '12M') {
              for (var i = 0; i < weekData.length; i++) {
                if (weekData[i]["Week_Number"] == this.chartInput[0]["Week_Number"]) {
                  // this.firstWeek.push(weekData[i]["CategoryExpense"])
                  if (weekData[i]["CategoryName"] == this.categories[0])
                    this.firstWeek[3] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[1])
                    this.firstWeek[2] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[2])
                    this.firstWeek[1] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[3])
                    this.firstWeek[0] = weekData[i]["CategoryExpense"];
                }
                if (weekData[i]["Week_Number"] == this.chartInput[1]["Week_Number"]) {
                  // this.secondWeek.push(weekData[i]["CategoryExpense"])
                  if (weekData[i]["CategoryName"] == this.categories[0])
                    this.secondWeek[3] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[1])
                    this.secondWeek[2] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[2])
                    this.secondWeek[1] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[3])
                    this.secondWeek[0] = weekData[i]["CategoryExpense"];
                }
                if (weekData[i]["Week_Number"] == this.chartInput[2]["Week_Number"]) {
                  // this.thirdWeek.push(weekData[i]["CategoryExpense"])
                  if (weekData[i]["CategoryName"] == this.categories[0])
                    this.thirdWeek[3] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[1])
                    this.thirdWeek[2] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[2])
                    this.thirdWeek[1] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[3])
                    this.thirdWeek[0] = weekData[i]["CategoryExpense"];
                }
                if (weekData[i]["Week_Number"] == this.chartInput[3]["Week_Number"]) {
                  // this.fourthWeek.push(weekData[i]["CategoryExpense"])
                  if (weekData[i]["CategoryName"] == this.categories[0])
                    this.fourthWeek[3] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[1])
                    this.fourthWeek[2] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[2])
                    this.fourthWeek[1] = weekData[i]["CategoryExpense"];
                  if (weekData[i]["CategoryName"] == this.categories[3])
                    this.fourthWeek[0] = weekData[i]["CategoryExpense"];
                }
              }

              this.seriesData = [{
                data: [this.firstWeek[3] ? this.firstWeek[3] : 0, this.secondWeek[3] ? this.secondWeek[3] : 0, this.thirdWeek[3] ? this.thirdWeek[3] : 0, this.fourthWeek[3] ? this.fourthWeek[3] : 0],
                name: this.categories[0]
              }, {
                data: [this.firstWeek[2] ? this.firstWeek[2] : 0, this.secondWeek[2] ? this.secondWeek[2] : 0, this.thirdWeek[2] ? this.thirdWeek[2] : 0, this.fourthWeek[2] ? this.fourthWeek[2] : 0],
                name: this.categories[1]
              }, {
                data: [this.firstWeek[1] ? this.firstWeek[1] : 0, this.secondWeek[1] ? this.secondWeek[1] : 0, this.thirdWeek[1] ? this.thirdWeek[1] : 0, this.fourthWeek[1] ? this.fourthWeek[1] : 0],
                name: this.categories[2]
              }, {
                data: [this.firstWeek[0] ? this.firstWeek[0] : 0, this.secondWeek[0] ? this.secondWeek[0] : 0, this.thirdWeek[0] ? this.thirdWeek[0] : 0, this.fourthWeek[0] ? this.fourthWeek[0] : 0],
                name: this.categories[3]
              }];
            }


            this.chartLoad();

            if (this.yAxisData[0] != 0 || this.yAxisData[1] != 0 || this.yAxisData[2] != 0 || this.yAxisData[3] != 0 || this.yAxisData[4] != 0 || this.yAxisData[5] != 0 || this.yAxisData[6] != 0 || this.yAxisData[7] != 0 || this.yAxisData[8] != 0 || this.yAxisData[9] != 0 || this.yAxisData[10] != 0 || this.yAxisData[11] != 0) {
              this.isTrendData = true;
            }
            //If No Data
            else {
              this.isTrendData = false;
            }
            setTimeout(() => {
              this.pageLoader = false;
            }, 1000)
            this.noPageData = true;
          }
          else {
            this.noPageData = false;
            this.pageLoader = false;
          }
        }
        else {
          this.noPageData = false;
          this.pageLoader = false;
        }


      },
        (error) => {

        })
  }

  chartLoad() {
    let _that = this;
    HighCharts.chart('expense_trends_stack', {
      chart: {
        type: 'column',
        marginTop: 10,
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
        min: 0,
        labels: {
          enabled: false
        },
        gridLineWidth: 0,
        title:{
          enabled: false
        },
        stackLabels: {
          enabled: true,
          useHTML: true,
          formatter: function() {
            return `<div class="data_lable_rs">₹`+_that.amountFormatter.transform(this.total, 'S')+`</div>`;
          },
          y: -10
        }
    },
      legend: {
        enabled: false,
        floating: false,
        align: 'top',
        verticalAlign: 'top',
        layout: 'horizontal',
        x: -15,
        y: 0,
        width: '320',
        itemMarginTop: 7,
        itemMarginBottom: 7,
        itemStyle: {
          color: '#727272',
          fontSize: '3.077vw',
          fontFamily: 'Lato Semibold',
        }
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          states: {
            hover: {
              color: '#259bff'
            }
          },
          stacking: 'normal',
          pointPadding: 0,
          groupPadding: 0,
          borderWidth: 0,
          showInLegend: true,
          // minPointLength: 3,
          dataLabels: {
            enabled: false,
        },
        },
        series: {
          cursor: 'pointer',
          events: {
            click: this.onPointClick
          },
          pointWidth: 45,
          states: {
            hover: {
              enabled: false
            }
          },
        }
      },
      colors: ['#46c9fb', '#249bfe', '#2541ff', '#2e3096'],
      tooltip: { enabled: true },
      series: (this.seriesData)
    });

  }
  onPointClick = (event: any) => {
    this.totalMonthExpense = event.point["total"];
    this.isClick = true;
  };
  contentClick(event) {
    if ((event["srcElement"].classList[0]) !== "highcharts-point") {
      this.isClick = false;
    }
  }
  dateChange() {
    this.monthType = "month";
  }

  changeChartView(type) {
    if (type == 'w') {
      this.isWeek = true;
      this.isMonth = false;
    }
    else {
      this.isMonth = true;
      this.isWeek = false;
    }
    this.chartLoad();
  }

  getMonthYearDropDown() {
    this.pageLoader = true;
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID']
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetMonthYearList')

      .subscribe((response) => {
        if (response.IsSuccess == true) {
          if (response.Data.Table.length != 0) {
            this.dateList = response["Data"]["Table"];
            this.minDate = this.dateList[this.dateList.length - 1].SMSYear + "-" + (this.dateList[this.dateList.length - 1].SMSMonth < 10 ? '0' + this.dateList[this.dateList.length - 1].SMSMonth : this.dateList[this.dateList.length - 1].SMSMonth);
            this.maxDate = this.dateList[0].SMSYear + "-" + (this.dateList[0].SMSMonth < 10 ? '0' + this.dateList[0].SMSMonth : this.dateList[0].SMSMonth);
          }
          else {
            this.pageLoader = false;
          }
          this.getExpenseTrade('month');
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
          if (response.Data.Table1) {
            this.categoryList = response.Data.Table1;
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
}
