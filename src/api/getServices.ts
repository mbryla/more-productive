import axios from 'axios';
import { Config, Headers } from '../config';

interface ServicesResponse {
  data: Array<{
    id: string;
    attributes: {
      name: string;
    };
  }>;
}

export const getServices = (config: Config, headers: Headers) => async (name: string) => {
  const url = `${config.baseUrl}/services`;

  return (
    await axios.get<ServicesResponse>(url, {
      headers,
      params: {
        'filter[name]': name,
      },
    })
  ).data.data;
};
