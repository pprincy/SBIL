import { NgModule } from '@angular/core';
import { RangeSelectComponent } from './range-select/range-select';
import { SlickSliderComponent } from './slick-slider/slick-slider';
import { GoalHomeRangeComponent } from './goal-home-range/goal-home-range';
import { SukanyaRangeSliderComponent } from './sukanya-range-slider/sukanya-range-slider';
import { CarRangeComponent } from './car-range/car-range';
import { FdRangeComponent } from './fd-range/fd-range';
import { LoanEmiRangeComponent } from './loan-emi-range/loan-emi-range';
import { EducationRangeComponent } from './education-range/education-range';
import { MarriageRangeComponent } from './marriage-range/marriage-range';
import { SipRangeComponent } from './sip-range/sip-range';
import { MagicCompoundRangeComponent } from './magic-compound-range/magic-compound-range';
import { PpfWithAccRangeComponent } from './ppf-with-acc-range/ppf-with-acc-range';
import { PpfWithoutAccRangeComponent } from './ppf-without-acc-range/ppf-without-acc-range';
import { RetirementRangeComponent } from './retirement-range/retirement-range';
import { TargetRangeComponent } from './target-range/target-range';
import { IonicModule } from "ionic-angular";
import { FaimilyProtectionComponent } from './faimily-protection/faimily-protection';
// import { CrorepatiRangeComponent } from './crorepati-range/crorepati-range';
// import { SmokingRangeComponent } from './smoking-range/smoking-range';
// import { EatingOutComponent } from './eating-out/eating-out';
// import { HealthInsuranceComponent } from './health-insurance/health-insurance';
@NgModule({
	declarations: [
    // AddSpendVmComponent
    //     CrorepatiRangeComponent,
    // SmokingRangeComponent,
    // EatingOutComponent,
    // HealthInsuranceComponent
],
   imports:      [ IonicModule ],
	exports: [
    // AddSpendVmComponent
    //     CrorepatiRangeComponent,
    // SmokingRangeComponent,
    // EatingOutComponent,
    // HealthInsuranceComponent
]
})
export class ComponentsModule {}
