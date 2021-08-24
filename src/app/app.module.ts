import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { LoggerComponent } from './logger/logger.component';
import { RjuneGameComponent } from './rjune-game/rjune-game.component';
import { AssemblerComponent } from './assembler/assembler.component';

@NgModule({
  declarations: [AppComponent, LoggerComponent, RjuneGameComponent, AssemblerComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [AppService],
  bootstrap: [AppComponent],
})
export class AppModule {}
