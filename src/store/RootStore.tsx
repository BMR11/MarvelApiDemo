import {OrganizationStore} from './OrganizationStore';

export class RootStore {
  organizationStore: OrganizationStore;
  constructor() {
    this.organizationStore = new OrganizationStore(this);
  }
}
