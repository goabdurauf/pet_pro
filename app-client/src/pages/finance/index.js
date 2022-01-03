import React, {Component} from 'react';
import {Card, Col, Popconfirm, Row, Space, Table, Tabs, Tooltip, Typography} from 'antd';
import {connect} from "react-redux";
import {Button} from "reactstrap";
import {DeleteOutlined, FormOutlined, PlusOutlined, MinusOutlined} from "@ant-design/icons";
import InvoiceModal from "../order/shipping/$shipping_detail/modals/invoiceModal";
import KassaInModal from "./modals/kassaInModal";
const { TabPane } = Tabs;

@connect(({app, finance}) => ({app, finance}))
class Finance extends Component {
  render() {
    const {dispatch, finance} = this.props;
    const {model, isModalOpen, itemList, currentItem, modalType, isBtnDisabled, currencyList, visibleColumns,
      createTitle, editTitle, modalWidth} = finance;

    const onChange = (key) => {
      if (key === 'ReceivedInvoices' || key === 'Kassa') {
        dispatch({
          type: 'finance/query' + key
        })
      } else {
        dispatch({
          type: 'finance/updateState',
          payload: {
            currentItem: null
          }
        })
      }
    }
    const openModal = () => {
      /*dispatch({
        type: 'finance/updateState',
        payload: {
          isModalOpen: !isModalOpen,
          currentItem: null,
          modalType: 'create',
          isBtnDisabled: false
        }
      })*/
    };
    const closeAddInvoiceModal = () => {
      dispatch({
        type: 'finance/updateState',
        payload: {
          isModalOpen: !isModalOpen,
          currentItem: null,
        }
      })
    }
    const invoiceModalProps = {
      title: modalType === 'create' ? 'Добавить полученный счёт' : 'Редактировать полученный счёт',
      visible: isModalOpen,
      onCancel: closeAddInvoiceModal
    }
    const modalProps = {
      visible: isModalOpen,
      title: modalType === 'create' ? createTitle : editTitle,
      width: modalWidth,
      onCancel() {
        dispatch({
          type: 'finance/updateState',
          payload: {
            isModalOpen: false
          }
        })
      }
    };
    const handleSubmit = (values) => {
      dispatch({
        type: 'finance/updateState',
        payload: {isBtnDisabled: true}
      })

      dispatch({
        type: 'finance/save' + model,
        payload: {
          ...currentItem,
          ...values
        }
      })
    }
    const handleKassaInSubmit = (values) => {
      dispatch({
        type: 'finance/updateState',
        payload: {isBtnDisabled: true}
      })

      dispatch({
        type: 'finance/save' + model,
        payload: {
          ...currentItem,
          ...values
        }
      })
    }
    const columns = [
      ...visibleColumns,
      {
        title: 'Операции',
        key: 'operation',
        width: 100,
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
    const handleEdit = (id) => {
      dispatch({
        type: 'finance/get' + model + 'ById',
        payload: {id}
      })
    };
    const handleDelete = (id) => {
      dispatch({
        type: 'finance/delete' + model + 'ById',
        payload: {id}
      })
    }

    const TabBody = () => {
      return <div>
        {/*
        <Row>
          <Col span={4} offset={20}>
            <Button className="float-right" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> Добавить</Button>
          </Col>
        </Row>
        <Row>
          <Col span={4}><Typography.Title level={4}>EURO Logistics</Typography.Title></Col>
        </Row>
        */}
        <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
               pagination={{position: ["bottomCenter"]}} style={{marginBottom: '0.5em'}}/>
        {/*
        <Row>
          <Col span={4}><Typography.Title level={4}>ASIA Logistics</Typography.Title></Col>
        </Row>
        <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
               pagination={{position: ["bottomCenter"]}}/>
        */}
      </div>;
    }

    return (
      <div className="order-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs onChange={onChange} defaultActiveKey="Order">
            <TabPane tab="Выписанные счёта" key="one">Пока нет данных</TabPane>
            <TabPane tab="Полученные счёта" key="ReceivedInvoices"><TabBody /></TabPane>
            <TabPane tab="Акты" key="three">Пока нет данных</TabPane>
            <TabPane tab="Платёжи" key="four">Пока нет данных</TabPane>
            <TabPane tab="Произведенные платежи" key="five">Пока нет данных</TabPane>
            <TabPane tab="Касса" key="Kassa">
              <Row>
                <Col span={3}>
                  <Button className="float-left" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> Поступление</Button>
                </Col>
                <Col span={3}>
                  <Button className="float-left" outline color="primary" size="sm" onClick={openModal}><MinusOutlined style={{color: 'red'}}/> Расход</Button>
                </Col>
              </Row>
              <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
                     pagination={{position: ["bottomCenter"]}} style={{marginBottom: '0.5em'}}/>
            </TabPane>
          </Tabs>
        </Card>

        {isModalOpen && model === 'ReceivedInvoices' &&
          <InvoiceModal
            {...invoiceModalProps}
            currencyList={currencyList} currentItem={currentItem} handleSubmit={handleSubmit} isBtnDisabled={isBtnDisabled}
          />
        }
        {isModalOpen && model === 'Kassa' &&
          <KassaInModal
            {...modalProps}
            isBtnDisabled={isBtnDisabled} handleSubmit={handleKassaInSubmit} currentItem={currentItem} currencyList={currencyList}
          />
        }
      </div>
    );
  }
}

export default Finance;
