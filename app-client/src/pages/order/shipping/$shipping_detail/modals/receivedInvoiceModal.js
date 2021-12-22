import React from 'react'
import PropTypes from 'prop-types'
import {Col, Form, Input, Modal, Row, Select, InputNumber} from 'antd'
import {Label} from "reactstrap";

const modal = ({ currentItem, isBtnDisabled, handleSubmit, currencyList,
                 ...modalProps }) => {
  const [form] = Form.useForm()
  function handleFormSubmit (values) {
    // handleSubmit(values);
  }
  function handleSave () {
    form.submit()
  }
  function handleChangeForm (changedValues, allValues) {
    // if (onFormValuesChange) onFormValuesChange(changedValues, allValues)
  }
  const getPrice = (event) => {
    let price = document.getElementById(event + "Price").value; //event.target.value;
    let rate = document.getElementById(event + "Rate").value;
    event === 'from'
      ? form.setFieldsValue({fromFinalPrice: price / (rate !== '' && rate !== null ? rate : 1)})
      : form.setFieldsValue({toFinalPrice: price / (rate !== '' && rate !== null ? rate : 1)});
  }

  return (<Modal {...modalProps} onOk={handleSave} okButtonProps={{disabled: isBtnDisabled}} okText={"Добавить"} cancelText={"Отмена"}>
    <Form form={form} initialValues={currentItem !== null ? currentItem : ''} onFinish={handleFormSubmit} onValuesChange={handleChangeForm}>
      <Row>
        <Col span={12}><Label>Расход (Цена)</Label>
          <Form.Item key={'toPrice'} name={'toPrice'} rules={[{required: true, message: 'Введите цену'}]}>
            <Input placeholder='цена' onChange={() => getPrice('to')} />
          </Form.Item>
        </Col>
        <Col span={12}><Label>Валюта</Label>
          <Form.Item key={'toCurrencyId'} name={'toCurrencyId'} rules={[{required: true, message: 'Выберите валюту'}]}>
            <Select placeholder='валюта'>
              {currencyList.map(currency => <Select.Option key={currency.id} value={currency.id}>{currency.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}><Label>Курс</Label>
          <Form.Item key={'toRate'} name={'toRate'} rules={[{required: true, message: 'Введите курса'}]} >
            <InputNumber placeholder='курс' onChange={() => getPrice('to')} precision={4} />
          </Form.Item>
        </Col>
        <Col span={12}><Label>Конечное цена (USD)</Label>
          <Form.Item key={'toFinalPrice'} name={'toFinalPrice'} rules={[{required: true, message: 'Введите конечную цену'}]}>
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
