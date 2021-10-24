import React, {Component} from 'react';
import {Card, Row, Col, Typography} from 'antd';
import {connect} from "react-redux";


@connect(({app}) => ({app}))
class Report extends Component {
  render() {
    // const {supplier, dispatch} = this.props;
    // const {model, isModalOpen, itemList, currentItem, modalType, countryList, managerList, visibleColumns} = supplier;

    return (
      <div className="users-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Row>
            <Col span={4}><Typography.Title level={4}>Отчёты</Typography.Title></Col>
          </Row>




        </Card>
      </div>
    );
  }
}

export default Report;
