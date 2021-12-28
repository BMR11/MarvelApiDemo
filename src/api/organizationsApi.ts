import axios, {AxiosResponse} from 'axios';
import {Config} from '../config/config';
import {Organization} from '../entities/entityTypes';

const PER_PAGE_ENTRIES = 25;
const SINCE_ID = 0;
export const OrganizationsApi = {
  getAll: function (): Promise<AxiosResponse<Organization[]>> {
    return axios.get(
      `${Config.BaseUrl}/organizations?per_page=${PER_PAGE_ENTRIES}&since=${SINCE_ID}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
  },
};
