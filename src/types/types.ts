import { DICTIONARY_CODES } from '../const/const';

import store from '../store/store';
const dictionary = store.getState().getDictionary.data;

export interface IUser {
  id: number;
  login: string;
  isActive: boolean;
}

export type Token = {
  token: string;
};

export interface ILogin {
  login: string;
  password: string;
}

export interface IPersonType {
  lastName: string;
  firstName: string;
  driverLicense: string;
  email: string;
}

export interface IDictionary {
  id: number;
  name: string;
  code: CityValuesType | ModelValuesType | CategoryValuesType;
  dictCode: typeof DICTIONARY_CODES;
  categoryId: number;
}

const CityValuesArray: string[] = dictionary.CITIES.reduce(
  (acc: string[], item: IDictionary) => {
    return [...acc, item.code];
  },
  [],
);
export type CityValuesType = (typeof CityValuesArray)[number];

const ModelValuesArray: string[] = dictionary.AUTO.reduce(
  (acc: string[], item: IDictionary) => {
    return [...acc, item.code];
  },
  [],
);
export type ModelValuesType = (typeof ModelValuesArray)[number];

const CategoryValuesArray: string[] = dictionary.AUTO_CATEGORIES.reduce(
  (acc: string[], item: IDictionary) => {
    return [...acc, item.code];
  },
  [],
);
export type CategoryValuesType = (typeof CategoryValuesArray)[number];

const StatusValuesArray: string[] = dictionary.STATUSES.reduce(
  (acc: string[], item: IDictionary) => {
    return [...acc, item.code];
  },
  [],
);
export type StatusValuesType = (typeof StatusValuesArray)[number];

export type DictionaryObject = {
  [K in (typeof DICTIONARY_CODES)[number]]: IDictionary[];
};

export interface IAutoType {
  autoCategory: { code: CategoryValuesType };
  model: { code: ModelValuesType };
}

export interface IProposal {
  id: number;
  status: { code: StatusValuesType };
  person: IPersonType;
  auto: IAutoType;
  city: { code: CityValuesType };
}

export interface IAutoData {
  id: number;
  categoryId: number;
  code: string;
  dictCode: string;
  name: string;
  updatedAt?: null;
  createdAt?: null;
}

export interface IFormProposalData {
  firstName: string;
  lastName: string;
  driverLicense: string;
  email: string;
  city: string;
  autoCategory: string;
  model: string;
}
