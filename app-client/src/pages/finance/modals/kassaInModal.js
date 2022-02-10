import React from 'react'
import PropTypes from 'prop-types'
import {Col, Form, Input, Modal, Row, Select, InputNumber, DatePicker, notification} from 'antd'
import {Label} from "reactstrap";
import 'moment/locale/ru';
import locale from "antd/es/date-picker/locale/ru_RU";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

const modal = ({ currentItem, isBtnDisabled, handleSubmit, currencyList, clientList, kassaList, agentList, carrierList, kassaInType, invoiceList, getClientInvoices,
                 handleInTypeChange, handleDocumentChange, setClient, clientId, setCurrency, currencyId, ...modalProps }) => {
  const [form] = Form.useForm()
  function handleFormSubmit (values) {
    if (values.kassaType === 101 && values.finalPrice !== currentItem.totalCredit) {
      notification.error({
        description: "Сумма итог получение должно бить равно к сумма договора",
        placement: 'topRight',
        duration: 3,
        style: {backgroundColor: '#ffd9d9'}
      });
      return;
    }
    if (values.kassaType !== 101)
      values.invoices = [];
    if (values.date !== undefined && values.date !== '')
      values.date = values.date.format('DD.MM.YYYY HH:mm:ss');
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
    handleInTypeChange(val)
  }
  const handleClient = (id) => {
    setClient(id)
  }
  const handleKassa = (val) => {
    kassaList.forEach(item => {
      if (item.id === val)
        form.setFieldsValue({currencyInId: item.currencyId});
    })
  }
  const handleCurrency = (val) => {
    setCurrency(val)
  }
  const handleDocument = (id, index) => {
    let sum = 0;
    invoiceList.forEach(item => { if (item.id === id) sum = item.finalPrice; })
    let invoices = currentItem.invoices;
    invoices[index] = {...invoices[index], debit: sum};
    let totalDebit = 0;
    invoices.forEach(item => {totalDebit += item.debit ? item.debit : 0;})
    handleDocumentChange({...currentItem, invoices: invoices, totalDebit: totalDebit})
  }
  const removeItem = (index) => {
    let invoices = currentItem.invoices;
    let totalDebit = 0;
    let totalCredit = 0;
    invoices.splice(index, 1);
    invoices.forEach(item => {
      totalDebit += item.debit ? item.debit : 0;
    });
    for (let i = 0; i < invoices.length + 1; i++) {
      if (i !== index)
        totalCredit += Number(document.getElementById("invoices_" + i + "_credit").value);
    }
    handleDocumentChange({...currentItem, invoices: invoices, totalDebit: totalDebit, totalCredit: totalCredit});
  }
  const handleCreditChange = (item) => {
    let totalCredit = 0;
    currentItem.invoices.forEach((item, index) => {
      totalCredit += Number(document.getElementById("invoices_" + index + "_credit").value);
    });
    handleDocumentChange({...currentItem, totalCredit: totalCredit})
  }

  return (<Modal {...modalProps} onOk={handleSave} okButtonProps={{disabled: isBtnDisabled}} okText={"Добавить"} cancelText={"Отмена"}>
    <Form form={form} initialValues={currentItem !== null ? currentItem : ''} onFinish={handleFormSubmit} onValuesChange={handleChangeForm}>
      <Row>
        <Col span={8} key={'kassaType'}><Label>Источник</Label>
          <Form.Item key={'kassaType'} name={'kassaType'} rules={[{required: true, message: 'Выберите источника'}]}>
            <Select placeholder='источник' onChange={handleInType}>
              <Select.Option key={101} value={101}>От клиента</Select.Option>
              <Select.Option key={102} value={102}>Прочие контрагенты</Select.Option>
              <Select.Option key={103} value={103}>Перевозчик (возврат)</Select.Option>
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
        {( kassaInType === 101 ) && <Col span={8} key={'clientId'}><Label>Клиент</Label>
          <Form.Item key={'clientId'} name={'clientId'} rules={[{required: true, message: 'Выберите клиента'}]}>
            <Select placeholder='клиент' onChange={handleClient}>
              {clientList && clientList.map(client => <Select.Option key={client.id} value={client.id}>{client.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>}
        {kassaInType === 102 && <Col span={8} key={'agentId'}><Label>Контрагент</Label>
          <Form.Item key={'agentId'} name={'agentId'} rules={[{required: true, message: 'Выберите контрагента'}]}>
            <Select placeholder='контрагент'>
              {agentList && agentList.map(agent => <Select.Option key={agent.id} value={agent.id}>{agent.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>}
        {kassaInType === 103 && <Col span={8} key={'carrierId'}><Label>Перевозчик</Label>
          <Form.Item key={'carrierId'} name={'carrierId'} rules={[{required: true, message: 'Выберите перевозчика'}]}>
            <Select placeholder='перевозчик'>
              {carrierList && carrierList.map(carrier => <Select.Option key={carrier.id} value={carrier.id}>{carrier.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>}
        <Col span={8} key={'kassaId'}><Label>Касса</Label>
          <Form.Item key={'kassaId'} name={'kassaId'} rules={[{required: true, message: 'Выберите кассу'}]}>
            <Select placeholder='касса' onChange={handleKassa} disabled={kassaInType === 0}>
              {kassaList && kassaList.map(kassa => <Select.Option key={kassa.id} value={kassa.id}>{kassa.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} key={'comment'}><Label>Комментарии</Label>
          <Form.Item key={'comment'} name={'comment'}>
            <Input placeholder='комментарии'/>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={6}><Label>Сумма получение</Label>
          <Form.Item key={'price'} name={'price'} rules={[{required: true, message: 'Введите цену'}]}>
            <Input placeholder='цена' onChange={getPrice} />
          </Form.Item>
        </Col>
        <Col span={4}><Label>Валюта</Label>
          <Form.Item key={'currencyInId'} name={'currencyInId'}>
            <Select placeholder='валюта' disabled={true}>
              {currencyList.map(currency => <Select.Option key={currency.id} value={currency.id}>{currency.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={4}><Label>Курс</Label>
          <Form.Item key={'rate'} name={'rate'} rules={[{required: true, message: 'Введите курса'}]} >
            <InputNumber placeholder='курс' onChange={getPrice} precision={4} />
          </Form.Item>
        </Col>
        <Col span={6}><Label>Сумма договора</Label>
          <Form.Item key={'finalPrice'} name={'finalPrice'} rules={[{required: true, message: 'Введите конечную цену'}]}>
            <InputNumber placeholder='конечное цена' precision={2} />
          </Form.Item>
        </Col>
        <Col span={4}><Label>Валюта</Label>
          <Form.Item key={'currencyId'} name={'currencyId'} rules={[{required: true, message: 'Выберите валюту'}]}>
            <Select placeholder='валюта' onChange={handleCurrency}>
              {currencyList.map(currency => <Select.Option key={currency.id} value={currency.id}>{currency.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {( kassaInType === 101 ) && <Row>
        <Col span={24} key={'invoices'} id={'invoices'} className={'invoices'}>
          <Row className={'invoicesHeader'}>
            <Col span={10}>Документ</Col>
            <Col span={6}>Сумма долга </Col>
            <Col span={6}>Сумма получение</Col>
          </Row>
          <Form.List name={'invoices'}>
            {(fields, { add, remove }) =>
              fields.map((field, index) => (
                <Row key={field.key}>
                  <Col span={10}>
                    <Form.Item name={[index, 'invoiceId']} rules={[{ required: true, message: 'Выберите счёта' }]}>
                      <Select placeholder='выписанный счёт' onChange={(item) => handleDocument(item, index)}>
                        {invoiceList && invoiceList.map(invoice => <Select.Option key={invoice.id} value={invoice.id}>{invoice.name} - {invoice.shipNum}</Select.Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                      <div className="debit-summa">{currentItem && currentItem.invoices && currentItem.invoices.length > index
                        ? currentItem.invoices[index].debit : '0'}</div>
                  </Col>
                  <Col span={6}>
                    <Form.Item name={[index, 'credit']} rules={[{ required: true, message: 'Введите сумму' }]}>
                      <Input placeholder="сумма" onChange={handleCreditChange} />
                    </Form.Item>
                  </Col>
                  <Col span={1} className={'text-center'}>
                    {fields.length > 1 ? <MinusCircleOutlined onClick={() => {remove(index); removeItem(index)}} style={{color: 'red'}}/> : ''}
                  </Col>
                  <Col span={1}>
                    {index === fields.length-1 ? <PlusOutlined onClick={() => add()} /> : ''}
                  </Col>
                </Row>
              ))
            }
          </Form.List>
        </Col>
        <Col span={6} offset={10}><Label>Итог долга</Label>
          <div className="debit-summa">{currentItem && currentItem.totalDebit ? currentItem.totalDebit.toFixed(2) : '0'}</div>
        </Col>
        <Col span={6}><Label>Итог получение</Label>
          <div className="debit-summa">{currentItem && currentItem.totalCredit ? currentItem.totalCredit.toFixed(2) : '0'}</div>
        </Col>
      </Row> }
    </Form>
  </Modal>)
};

modal.propTypes = {
  currentItem: PropTypes.object,
  handleSubmit: PropTypes.func
};

export default (modal);
