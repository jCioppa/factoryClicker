import { LoggerService } from './logger/logger.service';
import { AuthenticationService } from './services/AuthenticationService';
import { CommandService } from './services/CommandService';
import { RecipeService } from './services/RecipeService';

export const providers = [LoggerService, CommandService, RecipeService, AuthenticationService];