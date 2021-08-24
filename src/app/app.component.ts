import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from './app.service';
import { LoggerComponent, LogEntry } from './logger/logger.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  public title: string = '';
  public currentLog: string = '';
  public logs: Array<LogEntry> = [];

  constructor(private appService: AppService) {
    this.title = appService.getVersion();
  }

  _addLog(message: string) {
    this.logs = [
      {
        message,
        time: new Date().toLocaleTimeString(),
      },
      ...this.logs,
    ];
  }

  addLog() {
    this._addLog(this.currentLog);
    this.currentLog = '';
  }

  clearLogs() {
    this.logs = [];
  }

  ngOnInit() {
    this._addLog('ngOnInit');
  }

  ngOnChanges() {
    this._addLog('ngOnChanges');
  }

  ngDoCheck() {
    this._addLog('ngDoCheck');
  }

  ngAfterContentInit() {
    this._addLog('ngAfterContentInit');
  }

  ngAfterContentChecked() {
    this._addLog('ngAfterContentChecked');
  }

  ngAfterViewInit() {
    this._addLog('ngAfterViewInit');
  }

  ngAfterViewChecked() {
    this._addLog('ngAfterViewChecked');
  }

  ngOnDestroy() {
    this._addLog('ngOnDestroy');
  }
}
