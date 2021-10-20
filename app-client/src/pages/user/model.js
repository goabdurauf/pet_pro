import {saveUser, getRoleList, getUserById, getUserList, deleteUserById} from '@/services/service'
import {notification} from 'antd'

export default ({
  namespace: 'users',
  state: {
    isModalOpen: false,
    userList: [],
    currentItem: null,
    roleList: [],
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
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/user') {
          dispatch({
            type: 'query',
          });
        }
      });
    },
  },
  effects: {
    * query({payload}, {call, put, select}) {
      let users = yield call(getUserList);
      const roles = yield call(getRoleList);

      if (users.success && roles.success) {
        yield put({
          type: 'updateState',
          payload: {
            userList: users.list,
            roleList: roles.list,
            currentItem: null,
            isModalOpen: false,
            modalType: 'create'
          }
        })
      }
    },
    * save({payload}, {call, put, select}) {
      const result = yield call(saveUser, payload);
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
