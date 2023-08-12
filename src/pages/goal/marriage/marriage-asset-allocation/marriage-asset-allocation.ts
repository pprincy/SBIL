import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, LoadingController,MenuController} from 'ionic-angular';
import * as HighCharts from 'highcharts';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import {UtilitiesProvider} from '../../../../providers/utilities/utilities';
import {MyApp} from '../../../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-marriage-asset-allocation',
  templateUrl: 'marriage-asset-allocation.html',
})
export class MarriageAssetAllocationPage {
  @ViewChild(Content) content: Content;
  public steps = 100;
  public isBtnActive:boolean = false;
  public status:boolean = false;
  public  paramsData :any;
  public  loading : any;
  public  timerStart : boolean = false;
  public  timer : any;
  public  graphData : any = {};
  public  rangeDataUi : any = {};
  public  finalValue : any = {};
  public  table : any = {};
  public  table2 : any = []; 
  public  selectedDrop;
  public  headerYear;
  public  debtPer : any = 0;
  public  equityPer : any = 0;
  public  debtList : any = [];
  public  equityList : any = [];
  public  showAssets : boolean = false;
  public  MyDebtList : any = [];
  public  MyEquityList : any = [];
  public  MyDebtPer : any = 0;
  public  MyEquityPer : any = 0;
  public  disclaimer : boolean = false;
  public  disclaimerText;
  public  disclaimerTitle;
  public  myAssets : any = [];
  public  top = 0;
  public  pageLoader : boolean = false;
  public  incomePer;
  public  saveGoalPopup : boolean = false
  public  footerBtnType;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public utilitiesProvider :UtilitiesProvider, 
              private restapiProvider: RestapiProvider,
              private loadingCtrl: LoadingController,
              public menuCtrl: MenuController,
              public myApp : MyApp) {
             this.paramsData = this.navParams.get('data');
             this.finalValue = this.paramsData.Table1[0];
             this.table = this.paramsData.Table[0];
             this.table2 =     this.paramsData.Table2;
             for(let i = 0; i < this.table2.length; i++){
              this.table2[i].color = this.utilitiesProvider.assetsGraphColor[i];
              // console.log(this.table2);  
              if(this.table2[i].ProductCategory == "Debt") {
                this.debtPer = this.debtPer +  this.table2[i].Allocation_perc;
               this.debtList.push(this.table2[i]);
              }
              if(this.table2[i].ProductCategory == "Equity") {
                this.equityPer = this.equityPer +  this.table2[i].Allocation_perc
                this.equityList.push(this.table2[i]);
              } 
            }
            this.showAssets = this.paramsData.showAssets;
            //  console.log(this.paramsData)
         }

     
         scrollToTop() {
           setTimeout(() => {
             this.cssCahnge();
           }, 100);
         }
       
         cssCahnge() {
          if (this.top < $('.heading_seperator').offset().top) {
            $('.networth_details').removeClass('shrink');
         }
          else {
            $('.networth_details').addClass('shrink');
          }
        }
		
  ionViewDidLoad() {
    this.myApp.updatePageUseCount("32");
    this.utilitiesProvider.googleAnalyticsTrackView('Marriage Goal Allocation');
    this.scrollToTop();
    this.saveIncome();
    this.content.ionScroll.subscribe((data)=>{
      if(data){
        this.top  = data.scrollTop;
        this.cssCahnge();
      }
     });
    this.content.ionScrollStart.subscribe((data)=>{
      if(data){
        this.top  = data.scrollTop;
        this.cssCahnge();
      }
    });

    this.yearCal();
    this.getUserAssetLiabilities();
  }

  ionViewDidEnter() {
    this.utilitiesProvider.upshotScreenView('MarriageGoalSuggestion');
  }

  menuToggle(){
    this.menuCtrl.open();
  }
  toggleClass(id){
      $('#' + id).toggleClass('active')
  }
  riskProfileFun(){
   // this.CalculateHomeGoal();
  }
 

  getUserAssetLiabilities() {
    //  "CustID": this.restapiProvider.userData['CustomerID'],
    this.timerStart = true;
    this.timer = setTimeout(() => {
      this.pageLoader = true;
  let request = {
    "CustId": this.restapiProvider.userData['CustomerID'],
    "TokenId": this.restapiProvider.userData['tokenId']
  }
  return this.restapiProvider.sendRestApiRequest(request, 'GetUserAssetLiabilities').subscribe((response) => {
    this.pageLoader = false; 
    if (response.IsSuccess == true) {
      this.myAssets =  response.Data.Table;
      if(this.myAssets.length > 0){
      for(let i = 0; i < this.myAssets.length; i++){
        this.myAssets[i].color = this.utilitiesProvider.assetsGraphColor[i];
       if(this.myAssets[i].ProductCategory == "Debt") {
         this.MyDebtPer = this.MyDebtPer + this.myAssets[i].PercValue;
        this.MyDebtList.push(this.myAssets[i]);
       }
       if(this.myAssets[i].ProductCategory == "Equity") {
         this.MyEquityPer = this.MyEquityPer +  this.myAssets[i].PercValue
         this.MyEquityList.push(this.myAssets[i]);
       } 
      }
    }
    else{
      this.showAssets = false;
    }
      }
    },
    (error) => {
      this.pageLoader = false;
    })
  },500);
}
      replan(){
        this.navCtrl.setRoot('HomeGoalPage')
      }
      takeScreenshot(){
        // this.utilitiesProvider.screenShotURI();
        this.content.scrollToTop();
        this.pageLoader = true;
        setTimeout(() => {
          this.utilitiesProvider.htmlToCanvas("capture-marriageasset").then(result => {
            setTimeout(() => {
              this.pageLoader = false;
            }, 1500);
          })
        }, 1000);

        this.utilitiesProvider.setUpshotShareEvent('Goal', 'Marriage Goal');
      }
      yearCal(){
        let headYear = new Date().getFullYear();
        this.headerYear =  headYear + this.finalValue.TimeForGoal;
      }
      tryCal(){
        this.navCtrl.setRoot('CalculatorlistingPage', {pageFrom:'Goals'})
      }
      	  
      disclaimerInfo(d , type){
        $('#disclaimerId').removeClass('disclaimer');
       this.disclaimer = !this.disclaimer;
       if(type == 'product'){
         this.disclaimerText = '<p>'+d.productText + '</p>';
         this.disclaimerTitle = d.ProductName;
       }
       if(type == 'disclaimer'){
         this.disclaimerText = this.utilitiesProvider.disclaimerText;
         this.disclaimerTitle = 'Disclaimer';
         setTimeout(()=>{
           $('#disclaimerId').addClass('disclaimer');
         },200)
       }
       if(this.disclaimer == true){
         $('.header').addClass('headerOverlay');
         $('.scroll-content').addClass('scrollOverlay');
       }
     }

     
    disclaimerClose(){
        this.disclaimer = !this.disclaimer;
        if(this.disclaimer == false)
        {
          $('.header').removeClass('headerOverlay');
          $('.scroll-content').removeClass('scrollOverlay');
        }
      }

      saveIncome(){
        let ActualIncome =  JSON.parse(this.restapiProvider.userData['userPersonalDetails']).Table[0].ActualIncome;
     if(ActualIncome){
       let MonthlyIncome =  ActualIncome;
       let incomePerTemp =  ((this.finalValue.MonthlySavingRequired ? this.finalValue.MonthlySavingRequired : 0) * 100) / MonthlyIncome;
      this.incomePer =  parseInt(incomePerTemp.toString());
     }else{
       this.incomePer = 0;
     }
    }



    btnClick(type){
      this.footerBtnType = type;
      this.saveGoalPopup = ! this.saveGoalPopup;
    }
        

    saveFunction(type){
      if(type == "dont"){
          this.saveGoalPopup = ! this.saveGoalPopup;
          if(this.footerBtnType == 'cal'){
            this.setUpshotEvent('Try Calculators', 'No');
            this.navCtrl.setRoot('CalculatorlistingPage', {pageFrom:'Goals'});
          }
          else{
            this.saveGoalPopup = ! this.saveGoalPopup;
            this.setUpshotEvent('Read Articles', 'No');
            this.navCtrl.setRoot('ArticlesPage',{source: 'Collections', header: this.utilitiesProvider.langJsonData['marriageGoal']['marriageGoal'], categoryID: 2}); 
          }
       }
      else{
        this.insertUserGoal();

        if(this.footerBtnType == 'cal'){
          this.setUpshotEvent('Try Calculators', 'Yes');
        }
        else {
          this.setUpshotEvent('Read Articles', 'Yes');
        }
      }
    }

  
    insertUserGoal(){
      this.pageLoader = true;  
      let request = {
        "CustId":this.restapiProvider.userData['CustomerID'],
        "TokenId":this.restapiProvider.userData['tokenId'],
        "GoalName":"Wedding",
        "GoalTypeID":"4",
        "CurrentAmount":this.finalValue.CurrentCostOfWedding,
        "Period":this.finalValue.TimeForGoal,
        "LumpsumAvailable":this.finalValue.LumpSumAvailable ,
        "Inflation":this.finalValue.RateOfInflation,
        "IncrementalSavings":this.finalValue.IncrementalSavings_perc_yearly,
        "LumpsumCompound":this.finalValue.LumpsumCompound_perc,
        "RiskProfile":this.finalValue.RiskProfile_categoryID,
        "EMIInterest":"",//
        "FVGoal":this.finalValue.FVWedding,
        "FVDownPayment":"",//
        "RequiredDownpayment":this.finalValue.RequiredForWedding,//
        "MonthlySavingsRequired":this.finalValue.MonthlySavingRequired,
        "DownPaymentPerc":"",//
        "LoanAmount":"",//
        "LoanDuration":"",//
        }
        
      return this.restapiProvider.sendRestApiRequest(request, 'InsertUserGoal').subscribe((response) => {
        this.pageLoader = false;  
          if (response.IsSuccess == true) {
            this.restapiProvider.presentToastTop(this.utilitiesProvider.langJsonData['suggestedAssetsAllocation']['yourGoalSavedSuccessfully']);
            this.saveGoalPopup = ! this.saveGoalPopup;
            if(this.footerBtnType == 'cal'){
              if((localStorage.getItem("isExpensePage"))){
                this.saveGoalPopup = ! this.saveGoalPopup;
                this.navCtrl.setRoot('IncomeDashboardPage');
                localStorage.removeItem("isExpensePage")
              }
              else {
                this.navCtrl.setRoot('CalculatorlistingPage', {pageFrom:'Goals'});
              }
            }
            else{
              this.saveGoalPopup = ! this.saveGoalPopup;
              if((localStorage.getItem("isExpensePage"))){
                this.saveGoalPopup = ! this.saveGoalPopup;
                this.navCtrl.setRoot('IncomeDashboardPage');
                localStorage.removeItem("isExpensePage")
              }
              else {
                this.navCtrl.setRoot('ArticlesPage',{source: 'Collections', header: this.utilitiesProvider.langJsonData['marriageGoal']['marriageGoal'], categoryID: 2}); 
              }
            }
          }
           },
        (error) => {
          this.pageLoader = false;
          })
    }

    setUpshotEvent(action, saveGoal) {
      let payload = {
        "Appuid": this.utilitiesProvider.upshotUserData.appUId,
        "Language": this.utilitiesProvider.upshotUserData.lang,
        "City": this.utilitiesProvider.upshotUserData.city,
        "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
        "Goal": "Marriage Goal",
        "Selection": this.navParams.get('from') || '',
        "AnnualCorpus": this.finalValue.RequiredForWedding,
        "SuggestedSaving": this.finalValue.MonthlySavingRequired,
        "SuggestEquity": this.equityPer,
        "SuggestDebt": this.debtPer,
        "YourEquity": this.MyEquityPer,
        "YourDebt": this.MyDebtPer,
        "Action": action,
        "SaveGoal": saveGoal
      }
      // console.log(payload)
      this.utilitiesProvider.upshotCustomEvent('SuggestInvestment', payload, false);
    }
}