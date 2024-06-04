import store from '../store/store';

export const getDictionaryItem = (
  type: string,
  value: string | undefined,
): string | undefined => {
  const dictionary = store.getState().getDictionary.data;

  if (dictionary) {
    return dictionary[type]?.find((item) => item.code === value)?.name;
  } else {
    return '';
  }
};
