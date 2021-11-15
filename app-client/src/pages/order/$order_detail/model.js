import {getOrderDetailById, saveCargo, getCargoListByOrderId, getCargoById, deleteCargoById, getClientList, getManagers, getListItems, uploadFile, deleteFile,
  getShippingListByOrderId, getSelectOrders, saveShipping, getShippingById, deleteShippingById, getCarrierList
} from '@/services/service'
import {Input, Select, Form, notification} from 'antd'
import moment from "moment";
import React from "react";
import {routerRedux} from "dva/router";
import {Link} from "umi";

export default ({
  namespace: 'orderDetail',
  state: {
    model: '',
    orderId: '',
    isModalOpen: false,
    itemList: [],
    cargoList: [],
    currentModel: null,
    currentItem: null,
    modalType: 'create',
    modalWidth: 100,
    managerList: [],
    clientList: [],
    carrierList: [],
    orderStatusList: [],
    countryList: [],
    cargoDetails: [],
    currencyList: [],
    shipTypeList: [],
    packageTypeList: [],
    senderAttachments: [],
    receiverAttachments: [],
    customFromAttachments: [],
    customToAttachments: [],
    isBtnDisabled: false,
    visibleColumns : []
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
            type: 'queryCargo',
            payload:{id: location.pathname.split('/')[3]}
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
      let order = yield call(getOrderDetailById, payload.id);
      yield put({
        type: 'updateState',
        payload: {
          orderId: payload.id,
          currentModel: order
        }
      })
    },
    * queryCargo({payload}, {call, put, select}) {
      let data = yield call(getCargoListByOrderId, payload.id);
      // let packageType = yield call(getListItems, 7);

      // if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Cargo',
            itemList: data.list,
            cargoList: data.list,
            /*
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
            */
            modalWidth: 1200,
            currentItem: {cargoDetails:[{weight:'', capacity:'', packageTypeId:'', packageAmount:''}]},
            isModalOpen: false,
            isBtnDisabled: false,
            modalType: 'create',
            createTitle: 'Создать груз',
            editTitle: 'Редактировать груза',
            visibleColumns : [
              {
                title: 'Номер груза',
                dataIndex: 'num',
                key: 'num'
              },
              {
                title: 'Название груза',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: 'Параметры груза',
                dataIndex: 'cargoDetails',
                key: 'cargoDetails',
                render: (text, record) => {
                  if (record.cargoDetails && record.cargoDetails.length > 0) {
                    return 'Вес: ' + record.cargoDetails[0].weight;
                  } else
                    return '';
                }
              },
              {
                title: 'Погрузка',
                dataIndex: 'senderCountryName',
                key: 'senderCountryName',
              },
              {
                title: 'Дата погрузки',
                dataIndex: 'loadDate',
                key: 'loadDate',
                render: (text, record) => text.substring(0, text.indexOf(' '))
              },
              {
                title: 'Разгрузка',
                dataIndex: 'receiverCountryName',
                key: 'receiverCountryName',
              },
              {
                title: 'Дата разгрузки',
                dataIndex: 'unloadDate',
                key: 'unloadDate',
                render: (text, record) => text.substring(0, text.indexOf(' '))
              },
              {
                title: 'Рейсы',
                dataIndex: 'shippingNum',
                key: 'shippingNum',
              }
            ]
          }
        })
      // }
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
      const {orderId} = yield select(_ => _.orderDetail);
      const result = yield call(saveCargo, payload);
      if (result.success) {
        yield put({
          type: 'queryCargo',
          payload:{id: orderId}
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
    * deleteCargoById({payload}, {call, put, select}) {
      const {orderId} = yield select(_ => _.orderDetail);
      const result = yield call(deleteCargoById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryCargo',
          payload:{id: orderId}
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
    * queryShipping({payload}, {call, put, select}) {
      let data = yield call(getShippingListByOrderId, payload.id);
      let orders = yield call(getSelectOrders);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Shipping',
            itemList: data.list,
            currentItem: {num: '', managerId: '', price: '', rate: 1, final: 0},
            isModalOpen: false,
            isBtnDisabled: false,
            selectOrderList: orders.object,
            modalType: 'create',
            modalWidth: 700,
            createTitle: 'Создать рейс',
            editTitle: 'Редактировать рейса',
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
              },
              {
                title: 'Номер заказа',
                dataIndex: 'orderNum',
                key: 'orderNum',
                render: (text, record) => {
                  let data = [];
                  record.orderList && record.orderList.forEach(order => {
                    data.push(<div key={order.id}>{order.num} {order.date.substring(0, order.date.indexOf(' '))}</div>)
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
          }
        })
      }
    },
    * saveShipping({payload}, {call, put, select}) {
      const {orderId} = yield select(_ => _.orderDetail);
      const result = yield call(saveShipping, payload);
      if (result.success) {
        yield put({
          type: 'queryShipping',
          payload:{id: orderId}
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
      const {orderId} = yield select(_ => _.orderDetail);
      const result = yield call(deleteShippingById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryShipping',
          payload:{id: orderId}
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
      const result = yield call(uploadFile, payload);
      console.log(result)
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
