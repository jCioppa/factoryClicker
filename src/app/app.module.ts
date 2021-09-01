import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { AppRoutingModule } from './app-routing.module';
import { declarations } from './app.declarations';
import { imports } from './app.imports'
import { providers } from './app.providers';
import { MinerComponent } from './miner/miner.component';
import { LoginScreenComponent } from './login-screen/login-screen.component'
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import {MatButtonModule} from '@angular/material/button';
import { ResearchCenterComponent } from './research-center/research-center.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


export function tokenGetter() {
  return localStorage.getItem("access_token");
}

@NgModule({
  declarations: [...declarations, AppComponent, MinerComponent, LoginScreenComponent, ResearchCenterComponent],
  imports : [...imports, 
    AppRoutingModule, 
    HttpClientModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [],
        disallowedRoutes: [],
      },
    }),
    MatButtonModule

  ],
  providers: [...providers, AppService],
  bootstrap: [AppComponent],
})

export class AppModule {}
