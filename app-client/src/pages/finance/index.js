import React, {Component} from 'react';
import {Card, Col, Popconfirm, Row, Space, Table, Tabs, Tooltip, Typography} from 'antd';
import {connect} from "react-redux";
import {Button} from "reactstrap";
import {DeleteOutlined, FormOutlined, PlusOutlined} from "@ant-design/icons";
const { TabPane } = Tabs;

@connect(({app, finance}) => ({app, finance}))
class Finance extends Component {
  render() {
    const {dispatch, finance} = this.props;
    const {model, isModalOpen, itemList, currentItem, modalType, isBtnDisabled, visibleColumns} = finance;

    const onChange = (key) => {
      if (key === 'ReceivedInvoices') {

      }
    }
    const openModal = () => {
      /*dispatch({
        type: 'order/updateState',
        payload: {
          isModalOpen: !isModalOpen,
          currentItem: model === 'Shipping' ? {rate:1} : null,
          modalType: 'create',
          isBtnDisabled: false
        }
      })*/
    };
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
      /*dispatch({
        type: 'order/get' + model + 'ById',
        payload: {id}
      })*/
    };
    const handleDelete = (id) => {
      /*dispatch({
        type: 'order/delete' + model + 'ById',
        payload: {id}
      })*/
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
            <TabPane tab="Выписанные счёта" key="one"><TabBody /></TabPane>
            <TabPane tab="Полученные счёта" key="ReceivedInvoices"><TabBody /></TabPane>
            <TabPane tab="Акты" key="three"><TabBody /></TabPane>
            <TabPane tab="Платёжи" key="four"><TabBody /></TabPane>
            <TabPane tab="Произведенные платежи" key="five"><TabBody /></TabPane>
          </Tabs>




        </Card>
      </div>
    );
  }
}

export default Finance;
