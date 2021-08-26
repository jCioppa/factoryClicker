import { Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CommandService {
  constructor(private logger: LoggerService) {}

  commands: any = {
    help: {
      name: 'help',
      description: '',
      execute: () => {
        for (let key in this.commands) {
          const commandEntry = this.commands[key];
          this.logger.log('help', commandEntry.name, commandEntry.description);
        }
      },
    },
  };

  registerCommand(name: string, description: string, execute: any) {
    this.commands[name] = { name, description, execute };
  }

  executeCommandString(commandString: string) {
    const tokens = commandString.split(' ');
    if (tokens.length > 0) {
      const commandName = tokens[0];
      if (this.commands[commandName]) {
        const args = tokens.splice(1);
        const command: any = this.commands[commandName];
        command.execute(...args);
      } else {
        throw new Error(`invalid command [${commandString}]`);
      }
    }
  }
}
