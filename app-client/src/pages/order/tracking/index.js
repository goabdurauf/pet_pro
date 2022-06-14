import React, {Component} from 'react';
import {Card, Space, Table, Tabs, Tooltip} from 'antd';
import {connect} from "react-redux";
import {FormOutlined} from "@ant-design/icons";
import EditModal from './modal';
const { TabPane } = Tabs;

@connect(({orderTracking, app}) => ({orderTracking, app}))
class OrderTracking extends Component {
  render() {

    const {dispatch, orderTracking} = this.props;
    const {itemList, currentItem, isModalOpen, isBtnDisabled, factoryAddressList, stationList, chaseStatusList, visibleColumns} = orderTracking;

    const onChange = (key) => {
      if (key !== 'OrderTracking') {
        dispatch({type: 'orderTracking/pushToPage', payload: {key}});
      }
    }
    const handleEdit = (id) => {
      dispatch({
        type: 'orderTracking/getCargoTrackingById',
        payload: {id}
      })
    };
    const handleSubmit = (values) => {
      dispatch({
        type: 'orderTracking/updateState',
        payload: {isBtnDisabled: true}
      })
      dispatch({
        type: 'orderTracking/saveCargoTracking',
        payload: {
          ...values,
          id: currentItem.id
        }
      })
    }
    const columns = [
      ...visibleColumns,
      {
        title: 'Операции',
        key: 'operation',
        width: 90,
        fixed: 'right',
        align: 'center',
        render: (text, record) => (
          <Space size="middle">
            <Tooltip title="Редактировать" placement={"bottom"} color={"#1f75a8"}>
              <FormOutlined onClick={() => handleEdit(record.id)}/>
            </Tooltip>
          </Space>
        )
      }
    ];
    const modalProps = {
      visible: isModalOpen,
      title: "Редактировать отслеживание груза",
      width: 820,
      onCancel() {
        dispatch({
          type: 'orderTracking/updateState',
          payload: {
            isModalOpen: false
          }
        })
      }
    };

    return (
      <div className="cargo-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs onChange={onChange} defaultActiveKey="OrderTracking">
            <TabPane tab="Запросы" key="/order/request">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Заказы" key="/order">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Грузы" key="/order/cargo">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Рейсы" key="/order/shipping">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Отслеживание" key="OrderTracking">
              <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
                     pagination={{position: ["bottomCenter"]}} scroll={{ x: 2800 }}/>
            </TabPane>
          </Tabs>

          {isModalOpen &&
            <EditModal {...modalProps} handleSubmit={handleSubmit}
                       currentItem={currentItem} isBtnDisabled={isBtnDisabled} factoryAddressList={factoryAddressList} stationList={stationList}
                       chaseStatusList={chaseStatusList}
            />}
        </Card>
      </div>
    );
  }
}

export default OrderTracking;
