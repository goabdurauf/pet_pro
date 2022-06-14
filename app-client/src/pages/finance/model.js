import {
  getInvoiceList,
  getListItems,
  updateInvoice,
  getInvoiceById,
  deleteInvoiceById,
  getClientList,
  getKassaList,
  getCarrierList,
  saveTransactionIn,
  updateTransactionIn,
  getTransactionList,
  getTransactionById,
  getInvoicesByTypeAndClientIdAndCurrencyId,
  getInvoicesByTypeAndClientId,
  saveTransactionOut,
  updateTransactionOut,
  getTransactionNextNum, downloadInvoiceReport
} from '@/services/service'
import {notification} from 'antd'
import {BsCircle, BsCircleHalf, BsCircleFill} from 'react-icons/bs'
import moment from "moment";

export default ({
  namespace: 'finance',
  state: {
    model: '',
    isModalOpen: false,
    itemList: [],
    invoiceList: [],
    currentItem: null,
    modalType: 'create',
    isBtnDisabled: false,
    createTitle:'',
    editTitle: '',
    clientId: null,
    currencyId: null,
    modalWidth: 500,
    kassaInOutType: 0,
    kassaBalance: null,
    searchParams: {page:0, size:50},
    pagination: {
      current: 1,
      pageSize: 50,
      position: ["bottomCenter"]
    },
    currencyList: [],
    clientList: [],
    kassaList: [],
    agentList: [],
    otherExpenseList: [],
    carrierList: [],
    visibleColumns: []
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/finance') {
          dispatch({
            type: 'querySentInvoices',
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
    * getAdditionals({payload}, {call, put, select}) {
      let currency = yield call(getListItems, 4);
      let client = yield call(getClientList);
      let kassa = yield call(getKassaList);
      let agents = yield call(getListItems, 12);
      let oExpenses = yield call(getListItems, 13);
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
            otherExpenseList: oExpenses.list
          }
        })
      }
    },
    * getClientInvoices({payload}, {call, put, select}) {
      let invoices = yield call(getInvoicesByTypeAndClientIdAndCurrencyId, payload);
      if (invoices.success) {
        yield put({
          type: 'updateState',
          payload: {
            invoiceList: invoices.list
          }
        })
      }
    },
    * queryReceivedInvoices({payload}, {call, put, select}) {
      let searchParams = {page:0, size:50, clientId: null, end: null, start: null, word: null};
      let pagination = {current: 1, pageSize: 50, position: ["bottomCenter"]};
      let data = yield call(getInvoiceList, {...payload, ...searchParams});

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'ReceivedInvoices',
            itemList: data.object,
            searchParams,
            pagination: {...pagination, total: data.totalElements},
            currentItem: null,
            isModalOpen: false,
            isBtnDisabled: false,
            modalType: 'update',
            editTitle: 'Редактировать полученный счёт',
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
                title: 'Сумма',
                dataIndex: 'summa',
                key: 'summa',
                render: (value, item, index) => item.price + ' ' + item.currencyName
              },
              {
                title: 'Курс',
                dataIndex: 'rate',
                key: 'rate'
              },
              {
                title: 'Конечное цена',
                dataIndex: 'finalPrice',
                key: 'finalPrice'
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
                title: 'Платёж',
                dataIndex: 'paint',
                key: 'paint',
                align: 'center',
                render: (text, record, index) => record.balance === 0
                  ? <BsCircleFill style={{color: 'limegreen', fontSize: '20px'}} />
                  : record.price === Math.abs(record.balance) ? <BsCircle style={{color: 'limegreen', fontSize: '20px'}} />
                    : <BsCircleHalf style={{color: 'limegreen', fontSize: '20px'}} />
              },
              {
                title: 'Баланс платёжа',
                dataIndex: 'balance',
                key: 'balance',
                render: (value, item, index) => (item.price + item.balance).toFixed(2) + ' / ' + Math.abs(item.balance).toFixed(2)
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
    * saveReceivedInvoices({payload}, {call, put, select}) {
      const result = yield call(updateInvoice, payload);
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
    * querySentInvoices({payload}, {call, put, select}) {
      let searchParams = {page:0, size:50, };
      let pagination = {current: 1, pageSize: 50, position: ["bottomCenter"]};
      let data = yield call(getInvoiceList, {...payload, ...searchParams});

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'SentInvoices',
            itemList: data.object,
            searchParams,
            pagination: {...pagination, total: data.totalElements},
            currentItem: null,
            isModalOpen: false,
            isBtnDisabled: false,
            modalType: 'update',
            editTitle: 'Редактировать выписанный счёт',
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
                title: 'Клиент',
                dataIndex: 'clientName',
                key: 'clientName'
              },
              {
                title: 'Счёт выписан (дата)',
                dataIndex: 'invoiceDate',
                key: 'invoiceDate',
              },
              {
                title: 'Сумма',
                dataIndex: 'summa',
                key: 'summa',
                render: (value, item, index) => item.price + ' ' + item.currencyName
              },
              {
                title: 'Курс',
                dataIndex: 'rate',
                key: 'rate'
              },
              {
                title: 'Конечное цена',
                dataIndex: 'finalPrice',
                key: 'finalPrice'
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
                title: 'Платёж',
                dataIndex: 'paint',
                key: 'paint',
                align: 'center',
                render: (text, record, index) => record.balance === 0
                  ? <BsCircleFill style={{color: 'limegreen', fontSize: '20px'}} />
                  : record.price === Math.abs(record.balance) ? <BsCircle style={{color: 'limegreen', fontSize: '20px'}} />
                    : <BsCircleHalf style={{color: 'limegreen', fontSize: '20px'}} />
              },
              {
                title: 'Баланс платёжа',
                dataIndex: 'balance',
                key: 'balance',
                render: (value, item, index) => (item.price + item.balance).toFixed(2) + ' / ' + Math.abs(item.balance).toFixed(2)
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
    * searchSentInvoices({payload}, {call, put, select}) {
      const {pagination} = yield select(_ => _.finance);
      let data = yield call(getInvoiceList, payload);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            itemList: data.object,
            searchParams: {...payload},
            pagination: {...pagination, current: payload.page + 1, total: data.totalElements}
          }
        })
      }
    },
    * searchReceivedInvoices({payload}, {call, put, select}) {
      yield put({
        type: 'searchSentInvoices',
        payload: {...payload}
      })
    },
    * saveSentInvoices({payload}, {call, put, select}) {
      const result = yield call(updateInvoice, payload);
      if (result.success) {
        yield put({
          type: 'querySentInvoices',
          payload: {type: 'out'}
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
    * getSentInvoicesById({payload}, {call, put, select}) {
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
    * deleteSentInvoicesById({payload}, {call, put, select}) {
      const result = yield call(deleteInvoiceById, payload.id);
      if (result.success) {
        yield put({
          type: 'querySentInvoices',
          payload: {type: 'out'}
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
      let searchParams = {page:0, size:50};
      let pagination = {current: 1, pageSize: 50, position: ["bottomCenter"]};
      let data = yield call(getTransactionList, searchParams);
      let kassa = yield call(getKassaList);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Kassa',
            itemList: data.object,
            pagination: {...pagination, total: data.totalElements},
            kassaList: kassa.list,
            currentItem: null,
            isModalOpen: false,
            isBtnDisabled: false,
            modalType: 'create',
            modalWidth: 1100,
            kassaInOutType: 0,
            kassaBalance: null,
            visibleColumns: [
              {
                title: '№',
                dataIndex: 'num',
                key: 'num',
                align: 'center',
                render: (value, item, index) => index + 1
              },
              {
                title: 'Дата',
                dataIndex: 'date',
                key: 'date',
                render: (text, record) => text && text.substring(0, text.indexOf(' '))
              },
              {
                title: 'Сумма договора',
                dataIndex: 'finalPrice',
                key: 'finalPrice',
                render: (text, record) => text + ' ' + record.currencyName
              },
              {
                title: 'Курс',
                dataIndex: 'rate',
                key: 'rate',
                render: (text, record) => text.toFixed(4)
              },
              {
                title: 'Откуда / куда',
                dataIndex: 'sourceName',
                key: 'sourceName',
              },
              {
                title: 'Сумма получение',
                dataIndex: 'price',
                key: 'price',
                render: (text, record) => text + ' ' + record.currencyInName
              },
              {
                title: 'Касса',
                dataIndex: 'kassaName',
                key: 'kassaName',
              },
              {
                title: 'Полученный и Выписанный счёт',
                dataIndex: 'invoiceStatus',
                key: 'invoiceStatus',
                render: (text, record) => record.invoiceStatus !== null ? <div key={record.id} className={'transfered_true'}>{record.invoiceStatus}</div> : ''
              },
              {
                title: 'Вид',
                dataIndex: 'vid',
                key: 'vid',
                render: (text, record) => record.kassaType < 200 ? 'Поступление' : 'Расход'
              },
              {
                title: 'Операция',
                dataIndex: 'sourceType',
                key: 'sourceType',
              }
            ]
          }
        })
      }
    },
    * saveKassa({payload}, {call, put, select}) {
      const result = payload.kassaInOutType < 200 ? yield call(saveTransactionIn, payload) : yield call(saveTransactionOut, payload);
      if (result.success) {
        yield put({
          type: 'queryKassa'
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
    * updateKassa({payload}, {call, put, select}) {
      const result = payload.kassaInOutType < 200 ? yield call(updateTransactionIn, payload) : yield call(updateTransactionOut, payload);
      if (result.success) {
        yield put({
          type: 'queryKassa'
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
    * getKassaById({payload}, {call, put, select}) {
      const result = yield call(getTransactionById, payload.id);
      if (result.success) {
        result.date = moment(result.date, 'DD.MM.YYYY HH:mm:ss');
        let editTitle = result.kassaType < 200 ? 'Редактировать поступление в кассу' : 'Редактировать расход из кассы'
        yield put({
          type: 'updateState',
          payload: {
            currentItem: result,
            kassaInOutType: result.kassaType,
            editTitle,
            isModalOpen: true,
            modalType: 'update'
          }
        })
        if (result.kassaType === 101 || result.kassaType === 201) {
          let invoices = result.kassaType === 101
            ? yield call(getInvoicesByTypeAndClientId, {clientId: result.clientId, type: 'out'})
            : yield call(getInvoicesByTypeAndClientId, {clientId: result.carrierId, type: 'in'});
          if (invoices.success) {
            let totalCredit = 0;
            let totalDebit = 0;
            let totalFinal = 0;
            result.invoices.forEach(item => {
              totalCredit += item.credit;
              totalDebit += item.debit;
              totalFinal += item.finalPrice;
            })
            yield put({
              type: 'updateState',
              payload: {
                currentItem: {...result, totalCredit, totalDebit, totalFinal},
                invoiceList: invoices.list
              }
            })
          }
        }
      } else {
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * searchKassa({payload}, {call, put, select}) {
      const {pagination} = yield select(_ => _.finance);
      let data = yield call(getTransactionList, payload);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            itemList: data.object,
            searchParams: {...payload},
            pagination: {...pagination, current: payload.page + 1, total: data.totalElements}
          }
        })
      }
    },
    * getKassaNextNum({payload}, {call, put, select}) {
      const result = yield call(getTransactionNextNum);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            isModalOpen: true,
            currentItem: {invoices: [{credit: ''}], num: result.message, date: moment(new Date(), 'DD.MM.YYYY HH:mm:ss')}
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
    * download({payload}, {call, put, select}) {
      yield call(downloadInvoiceReport, payload)
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
