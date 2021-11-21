import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Card, Col, Popconfirm, Row, Space, Table, Tabs} from "antd";
import {DeleteOutlined, FormOutlined, PlusOutlined} from "@ant-design/icons";
import Modal from './modal'
import {Button} from "reactstrap";

const ShippingDetail = ({
                 location, dispatch, shippingDetail, loading,
               }) => {

  const {model, shippingId, isModalOpen, loadingFile, cargoList, currentModel, currentItem, modalType, modalWidth, createTitle, editTitle, visibleColumns,
    isBtnDisabled, documentList, documentAttachments} = shippingDetail;

  const openModal = () => {
    dispatch({
      type: 'shippingDetail/updateState',
      payload: {
        isModalOpen: !isModalOpen,
        modalType: 'create',
        currentItem: null,
        documentAttachments: []
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
      type: 'shippingDetail/updateState',
      payload: {
        loadingFile: true
      }
    })
    if (modalType === 'create') {
      dispatch({
        type: 'shippingDetail/uploadAttachment',
        payload: {
          file: options.file,
          fileUpload: true,
          type: options.file.type
        }
      })
    } else {
      dispatch({
        type: 'shippingDetail/uploadDocumentAttachment',
        payload: {
          id: currentItem.id,
          file: options.file,
          fileUpload: true,
          type: options.file.type
        }
      })
    }
  }
  const uploadChange = (options) => {
    if (options.file.status === 'removed'){
      if (modalType === 'create') {
        dispatch({
          type: 'shippingDetail/deleteAttachment',
          payload: {
            id: options.file.id
          }
        })
      } else {
        dispatch({
          type: 'shippingDetail/deleteDocumentAttachment',
          payload: {
            docId: currentItem.id,
            id: options.file.id
          }
        })
      }
    }
  }
  const pushToPage = (key) => {
    dispatch({
      type: 'shippingDetail/pushToPage',
      payload: {key}
    })
  }
  const onChange = (key) => {
    dispatch({type: 'shippingDetail/query' + key});
  }
  const handleSubmit = (values) => {
    dispatch({
      type: 'shippingDetail/updateState',
      payload: {isBtnDisabled: true}
    })

    if (modalType !== 'create')
      values = {...values, id: currentItem.id}

    if (values.date !== undefined && values.date !== '')
      values.date = values.date.format('DD.MM.YYYY HH:mm:ss');

    dispatch({
      type: 'shippingDetail/save' + model,
      payload: {
        ...values,
        ownerId: shippingId,
        attachments: documentAttachments
      }
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
          {model !== 'Cargo' ? <FormOutlined onClick={() => handleEdit(record.id)}/> : ''}
          <Popconfirm title="Удалить?" onConfirm={() => handleDelete(record.id)} okText="Да" cancelText="Нет">
            <DeleteOutlined style={{color: 'red'}}/>
          </Popconfirm>
        </Space>
      )
    }
  ];
  const handleEdit = (id) => {
    // this.setBtnEnabled();
    dispatch({
      type: 'shippingDetail/get' + model + 'ById',
      payload: {id}
    })
  };
  const handleDelete = (id) => {
    dispatch({
      type: 'shippingDetail/delete' + model + 'ById',
      payload: {
        shippingId,
        id
      }
    })
  }
  const getTotals = () => {
    let weight = 0;
    let capacity = 0;
    let amount = 0;
    cargoList.forEach(item => {
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
        <Tabs onChange={pushToPage} defaultActiveKey="/order/shipping">
          <Tabs.TabPane tab="Заказы" key="/order">Подождите пожалуйста ...</Tabs.TabPane>
          <Tabs.TabPane tab="Грузы" key="/order/cargo">Подождите пожалуйста ...</Tabs.TabPane>
          <Tabs.TabPane tab="Рейсы" key="/order/shipping">
            <Row className="order-detail-page">
              <Col span={5}>
                <Card style={{width: '100%'}} bordered={false}>
                  <div className="row">
                    <div className="col-md-12">
                      <Space className="float-left mt-1">Номер рейса: {currentModel && currentModel.num}</Space>
                      <Button className="float-right" outline color="primary" size="sm" >Редактировать</Button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <table className='table-bordered table-striped'>
                        <tbody>
                        <tr><td>Менеджер:</td><td>{currentModel && currentModel.managerName}</td></tr>
                        <tr><td>Перевозчик:</td><td>{currentModel && currentModel.carrierName}</td></tr>
                        <tr><td>Цена:</td><td>{currentModel && (currentModel.finalPrice + ' USD (' + currentModel.price + ' ' + currentModel.currencyName + ')')}</td></tr>
                        <tr><td>Тип транспорта:</td><td>{currentModel && currentModel.shippingTypeName}</td></tr>
                        <tr><td>Номер транспорта:</td><td>{currentModel && currentModel.shippingNum}</td></tr>
                        <tr><td>Дата загрузки:</td><td>{currentModel && currentModel.loadDate}</td></tr>
                        <tr><td>Дата разгрузки:</td><td>{currentModel && currentModel.unloadDate}</td></tr>
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
                          <Space className="text-center shipping-cargo-header"><b>Общий размер:</b>{getTotals()}</Space>
                        </Col>
                      </Row>
                      <Table columns={columns} dataSource={cargoList} bordered size="middle" rowKey={record => record.id}
                             pagination={false}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Документы" key="Document">
                      <Button className="float-right" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> Добавить</Button>
                      <Table columns={columns} dataSource={documentList} bordered size="middle" rowKey={record => record.id}
                             pagination={false}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Счета" key="Account">
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Финансы" key="Finance">
                    </Tabs.TabPane>

                  </Tabs>
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>
        {isModalOpen && <Modal {...modalProps}
                               isBtnDisabled={isBtnDisabled} loadingFile={loadingFile} handleSubmit={handleSubmit} currentItem={currentItem}
                               documentAttachments={documentAttachments} customRequest={customRequest} uploadChange={uploadChange}/>}
      </Card>
    </div>
  )
};

ShippingDetail.propTypes = {
  shippingDetail: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
};

export default connect(({shippingDetail, loading}) => ({shippingDetail, loading}))(ShippingDetail)
