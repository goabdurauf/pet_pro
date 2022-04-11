import React from 'react'
import PropTypes from 'prop-types'
import {Col, DatePicker, Button, Form, Input, Modal, Row, Select, InputNumber, TreeSelect, Typography} from 'antd'
import {Label} from "reactstrap";
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';

const modal = ({ currentItem, isBtnDisabled, handleSubmit, managerList, carrierList, shipTypeList, currencyList, selectOrderList, onCancel,
                 setPlanning, transportKindList, transportConditionList, stationList, ...modalProps }) => {
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
  const handlePlanButton = () => {
    setPlanning();
    handleSave();
  }

  return (<Modal {...modalProps} onCancel={onCancel}
                 footer={[
                   <Button key="1" type="dashed" className={'float-left'} onClick={handlePlanButton}
                           disabled={isBtnDisabled || (currentItem && currentItem.statusId === 2)}>Плановой</Button>,
                   <Button key="2" onClick={onCancel}>Отмена</Button>,
                   <Button key="3" type="primary" onClick={handleSave} disabled={isBtnDisabled}>Обычный</Button>
                 ]}>
    <Form form={form} initialValues={currentItem !== null ? currentItem : ''} onFinish={handleFormSubmit} onValuesChange={handleChangeForm}>
      <Row>
        <Col span={8}><Label>Менеджер</Label>
          <Form.Item key={'managerId'} name={'managerId'} rules={[{required: false, message: 'Выберите менеджера'}]}>
            <Select placeholder='менеджер'>
              {managerList.map(manager => <Select.Option key={manager.id} value={manager.id}>{manager.fullName}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}><Label>Перевозчик</Label>
          <Form.Item key={'carrierId'} name={'carrierId'} rules={[{required: false, message: 'Выберите перевозчика'}]}>
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
      </Row>
      <Row>
        <Col span={8} key={'transportKindId'}><Label>Вид транспорта</Label>
          <Form.Item key={'transportKindId'} name={'transportKindId'} rules={[{required: true, message: 'Выберите вид транспорта'}]}>
            <Select placeholder='вид транспорта' showSearch
                    filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
              {transportKindList && transportKindList.map(trKind => <Select.Option key={trKind.id} value={trKind.id}>{trKind.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} key={'transportConditionId'}><Label>Условие транспорта</Label>
          <Form.Item key={'transportConditionId'} name={'transportConditionId'} rules={[{required: true, message: 'Выберите условие транспорта'}]}>
            <Select placeholder='условие транспорта' showSearch
                    filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
              {transportConditionList && transportConditionList.map(trCond => <Select.Option key={trCond.id} value={trCond.id}>{trCond.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>

      </Row>
      <Row>
        <Col span={4}><Label>Цена</Label>
          <Form.Item key={'price'} name={'price'} rules={[{required: false, message: 'Введите цену'}]}>
            <Input placeholder='цена' onChange={getPrice} />
          </Form.Item>
        </Col>
        <Col span={4}><Label>Валюта</Label>
          <Form.Item key={'currencyId'} name={'currencyId'} rules={[{required: false, message: 'Выберите валюту'}]}>
            <Select placeholder='валюта'>
              {currencyList.map(currency => <Select.Option key={currency.id} value={currency.id}>{currency.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={4}><Label>Курс</Label>
          <Form.Item key={'rate'} name={'rate'} rules={[{required: false, message: 'Введите курса'}]} >
            <InputNumber placeholder='курс' onChange={getRate} precision={4} />
          </Form.Item>
        </Col>
        <Col span={6}><Label>Конечное цена (USD)</Label>
          <Form.Item key={'finalPrice'} name={'finalPrice'} rules={[{required: false, message: 'Введите конечную цену'}]}>
            <InputNumber placeholder='конечное цена' precision={2} />
          </Form.Item>
        </Col>
        <Col span={6}><Label>Номер транспорта</Label>
          <Form.Item key={'shippingNum'} name={'shippingNum'} rules={[{required: false, message: 'Введите номер транспорта'}]}>
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
        <Col span={8} key={'comment'}><Label>Комментарии</Label>
          <Form.Item key={'comment'} name={'comment'}>
            <Input placeholder='комментарии'/>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={8} key={'load'} className={'sides'}>
          <Typography.Title level={5}>Место загрузки</Typography.Title>
          <Label>Дата и время загрузки</Label>
          <Form.Item key={'loadDate'} name={'loadDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
          <Label>Станция отправления</Label>
          <Form.Item key={'loadStationId'} name={'loadStationId'}>
            <Select placeholder='станция'>
              {stationList && stationList.map(station => <Select.Option key={station.id} value={station.id}>{station.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
          <Label>Дата и время отправления</Label>
          <Form.Item key={'loadSendDate'} name={'loadSendDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
        </Col>
        <Col span={8} key={'custom'} className={'sides'}>
          <Typography.Title level={5}>Пограничный переход</Typography.Title>
          <Label>Дата и время прибытия</Label>
          <Form.Item key={'customArrivalDate'} name={'customArrivalDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
          <Label>Станция погран перехода</Label>
          <Form.Item key={'customStationId'} name={'customStationId'}>
            <Select placeholder='станция'>
              {stationList && stationList.map(station => <Select.Option key={station.id} value={station.id}>{station.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
          <Label>Дата и время отправления</Label>
          <Form.Item key={'customSendDate'} name={'customSendDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
        </Col>
        <Col span={8} key={'unload'} className={'sides-l'}>
          <Typography.Title level={5}>Место разгрузки</Typography.Title>
          <Label>Дата и время прибытия</Label>
          <Form.Item key={'unloadArrivalDate'} name={'unloadArrivalDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
          <Label>Станция прибытия</Label>
          <Form.Item key={'unloadStationId'} name={'unloadStationId'}>
            <Select placeholder='станция'>
              {stationList && stationList.map(station => <Select.Option key={station.id} value={station.id}>{station.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
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
