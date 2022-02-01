import axios, {AxiosResponse} from 'axios';
import md5 from 'md5';
import {RECORD_COUNT_PER_FETCH} from '../screens/ComicList/ComicListScreen';

const ts = 'marvel-api';
const publicKey = 'YOUR_PUBLIC_KEY';
const privateKey = 'YOUR_PRIVATE_KEY';
const hash = md5(`${ts}${privateKey}${publicKey}`);

const apiKey = {
  ts,
  apikey: publicKey,
  hash,
};

const api = axios.create({
  baseURL: 'https://gateway.marvel.com',
});

export const getComics = (
  _offset = 0,
  _limit = RECORD_COUNT_PER_FETCH,
): Promise<AxiosResponse<any[]>> => {
  return api.get('/v1/public/comics', {
    params: {
      ...apiKey,
      limit: _limit,
      offset: _offset,
      format: 'comic',
      formatType: 'comic',
      orderBy: '-modified',
    },
  });
};
