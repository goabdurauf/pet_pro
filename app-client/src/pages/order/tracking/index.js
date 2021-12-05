import React, {Component} from 'react';
import {Card, Tabs} from 'antd';
import {connect} from "react-redux";
const { TabPane } = Tabs;

@connect(({orderTracking, app}) => ({orderTracking, app}))
class OrderTracking extends Component {
  render() {

    const {dispatch} = this.props;
/*
    const {itemList, currentItem, currentModal, selectedStatusId, isModalOpen, isBtnDisabled, isLoading,  countryList, packageTypeList, documentAttachments,
      isTableLoading, pagination, selectedRowKeys, cargoStatusList, visibleColumns} = orderRequest;
*/
    const onChange = (key) => {
      if (key !== 'OrderTracking') {
        dispatch({type: 'orderTracking/pushToPage', payload: {key}});
      }
    }

    return (
      <div className="cargo-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs onChange={onChange} defaultActiveKey="OrderTracking">
            <TabPane tab="Запросы" key="/order/request">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Заказы" key="/order">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Грузы" key="/order/cargo">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Рейсы" key="/order/shipping">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Отслеживание" key="OrderTracking">
              Пока нет данных
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default OrderTracking;
