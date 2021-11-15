import {getSelectOrders, getManagers, getListItems, saveShipping, getShippingList, getShippingById, deleteShippingById, getCarrierList} from '@/services/service'
import {notification} from 'antd'
import {routerRedux} from "dva/router";
import {Link} from "umi";

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
    modalWidth: 700,
    isBtnDisabled: false,
    managerList: [],
    carrierList: [],
    currencyList: [],
    shipTypeList: [],
    selectOrderList: [],
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
        title: 'Менеджер',
        dataIndex: 'managerName',
        key: 'managerName',
      },
      {
        title: 'Перевозчик',
        dataIndex: 'carrierName',
        key: 'carrierName',
      },
      /*{
        title: 'Валюта',
        dataIndex: 'currencyName',
        key: 'currencyName',
      },*/
      {
        title: 'Цена',
        dataIndex: 'customFinalPrice',
        key: 'customFinalPrice',
        render: (text, record) => {return record.finalPrice + ' USD (' + record.price + ' ' + record.currencyName + ')'}
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
      let currency = yield call(getListItems, 4);
      let shipType = yield call(getListItems, 5);
      let orders = yield call(getSelectOrders);

      if (manager.success) {
        yield put({
          type: 'updateState',
          payload: {
            managerList: manager.list,
            carrierList: carrier.list,
            currencyList: currency.list,
            shipTypeList: shipType.list,
            selectOrderList: orders.object
          }
        })
      }
    },
    * queryShipping({payload}, {call, put, select}) {
      let data = yield call(getShippingList);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Shipping',
            itemList: data.list,
            isModalOpen: false,
            isBtnDisabled: false,
            modalType: 'create',
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
