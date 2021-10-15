import React from 'react'
import PropTypes from 'prop-types'
import {Form, Input, InputNumber, Radio, Modal, Cascader, Switch, Icon, Tabs, Col, Row} from 'antd'
import {Label} from "reactstrap";
// import moment from 'moment';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 24,
  },
};

const modal = ({
                 item = {},
                 onOk,
                 handleChangeEditor,
                 form: {
                   getFieldDecorator,
                   validateFields,
                   getFieldsValue,
                 },
                 formItems,
                 pathname,
                 languages,
                 payNumberId,
                 descriptionUz,
                 descriptionEn,
                 modalType,
                 dispatch,
                 ...modalProps
               }) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let formData = getFieldsValue();
      console.log(formData);

      let obj = {};
      Object.keys(formData).forEach((key) => {
        if (typeof obj[key.split("#")[0]] === 'undefined' && typeof key.split("#")[1] !== 'undefined') {
          obj[key.split("#")[0]] = [];
        }
        if (typeof key.split("#")[1] !== 'undefined')
          obj[key.split("#")[0]].push({"language": "/api/language/" + key.split("#")[1], "text": formData[key]});
        else obj[key] = formData[key];
        // if (key === 'payNum') {
        //   obj[key] = payNumberId;
        //   dispatch({
        //     type: 'payment/queryPayNum'
        //   })
        // }
        // if (key === "payDate") {
        //
        //   const timestamp = new Date(formData[key]).getTime();
        //   obj[key] = timestamp;
        // }
        // if (key === "expireDate") {
        //
        //   const t = new Date(formData[key]).getTime();
        //   obj[key] = t;
        // }
        // if (key === "voucherCost") {
        //   obj[key] = parseFloat(formData[key].replace(/\s/g, ''))
        // }
        // if (key === "hasAds") {
        //   obj[key] = formData[key] !== undefined && formData[key]
        // }
        // if (key === 'paySum' || key === 'expenseSum' || key === 'lessonPrice') {
        //   obj[key] = obj[key].split(" ").join("");
        // }
      });
      formData = obj;
      const data = {
        ...formData,
        // descriptionUz, descriptionEn,
        key: item.key,
      };
      // onOk(data)
    })
  };

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  };
  /*const onChangeEditor = (e) => {
    handleChangeEditor(e.target.id, e.target.getContent())
  };
  // const {modalType} = modalProps;
  const dynamicFormItems = <Row gutter={30}> {formItems.map((formItem) =>
    <Col key={formItem.name} span={formItems.length > 6 ? 12 : 24} label={formItem.label}>
      <FormItem style={{height: 50}} key={formItem.name} hasFeedback {...formItemLayout}>
        {getFieldDecorator(formItem.name, {
          initialValue: formItem.name === 'student' ? formItem.path + this.target.key : formItem.path && item[formItem.name] ? formItem.path + item[formItem.name] : formItem.isDate ? 'moment(item[formItem.name])' : formItem.name === 'payType' ? formItem.path + 10 : item[formItem.name],
          ...formItem
        })(formItem.obj)}
      </FormItem>
    </Col>
  )}</Row>;

  const formItemsList = <Row gutter={30}>
    {formItems.map((formItem) => <Col key={formItem.name} span={formItems.length > 5 ? 12 : 24}>
      <FormItem style={{height: 50}} key={formItem.name} hasFeedback {...formItemLayout}>
          {getFieldDecorator(formItem.name, {
            initialValue: formItem.path && item[formItem.name] ? formItem.path + item[formItem.name] : formItem.name === 'studentStatus' || formItem.name === 'tutorStatus' ? formItem.path + 10 : item[formItem.name],
            ...formItem
          })(formItem.obj)}
        </FormItem></Col>)}
  </Row>;*/

  return (
    <Modal width={600} {...modalOpts}>
      <Form layout="horizontal">
        <Row>
          <Col span={12}>
            <Label>Фамилия и имя</Label>
            <FormItem key='fullName' name= 'fullName'
                      rules = {[{required: true, message: 'Этот поля не должно быть пустое'}]}>
              <Input placeholder='Фамилия и имя'/>
            </FormItem>
          </Col>
          <Col span={12}>
            <Label>Телефон номер</Label>
            <FormItem key='phone' name= 'phone'
                      rules = {[{required: true, message: 'Этот поля не должно быть пустое'}]}>
              <Input placeholder='Телефон номер'/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Label>Логин</Label>
            <FormItem key='login' name= 'login'
                      rules = {[{required: true, message: 'Этот поля не должно быть пустое'}]}>
              <Input placeholder='Логин'/>
            </FormItem>
          </Col>
          <Col span={12}>
            <Label>Пароль</Label>
            <FormItem key='password' name= 'password'
                      rules = {[{required: true, message: 'Этот поля не должно быть пустое'}]}>
              <Input placeholder='Пароль'/>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
};

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
};

export default modal
