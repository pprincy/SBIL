import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Navbar, Content, LoadingController,MenuController, ModalController} from 'ionic-angular';
import * as HighCharts from 'highcharts';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import {UtilitiesProvider} from '../../../../providers/utilities/utilities';
import {MyApp} from '../../../../app/app.component';
import { DecimalPipe } from '@angular/common';
import { DropDowmSelctionPage } from '../../../../components/modals/drop-dowm-selction/drop-dowm-selction';
@IonicPage()
@Component({
  selector: 'page-retirement-goal-final',
  templateUrl: 'retirement-goal-final.html',
})
export class RetirementGoalFinalPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Navbar) navBar: Navbar;

  brightness;
  public steps = 100;
  public amountD1;
  public amountD2;
  public minValue ;
  public maxValue ;
  public isBtnActive:boolean = false;
  public status:boolean = false;
  public Daughter1 : any = {};
  public Daughter2: any = {};
  public paramsData :any;
  public loading : any;
  public timerStart : boolean = false;
  public timer : any;
  public graphData : any = {};
  public rangeDataUi : any = {};
  public finalValue : any = {};
  public comparePopup : any = false;
  public annuity : any = false;
  public disclaimer : any = false;
  public riskData : any = [];
  public pageLoader : boolean = false;
  public drivenFrom;
  public selectedDrop;msaMin;msaMax;msaValue;headerYear;msaValueComma;
  public modal;
  public riskProfile;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public utilitiesProvider :UtilitiesProvider, 
              private restapiProvider: RestapiProvider,
              private loadingCtrl: LoadingController,
              public menuCtrl: MenuController,
              private numberPipe: DecimalPipe,
              public myApp : MyApp,
              public modalCtrl: ModalController) {
             this.paramsData = this.navParams.get('data');
             this.finalValue = this.paramsData.Table1[0];
             this.riskProfile = this.finalValue.RiskProfile;
            //  console.log(this.paramsData)
             this.utilitiesProvider.defaultGoalData =  this.utilitiesProvider.defaultData.Item2.goals.retirement;
            this.msaMin = parseInt(this.utilitiesProvider.defaultGoalData.data.lumpsum_avlbl.min);
            this.msaMax = parseInt(this.utilitiesProvider.defaultGoalData.data.lumpsum_avlbl.max);
            let pvOfLum = this.paramsData.Table[0].PVOFLumpsum;
            this.msaValue  = parseFloat(this.finalValue.LumsumAvailable) +  parseFloat(pvOfLum);      
            
            let amount : number = 0;
            let amountStr : String = "0";
            if(this.msaValue) {
              amount = Number(this.msaValue.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
              amountStr = amount.toLocaleString('en-IN');
            }

            this.msaValueComma = "₹" + amountStr;   
            let getMasters = this.utilitiesProvider.GetMasterData;
            this.riskData = getMasters.Table4;

           this.drivenFrom = this.navParams.get('drivenFrom');
          }

          //  top = 0;
          //  scrollToTop() {
          //    setTimeout(() => {
          //      this.cssCahnge();
          //    }, 100);
          //  }
         
          //  cssCahnge() {
          //    if (this.top == 0) {
          //      $('.networth_details').removeClass('shrink');
          //    }
          //    else {
          //      $('.networth_details').addClass('shrink');
          //      setTimeout(function () {
          //        var hedaerheight = $('.shrink').parent().outerHeight();
          //      }, 100);
          //    }
          //  }
           
  ionViewDidLoad() {
    // this.navBar.backButtonClick = () => {
    //   this.navCtrl.setRoot('RetirementGoalPage')   
    //  };
    this.myApp.updatePageUseCount("26");
    this.utilitiesProvider.googleAnalyticsTrackView('Retirement Goal');

    this.yearCal();
    this.brightness = 0;
    $('.resize').css('width',  this.brightness + '%');
    $('.swiper-pagination-bullet').hide();
    // this.scrollToTop();
    // this.content.ionScroll.subscribe((data)=>{
    //   if(data){
    //     this.top  = data.scrollTop;
    //     this.cssCahnge();
    //   }
    //  });
      
    // this.content.ionScrollStart.subscribe((data)=>{
    //   if(data){
    //     this.top  = data.scrollTop;
    //     this.cssCahnge();
    //   }
    // });
  }
  annutiyInfo(){
    this.annuity = !this.annuity;
    if(this.annuity == true)
    {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
  }

  disclaimerInfo(){
    this.disclaimer = !this.disclaimer;
    if(this.disclaimer == true)
    {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
  }

  annuityClose(){
    this.annuity = !this.annuity;
    if(this.annuity == false)
    {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
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
  
  doSomething(a, b){
    if(this.timerStart){
      clearTimeout(this.timer);
    }
    if(a >= (this.msaMax / 3) && a <= (this.msaMax / 2)){
      this.steps = 1000;
    }
    else if(a >= (this.msaMax / 2) ){
    this.steps = 2000;
    }   
    let per =(a * 100) /  this.msaMax; //
    this.finalValue.LumsumAvailable = a;

    this.msaValueComma = "₹" + (this.msaValue ? this.numberPipe.transform(this.msaValue.toString().replaceAll(",","")) : "0");
    
    $('.resize ').css('width', per + '%');
    if(b == 'fromHtml'){
      this.calculateRetirementGoal();
    }
  }
  menuToggle(){
    this.menuCtrl.open();
  }
  toggleClass(id){
      $('#' + id).toggleClass('active')
  }
  riskProfileFun(){
    this.calculateRetirementGoal();
  }

  assetAllocation(){
    this.comparePopup = true;
    if(this.comparePopup == true)
    {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }

    this.setUpshotEvent('Suggest Invesment');
  }
  updateAssets(){
    this.comparePopup = false;
     $('.header').removeClass('headerOverlay');
     $('.scroll-content').removeClass('scrollOverlay');
    let goalAssetsData = {
      "fromPage" : "RetirementGoalFinalPage",
      "headerTitle" : this.utilitiesProvider.langJsonData['retirementGoal']['retirementGoal'],
      "assetsPage" : "RetirementAssetAllocationPage",
      "assetsData" : this.paramsData
    }
    this.navCtrl.push('GoalAssetsPage', {data : goalAssetsData})
  }
  compareNow(type){
    this.comparePopup = false;
    if(type == 'compare'){
      this.paramsData.showAssets = true;
    }
    else{
      this.paramsData.showAssets = false;
    }
     $('.header').removeClass('headerOverlay');
     $('.scroll-content').removeClass('scrollOverlay');
    this.navCtrl.push('RetirementAssetAllocationPage', {data : this.paramsData, from: type=='compare'?'Compare Now':'Get My Recommendations'})
  }
 showOverlay(type){
    this.status = !this.status;
    if(this.status == true)
    {
      $('.header').addClass('headerOverlay');
      $('.scroll-content').addClass('scrollOverlay');
    }
    
   
    this.selectedDrop = type;  
     if(type === 'inflation'){
      this.utilitiesProvider.rangeData = this.finalValue.Inflation;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.Inflation,
        "min" :  parseFloat(this.utilitiesProvider.defaultGoalData.data.inflation_rate.min),
        "max" :  parseFloat(this.utilitiesProvider.defaultGoalData.data.inflation_rate.max),
        "title" :this.utilitiesProvider.langJsonData['retirementGoal']['rateOfInflation'],
        "type" : "",
        "info" : this.utilitiesProvider.infoPopupText[0].desc
      }
    }
    if(type === 'IncrementalSavings'){
      this.utilitiesProvider.rangeData = this.finalValue.IncrementalSavings_perc_yearly;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.IncrementalSavings_perc_yearly,
        "min" :  parseFloat(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.min),
        "max" :  parseFloat(this.utilitiesProvider.defaultGoalData.data.incr_saving_rate.max),
        "title" :this.utilitiesProvider.langJsonData['retirementGoal']['increasingSavingsRate'],
        "type" : "",
        "info" : this.utilitiesProvider.infoPopupText[1].desc
      }
    }
    if(type === 'CurrentMonthlyExpenditure'){
      this.utilitiesProvider.rangeData = this.finalValue.CurrentMonthlyExpenditure;
      this.rangeDataUi = {
        "steps" : 100,
        "amount" :this.finalValue.CurrentMonthlyExpenditure,
        "min" :  parseInt(this.utilitiesProvider.defaultGoalData.data.curr_mnthly_exp.min),
        "max" :  parseInt(this.utilitiesProvider.defaultGoalData.data.curr_mnthly_exp.max),
        "title" :this.utilitiesProvider.langJsonData['retirementGoal']['monthlyExpenses'],
        "type" : "r",
        "info" : ""
      }
    }
    if(type === 'RetirementAge'){
      this.utilitiesProvider.rangeData = this.finalValue.RetirementAge;
      this.rangeDataUi = {
        "steps" : 1,
        "amount" :this.finalValue.RetirementAge,
        "min" :  40,
        "max" :  70,
        "title" :this.utilitiesProvider.langJsonData['retirementGoal']['retirementAge'],
        "type" : "",
        "info" : ""
      }
    }
}

 done(){

  let d = parseFloat(this.utilitiesProvider.rangeData);

  
  if(d < parseFloat(this.rangeDataUi.min) || d > parseFloat(this.rangeDataUi.max)){
    this.restapiProvider.presentToastTop("Please enter number between " + this.rangeDataUi.min + " to " + this.rangeDataUi.max)
  }
   else{
  if(this.selectedDrop == "inflation"){
    this.status = !this.status;
    this.finalValue.Inflation = this.utilitiesProvider.rangeData;
     this.calculateRetirementGoal();
     if(this.status == false)
     {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
     }
  }
  if(this.selectedDrop == "IncrementalSavings"){
    this.status = !this.status;
    this.finalValue.IncrementalSavings_perc_yearly = this.utilitiesProvider.rangeData;
     this.calculateRetirementGoal();
     if(this.status == false)
     {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
     }
  }
  if(this.selectedDrop == "CurrentMonthlyExpenditure"){
    this.status = !this.status;
    this.finalValue.CurrentMonthlyExpenditure = this.utilitiesProvider.rangeData;
     this.calculateRetirementGoal();
     if(this.status == false)
     {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
     }
  }
  if(this.selectedDrop == "RetirementAge"){
    this.status = !this.status;
    this.finalValue.RetirementAge = this.utilitiesProvider.rangeData;
     this.calculateRetirementGoal();
     if(this.status == false)
     {
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
     }
  }
  
  }
 }

 calculateRetirementGoal() {
    this.timerStart = true;
    this.timer = setTimeout(() => {
  this.pageLoader = true;
  let request = {
    "CustId": this.restapiProvider.userData['CustomerID'],
    'TokenId': this.restapiProvider.userData['tokenId'],
    "CurrentAge": this.finalValue.CurrentAge,
    "RetirementAge": this.finalValue.RetirementAge,
    "CurrentExpenditure": this.finalValue.CurrentMonthlyExpenditure,
    "LumpsumAvailable":this.finalValue.LumsumAvailable ?  this.finalValue.LumsumAvailable : 0,
    "Inflation": this.finalValue.Inflation,
    "IncrementalSavings":this.finalValue.IncrementalSavings_perc_yearly,
    "LumpsumCompound":this.finalValue.LumpsumCompound_perc ?  this.finalValue.LumpsumCompound_perc : 0,
    "RiskProfile": this.finalValue.RiskProfile_categoryID,
     }
  return this.restapiProvider.sendRestApiRequest(request, 'CalculateRetirementGoal').subscribe((response) => {
    this.pageLoader = false; 
    if (response.IsSuccess == true) {
        this.finalValue = response.Data.Table1[0];
        this.paramsData =  response.Data;
        let pvOfLum = this.paramsData.Table[0].PVOFLumpsum;
        let a  = parseFloat(this.finalValue.LumsumAvailable) +  parseFloat(pvOfLum);
        this.doSomething(a, 'fromJs');
        this.yearCal();
        // console.log(response.Data)
        // console.log(this.utilitiesProvider.defaultGoalData)
      }
    },
    (error) => {
      this.pageLoader = false;
    })
  },500)
}

replan(){
  this.setUpshotEvent('Replan');

  this.navCtrl.setRoot('RetirementGoalPage', { pageFrom: this.drivenFrom})
}
      takeScreenshot(){
        // this.utilitiesProvider.screenShotURI();
        this.content.scrollToTop();
        this.pageLoader = true;
        setTimeout(() => {
          this.utilitiesProvider.htmlToCanvas("capture-retirementgoal").then(result => {
            setTimeout(() => {
              this.pageLoader = false;
            }, 1500);
          })
        }, 1000);

        this.utilitiesProvider.setUpshotShareEvent('Goal', 'Retirement Goal');
      }
      yearCal(){
        let headYear = new Date().getFullYear();
        this.headerYear =  headYear + this.finalValue.TimeToInvest;
      }
      clearStartZero(option){
        if(option == 'lumsum'             &&
           (this.msaValue == 0        ||
           isNaN(this.msaValue)       ||
           this.msaValue == null)){
          this.msaValue = null;
          this.msaValueComma = "₹" + "";
        }
      }
      tipsText(suggetedSaving){
        return  this.utilitiesProvider.savingSuggestedTipsTest(suggetedSaving);
         }
         goNotificationList(){
          this.navCtrl.push('NotificationPage');
        }

        setUpshotEvent(action) {
          let breakupData = this.navParams.get('breakup') || [];
          let payload = {
            "Appuid": this.utilitiesProvider.upshotUserData.appUId,
            "Language": this.utilitiesProvider.upshotUserData.lang,
            "City": this.utilitiesProvider.upshotUserData.city,
            "AgeGroup": this.utilitiesProvider.upshotUserData.ageGroup,
            "DrivenFrom": this.drivenFrom,
            "RetirementAge": this.finalValue.RetirementAge,
            "CurrentAge": this.finalValue.CurrentAge,
            "MonthlyExpenses": this.finalValue.CurrentMonthlyExpenditure,
            "BHousehold": breakupData.filter(el=>el.MonthlyExpenseName == "Utility/ Household Expense")[0]["amount"] || '',
            "BMedical": breakupData.filter(el=>el.MonthlyExpenseName == "Medical")[0]["amount"] || '',
            "BEducation": breakupData.filter(el=>el.MonthlyExpenseName == "Education")[0]["amount"] || '',
            "BEnternatinment": breakupData.filter(el=>el.MonthlyExpenseName == "Entertainment")[0]["amount"] || '',
            "BVacation": breakupData.filter(el=>el.MonthlyExpenseName == "Vacation")[0]["amount"] || '',
            "BOther": breakupData.filter(el=>el.MonthlyExpenseName == "Others")[0]["amount"] || '',
            "RetirementCorpus": Number(this.finalValue.ShortfallOfCorpus) < 0 ? 0 : Number(this.finalValue.ShortfallOfCorpus),
            "Annuity": this.finalValue.AnnuityReceivablePerMonth,
            "SuggestedSaving": Number(this.finalValue.MonthlySavingRequired) < 0 ? 0 : Number(this.finalValue.MonthlySavingRequired),
            "SavedAmt": this.msaValue,
            "Risk": this.riskData.filter(el=>el.ProfileID == this.finalValue.RiskProfile_categoryID)[0]["Profiler_Name"],
            "InflationRate": this.finalValue.Inflation,
            "IncreasingSavingRate": this.finalValue.IncrementalSavings_perc_yearly,
            "Action": action
          }
          // console.log(payload)
          this.utilitiesProvider.upshotCustomEvent('RetirementGoal', payload, false);
        }

        formatAmount(val) {
          let amount : number = 0;
          let amountStr : String = "";
          if(val && val.trim() != "₹") {
            amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
            amountStr = amount.toLocaleString('en-IN');
          }
          
          this.msaValueComma = "₹" + amountStr;
          this.msaValue = amount;
        }

        async RiskData(){
          let commonList = this.riskData.map(el => {
            const obj = {
              name: el.Profiler_Name,
              value: el.ProfileID,
            };
            return obj;
          }
            
          );
          console.log("country list", commonList);
          this.modal = await this.modalCtrl.create(
            DropDowmSelctionPage,
            { commonList: commonList,
              selectOption: this.riskProfile },
            {
              showBackdrop: true,
              enableBackdropDismiss: true,
            }
          );
          await this.modal.present();
      
          this.modal.onDidDismiss(data => {
            this.finalValue.RiskProfile_categoryID = data;
              this.riskData.forEach(element => {
                if(element.ProfileID == data){
                  this.riskProfile = element.Profiler_Name;
                }
              });
      
              this.riskProfileFun()
          })
      
        }
        
}



