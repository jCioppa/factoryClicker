import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { LoggerComponent } from './logger/logger.component';
import { MainComponent } from './main/main.component';
import { AssemblerComponent } from './assembler/assembler.component';
import { SmelterComponent } from './smelter/smelter.component';
import { ScienceLabComponent } from './science-lab/science-lab.component';

@NgModule({
  declarations: [
    AppComponent,
    LoggerComponent,
    MainComponent,
    AssemblerComponent,
    SmelterComponent,
    ScienceLabComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [AppService],
  bootstrap: [AppComponent],
})
export class AppModule {}
