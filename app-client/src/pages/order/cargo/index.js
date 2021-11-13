import React, {Component} from 'react';
import {Card, Row, Col, Tabs, Form, Input, Select, Space, Popconfirm, Table, DatePicker, Modal, Typography} from 'antd';
import {connect} from "react-redux";
import {DeleteOutlined, FormOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {Button, Label} from "reactstrap";
import locale from "antd/es/date-picker/locale/ru_RU";
const { TabPane } = Tabs;

@connect(({cargo, app}) => ({cargo, app}))
class Cargo extends Component {
  render() {
    const {cargo, dispatch} = this.props;
    const {itemList, currentItem, isModalOpen,  countryList, packageTypeList, visibleColumns} = cargo;

    const onChange = (key) => {
      if (key !== 'Cargo') {
        dispatch({type: 'cargo/pushToPage', payload: {key}});
      }
    }
    const handleSubmit = (name, {values, forms}) => {
      dispatch({
        type: 'cargo/updateState',
        payload: {isModalOpen: false}
      })
      values = {...values, id: currentItem.id, orderId: currentItem.orderId}

      let date = values.date;
      if (date !== undefined)
        values.date = date.format('DD.MM.YYYY HH:mm:ss');

      dispatch({
        type: 'cargo/saveCargo',
        payload: {
          ...values
        }
      })
    };
    const columns = [
      ...visibleColumns,
      {
        title: 'Операции',
        key: 'operation',
        width: 100,
        // fixed: 'right',
        align: 'center',
        render: (text, record) => (
          <Space size="middle">
            <FormOutlined onClick={() => handleEdit(record.id)}/>
            <Popconfirm title="Удалить?" onConfirm={() => handleDelete(record.id)}
                        okText="Да" cancelText="Нет">
              <DeleteOutlined style={{color: 'red'}}/>
            </Popconfirm>
          </Space>
        )
      }
    ];
    const modalProps = {
      visible: isModalOpen,
      title: 'Редактировать груза',
      width: 1200,
      onCancel() {
        dispatch({
          type: 'cargo/updateState',
          payload: {
            isModalOpen: false
          }
        })
      }
    };
    const handleEdit = (id) => {
      dispatch({
        type: 'cargo/getCargoById',
        payload: {id}
      })
    };
    const handleDelete = (id) => {
      dispatch({
        type: 'cargo/deleteCargoById',
        payload: {id}
      })
    }
    const CargoModal = () => {
      const [form] = Form.useForm();
      const onOk = () => {
        form.submit();
      };
      return (
        <Modal {...modalProps} onOk={onOk} okText={"Добавить"} cancelText={"Отмена"}>
          <Form form={form} initialValues={currentItem !== null ? currentItem : ''}>
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
                <Form.Item key={'senderName'} name={'senderName'} rules={[{required: true, message: 'Введите название'}]}>
                  <Input placeholder='название'/>
                </Form.Item>
                <Label>Страна</Label>
                <Form.Item key={'senderCountryId'} name={'senderCountryId'} rules={[{required: true, message: 'Выберите страну'}]}>
                  <Select placeholder='страна' showSearch
                          filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
                    {countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Label>Город</Label>
                <Form.Item key={'senderCity'} name={'senderCity'} rules={[{required: true, message: 'Введите город'}]}>
                  <Input placeholder='город'/>
                </Form.Item>
                <Label>Другие</Label>
                <Form.Item key={'senderOthers'} name={'senderOthers'}>
                  <Input placeholder='другие'/>
                </Form.Item>
                {/*<div className={'uploads'}>
                  <Upload fileList={senderAttachments}
                          onChange={(e) => uploadChange(e, 'sender')}
                          customRequest={(e) => customRequest(e, 'sender')}>
                    <Abutton icon={<UploadOutlined />}>Закрепить файл</Abutton>
                  </Upload>
                </div>*/}
              </Col>
              <Col span={6} key={'receiver'} className={'sides'}>
                <Typography.Title level={5}>Получатель</Typography.Title>
                <Label>Название</Label>
                <Form.Item key={'receiverName'} name={'receiverName'} rules={[{required: true, message: 'Введите название'}]}>
                  <Input placeholder='название'/>
                </Form.Item>
                <Label>Страна</Label>
                <Form.Item key={'receiverCountryId'} name={'receiverCountryId'} rules={[{required: true, message: 'Выберите страну'}]}>
                  <Select placeholder='страна' showSearch
                          filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
                    {countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Label>Город</Label>
                <Form.Item key={'receiverCity'} name={'receiverCity'} rules={[{required: true, message: 'Введите город'}]}>
                  <Input placeholder='город'/>
                </Form.Item>
                <Label>Другие</Label>
                <Form.Item key={'receiverOthers'} name={'receiverOthers'}>
                  <Input placeholder='другие'/>
                </Form.Item>
                {/*<div className={'uploads'}>
                  <Upload fileList={receiverAttachments}
                          onChange={(e) => uploadChange(e, 'receiver')}
                          customRequest={(e) => customRequest(e, 'receiver')}>
                    <Abutton icon={<UploadOutlined />}>Закрепить файл</Abutton>
                  </Upload>
                </div>*/}
              </Col>
              <Col span={6} key={'customFrom'} className={'sides'}>
                <Typography.Title level={5}>Таможня отправления</Typography.Title>
                <Label>Название</Label>
                <Form.Item key={'customFromName'} name={'customFromName'} rules={[{required: true, message: 'Введите название'}]}>
                  <Input placeholder='название'/>
                </Form.Item>
                <Label>Страна</Label>
                <Form.Item key={'customFromCountryId'} name={'customFromCountryId'} rules={[{required: true, message: 'Выберите страну'}]}>
                  <Select placeholder='страна' showSearch
                          filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
                    {countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Label>Город</Label>
                <Form.Item key={'customFromCity'} name={'customFromCity'} rules={[{required: true, message: 'Введите город'}]}>
                  <Input placeholder='город'/>
                </Form.Item>
                <Label>Другие</Label>
                <Form.Item key={'customFromOthers'} name={'customFromOthers'}>
                  <Input placeholder='другие'/>
                </Form.Item>
                {/*<div className={'uploads'}>
                  <Upload fileList={customFromAttachments}
                          onChange={(e) => uploadChange(e, 'customFrom')}
                          customRequest={(e) => customRequest(e, 'customFrom')}>
                    <Abutton icon={<UploadOutlined />}>Закрепить файл</Abutton>
                  </Upload>
                </div>*/}
              </Col>
              <Col span={6} key={'customTo'} className={'sides-l'}>
                <Typography.Title level={5}>Таможня назначения</Typography.Title>
                <Label>Название</Label>
                <Form.Item key={'customToName'} name={'customToName'} rules={[{required: true, message: 'Введите название'}]}>
                  <Input placeholder='название'/>
                </Form.Item>
                <Label>Страна</Label>
                <Form.Item key={'customToCountryId'} name={'customToCountryId'} rules={[{required: true, message: 'Выберите страну'}]}>
                  <Select placeholder='страна' showSearch
                          filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
                    {countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Label>Город</Label>
                <Form.Item key={'customToCity'} name={'customToCity'} rules={[{required: true, message: 'Введите город'}]}>
                  <Input placeholder='город'/>
                </Form.Item>
                <Label>Другие</Label>
                <Form.Item key={'customToOthers'} name={'customToOthers'}>
                  <Input placeholder='другие'/>
                </Form.Item>
                {/*<div className={'uploads'}>
                  <Upload fileList={customToAttachments}
                          onChange={(e) => uploadChange(e, 'customTo')}
                          customRequest={(e) => customRequest(e, 'customTo')}>
                    <Abutton icon={<UploadOutlined />}>Закрепить файл</Abutton>
                  </Upload>
                </div>*/}
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    };

    return (
      <div className="order-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs onChange={onChange} defaultActiveKey="Cargo">
            <TabPane tab="Заказы" key="/order">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Грузы" key="Cargo">
              <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id} pagination={{position: ["bottomCenter"]}}/>
            </TabPane>
            <TabPane tab="Рейсы" key="/order/shipping">Подождите пожалуйста ...</TabPane>
          </Tabs>
          <Form.Provider onFormFinish={handleSubmit}><CargoModal/></Form.Provider>
        </Card>
      </div>
    );
  }
}

export default Cargo;
