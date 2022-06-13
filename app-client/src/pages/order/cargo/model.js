import {
  deleteAttachmentFromDocumentById,
  deleteCargoById,
  deleteFile,
  getCargoById,
  getCargoList,
  getListItems,
  saveCargo,
  uploadFile,
  setCargoStatus,
  getManagers,
  getCarrierList,
  getSelectOrders,
  saveShipping,
  searchProduct,
  getProductById, getClientList
} from '@/services/service'
import {Link} from "umi";
import {notification, Tag} from "antd";
import moment from "moment";
import {routerRedux} from "dva/router";
import React from "react";

export default ({
  namespace: 'cargo',
  state: {
    itemList: [],
    currentItem: null,
    currentModal: 'Cargo',
    modalType: 'update',
    isModalOpen: false,
    modalWidth: 1200,
    modalTitle: '',
    isBtnDisabled: false,
    isLoading: false,
    isPlanning: false,
    selectedStatusId: null,
    searchParams: {page:0, size:50},
    pagination: {
      current: 1,
      pageSize: 50,
      position: ["bottomCenter"]
    },
    isTableLoading: false,
    documentAttachments: [],
    countryList: [],
    currencyList: [],
    selectedRowKeys: [],
    packageTypeList: [],
    cargoStatusList: [],
    cargoRegTypeList: [],
    selectOrderList: [],
    carrierList: [],
    clientList: [],
    managerList: [],
    shipTypeList: [],
    transportKindList: [],
    transportConditionList: [],
    productList: [],
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
        render: (text, record) => (record.statusColor !== null ? <Tag color={record.statusColor} key={record.statusColor} style={{fontSize: '14px'}}>{text}</Tag> : '')
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
        render: (text, record) => <Link to={'/order/shipping/detail/' + record.shippingId}>{text}</Link>
      },
      {
        title: 'Финанс',
        children: [
          {
            title: 'Вы. счёт',
            dataIndex: 'invoiceIn',
            key: 'invoiceIn',
            render: (text, record) => {
              let data = [];
              if (record.price !== null && record.currencyName !== null)
                data.push(<div key={record.id} className={record.invoiceOutId === null ? 'transfered_false' : 'transfered_true'}>{record.price + ' ' + record.currencyName}</div>)
              if (record.expenseList && record.expenseList.length > 0) {
                record.expenseList.forEach(ex => {
                  if (ex.type === 'Cargo') {
                    data.push(<div key={ex.id + 'o'} className={ex.invoiceOutId === null ? 'transfered_false' : 'transfered_true'}>{ex.toPrice + ' ' + ex.toCurrencyName}</div>)
                  } else
                    data.push(<div key={ex.id} className={ex.invoiceOutId === null ? 'transfered_false' : 'transfered_true'}>{ex.toPrice + ' ' + ex.toCurrencyName}</div>)
                });
              }
              return data;
            }
          },
          {
            title: 'Пол. счёт',
            dataIndex: 'invoiceOut',
            key: 'invoiceOut',
            render: (text, record) => {
              let data = [];
              if (record.expenseList && record.expenseList.length > 0) {
                record.expenseList.forEach(ex => {
                  if (ex.type === 'Cargo')
                    data.push(<div key={ex.id + 'i'} className={ex.invoiceInId === null ? 'transfered_false' : 'transfered_true'}>{ex.fromPrice + ' ' + ex.fromCurrencyName}</div>)
                });
              }
              return data;
            }
          }
        ]
      },
      {
        title: 'Документы',
        dataIndex: 'docs',
        key: 'docs',
        render: (text, record) => {
          let data = [];
          record.documentList && record.documentList.forEach(doc => {
            let title = doc.title !== null && doc.date !== null ? (doc.title + ' (' + doc.date.substring(0, doc.date.indexOf(' ')) + ')') : '';
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
      const {searchParams, pagination} = yield select(_ => _.cargo);
      let data = yield call(getCargoList, searchParams);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            itemList: data.object,
            pagination: {...pagination, total: data.totalElements},
            isBtnDisabled: false,
            isModalOpen: false,
            isPlanning: false,
            modalWidth: 1200,
            modalTitle: 'Редактировать груза',
            currentModal: 'Cargo',
            selectedRowKeys: []
          }
        })
      }
    },
    * getAdditionals({payload}, {call, put, select}) {
      let country = yield call(getListItems, 2);
      let currency = yield call(getListItems, 4);
      let packageType = yield call(getListItems, 7);
      let cargoStatus = yield call(getListItems, 8);
      let cargoRegType = yield call(getListItems, 9);
      let manager = yield call(getManagers);
      let carrier = yield call(getCarrierList);
      let shipType = yield call(getListItems, 5);
      let trKindList = yield call(getListItems, 10);
      let trCondList = yield call(getListItems, 11);
      let client = yield call(getClientList);

      if (country.success && packageType.success) {
        yield put({
          type: 'updateState',
          payload: {
            countryList: country.list,
            currencyList: currency.list,
            packageTypeList: packageType.list,
            cargoStatusList: cargoStatus.list,
            cargoRegTypeList: cargoRegType.list,
            managerList: manager.list,
            carrierList: carrier.list,
            clientList: client.list,
            shipTypeList: shipType.list,
            transportKindList: trKindList.list,
            transportConditionList: trCondList.list,
          }
        })
      }
    },
    * searchCargo({payload}, {call, put, select}) {
      const {pagination} = yield select(_ => _.cargo);
      let data = yield call(getCargoList, payload);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            itemList: data.object,
            searchParams: {...payload},
            pagination: {...pagination, current: payload.page + 1, total: data.totalElements}
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
        let productList = [];
        result.loadDate = moment(result.loadDate, 'DD.MM.YYYY HH:mm:ss');//zone("+05:00")
        result.unloadDate = moment(result.unloadDate, 'DD.MM.YYYY HH:mm:ss');//zone("+05:00")
        if (result.docDate !== null)
          result.docDate = moment(result.docDate, 'DD.MM.YYYY HH:mm:ss');
        if (result.productId !== null) {
          const product = yield call(getProductById, result.productId);
          if (product.success)
            productList.push(product)
        }
        yield put({
          type: 'updateState',
          payload: {
            currentItem: result,
            documentAttachments: result.docAttachments !== null ? result.docAttachments : [],
            isModalOpen: true,
            currentModal: 'Cargo',
            modalWidth: 1200,
            productList
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
    * searchProduct({payload}, {call, put, select}) {
      const result = yield call(searchProduct, payload.word);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload:{productList: result.list}
        })
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
    },
    * openShippingModal({payload}, {call, put, select}) {
      let orders = yield call(getSelectOrders);
      yield put({
        type: 'updateState',
        payload: {
          isModalOpen: true,
          currentItem: {rate:1, ...payload},
          currentModal: 'Shipping',
          modalTitle: 'Создать рейс',
          isBtnDisabled: false,
          modalWidth: 800,
          selectOrderList: orders.object
        }
      })
    },
    * saveShipping({payload}, {call, put, select}) {
      const result = yield call(saveShipping, payload);
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
