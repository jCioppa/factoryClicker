import { Component, Input, OnInit } from '@angular/core';
import { LoggerService } from './logger.service';
import { LogLevel } from './LogLevel';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.sass'],
})
export class LoggerComponent implements OnInit {
  constructor(private logger: LoggerService) {}

  classMap: any = {
    [LogLevel.Normal]: 'normal',
    [LogLevel.Error]: 'error',
    [LogLevel.Warning]: 'warning',
  };

  ngOnInit(): void {}

  logs() {
    return this.logger.logs;
  }
}
