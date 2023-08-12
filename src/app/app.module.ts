import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestapiProvider } from '../providers/restapi/restapi';
import { ProcessHttpmsgProvider } from '../providers/process-httpmsg/process-httpmsg';
import { config } from '../shared/config';
import { IntelSecurity } from '@ionic-native/intel-security';
import { Sim } from '@ionic-native/sim';
import { Device } from '@ionic-native/device';
import { OneSignal } from '@ionic-native/onesignal';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { UtilitiesProvider } from '../providers/utilities/utilities';
import { Screenshot } from '@ionic-native/screenshot';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Keyboard } from '@ionic-native/keyboard';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { FormsModule} from '@angular/forms';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { AppRate } from '@ionic-native/app-rate';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { Badge } from '@ionic-native/badge';
import { AndroidPermissions} from '@ionic-native/android-permissions';
//  import { RoundSliderComponent } from 'angular2-round-slider/dist';
import { HTTP } from '@ionic-native/http';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { Http, HttpModule } from '@angular/http';
import { Base64 } from '@ionic-native/base64';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

//Page Load
// import { SettingsPage } from '../pages/settings/settings';
import { TabsPage} from '../pages/dashboard/tabs/tabs';
import { DecimalPipe } from '@angular/common';
import { TermsConditionPageModule } from '../components/modals/terms-condition/terms-condition.module';
import { DisclaimerPageModule } from '../components/modals/disclaimer/disclaimer.module';
import { SelectLanguagePageModule } from '../components/modals/select-language/select-language.module';
import { AddSpendVmPageModule } from '../components/modals/add-spend-vm/add-spend-vm.module';
import { DropDowmSelctionPageModule } from '../components/modals/drop-dowm-selction/drop-dowm-selction.module';
import { CalendarPageModule } from '../components/modals/calendar/calendar.module';
// import { AboutusPage } from '../pages/aboutus/aboutus'



export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
     TabsPage,
    //  SettingsPage,
    //  AboutusPage
  ],
  imports: [
    BrowserModule,
    TermsConditionPageModule,
    DisclaimerPageModule,
    SelectLanguagePageModule,
    DropDowmSelctionPageModule,
    AddSpendVmPageModule,
    CalendarPageModule,
    IonicModule.forRoot(MyApp,
    {
      tabsHideOnSubPages: true,
      swipeBackEnabled: false
    }),
    HttpModule,FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    // TermsConditionPage,
    // SettingsPage,
    // AboutusPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestapiProvider,
    ProcessHttpmsgProvider,
    { provide: 'config', useValue: config},
    IntelSecurity,
    Sim,
    Device,
    OneSignal,
    Network,
    Geolocation,
    NativeGeocoder,
    Keyboard,
    UtilitiesProvider,
    Screenshot,
    SocialSharing,
    Diagnostic,
    ImagePicker,
    Crop,
    AppVersion,
    InAppBrowser,
    MobileAccessibility,
    GoogleAnalytics,
    FirebaseAnalytics,
    AndroidPermissions,
    AppRate,
    Badge,
    HTTP,
    Base64,
    File,
    FileTransfer,
    DecimalPipe,
    { provide: LOCALE_ID, useValue: "en-IN" },
  ]
})
export class AppModule {}