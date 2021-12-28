import {action, makeObservable, observable, runInAction} from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStore} from './RootStore';
import {Organization} from '../entities/entityTypes';
import {OrganizationsApi} from '../api/organizationsApi';

const ASYNC_KEY_ORG_READ_IDS = 'org-read-ids';

export class OrganizationStore {
  organizations: Organization[] = [];
  rootStore: RootStore;
  error: string = 'Oops... Something went wrong';
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      organizations: observable,
      error: observable,

      getAll: action,
      persistIsReadForOrgId: action,
      markRead: action,
    });
  }

  markRead = (orgId: number) => {
    const index = this.organizations.findIndex(o => o.id === orgId);
    if (index > -1) {
      this.organizations[index].isRead = true;
      this.persistIsReadForOrgId(orgId);
    }
  };

  //We can use on device sqlite db here but considering small usecase, async should work here.
  persistIsReadForOrgId = async (orgId: number) => {
    AsyncStorage.getItem(ASYNC_KEY_ORG_READ_IDS).then(data => {
      let _listOfReadIds: number[] = [];
      if (data) {
        _listOfReadIds = JSON.parse(data);
      }
      _listOfReadIds.push(orgId);
      AsyncStorage.setItem(
        ASYNC_KEY_ORG_READ_IDS,
        JSON.stringify(_listOfReadIds),
      );
    });
  };

  getAll = async () => {
    this.error = '';
    try {
      const response = await OrganizationsApi.getAll();
      if (response.data) {
        runInAction(() => {
          this.organizations = response.data;
        });
      }
      await this.restoreIsReadIds();
    } catch (error) {
      console.error('OrganizationsApi.getAll', error);
      this.error = '' + error;
    }
  };

  restoreIsReadIds = async () => {
    const data = await AsyncStorage.getItem(ASYNC_KEY_ORG_READ_IDS);
    if (data) {
      const list: number[] = JSON.parse(data);
      runInAction(() => {
        if (list.length > 0) {
          this.organizations = this.organizations.map(o => {
            if (list?.includes(o.id)) return {...o, isRead: true};
            else return {...o};
          });
        }
      });
    }
  };
}
