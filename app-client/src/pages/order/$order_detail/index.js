import React, {Component, useState} from 'react';
import {Card, Row, Col, Typography, Input, DatePicker, Select, Tabs, Space} from 'antd';
import {connect} from "react-redux";
import {CargoModal} from './modals/cargoModal'
import {Button} from "reactstrap";
import {PlusOutlined} from "@ant-design/icons";
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
import {routerRedux} from "dva/router";

@connect(({orderDetail, app}) => ({orderDetail, app}))
class OrderDetail extends Component {

  state = {
    showModal: false,
    isBtnDisabled: false
  }

  openModal = () => {
    this.setState({showModal: true, isBtnDisabled: false})
  }
  cancelModal = () => {
    this.setState({showModal: false})
  }
  setOkBtn = () => {
    this.setState({isBtnDisabled: true})
  }

  render() {
    const {orderDetail, dispatch} = this.props;
    const {model, isModalOpen, itemList, currentItem, modalType, modalWidth, countryList, orderStatusList, managerList, createTitle, editTitle, isLoading, visibleColumns,
      senderAttachments, receiverAttachments, customFromAttachments, customToAttachments, cargoDetails, packageTypeList} = orderDetail;

    const modalProps = {
      title: modalType === 'create' ? createTitle : editTitle,
      visible: this.state.showModal,
      onCancel: this.cancelModal,
      width: modalWidth
    }
    const customRequest = ({onSuccess, onError, file}, owner) => {
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
    const onChange = (key) => {
      dispatch({
        type: 'orderDetail/backToOrders'
      })
    }
    return (
      <div className="order-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs onChange={onChange}>
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
                  <Card style={{width: '100%'}} bordered={false}>
                    <Button className="float-right" outline color="primary" size="sm"
                            onClick={this.openModal}><PlusOutlined/> Добавить</Button>
                  </Card>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Грузы" key="Cargo"><Button outline color="primary" size="sm"><PlusOutlined/></Button></Tabs.TabPane>
            <Tabs.TabPane tab="Рейсы" key="Shipping"><Button outline color="primary" size="sm"><PlusOutlined/></Button></Tabs.TabPane>
          </Tabs>

          <CargoModal {...{
            modalProps,
            setOkBtn: this.setOkBtn,
            isBtnDisabled: this.state.isBtnDisabled,
            currentItem, countryList,
            customRequest, uploadChange, isLoading, cargoDetails, packageTypeList,
            senderAttachments, receiverAttachments, customFromAttachments, customToAttachments
          }} />


        </Card>
      </div>
    );
  }
}

export default OrderDetail;
