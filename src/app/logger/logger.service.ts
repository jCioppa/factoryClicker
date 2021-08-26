import { Injectable } from '@angular/core';
import { LogEntry } from './LogEntry';
import { LogLevel } from './LogLevel';

@Injectable()
export class LoggerService {
  logs: Array<LogEntry> = [];

  clearLogs() {
    this.logs = [];
  }

  log(className: string, methodName: string, message: string) {
    this.logs = [
      {
        message: this.formatMessage(className, methodName, message),
        time: new Date().toLocaleTimeString(),
        level: LogLevel.Normal,
      },
      ...this.logs,
    ];
  }

  warning(className: string, methodName: string, message: string) {
    this.logs = [
      {
        message: this.formatMessage(className, methodName, message),
        time: new Date().toLocaleTimeString(),
        level: LogLevel.Warning,
      },
      ...this.logs,
    ];
  }

  error(className: string, methodName: string, message: string) {
    this.logs = [
      {
        message: this.formatMessage(className, methodName, message),
        time: new Date().toLocaleTimeString(),
        level: LogLevel.Error,
      },
      ...this.logs,
    ];
  }

  formatMessage(className: string, methodName: string, message: string) {
    return `[${className}:${methodName}] ${message}`;
  }
}
