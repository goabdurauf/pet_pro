import React from 'react'
import {Col, DatePicker, Form, Input, Modal, Row, Select, Typography} from 'antd'
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Label} from "reactstrap";
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
import PropTypes from "prop-types";

const modal = ({ currentItem, isBtnDisabled, handleSubmit, isLoading, packageTypeList, countryList, documentAttachments,
                 ...modalProps }) => {
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

  return (<Modal {...modalProps} okButtonProps={{disabled: isBtnDisabled}} onOk={handleSave} okText={"Добавить"} cancelText={"Отмена"}>
    <Form form={form} initialValues={currentItem !== null ? currentItem : ''} onFinish={handleFormSubmit} onValuesChange={handleChangeForm}>
      <Row>
        <Col span={5} key={'name'}><Label>Название груза</Label>
          <Form.Item key={'name'} name={'name'} rules={[{required: true, message: 'Введите название груза'}]}>
            <Input placeholder='название груза'/>
          </Form.Item>
        </Col>
        <Col span={5} key={'code'}><Label>Таможенный код</Label>
          <Form.Item key={'code'} name={'code'} rules={[{required: true, message: 'Введите таможенный код'}]}>
            <Input placeholder='таможенный код'/>
          </Form.Item>
        </Col>
        <Col span={4} key={'loadDate'}><Label>Дата погрузки</Label>
          <Form.Item key={'loadDate'} name={'loadDate'} rules={[{required: true, message: 'Выберите дату'}]}>
            <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          </Form.Item>
        </Col>
        <Col span={4} key={'unloadDate'}><Label>Дата разгрузки</Label>
          <Form.Item key={'unloadDate'} name={'unloadDate'} rules={[{required: true, message: 'Выберите дату'}]}>
            <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          </Form.Item>
        </Col>
        <Col span={6} key={'заметки'}><Label>Заметки</Label>
          <Form.Item key={'comment'} name={'comment'}>
            <Input placeholder='заметки'/>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} key={'cargoDetails'} id={'cargoDetails'} className={'cargoDetails'}>
          <Typography.Title level={5}>Параметры груза</Typography.Title>
          <Row>
            <Col span={5}>Вес</Col>
            <Col span={5}>Объём</Col>
            <Col span={5}>Тип упаковки</Col>
            <Col span={5}>Количество упаковки</Col>
          </Row>
          <Form.List name={'cargoDetails'}>
            {(fields, { add, remove }) =>
              fields.map((field, index) => (
                <Row key={field.key}>
                  <Col span={5}>
                    <Form.Item name={[index, 'weight']} rules={[{ required: true, message: 'Введите вес' }]}>
                      <Input placeholder="вес" />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item name={[index, 'capacity']} rules={[{ required: true, message: 'Введите объём' }]}>
                      <Input placeholder="объём" />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item name={[index, 'packageTypeId']} rules={[{ required: true, message: 'Выберите тип упаковки' }]}>
                      <Select name={'packageTypeId'} placeholder='Тип упаковки'>
                        {packageTypeList.map(type => <Select.Option key={type.id} value={type.id}>{type.nameRu}</Select.Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item name={[index, 'packageAmount']} rules={[{ required: true, message: 'Введите количество упаковки' }]}>
                      <Input placeholder="количество упаковки" />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    {fields.length > 1 ? <MinusCircleOutlined onClick={() => remove(index)} style={{color: 'red'}}/> : ''}
                  </Col>
                  <Col span={2}>
                    {index === fields.length-1 ? <PlusOutlined onClick={() => add()} /> : ''}
                  </Col>
                </Row>
              ))
            }
          </Form.List>
        </Col>
      </Row>
      <Row>
        <Col span={6} key={'sender'} className={'sides'}>
          <Typography.Title level={5}>Отправитель</Typography.Title>
          <Label>Название</Label>
          <Form.Item key={'senderName'} name={'senderName'} rules={[{required: false, message: 'Введите название'}]}>
            <Input placeholder='название'/>
          </Form.Item>
          <Label>Страна</Label>
          <Form.Item key={'senderCountryId'} name={'senderCountryId'} rules={[{required: false, message: 'Выберите страну'}]}>
            <Select placeholder='страна' showSearch
                    filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
              {countryList && countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
          <Label>Город</Label>
          <Form.Item key={'senderCity'} name={'senderCity'} rules={[{required: false, message: 'Введите город'}]}>
            <Input placeholder='город'/>
          </Form.Item>
          <Label>Другие</Label>
          <Form.Item key={'senderOthers'} name={'senderOthers'}><Input placeholder='другие'/></Form.Item>
        </Col>
        <Col span={6} key={'receiver'} className={'sides'}>
          <Typography.Title level={5}>Получатель</Typography.Title>
          <Label>Название</Label>
          <Form.Item key={'receiverName'} name={'receiverName'} rules={[{required: false, message: 'Введите название'}]}>
            <Input placeholder='название'/>
          </Form.Item>
          <Label>Страна</Label>
          <Form.Item key={'receiverCountryId'} name={'receiverCountryId'} rules={[{required: false, message: 'Выберите страну'}]}>
            <Select placeholder='страна' showSearch
                    filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
              {countryList && countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
          <Label>Город</Label>
          <Form.Item key={'receiverCity'} name={'receiverCity'} rules={[{required: false, message: 'Введите город'}]}>
            <Input placeholder='город'/>
          </Form.Item>
          <Label>Другие</Label>
          <Form.Item key={'receiverOthers'} name={'receiverOthers'}><Input placeholder='другие'/></Form.Item>
        </Col>
        <Col span={6} key={'customFrom'} className={'sides'}>
          <Typography.Title level={5}>Таможня отправления</Typography.Title>
          <Label>Название</Label>
          <Form.Item key={'customFromName'} name={'customFromName'} rules={[{required: false, message: 'Введите название'}]}>
            <Input placeholder='название'/>
          </Form.Item>
          <Label>Страна</Label>
          <Form.Item key={'customFromCountryId'} name={'customFromCountryId'} rules={[{required: false, message: 'Выберите страну'}]}>
            <Select placeholder='страна' showSearch
                    filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
              {countryList && countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
          <Label>Город</Label>
          <Form.Item key={'customFromCity'} name={'customFromCity'} rules={[{required: false, message: 'Введите город'}]}>
            <Input placeholder='город'/>
          </Form.Item>
          <Label>Другие</Label>
          <Form.Item key={'customFromOthers'} name={'customFromOthers'}><Input placeholder='другие'/></Form.Item>
        </Col>
        <Col span={6} key={'customTo'} className={'sides-l'}>
          <Typography.Title level={5}>Таможня назначения</Typography.Title>
          <Label>Название</Label>
          <Form.Item key={'customToName'} name={'customToName'} rules={[{required: false, message: 'Введите название'}]}>
            <Input placeholder='название'/>
          </Form.Item>
          <Label>Страна</Label>
          <Form.Item key={'customToCountryId'} name={'customToCountryId'} rules={[{required: false, message: 'Выберите страну'}]}>
            <Select placeholder='страна' showSearch
                    filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
              {countryList && countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
          <Label>Город</Label>
          <Form.Item key={'customToCity'} name={'customToCity'} rules={[{required: false, message: 'Введите город'}]}>
            <Input placeholder='город'/>
          </Form.Item>
          <Label>Другие</Label>
          <Form.Item key={'customToOthers'} name={'customToOthers'}><Input placeholder='другие'/></Form.Item>
        </Col>
      </Row>
    </Form>
  </Modal>)
};

modal.propTypes = {
  currentItem: PropTypes.object,
  handleSubmit: PropTypes.func,
};

export default (modal);
