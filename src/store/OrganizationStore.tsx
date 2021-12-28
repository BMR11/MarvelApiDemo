import {action, makeObservable, observable, runInAction} from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStore} from './RootStore';
import {Organization} from '../entities/entityTypes';
import {OrganizationsApi} from '../api/organizationsApi';

export class OrganizationStore {
  organizations: Organization[] = [];
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      organizations: observable,
      getAll: action,
      refreshMarkedOrgs: action,
      markRead: action,
    });
  }

  markRead = (orgId: number) => {
    this.organizations = this.organizations.map(o => {
      if (o.id === orgId) return {...o, isRead: true};
      else return {...o};
    });
    this.updateAsyncForMarkedOrg(orgId);
  };

  updateAsyncForMarkedOrg = async (orgId: number) => {
    AsyncStorage.getItem(`org-checked-ids`).then(d => {
      let list: number[] = [];
      if (d) {
        list = JSON.parse(d);
      }
      list.push(orgId);
      AsyncStorage.setItem(`org-checked-ids`, JSON.stringify(list));
    });
  };
  getAll = async () => {
    try {
      const response = await OrganizationsApi.getAll();
      if (response.data) {
        runInAction(() => {
          this.organizations = response.data;
        });
      }
      await this.refreshMarkedOrgs();
    } catch (error) {
      console.error('OrganizationsApi.getAll', error);
    }
  };

  refreshMarkedOrgs = async () => {
    const data = await AsyncStorage.getItem(`org-checked-ids`);
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
