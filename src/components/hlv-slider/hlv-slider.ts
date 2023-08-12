import { Component,Input } from '@angular/core';
import {UtilitiesProvider} from '../../providers/utilities/utilities'
import * as $ from 'jquery';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'hlv-slider',
  templateUrl: 'hlv-slider.html'
})
export class HlvSliderComponent {
  @Input() rangeData;
  public infoPopup : boolean = false;
  public amountComma;
  constructor(public utilitiesProvider : UtilitiesProvider, private numberPipe: DecimalPipe) {
    setTimeout(() => {
      let val = this.rangeData.amount;
      let amount : number = 0;
      let amountStr : String = "";
      if(val) {
        amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
        amountStr = amount.toLocaleString('en-IN');
      }
      this.amountComma = "₹ " + amountStr;
    }, 300);
  }
  ionViewDidEnter(){
  }
  amountChange(val){
    let amount : number = 0;
    let amountStr : String = "";
    if(val) {
      amount = Number(val.toString().replaceAll(",","").replaceAll("₹","").replaceAll(" ",""));
      amountStr = amount.toLocaleString('en-IN');
    }
    this.amountComma = "₹ " + amountStr;
    this.rangeData.amount = amount;
    if( this.rangeData.steps){
      this.utilitiesProvider.rangeData = parseFloat(this.rangeData.amount);
    }else{
    if(this.rangeData.amount >= (this.rangeData.max / 3) && this.rangeData.amount <= (this.rangeData.max / 2)){
      this.rangeData.steps = 1000;
      if(typeof  this.rangeData.steps === 'number'){
        this.utilitiesProvider.rangeData = this.rangeData.amount;
      }
      else{
        this.utilitiesProvider.rangeData =parseFloat(this.rangeData.amount) ;
      }
    }
    else if(this.rangeData.amount >= (this.rangeData.max / 2) ){
    this.rangeData.steps = 2000;
    if(typeof  this.rangeData.steps === 'number'){
      this.utilitiesProvider.rangeData = this.rangeData.amount;
    }
    else{
      this.utilitiesProvider.rangeData =parseFloat(this.rangeData.amount) ;
    }
    }
    else{
      if(typeof  this.rangeData.steps === 'number'){
        this.utilitiesProvider.rangeData = this.rangeData.amount;
      }
      else{
        this.utilitiesProvider.rangeData =parseFloat(this.rangeData.amount) ;
      }
    }
    }
  }

  interst_rate(){
    this.infoPopup = !this.infoPopup;
    if(this.infoPopup == true)
    {
      $('.drop_com_comp').parents('.overlay_dropdown').addClass('overlay_dropdown_full interest_rate');
      $('.drop_com_comp').parents('.overlay_dropdown_content').wrapInner( "<div class='overlay_dropdown_content_inner'></div>");
      $('.drop_com_comp').addClass('active');
    }
    else{
      $('.drop_com_comp').removeClass('active');
      $('.drop_com_comp').parents('.overlay_dropdown').removeClass('overlay_dropdown_full interest_rate');
    }
  }
}