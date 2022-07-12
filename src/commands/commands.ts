import { Api } from '../api/api';
import { Config } from '../config';
import { createFixCommand } from './fix';

import { help } from './help';
import { createServicesCommand } from './services';
import { createStatusCommand } from './status';
import { createTestCommand } from './test';

export const createCommands = ({ api, config }: { api: Api; config: Config }) => {
  return {
    fix: createFixCommand(config, api),
    help,
    services: createServicesCommand(config, api),
    status: createStatusCommand(config, api),
    test: createTestCommand(config, api),
  };
};
