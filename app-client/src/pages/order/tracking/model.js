import {
  saveCargoTracking, getCargoTrackingList, getCargoTrackingById, getListItems
} from '@/services/service'
import {routerRedux} from "dva/router";
import {notification, Tag} from "antd";
import moment from "moment";
import React from "react";

const refs = {}

export default ({
  namespace: 'orderTracking',
  state: {
    itemList: [],
    factoryAddressList:[],
    stationList:[],
    chaseStatusList:[],
    currentItem: null,
    isModalOpen: false,
    isBtnDisabled: false,
    visibleColumns : [
      {
        title: '№',
        dataIndex: 'nomer',
        key: 'nomer',
        align: 'center',
        fixed: 'left',
        width: 40,
        render: (value, item, index) => index+1
      },
      {
        title: 'Адрес завода',
        dataIndex: 'factoryAddress',
        key: 'factoryAddress'
      },
      {
        title: 'Время погрузки',
        dataIndex: 'loadDate',
        key: 'loadDate',
        render: (text, record) => text && text.substring(0, text.indexOf(' '))
      },
      {
        title: 'Дней',
        dataIndex: 'durationDays',
        key: 'durationDays',
        render: (text, record) => <div className={record.unloadDate !== null ? 'cargo_arrived' : 'cargo_not_arrived'}>{text}</div>
      },
      {
        title: 'Номер рейса',
        dataIndex: 'shippingNum',
        key: 'shippingNum'
      },
      {
        title: 'Номер транспорта',
        dataIndex: 'transportNum',
        key: 'transportNum'
      },
      {
        title: 'Перевозчик',
        dataIndex: 'carrierName',
        key: 'carrierName'
      },
      {
        title: 'Клиент',
        dataIndex: 'cargos',
        key: 'cargos',
        width: 250,
        render: (text, record) => {
            let data = [];


           record.cargos && record.cargos.forEach((cargo, idx) => {

           data.push(
              <div  className='py-2 table-cell' key={cargo.clientId}>
                   {cargo.clientName}
              </div>)
           })

           return data;
         }
      },
      {
        title: 'Наимование груза',
        dataIndex: 'cargos',
        key: 'cargos',
        width: 300,
        render: (text, record) => {
           let data = []
           const mappedRecords = record.cargos.map(cargo => cargo.clientCargos)

           const cargoItems = mappedRecords.map(arr =>  {
            const innerArr = arr.map(inner => {
              return inner.cargoName
            })

            return innerArr
           })

          cargoItems.forEach((cargoArr, idx) => {

            data.push(
                <div className='py-2 table-cell'  key={idx}>
                    {
                      cargoArr.map(item => <div key={item}>{item}</div>)
                    }
                </div>
            )
          })

           return data
        }
      },
      {
        title: 'Вес',
        dataIndex: 'cargos',
        key: 'cargos',
        render: (text, record) => {
         let data = []
         const mappedRecords = record.cargos.map(cargo => cargo.clientCargos)

        const cargoItems = mappedRecords.map(arr =>  {
            const innerArr = arr.map(inner => {
                 return inner.cargoDetails
            })

           return innerArr
        })

        cargoItems.forEach((cargo, idx) => {

          data.push(
            <div className='py-2 table-cell'  key={idx}>
                {
                  cargo.map(innerProps => {
                    return innerProps.map((i) => {
                       return <div key={i.id}>{i.weight}</div>
                    })
                  })
                }
            </div>
          )

        })


         return data
        }
      },
      {
        title: 'Объем',
        dataIndex: 'cargos',
        key: 'cargos',
         render: (text, record) => {
                 let data = []
                 const mappedRecords = record.cargos.map(cargo => cargo.clientCargos)

                const cargoItems = mappedRecords.map(arr =>  {
                    const innerArr = arr.map(inner => {
                         return inner.cargoDetails
                    })

                   return innerArr
                })

                cargoItems.forEach((cargo, idx) => {

                  data.push(
                    <div className='py-2 table-cell'  key={idx}>
                        {
                          cargo.map(innerProps => {
                            return innerProps.map((i) => {
                               return <div key={i.id}>{i.capacity}</div>
                            })
                          })
                        }
                    </div>
                  )

                })


                 return data
                }
       },
      {
        title: 'Тип',
        dataIndex: 'shippingType',
        key: 'shippingType'
      },
      {
        title: 'Вид',
        dataIndex: 'transportKind',
        key: 'transportKind'
      },
      {
        title: 'Станция отправление',
        dataIndex: 'loadStation',
        key: 'loadStation'
      },
      {
        title: 'Станция назначение',
        dataIndex: 'unloadStation',
        key: 'unloadStation'
      },
      {
        title: 'Вес груза',
        dataIndex: 'cargoWeight',
        key: 'cargoWeight'
      },
      {
        title: 'Дата передача документа',
        dataIndex: 'docPassDate',
        key: 'docPassDate',
        render: (text, record) => text && text.substring(0, text.indexOf(' '))
      },
      {
        title: 'Дата отправки рейса',
        dataIndex: 'loadSendDate',
        key: 'loadSendDate',
        render: (text, record) => text && text.substring(0, text.indexOf(' '))
      },
      {
        title: 'Дата прибытие на транзитный порт',
        dataIndex: 'customArrivalDate',
        key: 'customArrivalDate',
        render: (text, record) => text && text.substring(0, text.indexOf(' '))
      },
      {
        title: 'Дата покидание транзитного порта',
        dataIndex: 'customSendDate',
        key: 'customSendDate',
        render: (text, record) => text && text.substring(0, text.indexOf(' '))
      },
      {
        title: 'Казахстанский номер',
        dataIndex: 'kazahNumber',
        key: 'kazahNumber'
      },
      {
        title: 'Дата прибытия',
        dataIndex: 'unloadDate',
        key: 'unloadDate',
        render: (text, record) => text && text.substring(0, text.indexOf(' '))
      },
      {
        title: 'Текушее местоположение',
        dataIndex: 'currentLocation',
        key: 'currentLocation'
      },
      {
        title: 'Статус слежки',
        dataIndex: 'chaseStatus',
        key: 'chaseStatus',
        render: (text, record) => (record.chaseStatusColor !== null ? <Tag color={record.chaseStatusColor} key={record.chaseStatusColor} style={{fontSize: '14px'}}>{text}</Tag> : '')
      },
      {
        title: 'Дата вазврат контейнера',
        dataIndex: 'containerReturnDate',
        key: 'containerReturnDate',
        render: (text, record) => text && text.substring(0, text.indexOf(' '))
      },
      {
        title: 'Коммент',
        dataIndex: 'comment',
        key: 'comment'
      }
    ]
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/order/tracking') {
          dispatch({
            type: 'queryCargoTracking',
          });
          dispatch({
            type: 'getAdditionals',
          });
        }
      });
    },
  },
  effects: {
    * queryCargoTracking({payload}, {call, put, select}) {
      let data = yield call(getCargoTrackingList);

      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            itemList: data.list,
            isBtnDisabled: false,
            isModalOpen: false,
            modalWidth: 1200,
            modalTitle: 'Редактировать отслеживание'
          }
        })
      }
    },
    * getAdditionals({payload}, {call, put, select}) {
      let factoryAddress = yield call(getListItems, 15);
      let stations = yield call(getListItems, 16);
      let chaseStatus = yield call(getListItems, 17);

      if (stations.success) {
        yield put({
          type: 'updateState',
          payload: {
            factoryAddressList: factoryAddress.list,
            stationList: stations.list,
            chaseStatusList: chaseStatus.list
          }
        })
      }
    },
    * saveCargoTracking({payload}, {call, put, select}) {
      const result = yield call(saveCargoTracking, payload);
      if (result.success) {
        yield put({
          type: 'queryCargoTracking'
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
    * getCargoTrackingById({payload}, {call, put, select}) {
      const result = yield call(getCargoTrackingById, payload.id);
      if (result.success) {
        if (result.loadDate !== null)
          result.loadDate = moment(result.loadDate, 'DD.MM.YYYY HH:mm:ss');//zone("+05:00")
        if (result.docPassDate !== null)
          result.docPassDate = moment(result.docPassDate, 'DD.MM.YYYY HH:mm:ss');
        if (result.loadSendDate !== null)
          result.loadSendDate = moment(result.loadSendDate, 'DD.MM.YYYY HH:mm:ss');
        if (result.customArrivalDate !== null)
          result.customArrivalDate = moment(result.customArrivalDate, 'DD.MM.YYYY HH:mm:ss');
        if (result.customSendDate !== null)
          result.customSendDate = moment(result.customSendDate, 'DD.MM.YYYY HH:mm:ss');
        if (result.containerReturnDate !== null)
          result.containerReturnDate = moment(result.containerReturnDate, 'DD.MM.YYYY HH:mm:ss');
        if (result.unloadDate !== null)
          result.unloadDate = moment(result.unloadDate, 'DD.MM.YYYY HH:mm:ss');
        yield put({
          type: 'updateState',
          payload: {
            currentItem: result,
            isModalOpen: true
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
