import { NgModule } from '@angular/core';
import { AmountFormatPipe } from './amount-format/amount-format';
import { SafePipe } from './safe/safe';
import { DateagoPipe } from './dateago/dateago';
import { ProfileNamePipe } from './profile-name/profile-name';
@NgModule({
	declarations: [AmountFormatPipe,
    SafePipe,
    DateagoPipe,
    ProfileNamePipe],
	imports: [],
	exports: [AmountFormatPipe,
    SafePipe,
    DateagoPipe,
    ProfileNamePipe]
})
export class PipesModule {}
