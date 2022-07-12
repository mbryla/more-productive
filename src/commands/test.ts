import { Api } from '../api/api';
import { Config } from '../config';

export const createTestCommand = (config: Config, api: Api) => async () => {
  const user = await api.currentUser();
  const project = await api.currentProject();
  const service = config.serviceId ? await api.currentService() : undefined;

  if (user && project) {
    console.log(
      `= auth test: success\tproject: ${project.name}\tuser: ${user.name}\tservice: ${service?.attributes.name}`
    );
  } else {
    console.log('= auth test: error\tplease check env variables');
  }
};
