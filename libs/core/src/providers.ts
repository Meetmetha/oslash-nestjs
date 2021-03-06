import { ListCommands, InitApplicationSetup } from './console';
import { HttpExplorer } from './http';
import { BaseValidator } from './validator';
import { IsUniqueConstraint } from './validator/decorators/isUnique';
import { IsValueFromConfigConstraint } from './validator/decorators/isValueFromConfig';

const providers = [
  // commands
  ListCommands,
  InitApplicationSetup,

  // custom base validator
  BaseValidator,

  // http providers
  HttpExplorer,

  // custom validator decorators
  IsUniqueConstraint,
  IsValueFromConfigConstraint,
];

const getProviders = function (): any {
  return providers;
};

export { getProviders };
