import {
  uploadFile,
  deleteFile,
  getDocumentById,
  getShippingDetailById,
  deleteCargoFromShippingById,
  deleteDocumentFromShippingById,
  addShippingDocument,
  deleteAttachmentFromDocumentById,
  addAttachmentToDocument,
  getShippingExpenses, addShippingExpense, getExpenseById, deleteExpenseFromShippingById, getCarrierList, getListItems
} from '@/services/service'
import modelExtend from 'dva-model-extend'
import {tableModel} from 'utils/model'
import {Image, notification} from 'antd'
import moment from "moment";
import React from "react";
import {routerRedux} from "dva/router";

export default modelExtend(tableModel, {
  namespace: 'shippingDetail',
  state: {
    model: '',
    shippingId: '',
    isModalOpen: false,
    cargoList: [],
    currentModel: null,
    modalWidth: 500,
    cargoDetails: [],
    documentList: [],
    documentAttachments: [],
    carrierList: [],
    currencyList: [],
    expenseList: [],
    isBtnDisabled: false,
    loadingFile: false,
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
      let carrier = yield call(getCarrierList);
      let currency = yield call(getListItems, 4);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Cargo',
            shippingId: payload.id,
            currentModel: result,
            cargoList: result.cargoList,
            documentList: result.documents,
            carrierList: carrier.list,
            currencyList: currency.list,
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
          modalWidth: 500,
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
              title: 'Рисунки',
              dataIndex: 'docImage',
              key: 'docImage',
              render: (text, record) => {
                let data = [];
                  record.attachments && record.attachments.forEach(img => {
                    if (img.docType !== null && img.docType === "Rasm") {
                      data.push(
                        <div key={img.id} style={{textAlign: "center"}}>
                          <Image width={60} src={img.url + '?original=false'} preview={{src: img.url}}/>
                        </div>)
                    }
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
                  record.attachments && record.attachments.forEach(file => {
                    if (file.docType === null || file.docType !== "Rasm") {
                      data.push(
                        <div key={file.id}>
                          <a href={file.url} target="_blank" rel="noreferrer">{record.title + (file.docType !== null ? ' - ' + file.docType : '')}</a><br/>
                        </div>)
                    }
                  })
                return data;
              }
            }
          ]
        }
      })
    },
    * saveDocument({payload}, {call, put, select}) {
      const result = yield call(addShippingDocument, payload);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            documentList: result.list,
            currentItem: null,
            isModalOpen: false,
            isBtnDisabled: false
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
    * getDocumentById({payload}, {call, put, select}) {
      const result = yield call(getDocumentById, payload.id);
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
    * deleteDocumentById({payload}, {call, put, select}) {
      const result = yield call(deleteDocumentFromShippingById, payload);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload:{documentList: result.list}
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
    * uploadDocumentAttachment({payload}, {call, put, select}) {
      const {documentAttachments} = yield select(_ => _.shippingDetail);
      const result = yield call(addAttachmentToDocument, payload);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            loadingFile: false,
            documentAttachments: [...documentAttachments, {...result}]
          }
        })
      } else {
        // notification
      }
    },
    * uploadAttachment({payload}, {call, put, select}) {
      const {documentAttachments} = yield select(_ => _.shippingDetail);
      const result = yield call(uploadFile, payload);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            loadingFile: false,
            documentAttachments: [...documentAttachments, {...result}]
          }
        })
      } else {
        // notification
      }
    },
    * deleteDocumentAttachment({payload}, {call, put, select}) {
      const {documentAttachments} = yield select(_ => _.shippingDetail);
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
    * deleteAttachment({payload}, {call, put, select}) {
      const {documentAttachments} = yield select(_ => _.shippingDetail);
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
    * pushToPage({payload}, {call, put, select}) {
      yield put(routerRedux.push(payload.key));
    },
    * queryExpense({payload}, {call, put, select}) {
      let data = yield call(getShippingExpenses, payload.id);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload:  {
            model: 'Expense',
            expenseList: data.list,
            currentItem: null,
            isModalOpen: false,
            isBtnDisabled: false,
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
            ]
          }
        })
      }
    },
    * saveExpense({payload}, {call, put, select}) {
      const result = yield call(addShippingExpense, payload);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            expenseList: result.list,
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
      const result = yield call(deleteExpenseFromShippingById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryExpense',
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

  }
})
