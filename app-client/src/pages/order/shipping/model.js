import {
  getSelectOrders,
  getManagers,
  getListItems,
  saveShipping,
  getShippingList,
  getShippingById,
  deleteShippingById,
  getCarrierList,
  getClientList, downloadInvoiceReport, downloadShippingReport
} from '@/services/service'
import {notification} from 'antd'
import {routerRedux} from "dva/router";
import {Link} from "umi";
import moment from "moment";

export default ({
  namespace: 'shipping',
  state: {
    model: '',
    isModalOpen: false,
    itemList: [],
    currentItem: null,
    modalType: 'create',
    createTitle: 'Создать рейс',
    editTitle: 'Редактировать рейса',
    modalWidth: 800,
    isBtnDisabled: false,
    isPlanning: false,
    searchParams: {page:0, size:50},
    pagination: {
      current: 1,
      pageSize: 50,
      position: ["bottomCenter"]
    },    managerList: [],
    carrierList: [],
    clientList: [],
    currencyList: [],
    shipTypeList: [],
    transportKindList: [],
    transportConditionList: [],
    selectOrderList: [],
    stationList:[],
    visibleColumns : [
      {
        title: '№',
        dataIndex: 'nomer',
        key: 'nomer',
        align: 'center',
        render: (value, item, index) => index+1
      },
      {
        title: 'Номер рейса',
        dataIndex: 'num',
        key: 'num',
        render: (text, record) => <Link to={'/order/shipping/detail/' + record.id}>{text}</Link>
      },
      {
        title: 'Номер заказа',
        dataIndex: 'orderNum',
        key: 'orderNum',
        render: (text, record) => {
          let data = [];
          record.orderList && record.orderList.forEach(order => {
            data.push(<div key={order.id}><Link key={order.id} to={'/order/detail/' + order.id}>{order.num}</Link> {order.date.substring(0, order.date.indexOf(' '))}</div>)
          });
          return data;
        }
      },
      {
        title: 'Дата загрузки',
        dataIndex: 'loadDate',
        key: 'loadDate',
      },
      {
        title: 'Дата разгрузки',
        dataIndex: 'unloadDate',
        key: 'unloadDate',
      },
      {
        title: 'Клиент',
        dataIndex: 'clientName',
        key: 'clientName',
        render: (text, record) => {
          let data = [];
          record.orderList && record.orderList.forEach(order => {
            data.push(<div key={order.id}>{order.clientName}</div>)
          });
          return data;
        }
      },
      {
        title: 'Менеджер',
        dataIndex: 'managerName',
        key: 'managerName',
      },
      {
        title: 'Перевозчик',
        dataIndex: 'carrierName',
        key: 'carrierName',
      },
      {
        title: 'Цена',
        dataIndex: 'customFinalPrice',
        key: 'customFinalPrice',
        render: (text, record) => {return record.finalPrice !== null ? record.finalPrice + ' USD (' + record.price + ' ' + record.currencyName + ')' : ''}
      },
      {
        title: 'Тип транспорта',
        dataIndex: 'shippingTypeName',
        key: 'shippingTypeName',
      },
      {
        title: 'Номер транспорта',
        dataIndex: 'shippingNum',
        key: 'shippingNum',
      },
      {
        title: 'Финанс',
        children: [
          {
            title: 'Вы. счёт',
            dataIndex: 'invoiceIn',
            key: 'invoiceIn'
          },
          {
            title: 'Пол. счёт',
            dataIndex: 'invoiceOut',
            key: 'invoiceOut',
            render: (text, record) => {
              let data = [];
              if (record.price !== null && record.currencyName !== null)
                data.push(<div key={record.id} className={record.invoiceInId === null ? 'transfered_false' : 'transfered_true'}>{record.price} {record.currencyName}</div>);
              if (record.expenseList && record.expenseList.length > 0) {
                record.expenseList.forEach(ex => {
                  data.push(<div key={ex.id}
                                 className={ex.invoiceInId === null ? 'transfered_false' : 'transfered_true'}>{ex.toPrice} {ex.toCurrencyName}</div>)
                });
              }
              return data;
            }
          }
        ]
      },
      {
        title: 'Документы',
        dataIndex: 'docs',
        key: 'docs',
        render: (text, record) => {
          let data = [];
          if (record.documents.length > 0) {
            record.documents.forEach(doc => {
              let title = doc.title + ' (' + doc.date.substring(0, doc.date.indexOf(' ')) + ')';
              if (doc.attachments.length > 0) {
                doc.attachments.forEach(att => {
                  data.push(<div key={att.id}><a href={att.url} target="_blank" rel="noreferrer">{title + (att.docType !== null ? ' - ' + att.docType : '')}</a><br/></div>)
                })
              } else
                data.push(<div key={doc.id}>{title}<br/></div>);
            })
          }
          return data;
        }
      },
    ]
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/order/shipping') {
          dispatch({
            type: 'queryShipping',
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
      let manager = yield call(getManagers);
      let carrier = yield call(getCarrierList);
      let client = yield call(getClientList);
      let currency = yield call(getListItems, 4);
      let shipType = yield call(getListItems, 5);
      let trKindList = yield call(getListItems, 10);
      let trCondList = yield call(getListItems, 11);
      let stations = yield call(getListItems, 16);

      if (manager.success) {
        yield put({
          type: 'updateState',
          payload: {
            managerList: manager.list,
            carrierList: carrier.list,
            clientList: client.list,
            currencyList: currency.list,
            shipTypeList: shipType.list,
            transportKindList: trKindList.list,
            transportConditionList: trCondList.list,
            stationList: stations.list
          }
        })
      }
    },
    * queryShipping({payload}, {call, put, select}) {
      const {searchParams, pagination} = yield select(_ => _.shipping);
      let data = yield call(getShippingList, searchParams);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Shipping',
            itemList: data.object,
            pagination: {...pagination, total: data.totalElements},
            isModalOpen: false,
            isBtnDisabled: false,
            isPlanning: false,
            modalType: 'create',
          }
        })
      }
    },
    * searchShipping({payload}, {call, put, select}) {
      const {pagination} = yield select(_ => _.shipping);
      let data = yield call(getShippingList, payload);

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
    * saveShipping({payload}, {call, put, select}) {
      const result = yield call(saveShipping, payload);
      if (result.success) {
        yield put({
          type: 'queryShipping'
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
          payload: {isBtnDisabled: false}
        })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getShippingById({payload}, {call, put, select}) {
      const result = yield call(getShippingById, payload.id);
      if (result.success) {
        result.loadDate = result.loadDate !== null ? moment(result.loadDate, 'DD.MM.YYYY HH:mm') : '';//zone("+05:00")
        result.loadSendDate = result.loadSendDate !== null ? moment(result.loadSendDate, 'DD.MM.YYYY HH:mm') : '';
        result.customArrivalDate = result.customArrivalDate !== null ? moment(result.customArrivalDate, 'DD.MM.YYYY HH:mm') : '';
        result.customSendDate = result.customSendDate !== null ? moment(result.customSendDate, 'DD.MM.YYYY HH:mm') : '';
        result.unloadArrivalDate = result.unloadArrivalDate !== null ? moment(result.unloadArrivalDate, 'DD.MM.YYYY HH:mm') : '';
        result.unloadDate = result.unloadDate !== null ? moment(result.unloadDate, 'DD.MM.YYYY HH:mm') : '';

        yield put({
          type: 'updateState',
          payload: {
            currentItem: result,
            isModalOpen: true,
            modalType: 'update',
            selectOrderList: result.orderSelect,
            modalWidth: 800
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
    * deleteShippingById({payload}, {call, put, select}) {
      const result = yield call(deleteShippingById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryShipping'
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
    * pushToPage({payload}, {call, put, select}) {
      yield put(routerRedux.push(payload.key));
    },
    * openModal({payload}, {call, put, select}) {
      let orders = yield call(getSelectOrders);
      yield put({
        type: 'updateState',
        payload: {
          isModalOpen: true,
          currentItem: {rate:1},
          modalType: 'create',
          isBtnDisabled: false,
          selectOrderList: orders.object,
          modalWidth: 800
        }
      })
    },
    * download({payload}, {call, put, select}) {
      yield call(downloadShippingReport, payload)
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
