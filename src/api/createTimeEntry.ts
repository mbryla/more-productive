import axios from 'axios';

import { Config, Headers } from '../config';

interface CreateEntryResponse {
  data: {
    id: string;
    attributes: {
      created_at: string;
    };
  };
}

export const createTimeEntry =
  (config: Config, headers: Headers) =>
  async ({ date }: { date: string }) => {
    const url = `${config.baseUrl}/time_entries`;

    return (
      await axios.post<CreateEntryResponse>(
        url,
        {
          data: {
            type: 'time_entries',
            attributes: {
              date,
              time: 480,
            },
            relationships: {
              person: {
                data: {
                  type: 'people',
                  id: config.userId,
                },
              },
              service: {
                data: {
                  type: 'services',
                  id: config.serviceId,
                },
              },
            },
          },
        },
        { headers }
      )
    ).data.data;
  };
