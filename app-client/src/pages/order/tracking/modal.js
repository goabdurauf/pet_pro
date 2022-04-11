import React from 'react'
import {Col, DatePicker, Form, Input, Modal, Row, Select} from 'antd'
import {Label} from "reactstrap";
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
import PropTypes from "prop-types";

const modal = ({ currentItem, isBtnDisabled, handleSubmit, factoryAddressList, stationList, chaseStatusList,
                 ...modalProps }) => {
  const [form] = Form.useForm()
  function handleFormSubmit (values) {
    if (values.loadDate !== null && values.loadDate !== undefined && values.loadDate !== '')
      values.loadDate = values.loadDate.format('DD.MM.YYYY HH:mm');
    if (values.docPassDate !== null && values.docPassDate !== undefined && values.docPassDate !== '')
      values.docPassDate = values.docPassDate.format('DD.MM.YYYY HH:mm');
    if (values.loadSendDate !== null && values.loadSendDate !== undefined && values.loadSendDate !== '')
      values.loadSendDate = values.loadSendDate.format('DD.MM.YYYY HH:mm');
    if (values.customArrivalDate !== null && values.customArrivalDate !== undefined && values.customArrivalDate !== '')
      values.customArrivalDate = values.customArrivalDate.format('DD.MM.YYYY HH:mm');
    if (values.customSendDate !== null && values.customSendDate !== undefined && values.customSendDate !== '')
      values.customSendDate = values.customSendDate.format('DD.MM.YYYY HH:mm');
    if (values.containerReturnDate !== null && values.containerReturnDate !== undefined && values.containerReturnDate !== '')
      values.containerReturnDate = values.containerReturnDate.format('DD.MM.YYYY HH:mm');
    if (values.unloadDate !== null && values.unloadDate !== undefined && values.unloadDate !== '')
      values.unloadDate = values.unloadDate.format('DD.MM.YYYY HH:mm');

    handleSubmit(values);
  }
  function handleSave () {form.submit()}
  function handleChangeForm (changedValues, allValues) {
    // if (onFormValuesChange) onFormValuesChange(changedValues, allValues)
  }

  return (<Modal {...modalProps} okButtonProps={{disabled: isBtnDisabled}} onOk={handleSave} okText={"Добавить"} cancelText={"Отмена"}>
    <Form form={form} initialValues={currentItem !== null ? currentItem : ''} onFinish={handleFormSubmit} onValuesChange={handleChangeForm}>
      <Row>
        <Col span={6} key={'shippingNum'}><Label>Номер рейса</Label>
          <Form.Item key={'shippingNum'} name={'shippingNum'}>
            <Input disabled={true}/>
          </Form.Item>
        </Col>
        <Col span={6} key={'transportNum'}><Label>Номер транспорта</Label>
          <Form.Item key={'transportNum'} name={'transportNum'}>
            <Input disabled={true}/>
          </Form.Item>
        </Col>
        <Col span={12} key={'carrierName'}><Label>Перевозчик</Label>
          <Form.Item key={'carrierName'} name={'carrierName'}>
            <Input disabled={true}/>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={6} key={'factoryAddressId'}><Label>Адрес завода</Label>
          <Form.Item key={'factoryAddressId'} name={'factoryAddressId'}>
            <Select placeholder='адрес завода' clearIcon showSearch filterOption={false}>
              {factoryAddressList && factoryAddressList.map(address => <Select.Option key={address.id} value={address.id}>{address.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6} key={'loadStationId'}><Label>Станция отправление</Label>
          <Form.Item key={'loadStationId'} name={'loadStationId'}>
            <Select placeholder='станция отправление' clearIcon showSearch filterOption={false}>
              {stationList && stationList.map(station => <Select.Option key={station.id} value={station.id}>{station.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6} key={'unloadStationId'}><Label>Станция назначение</Label>
          <Form.Item key={'unloadStationId'} name={'unloadStationId'}>
            <Select placeholder='станция назначение' clearIcon showSearch filterOption={false}>
              {stationList && stationList.map(station => <Select.Option key={station.id} value={station.id}>{station.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6} key={'chaseStatusId'}><Label>Статус слежки</Label>
          <Form.Item key={'chaseStatusId'} name={'chaseStatusId'}>
            <Select placeholder='статус слежки' clearIcon showSearch filterOption={false}>
              {chaseStatusList && chaseStatusList.map(status => <Select.Option key={status.id} value={status.id}>{status.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={8} key={'cargoName'}><Label>Наименование груза</Label>
          <Form.Item key={'cargoName'} name={'cargoName'}>
            <Input placeholder='наименование груза'/>
          </Form.Item>
        </Col>
        <Col span={8} key={'kazahNumber'}><Label>Казахстанский номер</Label>
          <Form.Item key={'kazahNumber'} name={'kazahNumber'}>
            <Input placeholder='казахстанский номер'/>
          </Form.Item>
        </Col>
        <Col span={8} key={'currentLocation'}><Label>Текушее местоположение</Label>
          <Form.Item key={'currentLocation'} name={'currentLocation'}>
            <Input placeholder='текушее местоположение'/>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={6} key={'loadDate'}><Label>Дата погрузки</Label>
          <Form.Item key={'loadDate'} name={'loadDate'}>
            <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          </Form.Item>
        </Col>
        <Col span={6} key={'docPassDate'}><Label>Дата передача документа</Label>
          <Form.Item key={'docPassDate'} name={'docPassDate'}>
            <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          </Form.Item>
        </Col>
        <Col span={6} key={'loadSendDate'}><Label>Дата отправки рейса</Label>
          <Form.Item key={'loadSendDate'} name={'loadSendDate'}>
            <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          </Form.Item>
        </Col>
        <Col span={6} key={'customArrivalDate'}><Label>Дата прибытие на тр. порт</Label>
          <Form.Item key={'customArrivalDate'} name={'customArrivalDate'}>
            <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          </Form.Item>
        </Col>
        <Col span={6} key={'customSendDate'}><Label>Дата покидание тр. порта</Label>
          <Form.Item key={'customSendDate'} name={'customSendDate'}>
            <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          </Form.Item>
        </Col>
        <Col span={6} key={'unloadDate'}><Label>Дата прибытия</Label>
          <Form.Item key={'unloadDate'} name={'unloadDate'}>
            <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          </Form.Item>
        </Col>
        <Col span={6} key={'containerReturnDate'}><Label>Дата возврат контейнера</Label>
          <Form.Item key={'containerReturnDate'} name={'containerReturnDate'}>
            <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
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
  handleSubmit: PropTypes.func,
};

export default (modal);
