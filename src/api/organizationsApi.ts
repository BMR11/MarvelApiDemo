import axios, {AxiosResponse} from 'axios';
import {Config} from '../config/config';
import {Organization} from '../entities/entityTypes';

const PER_PAGE_ENTRIES = 10;
// const SINCE_ID = 0;
export const OrganizationsApi = {
  getAll: function (startId = 0): Promise<AxiosResponse<Organization[]>> {
    return axios.get(
      `${Config.BaseUrl}/organizations?per_page=${PER_PAGE_ENTRIES}&since=${startId}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
  },
};

// https://randomuser.me/api/?page=2&results=10&seed=rajni