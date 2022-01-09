import {getInvoiceList, getListItems, saveInvoice, getInvoiceById, deleteInvoiceById, getClientList, getKassaList, getCarrierList} from '@/services/service'
import {notification} from 'antd'

export default ({
  namespace: 'finance',
  state: {
    model: '',
    isModalOpen: false,
    itemList: [],
    currentItem: null,
    modalType: 'create',
    isBtnDisabled: false,
    createTitle:'',
    editTitle: '',
    modalWidth: 500,
    kassaInType: 0,
    currencyList: [],
    clientList: [],
    kassaList: [],
    agentList: [],
    carrierList: [],
    visibleColumns: []
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/finance') {
          dispatch({
            type: 'queryReceivedInvoices',
            payload: {type: 'out'}
          });
          dispatch({
            type: 'getAdditionals',
          });
        }
      });
    },
  },
  effects: {
    * queryReceivedInvoices({payload}, {call, put, select}) {
      let data = yield call(getInvoiceList, payload);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'ReceivedInvoices',
            itemList: data.list,
            currentItem: null,
            isModalOpen: false,
            isBtnDisabled: false,
            modalType: 'update',
            visibleColumns: [
              {
                title: '№',
                dataIndex: 'num',
                key: 'num',
                align: 'center',
                render: (value, item, index) => index + 1
              },
              {
                title: 'Название расхода',
                dataIndex: 'name',
                key: 'name',
                // render: (value, item) => item.type === 1 ? 'Трансортная услуга (рейс)' : item.name
              },
              {
                title: 'Перевозчик',
                dataIndex: 'carrierName',
                key: 'carrierName'
              },
              {
                title: 'Счёт выписан (дата)',
                dataIndex: 'invoiceDate',
                key: 'invoiceDate',
              },
              {
                title: 'Сумма (валюта)',
                dataIndex: 'summa',
                key: 'summa',
                render: (value, item, index) => item.price + ' ' + item.currencyName
              },
              {
                title: 'Рейс',
                dataIndex: 'shipNum',
                key: 'shipNum',
              },
              {
                title: 'Номер транспорта',
                dataIndex: 'transportNum',
                key: 'transportNum',
              },
              {
                title: 'Баланс платёжа',
                dataIndex: 'balance',
                key: 'balance',
              },
              {
                title: 'Комментарии',
                dataIndex: 'comment',
                key: 'comment',
              }
            ]
          }
        })
      }
    },
    * querySentInvoices({payload}, {call, put, select}) {
      let data = yield call(getInvoiceList, payload);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'SentInvoices',
            itemList: data.list,
            currentItem: null,
            isModalOpen: false,
            isBtnDisabled: false,
            modalType: 'update',
            visibleColumns: [
              {
                title: '№',
                dataIndex: 'num',
                key: 'num',
                align: 'center',
                render: (value, item, index) => index + 1
              },
              {
                title: 'Название расхода',
                dataIndex: 'name',
                key: 'name',
                // render: (value, item) => item.type === 1 ? 'Трансортная услуга (рейс)' : item.name
              },
              {
                title: 'Перевозчик',
                dataIndex: 'carrierName',
                key: 'carrierName'
              },
              {
                title: 'Счёт выписан (дата)',
                dataIndex: 'invoiceDate',
                key: 'invoiceDate',
              },
              {
                title: 'Сумма (валюта)',
                dataIndex: 'summa',
                key: 'summa',
                render: (value, item, index) => item.price + ' ' + item.currencyName
              },
              {
                title: 'Рейс',
                dataIndex: 'shipNum',
                key: 'shipNum',
              },
              {
                title: 'Номер транспорта',
                dataIndex: 'transportNum',
                key: 'transportNum',
              },
              {
                title: 'Баланс платёжа',
                dataIndex: 'balance',
                key: 'balance',
              },
              {
                title: 'Комментарии',
                dataIndex: 'comment',
                key: 'comment',
              }
            ]
          }
        })
      }
    },
    * getAdditionals({payload}, {call, put, select}) {
      let currency = yield call(getListItems, 4);
      let client = yield call(getClientList);
      let kassa = yield call(getKassaList);
      let agents = yield call(getListItems, 12);
      let carriers = yield call(getCarrierList);

      if (currency.success) {
        yield put({
          type: 'updateState',
          payload: {
            currencyList: currency.list,
            clientList: client.list,
            kassaList: kassa.list,
            agentList: agents.list,
            carrierList: carriers.list,

          }
        })
      }
    },
    * saveReceivedInvoices({payload}, {call, put, select}) {
      const result = yield call(saveInvoice, payload);
      if (result.success) {
        yield put({
          type: 'queryReceivedInvoices',
          payload: {type: 'in'}
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {isBtnDisabled: false,}
        })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getReceivedInvoicesById({payload}, {call, put, select}) {
      const result = yield call(getInvoiceById, payload.id);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: result,
            isModalOpen: true,
            modalType: 'update'
          }
        })
      } else {
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * deleteReceivedInvoicesById({payload}, {call, put, select}) {
      const result = yield call(deleteInvoiceById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryReceivedInvoices',
          payload: {type: 'in'}
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * queryKassa({payload}, {call, put, select}) {
      // let data = yield call(getInvoiceList);

      // if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Kassa',
            // itemList: [],
            currentItem: null,
            isModalOpen: false,
            isBtnDisabled: false,
            modalType: 'create',
            createTitle:'Добавить поступление в кассу',
            editTitle: 'Редактировать поступление в кассу',
            modalWidth: 800,
            kassaInType: 0,
            visibleColumns:[]
          }
        })
      // }
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
