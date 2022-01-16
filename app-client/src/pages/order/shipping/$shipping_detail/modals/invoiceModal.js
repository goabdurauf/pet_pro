import React from 'react'
import PropTypes from 'prop-types'
import {Col, Form, Input, Modal, Row, Select, InputNumber, Typography} from 'antd'
import {Label} from "reactstrap";

const modal = ({ currentItem, isBtnDisabled, handleSubmit, currencyList, headerText,
                 ...modalProps }) => {
  const [form] = Form.useForm()
  function handleFormSubmit (values) {
    handleSubmit(values);
  }
  function handleSave () {
    form.submit()
  }
  function handleChangeForm (changedValues, allValues) {
    // if (onFormValuesChange) onFormValuesChange(changedValues, allValues)
  }
  const getPrice = (event) => {
    let price = document.getElementById("price").value; //event.target.value;
    let rate = document.getElementById("rate").value;
    form.setFieldsValue({finalPrice: price / (rate !== '' && rate !== null ? rate : 1)});
  }

  return (<Modal {...modalProps} onOk={handleSave} okButtonProps={{disabled: isBtnDisabled}} okText={"Добавить"} cancelText={"Отмена"}>
    <Form form={form} initialValues={currentItem !== null ? currentItem : ''} onFinish={handleFormSubmit} onValuesChange={handleChangeForm}>
      <Row>
        <Col span={24} >
          <Typography.Title level={5} className={'invoice-header'}>{headerText}</Typography.Title>
        </Col>
      </Row>
      <Row>
        <Col span={12}><Label>Расход (Цена)</Label>
          <Form.Item key={'price'} name={'price'} rules={[{required: true, message: 'Введите цену'}]}>
            <Input placeholder='цена' onChange={getPrice} />
          </Form.Item>
        </Col>
        <Col span={12}><Label>Валюта</Label>
          <Form.Item key={'currencyId'} name={'currencyId'} rules={[{required: true, message: 'Выберите валюту'}]}>
            <Select placeholder='валюта'>
              {currencyList.map(currency => <Select.Option key={currency.id} value={currency.id}>{currency.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}><Label>Курс</Label>
          <Form.Item key={'rate'} name={'rate'} rules={[{required: true, message: 'Введите курса'}]} >
            <InputNumber placeholder='курс' onChange={getPrice} precision={4} />
          </Form.Item>
        </Col>
        <Col span={12}><Label>Конечное цена (USD)</Label>
          <Form.Item key={'finalPrice'} name={'finalPrice'} rules={[{required: true, message: 'Введите конечную цену'}]}>
            <InputNumber placeholder='конечное цена' precision={2} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} key={'comment'}><Label>Комментарии</Label>
          <Form.Item key={'comment'} name={'comment'}>
            <Input placeholder='комментарии'/>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </Modal>)
};

modal.propTypes = {
  currentItem: PropTypes.object,
  handleSubmit: PropTypes.func
};

export default (modal);
