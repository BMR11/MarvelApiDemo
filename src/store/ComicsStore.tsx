import {action, makeObservable, observable, runInAction} from 'mobx';
import {RootStore} from './RootStore';
import {Comic, ComicViewModel} from '../entities/entityTypes';
import {getComics} from '../api/marvelApi';
import {ComicSchemaName, getRealm} from '../database/realm';

//Note: Currently not used but can be used as we have more stores and want more complex flow
export class ComicsStore {
  comics: ComicViewModel[] = [];
  rootStore: RootStore;
  error: string = 'Oops... Something went wrong';

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      comics: observable,
      error: observable,

      fetchComics: action,
      loadFromDb: action,
      writeTodb: action,
    });
  }

  writeTodb = async (newComics: ComicViewModel[]) => {
    const realm = await getRealm();
    let updatedComics: any[] = [];
    try {
      realm.write(() => {
        newComics.forEach(c => {
          updatedComics.push(
            realm.create(
              ComicSchemaName,
              {
                _id: c.id,
                title: c.title,
                issueNumber: c.issueNumber,
                description: c.description,
                modified: c.modified,
                pageCount: c.pageCount,
                onsaleDate: c.onsaleDate,
                focDate: c.focDate,
                printPrice: c.printPrice,
                digitalPurchasePrice: c.digitalPurchasePrice,
                thumbnail: c.thumbnail,
                creators: c.creators,
                characters: c.characters,
                stories: c.stories,
              },
              'modified',
            ),
          );
        });
      });
    } catch (error) {
      console.error(error);
    }

    // console.warn('ComicSchemaName', realm.objects(ComicSchemaName).length);
  };

  loadFromDb = async () => {
    const realm = await getRealm();
    const dbData: ComicViewModel[] = await realm.objects(ComicSchemaName);
    // console.warn('end', dbData.length);

    this.comics = dbData;
  };

  fetchComics = async (
    _offset: number,
    _length: number,
    shouldAppend = false,
  ) => {
    this.error = '';
    try {
      const response = await getComics(_offset, _length);
      if (response.data) {

        const data: Comic[] = response.data.data.results;

        const comicViewModels: ComicViewModel[] = data.map(c => {
          let _onsaleDate =
            c.dates?.find(d => d.type === 'onsaleDate')?.date ?? '';
          let _focDate = c.dates?.find(d => d.type === 'focDate')?.date ?? '';
          let _printPrice =
            c.prices?.find(d => d.type === 'printPrice')?.price ?? undefined;
          let _digitalPurchasePrice =
            c.prices?.find(d => d.type === 'digitalPurchasePrice')?.price ??
            undefined;
          let _thumbnail = c.thumbnail?.path + '.' + c.thumbnail.extension;

          const _creators = c.creators?.items?.map(_c => _c.name) ?? [];
          const _characters = c.characters?.items?.map(_c => _c.name) ?? [];
          const _stories = c.stories?.items?.map(_c => _c.name) ?? [];

          return {
            id: c.id,
            title: c.title,
            issueNumber: c.issueNumber,
            description: c.description,
            modified: c.modified,
            pageCount: c.pageCount,
            onsaleDate: _onsaleDate,
            focDate: _focDate,
            printPrice: _printPrice,
            digitalPurchasePrice: _digitalPurchasePrice,
            thumbnail: _thumbnail,
            creators: _creators,
            characters: _characters,
            stories: _stories,
          };
        });

        runInAction(() => {
          if (shouldAppend) {
            this.comics = [...this.comics, ...comicViewModels];
          } else {
            this.comics = [...comicViewModels];
          }
        });

        await this.writeTodb(comicViewModels);
      }
    } catch (error) {
      this.error = '' + error;
    }
  };
}
