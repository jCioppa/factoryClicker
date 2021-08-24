import { Injectable } from '@angular/core';

@Injectable()
export class AppService {
  private version: string;

  constructor() {
    this.version = '0.0.1';
  }

  getVersion() {
    return this.version;
  }

  setVersion(version: string) {
    this.version = version;
  }
}
