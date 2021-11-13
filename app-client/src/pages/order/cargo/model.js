import {
  deleteCargoById,
  getCargoById,
  getCargoList,
  getCarrierList,
  getClientList,
  getListItems,
  getManagers,
  saveCargo
} from '@/services/service'
import {Link} from "umi";
import {notification} from "antd";
import moment from "moment";
import {routerRedux} from "dva/router";

export default ({
  namespace: 'cargo',
  state: {
    itemList: [],
    currentItem: null,
    isModalOpen: false,
    managerList: [],
    clientList: [],
    carrierList: [],
    currencyList: [],
    shipTypeList: [],
    orderStatusList: [],
    countryList: [],
    packageTypeList: [],
    visibleColumns : [
      {
        title: 'Номер заказа',
        dataIndex: 'orderNum',
        key: 'orderNum',
        render: (text, record) => <Link to={'/order/detail/' + record.orderId}>{text}</Link>
      },
      {
        title: 'Клиент',
        dataIndex: 'clientName',
        key: 'clientName',
      },
      {
        title: 'Дата погрузки',
        dataIndex: 'loadDate',
        key: 'loadDate',
      },
      {
        title: 'Дата разгрузки',
        dataIndex: 'unloadDate',
        key: 'unloadDate',
      },
      {
        title: 'Погрузка',
        dataIndex: 'senderCountryName',
        key: 'senderCountryName',
      },
      {
        title: 'Разгрузка',
        dataIndex: 'receiverCountryName',
        key: 'receiverCountryName',
      }
    ]
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/order/cargo') {
          dispatch({
            type: 'queryCargo',
          });
        }
      });
    },
  },
  effects: {
    * queryCargo({payload}, {call, put, select}) {
      if (payload === undefined){
        payload = {page:0, size:50}
      }
      let data = yield call(getCargoList, payload);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            itemList: data.list
          }
        })
      }
    },
    * getAdditionals({payload}, {call, put, select}) {
      let manager = yield call(getManagers);
      let client = yield call(getClientList);
      let carrier = yield call(getCarrierList);
      let currency = yield call(getListItems, 4);
      let shipType = yield call(getListItems, 5);
      let status = yield call(getListItems, 6);
      let country = yield call(getListItems, 2);
      let packageType = yield call(getListItems, 7);

      if (manager.success && client.success) {
        yield put({
          type: 'updateState',
          payload: {
            managerList: manager.list,
            clientList: client.list,
            carrierList: carrier.list,
            currencyList: currency.list,
            shipTypeList: shipType.list,
            orderStatusList: status.list,
            countryList: country.list,
            packageTypeList: packageType.list
          }
        })
      }
    },
    * saveCargo({payload}, {call, put, select}) {
      const result = yield call(saveCargo, payload);
      if (result.success) {
        yield put({
          type: 'queryCargo'
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
    * getCargoById({payload}, {call, put, select}) {
      const result = yield call(getCargoById, payload.id);
      if (result.success) {
        result.loadDate = moment(result.loadDate, 'DD.MM.YYYY HH:mm:ss');//zone("+05:00")
        result.unloadDate = moment(result.unloadDate, 'DD.MM.YYYY HH:mm:ss');//zone("+05:00")
        yield put({
          type: 'updateState',
          payload: {
            currentItem: result,
            isModalOpen: true
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
    * deleteCargoById({payload}, {call, put, select}) {
      const result = yield call(deleteCargoById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryCargo'
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
