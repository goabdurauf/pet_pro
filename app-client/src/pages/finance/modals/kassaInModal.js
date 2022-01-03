import React from 'react'
import PropTypes from 'prop-types'
import {Col, Form, Input, Modal, Row, Select, InputNumber, DatePicker} from 'antd'
import {Label} from "reactstrap";
import 'moment/locale/ru';
import locale from "antd/es/date-picker/locale/ru_RU";

const modal = ({ currentItem, isBtnDisabled, handleSubmit, currencyList,
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
  const handleInType = (val) => {
    console.log(val)
  }

  return (<Modal {...modalProps} onOk={handleSave} okButtonProps={{disabled: isBtnDisabled}} okText={"Добавить"} cancelText={"Отмена"}>
    <Form form={form} initialValues={currentItem !== null ? currentItem : ''} onFinish={handleFormSubmit} onValuesChange={handleChangeForm}>
      <Row>
        <Col span={8} key={'kassaInType'}><Label>Источник</Label>
          <Form.Item key={'kassaInType'} name={'kassaInType'} rules={[{required: false, message: 'Выберите источника'}]}>
            <Select placeholder='источник' onChange={handleInType}>
              <Select.Option key={1} value={1}>От клиента</Select.Option>
              <Select.Option key={2} value={2}>Прочие контрагенты</Select.Option>
              <Select.Option key={3} value={3}>Перевозчик (возврат)</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} key={'num'}><Label>Номер</Label>
          <Form.Item key={'num'} name={'num'} rules={[{required: true, message: 'Введите номера'}]}>
            <Input placeholder='номер'/>
          </Form.Item>
        </Col>
        <Col span={8} key={'date'}><Label>Дата</Label>
          <Form.Item key={'date'} name={'date'} rules={[{required: true, message: 'Выберите дату'}]}>
            <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}><Label>Расход (Цена)</Label>
          <Form.Item key={'price'} name={'price'} rules={[{required: true, message: 'Введите цену'}]}>
            <Input placeholder='цена' onChange={getPrice} />
          </Form.Item>
        </Col>
        <Col span={12}><Label>Валюта1</Label>
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
