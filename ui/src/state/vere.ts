import api from '@/api';
import create, { SetState } from 'zustand';
import produce from 'immer';

interface Vere {
  cur: VereState;
  next?: VereState;
  set: SetState<Vere>;
  loaded: boolean;
  isLatest: boolean;
  vereVersion: string;
  latestVereVersion: string;
}

interface VereState {
  rev: string;
  non?: string;
  zuse?: number;
  arvo?: number;
  lull?: number;
  hoon?: number;
  nock?: number;
}

const useVereState = create<Vere>((set, get) => ({
  cur: {
    rev: '',
  },
  loaded: false,
  isLatest: true,
  vereVersion: '',
  latestVereVersion: '',
  set,
}));

const fetchRuntimeVersion = () => {
  api
    .thread({
      inputMark: 'noun',
      outputMark: 'vere-update',
      desk: 'base',
      threadName: 'runtime-version',
      body: '',
    })
    .then((data) => {
      useVereState.setState((state) => {
        if (typeof data === 'object' && data !== null) {
          const vereData = data as Vere;
          const vereVersion = vereData.cur.rev.split('/')[3].substr(2);
          const latestVereVersion =
            vereData.next !== undefined
              ? vereData.next.rev.split('/')[2].substr(3)
              : vereVersion;
          const isLatest =
            vereVersion === latestVereVersion || vereData.next === undefined;

          return Object.assign(vereData, {
            loaded: true,
            isLatest,
            vereVersion,
            latestVereVersion,
          });
        }
        return state;
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

fetchRuntimeVersion();

setInterval(fetchRuntimeVersion, 1800000);

export default useVereState;

// window.vere = useVereState.getState;
