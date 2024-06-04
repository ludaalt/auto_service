export const AUTH_TIMEOUT = 600000;
export const SUCCESS_AUTH_STATUS = 201;

export enum SERVER_RESPONCE_CODE {
  SUCCESS = 200,
}

export const DICTIONARY_CODES = [
  'AUTO',
  'CITIES',
  'STATUSES',
  'AUTO_CATEGORIES',
];

export const SERVER_RESPONCE_AUTO_ID = {
  1: 'LADA',
  2: 'VOLKSWAGEN',
  3: 'RENAULT',
  4: 'SKODA',
};

export const proposalListTableHeadCells = [
  { id: '1', label: 'ID', cellName: 'id' },
  { id: '2', label: 'Город', cellName: 'city' },
  { id: '3', label: 'Модель', cellName: 'model' },
  { id: '4', label: 'Категория', cellName: 'category' },
  { id: '5', label: 'Пользователь', cellName: 'person' },
  { id: '6', label: 'Статус', cellName: 'status' },
];
