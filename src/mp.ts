import { createApi } from './api/api';
import { createCommands } from './commands/commands';
import { readConfig } from './config';

const execute = async (argv: Array<string>) => {
  const config = readConfig();
  const api = createApi({ config });
  const commands = createCommands({ api, config });

  const command = argv[2];
  const args = argv.slice(3);

  switch (command) {
    case 'fix':
      return await commands.fix(args?.[0]);

    case 'test':
      return await commands.test();

    case 'services':
      return await commands.services(args[0]);

    case 'status':
      const options = {
        verbose: args?.[0] === 'verbose' || args?.[1] === 'verbose',
        yearAndMonth: args?.[0] === 'verbose' ? undefined : args?.[0],
      };

      return await commands.status(options);

    default:
      return await commands.help();
  }
};

execute(process.argv).catch(console.error);
