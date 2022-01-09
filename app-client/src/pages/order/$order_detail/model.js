import {
  getOrderDetailById,
  saveCargo,
  getCargoListByOrderId,
  getCargoById,
  deleteCargoById,
  getClientList,
  getManagers,
  getListItems,
  uploadFile,
  deleteFile,
  getShippingListByOrderId,
  getSelectOrders,
  saveShipping,
  getShippingById,
  deleteShippingById,
  getCarrierList,
  addAttachmentToDocument,
  deleteAttachmentFromDocumentById,
  getCargoDocumentByOrderId,
  deleteDocumentFromCargo,
  cloneCargo,
  getSelectOrderCargos,
  addCargoDocument,
  getCargoDocument,
  addCargoExpense,
  getCargoExpenseByOrderId,
  getExpenseById,
  deleteExpenseFromCargoById,
  saveInvoice, getExpenseForInvoiceById
} from '@/services/service'
import modelExtend from 'dva-model-extend'
import {Image, notification} from 'antd'
import moment from "moment";
import React from "react";
import {routerRedux} from "dva/router";
import {tableModel} from "@/utils/model";

export default modelExtend(tableModel, {
  namespace: 'orderDetail',
  state: {
    model: '',
    orderId: '',
    isModalOpen: false,
    itemList: [],
    shippingExpenseList: [],
    selectOrderList: [],
    cargoSelectList: [],
    currentModel: null,
    modalWidth: 100,
    managerList: [],
    clientList: [],
    carrierList: [],
    orderStatusList: [],
    countryList: [],
    cargoDetails: [],
    currencyList: [],
    cargoRegTypeList: [],
    shipTypeList: [],
    packageTypeList: [],
    documentAttachments: [],
    transportKindList: [],
    transportConditionList: [],
    isBtnDisabled: false,
    isAddInvoiceModalOpen: false,
    isLoading: false,
    isPlanning: false,
    visibleColumns : [],
    visibleExpenseColumns : []
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
            type: 'getAdditionals',
            payload:{id: location.pathname.split('/')[3]}
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
                title: 'Рисунки',
                dataIndex: 'docImage',
                key: 'docImage',
                render: (text, record) => {
                  let data = [];
                  record.documentList && record.documentList.forEach(doc => {
                    doc.attachments && doc.attachments.forEach(img => {
                      if (img.docType !== null && img.docType === "Rasm") {
                        data.push(
                          <div key={img.id} style={{textAlign: "center"}}>
                            <Image width={60} src={img.url + '?original=false'} preview={{src: img.url}}/>
                          </div>)
                      }
                    })
                  })
                  return data;
                }
              },
              {
                title: 'Файлы',
                dataIndex: 'docFile',
                key: 'docFile',
                render: (text, record) => {
                  let data = [];
                  record.documentList && record.documentList.forEach(doc => {
                    doc.attachments && doc.attachments.forEach(file => {
                      if (file.docType === null || file.docType !== "Rasm") {
                        data.push(
                          <div key={file.id}>
                            <a href={file.url} target="_blank" rel="noreferrer">{doc.title + (file.docType !== null ? ' - ' + file.docType : '')}</a><br/>
                          </div>)
                      }
                    })
                  })
                  return data;
                }
              },
              {
                title: 'Рейсы',
                dataIndex: 'shippingNum',
                key: 'shippingNum',
              },
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
      let cargoRegType = yield call(getListItems, 9);
      let cargos = yield call(getSelectOrderCargos, payload.id);
      let trKindList = yield call(getListItems, 10);
      let trCondList = yield call(getListItems, 11);

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
            packageTypeList: packageType.list,
            cargoSelectList: cargos.list,
            cargoRegTypeList: cargoRegType.list,
            transportKindList: trKindList.list,
            transportConditionList: trCondList.list,
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
    * cloneCargo({payload}, {call, put, select}) {
      const {orderId} = yield select(_ => _.orderDetail);
      const result = yield call(cloneCargo, payload);
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
        result.unloadDate = moment(result.unloadDate, 'DD.MM.YYYY HH:mm:ss');
        if (result.docDate !== null)
          result.docDate = moment(result.docDate, 'DD.MM.YYYY HH:mm:ss');
        yield put({
          type: 'updateState',
          payload: {
            currentItem: result,
            documentAttachments: result.docAttachments !== null ? result.docAttachments : [],
            isModalOpen: true,
            // modalType: 'update'
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
    * getCargoSelect({payload}, {call, put, select}) {
      let orders = yield call(getSelectOrders);
      if (orders.success) {
        yield put({
          type: 'updateState',
          payload: {
            selectOrderList: orders.object,
            isModalOpen: true,
            modalType: 'create',
            currentItem: null
          }
        })
      } else {
        notification.error({
          description: 'Get cargo select error',
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
          payload:  {
            model: 'Shipping',
            itemList: data.list,
            currentItem: {num: '', managerId: '', price: '', rate: 1, final: 0},
            isModalOpen: false,
            isBtnDisabled: false,
            isPlanning: false,
            selectOrderList: orders.object,
            modalType: 'create',
            modalWidth: 800,
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
                title: 'Место загрузки',
                dataIndex: 'loadStation',
                key: 'loadStation'
              },
              {
                title: 'Место разгрузки',
                dataIndex: 'unloadStation',
                key: 'unloadStation'
              },
              {
                title: 'Дата загрузки',
                dataIndex: 'loadDate',
                key: 'loadDate',
              },
              {
                title: 'Дата разгрузки',
                dataIndex: 'unloadDate',
                key: 'unloadDate',
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
                render: (text, record) => {return record.finalPrice !== null ? record.finalPrice + ' USD (' + record.price + ' ' + record.currencyName + ')' : ''}
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
              }
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
        result.loadDate = result.loadDate !== null ? moment(result.loadDate, 'DD.MM.YYYY HH:mm') : '';//zone("+05:00")
        result.loadSendDate = result.loadSendDate !== null ? moment(result.loadSendDate, 'DD.MM.YYYY HH:mm') : '';
        result.customArrivalDate = result.customArrivalDate !== null ? moment(result.customArrivalDate, 'DD.MM.YYYY HH:mm') : '';
        result.customSendDate = result.customSendDate !== null ? moment(result.customSendDate, 'DD.MM.YYYY HH:mm') : '';
        result.unloadArrivalDate = result.unloadArrivalDate !== null ? moment(result.unloadArrivalDate, 'DD.MM.YYYY HH:mm') : '';
        result.unloadDate = result.unloadDate !== null ? moment(result.unloadDate, 'DD.MM.YYYY HH:mm') : '';

        yield put({
          type: 'updateState',
          payload: {
            currentItem: result,
            isModalOpen: true,
            modalType: 'update',
            selectOrderList: result.orderSelect
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
    * queryDocument({payload}, {call, put, select}) {
      const {orderId} = yield select(_ => _.orderDetail);
      let data = yield call(getCargoDocumentByOrderId, orderId);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Document',
            itemList: data.list,
            currentItem: null,
            isModalOpen: false,
            isBtnDisabled: false,
            modalType: 'create',
            modalWidth: 600,
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
                render: (text, record) => text && text.substring(0, text.indexOf(' '))
              },
              {
                title: 'Комментарии',
                dataIndex: 'comment',
                key: 'comment',
              },
              {
                title: 'Груз',
                dataIndex: 'cargo',
                key: 'cargo',
                render: (text, record) => record.ownerNum + ' - ' + record.ownerName
              }
            ]
          }
        })
      }
    },
    * getDocumentById({payload}, {call, put, select}) {
      const result = yield call(getCargoDocument, payload.id);
      if (result.success) {
        result.date = moment(result.date, 'DD.MM.YYYY HH:mm:ss');//zone("+05:00")
        yield put({
          type: 'updateState',
          payload: {
            currentItem: result,
            documentAttachments: result.attachments,
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
    * saveDocument({payload}, {call, put, select}) {
      const result = yield call(addCargoDocument, payload);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            itemList: result.list,
            currentItem: null,
            isModalOpen: false,
            isBtnDisabled: false
          }
        })
        notification.info({
          description: 'Документ сохранен успешно',
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
    * deleteDocumentById({payload}, {call, put, select}) {
      const result = yield call(deleteDocumentFromCargo, payload);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload:{itemList: result.list}
        })
        notification.info({
          description: 'Документ удалено успешно',
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
      const {documentAttachments} = yield select(_ => _.orderDetail);
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
    * uploadDocumentAttachment({payload}, {call, put, select}) {
      const {documentAttachments} = yield select(_ => _.orderDetail);
      const result = yield call(addAttachmentToDocument, payload);
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
      const {documentAttachments} = yield select(_ => _.orderDetail);
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
      const {documentAttachments} = yield select(_ => _.orderDetail);
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
    * pushToPage({payload}, {call, put, select}) {
      yield put(routerRedux.push(payload.key));
    },
    * queryExpense({payload}, {call, put, select}) {
      let data = yield call(getCargoExpenseByOrderId, payload.id);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload:  {
            model: 'Expense',
            itemList: data.cargoExpenseList,
            shippingExpenseList: data.shippingExpenseList,
            currentItem: null,
            isModalOpen: false,
            isBtnDisabled: false,
            isAddInvoiceModalOpen: false,
            modalType: 'create',
            modalWidth: 700,
            createTitle: 'Создать расход',
            editTitle: 'Редактировать расхода',
            visibleColumns : [
              {
                title: '№',
                dataIndex: 'nomer',
                key: 'nomer',
                align: 'center',
                render: (value, item, index) => index+1
              },
              {
                title: 'Название',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: 'Номер груза',
                dataIndex: 'ownerNum',
                key: 'ownerNum',
              },
              {
                title: 'Перевозчик',
                dataIndex: 'carrierName',
                key: 'carrierName',
              },
              {
                title: 'Груз',
                dataIndex: 'ownerName',
                key: 'ownerName'
              },
              {
                title: 'Ставка',
                dataIndex: 'from',
                key: 'from',
                render: (text, record) => {return record.fromFinalPrice !== null ? record.fromFinalPrice + ' USD (' + record.fromPrice + ' ' + record.fromCurrencyName + ')' : ''}
              },
              {
                title: 'Расход',
                dataIndex: 'to',
                key: 'to',
                render: (text, record) => {return record.toFinalPrice !== null ? record.toFinalPrice + ' USD (' + record.toPrice + ' ' + record.toCurrencyName + ')' : ''}
              },
              {
                title: 'Комментарии',
                dataIndex: 'comment',
                key: 'comment',
              }
            ],
            visibleExpenseColumns : [
              {
                title: '№',
                dataIndex: 'nomer',
                key: 'nomer',
                align: 'center',
                render: (value, item, index) => index+1
              },
              {
                title: 'Название',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: 'Номер груза',
                dataIndex: 'ownerNum',
                key: 'ownerNum',
              },
              {
                title: 'Номер Рейса',
                dataIndex: 'oldNum',
                key: 'oldNum',
              },
              {
                title: 'Перевозчик',
                dataIndex: 'carrierName',
                key: 'carrierName'
              },
              {
                title: 'Ставка',
                dataIndex: 'from',
                key: 'from',
                render: (text, record) => {return record.fromFinalPrice !== null ? record.fromFinalPrice.toFixed(2) + ' USD (' + record.fromPrice + ' ' + record.fromCurrencyName + ')' : ''}
              },
              {
                title: 'Расход',
                dataIndex: 'to',
                key: 'to',
                render: (text, record) => {return record.toFinalPrice !== null ? record.toFinalPrice.toFixed(2) + ' USD (' + record.toPrice + ' ' + record.toCurrencyName + ')' : ''}
              },
              {
                title: 'Комментарии',
                dataIndex: 'comment',
                key: 'comment',
              }
            ]
          }
        })
      }
    },
    * saveExpense({payload}, {call, put, select}) {
      const result = yield call(addCargoExpense, payload);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            itemList: result.cargoExpenseList,
            shippingExpenseList: result.shippingExpenseList,
            currentItem: null,
            isModalOpen: false,
            isBtnDisabled: false
          }
        })
        notification.info({
          description: 'Сохранен успешно',
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
    * getExpenseById({payload}, {call, put, select}) {
      const result = yield call(getExpenseById, payload.id);
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
    * deleteExpenseById({payload}, {call, put, select}) {
      const result = yield call(deleteExpenseFromCargoById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryExpense',
          payload:{id: payload.orderId}
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
    * saveInvoice({payload}, {call, put, select}) {
      const result = yield call(saveInvoice, payload);
      if (result.success) {
        yield put({
          type: 'queryExpense',
          payload:{id: payload.orderId}
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
    * getExpenseForInvoiceById({payload}, {call, put, select}) {
      const result = yield call(getExpenseForInvoiceById, payload.id);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: result,
            isAddInvoiceModalOpen: true,
            modalType: payload.modalType,
            createTitle: 'Добавить выписанный счёт',
            editTitle: 'Добавить полученный счёт'
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


  },
})
