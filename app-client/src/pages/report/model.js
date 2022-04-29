import {getClientBalances, getCarrierBalances, getClientVerificationActs, getCarrierVerificationActs} from '@/services/service'

export default ({
  namespace: 'report',
  state: {
    model: '',
    itemList: [],
    currencyList: [],
    columns: []
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/report') {
          dispatch({
            type: 'queryClientBalances'
          });
        }
      });
    },
  },
  effects: {
    * queryClientBalances({payload}, {call, put, select}) {
      let balances = yield call(getClientBalances);
      if (balances.success) {
        yield put({
          type: 'updateState',
          payload: {
            itemList: balances.agents,
            currencyList: balances.currencies,
            columns: [
              {
                title: 'Клиент',
                dataIndex: 'ownerName',
                key: 'ownerName'
              },
              {
                title: 'Валюта',
                dataIndex: 'currencyName',
                key: 'currencyName'
              },
              {
                title: 'Сумма',
                dataIndex: 'balance',
                key: 'balance'
              },

            ]
          }
        })
      }
    },
    * queryCarrierBalances({payload}, {call, put, select}) {
      let balances = yield call(getCarrierBalances);
      if (balances.success) {
        yield put({
          type: 'updateState',
          payload: {
            itemList: balances.agents,
            currencyList: balances.currencies,
            columns: [
              {
                title: 'Клиент',
                dataIndex: 'ownerName',
                key: 'ownerName'
              },
              {
                title: 'Валюта',
                dataIndex: 'currencyName',
                key: 'currencyName'
              },
              {
                title: 'Сумма',
                dataIndex: 'balance',
                key: 'balance'
              },

            ]
          }
        })
      }
    },
    * queryClientVerificationActs({payload}, {call, put, select}) {
      let verActs = yield call(getClientVerificationActs);
      if (verActs.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'ClientVerificationActs',
            itemList: verActs.list
          }
        })
      }
    },
    * queryCarrierVerificationActs({payload}, {call, put, select}) {
      let verActs = yield call(getCarrierVerificationActs);
      if (verActs.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'CarrierVerificationActs',
            itemList: verActs.list
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
