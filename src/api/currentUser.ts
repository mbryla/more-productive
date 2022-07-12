import axios from 'axios';
import { Config, Headers } from '../config';

interface CurrentUserResponse {
  data: {
    id: string;
    attributes: {
      first_name: string;
      last_name: string;
    };
  };
}

export type User = ReturnType<typeof currentUser>;

export const currentUser = (config: Config, headers: Headers) => async () => {
  const url = `${config.baseUrl}/people/${config.userId}`;
  const data = (await axios.get<CurrentUserResponse>(url, { headers })).data.data;
  return { id: data.id, name: `${data.attributes.first_name} ${data.attributes.last_name}` };
};
