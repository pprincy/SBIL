import { Component, ViewChild, Input } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Content,
  LoadingController,
  MenuController,
} from "ionic-angular";
import * as HighCharts from "highcharts";
import * as $ from "jquery";
import { RestapiProvider } from "../../../../providers/restapi/restapi";
import { UtilitiesProvider } from "../../../../providers/utilities/utilities";
import { MyApp } from "../../../../app/app.component";
import { opacity } from "html2canvas/dist/types/css/property-descriptors/opacity";
@IonicPage()
@Component({
  selector: "page-networth-final",
  templateUrl: "networth-final.html",
})
export class NetworthFinalPage {
  @ViewChild(Content) content: Content;
  public selectedDrop;
  public isBtnActive: boolean = false;
  public status: boolean = false;
  public pageLoader: boolean = false;
  public IntStatus: boolean = false;
  assets: any;
  liabilities: any;
  rangeDataUi: any;
  config: any;
  networthValue;
  loading: any;
  public disclaimer: any = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public utilitiesProvider: UtilitiesProvider,
    private restapiProvider: RestapiProvider,
    private loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    public myApp: MyApp
  ) {
    this.assets = this.navParams.get("data").assets;
    this.liabilities = this.navParams.get("data").liabilities;
    this.config = this.navParams.get("data").configCal;
    this.networthValue = this.navParams.get("data").networthValue;
  }
  disclaimerInfo() {
    this.disclaimer = !this.disclaimer;
    if (this.disclaimer == true) {
      $(".header").addClass("headerOverlay");
      $(".scroll-content").addClass("scrollOverlay");
    }
  }

  disclaimerClose() {
    this.disclaimer = !this.disclaimer;

    if (this.disclaimer == false) {
      $(".header").removeClass("headerOverlay");
      $(".scroll-content").removeClass("scrollOverlay");
    }
  }
  // top = 0;
  // scrollToTop() {
  //   setTimeout(() => {
  //     this.cssCahnge();
  //   }, 100);
  // }

  // cssCahnge() {
  //   if (this.top == 0) {
  //     $('.networth_details').removeClass('shrink');
  //   }
  //   else {
  //     $('.networth_details').addClass('shrink');
  //     setTimeout(function () {
  //       var hedaerheight = $('.shrink').parent().outerHeight();
  //      // $('.fixed-content').css('margin-top', hedaerheight);
  //       //$('.scroll-content').css('margin-top', hedaerheight);
  //     }, 100);
  //   }

  // }

  ionViewDidLoad() {
    //  this.updateUserAssets();
    this.myApp.updatePageUseCount("12");
    this.utilitiesProvider.googleAnalyticsTrackView("Networth");
    this.chartLoad();
    // this.scrollToTop();
    // this.content.ionScroll.subscribe((data) => {
    //   if (data) {
    //     this.top = data.scrollTop;
    //     this.cssCahnge();
    //   }
    // });

    // this.content.ionScrollStart.subscribe((data) => {
    //   if (data) {
    //     this.top = data.scrollTop;
    //     this.cssCahnge();
    //   }
    // });

    this.utilitiesProvider.upshotScreenView("NetworthCalculatorFinal");
  }
  menuToggle() {
    this.menuCtrl.open();
  }
  chartLoad() {
    let that = this;
    var myChart = HighCharts.chart("networth_chart", {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        margin: [0, 0, 0, 0],
        spacingTop: 0,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0,
        width: 250,
        height: 200,
      },
      title: {
        useHTML: true,
        text: `<div class="chart_center_text">
          <div class="chart_center_title">
          <p>Total</p>
          <p>Networth</p>
          </div>
        </div>`,

        // text: "Total Networth",
        align: "center",
        verticalAlign: "middle",
        y: 0,
        color: "#5C2483",
        style: {
          color: "#5C2483",
          font: "bold 20px Lato 700",
        },
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          size: "100%",
          shadow: false,
          // borderColor: '#5C2483',
          // borderRadius: '50%',
          // borderWidth: '5',
          // thickness: "2",
          // opacity: '2',
          dataLabels: {
            enabled: false,
          },
          states: {
            hover: {
              halo: {
                size: 0,
              },
            },
          },
        },
      },
      series: [
        {
          type: "pie",
          name: "",
          size: "96%",
          innerSize: "80%",
          borderColor: '#fff',
          borderWidth: 3,
          data: [
            {
              name: this.utilitiesProvider.langJsonData["networthCalculator"][
                "totalAssets"
              ],
              color: "#5C2483",
              y: this.assets,
              z: 214.5,
            },
            {
              name: this.utilitiesProvider.langJsonData["networthCalculator"][
                "totalLiabilities"
              ],
              color: "#F57721",
              y: this.liabilities,
              z: 235.6,
            },
          ],
        },
        {
          type: "pie",
          name: "OuterBorder",
          size: "100%",
          innerSize: "98%",
          animation: false,
          showInLegend: false,
          data: [
            {
              name: "",
              y: 1,
              color: "#5C2483",
            },
          ],
        },
        {
          type: "pie",
          name: "InnerBorder",
          size: "72%",
          innerSize: "98%",
          animation: false,
          showInLegend: false,
          data: [
            {
              name: "",
              y: 1,
              color: "#5C2483",
            },
          ],
        },
      ],
    });
  }
  toggleClass(id) {
    $("#" + id).toggleClass("active");
  }
  showOverlay(type) {
    this.status = !this.status;
    $(".header").addClass("headerOverlay");
    $(".scroll-content").addClass("scrollOverlay");

    this.selectedDrop = type;
    if (type == "assets") {
      this.utilitiesProvider.rangeData = parseFloat(this.assets);
      this.rangeDataUi = {
        steps: this.config.assets.steps,
        amount: parseInt(this.assets),
        min: parseInt(this.config.assets.min),
        max: parseInt(this.config.assets.max),
        title:
          this.utilitiesProvider.langJsonData["networthCalculator"][
            "totalLiabilities"
          ],
        type: "r",
        info: "",
      };
    } else {
      this.utilitiesProvider.rangeData = parseFloat(this.liabilities);
      this.rangeDataUi = {
        steps: this.config.liabilities.steps,
        amount: parseInt(this.liabilities),
        min: parseInt(this.config.liabilities.min),
        max: parseInt(this.config.liabilities.max),
        title:
          this.utilitiesProvider.langJsonData["networthCalculator"][
            "totalLiabilities"
          ],
        type: "r",
        info: "",
      };
    }
  }
  done() {
    let d = parseInt(this.utilitiesProvider.rangeData);
    if (d) {
      if (
        d < parseInt(this.rangeDataUi.min) ||
        d > parseInt(this.rangeDataUi.max)
      ) {
        this.restapiProvider.presentToastTop(
          this.utilitiesProvider.jsErrorMsg["pleaseEnterNumberBetween"] +
            " " +
            this.rangeDataUi.min +
            " " +
            this.utilitiesProvider.jsErrorMsg["to"] +
            " " +
            this.rangeDataUi.max
        );
      } else {
        this.status = !this.status;
        $(".header").removeClass("headerOverlay");
        $(".scroll-content").removeClass("scrollOverlay");
        if (this.selectedDrop == "assets") {
          if (typeof this.utilitiesProvider.rangeData === "number") {
            this.assets = d;
          } else {
            this.assets = d;
          }
          this.chartLoad();
          this.getNetwoth();
        } else {
          if (typeof this.utilitiesProvider.rangeData === "number") {
            this.liabilities = d;
          } else {
            this.liabilities = d;
          }
          this.chartLoad();
          this.getNetwoth();
        }
      }
    }
  }

  getNetwoth() {
    this.pageLoader = true;
    let request = {
      CustId: this.restapiProvider.userData["CustomerID"],
      TokenId: this.restapiProvider.userData["tokenId"],
      CurrentSaving: this.assets,
      Liability: this.liabilities,
    };
    // console.log("Request: " + JSON.stringify(request));
    return this.restapiProvider
      .sendRestApiRequest(request, "GetNetworthValue")
      .subscribe(
        (response) => {
          this.pageLoader = false;
          if (response.IsSuccess == true) {
            // console.log(response);
            this.networthValue = response.Data.Networth;
          } else {
            // console.log(response);
          }
        },
        (error) => {
          this.pageLoader = false;
        }
      );
  }

  recalculate() {
    // this.navCtrl.pop();
    this.setUpshotEvent("Recalculate");
    this.navCtrl.setRoot("NetworthStepsPage");
  }
  //ScreenShot Code
  takeScreenshot() {
    this.utilitiesProvider.screenShotURI();

    this.utilitiesProvider.setUpshotShareEvent("Tool", "Networth Caculator");
  }

  // interst_rate(){
  //   this.IntStatus = !this.IntStatus;

  // }
  IntStatusClose() {
    this.IntStatus = !this.IntStatus;
  }

  goToGoalsListing() {
    this.setUpshotEvent("Start Planning");

    this.navCtrl.setRoot("ListingScreenGoalPage", { pageFrom: "Networth" });
  }

  goNotificationList() {
    this.navCtrl.push("NotificationPage");
  }

  // User Assets Update
  updateUserAssets() {
    this.pageLoader = true;
    let request = {
      CustID: this.restapiProvider.userData["CustomerID"],
      TokenId: this.restapiProvider.userData["tokenId"],
      Products: this.utilitiesProvider.tempValue["assets"],
    };
    return this.restapiProvider
      .sendRestApiRequest(request, "UpdateUserAssets")
      .subscribe(
        (response) => {
          this.pageLoader = false;
          if (response.IsSuccess == true) {
            this.updateUserLiabilities();
          } else {
            // console.log(response);
          }
        },
        (error) => {
          this.pageLoader = false;
        }
      );
  }

  //update User Liabilities

  updateUserLiabilities() {
    this.pageLoader = true;
    let request = {
      CustID: this.restapiProvider.userData["CustomerID"],
      TokenId: this.restapiProvider.userData["tokenId"],
      Products: this.utilitiesProvider.tempValue["Liabilities"],
    };

    return this.restapiProvider
      .sendRestApiRequest(request, "UpdateUserLiabilities")
      .subscribe(
        (response) => {
          this.pageLoader = false;
          if (response.IsSuccess == true) {
            // this.navCtrl.push( this.paramsData.assetsPage, {data : this.paramsData.assetsData})
          } else {
            // console.log(response);
          }
        },
        (error) => {
          this.pageLoader = false;
        }
      );
  }

  setUpshotEvent(action) {
    let payload = {
      Appuid: this.utilitiesProvider.upshotUserData.appUId,
      Language: this.utilitiesProvider.upshotUserData.lang,
      City: this.utilitiesProvider.upshotUserData.city,
      AgeGroup: this.utilitiesProvider.upshotUserData.ageGroup,
      DrivenFrom: this.navParams.get("pageFrom") || "",
      Assets: this.navParams.get("selAsset") || "",
      Liabilities: this.navParams.get("selLiability") || "",
      TotalAssetAmount: this.assets,
      TotalLiabilityAmount: this.liabilities,
      EstimatedNetworth: this.networthValue,
      Action: action,
    };
    console.log(payload);
    this.utilitiesProvider.upshotCustomEvent(
      "NetworthCalculator",
      payload,
      false
    );
  }
}
