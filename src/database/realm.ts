import Realm from 'realm';

export const ComicSchemaName = 'Comic';
const ComicSchema = {
  name: ComicSchemaName,
  properties: {
    _id: 'int',
    name: 'string',
    status: 'string?',
  },
  primaryKey: '_id',
};



// open a local realm with the 'Cat' schema
export const getRealm = async () => {
  return await Realm.open({
    path: 'myr12112',
    schema: [ComicSchema],
  });
};

// export const getAllCats = realm?.objects('Cat');
// export const AddCat = (cat: CatObj) => {};
