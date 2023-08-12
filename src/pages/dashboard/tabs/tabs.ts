import { Component, ViewChild } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import {UtilitiesProvider} from '../../../providers/utilities/utilities';
import * as $ from 'jquery';
import { Network } from '@ionic-native/network';

@Component({
  templateUrl: 'tabs.html',
  selector: 'page-tabs',
})
export class TabsPage {
  tab1Root = 'DiscoverPage';
  tab2Root = 'PlanPage';
  public pageLoader : boolean = true;
  rootTabs;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider : UtilitiesProvider,
    private network: Network
    ) {
    if(this.restapiProvider.userData['defaultData']){
      this.utilitiesProvider.defaultData =  JSON.parse(this.restapiProvider.userData['defaultData']);
    }
    this.makeActiveTabs(this.utilitiesProvider.tabsActive)
  }
  
showLoader(){
  if (this.network.type === 'none') {
  }else{
    this.pageLoader = true;
  }
}
  
hideLoader(){
  this.pageLoader = false;
 }
 makeActiveTabs(type){
  this.rootTabs = type;
 }
}
