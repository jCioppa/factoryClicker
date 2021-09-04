import { LoggerService } from './logger/logger.service';
import { AuthenticationService } from './services/AuthenticationService';
import { CommandService } from './services/CommandService';
import { RecipeService } from './services/RecipeService';
import { ResearchService } from './services/ResearchService';

export const providers = [LoggerService, CommandService, RecipeService, AuthenticationService, ResearchService];