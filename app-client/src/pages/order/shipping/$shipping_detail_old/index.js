import React, {Component, useState} from 'react';
import {Card, Row, Col, Typography, Input, DatePicker, Select, Tabs, Space, Popconfirm, Button as Abutton, Table, Form, Modal, InputNumber} from 'antd';
import {connect} from "react-redux";
import {Button, Label} from "reactstrap";
import {DeleteOutlined, FormOutlined, MinusCircleOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons";
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
const FormItem = Form.Item;

@connect(({shippingDetail, app}) => ({shippingDetail, app}))
class OrderDetail extends Component {

  state = {
    isBtnDisabled: false,
    isLoading: ''
  }

  setBtnDisabled = () => {
    this.setState({isBtnDisabled: true})
  }
  setBtnEnabled = () => {
    this.setState({isBtnDisabled: false})
  }
  setLoading = (val) => {
    this.setState({isLoading: val})
  }

  render() {
    const {shippingDetail, dispatch} = this.props;
      const {model, shippingId, isModalOpen, cargoList, currentModel, currentItem, modalType, modalWidth, createTitle, editTitle, visibleColumns,
        shippingAttachments} = shippingDetail;

    const openModal = () => {
      // this.setBtnEnabled();
      dispatch({
        type: 'shippingDetail/updateState',
        payload: {
          isModalOpen: !isModalOpen,
          currentItem: null
        }
      })
    }
    const modalProps = {
      title: modalType === 'create' ? createTitle : editTitle,
      visible: isModalOpen,
      onCancel: openModal,
      width: modalWidth
    }
    const customRequest = ({onSuccess, onError, file}, owner) => {
      // this.setLoading(owner);
      dispatch({
        type: 'shippingDetail/uploadAttachment',
        payload: {
          file,
          fileUpload: true,
          type: file.type,
          owner
        }
      })
    }
    const uploadChange = ({ file, fileList }, owner) => {
      if (file.status === 'removed'){
        dispatch({
          type: 'orderDetail/deleteAttachment',
          payload: {
            id: file.id,
            owner
          }
        })
      }
    }
    const pushToPage = (key) => {
      dispatch({
        type: 'shippingDetail/pushToPage',
        payload: {key}
      })
    }
    const onChange = (key) => {
      // dispatch({type: 'shippingDetail/query' + key, payload: {id: shippingId}});
    }
    const handleSubmit = (name, {values, forms}) => {
      // this.setBtnDisabled();
      if (modalType !== 'create')
        values = {...values, id: currentItem.id}

      let date = values.loadDate;
      if (date !== undefined)
        values.loadDate = date.format('DD.MM.YYYY HH:mm:ss');

      date = values.unloadDate;
      if (date !== undefined)
        values.unloadDate = date.format('DD.MM.YYYY HH:mm:ss');

      dispatch({
        type: 'shippingDetail/save' + model,
        payload: {...values, shippingId}
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
          shippingId: currentModel.id,
          cargoId: id
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
                      <Tabs.TabPane tab="Документы" key="Documents">
                        <Button className="float-right" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> Добавить</Button>

                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Счета" key="Account">
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Финансы" key="Finance">
                      </Tabs.TabPane>

                    </Tabs>
                    {/*<Form.Provider onFormFinish={handleSubmit}>{model === 'Shipping' ? <ShippingModal/> : <CargoModal/>}</Form.Provider>*/}
                  </Card>
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default OrderDetail;
