import {ComicsStore} from './ComicsStore';

export class RootStore {
  comicsStore: ComicsStore;
  constructor() {
    this.comicsStore = new ComicsStore(this);
  }
}
