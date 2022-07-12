import { intcomma } from 'journalize';

const formatNumber = (num) => {
  return num > 0 ? intcomma(num) : 'Reach not available';
}

export {
  formatNumber
};