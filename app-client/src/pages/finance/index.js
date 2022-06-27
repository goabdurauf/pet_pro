import React, {Component} from 'react';
import {Card, Col, DatePicker, Input, Popconfirm, Row, Select, Space, Table, Tabs, Tooltip, Typography} from 'antd';
import {connect} from "react-redux";
import {Button} from "reactstrap";
import {
  DeleteOutlined,
  FormOutlined,
  PlusOutlined,
  MinusOutlined,
  SearchOutlined,
  DownloadOutlined
} from "@ant-design/icons";
import InvoiceModal from "../order/shipping/$shipping_detail/modals/invoiceModal";
import KassaInModal from "./modals/kassaInModal";
import KassaOutModal from "./modals/kassaOutModal";
import SearchModal from "../order/modals/searchModal"
import KassaSearchModal from "./modals/kassaSearchModal"
import moment from "moment";
import locale from "antd/es/date-picker/locale/ru_RU";
const { TabPane } = Tabs;

@connect(({app, finance}) => ({app, finance}))
class Finance extends Component {
  render() {
    const {dispatch, finance} = this.props;
    const {model, isModalOpen, itemList, invoiceList, currentItem, modalType, isBtnDisabled, currencyList, visibleColumns, clientList, kassaList, agentList,
      otherExpenseList, createTitle, editTitle, modalWidth, carrierList, kassaInOutType, clientId, currencyId, kassaBalance, searchParams, pagination} = finance;

    const getSearchItems = () => {
      switch (model) {
        case 'SentInvoices': return [
          {
            label: "Название расхода, номер рейса или номер транспорта",
            name: 'word',
            width: 24,
            rules: [{required: false, message: ''}],
            obj: <Input allowClear placeholder='название расхода, номер рейса или номер транспорта' />
          },
          {
            label: "Клиент",
            name: 'clientId',
            width: 12,
            rules: [{required: false, message: ''}],
            obj: <Select allowClear placeholder='клиент'>
              {clientList.map(client => <Select.Option key={client.id} value={client.id}>{client.name}</Select.Option>)}
            </Select>
          },
          {
            label: "Начальная дата счёта",
            name: 'start',
            width: 12,
            rules: [{required: false, message: ''}],
            obj: <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          },
          {
            label: "Конечная дата счёта",
            name: 'end',
            width: 12,
            rules: [{required: false, message: ''}],
            obj: <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          }];
        case 'ReceivedInvoices': return [
          {
            label: "Название расхода, номер рейса или номер транспорта",
            name: 'word',
            width: 24,
            rules: [{required: false, message: ''}],
            obj: <Input allowClear placeholder='название расхода, номер рейса или номер транспорта' />
          },
          {
            label: "Перевозчик",
            name: 'carrierId',
            width: 12,
            rules: [{required: false, message: ''}],
            obj: <Select allowClear placeholder='перевозчик'>
              {carrierList.map(carrier => <Select.Option key={carrier.id} value={carrier.id}>{carrier.name}</Select.Option>)}
            </Select>
          },
          {
            label: "Начальная дата счёта",
            name: 'start',
            width: 12,
            rules: [{required: false, message: ''}],
            obj: <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          },
          {
            label: "Конечная дата счёта",
            name: 'end',
            width: 12,
            rules: [{required: false, message: ''}],
            obj: <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          }];

        default: return [];
      }
    }
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
          isBtnDisabled: false,
          modalWidth: 1100
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
          isBtnDisabled: false,
          modalWidth: 1100
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
    const openSearchModal = () => {
      if (searchParams !== null) {
        if (searchParams.start !== null && searchParams.start !== undefined)
          searchParams.start = moment(searchParams.start, 'DD.MM.YYYY HH:mm:ss');
        if (searchParams.end !== null && searchParams.end !== undefined)
          searchParams.end = moment(searchParams.end, 'DD.MM.YYYY HH:mm:ss');
      }
      dispatch({
        type: 'finance/updateState',
        payload: {
          isModalOpen: !isModalOpen,
          modalType: 'Search',
          createTitle: 'Поиск',
          editTitle: 'Поиск',
          modalWidth: 600
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
      title: editTitle,
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
    const handleSearch = (values) => {
      dispatch({
        type: 'finance/updateState',
        payload: {isModalOpen: false}
      })

      let start = values.start;
      if (start !== undefined && start !== null)
        values.start = start.format('DD.MM.YYYY HH:mm:ss');

      let end = values.end;
      if (end !== undefined && end !== null)
        values.end = end.format('DD.MM.YYYY HH:mm:ss');

      dispatch({
        type: 'finance/search' + model,
        payload: {
          ...searchParams,
          ...values,
          page: 0,
          type: model === 'SentInvoices' ? 'out' : 'in'
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
    const getKassaInfo = () => {
      let data = [];
      kassaList && kassaList.forEach(kassa =>
        data.push(<Col key={kassa.id} span={5}><Typography.Title level={5}>{kassa.name} : {kassa.balans} {kassa.currencyName}</Typography.Title></Col>)
      );
      return data;
    }
    const handleTableChange = (pagination) => {
      dispatch({
        type: 'finance/searchSentInvoices',
        payload: {
          ...searchParams,
          page: pagination.current - 1,
          type: model === 'SentInvoices' ? 'out' : 'in'
        }
      })
    }

    const handleDownload = () => {
      const totalFinances = finance.pagination.total
      const financeType = model === 'SentInvoices' ? 'out' : 'in'
      searchParams.size = totalFinances


      dispatch({
        type: 'finance/download',
        payload: {
          type: financeType,
          ...searchParams
        }
      })
    }

    const handleTransactionDownload = () => {
      const itemListTotal = finance.pagination.total
      searchParams.size = itemListTotal

      console.log(searchParams)


      dispatch({
        type: 'finance/downloadTransactionReport',
        payload: searchParams
      })
    }

    const TabBody = () => {
      return <div>
        <Row className='justify-content-end'>
          <Col span={1} offset={21}>
            <Button className="float-right" outline color="primary" size="sm" onClick={openSearchModal}><SearchOutlined/></Button>
          </Col>
          <Col className='ml-2'>
            <Button className="float-right" outline color="success" size="sm" onClick={handleDownload}>
              <DownloadOutlined className='mr-1' /> Скачать
            </Button>
          </Col>
        </Row>
        <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
               pagination={pagination} style={{marginBottom: '0.5em'}}
               onChange={handleTableChange} scroll={{ y: 600 }}/>
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
                <Col span={1}>
                  <Button outline color="primary" size="sm" onClick={openSearchModal}><SearchOutlined/></Button>
                </Col>

                <Col span={2}>
                  <Button className='float-right mr-3' size='sm' outline color='success' onClick={handleTransactionDownload}>
                    <DownloadOutlined className='mr-1' /> Скачать
                  </Button>
                </Col>
                {getKassaInfo()}
              </Row>
              <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
                     pagination={{position: ["bottomCenter"]}} style={{marginBottom: '0.5em'}}/>
            </TabPane>
          </Tabs>
        </Card>

        {isModalOpen && (model === 'ReceivedInvoices' || model === 'SentInvoices') && modalType !== 'Search' &&
          <InvoiceModal
            {...invoiceModalProps}
            currencyList={currencyList} currentItem={currentItem} handleSubmit={handleSubmit} isBtnDisabled={isBtnDisabled}
          />
        }
        {isModalOpen && modalType === 'Search' && model !== 'Kassa' &&
          <SearchModal
            {...modalProps} formItems={getSearchItems()} searchParams={searchParams} handleSubmit={handleSearch}
          />
        }
        {isModalOpen && modalType === 'Search' && model === 'Kassa' &&
          <KassaSearchModal
            {...modalProps}
            searchParams={searchParams} handleSubmit={handleSearch} handleInTypeChange={handleInTypeChange} kassaType={kassaInOutType}
            clientList={clientList} carrierList={carrierList} agentList={agentList} otherExpenseList={otherExpenseList} kassaList={kassaList}
          />
        }
        {isModalOpen && model === 'Kassa' && kassaInOutType < 200 && modalType !== 'Search' &&
          <KassaInModal
            {...modalProps}
            isBtnDisabled={isBtnDisabled} handleSubmit={handleKassaSubmit} currentItem={currentItem} currencyList={currencyList}
            clientList={clientList} kassaList={kassaList} agentList={agentList} carrierList={carrierList} kassaInType={kassaInOutType}
            handleInTypeChange={handleInTypeChange} invoiceList={invoiceList} handleDocumentChange={handleDocument} getClientInvoices={getClientInvoices}
            clientId={clientId} currencyId={currencyId} setClient={setClient} setCurrency={setCurrency} kassaBalance={kassaBalance} setKassaBalance={setKassaBalance}
          />
        }
        {isModalOpen && model === 'Kassa' && kassaInOutType > 200 && modalType !== 'Search' &&
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
