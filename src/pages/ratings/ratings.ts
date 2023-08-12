import { Component, Input, EventEmitter ,Output} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-ratings',
  templateUrl: 'ratings.html',
})
export class RatingsPage {
  [x: string]: any;
  @Input() rating: number ;

  @Output() ratingChange: EventEmitter<number> = new EventEmitter();;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  rate(index: number){
    this.rating = index;
    this.ratingChange.emit(this.rating);
  }

  getColor(index: number){
    if(this.isAboveRating(index)){
      return COLORS.GREY;
    }
    switch (this.rating){
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        return COLORS.YELLOW;
      default:
        return COLORS.GREY;
    }
  }

 isAboveRating(index): boolean{
    return index > this.rating;
 }
  

}

enum COLORS{
  GREY = "#D9D9D9",
  // GREEN = "#76FF03",
  YELLOW = "#FFCA28",
  // RED = "#DD2C00"
}

