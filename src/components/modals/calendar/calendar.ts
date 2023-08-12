import { Component } from '@angular/core';
// import { CalendarComponentOptions, CalendarModalOptions } from 'ion2-calendar';
import { ViewController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import datepicker from 'js-datepicker';

/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {

  // date: string;
  // type: 'string';
  // calendarOption: CalendarModalOptions;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarPage');
    let _that = this;
    let fromDate = this.navParams.get('fromDate');
    let toDate = this.navParams.get('toDate');
    let selectedDate = this.navParams.get('selectedDate');
    const picker = datepicker('.my_calender', 
      { 
        alwaysShow: true,
        position: 'c',
        customMonths: ['Jan','Feb','March','April','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        startDay: 1,
        showAllDates: true,
        dateSelected: selectedDate,
        onSelect: (instance, date) => {
          _that.dismissModal(date);
        }
      }
    );
    picker.setMin(fromDate);
    picker.setMax(toDate);
  }

  onChange($event: any) {
    // console.log(this.date);
    console.log($event);
  }

  dismissModal(d:Date | null) {
    this.viewCtrl.dismiss(d);
  }

}
