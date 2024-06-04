import { IFormProposalData, DictionaryObject, IProposal } from '../types/types';

export const convertProposalObject = (
  data: IFormProposalData,
  dictionaryData: DictionaryObject,
  id: number,
): IProposal => {
  const {
    firstName,
    lastName,
    driverLicense,
    email,
    city,
    autoCategory,
    model,
  } = data;

  return {
    id: id,
    status: {
      code: 'DRAFT',
    },
    person: {
      lastName,
      firstName,
      driverLicense,
      email,
    },

    auto: {
      autoCategory: {
        code:
          dictionaryData?.AUTO_CATEGORIES.filter(
            (item) => item.name === autoCategory,
          )[0]?.code ?? '',
      },
      model: {
        code:
          dictionaryData?.AUTO.filter((item) => item.name === model)[0]?.code ??
          '',
      },
    },

    city: {
      code:
        dictionaryData?.CITIES.filter((item) => item.name === city)[0]?.code ??
        '',
    },
  };
};
