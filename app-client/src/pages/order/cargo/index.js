import React, {Component} from 'react';
import {
  Card,
  Tabs,
  Space,
  Popconfirm,
  Table,
  Row,
  Col,
  Select,
  Modal,
  Typography,
  notification,
  Tooltip,
  Input, DatePicker
} from 'antd';
import {connect} from "react-redux";
import {DeleteOutlined, FormOutlined, SearchOutlined} from "@ant-design/icons";
import CargoModal from '../$order_detail/modals/cargoModal'
import ShippingModal from '../shipping/modal'
import SearchModal from '../modals/searchModal'
import {Button} from "reactstrap";
import moment from "moment";
import locale from "antd/es/date-picker/locale/ru_RU";
const { TabPane } = Tabs;

@connect(({cargo, app}) => ({cargo, app}))
class Cargo extends Component {

  onRowSelect = selectedRowKeys => {
    const {dispatch} = this.props;
    dispatch({
      type: 'cargo/updateState',
      payload: {selectedRowKeys}
    })
  };

  render() {
    const {cargo, dispatch} = this.props;
    const {itemList, currentItem, currentModal, selectedStatusId, isModalOpen, isBtnDisabled, isLoading, countryList, currencyList, packageTypeList, documentAttachments,
      modalType, isTableLoading, selectedRowKeys, cargoStatusList, cargoRegTypeList, selectOrderList, carrierList, managerList, shipTypeList, visibleColumns,
      modalWidth, modalTitle, isPlanning, transportKindList, transportConditionList, productList, searchParams, pagination, clientList} = cargo;

    const searchItems =  [
      {
        label: "Номер заказа, рейса, груза или название груза",
        name: 'word',
        width: 24,
        rules: [{required: false, message: ''}],
        obj: <Input allowClear placeholder='номер заказа, рейса, груза или название груза' />
      },
      {
        label: "Клиент",
        name: 'clientId',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <Select allowClear placeholder='клиент'>
          {clientList.map(client => <Select.Option key={client.id} value={client.id}>{client.name}</Select.Option>)}
        </Select>
      },
      {
        label: "Перевозчик",
        name: 'carrierId',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <Select allowClear placeholder='перевозчик'>
          {carrierList.map(carrier => <Select.Option key={carrier.id} value={carrier.id}>{carrier.name}</Select.Option>)}
        </Select>
      },
      {
        label: "Погрузка",
        name: 'senderCountryId',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <Select allowClear placeholder='выберите страну'>
          {countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
        </Select>
      },
      {
        label: "Разгрузка",
        name: 'receiverCountryId',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <Select allowClear placeholder='выберите страну'>
          {countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
        </Select>
      },
      {
        label: "Статус заказа",
        name: 'statusId',
        width: 24,
        rules: [{required: false, message: ''}],
        obj: <Select allowClear placeholder='статус заказа'>
          {cargoStatusList.map(status => <Select.Option key={status.id} value={status.id}>{status.nameRu}</Select.Option>)}
        </Select>
      },
      {
        label: "Начальная дата загрузки",
        name: 'loadStart',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
      },
      {
        label: "Конечная дата загрузки",
        name: 'loadEnd',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
      },
      {
        label: "Начальная дата разгрузки",
        name: 'unloadStart',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
      },
      {
        label: "Конечная дата разгрузки",
        name: 'unloadEnd',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
      }
    ];
    const onChange = (key) => {
      if (key !== 'Cargo') {
        dispatch({type: 'cargo/pushToPage', payload: {key}});
      }
    }
    const handleSubmit = (values) => {
      dispatch({
        type: 'cargo/updateState',
        payload: {isBtnDisabled: true}
      })
      if (currentModal === 'Cargo') {
        dispatch({
          type: 'cargo/saveCargo',
          payload: {
            ...values,
            id: currentItem.id,
            orderId: currentItem.orderId,
          }
        })
      } else {
        if (isPlanning)
          values.statusId = 10;

        dispatch({
          type: 'cargo/saveShipping',
          payload: {
            ...values
          }
        })
      }
    };
    const handleSearch = (values) => {
      dispatch({
        type: 'cargo/updateState',
        payload: {isModalOpen: false}
      })

      let loadStart = values.loadStart;
      if (loadStart !== undefined && loadStart !== null)
        values.loadStart = loadStart.format('DD.MM.YYYY HH:mm:ss');

      let loadEnd = values.loadEnd;
      if (loadEnd !== undefined && loadEnd !== null)
        values.loadEnd = loadEnd.format('DD.MM.YYYY HH:mm:ss');

      let unloadStart = values.unloadStart;
      if (unloadStart !== undefined && unloadStart !== null)
        values.unloadStart = unloadStart.format('DD.MM.YYYY HH:mm:ss');

      let unloadEnd = values.unloadEnd;
      if (unloadEnd !== undefined && unloadEnd !== null)
        values.unloadEnd = unloadEnd.format('DD.MM.YYYY HH:mm:ss');


      dispatch({
        type: 'cargo/searchCargo',
        payload: {
          ...values,
          page: 0
        }
      })
    }
    const setPlanning = () => {
      dispatch({
        type: 'cargo/updateState',
        payload: {isPlanning: true}
      })
    }
    const columns = [
      ...visibleColumns,
      {
        title: 'Операции',
        key: 'operation',
        width: 100,
        // fixed: 'right',
        align: 'center',
        render: (text, record) => (
          <Space size="middle">
            <Tooltip title="Редактировать" placement={"bottom"} color={"#1f75a8"}>
              <FormOutlined onClick={() => handleEdit(record.id)}/>
            </Tooltip>
            <Popconfirm title="Удалить?" onConfirm={() => handleDelete(record.id)} okText="Да" cancelText="Нет">
              <Tooltip title="Удалить" placement={"bottom"} color={"red"}>
                <DeleteOutlined style={{color: 'red'}}/>
              </Tooltip>
            </Popconfirm>
          </Space>
        )
      }
    ];
    const modalProps = {
      visible: isModalOpen,
      title: modalTitle,
      width: modalWidth,
      onCancel() {
        dispatch({
          type: 'cargo/updateState',
          payload: {
            isModalOpen: false
          }
        })
      }
    };
    const confirmModalProps = {
      visible: isModalOpen,
      title: '',
      width: 400,
      onCancel() {
        dispatch({
          type: 'cargo/updateState',
          payload: {
            isModalOpen: false
          }
        })
      }
    };
    const handleEdit = (id) => {
      dispatch({
        type: 'cargo/getCargoById',
        payload: {id}
      })
    };
    const handleDelete = (id) => {
      dispatch({
        type: 'cargo/deleteCargoById',
        payload: {id}
      })
    }
    const searchProduct = (val) => {
      dispatch({
        type: 'cargo/searchProduct',
        payload: {word: val}
      })
    }
    const customRequest = (options) => {
      dispatch({
        type: 'cargo/updateState',
        payload: {
          isLoading: true
        }
      })
      dispatch({
        type: 'cargo/uploadAttachment',
        payload: {
          file: options.file,
          fileUpload: true,
          type: options.file.type
        }
      })
    }
    const uploadChange = (options) => {
      if (options.file.status === 'removed'){
        if (currentItem.docId === null) {
          dispatch({
            type: 'cargo/deleteAttachment',
            payload: {
              id: options.file.id
            }
          })
        } else {
          dispatch({
            type: 'cargo/deleteDocumentAttachment',
            payload: {
              docId: currentItem.docId,
              id: options.file.id
            }
          })
        }
      }
    }
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onRowSelect,
    };
    const handleSelect = (id) => {
      if (selectedRowKeys.length > 0) {
        dispatch({
          type: 'cargo/updateState',
          payload: {
            isModalOpen: true,
            currentModal: 'Confirm',
            selectedStatusId: id
          }
        })
      } else {
        notification.error({
          description: 'Сначала выберите груза',
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    }
    const openSearchModal = () => {
      if (searchParams !== null) {
        if (searchParams.loadStart !== null && searchParams.loadStart !== undefined)
          searchParams.loadStart = moment(searchParams.loadStart, 'DD.MM.YYYY HH:mm:ss');
        if (searchParams.loadEnd !== null && searchParams.loadEnd !== undefined)
          searchParams.loadEnd = moment(searchParams.loadEnd, 'DD.MM.YYYY HH:mm:ss');
        if (searchParams.unloadStart !== null && searchParams.unloadStart !== undefined)
          searchParams.unloadStart = moment(searchParams.unloadStart, 'DD.MM.YYYY HH:mm:ss');
        if (searchParams.unloadEnd !== null && searchParams.unloadEnd !== undefined)
          searchParams.unloadEnd = moment(searchParams.unloadEnd, 'DD.MM.YYYY HH:mm:ss');
      }
      dispatch({
        type: 'cargo/updateState',
        payload: {
          isModalOpen: !isModalOpen,
          currentModal: 'Search',
          modalTitle: 'Поиск',
          modalWidth: 600
        }
      })
    }
    const handleShipping = (id) => {
      if (selectedRowKeys.length > 0) {
        dispatch({
          type: 'cargo/openShippingModal',
          payload: {
            cargoList: selectedRowKeys
          }
        })
      } else {
        notification.error({
          description: 'Сначала выберите груза',
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    }
    const onShippingCancel = () => {
      dispatch({
        type: 'cargo/updateState',
        payload: {
          isModalOpen: false,
          isPlanning: false
        }
      })
    }
    const handleStatusConfirm = () => {
        dispatch({
          type: 'cargo/changeCargoStatus',
          payload: {
            statusId: selectedStatusId,
            cargoIdList: selectedRowKeys
          }
        })
    }
    const handleTableChange = (pagination) => {
      dispatch({
        type: 'cargo/searchCargo',
        payload: {
          ...searchParams,
          page: pagination.current - 1
        }
      })
    }

    return (
      <div className="cargo-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs onChange={onChange} defaultActiveKey="Cargo">
            <TabPane tab="Запросы" key="/order/request">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Заказы" key="/order">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Грузы" key="Cargo">
              <Row>
                <Col span={4} offset={12}>
                  <Select placeholder='статус груза' onSelect={handleSelect}>
                    {cargoStatusList && cargoStatusList.map(status => <Select.Option key={status.id} value={status.id}>{status.nameRu}</Select.Option>)}
                  </Select>
                </Col>
                <Col span={4}>
                  <Select placeholder='объединить в рейс' onSelect={handleShipping}>
                    <Select.Option key={'collect'} value={'22'}>Объединить в рейс</Select.Option>
                  </Select>
                </Col>
                <Col span={1}>
                  <Button className="float-right" outline color="primary" size="sm" onClick={openSearchModal}><SearchOutlined/></Button>
                </Col>

              </Row>
              <Table rowClassName={(record, index) => record.shippingStatusId === 1 ? 'planning-row' :  ''}
                     rowSelection={rowSelection} columns={columns} dataSource={itemList} bordered size="middle"
                     rowKey={record => record.id} pagination={pagination} loading={isTableLoading}
                     onChange={handleTableChange} scroll={{ y: 600 }}/>
            </TabPane>
            <TabPane tab="Рейсы" key="/order/shipping">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Отслеживание" key="/order/tracking">Подождите пожалуйста ...</TabPane>
          </Tabs>

          {isModalOpen && currentModal === 'Cargo' &&
          <CargoModal
            {...modalProps}
            handleSubmit={handleSubmit} isBtnDisabled={isBtnDisabled} currentItem={currentItem} countryList={countryList}
            customRequest={customRequest} uploadChange={uploadChange} isLoading={isLoading} packageTypeList={packageTypeList}
            documentAttachments={documentAttachments} modalType={modalType} cargoRegTypeList={cargoRegTypeList} currencyList={currencyList}
            transportKindList={transportKindList} transportConditionList={transportConditionList} productList={productList} searchProduct={searchProduct}
          />}

          {isModalOpen && currentModal === 'Shipping' &&
          <ShippingModal
            {...modalProps} onCancel={onShippingCancel} setPlanning={setPlanning}
            handleSubmit={handleSubmit} isBtnDisabled={isBtnDisabled} currentItem={currentItem} selectOrderList={selectOrderList}
            carrierList={carrierList} currencyList={currencyList} managerList={managerList} shipTypeList={shipTypeList}
            transportKindList={transportKindList} transportConditionList={transportConditionList}
          />}

          {isModalOpen && currentModal === 'Confirm' &&
          <Modal {...confirmModalProps} onOk={handleStatusConfirm} okText={"Подтвердить"} cancelText={"Отмена"}>
            <Typography.Title level={5}>Вы действительно хотите изменить статусы выбранных грузов?</Typography.Title>
          </Modal>
          }

          {isModalOpen && currentModal === 'Search' &&
            <SearchModal
              {...modalProps} formItems={searchItems} searchParams={searchParams} handleSubmit={handleSearch}
            />
          }
        </Card>
      </div>
    );
  }
}

export default Cargo;
