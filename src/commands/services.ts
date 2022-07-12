import { EOL } from 'os';

import { Api } from '../api/api';
import { Config } from '../config';

export const createServicesCommand = (config: Config, api: Api) => async (name: string) => {
  const services = await api.getServices(name);
  console.log(`Found ${services.length} services matching "${name}"`);

  if (services.length > 0) {
    console.log(services.map((service) => `${service.id} - ${service.attributes.name}`).join(EOL));
  }
};
