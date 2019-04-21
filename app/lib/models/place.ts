import Localizable from './localizable';

export default interface IPlace {
  id: string,
  name: Localizable;
  description?: Localizable;
  tags?: Localizable[];
  address?: Localizable;
  location?: {
    lat: number,
    lng: number,
  },
  year_from: number;
  year_to: number;

}