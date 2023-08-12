import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides } from 'ionic-angular';
import * as $ from 'jquery';
import { RestapiProvider } from '../../providers/restapi/restapi';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  @ViewChild(Content) content: Content;
  public steps = 100;
  public amount;
  public minValue;
  public maxValue;
  public isBtnActive: boolean = false;
  public status: boolean = false;
  public postJson: any = {};
  public backBtnhide: boolean = true;
  public carList: any = [];
  public imgURL;
  public resentArticle: any = [];
  public trandingSearch: any = [];
  @ViewChild(Slides) slides: Slides;
  public scrollHeight;
  public pageLoader: boolean = false;
  public search;
  public goalsSearchList: any = [];
  public timerStart: boolean = false;
  public timer: any;
  public goalsResentId: any = [];
  public noSearch: boolean = false;
  public isCancel: boolean = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private restapiProvider: RestapiProvider,
    public utilitiesProvider: UtilitiesProvider,
  ) {
    this.imgURL = this.restapiProvider.getImageURL();
    if (localStorage.getItem("resentGoalIds")) {
      this.goalsResentId = JSON.parse(localStorage.getItem("resentGoalIds"));
    }
  }
  ionViewDidEnter() {
    this.splitArray();
    this.imgURL = this.restapiProvider.getImageURL();
    let a = $('.scroll_div .scroll-content,.scroll_div .fixed-content').attr('style')
    if (a) {
      this.scrollHeight = a;
    }
    // this.userRecentArticlesList();
    if (localStorage.getItem("resentGoalIds")) {
      this.userRecentArticlesList();
      console.log("resentgoalIds");
    }

   this.utilitiesProvider.upshotScreenView('Search');
  }

  goBack() {
    this.navCtrl.pop();
  }
  userRecentArticlesList() {
    let request = {
      "CustId": this.restapiProvider.userData['CustomerID'],
      "TokenId": this.restapiProvider.userData['tokenId'],
      "ArticleId": this.splitArray()
    }
    this.restapiProvider.sendRestApiRequest(request, 'UserRecentArticlesList').subscribe((response) => {
    //   response = {
    //     "Type": "SUCCESS",
    //     "IsSuccess": true,
    //     "Data": {
    //         "Table": [
    //             {
    //                 "ArticleID": 1201,
    //                 "CatID": 3,
    //                 "CatName": "Article",
    //                 "Title": "Conservative Balanced or Risk Taker – What Type of Investor Are You?",
    //                 "ShortDesc": "Before investing your money, take a while to first determine what’s your risk appetite?",
    //                 "LongDesc": "<p>Before investing your money, take a while to firstdetermine what&rsquo;s your risk appetite? For most individuals, risk appetite depends on factors like age, income, liabilities, and knowledge of financial instruments. There is no ideal risk appetite; it depends on what suits your needs and the type of investor you are. <br />Here are three types of investors to help you understand what category you belong to:<br />Conservative Investors<br />These are individuals with low financial risk appetite; they are sensitive to the fluctuations in the returns their investment makes. They tend to stay away from the complex investments and those which are volatile. They are willing to accept lower returns as long as they are assured of the safety of the amount invested. Investments are typically in Government issued bonds, bank fixed deposits, money market/Liquid funds, Endowment products, and short-term mutual funds like liquid funds.<br />Balanced Investors<br />These include investors who wish to take a step ahead of conservative investors but require stability. They are willing to take absorb some risk in lieu of better returns. They invest in avenues like corporate bonds, debt funds, balanced funds, real estate for assured returns.<br />The Risk Takers<br />These are usually investors who have immense knowledge about various financial instruments. They primarily invest in direct equity markets, Equity oriented Mutual funds,other investments that have high risk and offer exponential returns. Investment in sectoral funds like auto, pharma, and banking, forex trading, commodity and derivative trading also find favour with such investors.<br />To sum up<br />It is important is to determine one&rsquo;s risk appetite first, and then decide where to invest your money. Since, there are several financial instruments catering to various investment needs having a diversified investment portfolio will help fulfil your financial goals.</p>",
    //                 "SmallImage": null,
    //                 "BigImage": "/Images/ArticleImages/Article_Big_100518151954.jpg",
    //                 "Keyword": "savings, types of investor, risk"
    //             },
    //             {
    //                 "ArticleID": 4414,
    //                 "CatID": 3,
    //                 "CatName": "Article",
    //                 "Title": "Budget 2021: India Inc seeks single income tax structure, lower slab rates for individual tax payers",
    //                 "ShortDesc": "India Inc has sought reintroduction of the single structure of income tax, instead of the dual structure at present that gives two",
    //                 "LongDesc": "India Inc has sought reintroduction of the single structure of income tax, instead of the dual structure at present that gives two options to taxpayers, as compliance on withholding tax has become a complex process for employers, leading to higher cost and tax leakages.\r\nIn the previous Budget, Finance Minister Nirmala Sitharaman had introduced a new tax regime where individual and Hindu undivided families could pay income tax at lower slab rate from April 1, 2020, provided they didn’t take any tax exemptions, or pay at the existing rates after availing of the exemptions. \r\n\r\nTaxpayers were to choose one of the options at the beginning of the year, but would be able to change it at the time of filing returns, which is expected in July 2021. \r\n\r\n“For a vast country like India, it has created more confusion for the taxpayer than a relief … it has further made withholding tax compliance complex for the employer,” – CII.\r\nFurther, CII has sought lower tax rates for individuals to tide over job losses some may have faced during the Covid-19 pandemic. As most of employees have faced reductions in salary. Pandemic has impacted the financial positions of individuals badly.\r\nTaking into consideration rising food inflation over the last decade, the CII suggested that the current exemption of Rs 50 per meal per employee if the employer is providing food to be increased to Rs 200. The exemption that exists for paper vouchers should be extended also to digital vouchers.\r\nOn the corporate side, industry has sought that limited liability partnerships and companies be taxed at the same rate of 25% instead of LLPs getting taxed at 30%. The change will help investors select the optimal governance model and remove any confusion, it said.\r\nThe setoff period of losses for companies that have a gestation period of more than 10 years, should be extended to 15 years from the current limit of eight year\r\n\r\nSource: https://www.timesnownews.com/business-economy/economy/article/budget-2021-india-inc-seeks-single-income-tax-structure-lower-slab-rates-for-individual-tax-payers/701391\r\n",
    //                 "SmallImage": null,
    //                 "BigImage": "/Images/ArticleImages/Article_Big_220121110447.png",
    //                 "Keyword": null
    //             }
    //         ]
    //     },
    //     "Message": "",
    //     "StatusCode": null
    // }
      if (response.IsSuccess == true) { 
        this.resentArticle = response.Data.Table;
        if (this.resentArticle.length < 1) {
          this.resentArticle = [];
        }
      }
      else {
      }
    },
      (error) => {
      });
  }
  searchFun() {
    if (this.timerStart) {
      clearTimeout(this.timer);
    }
    if (this.search != "" && this.search.length > 2) {
      this.isCancel = false;
      this.searchArticle();
    }
    else {
      this.trandingSearch = [];
      this.goalsSearchList = [];
      this.noSearch = false;
      this.isCancel = true;

    }
  }
  searchArticle() {
    this.timerStart = true;
    this.timer = setTimeout(() => {
      let request = {
        "CustId": this.restapiProvider.userData['CustomerID'],
        "TokenId": this.restapiProvider.userData['tokenId'],
        "SearchText": this.search
      }
      this.restapiProvider.sendRestApiRequest(request, 'SearchArticle').subscribe((response) => {
        this.isCancel = true;
        if (response.IsSuccess == true) {
          this.goalsSearchList = response.Data.Table
          this.trandingSearch = response.Data.Table1;
          if (this.goalsSearchList.length < 1 && this.trandingSearch.length < 1) {
            this.noSearch = true;
          }
          else {
            this.noSearch = false;
          }
        }
        else {
        }
      },
        (error) => {
          this.isCancel = true;
        });
    }, 1500)
  }
  goArticle(r) {
    this.resentArray(r.ArticleID);
    this.navCtrl.push('ArticleDetailsPage', { data: r.ArticleID });
  }
  goalGo(p) {
    if (p.GoalTypeID == 6) { this.navCtrl.push('CargoalPage', { pageFrom: 'Search' }); }
    if (p.GoalTypeID == 3) { this.navCtrl.push('HomeGoalPage', { pageFrom: 'Search' }); }
    if (p.GoalTypeID == 2) { this.navCtrl.push('ChildEducationPage', { pageFrom: 'Search' }); }
    if (p.GoalTypeID == 4) { this.navCtrl.push('MarriagePage', { pageFrom: 'Search' }); }
    if (p.GoalTypeID == 5) { this.navCtrl.push('RetirementGoalPage', { pageFrom: 'Search' }); }
    if (p.GoalTypeID == 1) { this.navCtrl.push('CustomGoalPage', { pageFrom: 'Search' }); }
  }
  resentArray(id) {
    if (localStorage.getItem("resentGoalIds")) {
      this.goalsResentId = JSON.parse(localStorage.getItem("resentGoalIds"));
      if (this.goalsResentId.length >= 5) {
        if (this.goalsResentId.indexOf(id) == -1) {
          this.goalsResentId.pop();
          this.goalsResentId.unshift(id);
        }
        else {
          this.goalsResentId.splice(this.goalsResentId.indexOf(id), 1);
          this.goalsResentId.unshift(id);
        }
      }
      else {
        if (this.goalsResentId.indexOf(id) == -1) {
          this.goalsResentId.unshift(id);
        }
        else {
          this.goalsResentId.splice(this.goalsResentId.indexOf(id), 1);
          this.goalsResentId.unshift(id);
        }
      }
    }
    else {
      this.goalsResentId.push(id);
      //localStorage.setItem("resentGoalIds", JSON.stringify(this.goalsResentId));
    }
    localStorage.setItem("resentGoalIds", JSON.stringify(this.goalsResentId));
  }
  splitArray() {
    if (localStorage.getItem("resentGoalIds")) {
      let temp = localStorage.getItem("resentGoalIds");
      let a = temp.replace("[", "").replace("]", "");
      return a;
    }
    else {
      return "";
    }
  }
}
