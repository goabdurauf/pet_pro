import React from 'react'
import PropTypes from 'prop-types'
import {Col, DatePicker, Form, Input, Modal, Row, Upload, Button, Select} from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import {Label} from "reactstrap";
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';

const modal = ({ currentItem, isBtnDisabled, handleSubmit, customRequest, uploadChange, loadingFile, cargoSelectList,
                 documentAttachments, ...modalProps }) => {
  const [form] = Form.useForm()
  function handleFormSubmit (values) {
    if (values.date !== null && values.date !== undefined && values.date !== '')
      values.date = values.date.format('DD.MM.YYYY HH:mm:ss');

    handleSubmit(values);
  }
  function handleSave () {
    form.submit()
  }
  function handleChangeForm (changedValues, allValues) {
    // if (onFormValuesChange) onFormValuesChange(changedValues, allValues)
  }

  return (<Modal {...modalProps} onOk={handleSave} okButtonProps={{disabled: isBtnDisabled}} okText={"Добавить"} cancelText={"Отмена"}>
    <Form form={form} initialValues={currentItem !== null ? currentItem : ''} onFinish={handleFormSubmit} onValuesChange={handleChangeForm}>
      <Row>
        <Col span={12} key={'title'}><Label>Название документа</Label>
          <Form.Item key={'title'} name={'title'} rules={[{required: true, message: 'Введите название документа'}]}>
            <Input placeholder='название документа'/>
          </Form.Item>
        </Col>
        <Col span={12} key={'date'}><Label>Дата документа</Label>
          <Form.Item key={'date'} name={'date'} rules={[{required: true, message: 'Выберите дату'}]}>
            <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          </Form.Item>
        </Col>
        <Col span={12} key={'commet'}><Label>Комментарии</Label>
          <Form.Item key={'comment'} name={'comment'}>
            <Input placeholder='комментарии'/>
          </Form.Item>
        </Col>
        <Col span={12} key={'ownerId'}><Label>Груз</Label>
          <Form.Item key={'ownerId'} name={'ownerId'} rules={[{required: true, message: 'Выберите груза'}]}>
            <Select placeholder='груз' >
              {cargoSelectList && cargoSelectList.map(cargo => <Select.Option key={cargo.id} value={cargo.id}>{cargo.num} - {cargo.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} >
          <div className={'uploads'}>
            <Upload fileList={documentAttachments} onChange={uploadChange} customRequest={customRequest}>
              <Button icon={<UploadOutlined />} loading={loadingFile}>Закрепить файл</Button>
            </Upload>
          </div>
        </Col>
      </Row>
    </Form>
  </Modal>)
};

modal.propTypes = {
  currentItem: PropTypes.object,
  handleSubmit: PropTypes.func,
  customRequest: PropTypes.func,
  uploadChange: PropTypes.func,
};

export default (modal);
