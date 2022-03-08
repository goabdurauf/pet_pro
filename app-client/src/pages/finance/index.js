import React, {Component} from 'react';
import {Card, Col, Popconfirm, Row, Space, Table, Tabs, Tooltip} from 'antd';
import {connect} from "react-redux";
import {Button} from "reactstrap";
import {DeleteOutlined, FormOutlined, PlusOutlined, MinusOutlined} from "@ant-design/icons";
import InvoiceModal from "../order/shipping/$shipping_detail/modals/invoiceModal";
import KassaInModal from "./modals/kassaInModal";
import KassaOutModal from "./modals/kassaOutModal";
const { TabPane } = Tabs;

@connect(({app, finance}) => ({app, finance}))
class Finance extends Component {
  render() {
    const {dispatch, finance} = this.props;
    const {model, isModalOpen, itemList, invoiceList, currentItem, modalType, isBtnDisabled, currencyList, visibleColumns, clientList, kassaList, agentList,
      otherExpenseList, createTitle, editTitle, modalWidth, carrierList, kassaInOutType, clientId, currencyId, kassaBalance} = finance;

    const onChange = (key) => {
      if (key === 'ReceivedInvoices') {
        dispatch({
          type: 'finance/query' + key,
          payload: {type: 'in'}
        })
      } else if (key === 'SentInvoices') {
        dispatch({
          type: 'finance/query' + key,
          payload: {type: 'out'}
        })
      } else if (key === 'Kassa') {
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
    const openKassaInModal = () => {
      dispatch({
        type: 'finance/updateState',
        payload: {
          kassaInOutType: 101,
          modalType: 'create',
          clientId: null,
          currencyId: null,
          createTitle:'Добавить поступление в кассу',
          isBtnDisabled: false
        }
      })
      dispatch({
        type: 'finance/getKassaNextNum'
      })

    };
    const openKassaOutModal = () => {
      dispatch({
        type: 'finance/updateState',
        payload: {
          kassaInOutType: 201,
          modalType: 'create',
          clientId: null,
          currencyId: null,
          createTitle:'Добавить расход из кассы',
          isBtnDisabled: false
        }
      })
      dispatch({
        type: 'finance/getKassaNextNum'
      })

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
    const handleDocument = (val) => {
      dispatch({
        type: 'finance/updateState',
        payload: {
          currentItem: val,
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
            isModalOpen: false,
            currentItem: null
          }
        })
      }
    };
    const handleSubmit = (values) => {
      dispatch({
        type: 'finance/updateState',
        payload: {isBtnDisabled: true}
      })

      if (model === 'ReceivedInvoices' || model === 'SentInvoices')
        values = {...values, id: currentItem.id};

      dispatch({
        type: 'finance/save' + model,
        payload: {
          ...values
        }
      })
    }
    const handleKassaSubmit = (values) => {
      dispatch({
        type: 'finance/updateState',
        payload: {isBtnDisabled: true}
      })

      dispatch({
        type: modalType === 'create' ? 'finance/saveKassa' : 'finance/updateKassa',
        payload: {
          ...currentItem,
          ...values,
          kassaInOutType
        }
      })
    }
    const handleInTypeChange = (val) => {
      dispatch({
        type: 'finance/updateState',
        payload: {
          kassaInOutType: val
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
            {model !== 'Kassa' &&
            <Popconfirm title="Удалить?" onConfirm={() => handleDelete(record.id)} okText="Да" cancelText="Нет">
              <Tooltip title="Удалить" placement={"bottom"} color={"red"}>
                <DeleteOutlined style={{color: 'red'}}/>
              </Tooltip>
            </Popconfirm>}
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
    const getClientInvoices = (id, type) => {

    }
    const setClient = (id) => {
      dispatch({
        type: 'finance/updateState',
        payload: {clientId: id}
      })
      if (currencyId !== null) {
        dispatch({
          type: 'finance/getClientInvoices',
          payload: {clientId: id, type: kassaInOutType < 200 ? 'out' : 'in', currencyId}
        })
      }
    }
    const setCurrency = (id) => {
      dispatch({
        type: 'finance/updateState',
        payload: {currencyId: id}
      })
      if (kassaInOutType === 101 || kassaInOutType === 201) {
        dispatch({
          type: 'finance/getClientInvoices',
          payload: {clientId, type: kassaInOutType < 200 ? 'out' : 'in', currencyId: id}
        })
      }
    }
    const setKassaBalance = (balance) => {
      dispatch({
        type: 'finance/updateState',
        payload: {kassaBalance: balance}
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
          <Tabs onChange={onChange} defaultActiveKey="SentInvoices">
            <TabPane tab="Выписанные счёта" key="SentInvoices"><TabBody /></TabPane>
            <TabPane tab="Полученные счёта" key="ReceivedInvoices"><TabBody /></TabPane>
            <TabPane tab="Акты" key="three">Пока нет данных</TabPane>
            <TabPane tab="Платёжи" key="four">Пока нет данных</TabPane>
            <TabPane tab="Произведенные платежи" key="five">Пока нет данных</TabPane>
            <TabPane tab="Касса" key="Kassa">
              <Row>
                <Col span={3}>
                  <Button className="float-left" outline color="primary" size="sm" onClick={openKassaInModal}><PlusOutlined/> Поступление</Button>
                </Col>
                <Col span={3}>
                  <Button className="float-left" outline color="primary" size="sm" onClick={openKassaOutModal}><MinusOutlined style={{color: 'red'}}/> Расход</Button>
                </Col>
              </Row>
              <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
                     pagination={{position: ["bottomCenter"]}} style={{marginBottom: '0.5em'}}/>
            </TabPane>
          </Tabs>
        </Card>

        {isModalOpen && (model === 'ReceivedInvoices' || model === 'SentInvoices') &&
          <InvoiceModal
            {...invoiceModalProps}
            currencyList={currencyList} currentItem={currentItem} handleSubmit={handleSubmit} isBtnDisabled={isBtnDisabled}
          />
        }
        {isModalOpen && model === 'Kassa' && kassaInOutType < 200 &&
          <KassaInModal
            {...modalProps}
            isBtnDisabled={isBtnDisabled} handleSubmit={handleKassaSubmit} currentItem={currentItem} currencyList={currencyList}
            clientList={clientList} kassaList={kassaList} agentList={agentList} carrierList={carrierList} kassaInType={kassaInOutType}
            handleInTypeChange={handleInTypeChange} invoiceList={invoiceList} handleDocumentChange={handleDocument} getClientInvoices={getClientInvoices}
            clientId={clientId} currencyId={currencyId} setClient={setClient} setCurrency={setCurrency} kassaBalance={kassaBalance} setKassaBalance={setKassaBalance}
          />
        }
        {isModalOpen && model === 'Kassa' && kassaInOutType > 200 &&
          <KassaOutModal
            {...modalProps}
            isBtnDisabled={isBtnDisabled} handleSubmit={handleKassaSubmit} currentItem={currentItem} currencyList={currencyList}
            clientList={clientList} kassaList={kassaList} otherExpenseList={otherExpenseList} carrierList={carrierList} kassaOutType={kassaInOutType}
            handleInTypeChange={handleInTypeChange} invoiceList={invoiceList} handleDocumentChange={handleDocument} getClientInvoices={getClientInvoices}
            clientId={clientId} currencyId={currencyId} setCarrier={setClient} setCurrency={setCurrency} kassaBalance={kassaBalance} setKassaBalance={setKassaBalance}
          />
        }
      </div>
    );
  }
}

export default Finance;
