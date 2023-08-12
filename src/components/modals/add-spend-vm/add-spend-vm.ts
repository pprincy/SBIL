import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { config } from '../../../shared/config';


@IonicPage()
@Component({
  selector: 'page-add-spend-vm',
  templateUrl: 'add-spend-vm.html',
})
export class AddSpendVmPage {

  public categoryList =[];
  public imgURLNew;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController) {
      this.imgURLNew = config.imgURLNew;
      console.log('category list ####################################', navParams.get('customerList'));
    this.categoryList = navParams.get('customerList');
    console.log("category list #@#@#@#@#@#@#@#", this.categoryList);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddSpendVmPage');
  }

  selectCategory(catId){
    console.log("category select", catId);
    this.dismissModal(catId);
  }


  dismissModal(data) {
    if(data){
      this.viewCtrl.dismiss(data);
    }else{
      this.viewCtrl.dismiss();
    }
    
  }

  
}
