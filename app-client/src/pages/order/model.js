import {saveOrder, getOrderList, getSelectOrders, getOrderById, deleteOrderById, getClientList, getManagers, getListItems,
        saveShipping, getShippingList, getShippingById, deleteShippingById, getCarrierList} from '@/services/service'
import {notification} from 'antd'
import moment from "moment";
import {Link} from "umi";
import {routerRedux} from "dva/router";

export default ({
  namespace: 'order',
  state: {
    model: '',
    isModalOpen: false,
    itemList: [],
    currentItem: null,
    modalType: 'create',
    createTitle: '',
    editTitle: '',
    modalWidth: 500,
    isBtnDisabled: false,
    managerList: [],
    clientList: [],
    carrierList: [],
    orderStatusList: [],
    currencyList: [],
    shipTypeList: [],
    selectOrderList: [],
    visibleColumns : []
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/order') {
          dispatch({
            type: 'queryOrder',
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
      let client = yield call(getClientList);
      let carrier = yield call(getCarrierList);
      let currency = yield call(getListItems, 4);
      let shipType = yield call(getListItems, 5);
      let status = yield call(getListItems, 6);

      if (manager.success && client.success) {
        yield put({
          type: 'updateState',
          payload: {
            managerList: manager.list,
            clientList: client.list,
            orderStatusList: status.list,
            carrierList: carrier.list,
            currencyList: currency.list,
            shipTypeList: shipType.list,
          }
        })
      }
    },
    * queryOrder({payload}, {call, put, select}) {
      if (payload === undefined){
        payload = {page:0, size:50}
      }
      let data = yield call(getOrderList, payload);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Order',
            itemList: data.object,
            currentItem: {num: '', date: '', clientId: '', managerId: '', statusId: '', final: 0},
            isModalOpen: false,
            isBtnDisabled: false,
            modalType: 'create',
            modalWidth: 600,
            createTitle: 'Создать заказ',
            editTitle: 'Редактировать заказа',
            visibleColumns : [
              {
                title: '№',
                dataIndex: 'nomer',
                key: 'nomer',
                align: 'center',
                render: (value, item, index) => index+1
              },
              {
                title: 'Номер заказа',
                dataIndex: 'num',
                key: 'num',
                render: (text, record) => <Link to={'/order/detail/' + record.id}>{text}</Link>
              },
              {
                title: 'Дата заказа',
                dataIndex: 'date',
                key: 'date',
                render: (text, record) => text.substring(0, text.indexOf(' '))
              },
              {
                title: 'Статус заказа',
                dataIndex: 'statusName',
                key: 'statusName',
              },
              {
                title: 'Клиент',
                dataIndex: 'clientName',
                key: 'clientName',
              },
              {
                title: 'Менеджер',
                dataIndex: 'managerName',
                key: 'managerName',
              }
            ]
          }
        })
      }
    },
    * saveOrder({payload}, {call, put, select}) {
      const result = yield call(saveOrder, payload);
      if (result.success) {
        notification.info({
          description: "Сохранено успешно",
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
        yield put(routerRedux.push('/order/detail/' + result.message));
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
    * getOrderById({payload}, {call, put, select}) {
      const result = yield call(getOrderById, payload.id);
      if (result.success) {
        result.date = moment(result.date, 'DD.MM.YYYY HH:mm:ss');//zone("+05:00")
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
    * deleteOrderById({payload}, {call, put, select}) {
      const result = yield call(deleteOrderById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryOrder'
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
    * queryShipping({payload}, {call, put, select}) {
      let data = yield call(getShippingList);
      let orders = yield call(getSelectOrders);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Shipping',
            itemList: data.list,
            currentItem: {num: '', managerId: '', price: '', rate: 1, final: 0},
            isModalOpen: false,
            isBtnDisabled: false,
            selectOrderList: orders.object,
            modalType: 'create',
            modalWidth: 700,
            createTitle: 'Создать рейс',
            editTitle: 'Редактировать рейса',
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
              },
              {
                title: 'Номер заказа',
                dataIndex: 'orderNum',
                key: 'orderNum',
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
                title: 'Валюта',
                dataIndex: 'currencyName',
                key: 'currencyName',
              },
              {
                title: 'Цена',
                dataIndex: 'finalPrice',
                key: 'finalPrice',
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
            ]
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
    * getShippingById({payload}, {call, put, select}) {
      const result = yield call(getShippingById, payload.id);
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
