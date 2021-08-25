import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { AppRoutingModule } from './app-routing.module';
import { declarations } from './app.declarations';
import { imports } from './app.imports'
import { providers } from './app.providers'

@NgModule({
  declarations: [...declarations, AppComponent],
  imports : [...imports, AppRoutingModule],
  providers: [...providers, AppService],
  bootstrap: [AppComponent],
})

export class AppModule {}
