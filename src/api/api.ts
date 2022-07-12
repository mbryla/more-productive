import { Config, Headers } from '../config';
import { createTimeEntry } from './createTimeEntry';

import { currentProject } from './currentProject';
import { currentService } from './currentService';
import { currentUser } from './currentUser';
import { getServices } from './getServices';
import { getParsedTimeEntries, getTimeEntries } from './getTimeEntries';

export type Api = ReturnType<typeof createApi>;

export const createApi = ({ config }: { config: Config }) => {
  const headers: Headers = {
    'Content-Type': 'application/vnd.api+json',
    'X-Organization-Id': config.organizationId,
    'X-Auth-Token': config.userToken,
  };

  return {
    createTimeEntry: createTimeEntry(config, headers),
    currentUser: currentUser(config, headers),
    currentProject: currentProject(config, headers),
    currentService: currentService(config, headers),
    getServices: getServices(config, headers),
    getTimeEntries: getTimeEntries(config, headers),
    getParsedTimeEntries: getParsedTimeEntries(config, headers),
  };
};
