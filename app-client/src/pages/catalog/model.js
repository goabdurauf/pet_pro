import {
  saveListItem,
  deleteListItemById,
  getListItems,
  getListItemById,
  getUserList,
  getRoleList,
  saveUser,
  getUserById,
  deleteUserById,
  getProductList,
  saveProduct,
  getProductById,
  deleteProductById
} from '@/services/service'
import {notification} from 'antd'

export default ({
  namespace: 'catalog',
  state: {
    model: '',
    title: '',
    createTitle: '',
    editTitle: '',
    isModalOpen: false,
    itemList: [],
    roleList: [],
    currentItem: null,
    modalType: 'create',
    measureList: [],
    visibleColumns: []
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/catalog') {
          dispatch({
            type: 'queryUser',
          });
        }
      });
    },
  },
  effects: {
    * queryUser({payload}, {call, put, select}) {
      let data = yield call(getUserList);
      const roles = yield call(getRoleList);

      if (data.success && roles.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'User',
            title: 'Пользователи',
            createTitle: 'Создать пользователь',
            editTitle: 'Редактировать пользователь',
            isModalOpen: false,
            itemList: data.list,
            roleList: roles.list,
            currentItem: null,
            modalType: 'create',
            visibleColumns: [
              {
                title: '№',
                dataIndex: 'num',
                key: 'num',
                align: 'center',
                render: (value, item, index) => index + 1
              },
              {
                title: 'Пользователь',
                dataIndex: 'fullName',
                key: 'fullName',
                // render: (text, record) => <a>{text}</a>,
              },
              {
                title: 'Логин',
                dataIndex: 'login',
                key: 'login',
              },
              {
                title: 'Тел. номер',
                dataIndex: 'phone',
                key: 'phone',
              },
              {
                title: 'Роль',
                dataIndex: 'role',
                key: 'role',
                render: (text, record) => record.roleName,
              }
            ]
          }
        })
      }
    },
    * saveUser({payload}, {call, put, select}) {
      const result = yield call(saveUser, payload);
      if (result.success) {
        yield put({
          type: 'queryUser'
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
    * getUserById({payload}, {call, put, select}) {
      const result = yield call(getUserById, payload.id);
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
    * deleteUser({payload}, {call, put, select}) {
      const result = yield call(deleteUserById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryUser'
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
    * queryMeasure({payload}, {call, put, select}) {
      let data = yield call(getListItems, 1);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Measure',
            title: 'Единицы измерения',
            createTitle: 'Создать единицу измерения',
            editTitle: 'Редактировать единицу измерения',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            visibleColumns: [
              {
                title: '№',
                dataIndex: 'num',
                key: 'num',
                align: 'center',
                render: (value, item, index) => index + 1
              },
              {
                title: 'Название',
                dataIndex: 'nameRu',
                key: 'nameRu',
              }
            ]
          }
        })
      }
    },
    * saveMeasure({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 1});
      if (result.success) {
        yield put({
          type: 'queryMeasure'
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
    * getMeasureById({payload}, {call, put, select}) {
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
    * deleteMeasure({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryMeasure'
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
    * queryProduct({payload}, {call, put, select}) {
      let data = yield call(getProductList);
      let measure = yield call(getListItems, 1);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Product',
            title: 'Продукты',
            createTitle: 'Создать продукт',
            editTitle: 'Редактировать продукт',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            measureList: measure.list,
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
          }
        })
      }
    },
    * saveProduct({payload}, {call, put, select}) {
      const result = yield call(saveProduct, payload);
      if (result.success) {
        yield put({
          type: 'queryProduct'
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
    * getProductById({payload}, {call, put, select}) {
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
    * deleteProduct({payload}, {call, put, select}) {
      const result = yield call(deleteProductById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryProduct'
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
      return {...state, ...payload}
    }
  }
})
