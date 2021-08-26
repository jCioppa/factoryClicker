import { LogLevel } from './LogLevel';

export interface LogEntry {
  message: string;
  time: string;
  level: LogLevel;
}
