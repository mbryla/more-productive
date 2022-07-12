import axios from 'axios';
import { Config, Headers } from '../config';

interface CurrentProjectResponse {
  data: {
    id: string;
    attributes: {
      name: string;
    };
  };
}

export type User = ReturnType<typeof currentProject>;

export const currentProject = (config: Config, headers: Headers) => async () => {
  const url = `${config.baseUrl}/projects/${config.projectId}`;
  const data = (await axios.get<CurrentProjectResponse>(url, { headers })).data.data;
  return { id: data.id, name: `${data.attributes.name}` };
};
