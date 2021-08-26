import { Component, OnInit } from '@angular/core';
import { CommandService } from '../services/CommandService';
import { LoggerService } from './logger.service';
import { LogLevel } from './LogLevel';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.sass'],
})
export class LoggerComponent implements OnInit {
  commandString: string = '';

  classMap: any = {
    [LogLevel.Normal]: 'normal',
    [LogLevel.Error]: 'error',
    [LogLevel.Warning]: 'warning',
  };

  constructor(
    private logger: LoggerService,
    private commandService: CommandService
  ) {
    commandService.registerCommand('clear', 'clears the console', () =>
      this.logger.clearLogs()
    );
    commandService.registerCommand(
      'popup',
      'alerts $args to the screen',
      (msg: string) => alert(msg)
    );
  }

  ngOnInit(): void {}

  logs() {
    return this.logger.logs;
  }

  onSubmitCommand() {
    try {
      this.commandService.executeCommandString(this.commandString);
    } catch (error: any) {
      this.logger.warning(
        'LoggerComponent',
        'onSubmitCommand',
        error.toString()
      );
    }
    this.commandString = '';
  }
}
