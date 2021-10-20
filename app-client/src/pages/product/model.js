import {saveProduct, getProductList, getProductById, deleteProductById, getListItems} from '@/services/service'
import {notification} from 'antd'

export default ({
  namespace: 'product',
  state: {
    model: 'product',
    isModalOpen: false,
    itemList: [],
    currentItem: null,
    modalType: 'create',
    measureList: [],
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
        title: 'Таможенный код',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: 'Единица измерение',
        dataIndex: 'measureName',
        key: 'measureName',
      }
    ]
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/product') {
          dispatch({
            type: 'query',
          });
        }
      });
    },
  },
  effects: {
    * query({payload}, {call, put, select}) {
      let data = yield call(getProductList);
      let measure = yield call(getListItems, 1);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            itemList: data.list,
            currentItem: null,
            isModalOpen: false,
            modalType: 'create',
            measureList: measure.list
          }
        })
      }
    },
    * save({payload}, {call, put, select}) {
      const result = yield call(saveProduct, payload);
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
      const result = yield call(getProductById, payload.id);
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
      const result = yield call(deleteProductById, payload.id);
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
