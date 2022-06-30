import {
  getBalancesByDate,
  getClientDataForDashboard,
  getDebtReport,
  getGrowthReport,
  getOrderGrowthReport
} from '@/services/service'
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
          dispatch({
            type: 'fetchDebtReports'
          })
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
    * queryGrowthClients({payload}, {call, put, select}) {
      const dates = payload.date

      let formattedDates = []
      if (payload.date !== undefined)
        formattedDates = dates.map(date => date.format('DD.MM.YYYY'))

      const [begin, end] = formattedDates

      let clientsData = yield call(getGrowthReport, { begin, end })
      let orderData = yield call(getOrderGrowthReport, { begin, end })

      if (clientsData.success) {
        let clients = clientsData.list.map(item => ({ date: item.date, count: item.clientCount }))
        let orders = orderData.list.map(item => ({ date: item.date, count: item.orderCount }))

        yield put({
          type: 'updateState',
          payload: {
            growthClients: clients,
            growthOrders: orders
          }
        })
      }
    },
    * fetchDebtReports({payload}, {call, put, select}) {
      const debtReports = yield call(getDebtReport)

      if (debtReports.success) {

        yield put({
          type: 'updateState',
          payload: {
            debtReports: []
          }
        })
      }
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
