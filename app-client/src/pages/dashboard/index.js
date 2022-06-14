import React, {Component} from 'react';
import {Card, Row, Col, Typography, DatePicker} from 'antd';
import { SettingOutlined } from '@ant-design/icons'
import {connect} from "react-redux";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList} from "recharts"
import ClientSettingModal from './modal';
import moment from "moment";
import locale from "antd/es/date-picker/locale/ru_RU";

@connect(({app, dashboard}) => ({app, dashboard}))
class Dashboard extends Component {
  render() {
    const {dashboard, dispatch} = this.props;
    const {barData, clientData, isModalOpen} = dashboard;

    const hendleDateChange = (val) => {
      if (val !== null) {
        dispatch({
          type: 'dashboard/queryBalance',
          payload: {
            date: val
          }
        })
      }
    }

    const getBarCharts = () => {
      let barCharts = [];
      barData && barData.forEach(aData =>
        barCharts.push(
          <Col span={4} key={aData.currency}>
            <BarChart
              width={300}
              height={500}
              data={[aData]}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="currency"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Bar dataKey="client" fill="red" name='Дебиторская'>
                <LabelList dataKey="client" position="top"/>
              </Bar>
              <Bar dataKey="carrier" fill="#1F75A8" name='Кредиторская'>
                <LabelList dataKey="carrier" position="top"/>
              </Bar>
            </BarChart>
          </Col>
        )
      );

      return barCharts;
    }
    const modalProps = {
      visible: isModalOpen,
      title: ' ',
      width: 300,
      onCancel() {
        dispatch({
          type: 'dashboard/updateState',
          payload: {
            isModalOpen: false
          }
        })
      }
    };
    const handleClientSetting = () => {
      dispatch({
        type: 'dashboard/updateState',
        payload: {
          isModalOpen: true
        }
      })
    };
    const handleSetClientSetting = (values) => {
      dispatch({
        type: 'dashboard/updateState',
        payload: {
          isModalOpen: false
        }
      })
      dispatch({
        type: 'dashboard/queryClients',
        payload: {
          days: values.days
        }
      })
    };


    return (
      <div className="users-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Row>
            <Col span={4}><Typography.Title level={4}>Показатели</Typography.Title></Col>
          </Row>

          <Row>
            <Col span={3} offset={3}>
              <div style={{textAlign: 'center', marginBottom: '10px'}}>
                <DatePicker format={'DD.MM.YYYY'} locale={locale} defaultValue={new moment()} onChange={hendleDateChange}/>
              </div>
            </Col>
          </Row>
          <Row>
            {getBarCharts()}
            <Col span={4} offset={1} key={'okb'}>
              <Card actions={[<SettingOutlined key="setting" onClick={handleClientSetting}/>]}>
                <Typography.Title level={4}>ОКБ: {clientData && clientData.okb}</Typography.Title>
                <Typography.Title level={4}>АКБ: {clientData && clientData.akb}</Typography.Title>
              </Card>
            </Col>
          </Row>

        </Card>

        {isModalOpen &&
          <ClientSettingModal {...modalProps} handleSubmit={handleSetClientSetting} currentItem={{days: clientData.days}}/>
        }
      </div>
    );
  }
}

export default Dashboard;
