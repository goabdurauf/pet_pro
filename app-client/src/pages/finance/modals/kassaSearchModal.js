import React from 'react'
import PropTypes from 'prop-types'
import {Col, DatePicker, Form, Modal, Row, Select} from 'antd'
import {Label} from "reactstrap";
import locale from "antd/es/date-picker/locale/ru_RU";

const searchModal = ({ handleSubmit, searchParams, handleInTypeChange, kassaType, clientList, carrierList, agentList, otherExpenseList, kassaList,
                 ...modalProps }) => {
  const [form] = Form.useForm()
  function handleFormSubmit (values) {
    handleSubmit(values);
  }
  function handleSave () {
    form.submit()
  }
  const handleInType = (val) => {
    handleInTypeChange(val)
  }

  return (<Modal {...modalProps} onOk={handleSave} okText={"Поиск"} cancelText={"Отмена"}>
    <Form form={form} name="searchForm" initialValues={searchParams} onFinish={handleFormSubmit}>
      <Row>
        <Col span={8} key={'kassaType'}><Label>Вид операции</Label>
          <Form.Item key={'kassaType'} name={'kassaType'} rules={[{required: true, message: 'Выберите вид операции'}]}>
            <Select placeholder='вид операции' onChange={handleInType}>
              <Select.Option key={100} value={100}>Поступление</Select.Option>
              <Select.Option key={200} value={200}>Расход</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        {( kassaType < 200 ) && <Col span={8} key={'kassaInType'}><Label>Источник</Label>
          <Form.Item key={'kassaInType'} name={'kassaInType'}>
            <Select allowClear placeholder='источник' onChange={handleInType}>
              <Select.Option key={101} value={101}>От клиента</Select.Option>
              <Select.Option key={102} value={102}>Прочие контрагенты</Select.Option>
              <Select.Option key={103} value={103}>Перевозчик (возврат)</Select.Option>
            </Select>
          </Form.Item>
        </Col> }
        {( kassaType > 199 ) && <Col span={8} key={'kassaOutType'}><Label>Источник</Label>
          <Form.Item key={'kassaOutType'} name={'kassaOutType'}>
            <Select allowClear placeholder='источник' onChange={handleInType}>
              <Select.Option key={201} value={201}>Перевозчик</Select.Option>
              <Select.Option key={202} value={202}>Возврат клиенту</Select.Option>
              <Select.Option key={203} value={203}>Прочие расходы</Select.Option>
            </Select>
          </Form.Item>
        </Col> }
        {( kassaType === 101 || kassaType === 202 ) && <Col span={8} key={'clientId'}><Label>Клиент</Label>
          <Form.Item key={'clientId'} name={'clientId'}>
            <Select allowClear placeholder='клиент'>
              {clientList && clientList.map(client => <Select.Option key={client.id} value={client.id}>{client.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>}
        {( kassaType === 103 || kassaType === 201 ) && <Col span={8} key={'carrierId'}><Label>Перевозчик</Label>
          <Form.Item key={'carrierId'} name={'carrierId'}>
            <Select allowClear placeholder='перевозчик'>
              {carrierList && carrierList.map(carrier => <Select.Option key={carrier.id} value={carrier.id}>{carrier.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>}
        {kassaType === 102 && <Col span={8} key={'agentId'}><Label>Контрагент</Label>
          <Form.Item key={'agentId'} name={'agentId'}>
            <Select allowClear placeholder='контрагент'>
              {agentList && agentList.map(agent => <Select.Option key={agent.id} value={agent.id}>{agent.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>}
        {kassaType === 203 && <Col span={8} key={'agentId'}><Label>Прочие расходы</Label>
          <Form.Item key={'agentId'} name={'agentId'}>
            <Select allowClear placeholder='прочие расходы'>
              {otherExpenseList && otherExpenseList.map(expense => <Select.Option key={expense.id} value={expense.id}>{expense.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>}
      </Row>
      <Row>
        <Col span={8} key={'kassaId'}><Label>Касса</Label>
          <Form.Item key={'kassaId'} name={'kassaId'}>
            <Select allowClear placeholder='касса'>
              {kassaList && kassaList.map(kassa => <Select.Option key={kassa.id} value={kassa.id}>{kassa.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} key={'start'}><Label>Начальная дата</Label>
          <Form.Item key={'start'} name={'start'}>
            <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          </Form.Item>
        </Col>
        <Col span={8} key={'end'}><Label>Конечная дата</Label>
          <Form.Item key={'end'} name={'end'}>
            <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </Modal>)
};

searchModal.propTypes = {
  handleSubmit: PropTypes.func
};

export default (searchModal);
