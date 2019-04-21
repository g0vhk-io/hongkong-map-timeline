import IPlace from './models/place';
import axios from 'axios';
import { API_HOST } from './config';
import { generateLinkageTree, IPlaceLinkageNode } from './models/place-linkage';

export async function getPlaces(lat: Number, lng: Number, radius: Number): Promise<IPlace[]> {
  let places: IPlace[] = []
  try {
    const { data } = await axios.get(`${API_HOST}/place/?lat=${lat}&lng=${lng}&r=${radius}`);

    places = data.data.places;
  } catch (error) {
    console.error(error.message);
    console.error(error.stack);
  }
  return places;
}


export async function getPlace(id: String): Promise<IPlace | null> {

  try {
    const { data }  = await axios.get(`${API_HOST}/place/${id}`);
    return data.data;
  } catch (error) {
    console.error(error.message);
    console.error(error.stack);
    return null;
  }
}

export async function getPlaceLinkage(id: string): Promise<IPlaceLinkageNode[]> {
  try {
    const { data }  = await axios.get(`${API_HOST}/place/${id}/linkage`);
    return generateLinkageTree(data.data, id);
  } catch (error) {
    console.error(error.message);
    console.error(error.stack);
    return null;
  }
}