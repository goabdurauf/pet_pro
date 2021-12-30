import {getInvoiceList} from '@/services/service'
// import {notification} from 'antd'

export default ({
  namespace: 'finance',
  state: {
    model: '',
    isModalOpen: false,
    itemList: [],
    currentItem: null,
    modalType: 'create',
    isBtnDisabled: false,
    visibleColumns : [
      {
        title: '№',
        dataIndex: 'num',
        key: 'num',
        align: 'center',
        render: (value, item, index) => index+1
      },
      {
        title: 'Название расхода',
        dataIndex: 'name',
        key: 'name',
        render: () => 'Трансортная услуга (рейс)'
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
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/finance') {
          dispatch({
            type: 'queryReceivedInvoices',
          });
        }
      });
    },
  },
  effects: {
    * queryReceivedInvoices({payload}, {call, put, select}) {
      let data = yield call(getInvoiceList);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'ReceivedInvoices',
            itemList: data.list,
            currentItem: null,
            isModalOpen: false,
            isBtnDisabled: false,
            modalType: 'create'
          }
        })
      }
    },
    /*
    * getAdditionals({payload}, {call, put, select}) {
      let manager = yield call(getManagers);
      let county = yield call(getListItems, 2);
      let about = yield call(getListItems, 3);

      if (manager.success && county.success) {
        yield put({
          type: 'updateState',
          payload: {
            managerList: manager.list,
            countryList: county.list,
            aboutList: about.list
          }
        })
      }
    },
    * save({payload}, {call, put, select}) {
      const result = yield call(saveCarrier, payload);
      if (result.success) {
        yield put({
          type: 'query'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false,}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getById({payload}, {call, put, select}) {
      const result = yield call(getCarrierById, payload.id);
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
    * deleteById({payload}, {call, put, select}) {
      const result = yield call(deleteCarrierById, payload.id);
      if (result.success) {
        yield put({
          type: 'query'
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
    }
    */
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
