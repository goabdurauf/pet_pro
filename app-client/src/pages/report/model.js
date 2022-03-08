import {getClientBalances, getCarrierBalances} from '@/services/service'

export default ({
  namespace: 'report',
  state: {
    model: '',
    itemList: [],
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
        let arr = [];
        balances.list.forEach(client => {
          client.balancesList.forEach(currency => {
            arr.push({ownerName: client.ownerName, currencyName: currency.currencyName, amount: currency.balance})
          })
        })
        yield put({
          type: 'updateState',
          payload: {
            itemList: arr,
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
                dataIndex: 'amount',
                key: 'amount'
              },

            ]
          }
        })
      }
    },
    * queryCarrierBalances({payload}, {call, put, select}) {
      let balances = yield call(getCarrierBalances);
      if (balances.success) {
        let arr = [];
        balances.list.forEach(carrier => {
          carrier.balancesList.forEach(currency => {
            arr.push({ownerName: carrier.ownerName, currencyName: currency.currencyName, amount: currency.balance})
          })
        })
        yield put({
          type: 'updateState',
          payload: {
            itemList: arr,
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
                dataIndex: 'amount',
                key: 'amount'
              },

            ]
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
