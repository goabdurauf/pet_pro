import React from 'react'
import PropTypes from 'prop-types'
import {Col, Form, Modal, Row} from 'antd'
import {Label} from "reactstrap";

const searchModal = ({ formItems, handleSubmit, searchParams,
                 ...modalProps }) => {
  const [form] = Form.useForm()
  function handleFormSubmit (values) {
    handleSubmit(values);
  }
  function handleSave () {
    form.submit()
  }

  return (<Modal {...modalProps} onOk={handleSave} okText={"Поиск"} cancelText={"Отмена"}>
    <Form form={form} name="searchForm" initialValues={searchParams} onFinish={handleFormSubmit}>
      <Row> {formItems.map((item) =>
        <Col span={item.width} key={item.name}>
          <Label>{item.label}</Label>
          <Form.Item key={item.name} name={item.name}>{item.obj}</Form.Item>
        </Col>
      )}</Row>
    </Form>
  </Modal>)
};

searchModal.propTypes = {
  handleSubmit: PropTypes.func
};

export default (searchModal);
