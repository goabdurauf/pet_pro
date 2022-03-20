import React from 'react'
import PropTypes from 'prop-types'
import {Col, Form, Input, Modal, Row, Upload, Button, Select} from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import {Label} from "reactstrap";

const modal = ({ currentItem, isBtnDisabled, handleSubmit, customRequest, uploadChange, loadingFile, measureList,
                 productAttachments, ...modalProps }) => {
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

  return (<Modal {...modalProps} onOk={handleSave} okButtonProps={{disabled: isBtnDisabled}} okText={"Добавить"} cancelText={"Отмена"}>
    <Form form={form} initialValues={currentItem !== null ? currentItem : ''} onFinish={handleFormSubmit} onValuesChange={handleChangeForm}>
      <Row>
        <Col span={24} key={'name'}><Label>Таможенная названия</Label>
          <Form.Item key={'name'} name={'name'} rules={[{required: true, message: 'Этот поля не должно быть пустое'}]}>
            <Input placeholder='таможенная названия'/>
          </Form.Item>
        </Col>
        <Col span={12} key={'code'}><Label>HS CODE</Label>
          <Form.Item key={'code'} name={'code'} rules={[{required: true, message: 'Этот поля не должно быть пустое'}]}>
            <Input placeholder='HS CODE'/>
          </Form.Item>
        </Col>
        <Col span={12} key={'measureId'}><Label>Единица измерение</Label>
          <Form.Item key={'measureId'} name={'measureId'} rules={[{required: true, message: 'Этот поля не должно быть пустое'}]}>
            <Select placeholder='единица измерение' showSearch
                    filterOption={(input, option) =>
                      option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
              {measureList && measureList.map(measure => <Select.Option key={measure.id} value={measure.id}>{measure.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} >
          <div className={'uploads'}>
            <Upload fileList={productAttachments} onChange={uploadChange} customRequest={customRequest}>
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
