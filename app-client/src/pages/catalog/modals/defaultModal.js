import React from 'react'
import PropTypes from 'prop-types'
import {Col, Form, Modal, Row} from 'antd'
import {Label} from "reactstrap";

const modal = ({ currentItem, isBtnDisabled, handleSubmit, itemList,
                 ...modalProps }) => {
  const [form] = Form.useForm()
  function handleFormSubmit (values) {
    if (values.date01 !== null && values.date01 !== undefined && values.date01 !== '')
      values.date01 = values.date01.format('DD.MM.YYYY');

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
      <Row> {itemList.map((item) =>
        <Col span={item.width} key={item.name}>
          <Label>{item.label}</Label>
          <Form.Item key={item.name} name={item.name} rules={item.rules}>
            {item.obj}
          </Form.Item>
        </Col>
      )}</Row>
    </Form>
  </Modal>)
};

modal.propTypes = {
  currentItem: PropTypes.object,
  handleSubmit: PropTypes.func
};

export default (modal);
