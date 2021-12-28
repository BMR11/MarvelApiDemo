import axios, {AxiosResponse} from 'axios';
import {Config} from '../config/config';
import {Organization} from '../entities/entityTypes';

export const OrganizationsApi = {
  getAll: function (): Promise<AxiosResponse<Organization[]>> {
    return axios.get(`${Config.BaseUrl}/organizations`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },
};
