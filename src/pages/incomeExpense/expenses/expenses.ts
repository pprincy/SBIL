import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import * as HighCharts from 'highcharts';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { TranslateService } from '@ngx-translate/core';
import { MyApp } from '../../../app/app.component';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { DropDowmSelctionPage } from '../../../components/modals/drop-dowm-selction/drop-dowm-selction';
import { config } from '../../../shared/config';
@IonicPage()
@Component({
  selector: 'page-expenses',
  templateUrl: 'expenses.html',
})
export class ExpensesPage {
  public expenseCategory;
  public totalSpends;
  public expenseCat: any = [];
  public expenseCatVal: any = [];
  public expenseChartData: any = [];
  public expensesDate = { SMSMonth: (new Date().getMonth()) + 1, SMSYear: new Date().getFullYear() };
  public dateList: any;
  public getDate: Date = new Date();
  public totalExpense;
  public isExpensesData: boolean = false;
  public pageLoader: boolean = true;
  public imgURLNew;
  public placeDate;
  public dateParam;
  public chartColor: any = [];
  public selectedDate: any;
  public noPageData: boolean = false;
  public totalSpendsText;
  public modal;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public restapiProvider: RestapiProvider,
    public translateService: TranslateService,
    public myApp: MyApp,
    public utilitiesProvider: UtilitiesProvider,
    public modalCtrl: ModalController) {
    this.imgURLNew = config.imgURLNew;
  }
  ionViewDidEnter() {
    if (localStorage.getItem("dateStateObj")) {
      var catDate = JSON.parse(localStorage.getItem("dateStateObj")).categoryReport
      this.expenceCategoryReport(catDate);
      this.expensesDate = catDate.MonthYearDropDown
    }
    this.translateService.get('incomeDashboard.totalSpends').subscribe(
      value => {
        this.totalSpendsText = value;
      }
    )

    this.utilitiesProvider.upshotScreenView('SpendList');
  }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("61");
    this.utilitiesProvider.googleAnalyticsTrackView('Expense Listing');
    this.dateParam = this.navParams.get('data');
    this.getMonthYearDropDown(this.dateParam);
  }
  expenceCategoryReport(date) {
    this.pageLoader = true;
    this.selectedDate = date;
    if (localStorage.getItem("dateStateObj")) {
      var dateObj = JSON.parse(localStorage.getItem("dateStateObj"))
      dateObj.categoryReport = this.selectedDate;
      localStorage.setItem("dateStateObj", JSON.stringify(dateObj));
    }
    let request = {
      'LangId': localStorage.getItem('langId'),
      'Month': date.SMSMonth,
      'Year': date.SMSYear,
      'CustId': this.restapiProvider.userData['CustomerID'],
    }
    return this.restapiProvider.sendRestApiRequest(request, 'ExpenceReport')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          if (response.Data.Table.length != 0 && response.Data.Table2.length != 0) {
            this.expenseChartData = [];
            this.expenseCategory = [];
            this.chartColor = [];
            for (var i = 0; i < response["Data"]["Table"].length; i++) {
              this.expenseCat[i] = response.Data.Table[i]["CategoryName"];
              this.expenseCatVal[i] = response.Data.Table[i]["Expense"];
              this.chartColor[i] = response.Data.Table[i]["CategoryColorCode"];
              this.expenseChartData.push([this.expenseCat[i], this.expenseCatVal[i]]);
            }
            this.expenseCategory = response["Data"]["Table"];
            if (response.Data.Table[0].Status == 'Success') {
            }
            if (response.Data.Table2[0]["TotalExpense"]) {
              this.totalExpense = ((response.Data.Table2[0]["TotalExpense"]) == null ? 0 : (response.Data.Table2[0]["TotalExpense"]).toLocaleString(('en-IN')));
            }
            if (response.Data.Table.length != 0) {
              if (response.Data.Table2[0]["TotalExpense"] !== null) {
                this.totalExpenses();
                this.isExpensesData = true;
                this.noPageData = true;
              }
              else {
                this.isExpensesData = false;
                this.noPageData = false;
              }
            }
            //If No Data
            else {
              this.isExpensesData = false;
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
          this.pageLoader = false;
        })
  }
  totalExpenses() {
    var myExpenses = HighCharts.chart('total_expenses_new', {
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
        text: '<div class="chart_total_exp"><h5>' + this.totalSpendsText + '</h5><div class="chart_total_val"><span class="icon-Icons_Ruppee"></span>' + this.totalExpense + '</div></div>',
        useHTML: true,
        align: 'center',
        verticalAlign: 'middle',
        y: -3
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>',
        outside: true
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
          }
        }
      },
      colors: this.chartColor,
      series: [{
        type: 'pie',
        name: '',
        size: '96%',
        innerSize: '80%',
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
              var index = i;
            }
          }
          this.placeDate = response.Data.Table[0]["MonthYearDropDown"];
        }

        this.expenceCategoryReport(this.dateList[index]);
        this.expensesDate = date;
        this.placeDate = date;
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  expenseListingPage(categoryName, categoryId) {
    let categorylisting = { cn: categoryName, ci: categoryId, cd: this.selectedDate }
    if (categoryId !== null) {
      this.navCtrl.push('ExpenseListingPage', { data: categorylisting });
    }
    else {
      this.navCtrl.push('UncategorisedexpensesPage', { data: categorylisting });
    }
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
          this.expenceCategoryReport(element);
        }
        
      }); 
        
    })

  }
}
