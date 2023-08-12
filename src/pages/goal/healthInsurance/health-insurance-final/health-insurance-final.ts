import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, LoadingController, MenuController , Slides, Platform} from 'ionic-angular';
import * as HighCharts from 'highcharts';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { MyApp } from '../../../../app/app.component';
import { ngModuleJitUrl } from '@angular/compiler';
import { DecimalPipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-health-insurance-final',
  templateUrl: 'health-insurance-final.html',
})
export class HealthInsuranceFinalPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  brightness;
  public steps = 100;
  public amountD1;
  public amountD2;
  public minValue;
  public maxValue;
  public isBtnActive: boolean = false;
  public status: boolean = false;
  public Daughter1: any = {};
  public Daughter2: any = {};
  public paramsData: any;
  public loading: any;
  public timerStart: boolean = false;
  public timer: any;
  public graphData: any = {};
  public rangeDataUi: any = {};
  public finalValue: any = {};
  public comparePopup: any = false;
  public annuity: any = false;
  public disclaimer: any = false;
  public riskData: any = [];
  public pageLoader: boolean = false;
  public selectedDrop; msaMin; msaMax; msaValue; headerYear;
  public minMonthlyIncome; public maxMonthlyIncome; public monthlyIncome;
  public minMonthlyExpenses; public maxMonthlyExpenses; public monthlyExpenses;
  public saveGoalPopup: boolean = false;
  public showAdb: boolean = true;
  public showTpd: boolean = true;
  public top = 0;
  public type;
  public sliderCount = 1;
  public cardOneImg;
  public responseData : any = {};
  public existingCover;
  public existingCoverComma;
  public faimlyExistingCover;
  public faimlyExistingCoverComma;
  public requestData : any = {};
  public FamilyCoverReq ;
  public popupShow : boolean = false;
  public popupText;
  public showForword : boolean = false;
  public maxValueSelf : any = 1000000;
  public maxRangeValueParent : any = 1000000;
  public drivenFrom;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public utilitiesProvider: UtilitiesProvider,
    private restapiProvider: RestapiProvider,
    private loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    private numberPipe: DecimalPipe,
    public myApp: MyApp,
    public plt: Platform) {
      this.type = this.navParams.get('data').type;
      this.cardOneImg = this.navParams.get('data').cardOneImg;
      this.responseData = this.navParams.get('data').response;
      this.requestData = this.navParams.get('data').request;
      this.maxValueSelf = this.navParams.get('data').response.Table[0].ExistingCover + this.navParams.get('data').response.Table[0].SelfSpouseHealthCover;
      this.maxRangeValueParent = this.navParams.get('data').response.Table[0].ParentHealthCover;
      this.existingCover =  this.responseData.Table[0].ExistingCover;
      
      let amount : number = 0;
    let amountStr : String = "";
    if(this.existingCover) {
      amount = Number(this.existingCover.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }
      this.existingCoverComma = "₹" + amountStr;
      //this.faimlyExistingCover = this.responseData.Table[0].ParentHealthCover;
      this.faimlyExistingCover = 0;
      this.faimlyExistingCoverComma = "₹" ;
      this.FamilyCoverReq = this.responseData.Table[0].FamilyCoverReq;

      this.drivenFrom = this.navParams.get('drivenFrom');
  }


  sliderCountFunction(t){
    
  
  if(t == 'back'){
    this.sliderCount--;
    if(this.type == "YES"){
      this.showForword = true;
    }
  }
  else{
    if(this.navParams.get('data').isFatherMother == "YES"){
      if(this.sliderCount != 4){
        this.sliderCount++;
        for (let i = 0; i < this.responseData.Table1.length; i++) {
          if(this.responseData.Table1[i].RelationShip == "Father" || this.responseData.Table1[i].RelationShip == "Mother"){
           if(this.sliderCount == 4){
            this.showForword = false;
           }
           else{
            this.showForword = true;
           }
          }        
        }
      }
    }
    else{
      this.sliderCount = 2;
      for (let i = 0; i < this.responseData.Table1.length; i++) {
        if(this.responseData.Table1[i].RelationShip == "Father" || this.responseData.Table1[i].RelationShip == "Mother"){
          this.showForword = true;
        }        
      }
     
    }
  }

 setTimeout(() => {
  this.rangeSliderExistingCover(this.existingCover, "fromJs");
  this.rangeSliderFaimlyExistingCover(this.faimlyExistingCover, "fromJs");
  $( ".ba-slider,.critical_single,.critical_slider_list" ).animate({
    opacity: 1
  }, 1000);
 }, 200);
}

  // scrollToTop() {
  //   // setTimeout(() => {
  //   //   this.cssCahnge();
  //   // }, 1000);
  // }

  // cssCahnge() {
  //   if(this.type == "YES"){
  //   if($('.ba-slider').offset() == undefined)
  //   {
  //     if (this.top < $('.critical_slider_list').offset().top) {
  //       $('.networth_details').removeClass('shrink');
  //       setTimeout(function () {
  //       }, 100);
  
  //     }
     
  //     else {
  //       $('.networth_details').addClass('shrink');
  //       setTimeout(function () {
  //         var hedaerheight = $('.shrink').parent().outerHeight();
  //       }, 100);
  //     }
  //   }

  //   else{
  //     if (this.top < $('.ba-slider').offset().top) {
  //       $('.networth_details').removeClass('shrink');
  //       setTimeout(function () {
  //       }, 100);
  
  //     }
  //     else {
  //       $('.networth_details').addClass('shrink');
  //       setTimeout(function () {
  //         var hedaerheight = $('.shrink').parent().outerHeight();
  //       }, 100);
  //     }
  //   }
  // }
  // }
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("57");
    this.utilitiesProvider.googleAnalyticsTrackView('Health Insurance');
    if( this.sliderCount == 1 )
    {
      $( ".ba-slider,.critical_single,.critical_slider_list" ).animate({
        opacity: 1
      }, 1500);
    }
    // this.brightness = 0;
    // $('.resize').css('width',  this.brightness + '%');
    this.slides.lockSwipes(true);
    $('.swiper-pagination-bullet').hide();
    // this.scrollToTop();
    // this.content.ionScroll.subscribe((data) => {
    //   if (data) {
    //     this.top = data.scrollTop;
    //     this.cssCahnge();
    //   }
    // });

    // this.content.ionScrollStart.subscribe((data) => {
    //   if (data) {
    //     this.top = data.scrollTop;
    //     this.cssCahnge();
    //   }
    // });

    this.rangeSliderExistingCover(this.existingCover, "fromJs");
    this.rangeSliderFaimlyExistingCover(this.faimlyExistingCover, "fromJs")
  }
  annutiyInfo() {
    this.annuity = !this.annuity;
    if (this.annuity == true) {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
  }

  disclaimerInfo() {
    this.disclaimer = !this.disclaimer;
    if (this.disclaimer == true) {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
  }

  annuityClose() {
    this.annuity = !this.annuity;
    if (this.annuity == false) {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
    }

  }

  disclaimerClose() {
    this.disclaimer = !this.disclaimer;

    if (this.disclaimer == false) {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
    }
  }

 
  menuToggle() {
    this.menuCtrl.open();
  }
  toggleClass(id) {
    $('#' + id).toggleClass('active')
  }
  riskProfileFun() {
   
  }

  assetAllocation() {
    this.comparePopup = true;
    if (this.comparePopup == true) {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
  }

  showOverlay(type){
    this.status = !this.status;
    if(this.status == true)
    {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }

    this.selectedDrop = type;
    if(type === 'age'){
      this.utilitiesProvider.rangeData = this.responseData.Table[0].SelfAge;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.responseData.Table[0].SelfAge,
        "min" :  1,
        "max" :  60,
        "title" :this.utilitiesProvider.commonLangMsg['age'],
        "type" : "",
        "info" : ""
      }
    }
    if(type === 'monthlyIncome'){
      this.utilitiesProvider.rangeData = this.responseData.Table[0].SelfIncome;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.responseData.Table[0].SelfIncome,
        "min" :  1,
        "max" :  10000000,
        "title" :this.utilitiesProvider.langJsonData['healthInsuranceGoal']['monthlyIncome'],
        "type" : "r",
        "info" : ""
      }
    }

    
 }

 done(){
  let d = parseInt(this.utilitiesProvider.rangeData);
  if(d < parseInt(this.rangeDataUi.min) || d > parseInt(this.rangeDataUi.max)){
    this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterNumberBetween'] + " " + this.rangeDataUi.min + this.utilitiesProvider.jsErrorMsg['to'] + this.rangeDataUi.max)
  }
   else{
  if(this.selectedDrop == "age"){
    this.status = !this.status;
    this.responseData.Table[0].SelfAge = this.utilitiesProvider.rangeData;
    this.requestData.Age = this.responseData.Table[0].SelfAge;
    this.getGoalResult('done');
  }
  if(this.selectedDrop == "monthlyIncome"){
    this.status = !this.status;
    this.responseData.Table[0].SelfIncome = this.utilitiesProvider.rangeData;
    this.finalValue.Income = this.utilitiesProvider.rangeData;
     this.getGoalResult('done');
    }
  }
}



  replan() {
    this.setUpshotEvent('Replan', 'No')
    this.navCtrl.setRoot('HealthInsurancePage', { pageFrom: this.drivenFrom})
  }
  takeScreenshot() {
    // this.utilitiesProvider.screenShotURI();
    this.content.scrollToTop();
    this.pageLoader = true;
    setTimeout(() => {
      this.utilitiesProvider.htmlToCanvas("capture-healthinsurance").then(result => {
        setTimeout(() => {
          this.pageLoader = false;
        }, 1500);
      })
    }, 1000);

    this.utilitiesProvider.setUpshotShareEvent('Goal', 'Health Insurance Goal');
  }
  yearCal() {
    let headYear = new Date().getFullYear();
    this.headerYear = headYear + this.finalValue.TimeToInvest;
  }



  goNotificationList() {
    this.navCtrl.push('NotificationPage');
  }

  goToArticles() {
    this.saveGoalPopup = !this.saveGoalPopup;
  }

     
  saveFunction(type){
    if(type == "dont"){
        this.saveGoalPopup = ! this.saveGoalPopup;

        this.setUpshotEvent('Read Articles', 'No')

        this.navCtrl.setRoot('ArticlesPage',{source: 'Collections', header: 'Family Protection', categoryID: 4});
     }
    else{
      this.setUpshotEvent('Read Articles', 'Yes')
      this.insertUserGoal();
    }
  }




  insertUserGoal() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenID": this.restapiProvider.userData['tokenId'],
      "GoalName": "Health Insurance",
      "GoalTypeID": "8",
      "CurrentAmount": this.responseData.Table[0].Income,
      "Period": this.responseData.Table[0].SelfAge,
      "LumpsumAvailable": this.responseData.Table[0].ExistingCover,
      "Inflation": null,
      "IncrementalSavings": null,
      "LumpsumCompound": this.responseData.Table[0].faimlyExistingCover,
      "RiskProfile": null,
      "EMIInterest": null,
      "FVGoal": null,
      "FVDownPayment": null,
      "RequiredDownpayment": this.responseData.Table[0].TotalHealthCover,
      "MonthlySavingsRequired": null,
      "DownPaymentPerc": null,
      "LoanAmount":null,
      "LoanDuration": null,
    }
ngModuleJitUrl
    return this.restapiProvider.sendRestApiRequest(request, 'InsertUserGoal').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.langJsonData['common']['goalSavedSuccessfully']);
        this.saveGoalPopup = !this.saveGoalPopup;
        this.navCtrl.setRoot('ArticlesPage', { source: 'Collections', header: this.utilitiesProvider.langJsonData['familyProtection']['familyProtection'], categoryID: 4 });
      }
    },
      (error) => {
        this.pageLoader = false;
      })
  }






  rangeSlide(){
    this.getGoalResult('');
  }
  getGoalResult(fromEvent){
    if(this.status == false)
    {
     $('.header').removeClass('headerOverlay');
     $('.scroll-content').removeClass('scrollOverlay');
    }
    this.pageLoader = true; 
    let request = this.requestData;
    request.FamilyCover = this.faimlyExistingCover;
    request.SelfCover = this.existingCover;
    request.Income = this.responseData.Table[0].SelfIncome;
    // console.log(request)
    return this.restapiProvider.sendRestApiRequest(request, 'CalculateHealthInsuranceGoal').subscribe((response) => {
      setTimeout(() => {
        this.pageLoader = false; 
      }, 1500);
      if (response.IsSuccess == true) {
        // console.log(response);
        this.responseData = response.Data;
        this.responseData.Table[0].SelfIncome = this.responseData.Table[0].SelfIncome / 12;
        // this.faimlyExistingCover = this.responseData.Table[0].ParentHealthCover;
        // this.existingCover = this.responseData.Table[0].ExistingCover;
        if(fromEvent == 'done'){
          this.maxValueSelf = this.responseData.Table[0].ExistingCover + this.responseData.Table[0].SelfSpouseHealthCover;
        }
      }
      },
      (error) => {
        this.pageLoader = false;
     })
  }

  goBack(){
    this.navCtrl.pop();
  }


  rangeSliderExistingCover(a, b){
    if(this.timerStart){  
      clearTimeout(this.timer);
    }
      // maxRange = healthInsuranceGoal.forYou;
      let maxRangeSelf = this.responseData.Table[0].SelfSpouseHealthCover
    

    //console.log(this.maxRange);
     
    if(a >= (this.maxValueSelf / 3) && a <= (this.maxValueSelf / 2)){
      this.steps = 1000;
    }
    else if(a >= (this.maxValueSelf / 2) ){
    this.steps = 2000;
    }   
    let per =(a * 100) / this.maxValueSelf;

    this.existingCoverComma = "₹" + (a ? this.numberPipe.transform(a.toString().replaceAll(",","")) : "0");
   
    $('#resizeSelf').css('width', per + '%');
    if(b != 'fromJs'){
      this.getGoalResult('');
    }
  }

  rangeSliderFaimlyExistingCover(a, b){
    if(this.timerStart){  
      clearTimeout(this.timer);
    }

    //let maxRangeParent = this.responseData.Table[0].ParentHealthCover
    // maxRange = healthInsuranceGoal.forParents
    if(a >= (this.maxRangeValueParent / 3) && a <= (this.maxRangeValueParent / 2)){
      this.steps = 1000;
    }
    else if(a >= (this.maxRangeValueParent / 2) ){
    this.steps = 2000;
    }   
    let per =(a * 100) / this.maxRangeValueParent;

    this.faimlyExistingCoverComma = "₹" + (a ? this.numberPipe.transform(a.toString().replaceAll(",","")) : "0");

    $('#resizeFaimly').css('width', per + '%');
    if(b != 'fromJs'){
      this.getGoalResult('');
    }
  }

  getImg(i){
    let a;
    if (this.plt.is('android')) {
    if(i.search("Child") == -1){
      if(i == "Self"){
        a =  'assets/imgs/healthInsurance/hlv_' + i + '.png';

      }
      else{
        a =  'assets/imgs/healthInsurance/hlv_' + i.toLowerCase() + '.png';
      }
      
    }
    else{
      a =  'assets/imgs/healthInsurance/hlv_child.png';
    }
  }
  else{
    if(i.search("Child") == -1){
      if(i == "Self"){
        a =  'assets/imgs/healthInsurance/hlv_' + i.toLowerCase() + '.png';

      }
      else{
        a =  'assets/imgs/healthInsurance/hlv_' + i + '.png';
      }
      
    }
    else{
      a =  'assets/imgs/healthInsurance/hlv_Child.png';
    }
  }
    return a;
  }

  getRoundFigure(n){
    if(n){
      return n < 0 ?   0 : n;
    }
    else{
      return 0;
    }
      }

      checkParent(){
      // let i = 0;

      // do{
      //   i = i + 1;
      //   if(this.responseData.Table1.length == (i-1)){
      //     return false;
      //   }
      // }while(this.responseData.Table1[i-1].RelationShip == "Father" || this.responseData.Table1[i-1].RelationShip == "Mother"){
      
      //   if(this.sliderCount == 4){
      //     return  false;
      //   }
      //   else{
      //    if(this.responseData.Table1[i-1].RelationShip == "Father" || this.responseData.Table1[i-1].RelationShip == "Mother"){
      //     return true;
      //    }
      //    else{
      //     return false;
      //    }
      //  }
      // }
      }

      
    info(i){
      this.popupShow = !this.popupShow;
      if(i == 1){
        this.popupText = this.utilitiesProvider.langJsonData['healthInsuranceGoal']['indemnityTxt'];
      }
      if(i == 2){
        this.popupText = this.utilitiesProvider.langJsonData['healthInsuranceGoal']['fixedText'];
      }
      }
      hideDisclaimer(){
        this.popupShow = !this.popupShow;
      }

  setUpshotEvent(action, savedGoal) {
    let data = this.navParams.get('data').request;
    let payload = {
      "Appuid": this.utilitiesProvider.upshotUserData.appUId,
      "Language": this.utilitiesProvider.upshotUserData.lang,
      "City": this.utilitiesProvider.upshotUserData.city,
      "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
      "DrivenFrom": this.drivenFrom,
      "YourAge": data.Age,
      "MonthlyIncome": data.Income,
      "ExistingHealthCover": Number(this.existingCover) + Number(this.faimlyExistingCover),
      "TotalHealthCover": this.responseData.Table[0]["TotalHealthCover"],
      "AddFamily": this.FamilyCoverReq,
      "Action": action,
      "SavedGoal": savedGoal
    }

    let selfData = this.responseData.Table1.filter(el => el.RelationShip == "Self");
    let spouseData = this.responseData.Table1.filter(el => el.RelationShip == "Spouse");
    let fatherData = this.responseData.Table1.filter(el => el.RelationShip == "Father");
    let motherData = this.responseData.Table1.filter(el => el.RelationShip == "Mother");
    let childData = this.responseData.Table1.filter(el => el.RelationShip.indexOf("Child") > -1);
    
    //self data
    if(selfData.length) {
      payload["Self_Indeminity"] = Number(selfData[0].Indemnity) * 100000;
      payload["Self_Fixed"] = Number(selfData[0].Fixed_Benefit) * 100000;
    }
    else {
      payload["Self_Indeminity"] = "";
      payload["Self_Fixed"] = "";
    }

    //spousse data
    if(spouseData.length) {
      payload["Spouse"] = "Yes";
      payload["SpouseAge"] = spouseData[0].Age;
      payload["SpouseIncome"] = spouseData[0].Income;
      payload["Spouse_Indeminity"] = Number(spouseData[0].Indemnity) * 100000;
      payload["Spouse_Fixed"] = Number(spouseData[0].Fixed_Benefit) * 100000;
    }
    else {
      payload["Spouse"] = "No";
      payload["SpouseAge"] = "";
      payload["SpouseIncome"] = "";
      payload["Spouse_Indeminity"] = "";
      payload["Spouse_Fixed"] = "";
    }

    //motheer data
    if(motherData.length) {
      payload["Mother"] = "Yes";
      payload["MotherAge"] = motherData[0].Age;
      payload["MotherIncome"] = motherData[0].Income;
      payload["Mother_Indeminity"] = Number(motherData[0].Indemnity) * 100000;
      payload["Mother_Fixed"] = Number(motherData[0].Fixed_Benefit) * 100000;
    }
    else {
      payload["Mother"] = "No";
      payload["MotherAge"] = "";
      payload["MotherIncome"] = "";
      payload["Mother_Indeminity"] = "";
      payload["Mother_Fixed"] = "";
    }

    //fatheer data
    if(fatherData.length) {
      payload["Father"] = "Yes";
      payload["FatherAge"] = fatherData[0].Age;
      payload["FatherIncome"] = fatherData[0].Income;
      payload["Father_Indeminity"] = Number(fatherData[0].Indemnity) * 100000;
      payload["Father_Fixed"] = Number(fatherData[0].Fixed_Benefit) * 100000;
    }
    else {
      payload["Father"] = "No";
      payload["FatherAge"] = "";
      payload["FatherIncome"] = "";
      payload["Father_Indeminity"] = "";
      payload["Father_Fixed"] = "";
    }

    //chilld data
    if (childData.length) {
      if (childData.length > 1) {
        payload["Children"] = "Yes";
        childData.forEach((el, i) => {
          payload["Children"+(i+1)+"Age"] = el.Age;
          payload["Children"+(i+1)+"Income"] = el.Income;
          payload["Children"+(i+1)+"_Indeminity"] = Number(el.Indemnity) * 100000;
          payload["Children"+(i+1)+"_Fixed"] = Number(el.Fixed_Benefit) * 100000;
        });
      }
      else {
        payload["Children"] = "Yes";
        payload["ChildrenAge"] = childData[0].Age;
        payload["ChildrenIncome"] = childData[0].Income;
        payload["Children_Indeminity"] = Number(childData[0].Indemnity) * 100000;
        payload["Children_Fixed"] = Number(childData[0].Fixed_Benefit) * 100000;
      }
    }
    else {
      payload["Children"] = "No";
      payload["ChildrenAge"] = "";
      payload["ChildrenIncome"] = "";
      payload["Children_Indeminity"] = "";
      payload["Children_Fixed"] = "";
    }
    console.log(payload)
    this.utilitiesProvider.upshotCustomEvent('HealthInsuranceGoal', payload, false);
  }

  formatAmount(val, type) {
    let amount : number = 0;
    let amountStr : String = "";
    if(val && val.trim() != "₹") {
      amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }

    if(type == "existSingle") {
      this.existingCoverComma = "₹" + amountStr;
      this.existingCover = amount;
    }
    else if(type == "existFamily") {
      this.faimlyExistingCoverComma = "₹" + amountStr;
      this.faimlyExistingCover = amount;
    }
    
  }
}





