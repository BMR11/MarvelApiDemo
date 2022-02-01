import {action, makeObservable, observable, runInAction} from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStore} from './RootStore';
import {ComicViewModel, Organization} from '../entities/entityTypes';
import {OrganizationsApi} from '../api/organizationsApi';

const ASYNC_KEY_ORG_READ_IDS = 'org-read-ids';

export class ComicsStore {
  comics: ComicViewModel[] = [];
  rootStore: RootStore;
  error: string = 'Oops... Something went wrong';

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      comics: observable,
      error: observable,

      getAll: action,
      persistIsReadForOrgId: action,
      markRead: action,
    });
  }

  markRead = (orgId: number) => {
    const index = this.comics.findIndex(o => o.id === orgId);
    if (index > -1) {
      this.comics[index].isRead = true;
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

  getAll = async (startId: number) => {
    this.error = '';
    try {
      const response = await OrganizationsApi.getAll(startId);
      if (response.data) {
        runInAction(() => {
          this.comics = [...this.comics, ...response.data];
        });
      }
      await this.restoreIsReadIds();
    } catch (error) {
      // console.error('OrganizationsApi.getAll', error);
      this.error = '' + error;
    }
  };

  restoreIsReadIds = async () => {
    const data = await AsyncStorage.getItem(ASYNC_KEY_ORG_READ_IDS);
    if (data) {
      const list: number[] = JSON.parse(data);
      runInAction(() => {
        if (list.length > 0) {
          this.comics = this.comics.map(o => {
            if (list?.includes(o.id)) return {...o, isRead: true};
            else return {...o};
          });
        }
      });
    }
  };
}
