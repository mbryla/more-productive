import axios from 'axios';
import { Config, Headers } from '../config';

interface ServiceResponse {
  data: {
    id: string;
    attributes: {
      name: string;
    };
  };
}

export const currentService = (config: Config, headers: Headers) => async () => {
  const url = `${config.baseUrl}/services/${config.serviceId}`;
  return (await axios.get<ServiceResponse>(url, { headers })).data.data;
};
