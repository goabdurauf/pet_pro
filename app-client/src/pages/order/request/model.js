
import {routerRedux} from "dva/router";

export default ({
  namespace: 'orderRequest',
  state: {
    itemList: [],
    currentItem: null,
    currentModal: 'OrderRequest',
    isModalOpen: false,
    isBtnDisabled: false,
    pagination: {
      current: 1,
      pageSize: 10,
      position: ["bottomCenter"]
    },
    isTableLoading: false,
    visibleColumns : []
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/order/request') {
          /*
          dispatch({
            type: 'queryCargo',
          });
          */
        }
      });
    },
  },
  effects: {
    * pushToPage({payload}, {call, put, select}) {
      yield put(routerRedux.push(payload.key));
    }
  },
  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    }
  }
})
