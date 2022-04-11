import React, {Component} from 'react';
import {Card, Table, Tabs} from 'antd';
import {connect} from "react-redux";
import {Table as RTable} from 'reactstrap';
const { TabPane } = Tabs;


@connect(({app, report}) => ({app, report}))
class Report extends Component {
  render() {
    const {report, dispatch} = this.props;
    const {itemList, columns, currencyList} = report;

    const onChange = (key) => {
      dispatch({
        type: 'report/query' + key
      })
    }

    const getTableBody = () => {
      var data = [];
      data.push(<th>Обшая сумма</th>);
      currencyList && currencyList.forEach(currency =>
        data.push(<th>{currency.currencyName + ' ' + currency.balance}</th>)
      );
      return data;
    }

    const TabBody = () => {
      return <div>
        <RTable size="middle" bordered>
          <thead>
          <tr key='Jfjkds8'>
            {getTableBody()}

          </tr>
          </thead>
        </RTable>
        {/*<Row>
          <Col span={4} offset={2}>Обшая сумма</Col>
        </Row>*/}

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
      <div className="users-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs onChange={onChange} defaultActiveKey="ClientBalances">
            <TabPane tab="Задолженность клиента" key="ClientBalances"><TabBody /></TabPane>
            <TabPane tab="Задолженность перевозчика" key="CarrierBalances"><TabBody /></TabPane>
          </Tabs>



        </Card>
      </div>
    );
  }
}

export default Report;
