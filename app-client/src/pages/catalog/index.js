import React, {Component} from 'react';
import {Card, Row, Col, Typography, Tabs, Space, Popconfirm, Input, Select, Form, Modal, Table,} from 'antd';
import {connect} from "react-redux";
import {DeleteOutlined, FormOutlined, PlusOutlined} from "@ant-design/icons";
import {Button, Label} from "reactstrap";
const { TabPane } = Tabs;
const FormItem = Form.Item;

@connect(({catalog, app}) => ({catalog, app}))
class Catalog extends Component {
  render() {
    const {catalog, dispatch} = this.props;
    const {model, title, createTitle, editTitle, isModalOpen, itemList, currentItem, modalType, roleList, measureList, countryList,
      visibleColumns} = catalog;

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
        case 'Product': return [
          {
            label: 'Название',
            name: 'name',
            width: 24,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          },{
            label: 'Таможенный код',
            name: 'code',
            width: 12,
            rules: [{required: false, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Таможенный код'/>
          },{
            label: 'Единица измерение',
            name: 'measureId',
            width: 12,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Select placeholder='единица измерение' showSearch
                         filterOption={(input, option) =>
                           option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
              {measureList.map(measure => <Select.Option key={measure.id} value={measure.id}>{measure.nameRu}</Select.Option>)}
            </Select>
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
          }
        ];
        case 'OrderStatus': return [
          {
            label: 'Название',
            name: 'nameRu',
            width: 24,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          }
        ];
        case 'Carrier': return [
          {
            label: 'Название',
            name: 'name',
            width: 24,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Название'/>
          },
          {
            label: 'Телефон номер',
            name: 'phone',
            width: 12,
            rules: [{required: false, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Телефон номер'/>
          },{
            label: 'Страна',
            name: 'countryId',
            width: 12,
            rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
            obj: <Select placeholder='Страна' showSearch
                         filterOption={(input, option) =>
                           option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
              {countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
            </Select>
          },{
            label: 'Город',
            name: 'city',
            width: 12,
            rules: [{required: false, message: 'Этот поля не должно быть пустое',},],
            obj: <Input placeholder='Город'/>
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
    const handleSubmit = (name, {values, forms}) => {
      dispatch({
        type: 'catalog/updateState',
        payload: {isModalOpen: false}
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
    const openModal = () => {
      dispatch({
        type: 'catalog/updateState',
        payload: {
          isModalOpen: !isModalOpen,
          currentItem: null,
          modalType: 'create'
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
            <FormOutlined onClick={() => handleEdit(record.id)}/>
            <Popconfirm title="Удалить?" onConfirm={() => handleDelete(record.id)}
                        okText="Да" cancelText="Нет">
              <DeleteOutlined style={{color: 'red'}}/>
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
            isModalOpen: false
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
    const ModalForm = () => {
      const [form] = Form.useForm();
      const onOk = () => {
        form.submit();
      };
      return (
        <Modal {...modalProps} onOk={onOk} okText={"Добавить"} cancelText={"Отмена"}>
          <Form form={form} name="userForm" initialValues={currentItem !== null ? currentItem : ''}>
            <Row> {getFormItems().map((item) =>
              <Col span={item.width} key={item.name}>
                <Label>{item.label}</Label>
                <FormItem key={item.name} name={item.name} rules={item.rules}>
                  {item.obj}
                </FormItem>
              </Col>
            )}</Row>
          </Form>
        </Modal>
      );
    };
    const TabBody = () => {
      return (<div>
        <Row>
          <Col span={8}><Typography.Title level={4}>{title}</Typography.Title></Col>
          <Col span={4} offset={12}>
            <Button className="float-right" outline color="primary" size="sm"
                    onClick={openModal}><PlusOutlined/> Добавить</Button>
          </Col>
        </Row>
        <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
               pagination={{position: ["bottomCenter"]}}/>
      </div>);
    }

    return (
      <div className="catalog-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs tabPosition={"left"} onChange={onChange}>
            <TabPane tab="Пользователи" key="User"><TabBody /></TabPane>
            <TabPane tab="Ед. измерение" key="Measure"><TabBody /></TabPane>
            <TabPane tab="Продукты" key="Product"><TabBody /></TabPane>
            <TabPane tab="Откуда узнал о нас" key="About"><TabBody /></TabPane>
            <TabPane tab="Валюта" key="Currency"><TabBody /></TabPane>
            <TabPane tab="Тип транспорта" key="ShippingType"><TabBody /></TabPane>
            <TabPane tab="Статус заказа" key="OrderStatus"><TabBody /></TabPane>
            <TabPane tab="Перевозчик" key="Carrier"><TabBody /></TabPane>


          </Tabs>
          <Form.Provider onFormFinish={handleSubmit}><ModalForm/></Form.Provider>
        </Card>
      </div>
    );
  }
}

export default Catalog;
