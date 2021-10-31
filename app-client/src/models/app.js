import {userMe, signIn, getRoleList} from '@/services/service';
import {routerRedux} from "dva/router";
import {TOKEN_NAME} from '@/constants';
import router from "umi/router";
import {config} from "utils";
import {notification} from 'antd'

export default ({
  namespace: 'app',
  state: {
    currentActiveUser: null,
    adminMenu: [
      // {path: '/course', title: 'Valyuta', id: [30]},
      // {path: '/kassa', title: 'Kassa', id: [30, 40]},
      // {path: '/income', title: 'Income', id: [30, 40]},
      // {path: '/expence', title: 'Expence', id: [30, 40]},
      // {path: '/user', title: 'User', id: [10, 30, 40]},
      // {path: '/order', title: 'Buyurtmalar', id: [10, 20, 40]},
      // {path: '/order/add', title: 'Buyurtmalar qo\'shish', id: [10, 20, 40]},
      // {path: '/invoice', title: 'Invoice', id: [30, 40]},
      // {path: '/manifacture', title: 'Sozlamalar', id: [30]},
      // {path: '/delivery', title: 'Yetkazib beruvchi', id: [30]},
      // {path: '/product', title: 'Mahsulotlar', id: [30]},
      // {path: '/measure', title: 'O\'lchov birliklari', id: [30]},
      // {path: '/region', title: 'Regionlar', id: [30]},
      // {path: '/source', title: 'Kimdan', id: [30]},
      // {path: '/category', title: 'Kategoriya', id: [30]},
      // {path: '/repost', title: 'Report status', id: [30]},
    ],
    roleList: []
  },
  subscriptions: {
    setup({dispatch, history}) {

      history.listen((location) => {
        if (location.pathname !== '/login') {
          dispatch({
            type: 'userMe',
            payload: {
              path: history.location.pathname
            }
          })
        }

        // if (location.pathname !== "/") {
        //   dispatch({
        //     type: 'query',
        //   });
        // }

      });
    },
  },
  effects: {
    * signIn({payload}, {call, put, select}) {
      const data = yield call(signIn, payload);
      if (data !== undefined && data.accessToken !== undefined) {
        localStorage.setItem(TOKEN_NAME, data.tokenType + " " + data.accessToken);
        const user = yield call(userMe);
        yield put({
          type: 'updateState',
          payload: {
            currentActiveUser: user
          }
        });
        yield put(routerRedux.push('/order'))

        // if (user.roles.filter(role => role.id === 10).length > 0) {
        //   yield put(routerRedux.push('/user'))
        // } else if (user.roles.filter(role => role.id === 20).length > 0) {
        //   yield put(routerRedux.push('/order'))
        // } else if (user.roles.filter(role => role.id === 30).length > 0) {
        //   yield put(routerRedux.push('/course'))
        // } else {
        //   yield put(routerRedux.push('/user'))
        // }

      } else {
        notification.error({
          description: 'Логин или пароль неправильно',
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * userMe({payload}, {call, put, select}) {
      const result = yield call(userMe);
      const getRoles = yield call(getRoleList);
      // const {adminMenu} = yield select(_ => _.app);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentActiveUser: result,
            roleList: getRoles.list
          }
        });
        // let a = 0;
        // adminMenu.filter(item => item.path === payload.path)[0].id.map(fitem => {
        //   if (result.roles.filter(f => f.id === fitem).length > 0) {
        //     a++;
        //   }
        // });
        // if (a === 0) {
        //   router.push("/404");
        // }
        // if (result.roles.filter(role => role.id === 10).length > 0) {
        //   let {roleList} = yield select(_ => _.app);
        //   roleList.push(getRoles.list[1]);
        //   // let unique = [...new Set(roleList)];
        //   let unique = (roleList) => roleList.filter((v, i) => roleList.indexOf(v) === i);
        //   yield put({
        //     type: 'updateState',
        //     payload: {
        //       roleList: unique
        //     }
        //   });
        // }
        // if (result.roles.filter(role => role.id === 30).length > 0) {
        //   let {roleList} = yield select(_ => _.app);
        //   roleList.push(getRoles.list[3]);
        //   yield put({
        //     type: 'updateState',
        //     payload: {
        //       roleList: roleList
        //
        //     }
        //   });
        // }
        // if (result.roles.filter(role => role.id === 40).length > 0) {
        //   let {roleList} = yield select(_ => _.app);
        //   roleList.push(getRoles.list[0]);
        //   yield put({
        //     type: 'updateState',
        //     payload: {
        //       roleList: roleList
        //     }
        //   });
        // }

      } else {
        router.push("/login");
      }
    },

    * chekUser({payload}, {call, put, select}) {
      const token = localStorage.getItem(TOKEN_NAME);
      if (token === null) {
        yield put(routerRedux.push('/login'));
        yield put({
          type: "updateState",
          payload: {
            currentActiveUser: null
          }
        });
      } else {
        const location = window.location;
        if (!config.openPages.includes(location.pathname)) {
          router.push('/404');
        }
      }
      // return true
    },

    * logout({payload}, {call, put, select}) {
      localStorage.clear();
      yield put(routerRedux.push('/login'));
      yield put({
        type: "updateState",
        payload: {
          currentActiveUser: null
        }
      });
      return true
    },

    // eslint-disable-next-line require-yield
    * query({payload}, {put, call, select}) {

      const location = window.location;

      if (!config.openPages.includes(location.pathname)) {
        router.push('/404');
      }

    },

  },

  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload,

      }
    },
  }
})
