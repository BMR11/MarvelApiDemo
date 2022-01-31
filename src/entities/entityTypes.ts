export interface Organization {
  login: string;
  id: number;
  node_id: string;
  url: string;
  repos_url: string;
  events_url: string;
  hooks_url: string;
  issues_url: string;
  members_url: string;
  public_members_url: string;
  avatar_url: string;
  description: null | string;
  isRead: boolean;
}

export interface Character {
  id: number;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
  };
}

export interface ComicViewModel {
  id: number;
  title: string;
  issueNumber: number;
  description: string;
  modified: string;
  pageCount: number;
  onsaleDate: string;
  focDate: string;
  printPrice: number | undefined;
  digitalPurchasePrice: number | undefined;
  thumbnail: string;
  creators: string[];
  characters: string[];
  stories: string[];
}

export interface Comic {
  id: number;
  digitalId: number;
  title: string;
  issueNumber: number;
  variantDescription: string;
  description: string;
  modified: string;
  isbn: string;
  upc: string;
  diamondCode: string;
  ean: string;
  issn: string;
  format: string;
  pageCount: number;
  textObjects: TextObject[];
  resourceURI: string;
  urls: URL[];
  series: Series;
  variants: Series[];
  collections: any[];
  collectedIssues: any[];
  dates: DateElement[];
  prices: Price[];
  thumbnail: Thumbnail;
  images: Thumbnail[];
  creators: LinkedEntity;
  characters: LinkedEntity;
  stories: LinkedEntity;
  events: LinkedEntity;
}

interface LinkedEntity {
  available: number;
  collectionURI: string;
  items: Item[];
  returned: number;
}

interface Item {
  resourceURI: string;
  name: string;
  role?: string;
  type?: string;
}

interface DateElement {
  type: string;
  date: string;
}

interface Thumbnail {
  path: string;
  extension: string;
}

interface Price {
  type: string;
  price: number;
}

interface Series {
  resourceURI: string;
  name: string;
}
interface TextObject {
  type: string;
  language: string;
  text: string;
}

interface URL {
  type: string;
  url: string;
}
