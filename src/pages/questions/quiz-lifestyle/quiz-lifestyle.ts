import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { Network } from '@ionic-native/network';
import '../../../assets/lib/slick/slick.min.js';
import 'bootstrap';
import * as Tour from 'bootstrap-tour';
import * as $ from 'jquery';
window["$"] = $;
window["jQuery"] = $;
import { TabsPage } from '../../dashboard/tabs/tabs';
import { UtilitiesProvider } from '../../../providers/utilities/utilities'
import { MyApp } from '../../../app/app.component';
@IonicPage()
@Component({
  selector: 'page-quiz-lifestyle',
  templateUrl: 'quiz-lifestyle.html',
})

export class QuizLifestylePage {
  private backButton: boolean = false;
  public profileData: any = {};
  public IncomeGroupID;
  public MaritialStatus;
  public incomeData: any = [];
  public pageLoader: boolean = false;
  public tour = new Tour();
  public isDisable: boolean = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    private network: Network,
    public platform: Platform,
    public utilitiesProvider: UtilitiesProvider,
    public myApp: MyApp) {
    if (this.navParams.data == 'Login') {
      this.backButton = false;
      // this.navCtrl.swipeBackEnabled = false;
    }
    else {
      this.backButton = true;
    }
  }
  ionViewDidLeave() {
    this.tour.ended();
  }
  ionViewDidLoad() {
    if (this.restapiProvider.userData['userPersonalDetails']) {
      this.profileData = JSON.parse(this.restapiProvider.userData['userPersonalDetails']).Table[0];
      this.MaritialStatus = (this.profileData.MaritialStatus).toLowerCase();
      this.IncomeGroupID = this.profileData.IncomeGroupID;
    }
    if (this.restapiProvider.userData['GetMasters']) {
      this.incomeData = JSON.parse(this.restapiProvider.userData['GetMasters']).Table;
    }
    setTimeout(() => {
      var incomeVal = this.IncomeGroupID + 1;
      $('.knowabout_container .knowabout_grid .row .col:nth-child(' + incomeVal + ')').trigger('click');
      var that = this;
      $('.knowabout_slider_wrapper > div').each(function () {
        var lifestage_txt = $(this).find('.knowabout_slider_item').text();
        lifestage_txt = lifestage_txt.toLowerCase();
        if (lifestage_txt == that.MaritialStatus) {
          $(this).not('.slick-cloned').trigger('click');
        }
      });
      setTimeout(() => {
        this.tourFunction();
      }, 500)
    }, 500)
    $('#prv-knowabout_slider').on('click', function () {
      var last = $('.knowabout_slider_wrapper > div:last');
      $('.knowabout_slider_wrapper > div:first').before(last);
      $('.knowabout_container .knowabout_slider .knowabout_slider_wrapper > div:nth-child(2)').trigger('click');
    });
    $('#nxt-knowabout_slider').on('click', function () {
      var first = $('.knowabout_slider_wrapper > div:first');
      $('.knowabout_slider_wrapper > div:last').after(first);
      $('.knowabout_container .knowabout_slider .knowabout_slider_wrapper > div:nth-child(3)').trigger('click');
    });
    $('.knowabout_container .knowabout_grid .row:nth-child(2) .col').click(function (e) {
      $('#prv-knowabout_slider').trigger('click');

    });
    $('.knowabout_container .knowabout_grid .row:nth-child(5) .col').click(function (e) {
      $('#nxt-knowabout_slider').trigger('click');
    });
    var var_active = "";
    $('.knowabout_container .knowabout_grid .row:nth-child(1) .col,.knowabout_container .knowabout_grid .row:nth-child(2) .col,.knowabout_container .knowabout_grid .row:nth-child(3) .col,.knowabout_container .knowabout_grid .row:nth-child(4) .col,.knowabout_container .knowabout_grid .row:nth-child(5) .col').click(function (e) {
      var rowindex = $(this).parent().index();
      var curindex = $(this).index() + 1;
      var_active = $('.knowabout_container .knowabout_grid .row.var_active').length;
      if (rowindex == 1) {
        $(this).parent().next('.row').addClass('hor_active').nextAll('.row').addClass('var_active');
        $(this).parent().next('.row').addClass('hor_active').nextAll('.row').find('.col').removeClass('active active_bdr');
        $(this).parent().next('.row').addClass('hor_active').prevAll('.row').find('.col').removeClass('active active_bdr');
        $(this).parent().next('.row').addClass('hor_active').prevAll('.row').find('.col:nth-child(' + curindex + ')').addClass('active_bdr');
        $(this).parent().next('.row').addClass('hor_active').prevAll('.row').removeClass('var_active');
        $(this).parent().next('.row').addClass('hor_active').find('.col:nth-child(' + curindex + ')').addClass('active active_bdr');
        $(this).parent().next('.row').addClass('hor_active').find('.col:nth-child(' + curindex + ')').prevAll('.col').addClass('active_bdr').removeClass('active');
        $(this).parent().next('.row').addClass('hor_active').find('.col:nth-child(' + curindex + ')').nextAll('.col').removeClass('active_bdr active');
        $(this).parent().next('.row').siblings('.row').removeClass('hor_active');
      }
      else if (rowindex == 2 || rowindex == 3) {
        $(this).parent().addClass('hor_active').nextAll('.row').addClass('var_active');
        $(this).parent().addClass('hor_active').nextAll('.row').find('.col').removeClass('active active_bdr');
        $(this).parent().addClass('hor_active').prevAll('.row').find('.col').removeClass('active active_bdr');
        $(this).parent().addClass('hor_active').prevAll('.row').find('.col:nth-child(' + curindex + ')').addClass('active_bdr');
        $(this).parent().addClass('hor_active').prevAll('.row').removeClass('var_active');
        $(this).parent().addClass('hor_active').find('.col:nth-child(' + curindex + ')').addClass('active active_bdr');
        $(this).parent().addClass('hor_active').find('.col:nth-child(' + curindex + ')').prevAll('.col').addClass('active_bdr').removeClass('active');
        $(this).parent().addClass('hor_active').find('.col:nth-child(' + curindex + ')').nextAll('.col').removeClass('active_bdr active');
        $(this).parent().siblings('.row').removeClass('hor_active');
        $('.knowabout_slider_wrapper > div:nth-child(' + rowindex + ')').addClass('active').siblings().removeClass('active');
      }
      else if (rowindex == 4) {
        $(this).parent().prev('.row').addClass('hor_active').nextAll('.row').addClass('var_active');
        $(this).parent().prev('.row').addClass('hor_active').nextAll('.row').find('.col').removeClass('active active_bdr');
        $(this).parent().prev('.row').addClass('hor_active').prevAll('.row').find('.col').removeClass('active active_bdr');
        $(this).parent().prev('.row').addClass('hor_active').prevAll('.row').find('.col:nth-child(' + curindex + ')').addClass('active_bdr');
        $(this).parent().prev('.row').addClass('hor_active').prevAll('.row').removeClass('var_active');
        $(this).parent().prev('.row').addClass('hor_active').find('.col:nth-child(' + curindex + ')').addClass('active active_bdr');
        $(this).parent().prev('.row').addClass('hor_active').find('.col:nth-child(' + curindex + ')').prevAll('.col').addClass('active_bdr').removeClass('active');
        $(this).parent().prev('.row').addClass('hor_active').find('.col:nth-child(' + curindex + ')').nextAll('.col').removeClass('active_bdr active');
        $(this).parent().prev('.row').siblings('.row').removeClass('hor_active');
      }
    });
    $('.knowabout_container .knowabout_slider .knowabout_slider_wrapper > div').click(function () {
      var divindex = $(this).index() + 2;
      $(this).addClass('active').siblings().removeClass('active');
      var curlen = $('.knowabout_container .knowabout_grid .row.hor_active').length;
      var var_active = $('.knowabout_container .knowabout_grid .row.var_active').length;
      var act_bdr_len = $('.knowabout_container .knowabout_grid .row.hor_active').find('.active_bdr').length;
      if (curlen < 1) {
        $('.knowabout_container .knowabout_grid .row:nth-child(' + divindex + ')').addClass('hor_active').siblings().removeClass('hor_active');
        $('.knowabout_container .knowabout_grid .row:nth-child(' + divindex + ')').addClass('hor_active').siblings().find('.col:nth-child(2),.col:nth-child(3),.col:nth-child(4),.col:nth-child(5),.col:nth-child(6)').removeClass('active_bdr');
        $('.knowabout_container .knowabout_grid .row:nth-child(' + divindex + ')').addClass('hor_active').find('.col:nth-child(2),.col:nth-child(3),.col:nth-child(4),.col:nth-child(5),.col:nth-child(6)').addClass('active_bdr');
      }
      else {
        if (var_active > 0) {
          for (var i = 1; i <= act_bdr_len; i++) {
            $('.knowabout_container .knowabout_grid .row:nth-child(' + divindex + ')').addClass('hor_active').find('.col:nth-child(' + i + ')').addClass('active_bdr');
            if (i == act_bdr_len) {
              $('.knowabout_container .knowabout_grid .row:nth-child(' + divindex + ')').addClass('hor_active').siblings().removeClass('hor_active');
              $('.knowabout_container .knowabout_grid .row:nth-child(' + divindex + ')').addClass('hor_active').siblings().find('.col').removeClass('active active_bdr');
              $('.knowabout_container .knowabout_grid .row:nth-child(' + divindex + ')').addClass('hor_active').siblings().find('.col:nth-child(' + i + ')').prevAll('.col').removeClass('active_bdr');
              $('.knowabout_container .knowabout_grid .row:nth-child(' + divindex + ')').addClass('hor_active').find('.col:nth-child(' + i + ')').addClass('active');
              $('.knowabout_container .knowabout_grid .row:nth-child(' + divindex + ')').addClass('hor_active').prevAll('.row').find('.col:nth-child(' + i + ')').addClass('active_bdr');
              $('.knowabout_container .knowabout_grid .row:nth-child(' + divindex + ')').addClass('hor_active').prevAll('.row').find('.col:nth-child(' + i + ')').prevAll('.col').removeClass('active_bdr');
              $('.knowabout_container .knowabout_grid .row:nth-child(' + divindex + ')').addClass('hor_active').nextAll('.row').find('.col:nth-child(' + i + ')').prevAll('.col').removeClass('active_bdr');
              $('.knowabout_container .knowabout_grid .row:nth-child(' + divindex + ')').addClass('hor_active').find('.col:nth-child(' + i + ')').nextAll('.col').removeClass('active_bdr');
            }
          }
        }
        else {
          $('.knowabout_container .knowabout_grid .row:nth-child(' + divindex + ')').addClass('hor_active').siblings().removeClass('hor_active');
          $('.knowabout_container .knowabout_grid .row:nth-child(' + divindex + ')').addClass('hor_active').siblings().find('.col').removeClass('active_bdr active');
          $('.knowabout_container .knowabout_grid .row:nth-child(' + divindex + ')').addClass('hor_active').find('.col:nth-child(2),.col:nth-child(3),.col:nth-child(4),.col:nth-child(5),.col:nth-child(6)').addClass('active_bdr');
        }
      }
    });
    setTimeout(() => {
      this.isDisable = false;
    }, 2000);
  }
  tapEvent(e) {
  }
  swipeEvent(e) {
    if (e.direction == 8) {
      $('#nxt-knowabout_slider').trigger('click');
    }
    else if (e.direction == 16) {
      $('#prv-knowabout_slider').trigger('click');
    }
  }
  back() {
    this.navCtrl.pop();
  }
  discoverClick() {
    if (this.network.type === 'none') {
      this.restapiProvider.noInternetPromt();
    }
    else {
      this.pageLoader = true;
      let incomeGroups = parseInt($('.knowabout_container .knowabout_grid .row .col.active_bdr').find('span').attr('id'));
      if (incomeGroups) {
        let lifeStyle = $('.knowabout_slider .knowabout_slider_wrapper .active .knowabout_slider_item span').text();
        let income = $('.knowabout_grid .active_bdr .annual_range').text();
        this.restapiProvider.userData['incomeGroup'] = parseInt($('.knowabout_container .knowabout_grid .row .col.active_bdr').find('span').attr('id'));
        this.restapiProvider.userData['maritialStatus'] = lifeStyle;
        this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
        let requestUpdateProfile = {
          "LoginSource": "APP",
          "CustId": this.restapiProvider.userData['CustomerID'],
          "Gender": this.restapiProvider.userData['gender'],
          "MPIN": " ",
          "MpinType": " ",
          "Age": this.restapiProvider.userData['age'],
          "MaritalStatus": this.restapiProvider.userData['maritialStatus'],
          "IncomeGroup": this.restapiProvider.userData['incomeGroup'],
          "SegmentId": null,
          "OccupationId": this.restapiProvider.userData['occupationID'],
          "PersonaId": null,
          "TokenId": this.restapiProvider.userData['tokenId'],
          "Image": this.restapiProvider.userData['profileImg']
        }
        this.restapiProvider.sendRestApiRequest(requestUpdateProfile, 'updateProfile')
          .subscribe((response) => {
            this.pageLoader = false;
            if (response.IsSuccess == true) {
              this.restapiProvider.userData['isLogin'] = "Yes";
              this.restapiProvider.userData['MPINTYPE'] = '';
              this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
              if (this.platform.is('core') || this.platform.is('mobileweb')) {
                localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData))
              }
              this.myApp.updatePageUseCount("5");
              this.utilitiesProvider.googleAnalyticsTrackView('Question LifeStyle');
              this.navCtrl.setRoot(TabsPage);
            }
          }, (error) => {
            this.pageLoader = false;
          })
      }
      else {
        this.pageLoader = false;
      }
    }
  }
  tourFunction() {
    let that = this;
    // Instance the tour
    that.tour = new Tour({
      backdrop: true,
      template: "<div class='tour_popup popover tour'><div class='fingure_arrow'><img src='assets/imgs/lifeStyle/fingure.png'/></div><h3 class='popover-title'></h3></div>",
      steps: [
        {
          element: ".knowabout_grid >.row:first-child ",
          title: that.utilitiesProvider.langJsonData["quizLifeStyle"]["hintOne"],
          placement: "bottom",
          content: ""
        },
        {
          element: ".knowabout_slider_wrapper > div:nth-child(2) img",
          title: that.utilitiesProvider.langJsonData["quizLifeStyle"]["hintTwo"],
          placement: "right",
          content: ""
        }
      ],
      onStart: function (tour) {
        $('body').append('<span class="proceed_tour"> ' + that.utilitiesProvider.langJsonData["quizLifeStyle"]["clickAnywhere"] + ' </span>');
      },
      onShown: function () {
        $('body > div,body .proceed_tour').click(function () {
          that.tour.next();
          if ($('body').find('.tour-tour-1').length != 0) {
            $('body').find('.proceed_tour').remove();
          }
        });
      }
    });
    // Initialize the tour
    that.tour.init();
    that.tour.start();
    that.tour.restart();
  }
}
