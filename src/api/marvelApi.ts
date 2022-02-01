import axios, {AxiosResponse} from 'axios';
import md5 from 'md5';
import {Comic} from '../entities/entityTypes';

const ts = 'marvel-api';
const publicKey = '764d0a59d47c833643c3582985e255ed';
const privateKey = '4e113fe79bdbc144bdc414c9d57ca3f91a40fdb3';
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
  _limit = 25,
): Promise<AxiosResponse<Comic[]>> => {
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
