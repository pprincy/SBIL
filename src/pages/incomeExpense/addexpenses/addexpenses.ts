import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal, Content } from 'ionic-angular';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { MyApp } from '../../../app/app.component';
import { DecimalPipe } from '@angular/common';
import { AddSpendVmPage } from '../../../components/modals/add-spend-vm/add-spend-vm';
import { config } from '../../../shared/config';
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-addexpenses',
  templateUrl: 'addexpenses.html',
})
export class AddexpensesPage {
  @ViewChild(Content) content: Content;
  public pageLoader: boolean = false;
  public expenseDate: string = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
  public expensepop: boolean = false;
  public isViewMore: boolean = true;
  public isRepeating: boolean = true;
  public title;
  public amount;
  public amountComma = "0";
  public categoryId;
  public newCategory = "";
  public tagData;
  public tagArray: any = [];
  public isTagSlected: any = [];
  public isCategorySlected: any = [];
  public selectedTagId;
  public unCategorised: boolean = false;
  public expensesDate = { SMSMonth: (new Date().getMonth()) + 1, SMSYear: new Date().getFullYear() };
  public unCategoriesExpenseCount;
  public isValidAmount: boolean = false;
  public isValidCategory: boolean = false;
  public imgURL;
  public imgURLNew;
  public categoryList: any = [];
  public categoryName;
  public categoryDate;
  public categoryValue;
  public categoryMoreList: any = [];
  public isRepeat = 1;
  public repeatFreq = 'M';
  public isMonth: boolean = true;
  public isRepeatCheck: boolean = false;
  public maxDate;
  public headerTitle;
  public delete: boolean = false;
  public expenseId;
  public modal;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    private numberPipe: DecimalPipe,
    public modalCtrl: ModalController,
    public myApp: MyApp) {
    this.imgURL = this.restapiProvider.getImageURL();
    this.imgURLNew = config.imgURLNew;
  }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("60");
    this.utilitiesProvider.googleAnalyticsTrackView('Add Expense');
    var date = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
    var month = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
    this.maxDate = new Date().getFullYear() + "-" + month + "-" + date;
    this.getUnCategoriesExpense();
    this.masterCall();

    this.utilitiesProvider.upshotScreenView('AddSpend');

    $("#usertitle-editable").keyup(function(event) {
      let doc = document.getElementById('usertitle-editable')
      if (doc.innerHTML.length >= 1) {
        let range = document.createRange();
        let sel = window.getSelection();
        range.setStart(doc, 1);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        doc.focus();
      }
    });    
  }
  showPopupExpenses() {
    this.expensepop = !this.expensepop;
  }
  showMoreCategory() {
    this.isViewMore = !this.isViewMore;
  }
  showPopupDelete() {
    this.delete = false;
  }
  deletePopUp() {
    this.delete = true;
  }
  addUserExpenses(type) {
    //If Category Selected Add New category become empty
    if (this.categoryId != null && this.categoryId != undefined && this.categoryId != "") {
      this.newCategory = "";
    }
    else {
      this.categoryId = "";
    }
    //Validations
    if (this.amount == 0 || this.amount == null || this.amount == undefined) {
      this.isValidAmount = true;
      this.content.scrollToTop();
      return;
    }
    if (this.categoryId == null || this.categoryId == undefined || this.categoryId == "") {
      if (this.newCategory == undefined || this.newCategory == "") {
        this.isValidCategory = true;
        return;
      }
    }
    if (this.selectedTagId == undefined || this.selectedTagId == null) {
      this.selectedTagId = "";
    }
    if (this.title == undefined || this.title == null) {
      this.title = "";
    }
    if (this.isRepeating)
      this.isRepeat = 1
    else {
      this.isRepeat = 0;
      this.repeatFreq = ''
    }

    if(type = 'save') {
      this.setUpshotAddSpendEvent('Save');
    }
    else {
      this.setUpshotAddSpendEvent('Save And Add');
    }
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'ExpenseDate': this.expenseDate,
      'ExpenseAmount': this.amount,
      'ExpenseTitle': this.title ? this.title : 'Un-named',
      'CategoryId': this.categoryId,
      'NewCategoryName': this.newCategory,
      'SpendDetails': this.title ? this.title : 'Un-named',
      'TagId': this.selectedTagId,
      'IsRepeating': this.isRepeat,
      'RepeatFreq': this.repeatFreq,
    }
    return this.restapiProvider.sendRestApiRequest(request, 'AddUserExpenses')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          if (response.Data.Table[0].Status == 'Success') {
          }
          if (type == 'save') {
            this.amount = "";
            this.amountComma = "";
            this.title = "";
            this.newCategory = "";
            this.isTagSlected[this.selectedTagId] = false;
            this.isCategorySlected[this.categoryId] = false;
            this.navCtrl.pop();
          }
          else if (type == 'saveAdd') {
            this.amount = "";
            this.amountComma = "";
            this.title = "";
            this.newCategory = "";
            this.isTagSlected[this.selectedTagId] = false;
            this.isCategorySlected[this.categoryId] = false;
            var year = new Date().getFullYear();
            var month = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
            var date = (new Date().getDate()) < 10 ? '0' + new Date().getDate() : new Date().getDate();
            this.expenseDate = year + "-" + month + "-" + date
            this.pageLoader = true;
            setTimeout(() => {
              this.pageLoader = false;
            }, 3000)
          }
        }
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
          if (response.Data.Table1.length != 0) {
            if (response.Data.Table3.length != 0) {
              this.tagData = response.Data.Table3;
            }
            this.categoryMoreList = response.Data.Table1;
            for (var i = 0; i < 6; i++) {
              this.categoryList.push(this.categoryMoreList[i]);
            }
            // for (var i = 0; i < 8; i++) {
            //   this.categoryMoreList.shift();
            // }
            if (this.navParams.get('data').cn) {
              let data = this.navParams.get('data');
              this.selectCategory(data["ci"]);
              this.categoryId = data["ci"];
              this.categoryName = data["cn"];
              this.categoryDate = new Date(data["cd"]);
              this.categoryValue = data["cv"];
              this.title = data["cs"];
              this.headerTitle = data["cs"];
              this.expenseId = data["ei"];
              this.isRepeating = data["ir"];
              this.amount = this.categoryValue;
              this.amountComma = (this.amount ? this.amount.toLocaleString('en-IN') : "");
              var date = this.categoryDate.getDate() < 10 ? '0' + this.categoryDate.getDate() : this.categoryDate.getDate();
              var month = (this.categoryDate.getMonth() + 1) < 10 ? '0' + (this.categoryDate.getMonth() + 1) : (this.categoryDate.getMonth() + 1);
              var year = this.categoryDate.getFullYear();
              this.expenseDate = year + "-" + month + "-" + date;
              if (this.categoryId > 8) {
                this.showMoreCategory();
              }
            }
          }
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  selectCategory(catId) {
    if (this.categoryId != catId) {
      this.isValidCategory = false;
      this.newCategory = "";
      this.title = "";
      this.isCategorySlected = [];
      this.tagArray = [];
      this.isCategorySlected[catId] = true;
      this.isTagSlected[this.selectedTagId] = false;
      this.categoryId = catId;
      for (var i = 0; i < this.tagData.length; i++) {
        if (this.tagData[i]["CategoryId"] == this.categoryId) {
          this.tagArray.push(this.tagData[i]);
        }
      }
      if (catId == 0) {
        this.unCategorised = true;
      }
    }
    else {
      this.isValidCategory = false;
      this.isCategorySlected = [];
      this.isTagSlected[this.selectedTagId] = false;
      this.tagArray = [];
      this.categoryId = "";
      this.selectedTagId = "";
      this.title = "";
    }
    // this.navCtrl.();
  }
  unCategorisedPage() {
    this.navCtrl.push('UncategorisedexpensesPage');
  }
  showPopupunCategorised() {
    this.unCategorised = false;
  }
  selectTagId(tagIdArr) {
    if (tagIdArr.TagId != this.selectedTagId) {
      this.isTagSlected = [];
      this.selectedTagId = tagIdArr.TagId;
      this.title = tagIdArr.TagName;
      this.isTagSlected[tagIdArr.TagId] = true;
    }
    else {
      this.isTagSlected[tagIdArr.TagId] = false;
      this.selectedTagId = "";
      this.title = "";
    }
  }
  getUnCategoriesExpense() {
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'Month': this.expensesDate.SMSMonth,
      'Year': this.expensesDate.SMSYear,
      'LangId': localStorage.getItem('langId'),
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetUnCategoriesExpense')
      .subscribe((response) => {
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
  changeInput(param) {
    if (param == "amt") {
      this.isValidAmount = false;
    }
    if (param == "cat") {
      this.isValidCategory = false;
      this.isCategorySlected = [];
      this.isTagSlected[this.selectedTagId] = false;
      this.tagArray = [];
      this.categoryId = "";
      this.selectedTagId = "";
      this.title = "";
    }
    if (param == "spendsDetail") {
      this.isTagSlected[this.selectedTagId] = false;
      this.selectedTagId = "";
      for (let i = 0; i < this.tagArray.length; i++) {
        if (this.title.toUpperCase() == this.tagArray[i].TagName.toUpperCase()) {
          this.isTagSlected[this.tagArray[i].TagId] = true;
          this.selectedTagId = this.tagArray[i].TagId;
        }
      }
    }
  }
  freqSelect(type) {
    this.repeatFreq = type;
    this.isMonth = !this.isMonth;
  }
  repeatSelect() {
  }
  editUserExpenses() {
    if (this.categoryId != null && this.categoryId != undefined && this.categoryId != "") {
      this.newCategory = "";
    }
    else {
      this.categoryId = "";
    }
    //Validations
    if (this.amount == 0 || this.amount == null || this.amount == undefined) {
      this.isValidAmount = true;
      this.content.scrollToTop();
      return;
    }
    if (this.categoryId == null || this.categoryId == undefined || this.categoryId == "") {
      if (this.newCategory == undefined || this.newCategory == "") {
        this.isValidCategory = true;
        return;
      }
    }
    if (this.selectedTagId == undefined || this.selectedTagId == null) {
      this.selectedTagId = "";
    }
    if (this.title == undefined || this.title == null) {
      this.title = "";
    }
    if (this.isRepeating)
      this.isRepeat = 1
    else {
      this.isRepeat = 0;
      this.repeatFreq = ''
    }
    let request = {
      'CustId': this.restapiProvider.userData['CustomerID'],
      'ExpenseId': this.expenseId,
      'ExpenseDate': this.expenseDate,
      'ExpenseAmount': this.amount,
      'ExpenseTitle': this.title ? this.title : 'Un-named',
      'CategoryId': this.categoryId,
      'NewCategoryName': this.newCategory,
      'SpendDetails': this.title ? this.title : 'Un-named',
      'TagId': this.selectedTagId,
      'IsRepeating': this.isRepeat,
      'RepeatFreq': this.repeatFreq,
    }
    return this.restapiProvider.sendRestApiRequest(request, 'UpdateCustomerExpense')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
          if (response.Data.Table[0].Status == 'Success') {
          }
          this.amount = "";
          this.amountComma = "";
          this.title = "";
          this.newCategory = "";
          this.isTagSlected[this.selectedTagId] = false;
          this.isCategorySlected[this.categoryId] = false;
          this.navCtrl.pop();
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  deleteExpense() {
    let request = {
      'ExpenseId': this.expenseId,
    }
    return this.restapiProvider.sendRestApiRequest(request, 'DeleteExpense')
      .subscribe((response) => {
        if (response.IsSuccess == true) {
        }
        this.navCtrl.pop();
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  changeExpense(type) {
    if (type == 'one') {
      this.isRepeating = false;
    }
    else {
      this.isRepeating = true;
    }
  }

  setUpshotAddSpendEvent(action) {
    try{
      let CatName = "";
      this.categoryList.forEach(el => {
        if(el.CategoryId == this.categoryId) {
          CatName = el.CategoryName;
        }
      });
      let payload = {
        "Appuid": this.utilitiesProvider.upshotUserData.appUId,
        "Language": this.utilitiesProvider.upshotUserData.lang,
        "City": this.utilitiesProvider.upshotUserData.city,
        "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
        "Amount": this.amount,
        "Date": this.expenseDate,
        "Category": CatName,
        "DetailsOfSpend": this.title,
        "NatureOfExpense": this.isRepeat? 'Regular':'OneTime',
        "Action": action
      }
      this.utilitiesProvider.upshotCustomEvent('SaveSpend', payload, false);
    }
    catch(e){
      // console.log(e)
    }
  }

  formatAmount(val) {
    if(this.isValidAmount) this.isValidAmount = false;
    let amount : number = 0;
    let amountStr : string = "";
    if(val && val.trim() != "") {
      amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }
    this.amountComma = amountStr;
    this.amount = amount;
  }

//   async ViewMoreModal(){
//     this.modal = await this.modalCtrl.create({
//       component: AddSpendVmPage,
//       // componentProps: { mySubject },
//       showBackdrop: true,
//       enableBackdropDismiss: true,
    

//     });
//    await this.modal.present();
//  }

 async ViewMoreModal(){
  this.modal = await this.modalCtrl.create(
    AddSpendVmPage,
   { customerList: this.categoryMoreList },
   {
     showBackdrop: true,
     enableBackdropDismiss: true,
   },
   
 );

 this.modal.onDidDismiss(catId => {
  console.log("#############  Retrieving Data ###############",catId);
  if (this.categoryId != catId) {
    this.isValidCategory = false;
    this.newCategory = "";
    this.title = "";
    this.isCategorySlected = [];
    this.tagArray = [];
    this.isCategorySlected[catId] = true;
    this.isTagSlected[this.selectedTagId] = false;
    this.categoryId = catId;
    for (var i = 0; i < this.tagData.length; i++) {
      if (this.tagData[i]["CategoryId"] == this.categoryId) {
        this.tagArray.push(this.tagData[i]);
      }
    }
    if (catId == 0) {
      this.unCategorised = true;
    }
  }
  else {
    this.isValidCategory = false;
    this.isCategorySlected = [];
    this.isTagSlected[this.selectedTagId] = false;
    this.tagArray = [];
    this.categoryId = "";
    this.selectedTagId = "";
    this.title = "";
  }
});
 await this.modal.present();
}
}
