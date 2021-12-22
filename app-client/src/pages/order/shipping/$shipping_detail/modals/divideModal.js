import React, {useContext, useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import {Table, Form, Input, Modal, Row, Col, Select, InputNumber} from 'antd'
import {Label} from "reactstrap";

const EditableContext = React.createContext(null);

const EditableRow = ({index, ...props}) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
                        title,
                        editable,
                        children,
                        dataIndex,
                        record,
                        handleSave,
                        ...restProps
                      }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({...record, ...values});
    } catch (errInfo) {
      toggleEdit();
      handleSave({...record, finalPrice: 0});
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            // message: `${title} is required.`,
            message: 'Введите суммы',
          },
        ]}
      >
        <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} precision={2} style={{width: '100%'}}/>
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          textAlign: 'right'
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const modal = ({
                 expenseDivideList, expenseDivide, isBtnDisabled, onChange,
                 ...modalDivideProps
               }) => {
  const [form] = Form.useForm()
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const handleSave = (row) => {
    const newData = [...expenseDivideList];
    const index = newData.findIndex((item) => row.ownerId === item.ownerId);
    const item = newData[index];
    newData.splice(index, 1, {...item, ...row});

    onChange(newData);
  };
  const cols = [
    {
      title: 'Нр. рейса',
      dataIndex: 'shippingNum',
      key: 'shippingNum',
    },
    {
      title: 'Нр. заказа',
      dataIndex: 'orderNum',
      key: 'orderNum',
    },
    {
      title: 'Клиент',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Груз',
      dataIndex: 'cargoName',
      key: 'cargoName',
    },
    {
      title: 'Вес',
      dataIndex: 'weight',
      key: 'weight',
      align: 'right'
    },
    {
      title: 'Объём',
      dataIndex: 'capacity',
      key: 'capacity',
      align: 'right'
    },
    {
      title: 'Упаковки',
      dataIndex: 'packageAmount',
      key: 'packageAmount',
      align: 'right'
    },
    {
      title: 'Сумма',
      dataIndex: 'finalPrice',
      key: 'finalPrice',
      editable: true,
      width: '15%'
    },
  ];
  const columns = cols.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });
  const handleTypeChange = (type) => {
    form.setFieldsValue({selectedId: type})
    const newData = [];
    switch (type) {
      case 1:
        expenseDivideList.forEach(divide => {
          let price = (divide.weight / expenseDivide.totalWeight) * expenseDivide.expensePrice;
          newData.push({...divide, finalPrice: price.toFixed(2)})
        })
        break;
      case 2:
        expenseDivideList.forEach(divide => {
          let price = (divide.capacity / expenseDivide.totalCapacity) * expenseDivide.expensePrice;
          newData.push({...divide, finalPrice: price.toFixed(2)})
        })
        break;
      case 3:
        expenseDivideList.forEach(divide => {
          newData.push({...divide, finalPrice: (expenseDivide.expensePrice / expenseDivideList.length).toFixed(2)})
        })
        break;
      case 4:
        expenseDivideList.forEach(divide => {
          newData.push({...divide, finalPrice: 0})
        })
        break;
      default:
        break;
    }
    onChange(newData);
  }

  return (
    <Modal {...modalDivideProps} okButtonProps={{disabled: isBtnDisabled}} okText={"Разбить"} cancelText={"Отмена"}>
      <Form form={form} initialValues={{...expenseDivide}}>
        <Row>
          <Col span={8} key={"expensePrice"}><Label>Разбить данный расход по связанным заказам</Label>
            <Form.Item key={'expensePrice'} name={'expensePrice'}>
              <Input disabled={true}/>
            </Form.Item>
          </Col>
          <Col span={6}><Label>Тип</Label>
            <Form.Item key={'typeId'} name={'typeId'}>
              <Select placeholder='выберите тип' onChange={handleTypeChange}>
                <Select.Option key={'weight'} value={1}>По весу</Select.Option>
                <Select.Option key={'capacity'} value={2}>По объёму</Select.Option>
                <Select.Option key={'proportionally'} value={3}>Пропорционально</Select.Option>
                <Select.Option key={'manually'} value={4}>Ручной</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item key={'selectedId'} name={'selectedId'} hidden={true}><Input/></Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table size="middle" style={{marginBottom: '20px'}} rowKey={record => record.ownerId} pagination={false}
                   components={components}
                   rowClassName={() => 'editable-row'}
                   bordered
                   dataSource={expenseDivideList}
                   columns={columns}
            />
          </Col>
        </Row>
      </Form>
    </Modal>)
};

modal.propTypes = {
  expenseDivide: PropTypes.object
};

export default (modal);
