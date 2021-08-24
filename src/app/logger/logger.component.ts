import { Component, Input, OnInit } from '@angular/core';

export interface LogEntry {
  message: string;
  time: string;
}

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.sass'],
})
export class LoggerComponent implements OnInit {
  @Input() logs: Array<LogEntry> = [];
  ngOnInit(): void {}
}
