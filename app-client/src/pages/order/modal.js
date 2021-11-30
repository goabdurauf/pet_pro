import React from 'react'
import PropTypes from 'prop-types'
import {Col, Form, Modal, Row} from 'antd'
import {Label} from "reactstrap";

const modal = ({ formItems, isBtnDisabled, handleSubmit,
                 ...modalProps }) => {
  const [form] = Form.useForm()
  function handleSave () {
    form.submit()
  }

  return (<Modal {...modalProps} onOk={handleSave} okText={"Поиск"} cancelText={"Отмена"}>
    <Form form={form} name="searchForm" >
      <Row> {formItems.map((item) =>
        <Col span={item.width} key={item.name}>
          <Label>{item.label}</Label>
          <Form.Item key={item.name} name={item.name}>{item.obj}</Form.Item>
        </Col>
      )}</Row>
    </Form>
  </Modal>)
};

modal.propTypes = {
  handleSubmit: PropTypes.func
};

export default (modal);
