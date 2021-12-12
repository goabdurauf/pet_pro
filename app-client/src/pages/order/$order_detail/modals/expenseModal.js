import React from 'react'
import PropTypes from 'prop-types'
import {Col, Form, Input, InputNumber, Modal, Row, Select} from 'antd'
import {Label} from "reactstrap";
import 'moment/locale/ru';

const modal = ({ currentItem, isBtnDisabled, handleSubmit, cargoSelectList, carrierList, currencyList, ownerType,
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
    let price = document.getElementById(event + "Price").value; //event.target.value;
    let rate = document.getElementById(event + "Rate").value;
    event === 'from'
      ? form.setFieldsValue({fromFinalPrice: price / (rate !== '' && rate !== null ? rate : 1)})
      : form.setFieldsValue({toFinalPrice: price / (rate !== '' && rate !== null ? rate : 1)});
  }
/*  const getRate = (event) => {
    let price = document.getElementById("price").value;
    form.setFieldsValue({finalPrice: price / (event !== '' && event !== null ? event : 1)})
  }*/

  return (<Modal {...modalProps} onOk={handleSave} okButtonProps={{disabled: isBtnDisabled}} okText={"Добавить"} cancelText={"Отмена"}>
    <Form form={form} initialValues={currentItem !== null ? currentItem : ''} onFinish={handleFormSubmit} onValuesChange={handleChangeForm}>
      <Row>
        <Col span={ownerType === 'Shipping' ? 12 : 8} key={'name'}><Label>Название</Label>
          <Form.Item key={'name'} name={'name'} rules={[{required: true, message: 'Введите название'}]}>
            <Input placeholder='название'/>
          </Form.Item>
        </Col>
        <Col span={ownerType === 'Shipping' ? 12 : 8} key={'carrierId'}><Label>Перевозчик</Label>
          <Form.Item key={'carrierId'} name={'carrierId'} rules={[{required: true, message: 'Выберите перевозчика'}]}>
            <Select placeholder='перевозчик' >
              {carrierList && carrierList.map(carrier => <Select.Option key={carrier.id} value={carrier.id}>{carrier.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        {ownerType !== 'Shipping' && <Col span={8} key={'ownerId'}><Label>Груз</Label>
          <Form.Item key={'ownerId'} name={'ownerId'} rules={[{required: true, message: 'Выберите груза'}]}>
            <Select placeholder='груз' >
              {cargoSelectList && cargoSelectList.map(cargo => <Select.Option key={cargo.id} value={cargo.id}>{cargo.num} - {cargo.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>}
      </Row>
      <Row>
        <Col span={6}><Label>Ставка (Цена)</Label>
          <Form.Item key={'fromPrice'} name={'fromPrice'} rules={[{required: true, message: 'Введите цену'}]}>
            <Input placeholder='цена' onChange={() => getPrice('from')} />
          </Form.Item>
        </Col>
        <Col span={6}><Label>Валюта</Label>
          <Form.Item key={'fromCurrencyId'} name={'fromCurrencyId'} rules={[{required: true, message: 'Выберите валюту'}]}>
            <Select placeholder='валюта'>
              {currencyList.map(currency => <Select.Option key={currency.id} value={currency.id}>{currency.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}><Label>Курс</Label>
          <Form.Item key={'fromRate'} name={'fromRate'} rules={[{required: true, message: 'Введите курса'}]} >
            <InputNumber placeholder='курс' onChange={() => getPrice('from')} precision={4} />
          </Form.Item>
        </Col>
        <Col span={6}><Label>Конечное цена (USD)</Label>
          <Form.Item key={'fromFinalPrice'} name={'fromFinalPrice'} rules={[{required: true, message: 'Введите конечную цену'}]}>
            <InputNumber placeholder='конечное цена' precision={2} />
          </Form.Item>
        </Col>
      </Row>
      <Row className="expense-to-row">
        <Col span={6}><Label>Расход (Цена)</Label>
          <Form.Item key={'toPrice'} name={'toPrice'} rules={[{required: true, message: 'Введите цену'}]}>
            <Input placeholder='цена' onChange={() => getPrice('to')} />
          </Form.Item>
        </Col>
        <Col span={6}><Label>Валюта</Label>
          <Form.Item key={'toCurrencyId'} name={'toCurrencyId'} rules={[{required: true, message: 'Выберите валюту'}]}>
            <Select placeholder='валюта'>
              {currencyList.map(currency => <Select.Option key={currency.id} value={currency.id}>{currency.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}><Label>Курс</Label>
          <Form.Item key={'toRate'} name={'toRate'} rules={[{required: true, message: 'Введите курса'}]} >
            <InputNumber placeholder='курс' onChange={() => getPrice('to')} precision={4} />
          </Form.Item>
        </Col>
        <Col span={6}><Label>Конечное цена (USD)</Label>
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
