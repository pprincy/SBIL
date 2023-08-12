import { Component, ViewChild } from '@angular/core';
import { IonicPage, Modal, ModalController, NavController, NavParams, Platform, Slides } from 'ionic-angular';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import * as $ from 'jquery';
import { DecimalPipe } from '@angular/common';
import { CalendarPage } from '../../../../components/modals/calendar/calendar';
import { Keyboard } from '@ionic-native/keyboard';

@IonicPage()
@Component({
  selector: 'page-hlv-calculator',
  templateUrl: 'hlv-calculator.html',
})
export class HlvCalculatorPage {
  @ViewChild(Slides) slides: Slides;

  public isBtnActive: boolean = false;
  public isStarted: boolean = false;
  public stage: string = 'intro';
  public name: string = '';
  public age: number = 0;
  public dob: any;
  public gender: string = '';
  public steps = 100;
  public minMonthlyIncome;
  public maxMonthlyIncome;
  public monthlyIncome = 10000;
  public monthlyIncomeComma = "₹" + "10,000";
  public spouseMonthlyIncome = 10000;
  public spouseMonthlyIncomeComma = "₹" + "10,000";
  public minMonthlyExpenses;
  public maxMonthlyExpenses;
  public monthlyExpenses = 5000;
  public monthlyExpensesComma = "₹" + "5,000";
  public minLiability = 1;
  public maxLiability = 5000000;
  public liabilityAmt = 1000;
  public liabilityAmtComma = "₹" + "1,000";
  public minInsuranceAmt = 1;
  public maxInsuranceAmt = 5000000;
  public insuranceAmount = 1000;
  public insuranceAmountComma = "₹" + "1,000";
  public maritalStatus = "";
  public spouseEarningStatus = "";
  public insuranceStatus = "";
  public pageFrom;
  public pageLoader: boolean = false;
  public ageError: boolean = false;
  public modal: Modal;
  public keyboardShow = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    private numberPipe: DecimalPipe,
    public modalCtrl: ModalController,
    public platform: Platform,
    private keyboard: Keyboard
    ) {
      this.utilitiesProvider.defaultGoalData = this.utilitiesProvider.defaultData.Item2.goals.family_protection;
      this.minMonthlyIncome = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_income.min);
      this.maxMonthlyIncome = parseInt(this.utilitiesProvider.defaultGoalData.data.monthly_income.max);

      this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item2.goals.retirement;
      this.minMonthlyExpenses = parseInt(this.utilitiesProvider.defaultGoalData.data.curr_mnthly_exp.min);
      this.maxMonthlyExpenses = parseInt(this.utilitiesProvider.defaultGoalData.data.curr_mnthly_exp.max);

      this.pageFrom = this.navParams.get('pageFrom');

      this.keyboard.onKeyboardShow().subscribe(data => {
        this.keyboardShow = true;
      });
      this.keyboard.onKeyboardHide().subscribe(data => {
        this.keyboardShow = false;
      });

      this.platform.ready().then(()=>{
        this.backSubs = this.platform.backButton.subscribe(() => {
          console.log('Handler was called!');
          return false;
          // if(this.stage == "intro") {
          //   this.navCtrl.pop();
          // } else {
          //   this.back();
          // }
        });
      });
  }

  public backSubs;
  ionViewDidLeave() {
    if(this.backSubs) this.backSubs.unsubscribe();
  }

  ionViewDidEnter() {
    this.slides.lockSwipes(true);
    this.slides.update();
    this.dob = this.restapiProvider.userData['dob'].split('-').reverse().join('-');
    this.setAge();
    console.log('ionViewDidEnter HlvCalculatorPage');
    this.utilitiesProvider.upshotScreenView('HLVCalculator');
  }

  next() {
    let currIndex = this.slides.getActiveIndex();

    if(this.stage === 'intro') {
      this.isStarted = true;
      this.stage = "enterName";
      this.gotToSlide(1, 500);
    }
    else if (this.stage === 'enterName') {
      if(this.name && this.name.trim()) {
        this.stage = "enterDOB";
        this.gotToSlide(2, 500);
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterName'])
      }
    }
    else if (this.stage === 'enterDOB') {
      if(this.dob && !this.ageError) {
        this.stage = "enterGender";
        this.gotToSlide(3, 500);
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['enterValidDOB'])
      }
    }
    else if (this.stage === 'enterGender') {
      if(this.gender) {
        this.stage = "enterIncome";
        this.gotToSlide(4, 500);
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseSelectGender'])
      }
    }
    else if (this.stage === 'enterIncome') {
      if(this.monthlyIncome > 0) {
        this.stage = "enterExpense";
        this.gotToSlide(5, 500);
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterAmount'])
      }
    }
    else if (this.stage === 'enterExpense') {
      if(this.monthlyExpenses >= 0) {
        this.stage = "enterLiability";
        this.gotToSlide(6, 500);
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterAmount'])
      }
    }
    else if (this.stage === 'enterLiability') {
      if(this.liabilityAmt >= 0) {
        this.stage = "maritalStatus";
        this.gotToSlide(7, 500);
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterAmount'])
      }
    }
    else if (this.stage === 'maritalStatus') {
      if(this.maritalStatus) {
        if(this.maritalStatus == 'Married') {
          this.stage = "spouseEarningStatus";
          this.spouseEarningStatus = "Earning";
          this.gotToSlide(8, 500);
        }
        else {
          this.stage = "insuranceStatus";
          this.gotToSlide(9, 0);
        }
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseSelectRelationship'])
      }
    }
    else if (this.stage === 'spouseEarningStatus') {
      if(this.spouseEarningStatus) {
        if(this.spouseEarningStatus == 'Earning') {
          this.stage = "insuranceStatus";
          this.gotToSlide(9, 500);
        }
        else {
          this.stage = "insuranceStatus";
          this.gotToSlide(9, 500);
        }
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseSelectSpouseEarning'])
      }
    }
    else if (this.stage === 'spouseEarning') {
      if(this.spouseMonthlyIncome > 0) {
        this.stage = "insuranceStatus";
        this.gotToSlide(10, 500);
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterAmount'])
      }
    }
    else if (this.stage === 'insuranceStatus') {
      if(this.insuranceStatus) {
        if(this.insuranceStatus == 'Insured') {
          this.stage = "insuranceCoverAmount";
          this.gotToSlide(11, 500);
        }
        else {
          //Final Redirection COde
          this.getFinalHLVResult();
        }
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseSelectInsuranceStatus'])
      }
    }
    else if (this.stage === 'insuranceCoverAmount') {
      if(this.insuranceAmount > 0) {
        //Final Redirection COde
        this.getFinalHLVResult();
      }
      else {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterAmount'])
      }
    }
  }

  getFinalHLVResult() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "Name": this.name ? this.name.trim() : "",
      "DOB": this.dob || "",
      "Age": this.age || 0,
      "Gender": this.gender,
      "MonthlyIncome": this.monthlyIncome || 0,
      "MonthlyExpenses": this.monthlyExpenses || 0,
      "Liabilities":this.liabilityAmt || 0,
      "MaritalStatus": this.maritalStatus || "",
      "SpouseEarningStatus": this.maritalStatus == 'Married' ? this.spouseEarningStatus : "",
      "SpouseMonthlyIncome": this.maritalStatus == 'Married' && this.spouseEarningStatus == 'Earning' ? this.spouseMonthlyIncome : 0,
      "InsuranceStatus": this.insuranceStatus || "",
      "CurrentInsuranceCover": this.insuranceStatus == 'Insured' ? this.insuranceAmount : 0
    }

    this.restapiProvider.sendRestApiRequest(request, 'GetHLVValues')
    .subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        // let response = {
        //   Data: {
        //     "Name": "Adnan",
        //     "DOB": "1995-09-14",
        //     "Age": "27",
        //     "Gender": "Male",
        //     "MonthlyIncome": "58000",
        //     "MonthlyExpenses": "33000",
        //     "Liabilities": "151234",
        //     "MaritalStatus": "Single",
        //     "SpouseEarningStatus": "",
        //     "SpouseMonthlyIncome": "0",
        //     "InsuranceStatus": "Insured",
        //     "CurrentInsuranceCover": "3000000",
        //     "FinalIncome": "58000",
        //     "FinalExpenditure": "33000",
        //     "FinalLiability": "151234",
        //     "FinalInsuranceCover": "3000000",
        //     "FinalHLVValue": 10591234.0,
        //     "HappinessCoverPerc": 30
        // }
        // }
        // console.log("HLV response", response.Data)
        this.navCtrl.push('HlvFinalPage', { data: response.Data, pageFrom: this.pageFrom })
      }
      else {
        this.restapiProvider.presentToastTop(response.Message);
      }
    },
      (error) => {
        this.pageLoader = false;
        this.restapiProvider.presentToastTop("Something wents wrong!");
      })
  }

  toggleClass(id) {
    $('#' + id).toggleClass('active');
  }

  back() {
    if(this.stage === 'enterName') {
      this.isStarted = false;
      this.stage = "intro";
      this.gotToSlide(0, 500);
    }
    else if(this.stage === 'enterDOB') {
      this.stage = "enterName";
      this.gotToSlide(1, 500);
    }
    else if(this.stage === 'enterGender') {
      this.stage = "enterDOB";
      this.gotToSlide(2, 500);
    }
    else if(this.stage === 'enterIncome') {
      this.stage = "enterGender";
      this.gotToSlide(3, 500);
    }
    else if(this.stage === 'enterExpense') {
      this.stage = "enterIncome";
      this.gotToSlide(4, 500);
    }
    else if(this.stage === 'enterLiability') {
      this.stage = "enterExpense";
      this.gotToSlide(5, 500);
    }
    else if(this.stage === 'maritalStatus') {
      this.stage = "enterLiability";
      this.gotToSlide(6, 500);
    }
    else if(this.stage === 'spouseEarningStatus') {
      this.stage = "maritalStatus";
      this.gotToSlide(7, 500);
    }
    else if(this.stage === 'spouseEarning') {
      this.stage = "spouseEarningStatus";
      this.gotToSlide(8, 500);
    }
    else if(this.stage === 'insuranceStatus') {
      if(this.maritalStatus == 'Single') {
        this.stage = "maritalStatus";
        this.gotToSlide(7, 0);
      }
      else if(this.spouseEarningStatus == 'NotEarning') {
        this.stage = "spouseEarningStatus";
        this.gotToSlide(8, 0);
      }
      else {
        this.stage = "spouseEarning";
        this.gotToSlide(9, 500);
      }
    }
    else if(this.stage === 'insuranceCoverAmount') {
      this.stage = "insuranceStatus";
      this.gotToSlide(10, 500);
    }
  }

  gotToSlide(index, speed) {
    this.slides.lockSwipes(false);
    this.slides.slideTo(index, speed);
    this.slides.lockSwipes(true);
  }

  setAge() {
    this.age = this.calcAge(this.dob)
  }
  calcAge(dateString) {
    let birthday = +new Date(dateString);
    let age = ~~((Date.now() - birthday) / (31557600000));
    if(age < 18 || age > 65) {
      this.ageError = true;
    }
    else {
      this.ageError = false;
    }

    return age;
  }

  selectGender(gender) {
    this.gender = gender;
  }

  selectMaritalStatus(status) {
    this.maritalStatus = status;
  }

  selectSpouseEarningStatus(status) {
    this.spouseEarningStatus = status;
  }

  selectInsuranceStatus(status) {
    this.insuranceStatus = status;
  }

  checkSteps(type) {
    switch (type) {
      case 'monthlyIncome':
        if (this.monthlyIncome >= (this.maxMonthlyIncome / 3) && this.monthlyIncome <= (this.maxMonthlyIncome / 2)) {
          this.steps = 1000;
        }
        else if (this.monthlyIncome >= (this.maxMonthlyIncome / 2)) {
          this.steps = 2000;
        }
        this.monthlyIncomeComma = "₹" + (this.numberPipe.transform(this.monthlyIncome));
        break;

      case 'monthlyExpense':
        if (this.monthlyExpenses >= (this.maxMonthlyExpenses / 3) && this.monthlyExpenses <= (this.maxMonthlyExpenses / 2)) {
          this.steps = 1000;
        }
        else if (this.monthlyExpenses >= (this.maxMonthlyExpenses / 2)) {
          this.steps = 2000;
        }
        this.monthlyExpensesComma = "₹" + (this.numberPipe.transform(this.monthlyExpenses));
        break;

      case 'liability':
        if (this.liabilityAmt >= (this.maxLiability / 3) && this.liabilityAmt <= (this.maxLiability / 2)) {
          this.steps = 1000;
        }
        else if (this.liabilityAmt >= (this.maxLiability / 2)) {
          this.steps = 2000;
        }
        this.liabilityAmtComma = "₹" + (this.numberPipe.transform(this.liabilityAmt));
        break;

      case 'spouseIncome':
        if (this.spouseMonthlyIncome >= (this.maxMonthlyIncome / 3) && this.spouseMonthlyIncome <= (this.maxMonthlyIncome / 2)) {
          this.steps = 1000;
        }
        else if (this.spouseMonthlyIncome >= (this.maxMonthlyIncome / 2)) {
          this.steps = 2000;
        }
        this.spouseMonthlyIncomeComma = "₹" + (this.numberPipe.transform(this.spouseMonthlyIncome));
        break;

      case 'insurance':
        if (this.insuranceAmount >= (this.maxInsuranceAmt / 3) && this.insuranceAmount <= (this.maxInsuranceAmt / 2)) {
          this.steps = 1000;
        }
        else if (this.insuranceAmount >= (this.maxInsuranceAmt / 2)) {
          this.steps = 2000;
        }
        this.insuranceAmountComma = "₹" + (this.numberPipe.transform(this.insuranceAmount));
        break;

      default:
        break;
    }
  }

  formatAmount(val, type) {
    let amount : number = 0;
    let amountStr : String = "";
    if(val && val.trim() != "₹") {
      amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }
    if(type == "income") {
      this.monthlyIncomeComma = "₹" + amountStr;
      this.monthlyIncome = amount;
    }
    else if(type == "expense") {
      this.monthlyExpensesComma = "₹" + amountStr;
      this.monthlyExpenses = amount;
    }
    else if(type == "liability") {
      this.liabilityAmtComma = "₹" + amountStr;
      this.liabilityAmt = amount;
    }
    else if(type == "spouseIncome") {
      this.spouseMonthlyIncomeComma = "₹" + amountStr;
      this.spouseMonthlyIncome = amount;
    }
    else if(type == "insurance") {
      this.insuranceAmountComma = "₹" + amountStr;
      this.insuranceAmount = amount;
    }
  }

  async openCalendar() {
    let fromDate  = new Date();
    let toDate  = new Date();
    let selectedDate  = new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 65);
    toDate.setFullYear(toDate.getFullYear() - 18);
    if(this.dob) {
      selectedDate = new Date(this.dob);
    } else {
      selectedDate = toDate;
    }
    
    this.modal = this.modalCtrl.create(
      CalendarPage,
      {
        fromDate: fromDate,
        toDate: toDate,
        selectedDate: selectedDate
      },
      {
        showBackdrop: true,
        enableBackdropDismiss: true,
      }
    );
    await this.modal.present();

    this.modal.onDidDismiss((data) => {
      if(data != null) {
        let date = data.getDate() > 9 ? data.getDate().toString() : '0'+data.getDate();
        let month = (data.getMonth()+1) > 9 ? (data.getMonth()+1).toString() : '0'+(data.getMonth()+1);
        this.dob = data.getFullYear() +"-"+ month +"-"+ date;
      }
    });
  }
}
