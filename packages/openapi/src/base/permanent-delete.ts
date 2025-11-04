import { axios } from '../axios';
import { urlBuilder } from '../utils';

export const DELETE_BASE = '/base/bse0';

export const deleteBase = async () => {
  return await axios.delete<null>(urlBuilder(DELETE_BASE));
};
