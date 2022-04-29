import React from 'react'
import PropTypes from 'prop-types'
import {Col, Form, Input, Modal, Row} from 'antd'
import {Label} from "reactstrap";

const modal = ({ currentItem, isBtnDisabled, handleSubmit, ...modalProps }) => {
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

  return (<Modal {...modalProps} onOk={handleSave} okButtonProps={{disabled: isBtnDisabled}} okText={"Показать"} cancelText={"Отмена"}>
    <Form form={form} initialValues={currentItem !== null ? currentItem : ''} onFinish={handleFormSubmit} onValuesChange={handleChangeForm}>
      <Row>
        <Col span={24} key={'days'}><Label>Активных дней</Label>
          <Form.Item key={'days'} name={'days'} rules={[{required: true, message: 'Введите дней'}]}>
            <Input type={'number'}/>
          </Form.Item>
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
