import React, {Component} from 'react';
import {Button, Label} from "reactstrap";
import {Card, Table, Space, Popconfirm, Row, Col, Typography, Form, Input, Modal} from 'antd';
import {connect} from "react-redux";
import {FormOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons'

const FormItem = Form.Item;

@connect(({measure, app}) => ({measure, app}))
class Measure extends Component {
  render() {
    const {measure, dispatch} = this.props;
    const {model, isModalOpen, itemList, currentItem, modalType, visibleColumns} = measure;

    const handleSubmit = (name, {values, forms}) => {
      if (currentItem !== null)
        values = {...values, id: currentItem.id}

      dispatch({
        type: model + '/save',
        payload: {
          ...values,
          typeId: 1
        }
      })
    };
    const openModal = () => {
      dispatch({
        type: model + '/updateState',
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
    const formItems = [
      {
        label: 'Название',
        name: 'nameRu',
        width: 24,
        rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
        obj: <Input placeholder='Название'/>
      }
    ]
    const modalProps = {
      visible: isModalOpen,
      title: modalType === 'create' ? 'Создать единицу измерения' : 'Редактировать единицу измерения',
      width: 400,
      onCancel() {
        dispatch({
          type: model + '/updateState',
          payload: {
            isModalOpen: false
          }
        })
      }
    };
    const handleEdit = (id) => {
      dispatch({
        type: model + '/getById',
        payload: {
          id
        }
      })
    };
    const handleDelete = (id) => {
      dispatch({
        type: model + '/deleteItem',
        payload: {
          id
        }
      })
    }
    const ModalForm = () => {
      const [form] = Form.useForm();
      const onOk = () => {
        form.submit();
      };
      return (
        <Modal {...modalProps} onOk={onOk} okText={"Добавить"} cancelText={"Отмена"}>
          <Form form={form} initialValues={currentItem !== null ? currentItem : ''}>
            <Row> {formItems.map((item) =>
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
    return (
      <div className="users-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Row>
            <Col span={4}><Typography.Title level={4}>Единицы измерения</Typography.Title></Col>
            <Col span={4} offset={16}>
              <Button className="float-right" outline color="primary" size="sm"
                      onClick={openModal}><PlusOutlined/> Добавить</Button>
            </Col>
          </Row>
          <Table columns={columns} dataSource={itemList} bordered
                 size="middle" rowKey={record => record.id}
                 pagination={{position: ["bottomCenter"]}}/>
        </Card>

        <Form.Provider onFormFinish={handleSubmit}>
          <ModalForm/>
        </Form.Provider>
      </div>
    );
  }
}

export default Measure;
