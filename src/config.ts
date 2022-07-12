import { config } from 'dotenv';
config();

export type Config = ReturnType<typeof readConfig>;

export interface Headers extends Record<string, string> {
  'Content-Type': string;
  'X-Organization-Id': string;
  'X-Auth-Token': string;
}

export const readConfig = () => {
  return {
    baseUrl: process.env.BASE_URL || '',
    organizationId: process.env.ORGANIZATION_ID || '',
    projectId: process.env.PROJECT_ID || '',
    userToken: process.env.USER_TOKEN || '',
    userId: process.env.USER_ID || '',
    serviceId: process.env.SERVICE_ID,
  };
};
