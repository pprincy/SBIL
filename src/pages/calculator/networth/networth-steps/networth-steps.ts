import { Component, ViewChild,HostListener } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Content, LoadingController } from 'ionic-angular';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities'
import { Keyboard } from '@ionic-native/keyboard';
import {MyApp } from '../../../../app/app.component'
import { bindNodeCallback } from '../../../../../node_modules/rxjs/observable/bindNodeCallback';
import { bindCallback } from '../../../../../node_modules/rxjs/observable/bindCallback';
import { DecimalPipe } from '@angular/common';
@IonicPage()
@HostListener("window:scroll", [])
@Component({
  selector: 'page-networth-steps',
  templateUrl: 'networth-steps.html',
})
export class NetworthStepsPage {
  @ViewChild(Content) content: Content;
  public steps = 100;
  public amount = 100;
  public minValue = 100;
  public maxValue = 10000;
  public isBtnActive: boolean = false;
  public savInvestData: any = [];
  public owedData: any = [];
  public selectedSavInv: any = [];
  public selectedOwed: any = [];
  public dummyNetwothData: any = [];
  public SITotal: any; public totOwed: any;
  loading: any;scrollHeight; scrollAmount: any;
   keyboardShow: boolean = false; backBtnhide : boolean=  true;
   minAssets; maxAssets; minLiabilities; maxLiabilities;
   public pageLoader : boolean = true;
   public pageFrom;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    private loadingCtrl: LoadingController,
    private keyboard: Keyboard,
    private numberPipe: DecimalPipe,
    public myApp : MyApp) {
   // this.loadData();
    this.keyboard.onKeyboardShow().subscribe(data => {
      this.keyboardShow = true;
    });
    this.keyboard.onKeyboardHide().subscribe(data => {
      this.keyboardShow = false;
    });

    this.pageFrom = this.navParams.get('pageFrom');
  }
  @ViewChild(Slides) slides: Slides;
  value = '';
  changeText(value: string) { this.value = value; }

  ionViewDidEnter(){
    this.slides.lockSwipes(true);
    this.loadData();
    this.slides.update();
   let a =  $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
   if(a){
    this.scrollHeight= a;
   }
   this.selectedSavInv =  this.selectedSavInv;

   this.utilitiesProvider.upshotScreenView('NetworthCalculator');
  }

 
  doSomething(e) {
    if (this.amount >= (this.maxValue / 3) && this.amount <= (this.maxValue / 2)) {
      this.steps = 1000;
    }
    else if (this.amount >= (this.maxValue / 2)) {
      this.steps = 2000;
    }
  }

  toggleClass(id) {
    $('#' + id).toggleClass('active');
  }

  selectSavInvFunction(si) {
    si.amount = ''
    if ($('#' + si.id).hasClass('active')) {
      $('#' + si.id).toggleClass('active')
      this.selectedSavInv.splice(this.selectedSavInv.indexOf(si), 1);
      this.SITotal = this.utilitiesProvider.getTotal(this.selectedSavInv);

    }
    else {
      $('#' + si.id).toggleClass('active');
      this.selectedSavInv.push(si);
      this.SITotal = this.utilitiesProvider.getTotal(this.selectedSavInv);
    }
  }
  removeSI(i) {
    this.selectedSavInv.splice(this.selectedSavInv.indexOf(i), 1);
    this.SITotal = this.utilitiesProvider.getTotal(this.selectedSavInv);
    $('#' + i.id).toggleClass('active')
    if (this.selectedSavInv.length <= 0) {
      this.back();
    }
  }
  changeSIInput(id) {
    if (id) {
      for (let i = 0; i <= this.selectedSavInv.length; i++) {
        if (id == this.selectedSavInv[i].id) {
          this.selectedSavInv[i].amount = Number($('.input#' + id + ' .text-input').val().toString().replaceAll(",","")).toLocaleString('en-IN');
          this.SITotal = this.utilitiesProvider.getTotal(this.selectedSavInv);
          break;
        }
      }
    }
    else {
      $("#" + id).focus()
    }
  }
 
 

  //************** Owed Section****************
  owedFunction(owed) {
    console.log("this.focus");
    owed.amount = ''
    if ($('#L-' + owed.id).hasClass('active')) {
      $('#L-' + owed.id).toggleClass('active')
      this.selectedOwed.splice(this.selectedOwed.indexOf(owed), 1);
      this.totOwed = this.utilitiesProvider.getTotal(this.selectedOwed);
     
    }
    else {
      $('#L-' + owed.id).toggleClass('active');
      this.selectedOwed.push(owed);
      this.totOwed = this.utilitiesProvider.getTotal(this.selectedOwed);
    }
    // console.log(this.totOwed)
  }
  removeOwed(owed) {
    $('#L-' + owed.id).toggleClass('active');
    this.selectedOwed.splice(this.selectedOwed.indexOf(owed), 1);
    this.totOwed = this.utilitiesProvider.getTotal(this.selectedOwed);
    if (this.selectedOwed.length <= 0) {
      this.back();
    }
  }
  changeOwedInput(id) {
    if (id) {
      for (let i = 0; i <= this.selectedOwed.length; i++) {
        if (id == this.selectedOwed[i].id) {
          this.selectedOwed[i].amount = Number($('.input#L-' + id + ' .text-input').val().toString().replaceAll(",","")).toLocaleString('en-IN');
          this.totOwed = this.utilitiesProvider.getTotal(this.selectedOwed);
          // console.log(this.totOwed )
          break;
        }
      }
    }
    else {
      $("#L-" + id).focus()
    }
  }

  next(){
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex == 0){
      if (this.selectedSavInv.length <= 0) {
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['atleastSelectOne'])
      }
      else {
        this.commonNext();
      }
    }
    if(currentIndex == 1){
       if(this.SITotal == 0 || this.SITotal == undefined || this.SITotal =='' || this.SITotal == null){
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterAmount'])
       }
       else{
         if(this.SITotal < this.minAssets || this.SITotal > this.maxAssets){
          this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterAmountBetween'] + " " + this.minAssets + " " + this.utilitiesProvider.jsErrorMsg['to'] + " " + this.maxAssets)
         }
         else{
          this.commonNext();
         }
       }
      
    }
    if(currentIndex == 2){
      if (this.selectedOwed.length <= 0) {
        // this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['atleastSelectOne'])
        this.totOwed= 0
      }
      // else {
        this.commonNext();
      // }
  }
  if(currentIndex == 3 || currentIndex == 4){
    if(this.totOwed === undefined || this.totOwed ==='' || this.totOwed === null){
      this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterAmount'])
     }
     else{
      if(this.totOwed < this.minLiabilities || this.totOwed > this.maxLiabilities){
        this.restapiProvider.presentToastTop(this.utilitiesProvider.jsErrorMsg['pleaseEnterAmountBetween'] + " " + this.minLiabilities + " " + this.utilitiesProvider.jsErrorMsg['to'] + " " + this.maxLiabilities)
       }
       else{
        this.commonNext();
        this.activateBar();
        this.onSliderChange();
        this.getNetwoth();
       }
     }
}
  }
  commonNext(){
    let currentIndex = this.slides.getActiveIndex();
    let yOffset = document.getElementById("stepsCount").offsetTop;
    this.content.scrollTo(0, yOffset, 0)
    this.slides.lockSwipes(false);
    this.slides.slideTo(currentIndex + 1, 500);
    this.slides.lockSwipes(true);
    this.activateBar();
    this.onSliderChange();
  }
  back(){
      let currentIndex = this.slides.getActiveIndex();
      if(currentIndex == 0){
        this.backBtnhide = true;
       
      }
      else{ this.backBtnhide = false;}
      let yOffset = document.getElementById("stepsCount").offsetTop;
      this.content.scrollTo(0, yOffset, 0)
      this.slides.lockSwipes(false);
      this.slides.slideTo(currentIndex-1, 500);
      this.slides.lockSwipes(true);
      this.activateBar();
      this.onSliderChange();
    }
  activateBar() {
    let currentIndex = this.slides.getActiveIndex() + 1;
    let stepIndex = $('.calculator_steps .calculator_steps_com  .calculator_steps_com_num span').text();
    $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').prevAll().addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').nextAll().removeClass('active');
  }
  loadData() {
    this.utilitiesProvider.defaultCalData = this.utilitiesProvider.defaultData.Item1.calculators;
    this.dummyNetwothData = this.utilitiesProvider.defaultCalData.networth;
    // this.savInvestData = this.dummyNetwothData.data.assets;
    // this.owedData = this.dummyNetwothData.data.liabilities;
       this.savInvestData =  this.utilitiesProvider.UserProfileMaster['Table1'];
    this.owedData =this.utilitiesProvider.UserProfileMaster['Table2'];
   
    this.minAssets  =  parseInt(this.dummyNetwothData.sliderConfig.assets.min)
    this.maxAssets  = parseInt(this.dummyNetwothData.sliderConfig.assets.max)
    this.minLiabilities  =  parseInt(this.dummyNetwothData.sliderConfig.liabilities.min);
    this.maxLiabilities  = parseInt(this.dummyNetwothData.sliderConfig.liabilities.max);
    this.viewInitilize();
  }
  viewInitilize() {
    setTimeout(function () {
      let sizesavinv = $('.invest_option > .row > .col').length;
      let cursize = 8;
      let exactshow = cursize + 1;
      for (let i = 1; i <= cursize; i++) {
        $('.invest_option > .row > .col:nth-child(' + i + ')').show();
      }

      $('.showmore .shmore').click(function () {
        $(this).toggle();
        $(this).siblings().show();
        $('.invest_option > .row > .col').show();
      });
      $('.showmore .lessmore').click(function () {
        $(this).toggle();
        $(this).siblings().show();
        for (exactshow; exactshow <= sizesavinv; exactshow++) {
          $('.invest_option > .row > .col:nth-child(' + exactshow + ')').hide();
        }
        exactshow = cursize + 1;
      });
      
    }, 100);

  }
  onSliderChange() {
    // console.log('onSliderChange');
    let currentIndex = this.slides.getActiveIndex();
    
    if(currentIndex == 0){this.backBtnhide = true;}
    else{ this.backBtnhide = false;}
  }

  getNetwoth() {
    this.pageLoader = true;
    this.updateUserAssets();
  //  this.utilitiesProvider.tempValue = {
  //   "assets" : {
  //       "CustID": this.restapiProvider.userData['CustomerID'],
  //       "TokenId": this.restapiProvider.userData['tokenId'],
  //       "Products": this.selectedSavInv
  //   },
  //   "Liabilities" : {
  //       "CustID" : this.restapiProvider.userData['CustomerID'],
  //       "TokenId": this.restapiProvider.userData['tokenId'],
  //       "Products": this.selectedOwed
  //   }
  //   }
    let request = { 
      "CustId": this.restapiProvider.userData['CustomerID'],
      'TokenId': this.restapiProvider.userData['tokenId'],
      "CurrentSaving": this.SITotal,
      "Liability": this.totOwed 
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetNetworthValue').subscribe((response) => {
      this.pageLoader = false; 
      if (response.IsSuccess == true) {
          let d = {
            "assets": this.SITotal,
            "liabilities": this.totOwed,
            "configCal": this.dummyNetwothData.sliderConfig,
            "networthValue": response.Data.Networth
          }

          let selAsset = "";
          let selLiability = "";
          this.selectedOwed.forEach(el => {
            selAsset += el.value + ", "
          });
          this.selectedSavInv.forEach(el => {
            selLiability += el.value + ", "
          });
          this.navCtrl.push('NetworthFinalPage', { 'data': d, pageFrom: this.pageFrom, selAsset: selAsset, selLiability: selLiability});
        }
        else {
          this.pageLoader = false; 
          // console.log(response);
        }
      },
      (error) => {
        this.pageLoader = false; 
      })
  }


// User Assets Update
updateUserAssets() {
  this.pageLoader = true;

  let a = [];
  for (let i = 0; i < this.selectedSavInv.length; i++) {
  let b = {
    "amount" :  this.selectedSavInv[i].amount.toString().replaceAll(",",""),
    "id" :  this.selectedSavInv[i].id
  }
  a.push(b);
  }


  let request = { 
    "CustID": this.restapiProvider.userData['CustomerID'],
    "TokenId": this.restapiProvider.userData['tokenId'],
    "Products": a
  }
  return this.restapiProvider.sendRestApiRequest(request, 'UpdateUserAssets').subscribe((response) => {
    this.pageLoader = false; 
    if (response.IsSuccess == true) {
       this.updateUserLiabilities();
      }
      else {
        // console.log(response);
      }
    },
    (error) => {
      this.pageLoader = false;
    })
}

//update User Liabilities

updateUserLiabilities() {
  this.pageLoader = true;
  // for (let i = 0; i < this.selectedOwed.length; i++) {
  //   this.selectedOwed[i].value = "";
  // }
  let a = [];
  for (let i = 0; i < this.selectedOwed.length; i++) {
  let b = {
    "amount" :  this.selectedOwed[i].amount.toString().replaceAll(",",""),
    "id" :  this.selectedOwed[i].id
  }
  a.push(b);
  }
  let request = { 
    "CustID": this.restapiProvider.userData['CustomerID'],
    "TokenId": this.restapiProvider.userData['tokenId'],
    "Products": a
  }
  return this.restapiProvider.sendRestApiRequest(request, 'UpdateUserLiabilities').subscribe((response) => {
    this.pageLoader = false; 
    if (response.IsSuccess == true) {
      
     }
      else {
        // console.log(response);
      }
    },
    (error) => {
      this.pageLoader = false;
    })
}
}
