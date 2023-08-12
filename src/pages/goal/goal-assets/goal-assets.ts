import { Component, ViewChild,HostListener } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Content, LoadingController } from 'ionic-angular';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities'
import { Keyboard } from '@ionic-native/keyboard';
import { DecimalPipe } from '@angular/common';

@IonicPage()
@HostListener("window:scroll", [])
@Component({
  selector: 'page-goal-assets',
  templateUrl: 'goal-assets.html',
})
export class GoalAssetsPage {
  @ViewChild(Content) content: Content;
  public steps = 100;
  public amount = 100;
  public minValue = 100;
  public maxValue = 10000;
  public isBtnActive: boolean = false;
  public savInvestData: any = [];
  public owedData: any = [];
  private selectedSavInv: any = [];
  public selectedOwed: any = [];
  public dummyNetwothData: any = [];
  public SITotal: any; public totOwed: any;
  public loading: any;scrollHeight; scrollAmount: any;
  public keyboardShow: boolean = false; backBtnhide : boolean=  true;
  public minAssets; maxAssets; minLiabilities; maxLiabilities;
  public paramsData : any = {};
  public pageLoader : boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    private loadingCtrl: LoadingController,
    private numberPipe: DecimalPipe,
    private keyboard: Keyboard) {
   this.paramsData = this.navParams.get('data');
    this.keyboard.onKeyboardShow().subscribe(data => {
      this.keyboardShow = true;
    });
    this.keyboard.onKeyboardHide().subscribe(data => {
      this.keyboardShow = false;
    });
  }
  @ViewChild(Slides) slides: Slides;
  value = '';
  changeText(value: string) { this.value = value; }
  ionViewDidLoad(){
    this.selectedSavInv = [];
    this.slides.lockSwipes(true);
    this.loadData();
    this.slides.update();
   let a =  $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
   if(a){
    this.scrollHeight= a;
   }
  }

  loadData() {
    this.utilitiesProvider.defaultCalData = this.utilitiesProvider.defaultData.Item1.calculators;
    this.dummyNetwothData = this.utilitiesProvider.defaultCalData.networth;
    // console.log("this.utilitiesProvider.UserProfileMaster ***",this.utilitiesProvider.UserProfileMaster)
    this.savInvestData = this.utilitiesProvider.UserProfileMaster.Table1;
    this.owedData = this.utilitiesProvider.UserProfileMaster.Table2;
    this.minAssets  =  parseInt(this.dummyNetwothData.sliderConfig.assets.min)
    this.maxAssets  = parseInt(this.dummyNetwothData.sliderConfig.assets.max)
    this.minLiabilities  =  parseInt(this.dummyNetwothData.sliderConfig.liabilities.min);
    this.maxLiabilities  = parseInt(this.dummyNetwothData.sliderConfig.liabilities.max);
    this.viewInitilize();
    setTimeout(()=>{
      this.getUserAssetLiabilities()
    },500)

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
 
  doSomething(e) {
    if (this.amount >= (this.maxValue / 3) && this.amount <= (this.maxValue / 2)) {
      this.steps = 1000;
    }
    else if (this.amount >= (this.maxValue / 2)) {
      this.steps = 2000;
    }
  }
  selectSavInvFunction(si) {
    if ($('#invest_option_grid_list' + si.id).hasClass('active')) {
      $('#invest_option_grid_list' + si.id).toggleClass('active')
      this.selectedSavInv.splice(this.selectedSavInv.indexOf(si), 1);
      this.SITotal = this.utilitiesProvider.getTotal(this.selectedSavInv);

    }
    else {
      $('#invest_option_grid_list' + si.id).toggleClass('active');
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
          let val = $('.input#assets_' + id + ' .text-input').val();
          this.selectedSavInv[i].amount = this.numberPipe.transform(val.toString().replaceAll(",",""));
          this.SITotal = this.utilitiesProvider.getTotal(this.selectedSavInv);
          break;
        }
      }
    }
    else {
      $("#assets_" + id).focus()
    }
  }
 
 

  //************** Owed Section****************
  owedFunction(owed) {
    if ($('#' + owed.id).hasClass('active')) {
      $('#' + owed.id).toggleClass('active')
      this.selectedOwed.splice(this.selectedOwed.indexOf(owed), 1);
      this.totOwed = this.utilitiesProvider.getTotal(this.selectedOwed);
     
    }
    else {
      $('#' + owed.id).toggleClass('active');
      this.selectedOwed.push(owed);
      this.totOwed = this.utilitiesProvider.getTotal(this.selectedOwed);
    }
    // console.log(this.totOwed)
  }
  removeOwed(owed) {
    $('#' + owed.id).toggleClass('active');
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
          let val = $('.input#' + id + ' .text-input').val();
          this.selectedOwed[i].amount = this.numberPipe.transform(val.toString().replaceAll(",",""));
          this.totOwed = this.utilitiesProvider.getTotal(this.selectedOwed);
          // console.log(this.totOwed )
          break;
        }
      }
    }
    else {
      $("#" + id).focus()
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
          // console.log( this.selectedSavInv)
           this.updateUserAssets();
         
          //   this.commonNext();
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
         this.navCtrl.pop();
        }
      else{
      let yOffset = document.getElementById("stepsCount").offsetTop;
      this.content.scrollTo(0, yOffset, 0)
      this.slides.lockSwipes(false);
      this.slides.slideTo(currentIndex-1, 500);
      this.slides.lockSwipes(true);
      this.activateBar();
      this.onSliderChange();
      }
    }
  activateBar() {
    let currentIndex = this.slides.getActiveIndex() + 1;
    let stepIndex = $('.calculator_steps .calculator_steps_com  .calculator_steps_com_num span').text();
    $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').prevAll().addClass('active');
    $('.calculator_steps .calculator_steps_com:nth-child(' + currentIndex + ')').nextAll().removeClass('active');
  }
  onSliderChange() {
    // console.log('onSliderChange');
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex == 0){this.backBtnhide = true;}
    else{ this.backBtnhide = false;}
  }

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
          // console.log(request);
          this.navCtrl.push( this.paramsData.assetsPage, {data : this.paramsData.assetsData, from: "Update Assests"});
          for (let i = 0; i < this.selectedSavInv.length; i++) {
            this.selectedSavInv[i].value = "";
          }
        }
      },
      (error) => {
        this.pageLoader = false;
      })
  }



  getUserAssetLiabilities() {
      this.pageLoader = true;
      let dummySavInvestData = [];
     
  let request = {
    "CustId": this.restapiProvider.userData['CustomerID'],
    "TokenId": this.restapiProvider.userData['tokenId']
  }
  return this.restapiProvider.sendRestApiRequest(request, 'GetUserAssetLiabilities').subscribe((response) => {
    this.pageLoader = false; 
    if (response.IsSuccess == true) {
     if( response.Data.Table.length > 0){
      dummySavInvestData =  response.Data.Table;
       for(let i = 0 ; i < this.savInvestData.length; i++){
        for(let j = 0 ; j < dummySavInvestData.length; j++){
          if(this.savInvestData[i].id == dummySavInvestData[j].id){
            this.savInvestData[i].active = true;
            $('#invest_option_grid_list' + dummySavInvestData[j].id).addClass('active');
            let pushData = {
              "IsActive" : 1,
              "active"   : true,
              "amount"   : dummySavInvestData[j].amount,
              "value"    : dummySavInvestData[j].value,
              "id"       : dummySavInvestData[j].id
            }
            this.selectedSavInv.push(pushData);
            setTimeout(()=>{
              this.changeSIInput(dummySavInvestData[j].id);
            },200)
          }
          else{
            this.savInvestData[i].active = false;
          }
        }
       }
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
