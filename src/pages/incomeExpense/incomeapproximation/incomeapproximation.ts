import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { MyApp } from '../../../app/app.component';
import { DecimalPipe } from '@angular/common';
import { DropDowmSelctionPage } from '../../../components/modals/drop-dowm-selction/drop-dowm-selction';
import { config } from '../../../shared/config';
@IonicPage()
@Component({
  selector: 'page-incomeapproximation',
  templateUrl: 'incomeapproximation.html',
})
export class IncomeapproximationPage {
  public expensepop: boolean = false;
  public pageLoader: boolean = true;
  public incomeApprox;
  public categoryId;
  public assignValue = 100;
  public assignValueComma = "100";
  public showCategoryName;
  public imgURLNew;
  public dateParam: any;
  public minAmount = 0;
  public maxAmount = 100000;
  public isValidAmount: boolean = false;
  public allCategories;
  public budgetCategory;
  public resetStatus: boolean = false;
  public expensesDate = { SMSMonth: (new Date().getMonth()) + 1, SMSYear: new Date().getFullYear() };
  public dateList: any;
  public placeDate;
  public categoryDate;
  public totalBudget;
  public modal;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public utilitiesProvider: UtilitiesProvider,
    public restapiProvider: RestapiProvider,
    private numberPipe: DecimalPipe,
    public myApp: MyApp,
    public modalCtrl: ModalController) {
    this.imgURLNew = config.imgURLNew;
  }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("63");
    this.utilitiesProvider.googleAnalyticsTrackView('Set Budget');
    this.dateParam = this.navParams.get('data');
    this.getMonthYearDropDown(this.dateParam.MonthYearDropDown);

    this.getIncomeExpenses();
    setTimeout(() => {
      this.pageLoader = false;
    }, 1000)
  }
  showPopupExpenses(CategoryName, CategoryId, CategoryBudget) {
    this.expensepop = !this.expensepop;
    this.showCategoryName = CategoryName;
    this.categoryId = CategoryId;
    this.assignValue = Math.round(CategoryBudget);
    this.assignValueComma = this.assignValue ? this.numberPipe.transform(this.assignValue) : "0";
  }
  newValue() {
    if (this.assignValue < this.minAmount || this.assignValue > this.maxAmount) {
      this.isValidAmount = true;
      return;
    }
    this.addCategoryBudget();
    this.ionViewDidLoad();
    this.expensepop = false;
  }
  goToIncomeDashboard() {
    this.navCtrl.pop();
  }
  expenceReport(date) {
    this.dateParam = date;
    let request = {
      'LangId': localStorage.getItem('langId'),
      'Month': this.dateParam.SMSMonth,
      'Year': this.dateParam.SMSYear,
      'CustId': this.restapiProvider.userData['CustomerID'],
    }
    return this.restapiProvider.sendRestApiRequest(request, 'ExpenceReport')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          this.incomeApprox = response["Data"]["Table"];
          this.totalBudget = response["Data"]["Table2"][0]["TotalBudget"];
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  addCategoryBudget() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'CategoryId': this.categoryId,
      'BudgetValue': this.assignValue,
    }
    return this.restapiProvider.sendRestApiRequest(request, 'AddCategoryBudget')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          if (response.Data.Table[0].Status == 'Success') {
          }
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
  resetBudget(CategoryId, CategoryName) {
    this.categoryId = ""
    this.assignValue = 0;
    this.assignValueComma = "0";
    this.categoryId = CategoryId;
    this.budgetCategory = CategoryName;
    this.resetStatus = true;
  }
  resetCatBudget(type) {
    if (type == 'yes') {
      this.addCategoryBudget();
      this.ionViewDidLoad();
    }
    else {
      this.resetStatus = false;
    }
    this.resetStatus = false;
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
        this.expenceReport(this.dateList[index]);
        this.expensesDate = date;
        this.placeDate = date;
      },
        (error) => {
          this.pageLoader = false;
        })
  }

  formatAmount(val) {
    this.assignValueComma = val ? this.numberPipe.transform(val.toString().replaceAll(",", "")) : "";
    this.assignValue = val ? val.toString().replaceAll(",", "") : "";
  }

  formatAmountRange(val) {
    this.assignValueComma = this.numberPipe.transform(val);
  }

  async MonthListExpenseReview(){
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
          this.expenceReport(element);
        }
        
      }); 
        
    })

  }
}

