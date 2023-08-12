import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-drop-dowm-selction',
  templateUrl: 'drop-dowm-selction.html',
})
export class DropDowmSelctionPage {

  public commonList =[];
  public selectedOption : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl : ViewController) {
    console.log('category list ####################################', navParams.get('commonList'));
    this.commonList = navParams.get('commonList');
    this.selectedOption = navParams.get('selectOption');
    console.log("category list #@#@#@#@#@#@#@#", this.commonList);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DropDowmSelctionPage');
  }

  


  dismissModal() {
    if(this.selectedOption){
      this.viewCtrl.dismiss(this.selectedOption);
    }else{
      this.viewCtrl.dismiss();
    }
    
  }

}
