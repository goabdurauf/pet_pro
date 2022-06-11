import {saveOrder, getOrderList, getOrderById, deleteOrderById, getClientList, getManagers, getListItems,
        getCarrierList} from '@/services/service'
import {notification, Tag} from 'antd'
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
    searchParams: {page:0, size:50},
    modalType: 'create',
    createTitle: '',
    editTitle: '',
    modalWidth: 500,
    isBtnDisabled: false,
    pagination: {
      current: 1,
      pageSize: 50,
      position: ["bottomCenter"]
    },
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
      const {searchParams, pagination} = yield select(_ => _.order);
      let data = yield call(getOrderList, searchParams);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Order',
            itemList: data.object,
            pagination: {...pagination, total: data.totalElements},
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
                render: (text, record) => text && text.substring(0, text.indexOf(' '))
              },
              {
                title: 'Статус заказа',
                dataIndex: 'statusName',
                key: 'statusName',
                render: (text, record) => (record.statusColor !== null ? <Tag color={record.statusColor} key={record.statusColor} style={{fontSize: '14px'}}>{text}</Tag> : '')
              },
              {
                title: 'Клиент',
                dataIndex: 'clientName',
                key: 'clientName',
              },
              {
                title: 'Номер транспорта',
                dataIndex: 'transportNum',
                key: 'transportNum',
                render: (text, record) => {
                  let data = [];
                  if (record.shippingList.length > 0) {
                    record.shippingList.forEach(shipping => {
                      data.push(<div key={shipping.id}>{shipping.shippingNum}<br/></div>);
                    })
                  }
                  return data;
                }
              },
              {
                title: 'Перевозчик',
                dataIndex: 'carrierName',
                key: 'carrierName',
                render: (text, record) => {
                  let data = [];
                  if (record.shippingList.length > 0) {
                    record.shippingList.forEach(shipping => {
                      data.push(<div key={shipping.id}>{shipping.carrierName}<br/></div>);
                    })
                  }
                  return data;
                }
              },
              {
                title: 'Номер рейса',
                dataIndex: 'shippingNum',
                key: 'shippingNum',
                render: (text, record) => {
                  let data = [];
                  if (record.shippingList.length > 0) {
                    record.shippingList.forEach(shipping => {
                      data.push(<div key={shipping.id}>{shipping.num}<br/></div>);
                    })
                  }
                  return data;
                }
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
    * searchOrder({payload}, {call, put, select}) {
      const {pagination} = yield select(_ => _.order);
      let data = yield call(getOrderList, payload);

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
