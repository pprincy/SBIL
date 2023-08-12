import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import '../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities'
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { MyApp } from '../../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-quiz-age',
  templateUrl: 'quiz-age.html',
})
export class QuizAgePage {
  private ageBar: any = [];
  private backButton: boolean = false;
  public username;
  public mobile;
  public profileImage;
  public profileImageError;
  public loading: any;
  public occupationList: any[];
  public OccupationID;
  public OccupationName;
  public profileData: any = {};
  public selectedOccupation;
  public pageLoader: boolean = false;
  public postProfileImage: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
    private imagePicker: ImagePicker,
    private loadingCtrl: LoadingController,
    public platform: Platform,
    public myApp: MyApp) {
    this.username = this.restapiProvider.userData['customerName'];
    this.mobile = this.navParams.get('data').method;
    this.profileImage = 'data:image/png;base64,' + this.restapiProvider.userData['profileImg'];
    this.profileImageError = ""
    if (this.restapiProvider.userData['GetMasters']) {
      this.occupationList = JSON.parse(this.restapiProvider.userData['GetMasters']).Table1;
    }
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      localStorage.setItem("userData", JSON.stringify(this.restapiProvider.userData))
    }
  }
  ionViewDidLoad() {
    if (this.restapiProvider.userData['userPersonalDetails']) {
      this.profileData = JSON.parse(this.restapiProvider.userData['userPersonalDetails']).Table[0];
      this.selectedOccupation = this.profileData.OccupationID;
    }
    //this.GetMasters()
    this.ageBar = this.utilitiesProvider.age18;
    if (!this.profileImage) {
      this.profileImage = this.profileImageError;
      this.restapiProvider.userData['profileImg'] = this.profileImage;
    }
    this.ageBarFunction()
  }
  ageBarFunction() {
    setTimeout(() => {
      $('.tell_us_slider').not('.slick-initialized').slick({
        focusOnSelect: true,
        dots: false,
        infinite: true,
        speed: 300,
        cssEase: 'linear',
        slidesToShow: 7,
        slidesToScroll: 5,
        centerMode: true,
        variableWidth: true,
        arrows: false
      });
    }, 100);
    setTimeout(() => {
      let userAge;
      if (this.restapiProvider.userData['age'] == null || this.restapiProvider.userData['age'] == undefined) {
        userAge = 18;
      }
      else {
        userAge = parseInt(this.restapiProvider.userData['age']);
      }
      $(".tell_us_slider div").each(function () {
        var curAge = parseInt($(this).find('.tell_us_slider_age').text());
        if (curAge == userAge) {
          $(this).not('.slick-cloned').trigger('click');
        }
      })
    }, 500);
  }
  yesItsMe() {
    this.myApp.updatePageUseCount("4");
    this.utilitiesProvider.googleAnalyticsTrackView('Question Age');
    this.restapiProvider.userData['age'] = $(".tell_us_slider .slick-current .tell_us_slider_age").text();
    this.restapiProvider.userData['occupationID'] = this.selectedOccupation;
    this.navCtrl.push('QuizLifestylePage');
  }
  goBack() {
    this.restapiProvider.userData['age'] = null;
    this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
    this.navCtrl.setRoot('HomePage', 'Skip');
  }
  uploadImg() {
    const options: ImagePickerOptions = {
      quality: 100,
      maximumImagesCount: 1,
      width: 450,
      height: 270,
      outputType: 0
    }
    this.imagePicker.getPictures(options).then((results) => {
      if (results && results != "OK" && results.length > 0) {
        this.utilitiesProvider.cropImg(results[0]).then((cropResults) => {
          if (cropResults.status == 'success') {
            this.postProfileImage = cropResults.img;
            this.updateUserImage();
          }
        }, (err) => {
          this.postProfileImage = results[0];
          this.updateUserImage();
        });
      }
    }, (err) => {
    });
  }
  occupationClick(o) {
    this.OccupationID = o.OccupationID;
    this.OccupationName = o.OccupationName;
  }
  GetMasters() {
    this.pageLoader = true;
    let request = {
      "IsCache": false,
      'TokenId': this.restapiProvider.userData['tokenId']
    }
    return this.restapiProvider.sendRestApiRequest(request, 'GetMasters')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          this.restapiProvider.userData['GetMasters'] = JSON.stringify(response.Data);
          this.restapiProvider.storeData(this.restapiProvider.userData, 'userData');
          this.occupationList = response.Data.Table1;
          this.restapiProvider.userData['appDataMaster'] = JSON.stringify(response.Data);
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
  errorPic() {
    if (this.restapiProvider.userData['gender'] == "Male" || this.restapiProvider.userData['gender'] == "") {
      this.profileImage = this.utilitiesProvider.noProfileImg;
    }
    else {
      this.profileImage = this.utilitiesProvider.noProfileImgFemale;
    }
  }
  updateUserImage() {
    this.pageLoader = true;
    let request = {
      "CustID": this.restapiProvider.userData['CustomerID'],
      "TokenID": this.restapiProvider.userData['tokenId'],
      "Image": this.postProfileImage
    }
    return this.restapiProvider.sendRestApiRequest(request, 'UpdateUserImage')
      .subscribe((response) => {
        this.pageLoader = false;
        if (response.IsSuccess == true) {
          this.profileImage = this.postProfileImage;
          this.restapiProvider.userData['profileImg'] = this.profileImage;
          this.postProfileImage = "";
        }
      },
        (error) => {
          this.pageLoader = false;
        })
  }
}
