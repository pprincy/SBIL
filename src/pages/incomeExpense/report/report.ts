import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Select } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import * as HighCharts from 'highcharts';
import * as $ from 'jquery';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { TranslateService } from '@ngx-translate/core';
import { MyApp } from '../../../app/app.component';
import { config } from '../../../shared/config';
@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
  @ViewChild('yourSelect') yourSelect: Select;
  public pageLoader: boolean = true;
  public popupShow: boolean = false;
  public popupShowSpends: boolean = false;
  public popupShowImpact: boolean = false;
  public popupShowSavings: boolean = false;
  public popupShowDistribution: boolean = false;
  public isPageDataLoad: boolean = false;
  public incomeDistribution;
  public incomeDistributionChartData: any = [];
  public expenseType: any = [];
  public expense: any = [];
  public totalExpense;
  public totalTaxPaid;
  public profileActionPlan;
  public savingText;
  public isSavingText: boolean = false;
  public profileName;
  public savingProfilePerc;
  public goalResponseArr: any = [];
  public graphData: any = [];
  public goalsSet: any;
  public goalsArr: any = [];
  public grossSalary;
  public reportTable1;
  public finalSavingRatePerc: any = []; x
  public reductionInControllableExpense: any = [];
  public reductionInControllableExpensePerc: any = [];
  public reportTable2Data: any = [];
  public imgURL;
  public incomeDistributionTable: any = [];
  public incomeCat: any = [];
  public incomeCatVal: any = [];
  public incomeChartData: any = [];
  public oneGoalArr: any = [];
  public twoGoalArr: any = [];
  public threeGoalArr: any = [];
  public fourGoalArr: any = [];
  public counter: number = 0;
  public popupText;
  public totalincome;
  public totalTaxPaidNew;
  public reportTotalIncome;
  public yourNetCashFlow;
  public rateIs;
  public dateList: any;
  public expensesDate;
  public placeDate;
  public indexValue;
  public reportDate: any = [];
  public reportData: any = [];
  public isSelectAll: boolean = true;
  public noData: boolean = false;
  public noGoals: boolean = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    public translateService: TranslateService,
    public myApp: MyApp) {
    this.imgURL = config.imgURLNew;
  }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("65");
    this.utilitiesProvider.googleAnalyticsTrackView('Report');
    setTimeout(() => {
      this.getMonthYearDropDown();
      this.isPageDataLoad = true;
      this.pageLoader = false;
    }, 5000)
    this.translateService.get('report.totalIncome').subscribe(
      value => {
        this.reportTotalIncome = value;
      }
    )
    this.translateService.get('report.yourNetCashFlow').subscribe(
      value => {
        this.yourNetCashFlow = value;
      }
    )
    this.translateService.get('report.rateIs').subscribe(
      value => {
        this.rateIs = value;
      }
    )

    this.utilitiesProvider.upshotScreenView('SpendReport');
  }
  getExpenseTradeReport() {
    $(".goal_timeline_corpus_bar").empty();
    this.counter = 0;
    this.pageLoader = true;
    this.oneGoalArr = []
    this.twoGoalArr = []
    this.threeGoalArr = []
    this.fourGoalArr = []
    this.incomeChartData = [];
    this.reportDate = this.expensesDate
    this.reportData = [];
    for (var i = 0; i < this.reportDate.length; i++) {
      var reportDataArray = {
        "Month": this.reportDate[i].SMSMonth,
        "Year": this.reportDate[i].SMSYear,
      }
      this.reportData.push(reportDataArray)
    }
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'LangId': localStorage.getItem('langId'),
      'YearMonths': this.reportData
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetExpenseTradeReport')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.noData = false;
          if (response.Data.Table1.length) {
            this.profileActionPlan = response["Data"]["Table1"][0]["ProfileActionPlan"];
            this.profileName = response["Data"]["Table1"][0]["ProfileName"];
            this.savingProfilePerc = (response["Data"]["Table1"][0]["SavingProfilePerc"]);
            if (response.Data.Table1[0].SavingText != []) {
              this.isSavingText = true;
              this.savingText = response["Data"]["Table1"][0]["SavingText"]
            }
            else {
              this.isSavingText = false;
            }
          }
          if (response.Data.Table.length) {
            this.incomeDistributionTable = response["Data"]["Table"]
            this.totalExpense = response["Data"]["Table"][0]["TotalExpense"];
            this.totalTaxPaid = response["Data"]["Table"][2]["TotalExpense"];
            this.grossSalary = (response["Data"]["Table"][1]["TotalExpense"]).toLocaleString(('en-IN'));
          }
          if (response.Data.Table6.length) {
            this.totalincome = response["Data"]["Table6"][0]["Total_Income"].toLocaleString(('en-IN'));
            this.totalTaxPaidNew = response["Data"]["Table6"][0]["Total_Tax_Paid"]
          }
          if (response.Data.Table3.length) { this.reportTable1 = response["Data"]["Table3"]; }
          if (response.Data.Table4.length) {
            this.reportTable2Data = [];
            for (var i = 0; i < response["Data"]["Table4"].length; i++) {
              this.reductionInControllableExpensePerc[i] = response.Data.Table4[i]["ReductionInControllableExpensePerc"];
              this.reductionInControllableExpense[i] = response.Data.Table4[i]["ReductionInControllableExpense"];
              this.finalSavingRatePerc[i] = response.Data.Table4[i]["FinalSavingRatePerc"];
              this.reportTable2Data.push([this.reductionInControllableExpensePerc[i], this.reductionInControllableExpense[i], this.finalSavingRatePerc[i]]);
            }
          }
          if (response.Data.Table2.length) {
            this.incomeDistributionChartData = [];
            for (var i = 0; i < response["Data"]["Table2"].length; i++) {
              this.expenseType[i] = response.Data.Table2[i]["ExpenseType"];
              this.expense[i] = response.Data.Table2[i]["Expense"];
              this.incomeDistributionChartData.push([this.expenseType[i], this.expense[i]]);
            }
          }
          for (var i = 0; i < this.incomeDistributionTable.length; i++) {
            this.incomeCat[i] = this.incomeDistributionTable[i]["Type"];
            this.incomeCatVal[i] = this.incomeDistributionTable[i]["TotalExpense"];
            this.incomeChartData.push([this.incomeCat[i], this.incomeCatVal[i]]);
          }
          if (response.Data.Table5.length != 0) {
            this.noGoals = false;
            this.goalResponseArr = response["Data"]["Table5"];
            //Sorting in ascending order
            this.goalResponseArr.sort(function (a, b) { return a.tenure - b.tenure });
            //Sorting array according to their group repetition
            for (let i = 0; i < this.goalResponseArr.length; i++) {
              if (this.goalResponseArr[i + 1]) {
                if (this.goalResponseArr[i].tenure != this.goalResponseArr[i + 1].tenure) {
                  this.oneGoalArr.push(this.goalResponseArr[i]);
                  this.displayOneGoal(this.oneGoalArr);
                  this.oneGoalArr = []
                }
                else {
                  if (this.goalResponseArr[i + 2]) {
                    if (this.goalResponseArr[i + 1].tenure == this.goalResponseArr[i + 2].tenure) {
                      if (this.goalResponseArr[i + 3]) {
                        if (this.goalResponseArr[i + 2].tenure == this.goalResponseArr[i + 3].tenure) {
                          this.fourGoalArr.push(this.goalResponseArr[i])
                          this.fourGoalArr.push(this.goalResponseArr[i + 1])
                          this.fourGoalArr.push(this.goalResponseArr[i + 2])
                          this.fourGoalArr.push(this.goalResponseArr[i + 3])
                          this.displayFourGoal(this.fourGoalArr);
                          this.fourGoalArr = []
                          i += 3
                        }
                        else {
                          this.threeGoalArr.push(this.goalResponseArr[i])
                          this.threeGoalArr.push(this.goalResponseArr[i + 1])
                          this.threeGoalArr.push(this.goalResponseArr[i + 2])
                          this.displayThreeGoal(this.threeGoalArr);
                          this.threeGoalArr = []
                          i += 2
                        }
                      }
                      else {
                        this.threeGoalArr.push(this.goalResponseArr[i])
                        this.threeGoalArr.push(this.goalResponseArr[i + 1])
                        this.threeGoalArr.push(this.goalResponseArr[i + 2])
                        this.displayThreeGoal(this.threeGoalArr);
                        this.threeGoalArr = []
                        i += 2
                      }
                    }
                    else {
                      this.twoGoalArr.push(this.goalResponseArr[i])
                      this.twoGoalArr.push(this.goalResponseArr[i + 1])
                      this.displayTwoGoal(this.twoGoalArr);
                      this.twoGoalArr = []
                      i += 1
                    }
                  }
                  else {
                    this.twoGoalArr.push(this.goalResponseArr[i])
                    this.twoGoalArr.push(this.goalResponseArr[i + 1])
                    this.displayTwoGoal(this.twoGoalArr);
                    this.twoGoalArr = []
                    i += 1
                  }
                }
              }
              else {
                if (this.goalResponseArr[i - 1]) {
                  if (this.goalResponseArr[i].tenure != this.goalResponseArr[i - 1].tenure) {
                    this.oneGoalArr.push(this.goalResponseArr[i]);
                    this.displayOneGoal(this.oneGoalArr);
                    this.oneGoalArr = []
                  }
                }
                else {
                  this.oneGoalArr.push(this.goalResponseArr[i]);
                  this.displayOneGoal(this.oneGoalArr);
                  this.oneGoalArr = []
                }
              }
            }
            this.pageLoader = false
          }
          else {
            this.noGoals = true;
            this.pageLoader = false
          }
          this.incomeDistributionPie();
          this.yourSavingPie();
          this.expenseAnalysis();

        }
        else {
          this.noData = true;
          this.pageLoader = false
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  incomeDistributionPie() {
    HighCharts.chart('income_distribution', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        margin: [-10, 0, 0, -75],
        spacingTop: 0,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0
      },
      credits: {
        enabled: false
      },
      title: {
        text: '<div class="chart_total_exp"><h5 align="center">' + this.reportTotalIncome + '</h5><div class="chart_total_val" align="center"><span class="icon-Icons_Ruppee">' + this.totalincome + '</span></div></div>',
        useHTML: true,
        align: 'center',
        verticalAlign: 'middle',
        x: -42,
        y: -2,
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>',
        shadow: false,
      },
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemMarginTop: 7,
        itemMarginBottom: 7,
        itemStyle: {
          color: '#6f6c6c',
          fontSize: '3.05vw',
          fontFamily: 'Lato Semibold'
        }
      },
      plotOptions: {
        pie: {
          size: '100%',
          shadow: false,
          dataLabels: {
            enabled: false
          },
          showInLegend: true,
          states: {
            hover: {
              halo: {
                size: 0,
              }
            }
          }
        }
      },
      colors: ['#08fcd2', '#e93f5e', '#ffc532', '#34fe32'],
      series: [{
        type: 'pie',
        name: '',
        size: '96%',
        innerSize: '85%',
        data: this.incomeChartData
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
        size: '76%',
        innerSize: '98%',
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
  yourSavingPie() {
    HighCharts.chart('your_savings', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        margin: [0, 0, 0, 0],
        spacingTop: 0,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0
      },
      credits: {
        enabled: false
      },
      title: {
        text: '<div class="chart_total_exp"><h5 align="center">' + this.yourNetCashFlow + '<br>' + this.rateIs + '</h5><div class="chart_total_val" align="center">' + this.savingProfilePerc + '%</div></div>',
        useHTML: true,
        align: 'center',
        verticalAlign: 'middle',
        y: -3
      },
      tooltip: {
        enabled: false,
      },
      legend: {
        itemMarginTop: 7,
        itemMarginBottom: 7,
      },
      plotOptions: {
        pie: {
          size: '120%',
          dataLabels: {
            enabled: false
          },
          states: {
            hover: {
              halo: {
                size: 0,
              }
            }
          }
        }
      },
      colors: ['#301F6C', '#d0f0fb'],
      series: [{
        type: 'pie',
        name: '',
        innerSize: '90%',
        data: [this.savingProfilePerc, 100 - this.savingProfilePerc]
      }]
    });
  }
  expenseAnalysis() {
    var myExpenses = HighCharts.chart('expense_analysis', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        margin: [-10, 0, 50, -75],
        spacingTop: 0,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0
      },
      credits: {
        enabled: false
      },
      title: {
        text: '',
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>',
      },
      legend: {
        floating: false,
        align: 'left',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemMarginTop: 7,
        itemMarginBottom: 7,
        itemStyle: {
          color: '#6f6c6c',
          fontSize: '3.05vw',
          fontFamily: 'Lato Semibold'
        }
      },
      plotOptions: {
        pie: {
          // size: '100%',
          shadow: false,
          allowPointSelect: false,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true,
          states: {
            hover: {
              halo: {
                size: 0,
              }
            }
          }
        }
      },
      colors: ['#08fcd2', '#e93f5e', '#ffc532', '#34fe32'],
      series: [{
        type: 'pie',
        name: '',
        size: "96%",
        innerSize: '55%',
        data: this.incomeDistributionChartData
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
        size: '45%',
        innerSize: '96%',
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
  displayOneGoal(arr) {
    this.counter++
    //One Goal
    let goalsName = arr[0].UserGoalName;
    let goalImg = this.imgURL + arr[0].ImagePath;
    let savingRequired = this.GetRoundingFigure(arr[0].MonthlySavingRequied)
    let tenure = arr[0].tenure;
    this.oneGoalMethod(goalsName, goalImg, savingRequired, tenure);
  }

  displayTwoGoal(arr) {
    this.counter++
    //Two Goal in progress...
    let goalsName = [arr[0].UserGoalName, arr[1].UserGoalName];
    let goalImg = [this.imgURL + arr[0].ImagePath, this.imgURL + arr[1].ImagePath];
    let savingRequired = [this.GetRoundingFigure(arr[0].MonthlySavingRequied), this.GetRoundingFigure(arr[1].MonthlySavingRequied)];
    let tenure = [arr[0].tenure, arr[1].tenure];
    this.twoGoalMethod(goalsName, goalImg, savingRequired, tenure);
  }
  displayThreeGoal(arr) {
    this.counter++
    //Three Goal in progress...
    let goalsName = [arr[0].UserGoalName, arr[1].UserGoalName, arr[2].UserGoalName];
    let goalImg = [this.imgURL + arr[0].ImagePath, this.imgURL + arr[1].ImagePath, this.imgURL + arr[2].ImagePath];
    let savingRequired = [this.GetRoundingFigure(arr[0].MonthlySavingRequied), this.GetRoundingFigure(arr[1].MonthlySavingRequied), this.GetRoundingFigure(arr[2].MonthlySavingRequied)];
    let tenure = [arr[0].tenure, arr[1].tenure, arr[2].tenure];
    this.threeGoalMethod(goalsName, goalImg, savingRequired, tenure);
  }
  displayFourGoal(arr) {
    this.counter++
    //Four Goal in progress...
    let goalsName = [arr[0].UserGoalName, arr[1].UserGoalName, arr[2].UserGoalName, arr[3].UserGoalName];
    let goalImg = [this.imgURL + arr[0].ImagePath, this.imgURL + arr[1].ImagePath, this.imgURL + arr[2].ImagePath, this.imgURL + arr[3].ImagePath];
    let savingRequired = [this.GetRoundingFigure(arr[0].MonthlySavingRequied), this.GetRoundingFigure(arr[1].MonthlySavingRequied), this.GetRoundingFigure(arr[2].MonthlySavingRequied), this.GetRoundingFigure(arr[3].MonthlySavingRequied)];
    let tenure = [arr[0].tenure, arr[1].tenure, arr[2].tenure, arr[3].tenure];
    this.threeGoalMethod(goalsName, goalImg, savingRequired, tenure);
  }
  oneGoalMethod(goalsName, goalImg, savingRequired, tenure) {
    $(".goal_timeline_corpus_bar").append('<div class="goal_timeline_corpus_bar' + this.counter + '"><span class="corpus_val">' + tenure + ' yrs</span><div class="corpus_bar_icon upper"><span class="line"></span>              <img src="' + goalImg + '" />            </div>            <div class="corpus_bar_val upper">              <h6>' + goalsName + '</h6>              <div><span class="rs_icon icon-Icons_Ruppee"></span>' + savingRequired + '</div>            </div>        </div>');
  }
  twoGoalMethod(goalsName, goalImg, savingRequired, tenure) {
    $(".goal_timeline_corpus_bar").append('<div class="goal_timeline_corpus_bar' + this.counter + '"><span class="corpus_val">' + tenure[0] + ' yrs</span><div class="corpus_bar_icon upper"> <span class="line"></span>             <img src="' + goalImg[0] + '" />            </div>            <div class="corpus_bar_val upper">              <h6>' + goalsName[0] + '</h6>              <div>                <span class="rs_icon icon-Icons_Ruppee"></span>' + savingRequired[0] + '</div>            </div>            <div class="corpus_bar_icon down"> <span class="line"></span>             <img src="' + goalImg[1] + '" />            </div>            <div class="corpus_bar_val down">              <h6>' + goalsName[1] + '</h6>              <div>                <span class="rs_icon icon-Icons_Ruppee"></span>' + savingRequired[1] + '</div>            </div>        </div>');
  }
  threeGoalMethod(goalsName, goalImg, savingRequired, tenure) {
    $(".goal_timeline_corpus_bar").append('<div class="goal_timeline_corpus_bar' + this.counter + '"><span class="corpus_val">' + tenure[0] + ' yrs</span><div class="corpus_bar_icon upper upper_lt"><span class="line"></span>              <img src="' + goalImg[0] + '" />            </div>            <div class="corpus_bar_val upper upper_lt">              <h6>' + goalsName[0] + '</h6>              <div>                <span class="rs_icon icon-Icons_Ruppee"></span>' + savingRequired[0] + '</div>            </div>            <div class="corpus_bar_icon down down_lt"> <span class="line"></span>             <img src="' + goalImg[1] + '" />            </div>            <div class="corpus_bar_val down down_lt">              <h6>' + goalsName[1] + '</h6>              <div>                <span class="rs_icon icon-Icons_Ruppee"></span>' + savingRequired[1] + '</div>            </div>            <div class="corpus_bar_icon upper upper_rt">  <span class="line"></span>            <img src="' + goalImg[2] + '" />            </div>            <div class="corpus_bar_val upper upper_rt">              <h6>' + goalsName[2] + '</h6>              <div>                <span class="rs_icon icon-Icons_Ruppee"></span>' + savingRequired[2] + '</div>            </div>        </div>');
  }
  fourGoalMethod(goalsName, goalImg, savingRequired, tenure) {
    $(".goal_timeline_corpus_bar").append('<div class="goal_timeline_corpus_bar' + this.counter + '"><span class="corpus_val">' + tenure[0] + ' yrs</span><div class="corpus_bar_icon upper upper_lt"> <span class="line"></span>             <img src="' + goalImg[0] + '" />            </div>            <div class="corpus_bar_val upper upper_lt">              <h6>' + goalsName[0] + '</h6>              <div>                <span class="rs_icon icon-Icons_Ruppee"></span>' + savingRequired[0] + '</div>            </div>            <div class="corpus_bar_icon down down_lt"> <span class="line"></span>             <img src="' + goalImg[1] + '" />            </div>            <div class="corpus_bar_val down down_lt">              <h6>' + goalsName[1] + '</h6>              <div>                <span class="rs_icon icon-Icons_Ruppee"></span>' + savingRequired[1] + '</div>            </div>            <div class="corpus_bar_icon upper upper_rt">  <span class="line"></span>            <img src="' + goalImg[2] + '" />            </div>            <div class="corpus_bar_val upper upper_rt">              <h6>' + goalsName[2] + '</h6>              <div>                <span class="rs_icon icon-Icons_Ruppee"></span>' + savingRequired[2] + '</div>            </div>            <div class="corpus_bar_icon down down_rt"><span class="line"></span>              <img src="' + goalImg[3] + '" />            </div>            <div class="corpus_bar_val down down_rt">              <h6>' + goalsName[3] + '</h6>              <div>                <span class="rs_icon icon-Icons_Ruppee"></span>' + savingRequired[3] + '</div>            </div>        </div>');
  }
  info() {
    this.popupShow = !this.popupShow;
  }
  infoSavings() {
    this.popupShowSavings = !this.popupShowSavings;
  }
  infoAnalysis() {
    this.popupShowSpends = !this.popupShowSpends;
  }
  infoImprove() {
    this.popupShowImpact = !this.popupShowImpact;
  }
  infoAnalysisDistribtion() {
    this.popupShowDistribution = !this.popupShowDistribution;
  }
  hideDisclaimer() {
    this.popupShow = !this.popupShow;
  }
  hideDisclaimerSavings() {
    this.popupShowSavings = !this.popupShowSavings;
  }
  hideDisclaimerImpact() {
    this.popupShowImpact = !this.popupShowImpact;
  }
  hideDisclaimerSpends() {
    this.popupShowSpends = !this.popupShowSpends;
  }
  hideDisclaimerDistribution() {
    this.popupShowDistribution = !this.popupShowDistribution;
  }
  GetRoundingFigure(val) {
    var vals = [];
    if (typeof val === 'number') {
    }
    else {
      val = parseFloat(val);
    }
    if (val < 100 || isNaN(val)) {
      vals[0] = val;
      vals[1] = '';
      vals[2] = '';
    }
    else if (val < 100000) {
      vals[0] = val.toLocaleString('en-IN', { minimumFractionDigits: 0 });
      vals[1] = '';
      vals[2] = '';
    }
    else if (val >= 10000000) {
      vals[0] = this.rounding(val / 10000000, 2);
      vals[1] = 'Cr.';
      vals[2] = this.utilitiesProvider.commonLangMsg['cr'];
    }
    else if (val < 10000000) {
      vals[0] = this.rounding(val / 100000, 2);
      vals[1] = 'L';
      vals[2] = this.utilitiesProvider.commonLangMsg['lac'];
      if (vals[0] == 100) {
        vals[0] = 1;
        vals[1] = 'Cr.';
        vals[2] = this.utilitiesProvider.commonLangMsg['cr'];
      }
    }
    return vals[0] + " " + vals[2];
  }
  rounding(a, b) {
    if (b > 0)
      return Math.round(a * Math.pow(10, b)) / Math.pow(10, b);
    else
      return Math.round(Math.round(a * Math.pow(10, b)) / Math.pow(10, b));
  }
  getMonthYearDropDown() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID']
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetMonthYearList')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.dateList = response["Data"]["Table"];
        }
        this.expensesDate = [this.dateList[0]];
        this.placeDate = this.dateList[0].MonthYearDropDown;
        this.getExpenseTradeReport();
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  selectAll() {
    this.expensesDate = this.dateList;
    this.isSelectAll = false;
    this.yourSelect.close();
  }
  deselectAll() {
    this.expensesDate = [];
    this.placeDate = [];
    this.isSelectAll = true;
    this.yourSelect.close();
  }
}
