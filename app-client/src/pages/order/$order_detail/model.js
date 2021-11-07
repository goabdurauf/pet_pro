import {saveOrder, getOrderList, getOrderById, deleteOrderById, getClientList, getManagers, getListItems, uploadFile, deleteFile} from '@/services/service'
import {Input, Select, Form, notification} from 'antd'
import moment from "moment";
import React from "react";
import {routerRedux} from "dva/router";

export default ({
  namespace: 'orderDetail',
  state: {
    model: '',
    isModalOpen: false,
    itemList: [],
    currentItem: null,
    modalType: 'create',
    modalWidth: 100,
    managerList: [],
    clientList: [],
    orderStatusList: [],
    countryList: [],
    cargoDetails: [],
    packageTypeList: [],
    senderAttachments: [],
    receiverAttachments: [],
    customFromAttachments: [],
    customToAttachments: [],
    isBtnDisabled: false,
    isLoading: '',
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
      },
      {
        title: 'Дата заказа',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Статус заказа',
        dataIndex: 'statusName',
        key: 'statusName',
      },
      {
        title: 'Клиент',
        dataIndex: 'clientName',
        key: 'clientName',
      },
      {
        title: 'Менеджер',
        dataIndex: 'managerName',
        key: 'managerName',
      }
    ]
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname.startsWith('/order/detail')) {
          dispatch({
            type: 'getDetail',
            payload:{id: location.pathname.split('/')[3]}
          });
          dispatch({
            type: 'query'
          });
          dispatch({
            type: 'getAdditionals'
          });
        }
      });
    },
  },
  effects: {
    * getDetail({payload}, {call, put, select}) {
      console.log(payload.id);
    },
    * query({payload}, {call, put, select}) {
      // let data = yield call(getOrderList);
      let packageType = yield call(getListItems, 7);

      // if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Cargo',
            // itemList: data.list,
            cargoDetails: [
              {
                weight: <Form.Item key={'weight'} name={'weight'}><Input name={'weight'} placeholder='Вес'/></Form.Item>,
                capacity: <Form.Item key={'capacity'} name={'capacity'}><Input name={'capacity'} placeholder='Объём'/></Form.Item>,
                packageTypeId: <Form.Item key={'packageTypeId'} name={'packageTypeId'}><Select name={'packageTypeId'} placeholder='Тип упаковки'>
                  {packageType.list.map(type => <Select.Option key={type.id} value={type.id}>{type.nameRu}</Select.Option>)}
                </Select></Form.Item>,
                packageAmount: <Form.Item key={'packageAmount'} name={'packageAmount'}><Input name={'packageAmount'} placeholder='Количество упаковки'/></Form.Item>
              },{
                weight: <Form.Item key={'weight'} name={'weight'}><Input name={'weight'} placeholder='Вес'/></Form.Item>,
                capacity: <Form.Item key={'capacity'} name={'capacity'}><Input name={'capacity'} placeholder='Объём'/></Form.Item>,
                packageTypeId: <Form.Item key={'packageTypeId'} name={'packageTypeId'}><Select name={'packageTypeId'} placeholder='Тип упаковки'>
                  {packageType.list.map(type => <Select.Option key={type.id} value={type.id}>{type.nameRu}</Select.Option>)}
                </Select></Form.Item>,
                packageAmount: <Form.Item key={'packageAmount'} name={'packageAmount'}><Input name={'packageAmount'} placeholder='Количество упаковки'/></Form.Item>
              },
            ],
            cargoDetails1: [
              {
                weight: <input type="number" className="form-control text-center" name="weight" placeholder="Вес"/>,
                capacity: <input type="number" className="form-control text-center" name="capacity" placeholder="Объём"/>,
                packageTypeId: <select name="packageTypeId" placeholder='Тип упаковки'>
                  {packageType.list.map(type => <option key={type.id} value={type.id}>{type.nameRu}</option>)}
                </select>,
                packageAmount: <input type="number" className="form-control text-center" name="packageAmount" placeholder="Количество упаковки"/>,
              },{
                weight: <input type="number" className="form-control text-center" name="weight" placeholder="Вес"/>,
                capacity: <input type="number" className="form-control text-center" name="capacity" placeholder="Объём"/>,
                packageTypeId: <select name="packageTypeId" placeholder='Тип упаковки'>
                  {packageType.list.map(type => <option key={type.id} value={type.id}>{type.nameRu}</option>)}
                </select>,
                packageAmount: <input type="number" className="form-control text-center" name="packageAmount" placeholder="Количество упаковки"/>,
              },{
                weight: <input type="number" className="form-control text-center" name="weight" placeholder="Вес"/>,
                capacity: <input type="number" className="form-control text-center" name="capacity" placeholder="Объём"/>,
                packageTypeId: <select name="packageTypeId" placeholder='Тип упаковки'>
                  {packageType.list.map(type => <option key={type.id} value={type.id}>{type.nameRu}</option>)}
                </select>,
                packageAmount: <input type="number" className="form-control text-center" name="packageAmount" placeholder="Количество упаковки"/>,
              },
            ],
            modalWidth: 1200,
            currentItem: {cargoDetails:[{weight:'', capacity:'', packageTypeId:'', packageAmount:''}]},
            isModalOpen: false,
            isBtnDisabled: false,
            modalType: 'create',
            createTitle: 'Создать груз',
            editTitle: 'Редактировать груза'
          }
        })
      // }
    },
    * getAdditionals({payload}, {call, put, select}) {
      let manager = yield call(getManagers);
      let client = yield call(getClientList);
      let status = yield call(getListItems, 6);
      let country = yield call(getListItems, 2);
      let packageType = yield call(getListItems, 7);

      if (manager.success && client.success) {
        yield put({
          type: 'updateState',
          payload: {
            managerList: manager.list,
            clientList: client.list,
            orderStatusList: status.list,
            countryList: country.list,
            packageTypeList: packageType.list
          }
        })
      }
    },
    * save({payload}, {call, put, select}) {
      // data.map(item => {return item.id})
      const result = yield call(saveOrder, payload);
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
    * deleteById({payload}, {call, put, select}) {
      const result = yield call(deleteOrderById, payload.id);
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
    * uploadAttachment({payload}, {call, put, select}) {
      const {senderAttachments, receiverAttachments, customFromAttachments, customToAttachments} = yield select(_ => _.orderDetail);
      yield put({type: 'updateState', payload: {isLoading: payload.owner}})
      const result = yield call(uploadFile, payload);
      if (result.success) {
        switch (payload.owner) {
          case 'sender':
            yield put({type: 'updateState', payload: {senderAttachments: [...senderAttachments, {...result}]}})
            break;
          case 'receiver':
            yield put({type: 'updateState', payload: {receiverAttachments: [...receiverAttachments, {...result}]}})
            break;
          case 'customFrom':
            yield put({type: 'updateState', payload: {customFromAttachments: [...customFromAttachments, {...result}]}})
            break;
          case 'customTo':
            yield put({type: 'updateState', payload: {customToAttachments: [...customToAttachments, {...result}]}})
            break;
          default:
        }
      } else {
        // notification
      }
      yield put({
        type: 'updateState',
        payload: {
          isLoading: ''
        }
      })
    },
    * deleteAttachment({payload}, {call, put, select}) {
      const {senderAttachments, receiverAttachments, customFromAttachments, customToAttachments} = yield select(_ => _.orderDetail);
      const result = yield call(deleteFile, payload.id);
      if (result.success) {
        switch (payload.owner) {
          case 'sender':
            yield put({type: 'updateState', payload: {senderAttachments: senderAttachments.filter(item => item.id !== payload.id)}})
            break;
          case 'receiver':
            yield put({type: 'updateState', payload: {receiverAttachments: receiverAttachments.filter(item => item.id !== payload.id)}})
            break;
          case 'customFrom':
            yield put({type: 'updateState', payload: {customFromAttachments: customFromAttachments.filter(item => item.id !== payload.id)}})
            break;
          case 'customTo':
            yield put({type: 'updateState', payload: {customToAttachments: customToAttachments.filter(item => item.id !== payload.id)}})
            break;
          default:
        }
      } else {
        // notification
      }
    },
    * backToOrders({payload}, {call, put, select}) {
      yield put(routerRedux.push('/order'));
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
