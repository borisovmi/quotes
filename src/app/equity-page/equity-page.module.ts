import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquityPageRoutingModule } from './equity-page-routing.module';
import { MaterialModule } from '../material.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EquityPageComponent } from './equity-page.component';


@NgModule({
  declarations: [
    EquityPageComponent
  ],
  imports: [
    CommonModule,
    EquityPageRoutingModule,
    MaterialModule,
    NgxChartsModule,
  ]
})
export class EquityPageModule { }
