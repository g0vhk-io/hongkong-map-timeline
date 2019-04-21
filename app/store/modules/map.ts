import IPlace from '~/lib/models/place';
import { IPlaceLinkageNode } from '~/lib/models/place-linkage';
import { ActionTree, MutationTree, ActionContext } from 'vuex';
import { RootState } from '../index';
import { getPlaceLinkage } from '~/lib/api';


export interface State {
  selectedPlace: IPlace | null,
  selectedPlaceLinkageNodes: IPlaceLinkageNode[]
};

export interface Actions<S, R> extends ActionTree<S, R> {

  setSelectedPlace(context: ActionContext<S, R>, place: IPlace | null): Promise<void>;

  clearSelectedPlace(context: ActionContext<S, R>): void;
}


export const state = (): State => ({
  selectedPlace: null,
  selectedPlaceLinkageNodes: [],
})


export const actions: Actions<State, RootState> = {
  async setSelectedPlace({ commit }, place: IPlace) {
    commit('setPlace', place);
    const placeLinkageNodes:IPlaceLinkageNode[] = await getPlaceLinkage(place.id);

    commit('setSelectedPlaceLinkageNodes', placeLinkageNodes);
  },

  clearSelectedPlace({ commit }): void {
    commit('setPlace', null);
    commit('setSelectedPlaceLinkageNodes', null);
  }

}

export const mutations: MutationTree<State> = {
  setPlace(state: State, place: IPlace) {
    state.selectedPlace = place;
  },

  setSelectedPlaceLinkageNodes(state: State, placeLinkageNodes: IPlaceLinkageNode[]) {
    state.selectedPlaceLinkageNodes = placeLinkageNodes;
  }
}
