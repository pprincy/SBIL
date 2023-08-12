import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import  '../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';


@IonicPage()
@Component({
  selector: 'page-collection-details',
  templateUrl: 'collection-details.html',
})
export class CollectionDetailsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ArticleDetailsPage');
    setTimeout(function(){
     
     $('.recommend_for_your_cont_slider').slick({
       focusOnSelect: true, dots: false,infinite: true,
       speed: 300,cssEase: 'linear', slidesToShow: 2,centerPadding:'20px',
       slidesToScroll: 1,centerMode: true,arrows: false
     }); 
     
     },500);
  }

  goNotificationList(){
    this.navCtrl.push('NotificationPage');
  }
}
