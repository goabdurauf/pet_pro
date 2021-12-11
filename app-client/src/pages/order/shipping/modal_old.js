import React from 'react'
import PropTypes from 'prop-types'
import {Col, DatePicker, Form, Input, Modal, Row, Select, InputNumber, TreeSelect, Typography} from 'antd'
import {Label} from "reactstrap";
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';

const modal = ({ currentItem, isBtnDisabled, handleSubmit, managerList, carrierList, shipTypeList, currencyList, selectOrderList,
                 ...modalProps }) => {
  const [form] = Form.useForm()
  function handleFormSubmit (values) {
    if (values.loadDate !== null && values.loadDate !== undefined && values.loadDate !== '')
      values.loadDate = values.loadDate.format('DD.MM.YYYY HH:mm');

    if (values.loadSendDate !== null && values.loadSendDate !== undefined && values.loadSendDate !== '')
      values.loadSendDate = values.loadSendDate.format('DD.MM.YYYY HH:mm');

    if (values.customArrivalDate !== null && values.customArrivalDate !== undefined && values.customArrivalDate !== '')
      values.customArrivalDate = values.customArrivalDate.format('DD.MM.YYYY HH:mm');

    if (values.customSendDate !== null && values.customSendDate !== undefined && values.customSendDate !== '')
      values.customSendDate = values.customSendDate.format('DD.MM.YYYY HH:mm');

    if (values.unloadArrivalDate !== null && values.unloadArrivalDate !== undefined && values.unloadArrivalDate !== '')
      values.unloadArrivalDate = values.unloadArrivalDate.format('DD.MM.YYYY HH:mm');

    if (values.unloadDate !== null && values.unloadDate !== undefined && values.unloadDate !== '')
      values.unloadDate = values.unloadDate.format('DD.MM.YYYY HH:mm');

    handleSubmit(values);
  }
  function handleSave () {
    form.submit()
  }
  function handleChangeForm (changedValues, allValues) {
    // if (onFormValuesChange) onFormValuesChange(changedValues, allValues)
  }
  const getPrice = (event) => {
    let price = event.target.value;
    let rate = document.getElementById("rate").value;
    form.setFieldsValue({finalPrice: price / (rate !== '' && rate !== null ? rate : 1)})
  }
  const getRate = (event) => {
    let price = document.getElementById("price").value;
    form.setFieldsValue({finalPrice: price / (event !== '' && event !== null ? event : 1)})
  }

  return (<Modal {...modalProps} onOk={handleSave} okButtonProps={{disabled: isBtnDisabled}} okText={"Добавить"} cancelText={"Отмена"}>
    <Form form={form} initialValues={currentItem !== null ? currentItem : ''} onFinish={handleFormSubmit} onValuesChange={handleChangeForm}>
      <Row>
        <Col span={8}><Label>Менеджер</Label>
          <Form.Item key={'managerId'} name={'managerId'} rules={[{required: true, message: 'Выберите менеджера'}]}>
            <Select placeholder='менеджер'>
              {managerList.map(manager => <Select.Option key={manager.id} value={manager.id}>{manager.fullName}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}><Label>Перевозчик</Label>
          <Form.Item key={'carrierId'} name={'carrierId'} rules={[{required: true, message: 'Выберите перевозчика'}]}>
            <Select placeholder='перевозчик'>
              {carrierList.map(carrier => <Select.Option key={carrier.id} value={carrier.id}>{carrier.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}><Label>Тип транспорта</Label>
          <Form.Item key={'shippingTypeId'} name={'shippingTypeId'} rules={[{required: true, message: 'Выберите тип транспорта'}]}>
            <Select placeholder='тип транспорта'>
              {shipTypeList.map(type => <Select.Option key={type.id} value={type.id}>{type.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}><Label>Цена</Label>
          <Form.Item key={'price'} name={'price'} rules={[{required: true, message: 'Введите цену'}]}>
            <Input placeholder='цена' onChange={getPrice} />
          </Form.Item>
        </Col>
        <Col span={6}><Label>Валюта</Label>
          <Form.Item key={'currencyId'} name={'currencyId'} rules={[{required: true, message: 'Выберите валюту'}]}>
            <Select placeholder='валюта'>
              {currencyList.map(currency => <Select.Option key={currency.id} value={currency.id}>{currency.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}><Label>Курс</Label>
          <Form.Item key={'rate'} name={'rate'} rules={[{required: true, message: 'Введите курса'}]} >
            <InputNumber placeholder='курс' onChange={getRate} precision={4} />
          </Form.Item>
        </Col>
        <Col span={6}><Label>Конечное цена (USD)</Label>
          <Form.Item key={'finalPrice'} name={'finalPrice'} rules={[{required: true, message: 'Введите конечную цену'}]}>
            <InputNumber placeholder='конечное цена' precision={2} />
          </Form.Item>
        </Col>
        <Col span={8}><Label>Номер транспорта</Label>
          <Form.Item key={'shippingNum'} name={'shippingNum'} rules={[{required: true, message: 'Введите номер транспорта'}]}>
            <Input placeholder='номер транспорта' />
          </Form.Item>
        </Col>
        <Col span={16}><Label>Грузы</Label>
          <Form.Item key={'cargoList'} name={'cargoList'} rules={[{required: true, message: 'Выберите грузы'}]}>
            <TreeSelect treeData={selectOrderList} treeCheckable={true} />
            {/*<Select placeholder='гурзы'>
                    {selectOrderList.map(order => <Select.Option key={order.id} value={order.id}>{order.num}</Select.Option>)}
                  </Select>*/}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={8} key={'load'} className={'sides'}>
          <Typography.Title level={5}>Место загрузки</Typography.Title>
          <Label>Дата и время загрузки</Label>
          <Form.Item key={'loadDate'} name={'loadDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
          <Label>Станция отправления</Label>
          <Form.Item key={'loadStation'} name={'loadStation'}><Input placeholder='станция'/></Form.Item>
          <Label>Дата и время отправления</Label>
          <Form.Item key={'loadSendDate'} name={'loadSendDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
        </Col>
        <Col span={8} key={'custom'} className={'sides'}>
          <Typography.Title level={5}>Пограничный переход</Typography.Title>
          <Label>Дата и время прибытия</Label>
          <Form.Item key={'customArrivalDate'} name={'customArrivalDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
          <Label>Станция погран перехода</Label>
          <Form.Item key={'customStation'} name={'customStation'}><Input placeholder='станция'/></Form.Item>
          <Label>Дата и время отправления</Label>
          <Form.Item key={'customSendDate'} name={'customSendDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
        </Col>
        <Col span={8} key={'unload'} className={'sides-l'}>
          <Typography.Title level={5}>Место разгрузки</Typography.Title>
          <Label>Дата и время прибытия</Label>
          <Form.Item key={'unloadArrivalDate'} name={'unloadArrivalDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
          <Label>Станция прибытия</Label>
          <Form.Item key={'unloadStation'} name={'unloadStation'}><Input placeholder='станция'/></Form.Item>
          <Label>Дата и время разгрузки</Label>
          <Form.Item key={'unloadDate'} name={'unloadDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
        </Col>
      </Row>
    </Form>
  </Modal>)
};

modal.propTypes = {
  currentItem: PropTypes.object,
  handleSubmit: PropTypes.func,
};

export default (modal);
