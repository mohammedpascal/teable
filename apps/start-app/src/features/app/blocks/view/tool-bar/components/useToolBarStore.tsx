import type { RefObject } from 'react';
import { create } from 'zustand';

interface IPendingDeleteField {
  id: string;
  name: string;
}

interface IToolBarState {
  filterRef: RefObject<HTMLButtonElement> | null;
  sortRef: RefObject<HTMLButtonElement> | null;
  groupRef: RefObject<HTMLButtonElement> | null;
  deleteFieldRef: RefObject<HTMLButtonElement> | null;
  pendingDeleteFields: IPendingDeleteField[] | null;
  setFilterRef: (ref: RefObject<HTMLButtonElement>) => void;
  setSortRef: (ref: RefObject<HTMLButtonElement>) => void;
  setGroupRef: (ref: RefObject<HTMLButtonElement>) => void;
  setDeleteFieldRef: (ref: RefObject<HTMLButtonElement>) => void;
  setPendingDeleteFields: (fields: IPendingDeleteField[] | null) => void;
}

export const useToolBarStore = create<IToolBarState>((set) => ({
  filterRef: null,
  sortRef: null,
  groupRef: null,
  deleteFieldRef: null,
  pendingDeleteFields: null,
  setFilterRef: (ref: RefObject<HTMLButtonElement>) => {
    set((state) => {
      return {
        ...state,
        filterRef: ref,
      };
    });
  },
  setSortRef: (ref: RefObject<HTMLButtonElement>) => {
    set((state) => {
      return {
        ...state,
        sortRef: ref,
      };
    });
  },
  setGroupRef: (ref: RefObject<HTMLButtonElement>) => {
    set((state) => {
      return {
        ...state,
        groupRef: ref,
      };
    });
  },
  setDeleteFieldRef: (ref: RefObject<HTMLButtonElement>) => {
    set((state) => {
      return {
        ...state,
        deleteFieldRef: ref,
      };
    });
  },
  setPendingDeleteFields: (fields: IPendingDeleteField[] | null) => {
    set((state) => {
      return {
        ...state,
        pendingDeleteFields: fields,
      };
    });
  },
}));
