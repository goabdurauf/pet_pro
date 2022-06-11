import React, {Component} from 'react';
import {Card, Row, Col, Tabs, Space, Popconfirm, Table, Tooltip, Input, Select, DatePicker} from 'antd';
import {connect} from "react-redux";
import {DeleteOutlined, FormOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {Button} from "reactstrap";
import ShippingModal from './modal'
import SearchModal from '../modals/searchModal'
import 'moment/locale/ru';
import moment from "moment";
import locale from "antd/es/date-picker/locale/ru_RU";
const { TabPane } = Tabs;

@connect(({shipping, app}) => ({shipping, app}))
class Shipping extends Component {
  render() {
    const {shipping, dispatch} = this.props;
    const {model, isModalOpen, isBtnDisabled, itemList, currentItem, modalType, managerList, carrierList, clientList, currencyList, shipTypeList, selectOrderList,
      modalWidth, createTitle, editTitle, visibleColumns, isPlanning, transportKindList, transportConditionList, stationList, searchParams, pagination} = shipping;

    const searchItems =  [
      {
        label: "Номер рейса, заказа или транспорта",
        name: 'word',
        width: 24,
        rules: [{required: false, message: ''}],
        obj: <Input allowClear placeholder='номер рейса, заказа или транспорта' />
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
        label: "Перевозчик",
        name: 'carrierId',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <Select allowClear placeholder='перевозчик'>
          {carrierList.map(carrier => <Select.Option key={carrier.id} value={carrier.id}>{carrier.name}</Select.Option>)}
        </Select>
      },
      {
        label: "Менеджер",
        name: 'managerId',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <Select allowClear placeholder='менеджер'>
          {managerList.map(manager => <Select.Option key={manager.id} value={manager.id}>{manager.fullName}</Select.Option>)}
        </Select>
      },
      {
        label: "Тип транспорта",
        name: 'transportKindId',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <Select allowClear placeholder='тип транспорта'>
          {transportKindList.map(kind => <Select.Option key={kind.id} value={kind.id}>{kind.nameRu}</Select.Option>)}
        </Select>
      },
      {
        label: "Нач. дата загрузки",
        name: 'loadStart',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
      },
      {
        label: "Кон. дата загрузки",
        name: 'loadEnd',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
      },
      {
        label: "Нач. дата разгрузки",
        name: 'unloadStart',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
      },
      {
        label: "Кон. дата разгрузки",
        name: 'unloadEnd',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
      }
    ];
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
    const handleSearch = (values) => {
      dispatch({
        type: 'shipping/updateState',
        payload: {isModalOpen: false}
      })

      let loadStart = values.loadStart;
      if (loadStart !== undefined && loadStart !== null)
        values.loadStart = loadStart.format('DD.MM.YYYY HH:mm:ss');

      let loadEnd = values.loadEnd;
      if (loadEnd !== undefined && loadEnd !== null)
        values.loadEnd = loadEnd.format('DD.MM.YYYY HH:mm:ss');

      let unloadStart = values.unloadStart;
      if (unloadStart !== undefined && unloadStart !== null)
        values.unloadStart = unloadStart.format('DD.MM.YYYY HH:mm:ss');

      let unloadEnd = values.unloadEnd;
      if (unloadEnd !== undefined && unloadEnd !== null)
        values.unloadEnd = unloadEnd.format('DD.MM.YYYY HH:mm:ss');


      dispatch({
        type: 'shipping/searchShipping',
        payload: {
          ...values,
          page: 0
        }
      })
    }
    const openModal = () => {
      dispatch({
        type: 'shipping/openModal',
        payload: {modalType: 'create'}
      })
    };
    const openSearchModal = () => {
      if (searchParams !== null) {
        if (searchParams.loadStart !== null && searchParams.loadStart !== undefined)
          searchParams.loadStart = moment(searchParams.loadStart, 'DD.MM.YYYY HH:mm:ss');
        if (searchParams.loadEnd !== null && searchParams.loadEnd !== undefined)
          searchParams.loadEnd = moment(searchParams.loadEnd, 'DD.MM.YYYY HH:mm:ss');
        if (searchParams.unloadStart !== null && searchParams.unloadStart !== undefined)
          searchParams.unloadStart = moment(searchParams.unloadStart, 'DD.MM.YYYY HH:mm:ss');
        if (searchParams.unloadEnd !== null && searchParams.unloadEnd !== undefined)
          searchParams.unloadEnd = moment(searchParams.unloadEnd, 'DD.MM.YYYY HH:mm:ss');
      }
      dispatch({
        type: 'shipping/updateState',
        payload: {
          isModalOpen: !isModalOpen,
          modalType: 'search',
          modalWidth: 600
        }
      })
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
      title: modalType === 'search' ? 'Поиск' : modalType === 'create' ? createTitle : editTitle,
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
    const handleTableChange = (pagination, filters, sorter) => {
      dispatch({
        type: 'shipping/searchShipping',
        payload: {
          ...searchParams,
          page: pagination.current - 1
        }
      })
    }
    const TabBody = () => {
      return <div>
        <Row>
          <Col span={4} offset={20}>
            <Button className="float-right" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> Добавить</Button>
            <Button className="float-right mr-4" outline color="primary" size="sm" onClick={openSearchModal}><SearchOutlined/></Button>
          </Col>
        </Row>
        <Table
          rowClassName={(record, index) => record.statusId === 1 ? 'planning-row' :  ''}
          columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
          pagination={pagination} onChange={handleTableChange} scroll={{ y: 600 }}/>
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
          {isModalOpen && modalType !== 'search' &&
          <ShippingModal
            {...modalProps} onCancel={onCancel} setPlanning={setPlanning} stationList={stationList}
            handleSubmit={handleSubmit} isBtnDisabled={isBtnDisabled} currentItem={currentItem} selectOrderList={selectOrderList}
            carrierList={carrierList} currencyList={currencyList} managerList={managerList} shipTypeList={shipTypeList}
            transportKindList={transportKindList} transportConditionList={transportConditionList}
          />}
          {isModalOpen && modalType === 'search' &&
            <SearchModal
              {...modalProps} onCancel={onCancel} formItems={searchItems} searchParams={searchParams} handleSubmit={handleSearch}
            />
          }
          </Card>
      </div>
    );
  }
}

export default Shipping;
