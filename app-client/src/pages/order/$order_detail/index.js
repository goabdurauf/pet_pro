import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Card, Row, Col, Select, Tabs, Space, Popconfirm, Table} from 'antd';
import CargoModal from './modals/cargoModal'
import ShippingModal from '../shipping/modal'
import DocumentModal from './modals/documentModal'
import ExpenseModal from './modals/expenseModal'
import {Button} from "reactstrap";
import {DeleteOutlined, FormOutlined, PlusOutlined, CopyOutlined} from "@ant-design/icons";
import 'moment/locale/ru';

const OrderDetail = ({dispatch, orderDetail}) => {
      const {model, orderId, isModalOpen, isLoading, isBtnDisabled, itemList, selectOrderList, currentModel, currentItem, modalType, modalWidth, countryList, orderStatusList,
        managerList, createTitle, editTitle, visibleColumns, cargoSelectList, cargoRegTypeList, isPlanning,
        documentAttachments, packageTypeList, carrierList, currencyList, shipTypeList} = orderDetail;

    const openModal = () => {
      // this.setBtnEnabled();
      dispatch({
        type: 'orderDetail/updateState',
        payload: {
          modalType: 'create',
          documentAttachments: [],
          isModalOpen: !isModalOpen,
          currentItem: model === 'Cargo' ? {cargoDetails:[{weight:'', capacity:'', packageAmount:''}]} : null
        }
      })
    }
    const modalProps = {
      title: modalType === 'create' ? createTitle : editTitle,
      visible: isModalOpen,
      onCancel: openModal,
      width: modalWidth
    }
    const customRequest = (options) => {
      dispatch({
        type: 'orderDetail/updateState',
        payload: {
          isLoading: true
        }
      })
      dispatch({
        type: 'orderDetail/uploadAttachment',
        payload: {
          file: options.file,
          fileUpload: true,
          type: options.file.type
        }
      })
    }
    const uploadChange = (options) => {
      if (options.file.status === 'removed'){
        if (modalType === 'create') {
          dispatch({
            type: 'orderDetail/deleteAttachment',
            payload: {
              id: options.file.id
            }
          })
        } else {
          dispatch({
            type: 'orderDetail/deleteDocumentAttachment',
            payload: {
              docId: currentItem.id,
              id: options.file.id
            }
          })
        }
      }
    }
    const backToOrders = (key) => {
      dispatch({
        type: 'orderDetail/pushToPage',
        payload: {key}
      })
    }
    const onChange = (key) => {dispatch({type: 'orderDetail/query' + key, payload: {id: orderId}});}
    const handleSubmit = (values) => {
      dispatch({
        type: 'orderDetail/updateState',
        payload: {isBtnDisabled: true}
      })
      if (modalType !== 'create')
        values = {...values, id: currentItem.id, docId: currentItem.docId}

      if (values.docDate !== null && values.docDate !== undefined && values.docDate !== '')
        values.docDate = values.docDate.format('DD.MM.YYYY HH:mm');

      if (modalType === 'clone') {
        dispatch({
          type: 'orderDetail/cloneCargo',
          payload: {
            ...values,
            orderId,
            docAttachments: documentAttachments
          }
        })
      } else {
        dispatch({
          type: 'orderDetail/save' + model,
          payload: {
            ...values,
            orderId,
            docAttachments: documentAttachments
          }
        })
      }
    }
    const handleShippingSubmit = (values) => {
      dispatch({
        type: 'orderDetail/updateState',
        payload: {isBtnDisabled: true}
      })
      if (modalType !== 'create') {
        values = {...values, id: currentItem.id}
      }

      if (isPlanning)
        values.statusId = 10;

      dispatch({
        type: 'orderDetail/saveShipping',
        payload: {
          ...values
        }
      })
    };
    const handleDocumentSubmit = (values) => {
      dispatch({
        type: 'orderDetail/updateState',
        payload: {isBtnDisabled: true}
      })

      if (modalType !== 'create')
        values = {...values, id: currentItem.id}

      if (values.date !== undefined && values.date !== '')
        values.date = values.date.format('DD.MM.YYYY HH:mm:ss');

      dispatch({
        type: 'orderDetail/save' + model,
        payload: {
          ...values,
          attachments: documentAttachments
        }
      })
    }
    const handleExpenseSubmit = (values) => {
      dispatch({
        type: 'orderDetail/updateState',
        payload: {isBtnDisabled: true}
      })

      if (modalType !== 'create')
        values = {...values, id: currentItem.id}

      dispatch({
        type: 'orderDetail/save' + model,
        payload: {
          ...values
        }
      })
    }
    const onCancel = () => {
      dispatch({
        type: 'orderDetail/updateState',
        payload: {
          isModalOpen: false,
          isPlanning: false
        }
      })
    }
    const setPlanning = () => {
      dispatch({
        type: 'orderDetail/updateState',
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
            {model === 'Cargo' && <CopyOutlined onClick={() => handleClone(record.id)}/>}
            <FormOutlined onClick={() => handleEdit(record.id)}/>
            <Popconfirm title="Удалить?" onConfirm={() => handleDelete(record.id)}
                        okText="Да" cancelText="Нет">
              <DeleteOutlined style={{color: 'red'}}/>
            </Popconfirm>
          </Space>
        )
      }
    ];
    const handleClone = (id) => {
      dispatch({
        type: 'orderDetail/updateState',
        payload: {modalType: 'clone'}
      })
      dispatch({
        type: 'orderDetail/get' + model + 'ById',
        payload: {id}
      })
    };
    const handleEdit = (id) => {
      if (model === 'Cargo'){
        dispatch({
          type: 'orderDetail/updateState',
          payload: {modalType: 'update'}
        })
      }
      dispatch({
        type: 'orderDetail/get' + model + 'ById',
        payload: {id}
      })
    };
    const handleDelete = (id) => {
      dispatch({
        type: 'orderDetail/delete' + model + 'ById',
        payload: {id, orderId}
      })
    }
    const getTotals = () => {
      let weight = 0;
      let capacity = 0;
      let amount = 0;
      itemList.forEach(item => {
        item.cargoDetails && item.cargoDetails.forEach(detail => {
          weight += detail.weight;
          capacity += detail.capacity;
          amount += detail.packageAmount;
        })
      })
      return ' Вес: ' + weight + '; Объём: ' + capacity + '; Кол-во уп.: ' + amount;
    }

    return (
      <div className="order-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs onChange={backToOrders} defaultActiveKey="/order">
            <Tabs.TabPane tab="Запросы" key="/order/request">Подождите пожалуйста ...</Tabs.TabPane>
            <Tabs.TabPane tab="Заказы" key="/order">
              <Row className="order-detail-page">
                <Col span={5}>
                  <Card style={{width: '100%'}} bordered={false}>
                    <div className="row">
                      <div className="col-md-12">
                        <Space className="float-left mt-1">Номер заказа: {currentModel && currentModel.num}</Space>
                        <Button className="float-right" outline color="primary" size="sm" >Редактировать</Button>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <Select id={'orderStatusId'} style={{width: '100%', marginTop: '20px'}} defaultValue={currentModel && currentModel.statusId}>
                          {orderStatusList.map(status => <Select.Option key={status.id} value={status.id}>{status.nameRu}</Select.Option>)}
                        </Select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <table className='table-bordered table-striped'>
                          <tbody>
                          <tr><td>Начальная ставка для клиента:</td><td>1 USD</td></tr>
                          <tr><td>Фрахт:</td><td>1 USD</td></tr>
                          <tr><td>Расходы:</td><td>2500 USD</td></tr>
                          <tr><td>Прибыль:</td><td>1500 USD</td></tr>
                          <tr></tr>
                          <tr><td>Компания:</td><td>DAFEX</td></tr>
                          <tr><td>Менеджер:</td><td>{currentModel && currentModel.managerName}</td></tr>
                          <tr><td>Дата заказа:</td><td>{currentModel && currentModel.date.substring(0, currentModel.date.indexOf(' '))}</td></tr>
                          <tr></tr>
                          <tr><td>Клиент:</td><td>{currentModel && currentModel.clientName}</td></tr>
                          <tr><td>Перевозчики:</td><td>Norman logistics</td></tr>
                          <tr><td>Экспедиторы:</td><td>Дилшод Тиллаев</td></tr>
                          <tr></tr>
                          <tr><td>Документы с клиентом:</td><td>Добавить заявку</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </Card>
                </Col>
                <Col span={19}>
                  <Card style={{width: '100%'}} bordered={false}>
                    <Tabs onChange={onChange}>
                      <Tabs.TabPane tab="Грузы" key="Cargo">
                        <Row>
                          <Col span={8} offset={8}>
                            <Space className="text-center"><b>Общий размер:</b>{getTotals()}</Space>
                          </Col>
                          <Col span={8}>
                            <Button className="float-right" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> Добавить</Button>
                          </Col>
                        </Row>
                        <Table rowClassName={(record, index) => record.shippingStatusId === 1 ? 'planning-row' :  ''}
                               columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
                               pagination={false}/>
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Рейсы" key="Shipping">
                        <Button className="float-right" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> Добавить</Button>
                        <Table
                          rowClassName={(record, index) => record.statusId === 1 ? 'planning-row' :  ''}
                          columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
                          pagination={false}/>
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Финансы" key="Expense">
                        <Button className="float-right" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> Добавить</Button>
                        <Table
                          columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
                          pagination={false}/>
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Документы" key="Document">
                        <Row>
                          <Col span={4} offset={20}>
                            <Button className="float-right" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> Добавить</Button>
                          </Col>
                        </Row>
                        <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
                               pagination={false}/>
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Статусы" key="Statuses">
                      </Tabs.TabPane>

                    </Tabs>
                  </Card>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Грузы" key="/order/cargo">Подождите пожалуйста ...</Tabs.TabPane>
            <Tabs.TabPane tab="Рейсы" key="/order/shipping">Подождите пожалуйста ...</Tabs.TabPane>
            <Tabs.TabPane tab="Отслеживание" key="/order/tracking">Подождите пожалуйста ...</Tabs.TabPane>
          </Tabs>
        </Card>

        {isModalOpen && model === 'Cargo' &&
        <CargoModal
          {...modalProps}
          handleSubmit={handleSubmit} isBtnDisabled={isBtnDisabled} currentItem={currentItem} countryList={countryList} modalType={modalType}
          isLoading={isLoading} packageTypeList={packageTypeList} documentAttachments={documentAttachments} cargoRegTypeList={cargoRegTypeList}
          currencyList={currencyList}
        />}
        {isModalOpen && model === 'Shipping' &&
        <ShippingModal
          {...modalProps} onCancel={onCancel} setPlanning={setPlanning}
          handleSubmit={handleShippingSubmit} isBtnDisabled={isBtnDisabled} currentItem={currentItem} selectOrderList={selectOrderList}
          carrierList={carrierList} currencyList={currencyList} managerList={managerList} shipTypeList={shipTypeList}
        />}

        {isModalOpen && model === 'Document' &&
        <DocumentModal
          {...modalProps} cargoSelectList={cargoSelectList}
          isBtnDisabled={isBtnDisabled} loadingFile={isLoading} handleSubmit={handleDocumentSubmit} currentItem={currentItem}
          documentAttachments={documentAttachments} customRequest={customRequest} uploadChange={uploadChange}/>}

        {isModalOpen && model === 'Expense' &&
        <ExpenseModal
          {...modalProps}
          handleSubmit={handleExpenseSubmit} isBtnDisabled={isBtnDisabled} currentItem={currentItem} cargoSelectList={cargoSelectList}
          carrierList={carrierList} currencyList={currencyList} ownerType={'Cargo'}/>
        }
      </div>
    );
}

OrderDetail.propTypes = {
  orderDetail: PropTypes.object,
  dispatch: PropTypes.func
};

export default connect(({orderDetail}) => ({orderDetail}))(OrderDetail);
