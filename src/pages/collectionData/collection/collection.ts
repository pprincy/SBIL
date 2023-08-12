import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
})
export class CollectionPage {
  public filterStatus:boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ArticlesPage');
    
  }
  showFilter(){
this.filterStatus = !this.filterStatus;
if(this.filterStatus == true)
{
  $('.articles_num').addClass('articles_num_overlay');
  $('.footer').addClass('footerOverlay');
  $('.header').addClass('headerOverlay');
$('.scroll-content').addClass('scrollOverlay');
}

  }

  filterHide(){
    this.filterStatus = !this.filterStatus;
    if(this.filterStatus == false)
    {
      $('.articles_num').removeClass('articles_num_overlay');
      $('.footer').removeClass('footerOverlay');
      $('.header').removeClass('headerOverlay');
      $('.scroll-content').removeClass('scrollOverlay');
    } 
  }
  articleDetails(){
    this.navCtrl.push('ArticleDetailsPage');
  }

  goNotificationList(){
    this.navCtrl.push('NotificationPage');
  }
}

