import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})

export class AppComponent  { 
  public title: string = ''
  renderLogger: boolean = true;

  constructor(private appService: AppService) {
    const appData = appService.appData();
    const title = appData.title;
    const version = appData.version;
    this.title = `${title} [${version}]`;
  }
}