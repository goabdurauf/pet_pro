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
  deleteProductById,
  saveKassa,
  getKassaById,
  getKassaList,
  deleteKassaById,
  uploadFile, deleteFile, deleteAttachmentFromProductById
} from '@/services/service'
import {Image, notification, Tag} from 'antd'
import moment from "moment";
import React from "react";

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
    isBtnDisabled: false,
    isLoading: false,
    measureList: [],
    currencyList: [],
    visibleColumns: [],
    productAttachments: []
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
            isBtnDisabled: false,
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
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
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
            isBtnDisabled: false,
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
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
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
            isBtnDisabled: false,
            productAttachments: [],
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
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
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
            modalType: 'update',
            isLoading: false,
            productAttachments: result.attachments
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
    },
    * uploadAttachment({payload}, {call, put, select}) {
      const {productAttachments} = yield select(_ => _.catalog);
      const result = yield call(uploadFile, payload);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            isLoading: false,
            productAttachments: [...productAttachments, {...result}]
          }
        })
      } else {
        // notification
      }
    },
    * deleteAttachment({payload}, {call, put, select}) {
      const {productAttachments} = yield select(_ => _.catalog);
      const result = yield call(deleteFile, payload.id);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            productAttachments: productAttachments.filter(item => item.id !== payload.id)
          }
        })
      } else {
        // notification
      }
    },
    * deleteProductAttachment({payload}, {call, put, select}) {
      const {productAttachments} = yield select(_ => _.catalog);
      const result = yield call(deleteAttachmentFromProductById, payload);
      if (result.success) {
        yield put({
          type: 'updateState',
          payload: {
            productAttachments: productAttachments.filter(item => item.id !== payload.id)
          }
        })
      } else {
        // notification
      }
    },
    * queryAbout({payload}, {call, put, select}) {
      let data = yield call(getListItems, 3);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'About',
            title: 'Откуда узнал о нас',
            createTitle: 'Создать откуда узнал о нас',
            editTitle: 'Редактировать откуда узнал о нас',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
    * saveAbout({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 3});
      if (result.success) {
        yield put({
          type: 'queryAbout'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getAboutById({payload}, {call, put, select}) {
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
    * deleteAbout({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryAbout'
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
    * queryCurrency({payload}, {call, put, select}) {
      let data = yield call(getListItems, 4);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Currency',
            title: 'Валюта',
            createTitle: 'Создать валюту',
            editTitle: 'Редактировать валюту',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
    * saveCurrency({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 4});
      if (result.success) {
        yield put({
          type: 'queryCurrency'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getCurrencyById({payload}, {call, put, select}) {
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
    * deleteCurrency({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryCurrency'
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
    * queryShippingType({payload}, {call, put, select}) {
      let data = yield call(getListItems, 5);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'ShippingType',
            title: 'Тип транспорта',
            createTitle: 'Создать тип транспорта',
            editTitle: 'Редактировать тип транспорта',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
              },
              {
                title: 'Объём',
                dataIndex: 'num01',
                key: 'num01',
              },
              {
                title: 'Вес',
                dataIndex: 'num02',
                key: 'num02',
              },
              {
                title: 'Размер',
                dataIndex: 'val01',
                key: 'val01',
              }
            ]
          }
        })
      }
    },
    * saveShippingType({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 5});
      if (result.success) {
        yield put({
          type: 'queryShippingType'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getShippingTypeById({payload}, {call, put, select}) {
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
    * deleteShippingType({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryShippingType'
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
    * queryOrderStatus({payload}, {call, put, select}) {
      let data = yield call(getListItems, 6);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'OrderStatus',
            title: 'Статус заказа',
            createTitle: 'Создать статус заказа',
            editTitle: 'Редактировать статус заказа',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
                render: (text, record) => (
                  <Tag color={record.val01 !== null ? record.val01 : ''} key={record.val01} style={{fontSize: '14px'}}>
                    {text}
                  </Tag>
                )
              }
            ]
          }
        })
      }
    },
    * saveOrderStatus({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 6});
      if (result.success) {
        yield put({
          type: 'queryOrderStatus'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getOrderStatusById({payload}, {call, put, select}) {
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
    * deleteOrderStatus({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryOrderStatus'
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
    * queryPackageType({payload}, {call, put, select}) {
      let data = yield call(getListItems, 7);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'PackageType',
            title: 'Тип упаковки',
            createTitle: 'Создать тип упаковки',
            editTitle: 'Редактировать тип упаковки',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
    * savePackageType({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 7});
      if (result.success) {
        yield put({
          type: 'queryPackageType'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getPackageTypeById({payload}, {call, put, select}) {
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
    * deletePackageType({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryPackageType'
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
    * queryCargoStatus({payload}, {call, put, select}) {
      let data = yield call(getListItems, 8);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'CargoStatus',
            title: 'Статус груза',
            createTitle: 'Создать статус груза',
            editTitle: 'Редактировать статус груза',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
                render: (text, record) => (
                  <Tag color={record.val01 !== null ? record.val01 : ''} key={record.val01} style={{fontSize: '14px'}}>
                    {text}
                  </Tag>
                )
              }
            ]
          }
        })
      }
    },
    * saveCargoStatus({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 8});
      if (result.success) {
        yield put({
          type: 'queryCargoStatus'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getCargoStatusById({payload}, {call, put, select}) {
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
    * deleteCargoStatus({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryCargoStatus'
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
    * queryCargoRegType({payload}, {call, put, select}) {
      let data = yield call(getListItems, 9);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'CargoRegType',
            title: 'Тип оформление груза',
            createTitle: 'Создать тип оформление груза',
            editTitle: 'Редактировать тип оформление груза',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
    * saveCargoRegType({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 9});
      if (result.success) {
        yield put({
          type: 'queryCargoRegType'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getCargoRegTypeById({payload}, {call, put, select}) {
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
    * deleteCargoRegType({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryCargoRegType'
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
    * queryTransportKind({payload}, {call, put, select}) {
      let data = yield call(getListItems, 10);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'TransportKind',
            title: 'Вид транспорта',
            createTitle: 'Создать вид транспорта',
            editTitle: 'Редактировать вид транспорта',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
              },
              {
                title: 'Дата',
                dataIndex: 'date01',
                key: 'date01',
                render: (text, record) => text && text.substring(0, text.indexOf(' '))
              }
            ]
          }
        })
      }
    },
    * saveTransportKind({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 10});
      if (result.success) {
        yield put({
          type: 'queryTransportKind'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getTransportKindById({payload}, {call, put, select}) {
      const result = yield call(getListItemById, payload.id);
      if (result.success) {
        if (result.date01 !== null)
          result.date01 = moment(result.date01, 'DD.MM.YYYY');

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
    * deleteTransportKind({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryTransportKind'
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
    * queryTransportCondition({payload}, {call, put, select}) {
      let data = yield call(getListItems, 11);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'TransportCondition',
            title: 'Условие транспорта',
            createTitle: 'Создать условие транспорта',
            editTitle: 'Редактировать условие транспорта',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
              },
              {
                title: 'Дата',
                dataIndex: 'date01',
                key: 'date01',
                render: (text, record) => text && text.substring(0, text.indexOf(' '))
              }
            ]
          }
        })
      }
    },
    * saveTransportCondition({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 11});
      if (result.success) {
        yield put({
          type: 'queryTransportCondition'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getTransportConditionById({payload}, {call, put, select}) {
      const result = yield call(getListItemById, payload.id);
      if (result.success) {
        if (result.date01 !== null)
          result.date01 = moment(result.date01, 'DD.MM.YYYY');

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
    * deleteTransportCondition({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryTransportCondition'
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
    * queryKassa({payload}, {call, put, select}) {
      let data = yield call(getKassaList);
      let currency = yield call(getListItems, 4);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Kassa',
            title: 'Касса',
            createTitle: 'Создать касса',
            editTitle: 'Редактировать касса',
            isModalOpen: false,
            itemList: data.list,
            currencyList: currency.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: 'Валюта',
                dataIndex: 'currencyName',
                key: 'currencyName'
              }
            ]
          }
        })
      }
    },
    * saveKassa({payload}, {call, put, select}) {
      const result = yield call(saveKassa, payload);
      if (result.success) {
        yield put({
          type: 'queryKassa'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getKassaById({payload}, {call, put, select}) {
      const result = yield call(getKassaById, payload.id);
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
    * deleteKassa({payload}, {call, put, select}) {
      const result = yield call(deleteKassaById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryKassa'
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
    * queryOtherAgents({payload}, {call, put, select}) {
      let data = yield call(getListItems, 12);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'OtherAgents',
            title: 'Прочие контрагенты',
            createTitle: 'Создать прочие контрагенты',
            editTitle: 'Редактировать прочие контрагенты',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
    * saveOtherAgents({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 12});
      if (result.success) {
        yield put({
          type: 'queryOtherAgents'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getOtherAgentsById({payload}, {call, put, select}) {
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
    * deleteOtherAgents({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryOtherAgents'
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
    * queryOtherExpenses({payload}, {call, put, select}) {
      let data = yield call(getListItems, 13);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'OtherExpenses',
            title: 'Прочие расходы',
            createTitle: 'Создать прочие расходы',
            editTitle: 'Редактировать прочие расходы',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
    * saveOtherExpenses({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 13});
      if (result.success) {
        yield put({
          type: 'queryOtherExpenses'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getOtherExpensesById({payload}, {call, put, select}) {
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
    * deleteOtherExpenses({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryOtherExpenses'
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
    * queryExpenseName({payload}, {call, put, select}) {
      let data = yield call(getListItems, 14);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'ExpenseName',
            title: 'Название расхода',
            createTitle: 'Создать название расхода',
            editTitle: 'Редактировать название расхода',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
    * saveExpenseName({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 14});
      if (result.success) {
        yield put({
          type: 'queryExpenseName'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getExpenseNameById({payload}, {call, put, select}) {
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
    * deleteExpenseName({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryExpenseName'
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
    * queryFactoryAddress({payload}, {call, put, select}) {
      let data = yield call(getListItems, 15);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'FactoryAddress',
            title: 'Адрес завода',
            createTitle: 'Создать адрес завода',
            editTitle: 'Редактировать адрес завода',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
    * saveFactoryAddress({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 15});
      if (result.success) {
        yield put({
          type: 'queryFactoryAddress'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getFactoryAddressById({payload}, {call, put, select}) {
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
    * deleteFactoryAddress({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryFactoryAddress'
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
    * queryStationName({payload}, {call, put, select}) {
      let data = yield call(getListItems, 16);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'StationName',
            title: 'Название станции',
            createTitle: 'Создать название станции',
            editTitle: 'Редактировать название станции',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
    * saveStationName({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 16});
      if (result.success) {
        yield put({
          type: 'queryStationName'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getStationNameById({payload}, {call, put, select}) {
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
    * deleteStationName({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryStationName'
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
    * queryChaseStatus({payload}, {call, put, select}) {
      let data = yield call(getListItems, 17);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'ChaseStatus',
            title: 'Статус слежки',
            createTitle: 'Создать статус слежки',
            editTitle: 'Редактировать статус слежки',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
                render: (text, record) => (
                  <Tag color={record.val01 !== null ? record.val01 : ''} key={record.val01} style={{fontSize: '14px'}}>
                    {text}
                  </Tag>
                )
              }
            ]
          }
        })
      }
    },
    * saveChaseStatus({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 17});
      if (result.success) {
        yield put({
          type: 'queryChaseStatus'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getChaseStatusById({payload}, {call, put, select}) {
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
    * deleteChaseStatus({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryChaseStatus'
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
    * queryCountry({payload}, {call, put, select}) {
      let data = yield call(getListItems, 2);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'Country',
            title: 'Страны',
            createTitle: 'Создать страну',
            editTitle: 'Редактировать страну',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
    * saveCountry({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 2});
      if (result.success) {
        yield put({
          type: 'queryCountry'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getCountryById({payload}, {call, put, select}) {
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
    * deleteCountry({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryCountry'
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
    * queryCity({payload}, {call, put, select}) {
      let data = yield call(getListItems, 18);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            model: 'City',
            title: 'Города',
            createTitle: 'Создать город',
            editTitle: 'Редактировать город',
            isModalOpen: false,
            itemList: data.list,
            currentItem: null,
            modalType: 'create',
            isBtnDisabled: false,
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
    * saveCity({payload}, {call, put, select}) {
      const result = yield call(saveListItem, {...payload, typeId: 18});
      if (result.success) {
        yield put({
          type: 'queryCity'
        })
        notification.info({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#d8ffe9'}
        });
      } else {
        // yield put({
        //   type: 'updateState',
        //   payload: {isBtnDisabled: false}
        // })
        notification.error({
          description: result.message,
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    },
    * getCityById({payload}, {call, put, select}) {
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
    * deleteCity({payload}, {call, put, select}) {
      const result = yield call(deleteListItemById, payload.id);
      if (result.success) {
        yield put({
          type: 'queryCity'
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


  },
  reducers: {
    updateState(state, {payload}) {
      return {...state, ...payload}
    }
  }
})
