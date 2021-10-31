import {saveClient, deleteClientById, getClientById, getClientList, getManagers, getListItems} from '@/services/service'
import {notification} from 'antd'

export default ({
  namespace: 'client',
  state: {
    model: 'client',
    isModalOpen: false,
    itemList: [],
    currentItem: null,
    modalType: 'create',
    countryList: [],
    managerList: [],
    aboutList: [],
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
        dataIndex: 'aboutName',
        key: 'aboutName',
      }
    ]
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/client') {
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
      let data = yield call(getClientList);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            itemList: data.list,
            currentItem: null,
            isModalOpen: false,
            isBtnDisabled: false,
            modalType: 'create'
          }
        })
      }
    },
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
      const result = yield call(saveClient, payload);
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
    * getById({payload}, {call, put, select}) {
      const result = yield call(getClientById, payload.id);
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
      const result = yield call(deleteClientById, payload.id);
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
