import {saveSupplier, deleteSupplierById, getSupplierById, getSupplierList, getManagers, getListItems} from '@/services/service'
import {notification} from 'antd'

export default ({
  namespace: 'supplier',
  state: {
    model: 'supplier',
    isModalOpen: false,
    itemList: [],
    currentItem: null,
    modalType: 'create',
    countryList: [],
    managerList: [],
    visibleColumns : [
      {
        title: '№',
        dataIndex: 'num',
        key: 'num',
        align: 'center',
        render: (value, item, index) => index+1
      },
      {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Контактное лицо',
        dataIndex: 'contactPerson',
        key: 'contactPerson',
      },
      {
        title: 'Телефон контактного лица',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: 'Страна',
        dataIndex: 'countryName',
        key: 'countryName',
      },
      {
        title: 'Город',
        dataIndex: 'city',
        key: 'city',
      },
      {
        title: 'Менеджер',
        dataIndex: 'managerName',
        key: 'managerName',
      },
      {
        title: 'Откуда узнал о нас',
        dataIndex: 'sourceFrom',
        key: 'sourceFrom',
      }
    ]
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/supplier') {
          dispatch({
            type: 'query',
          });
          dispatch({
            type: 'getAdditionals',
          });
        }
      });
    },
  },
  effects: {
    * query({payload}, {call, put, select}) {
      let data = yield call(getSupplierList);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            itemList: data.list,
            currentItem: null,
            isModalOpen: false,
            modalType: 'create'
          }
        })
      }
    },
    * getAdditionals({payload}, {call, put, select}) {
      let manager = yield call(getManagers);
      let county = yield call(getListItems, 2);

      if (manager.success && county.success) {
        yield put({
          type: 'updateState',
          payload: {
            managerList: manager.list,
            countryList: county.list
          }
        })
      }
    },
    * save({payload}, {call, put, select}) {
      const result = yield call(saveSupplier, payload);
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
    },
    * getById({payload}, {call, put, select}) {
      const result = yield call(getSupplierById, payload.id);
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
      const result = yield call(deleteSupplierById, payload.id);
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
