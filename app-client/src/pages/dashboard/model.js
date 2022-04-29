import {getBalancesByDate, getClientDataForDashboard} from '@/services/service'
import moment from "moment";

export default ({
  namespace: 'dashboard',
  state: {
    model: '',
    isModalOpen: false,
    barData: [
      {
        amount: 5,
        carrier: 4,
        client: 7,
        currency: "CNY"
      },
      {
        amount: 3,
        carrier: 8,
        client: 1,
        currency: "USD"
      }
    ],
    clientData: null,
    currencyList: [],
    columns: []
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/dashboard') {
          dispatch({
            type: 'queryBalance'
          });
          dispatch({
            type: 'queryClients'
          });
        }
      });
    },
  },
  effects: {
    * queryBalance({payload}, {call, put, select}) {
      let date;
      if (payload !== undefined)
        date = payload.date.format('DD.MM.YYYY');
      else
        date = new moment().format('DD.MM.YYYY')
      let bar = yield call(getBalancesByDate, date);
      if (bar.success) {
        yield put({
          type: 'updateState',
          payload: {
            barData: bar.list
          }
        })
      }
    },
    * queryClients({payload}, {call, put, select}) {
      let client = yield call(getClientDataForDashboard, payload !== undefined ? payload.days : -1);
      if (client.success) {
        yield put({
          type: 'updateState',
          payload: {
            clientData: client
          }
        })
      }
    },


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
