import {uploadFile, deleteFile, getShippingById, getShippingDetailById, deleteShippingById, deleteCargoFromShippingById,
  addShippingDocument} from '@/services/service'
import {Input, Select, Form, notification} from 'antd'
import moment from "moment";
import React from "react";
import {routerRedux} from "dva/router";
import {Link} from "umi";

export default ({
  namespace: 'shippingDetail',
  state: {
    model: '',
    shippingId: '',
    isModalOpen: false,
    cargoList: [],
    currentModel: null,
    currentItem: null,
    modalType: 'create',
    modalWidth: 100,
    clientList: [],
    cargoDetails: [],
    shippingAttachments: [],
    isBtnDisabled: false,
    visibleColumns : []
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname.startsWith('/order/shipping/detail')) {
          dispatch({
            type: 'getDetail',
            payload:{id: location.pathname.split('/')[4]}
          });
        }
      });
    },
  },
  effects: {
    * getDetail({payload}, {call, put, select}) {
      const result = yield call(getShippingDetailById, payload.id);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Cargo',
            shippingId: payload.id,
            currentModel: result,
            cargoList: result.cargoList,
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
                  let data = [];
                  record.cargoDetails && record.cargoDetails.forEach(detail => {
                    data.push(<div key={detail.id}>Вес: {detail.weight}; Объём: {detail.capacity}; Кол-во уп.: {detail.packageAmount}</div>)
                  })
                  return data;
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
                render: (text, record) => text && text.substring(0, text.indexOf(' '))
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
                render: (text, record) => text && text.substring(0, text.indexOf(' '))
              },
              {
                title: 'Рейсы',
                dataIndex: 'shippingNum',
                key: 'shippingNum',
              }
            ]
          }
        })
      }
    },
    * queryCargo({payload}, {call, put, select}) {
      yield put({
        type: 'updateState',
        payload: {
          model: 'Cargo',
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
                let data = [];
                record.cargoDetails && record.cargoDetails.forEach(detail => {
                  data.push(<div key={detail.id}>Вес: {detail.weight}; Объём: {detail.capacity}; Кол-во уп.: {detail.packageAmount}</div>)
                })
                return data;
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
              render: (text, record) => text && text.substring(0, text.indexOf(' '))
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
              render: (text, record) => text && text.substring(0, text.indexOf(' '))
            },
            {
              title: 'Рейсы',
              dataIndex: 'shippingNum',
              key: 'shippingNum',
            }
          ]
        }
      })
    },
    * deleteCargoById({payload}, {call, put, select}) {
      const result = yield call(deleteCargoFromShippingById, payload);
      if (result.success) {
        yield put({
          type: 'getDetail',
          payload:{id: payload.shippingId}
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
    * queryDocument({payload}, {call, put, select}) {
      yield put({
        type: 'updateState',
        payload: {
          model: 'Document',
          currentItem: null,
          isModalOpen: false,
          isBtnDisabled: false,
          modalType: 'create',
          modalWidth: 700,
          createTitle: 'Создать документ',
          editTitle: 'Редактировать документа',
          visibleColumns : [
            {
              title: '№',
              dataIndex: 'nomer',
              key: 'nomer',
              align: 'center',
              render: (value, item, index) => index+1
            },
            {
              title: 'Название документа',
              dataIndex: 'title',
              key: 'title',
            },
            {
              title: 'Дата создания',
              dataIndex: 'date',
              key: 'date',
            },
            {
              title: 'Комментарии',
              dataIndex: 'comment',
              key: 'comment',
            },
            {
              title: 'Файлы',
              dataIndex: 'attachment',
              key: 'attachment',
            }
          ]
        }
      })
    },
    * saveDocument({payload}, {call, put, select}) {
      const result = yield call(addShippingDocument, payload);
      console.log(result)
      if (result.success) {
        yield put({
          type: 'updateState',
          payload:{
            shippingAttachments: []
          }
        })
        notification.info({
          description: 'Документ добавлено успешно',
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
    * getDocumentById({payload}, {call, put, select}) {
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
    * deleteDocumentById({payload}, {call, put, select}) {
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
