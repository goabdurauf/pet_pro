import React, { useState } from 'react'
import { Button, Dropdown, Empty, Form, Input, List, Menu, Modal, Popconfirm, Skeleton, Typography } from 'antd'


// https://github.com/8iq/nodejs-hackathon-boilerplate-starter-kit/blob/c82e514305bbe4ae77854c8242bc04b1a9736a43/apps/_example05app/containers/FormList.js#L213
function BaseModalForm ({ currentItem, children, visible, cancelModal, isBtnDisabled, setOkBtn, ModalTitleMsg, ModalCancelButtonLabelMsg,
  ModalSaveButtonLabelMsg }) {

  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)

  function handleFormSubmit (values) {
    setOkBtn();
    console.log(values)
  }

  function handleSave () {
    form.submit()
  }

  function handleChangeForm (changedValues, allValues) {
    console.log(changedValues);
    console.log(allValues);
    // if (onFormValuesChange) onFormValuesChange(changedValues, allValues)
  }

  return (<Modal
    title={ModalTitleMsg || ''}
    visible={visible}
    onCancel={cancelModal}
    footer={[
      <Button key="cancel" onClick={cancelModal}>{ModalCancelButtonLabelMsg || 'CancelMsg'}</Button>,
      <Button key="submit" onClick={handleSave} type="primary" loading={isLoading} disabled={isBtnDisabled}>
        {ModalSaveButtonLabelMsg || 'SaveMsg'}
      </Button>,
    ]}
  >
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFormSubmit}
      initialValues={currentItem !== null ? currentItem : ''}
      onValuesChange={handleChangeForm}
    >
      <Form.Item className='ant-non-field-error' name="rate"><Input/></Form.Item>
      {children}
    </Form>
  </Modal>)
}

export {BaseModalForm}
