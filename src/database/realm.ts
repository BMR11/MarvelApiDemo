import Realm from 'realm';

export const ComicSchemaName = 'Comic';
const ComicSchema = {
  name: ComicSchemaName,
  properties: {
    _id: 'int',
    title: 'string?',
    issueNumber: 'int?',
    description: 'string?',
    modified: 'string',
    pageCount: 'int?',
    onsaleDate: 'string?',
    focDate: 'string?',
    printPrice: 'float?',
    digitalPurchasePrice: 'float?',
    thumbnail: 'string?',
    creators: {type: 'list', objectType: 'string'},
    characters: {type: 'list', objectType: 'string'},
    stories: {type: 'list', objectType: 'string'},
  },
  primaryKey: '_id',
};

export const getRealm = async () => {
  return await Realm.open({
    path: 'myrlm',
    schema: [ComicSchema],
  });
};

