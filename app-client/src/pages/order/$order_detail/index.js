import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Card, Row, Col, Select, Tabs, Space, Popconfirm, Table, Tooltip, Typography} from 'antd';
import CargoModal from './modals/cargoModal'
import ShippingModal from '../shipping/modal'
import DocumentModal from './modals/documentModal'
import ExpenseModal from './modals/expenseModal'
import InvoiceModal from '../shipping/$shipping_detail/modals/invoiceModal'
import {Button} from "reactstrap";
import {DeleteOutlined, FormOutlined, PlusOutlined, CopyOutlined} from "@ant-design/icons";
import 'moment/locale/ru';
import { BsJournalArrowDown, BsJournalArrowUp, BsCircleFill } from "react-icons/bs";

const OrderDetail = ({dispatch, orderDetail}) => {
  const {
    model, orderId, isModalOpen, isLoading, isBtnDisabled, itemList, cargoList, selectOrderList, isAddInvoiceModalOpen,
    currentModel, currentItem, modalType, modalWidth, countryList, orderStatusList, managerList, createTitle, editTitle, visibleColumns, visibleExpenseColumns, cargoSelectList,
    cargoRegTypeList, isPlanning, transportKindList, transportConditionList, documentAttachments, packageTypeList, carrierList, currencyList, shipTypeList, shippingExpenseList
  } = orderDetail;

  const openModal = () => {
    if (model === 'Shipping') {
      dispatch({
        type: 'orderDetail/getCargoSelect',
        payload: {
          id: orderId
        }
      })
    } else {
      dispatch({
        type: 'orderDetail/updateState',
        payload: {
          modalType: 'create',
          documentAttachments: [],
          isModalOpen: !isModalOpen,
          currentItem: model === 'Cargo' ? {cargoDetails: [{weight: '', capacity: '', packageAmount: ''}]} : null
        }
      })
    }
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
    if (options.file.status === 'removed') {
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
  const onChange = (key) => {
    dispatch({type: 'orderDetail/query' + key, payload: {id: orderId}});
  }
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
          {model === 'Cargo' &&
            <Tooltip title="Дублировать" placement={"bottom"} color={"purple"}>
              <CopyOutlined onClick={() => handleClone(record.id)}/>
            </Tooltip>}
          {model === 'Expense' && <div>
            {record.invoiceInId === null
              ? <Tooltip title="Добавить полученный счёт" placement={"bottom"} color={"cyan"}>
                <BsCircleFill style={{color: 'gold'}}/>
                <BsJournalArrowDown onClick={() => openInvoiceOutModal(record.id)}/>
                </Tooltip>
              : <div>
                  <BsCircleFill style={{color:'springgreen'}}/>
                  <BsJournalArrowDown />
                </div>
              }
            </div>
          }
          {model === 'Expense' && <div>
            {record.invoiceOutId === null
              ? <Tooltip title="Добавить выписанный счёт" placement={"bottom"} color={"orange"}>
                <BsCircleFill style={{color:'gold'}}/>
                <BsJournalArrowUp onClick={() => openInvoiceInModal(record.id)}/>
                </Tooltip>
              : <div>
                  <BsCircleFill style={{color:'springgreen'}}/>
                  <BsJournalArrowUp />
                </div>
              }
            </div>
          }
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
  const expenseColumns = [
    ...visibleExpenseColumns,
    {
      title: 'Операции',
      key: 'operation',
      width: 100,
      // fixed: 'right',
      align: 'center',
      render: (text, record) => (
        <Space size="middle">
          {record.invoiceOutId === null
            ? <Tooltip title="Добавить выписанный счёт" placement={"bottom"} color={"orange"}>
              <BsCircleFill style={{color:'gold'}}/>
              <BsJournalArrowUp onClick={() => openInvoiceInModal(record.id)}/>
            </Tooltip>
            : <div>
              <BsCircleFill style={{color:'springgreen'}}/>
              <BsJournalArrowUp />
            </div>
          }
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
    if (model === 'Cargo') {
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
  };
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
  };

  const handleInvoiceSubmit = (values) => {
    dispatch({
      type: 'orderDetail/updateState',
      payload: {isBtnDisabled: true}
    })

    dispatch({
      type: 'orderDetail/saveInvoice',
      payload: {
        ...values,
        expenseId: currentItem.expenseId,
        type: modalType === 'cargo' ? 5 : modalType === 'create' ? 4 : 3,
        orderId
      }
    })
  }
  const openInvoiceInModal = (id) => {
    dispatch({
      type: 'orderDetail/getExpenseForInvoiceInById',
      payload: {id, modalType: 'create'}
    })
  }
  const openCargoInvoiceModal = (id) => {
    dispatch({
      type: 'orderDetail/getCargoForInvoiceInById',
      payload: {id, modalType: 'cargo'}
    })
  }
  const openInvoiceOutModal = (id) => {
    dispatch({
      type: 'orderDetail/getExpenseForInvoiceOutById',
      payload: {id, modalType: 'update'}
    })
  }
  const closeAddInvoiceModal = () => {
    dispatch({
      type: 'orderDetail/updateState',
      payload: {
        isAddInvoiceModalOpen: !isAddInvoiceModalOpen,
        currentItem: null,
      }
    })
  }
  const modalAddInvoiceProps = {
    title: createTitle,
    visible: isAddInvoiceModalOpen,
    onCancel: closeAddInvoiceModal
  }
  const cargoColumns = [
    {
      title: 'Номер',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Название',
      dataIndex: 'stavka',
      key: 'stavka',
      render: (text, record) => 'Ставка за груз'
    },
    {
      title: 'Номер груза',
      dataIndex: 'num',
      key: 'num',
    },
    {
      title: 'Цена',
      dataIndex: 'price1',
      key: 'price1',
      render: (text, record) => (record.price !== null ? record.price : 0) + ' ' + (record.currencyName !== null ? record.currencyName : '')
    },
    {
      title: 'Операции',
      key: 'operation',
      width: 100,
      align: 'center',
      render: (text, record) => (
        <Space size="middle">
          {record.invoiceOutId === null
            ? <Tooltip title="Добавить выписанный счёт" placement={"bottom"} color={"orange"}>
              <BsCircleFill style={{color:'gold', display: "block"}}/>
              <BsJournalArrowUp onClick={() => openCargoInvoiceModal(record.id)}/>
            </Tooltip>
            : <div>
              <BsCircleFill style={{color:'springgreen', display: "block"}}/>
              <BsJournalArrowUp />
            </div>
          }
        </Space>
      )
    }
  ];

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
                      <Button className="float-right" outline color="primary" size="sm">Редактировать</Button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Select id={'orderStatusId'} style={{width: '100%', marginTop: '20px'}}
                              defaultValue={currentModel && currentModel.statusId}>
                        {orderStatusList.map(status => <Select.Option key={status.id}
                                                                      value={status.id}>{status.nameRu}</Select.Option>)}
                      </Select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <table className='table-bordered table-striped'>
                        <tbody>
                        <tr>
                          <td>Начальная ставка для клиента:</td>
                          <td>1 USD</td>
                        </tr>
                        <tr>
                          <td>Фрахт:</td>
                          <td>1 USD</td>
                        </tr>
                        <tr>
                          <td>Расходы:</td>
                          <td>2500 USD</td>
                        </tr>
                        <tr>
                          <td>Прибыль:</td>
                          <td>1500 USD</td>
                        </tr>
                        <tr></tr>
                        <tr>
                          <td>Компания:</td>
                          <td>DAFEX</td>
                        </tr>
                        <tr>
                          <td>Менеджер:</td>
                          <td>{currentModel && currentModel.managerName}</td>
                        </tr>
                        <tr>
                          <td>Дата заказа:</td>
                          <td>{currentModel && currentModel.date.substring(0, currentModel.date.indexOf(' '))}</td>
                        </tr>
                        <tr></tr>
                        <tr>
                          <td>Клиент:</td>
                          <td>{currentModel && currentModel.clientName}</td>
                        </tr>
                        <tr>
                          <td>Перевозчики:</td>
                          <td>Norman logistics</td>
                        </tr>
                        <tr>
                          <td>Экспедиторы:</td>
                          <td>Дилшод Тиллаев</td>
                        </tr>
                        <tr></tr>
                        <tr>
                          <td>Документы с клиентом:</td>
                          <td>Добавить заявку</td>
                        </tr>
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
                          <Button className="float-right" outline color="primary" size="sm"
                                  onClick={openModal}><PlusOutlined/> Добавить</Button>
                        </Col>
                      </Row>
                      <Table rowClassName={(record, index) => record.shippingStatusId === 1 ? 'planning-row' : ''}
                             columns={columns} dataSource={cargoList} bordered size="middle" rowKey={record => record.id}
                             pagination={false}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Рейсы" key="Shipping">
                      <Button className="float-right" outline color="primary" size="sm"
                              onClick={openModal}><PlusOutlined/> Добавить</Button>
                      <Table
                        rowClassName={(record, index) => record.statusId === 1 ? 'planning-row' : ''}
                        columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
                        pagination={false}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Финансы" key="Expense">
                      <Table style={{marginBottom: '15px'}}
                             columns={cargoColumns} dataSource={cargoList} bordered size="middle" rowKey={record => record.id}
                             pagination={false}/>
                      <Typography.Title className="float-left" level={5}>Расходы по грузам</Typography.Title>
                      <Button className="float-right" outline color="primary" size="sm"
                              onClick={openModal}><PlusOutlined/> Добавить</Button>
                      <Table
                        columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
                        pagination={false}/>
                      <Typography.Title style={{marginTop: '20px'}} level={5}>Расходы по рейсам</Typography.Title>
                      <Table style={{marginTop: '10px'}}
                             columns={expenseColumns} dataSource={shippingExpenseList} bordered size="middle"
                             rowKey={record => record.id}
                             pagination={false}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Документы" key="Document">
                      <Row>
                        <Col span={4} offset={20}>
                          <Button className="float-right" outline color="primary" size="sm"
                                  onClick={openModal}><PlusOutlined/> Добавить</Button>
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
          handleSubmit={handleSubmit} isBtnDisabled={isBtnDisabled} currentItem={currentItem} countryList={countryList}
          modalType={modalType}
          isLoading={isLoading} packageTypeList={packageTypeList} documentAttachments={documentAttachments}
          cargoRegTypeList={cargoRegTypeList}
          currencyList={currencyList} transportKindList={transportKindList}
          transportConditionList={transportConditionList}
        />}
      {isModalOpen && model === 'Shipping' &&
        <ShippingModal
          {...modalProps} onCancel={onCancel} setPlanning={setPlanning}
          handleSubmit={handleShippingSubmit} isBtnDisabled={isBtnDisabled} currentItem={currentItem}
          selectOrderList={selectOrderList}
          carrierList={carrierList} currencyList={currencyList} managerList={managerList} shipTypeList={shipTypeList}
          transportKindList={transportKindList} transportConditionList={transportConditionList}
        />}

      {isModalOpen && model === 'Document' &&
        <DocumentModal
          {...modalProps} cargoSelectList={cargoSelectList}
          isBtnDisabled={isBtnDisabled} loadingFile={isLoading} handleSubmit={handleDocumentSubmit}
          currentItem={currentItem}
          documentAttachments={documentAttachments} customRequest={customRequest} uploadChange={uploadChange}/>}

      {isModalOpen && model === 'Expense' &&
        <ExpenseModal
          {...modalProps}
          handleSubmit={handleExpenseSubmit} isBtnDisabled={isBtnDisabled} currentItem={currentItem}
          cargoSelectList={cargoSelectList}
          carrierList={carrierList} currencyList={currencyList} ownerType={'Cargo'}/>
      }
      {isAddInvoiceModalOpen &&
        <InvoiceModal
          {...modalAddInvoiceProps} headerText={editTitle}
          currencyList={currencyList} currentItem={currentItem} handleSubmit={handleInvoiceSubmit} isBtnDisabled={isBtnDisabled}
        />
      }
    </div>
  );
}

OrderDetail.propTypes = {
  orderDetail: PropTypes.object,
  dispatch: PropTypes.func
};

export default connect(({orderDetail}) => ({orderDetail}))(OrderDetail);
