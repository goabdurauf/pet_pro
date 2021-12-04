import {
  deleteAttachmentFromDocumentById,
  deleteCargoById, deleteFile,
  getCargoById,
  getCargoList,
  getListItems,
  saveCargo, uploadFile, setCargoStatus
} from '@/services/service'
import {Link} from "umi";
import {notification} from "antd";
import moment from "moment";
import {routerRedux} from "dva/router";
import React from "react";

export default ({
  namespace: 'cargo',
  state: {
    itemList: [],
    currentItem: null,
    currentModal: 'Cargo',
    isModalOpen: false,
    isBtnDisabled: false,
    isLoading: false,
    selectedStatusId: null,
    pagination: {
      current: 1,
      pageSize: 10,
      position: ["bottomCenter"]
    },
    isTableLoading: false,
    documentAttachments: [],
    countryList: [],
    selectedRowKeys: [],
    packageTypeList: [],
    cargoStatusList: [],
    visibleColumns : [
      {
        title: 'Номер заказа',
        dataIndex: 'orderNum',
        key: 'orderNum',
        render: (text, record) => <Link to={'/order/detail/' + record.orderId}>{text}</Link>
      },
      {
        title: 'Номер груза',
        dataIndex: 'num',
        key: 'num'
      },
      {
        title: 'Клиент',
        dataIndex: 'clientName',
        key: 'clientName',
      },
      {
        title: 'Дата погрузки',
        dataIndex: 'loadDate',
        key: 'loadDate',
        render: (text, record) => text && text.substring(0, text.indexOf(' '))
      },
      {
        title: 'Дата разгрузки',
        dataIndex: 'unloadDate',
        key: 'unloadDate',
        render: (text, record) => text && text.substring(0, text.indexOf(' '))
      },
      {
        title: 'Погрузка',
        dataIndex: 'senderCountryName',
        key: 'senderCountryName',
      },
      {
        title: 'Разгрузка',
        dataIndex: 'receiverCountryName',
        key: 'receiverCountryName',
      },
      {
        title: 'Статус груза',
        dataIndex: 'statusName',
        key: 'statusName',
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
        title: 'Перевозчик',
        dataIndex: 'carrierName',
        key: 'carrierName',
      },
      {
        title: 'Рейс',
        dataIndex: 'shippingNum',
        key: 'shippingNum',
      },
      {
        title: 'Документы',
        dataIndex: 'docs',
        key: 'docs',
        render: (text, record) => {
          let data = [];
          record.documentList && record.documentList.forEach(doc => {
            let title = doc.title + ' (' + doc.date.substring(0, doc.date.indexOf(' ')) + ')';
            if (doc.attachments !== null && doc.attachments.length > 0) {
              doc.attachments.forEach(att => {
                data.push(<div key={att.id}><a href={att.url} target="_blank" rel="noreferrer">{title  + (att.docType !== null ? ' - ' + att.docType : '')}</a><br/></div>)
              })
            } else
              data.push(<div key={doc.id}>{title}<br/></div>)
          })
          return data;
        }
      }
    ]
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/order/cargo') {
          dispatch({
            type: 'queryCargo',
          });
          dispatch({
            type: 'getAdditionals',
          });
        }
      });
    },
  },
  effects: {
    * queryCargo({payload}, {call, put, select}) {
      if (payload === undefined){
        payload = {page:0, size:50}
      }
      let data = yield call(getCargoList, payload);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            itemList: data.list,
            isBtnDisabled: false,
            isModalOpen: false,
            selectedRowKeys: []
          }
        })
      }
    },
    * getAdditionals({payload}, {call, put, select}) {
      let country = yield call(getListItems, 2);
      let packageType = yield call(getListItems, 7);
      let cargoStatus = yield call(getListItems, 8);

      if (country.success && packageType.success) {
        yield put({
          type: 'updateState',
          payload: {
            countryList: country.list,
            packageTypeList: packageType.list,
            cargoStatusList: cargoStatus.list
          }
        })
      }
    },
    * saveCargo({payload}, {call, put, select}) {
      const result = yield call(saveCargo, payload);
      if (result.success) {
        yield put({
          type: 'queryCargo'
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
          payload: {isBtnDisabled: false}
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
        if (result.docDate !== null)
          result.docDate = moment(result.docDate, 'DD.MM.YYYY HH:mm:ss');
        yield put({
          type: 'updateState',
          payload: {
            currentItem: result,
            documentAttachments: result.docAttachments !== null ? result.docAttachments : [],
            isModalOpen: true,
            currentModal: 'Cargo'
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
      const result = yield call(deleteCargoById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryCargo'
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
      const {documentAttachments} = yield select(_ => _.cargo);
      const result = yield call(uploadFile, payload);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            isLoading: false,
            documentAttachments: [...documentAttachments, {...result}]
          }
        })
      } else {
        // notification
      }
    },
    * deleteAttachment({payload}, {call, put, select}) {
      const {documentAttachments} = yield select(_ => _.cargo);
      const result = yield call(deleteFile, payload.id);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            documentAttachments: documentAttachments.filter(item => item.id !== payload.id)
          }
        })
      } else {
        // notification
      }
    },
    * deleteDocumentAttachment({payload}, {call, put, select}) {
      const {documentAttachments} = yield select(_ => _.cargo);
      const result = yield call(deleteAttachmentFromDocumentById, payload);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            documentAttachments: documentAttachments.filter(item => item.id !== payload.id)
          }
        })
      } else {
        // notification
      }
    },
    * changeCargoStatus({payload}, {call, put, select}) {
      const result = yield call(setCargoStatus, payload);
      if (result.success) {
        yield put({
          type: 'queryCargo'
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
