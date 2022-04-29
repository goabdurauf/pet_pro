import React, {Component} from 'react';
import {Card, Table, Tabs, Row, Col, Typography} from 'antd';
import {connect} from "react-redux";
const { TabPane } = Tabs;

@connect(({app, report}) => ({app, report}))
class Report extends Component {
  render() {
    const {report, dispatch} = this.props;
    const {model, itemList, columns, currencyList} = report;

    const onChange = (key) => {
      dispatch({
        type: 'report/query' + key
      })
    }
    const getTableBody = () => {
      var data = [];
      currencyList && currencyList.forEach(currency =>
        data.push(<Col span={4} key={currency.id}><Typography.Title level={4}>{currency.currencyName + ' ' + currency.balance}</Typography.Title></Col>)
      );
      return data;
    }
    const aktColumns = [
      {
        title: model === 'ClientVerificationActs' ? 'Клиент' : 'Перевозчик',
        dataIndex: 'ownerName',
        key: 'ownerName',
        // className: 'verification-first-col',
        onCell: (record, index) => { return { rowSpan: index === 0 ? record.rowCount : 0 }; }
      },
      {
        title: 'Валюта',
        dataIndex: 'currencyName',
        key: 'currencyName',
        render: (text, record) => record.header ? "ИТОГ" : text
      },
      {
        title: 'Акт-сверка',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Название услуги',
        dataIndex: 'serviceName',
        key: 'serviceName'
      },
      {
        title: 'Номер рейса',
        dataIndex: 'shippingNum',
        key: 'shippingNum'
      },
      {
        title: 'Номер транспорта',
        dataIndex: 'transportNum',
        key: 'transportNum'
      },
      {
        title: 'Задолженность',
        dataIndex: 'debitSum',
        key: 'debitSum',
        render: (text, record) => text && (text + ' ' + record.currencyName)
      },
      {
        title: 'Получение по договору',
        dataIndex: 'creditSum',
        key: 'creditSum',
        render: (text, record) => text && (text + ' ' + record.currencyName)
      },
      {
        title: 'Курс',
        dataIndex: 'rate',
        key: 'rate'
      },
      {
        title: 'Сумма получение',
        dataIndex: 'creditFinalSum',
        key: 'creditFinalSum',
        render: (text, record) => text && (text + ' ' + record.currencyName)
      },
      {
        title: 'Конечная цена',
        dataIndex: 'debitFinalSum',
        key: 'debitFinalSum',
        render: (text, record) => text && (text + ' ' + record.currencyName)
      }
    ]
    const TabBody = () => {
      return <div>
        <Row>
          <Col span={4} offset={4} key={'title'}><Typography.Title level={4}>Общая сумма</Typography.Title></Col>
          {getTableBody()}
        </Row>

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
    const AktTabBody = () => {
      var data = [];
      itemList && itemList.forEach((item, index) => {
        if (item.actList && item.actList.length > 0) {
          var body = [];
          item.actList.forEach(currency => {
            body = [...body, ...currency]
          })
          body.forEach(aRow => aRow.rowCount = body.length);
          data.push(<Table columns={aktColumns} dataSource={body} bordered size="middle" rowKey={record => record.id}
                            pagination={{position: ["none"]}} style={{marginBottom: '16px'}} rowClassName={record => record.header ? 'verification-currency-header' : ''}/>)
          // body.forEach((aRow, i) => rows.push(<tr key={aRow.id + index}>
          //   <td rowSpan={getAktRowSpan(i, body.length)} colSpan={getAktColSpan(i, body.length)}>{aRow.ownerName}</td>
          //   <td>{aRow.currencyName}</td>
          //   <td>{aRow.name}</td>
          //   <td>{aRow.serviceName}</td>
          //   <td>{aRow.shippingNum}</td>
          //   <td>{aRow.transportNum}</td>
          //   <td>{aRow.debitSum}</td>
          //   <td>{aRow.creditSum}</td>
          //   <td>{aRow.rate}</td>
          //   <td>{aRow.creditFinalSum}</td>
          //   <td>{aRow.debitFinalSum}</td>
          // </tr>))
          // data.push(<RTable bordered hover>
          //   <thead>
          //   <tr>
          //     <th>Клиент</th>
          //     <th>Валюта</th>
          //     <th>Акт-сверка</th>
          //     <th>Название услуги</th>
          //     <th>Номер рейса</th>
          //     <th>Номер транспорта</th>
          //     <th>Задолженность</th>
          //     <th>Получение по договору</th>
          //     <th>Курс</th>
          //     <th>Сумма получение</th>
          //     <th>Конечная цена</th>
          //   </tr>
          //   </thead>
          //   <tbody>
          //   {rows}
          //   </tbody>
          // </RTable>)
        }
      });

      return data;
    }


    return (
      <div className="users-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs onChange={onChange} defaultActiveKey="ClientBalances">
            <TabPane tab="Задолженность клиента" key="ClientBalances"><TabBody /></TabPane>
            <TabPane tab="Задолженность перевозчика" key="CarrierBalances"><TabBody /></TabPane>
            <TabPane tab="Акт сверка с клиентом" key="ClientVerificationActs"><AktTabBody /></TabPane>
            <TabPane tab="Акт сверка с перевозчиком" key="CarrierVerificationActs"><AktTabBody /></TabPane>
          </Tabs>



        </Card>
      </div>
    );
  }
}

export default Report;
