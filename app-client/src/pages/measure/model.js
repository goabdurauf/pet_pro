import {saveListItem, deleteListItemById, getListItems, getListItemById} from '@/services/service'
import {notification} from 'antd'

export default ({
  namespace: 'measure',
  state: {
    model: 'measure',
    isModalOpen: false,
    itemList: [],
    currentItem: null,
    modalType: 'create',
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
        dataIndex: 'nameRu',
        key: 'nameRu',
      }
    ]
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/measure') {
          dispatch({
            type: 'query',
          });
        }
      });
    },
  },
  effects: {
    * query({payload}, {call, put, select}) {
      let data = yield call(getListItems, 1);

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
    * save({payload}, {call, put, select}) {
      const result = yield call(saveListItem, payload);
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
      const result = yield call(getListItemById, payload.id);
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
    * deleteItem({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
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
