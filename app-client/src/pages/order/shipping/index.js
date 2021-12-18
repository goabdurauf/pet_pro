import React, {Component} from 'react';
import {Card, Row, Col, Tabs, Space, Popconfirm, Table, Tooltip} from 'antd';
import {connect} from "react-redux";
import {DeleteOutlined, FormOutlined, PlusOutlined} from "@ant-design/icons";
import {Button} from "reactstrap";
import ShippingModal from './modal'
import 'moment/locale/ru';
const { TabPane } = Tabs;

@connect(({shipping, app}) => ({shipping, app}))
class Shipping extends Component {
  render() {
    const {shipping, dispatch} = this.props;
    const {model, isModalOpen, isBtnDisabled, itemList, currentItem, modalType, managerList, carrierList, currencyList, shipTypeList, selectOrderList,
      modalWidth, createTitle, editTitle, visibleColumns, isPlanning} = shipping;

    const onChange = (key) => {
      if (key !== 'Shipping')
        dispatch({type: 'shipping/pushToPage', payload: {key}});
    }
    const handleSubmit = (values) => {
      dispatch({
        type: 'shipping/updateState',
        payload: {isBtnDisabled: true}
      })
      if (modalType !== 'create') {
        values = {...values, id: currentItem.id}
      }

      if (isPlanning)
        values.statusId = 10;

      dispatch({
        type: 'shipping/save' + model,
        payload: {
          ...values
        }
      })
    };
    const openModal = () => {
      dispatch({type: 'shipping/openModal'})
    };
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
      title: modalType === 'create' ? createTitle : editTitle,
      width: modalWidth
    };
    const onCancel = () => {
      dispatch({
        type: 'shipping/updateState',
        payload: {
          isModalOpen: false,
          isPlanning: false
        }
      })
    }
    const setPlanning = () => {
      dispatch({
        type: 'shipping/updateState',
        payload: {isPlanning: true}
      })
    }
    const handleEdit = (id) => {
      dispatch({
        type: 'shipping/get' + model + 'ById',
        payload: {id}
      })
    };
    const handleDelete = (id) => {
      dispatch({
        type: 'shipping/delete' + model + 'ById',
        payload: {id}
      })
    }
    const TabBody = () => {
      return <div>
        <Row>
          <Col span={4} offset={20}>
            <Button className="float-right" outline color="primary" size="sm"
                    onClick={openModal}><PlusOutlined/> Добавить</Button>
          </Col>
        </Row>
        <Table
          rowClassName={(record, index) => record.statusId === 1 ? 'planning-row' :  ''}
          columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
          pagination={{position: ["bottomCenter"]}}/>
      </div>;
    }

    return (
      <div className="order-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs onChange={onChange} defaultActiveKey="Shipping">
            <TabPane tab="Запросы" key="/order/request">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Заказы" key="/order">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Грузы" key="/order/cargo">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Рейсы" key="Shipping"><TabBody /></TabPane>
            <TabPane tab="Отслеживание" key="/order/tracking">Подождите пожалуйста ...</TabPane>
          </Tabs>
          {isModalOpen &&
          <ShippingModal
            {...modalProps} onCancel={onCancel} setPlanning={setPlanning}
            handleSubmit={handleSubmit} isBtnDisabled={isBtnDisabled} currentItem={currentItem} selectOrderList={selectOrderList}
            carrierList={carrierList} currencyList={currencyList} managerList={managerList} shipTypeList={shipTypeList}
          />}
        </Card>
      </div>
    );
  }
}

export default Shipping;
