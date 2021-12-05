import React, {Component} from 'react';
import {Card, Tabs} from 'antd';
import {connect} from "react-redux";
const { TabPane } = Tabs;

@connect(({orderRequest, app}) => ({orderRequest, app}))
class OrderRequest extends Component {
  render() {

    const {dispatch} = this.props;
/*
    const {itemList, currentItem, currentModal, selectedStatusId, isModalOpen, isBtnDisabled, isLoading,  countryList, packageTypeList, documentAttachments,
      isTableLoading, pagination, selectedRowKeys, cargoStatusList, visibleColumns} = orderRequest;
*/
    const onChange = (key) => {
      if (key !== 'OrderRequest') {
        dispatch({type: 'orderRequest/pushToPage', payload: {key}});
      }
    }

    return (
      <div className="cargo-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs onChange={onChange} defaultActiveKey="OrderRequest">
            <TabPane tab="Запросы" key="OrderRequest">
              Пока нет данных
            </TabPane>
            <TabPane tab="Заказы" key="/order">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Грузы" key="/order/cargo">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Рейсы" key="/order/shipping">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Отслеживание" key="/order/tracking">Подождите пожалуйста ...</TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default OrderRequest;
