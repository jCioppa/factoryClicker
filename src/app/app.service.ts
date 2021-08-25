import { Injectable } from '@angular/core';

@Injectable()
export class AppService {
  public appData(): any { 
    return {
      version: "0.0.1",
      title: 'Factory Clicker'
    }
  }  
}
