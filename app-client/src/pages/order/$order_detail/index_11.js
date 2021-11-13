import React, {Component, useState} from 'react';
import {Card, Row, Col, Typography, Input, DatePicker, Select, Tabs, Space, Popconfirm, Button as Abutton, Table, Form, Modal, Upload} from 'antd';
import {connect} from "react-redux";
import CargoModal from './modals/cargoModal'
import {Button, Label} from "reactstrap";
import {DeleteOutlined, FormOutlined, MinusCircleOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons";
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
const FormItem = Form.Item;

@connect(({orderDetail, app}) => ({orderDetail, app}))
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
    const {orderDetail, dispatch} = this.props;
      const {model, orderId, isModalOpen, itemList, currentItem, modalType, modalWidth, countryList, orderStatusList, managerList, createTitle, editTitle, visibleColumns,
      senderAttachments, receiverAttachments, customFromAttachments, customToAttachments, packageTypeList, carrierList, currencyList, shipTypeList} = orderDetail;

    const openModal = () => {
      this.setBtnEnabled();
      dispatch({
        type: 'orderDetail/updateState',
        payload: {
          isModalOpen: !isModalOpen,
          currentItem: isModalOpen ? {cargoDetails:[{weight:'', capacity:'', packageTypeId:'', packageAmount:''}]} : currentItem
        }
      })
    }
    const modalProps = {
      title: modalType === 'create' ? createTitle : editTitle,
      visible: isModalOpen,
      width: modalWidth,
    }
    const customRequest = ({onSuccess, onError, file}, owner) => {
      // this.setLoading(owner);
      dispatch({
        type: 'orderDetail/uploadAttachment',
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
    const backToOrders = (key) => {
      dispatch({
        type: 'orderDetail/backToOrders'
      })
    }
    const onChange = (key) => {dispatch({type: 'orderDetail/query' + key});}
    const handleSubmit = (values) => {
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
        type: 'orderDetail/save' + model,
        payload: {...values, orderId}
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
            <FormOutlined onClick={() => handleEdit(record.id)}/>
            <Popconfirm title="Удалить?" onConfirm={() => handleDelete(record.id)}
                        okText="Да" cancelText="Нет">
              <DeleteOutlined style={{color: 'red'}}/>
            </Popconfirm>
          </Space>
        )
      }
    ];
    const handleEdit = (id) => {
      dispatch({
        type: 'orderDetail/get' + model + 'ById',
        payload: {id}
      })
    };
    const handleDelete = (id) => {
      dispatch({
        type: 'orderDetail/delete' + model + 'ById',
        payload: {id}
      })
    }

    const ShippingModal = () => {
      const [form] = Form.useForm();
      const getPrice = (event) => {
        let price = event.target.value;
        let rate = document.getElementById("rate").value;
        form.setFieldsValue({finalPrice: price * rate})
      }
      const getRate = (event) => {
        let price = document.getElementById("price").value;
        let rate = event.target.value;
        form.setFieldsValue({finalPrice: price * rate})
      }
      const onOk = () => {
        form.submit();
      };
      return (
        <Modal {...modalProps} onOk={onOk} okText={"Добавить"} cancelText={"Отмена"}>
          <Form form={form} initialValues={currentItem !== null ? currentItem : ''}>
            <Row>
              <Col span={8}><Label>Номер</Label>
                <FormItem key={'num'} name={'num'} rules={[{required: true, message: 'Этот поля не должно быть пустое'}]}>
                  <Input placeholder='номер рейса' />
                </FormItem>
              </Col>
              <Col span={8}><Label>Менеджер</Label>
                <FormItem key={'managerId'} name={'managerId'} rules={[{required: true, message: 'Выберите менеджера'}]}>
                  <Select placeholder='менеджер'>
                    {managerList.map(manager => <Select.Option key={manager.id} value={manager.id}>{manager.fullName}</Select.Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}><Label>Перевозчик</Label>
                <FormItem key={'carrierId'} name={'carrierId'} rules={[{required: true, message: 'Выберите перевозчика'}]}>
                  <Select placeholder='перевозчик'>
                    {carrierList.map(carrier => <Select.Option key={carrier.id} value={carrier.id}>{carrier.name}</Select.Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col span={6}><Label>Цена</Label>
                <FormItem key={'price'} name={'price'} rules={[{required: true, message: 'Введите цену'}]}>
                  <Input placeholder='цена' onChange={getPrice} />
                </FormItem>
              </Col>
              <Col span={6}><Label>Валюта</Label>
                <FormItem key={'currencyId'} name={'currencyId'} rules={[{required: true, message: 'Выберите валюту'}]}>
                  <Select placeholder='валюта'>
                    {currencyList.map(currency => <Select.Option key={currency.id} value={currency.id}>{currency.nameRu}</Select.Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col span={6}><Label>Курс</Label>
                <FormItem key={'rate'} name={'rate'} rules={[{required: true, message: 'Введите курса'}]} >
                  <Input placeholder='курс' onChange={getRate} />
                </FormItem>
              </Col>
              <Col span={6}><Label>Конечное цена</Label>
                <FormItem key={'finalPrice'} name={'finalPrice'} rules={[{required: true, message: 'Введите конечную цену'}]}>
                  <Input placeholder='конечное цена' />
                </FormItem>
              </Col>
              <Col span={8}><Label>Тип транспорта</Label>
                <FormItem key={'shippingTypeId'} name={'shippingTypeId'} rules={[{required: true, message: 'Выберите тип транспорта'}]}>
                  <Select placeholder='тип транспорта'>
                    {shipTypeList.map(type => <Select.Option key={type.id} value={type.id}>{type.nameRu}</Select.Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}><Label>Номер транспорта</Label>
                <FormItem key={'shippingNum'} name={'shippingNum'} rules={[{required: true, message: 'Введите номер транспорта'}]}>
                  <Input placeholder='номер транспорта' />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    };

    return (
      <div className="order-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs onChange={backToOrders}>
            <Tabs.TabPane tab="Заказы" key="Order">
              <Row className="order-detail-page">
                <Col span={5}>
                  <Card style={{width: '100%'}} bordered={false}>
                    <div className="row">
                      <div className="col-md-12">
                        <Space className="float-left mt-1">Номер заказа: 21922546</Space>
                        <Button className="float-right" outline color="primary" size="sm" >Редактировать</Button>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <Select id={'orderStatusId'} style={{width: '100%', marginTop: '20px'}}>
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
                          <tr><td>Менеджер:</td><td>Дилшод Тиллаев</td></tr>
                          <tr><td>Дата заказа:</td><td>19.09.2021</td></tr>
                          <tr></tr>
                          <tr><td>Клиент:</td><td>samarez cex jizzah</td></tr>
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
                  <Card style={{width: '100%'}} bordered={false}>{console.log(isModalOpen)}
                    <Tabs onChange={onChange}>
                      <Tabs.TabPane tab="Грузы" key="Cargo">
                        <Button className="float-right" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> Добавить</Button>
                        <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
                               pagination={{position: ["bottomCenter"]}}/>
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Рейсы" key="Shipping">
                        <Button className="float-right" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> Добавить</Button>
                        <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
                               pagination={{position: ["bottomCenter"]}}/>
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Финансы" key="Finance">
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Документы" key="Documents">
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Статусы" key="Statuses">
                      </Tabs.TabPane>

                    </Tabs>
                    <Form.Provider onFormFinish={handleSubmit}>{model === 'Shipping' ? <ShippingModal/> : ''}</Form.Provider>
                  </Card>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Грузы" key="Cargo"><Button outline color="primary" size="sm"><PlusOutlined/></Button></Tabs.TabPane>
            <Tabs.TabPane tab="Рейсы" key="Shipping"><Button outline color="primary" size="sm"><PlusOutlined/></Button></Tabs.TabPane>
          </Tabs>

          <CargoModal {...{
            modalProps,
            handleSubmit, openModal,
            isBtnDisabled: this.state.isBtnDisabled,
            isLoading: this.state.isLoading,
            currentItem, countryList,
            customRequest, uploadChange, packageTypeList, modalType,
            senderAttachments, receiverAttachments, customFromAttachments, customToAttachments
          }} />


        </Card>
      </div>
    );
  }
}

export default OrderDetail;
