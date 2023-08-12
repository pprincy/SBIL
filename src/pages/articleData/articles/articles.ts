import { Component, ViewChild, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { RestapiProvider } from '../../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { Keyboard } from '@ionic-native/keyboard';
import '../../../assets/lib/slick/slick.min.js';
import * as $ from 'jquery';
import {MyApp} from '../../../app/app.component';
@IonicPage()
@Component({
  selector: 'page-articles',
  templateUrl: 'articles.html',
})
export class ArticlesPage {
  public filterStatus:boolean = false;
  public imgURL: string;
  public allCategoriesList: any = [];
  public allArticlesList: any = [];
  public categoryIDArr: any = [];
  public source: any;
  public header: string;
  public categoryID;
  public articleCount: any = 0;
  public categoriesChecked: number = 0;
  public loading: any;
  public keyboardShow: boolean = false;
  public pageLoader : boolean = false;
  public isArticles : boolean = true;
  public loadMore : boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private restapiProvider: RestapiProvider,
              public utilitiesProvider: UtilitiesProvider,
              private loadingCtrl: LoadingController,
              private keyboard: Keyboard,
              public myApp : MyApp) {
    this.source = this.navParams.get("source");
   
    this.header = this.navParams.get("header");
    this.categoryID = this.navParams.get("categoryID");
    this.imgURL = this.restapiProvider.getImageURL();
    if(this.categoryID != ""){
      this.categoryIDArr.push(parseInt(this.categoryID));
    }
  }
  ionViewDidEnter() {
    // this.getArticlesByCategory();

    this.utilitiesProvider.upshotScreenView('Collection');
    this.utilitiesProvider.upshotTagEvent('Collection');
  }
  
  ionViewDidLoad(){
    this.getArticlesByCategory();

    this.myApp.updatePageUseCount("38");
    this.utilitiesProvider.googleAnalyticsTrackView('Article listing');
  }
  getArticlesByCategory(){
    if(this.source != "Trends") {
      this.categoriesChecked++;
      this.getArticleList();
    }
    else {      
      this.getAllArticles();
    }
    this.getAllCategories();
  }

  getArticleList() {
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId":this.restapiProvider.userData['tokenId'],
      "TagId":this.categoryID
    }
    this.restapiProvider.sendRestApiRequest(request,'ArticleListingByTags').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        if(response.Data.Table.length > 0){
        this.allArticlesList = response.Data.Table;
        this.articleCount = this.allArticlesList.length;
        this.isArticles = true;
        }
        else{
          this.isArticles = false;
        }
      }
      else {
        // console.log(response);
      }
    },
      (error) => {
        this.loading.present().then(() => {
          this.loading.dismiss();
        });
      });
  }

  processArticlesList(){
    for(let i = 0;i < this.allCategoriesList.length; i++){
      if(this.allCategoriesList[i].ID == this.categoryID){
        this.allCategoriesList[i]['checked'] = true
      }
      else{
        this.allCategoriesList[i]['checked'] = false
      }
    }
  }

  getAllCategories(){
    let request = {};
        this.restapiProvider.sendRestApiRequest(request , 'CollectionMaster').subscribe((response) => {
      // this.loaderHide();
      if (response.IsSuccess == true) {
        this.allCategoriesList = response.Data.Table;
        // console.log("CategoryID: ",this.categoryID);
        // console.log(this.allCategoriesList);
        this.processArticlesList();
      }
      else {
        // console.log(response);
      }
    },
      (error) => {
        this.pageLoader = false;
      });
  }
  
  getAllArticles(){
    this.pageLoader = true;
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId":this.restapiProvider.userData['tokenId'],
      "TopCount":"0"
    }
    this.restapiProvider.sendRestApiRequest(request,'ArticleList').subscribe((response) => {
      this.pageLoader = false;
      if (response.IsSuccess == true) {
        if(response.Data.Table.length > 0){
          this.allArticlesList = response.Data.Table;
          this.isArticles = true;
        }
        else{
          this.isArticles = false;
        }
      }
      else {
        // console.log(response);
      }
    },
      (error) => {
        this.pageLoader = false;
      });
  }

  changeCategory(event, categoryID) {
    if(event.checked){
      this.categoriesChecked++;
      this.categoryIDArr.push(parseInt(categoryID))
    }
    else{
      var index = this.categoryIDArr.indexOf(parseInt(categoryID));
      if(index > -1){
        this.categoryIDArr.splice(index,1)
        this.categoriesChecked--;
      }
    }
    for(let i = 0;i < this.allCategoriesList.length; i++){
      if(this.allCategoriesList[i].ID == categoryID){
        this.allCategoriesList[i]['checked'] = event.checked;
        break;
      }
    }
    this.changeHeader();
    // console.log(this.allCategoriesList)
  }

  showFilter(){
    this.filterStatus = !this.filterStatus;
    if(this.filterStatus == true)
      {
        $('.articles_num').addClass('articles_num_overlay');
        $('.footer').addClass('footerOverlay');
      }
    }
  
  changeHeader() {
    if(this.categoryIDArr.length == 1){
      for(let i = 0; i < this.allCategoriesList.length; i++){
        if(this.categoryIDArr[0] == this.allCategoriesList[i].ID){
          this.header = this.allCategoriesList[i].Name;
          break;
        }
      }
    }
    else{
      this.header = this.utilitiesProvider.langJsonData['collections']['collections'];
    }
  }

  cancelSelection() {
    this.categoryIDArr = [];
    var tempCategoryIDArr = [];
    this.categoriesChecked = 0;
    if(this.categoryID == ""){
     tempCategoryIDArr = []
    }
    else{
      tempCategoryIDArr = this.categoryID.toString().split(',');
    }
    for(let i = 0; i < tempCategoryIDArr.length ; i++){
      this.categoryIDArr.push(parseInt(tempCategoryIDArr[i]));
    }
    for(let j = 0;j < this.allCategoriesList.length; j++){
      var found = false;
      for(let k = 0; k < this.categoryIDArr.length; k++){
        if(this.allCategoriesList[j].ID == this.categoryIDArr[k]){
          found = true;
          this.allCategoriesList[j]['checked'] = true;
          this.categoriesChecked++;
          break;
        }
      }
      if(!found){
        this.allCategoriesList[j]['checked'] = false;
      }
    }
    this.changeHeader();
    this.filterStatus = !this.filterStatus;
      if(this.filterStatus == false)
      {
        $('.articles_num').removeClass('articles_num_overlay');
        $('.footer').removeClass('footerOverlay');
      }
  }

  finalSelection(){
    if(this.categoryIDArr.length == 0){
      this.restapiProvider.presentToastTop("Please select at least one topic from the list");
      return;
    }
    else{
      this.categoryID = '';
      for(let i = 0; i < this.categoryIDArr.length; i++) {
        if(i == (this.categoryIDArr.length - 1)){
          this.categoryID = this.categoryID + this.categoryIDArr[i].toString();
        }
        else{
          this.categoryID = this.categoryID + this.categoryIDArr[i].toString()+",";
        }
      }
      this.filterStatus = !this.filterStatus;
      if(this.filterStatus == false)
      {
        $('.articles_num').removeClass('articles_num_overlay');
        $('.footer').removeClass('footerOverlay');
      }
    }
    this.changeHeader();
    this.getArticleList(); 
  }


  articleDetails(article){
    this.navCtrl.push('ArticleDetailsPage', {data: article.ArticleID, fromPage: 'Collection'});
  }
  goNotificationList(){
    this.navCtrl.push('NotificationPage');
  }
  search(){
    this.navCtrl.push('SearchPage');
  }

  LoadMore(){
    this.loadMore = true;
  }
  
}
