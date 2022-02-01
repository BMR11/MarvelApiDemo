import {action, makeObservable, observable, runInAction} from 'mobx';
import {RootStore} from './RootStore';
import {Comic, ComicViewModel} from '../entities/entityTypes';
import {getComics} from '../api/marvelApi';
import {ComicSchemaName, getRealm} from '../database/realm';

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
    console.warn('fetchComics');
    try {
      const response = await getComics(_offset, _length);
      console.warn('fetchComics2');
      if (response.data) {
        console.warn('fetchComics3');

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
          // console.warn(_offset,_length,shouldAppend,data.length,this.comics.length,comicViewModels.length)
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
