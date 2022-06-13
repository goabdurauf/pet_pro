import React, {Component} from 'react';
import {Card, Row, Col, Typography, Tabs, Space, Popconfirm, Input, Select, Table, Tooltip, DatePicker} from 'antd';
import {connect} from "react-redux";
import {DeleteOutlined, FormOutlined, PlusOutlined} from "@ant-design/icons";
import {Button} from "reactstrap";
import CatalogModal from './modals/defaultModal'
import ProductModal from './modals/productModal'
import 'moment/locale/ru';
import locale from "antd/es/date-picker/locale/ru_RU";
const { TabPane } = Tabs;

@connect(({catalog, app}) => ({catalog, app}))
class Catalog extends Component {
  render() {
    const {catalog, dispatch} = this.props;
    const {model, title, createTitle, editTitle, isModalOpen, isBtnDisabled, itemList, currentItem, modalType, roleList, measureList, currencyList, visibleColumns,
      isLoading, productAttachments} = catalog;

    const getFormItems = () => {
      switch (model) {
        case 'User': return  [
          {
            label: 'Фамилия и имя',
            name: 'fullName',
            width: 12,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Фамилия и имя'/>
          }, {
            label: "Телефон номер",
            name: 'phone',
            width: 12,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='+998 90 125 05 05'/>
          }, {
            label: "Логин",
            name: 'login',
            width: 12,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='логин'/>
          }, {
            label: "Пароль",
            name: 'password',
            width: 12,
            rules: [{required: modalType === 'create', message: 'Этот поля не должно быть пустое',},],
            obj: <Input type={"password"} placeholder='пароль'/>
          }, {
            label: "Роль",
            name: 'role',
            width: 12,
            rules: [{required: true, message: 'Выберите роль пользователя',},],
            obj: <Select placeholder='роль пользователя'>
              {roleList.map(role => <Select.Option key={role.id} value={role.id}>{role.description}</Select.Option>)}
            </Select>
          }
        ];
        case 'Measure': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 24,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          }
        ];
        case 'About': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 24,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          }
        ];
        case 'Currency': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 24,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          }
        ];
        case 'ShippingType': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 24,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          },
          {
            label: 'Объём',
            name: 'num01',
            width: 7,
            rules: [{required: true, message: 'Введите',},],
            obj: <Input placeholder='Объём'/>
          },
          {
            label: 'Вес',
            name: 'num02',
            width: 7,
            rules: [{required: true, message: 'Введите',},],
            obj: <Input placeholder='Вес'/>
          },
          {
            label: 'Размер (L * H * W)',
            name: 'val01',
            width: 10,
            rules: [{required: true, message: 'Введите',},],
            obj: <Input placeholder='Размер'/>
          },

        ];
        case 'OrderStatus': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 18,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          },
          {
            label: 'Цвет',
            name: 'val01',
            width: 6,
            rules: [{required: false}],
            obj: <Input type={'color'} placeholder='Название'/>
          }
        ];
        case 'PackageType': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 24,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          }
        ];
        case 'CargoStatus': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 18,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          },
          {
            label: 'Цвет',
            name: 'val01',
            width: 6,
            rules: [{required: false}],
            obj: <Input type={'color'} placeholder='Название'/>
          }
        ];
        case 'TransportKind': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 12,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          },
          {
            label: 'Дата',
            name: 'date01',
            width: 12,
            rules: [{required: true, message: 'Введите дату',},],
            obj: <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          }
        ];
        case 'TransportCondition': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 12,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          },
          {
            label: 'Дата',
            name: 'date01',
            width: 12,
            rules: [{required: true, message: 'Введите дату',},],
            obj: <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          }
        ];
        case 'Kassa': return [
          {
            label: 'Название',
            name: 'name',
            width: 14,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          },{
            label: 'Валюта учёта',
            name: 'currencyId',
            width: 10,
            rules: [{required: true, message: 'Выберите валюту',},],
            obj: <Select placeholder='валюта' showSearch
                         filterOption={(input, option) =>
                           option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
              {currencyList.map(currency => <Select.Option key={currency.id} value={currency.id}>{currency.nameRu}</Select.Option>)}
            </Select>
          }
        ];
        case 'OtherAgents': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 24,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          }
        ];
        case 'OtherExpenses': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 24,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          }
        ];
        case 'ExpenseName': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 24,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          }
        ];
        case 'FactoryAddress': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 24,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          }
        ];
        case 'StationName': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 24,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          }
        ];
        case 'ChaseStatus': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 18,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          },
          {
            label: 'Цвет',
            name: 'val01',
            width: 6,
            rules: [{required: false}],
            obj: <Input type={'color'} placeholder='Название'/>
          }
        ];
        case 'Country': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 24,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          }
        ];
        case 'City': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 24,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          }
        ];



        default: return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 24,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          }
        ];
      }
    }

    const onChange = (key) => {dispatch({type: 'catalog/query' + key});}
    const handleSubmit = (values) => {
      dispatch({
        type: 'catalog/updateState',
        payload: {isBtnDisabled: true}
      })
      if (currentItem !== null)
        values = {...values, id: currentItem.id}

      dispatch({
        type: 'catalog/save' + model,
        payload: {
          ...values
        }
      })
    };
    const handleProductSubmit = (values) => {
      dispatch({
        type: 'catalog/updateState',
        payload: {isBtnDisabled: true}
      })

      if (modalType !== 'create')
        values = {...values, id: currentItem.id}

      dispatch({
        type: 'catalog/save' + model,
        payload: {
          ...values,
          attachments: productAttachments
        }
      })
    }
    const customRequest = (options) => {
      dispatch({
        type: 'catalog/updateState',
        payload: {
          isLoading: true
        }
      })
      dispatch({
        type: 'catalog/uploadAttachment',
        payload: {
          file: options.file,
          fileUpload: true,
          type: options.file.type
        }
      })
    }
    const uploadChange = (options) => {
      if (options.file.status === 'removed') {
        if (modalType === 'create') {
          dispatch({
            type: 'catalog/deleteAttachment',
            payload: {
              id: options.file.id
            }
          })
        } else {
          dispatch({
            type: 'catalog/deleteProductAttachment',
            payload: {
              docId: currentItem.id,
              id: options.file.id
            }
          })
        }
      }
    }
    const openModal = () => {
      dispatch({
        type: 'catalog/updateState',
        payload: {
          isModalOpen: !isModalOpen,
          currentItem: null,
          modalType: 'create',
          isLoading: false
        }
      })
    };
    const columns = [
      ...visibleColumns,
      {
        title: 'Операции',
        key: 'operation',
        width: (100 / (visibleColumns.length + 1)) + '%',
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
      title: modalType === 'create' ? createTitle : editTitle,
      onCancel() {
        dispatch({
          type: 'catalog/updateState',
          payload: {
            isModalOpen: false,
            productAttachments: []
          }
        })
      }
    };
    const handleEdit = (id) => {
      dispatch({
        type: 'catalog/get' + model + 'ById',
        payload: {id}
      })
    };
    const handleDelete = (id) => {
      dispatch({
        type: 'catalog/delete' + model,
        payload: {id}
      })
    }
    const TabBody = () => {
      return (<div>
        <Row>
          <Col span={8}><Typography.Title level={4}>{title}</Typography.Title></Col>
          <Col span={4} offset={12}>
            <Button className="float-right" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> Добавить</Button>
          </Col>
        </Row>
        <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
               pagination={{position: ["bottomCenter"]}}/>
      </div>);
    }

    return (
      <div className="catalog-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs >
            <TabPane tab="Организация" key="Organization">
              <Tabs tabPosition={"left"} onChange={onChange}>
                <TabPane tab="Пользователи" key="User"><TabBody /></TabPane>
                <TabPane tab="Валюта" key="Currency"><TabBody /></TabPane>
                <TabPane tab="Касса" key="Kassa"><TabBody /></TabPane>

              </Tabs>
            </TabPane>
            <TabPane tab="Справочники" key="Catalog">
              <Tabs tabPosition={"left"} onChange={onChange}>
                <TabPane tab="Ед. измерение" key="Measure"><TabBody /></TabPane>
                <TabPane tab="Продукты" key="Product"><TabBody /></TabPane>
                <TabPane tab="Откуда узнал о нас" key="About"><TabBody /></TabPane>
                <TabPane tab="Тип транспорта" key="ShippingType"><TabBody /></TabPane>
                <TabPane tab="Статус заказа" key="OrderStatus"><TabBody /></TabPane>
                <TabPane tab="Тип упаковки" key="PackageType"><TabBody /></TabPane>
                <TabPane tab="Статус груза" key="CargoStatus"><TabBody /></TabPane>
                <TabPane tab="Тип оформление груза" key="CargoRegType"><TabBody /></TabPane>
                <TabPane tab="Вид транспорта" key="TransportKind"><TabBody /></TabPane>
                <TabPane tab="Условие транспорта" key="TransportCondition"><TabBody /></TabPane>
                <TabPane tab="Прочие контрагенты" key="OtherAgents"><TabBody /></TabPane>
                <TabPane tab="Прочие расходы" key="OtherExpenses"><TabBody /></TabPane>
                <TabPane tab="Название расхода" key="ExpenseName"><TabBody /></TabPane>
                <TabPane tab="Адрес завода" key="FactoryAddress"><TabBody /></TabPane>
                <TabPane tab="Название станции" key="StationName"><TabBody /></TabPane>
                <TabPane tab="Статус слежки" key="ChaseStatus"><TabBody /></TabPane>
                <TabPane tab="Страны" key="Country"><TabBody /></TabPane>
                <TabPane tab="Города" key="City"><TabBody /></TabPane>


              </Tabs>
            </TabPane>


          </Tabs>
        </Card>

        {isModalOpen && model !== 'Product' &&
        <CatalogModal {...modalProps}
          isBtnDisabled={isBtnDisabled} currentItem={currentItem} handleSubmit={handleSubmit} itemList={getFormItems()}
        />
        }
        {isModalOpen && model === 'Product' &&
        <ProductModal {...modalProps}
          isBtnDisabled={isBtnDisabled} currentItem={currentItem} handleSubmit={handleProductSubmit} measureList={measureList}
          loadingFile={isLoading} productAttachments={productAttachments} customRequest={customRequest} uploadChange={uploadChange}
        />
        }

      </div>
    );
  }
}

export default Catalog;
