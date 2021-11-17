import React, {Component, useState} from 'react';
import {Card, Row, Col, Typography, Input, DatePicker, Select, Tabs, Space, Popconfirm, Button as Abutton, Table, Form, Modal, InputNumber} from 'antd';
import {connect} from "react-redux";
import {CargoModal} from './modals/cargoModal'
import {Button, Label} from "reactstrap";
import {DeleteOutlined, FormOutlined, MinusCircleOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons";
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
const FormItem = Form.Item;

@connect(({orderDetail, app}) => ({orderDetail, app}))
class OrderDetail extends Component {

  state = {
    isBtnDisabled: false,
    isLoading: ''
  }

  setBtnDisabled = () => {
    this.setState({isBtnDisabled: true})
  }
  setBtnEnabled = () => {
    this.setState({isBtnDisabled: false})
  }
  setLoading = (val) => {
    this.setState({isLoading: val})
  }

  render() {
    const {orderDetail, dispatch} = this.props;
      const {model, orderId, isModalOpen, itemList, cargoList, currentModel, currentItem, modalType, modalWidth, countryList, orderStatusList, managerList, createTitle, editTitle, visibleColumns,
      senderAttachments, receiverAttachments, customFromAttachments, customToAttachments, packageTypeList, carrierList, currencyList, shipTypeList} = orderDetail;

    const openModal = () => {
      // this.setBtnEnabled();
      dispatch({
        type: 'orderDetail/updateState',
        payload: {
          isModalOpen: !isModalOpen,
          currentItem: isModalOpen ? {cargoDetails:[{weight:'', capacity:'', packageTypeId:'', packageAmount:''}]} : currentItem
        }
      })
    }
    const modalProps = {
      title: modalType === 'create' ? createTitle : editTitle,
      visible: isModalOpen,
      onCancel: openModal,
      width: modalWidth
    }
    const customRequest = ({onSuccess, onError, file}, owner) => {
      // this.setLoading(owner);
      dispatch({
        type: 'orderDetail/uploadAttachment',
        payload: {
          file,
          fileUpload: true,
          type: file.type,
          owner
        }
      })
    }
    const uploadChange = ({ file, fileList }, owner) => {
      if (file.status === 'removed'){
        dispatch({
          type: 'orderDetail/deleteAttachment',
          payload: {
            id: file.id,
            owner
          }
        })
      }
    }
    const backToOrders = (key) => {
      dispatch({
        type: 'orderDetail/pushToPage',
        payload: {key}
      })
    }
    const onChange = (key) => {dispatch({type: 'orderDetail/query' + key, payload: {id: orderId}});}
    const handleSubmit = (name, {values, forms}) => {
      // this.setBtnDisabled();
      if (modalType !== 'create')
        values = {...values, id: currentItem.id}

      if (values.loadDate !== undefined && values.loadDate !== '')
        values.loadDate = values.loadDate.format('DD.MM.YYYY HH:mm');

      if (values.loadSendDate !== undefined && values.loadSendDate !== '')
        values.loadSendDate = values.loadSendDate.format('DD.MM.YYYY HH:mm');

      if (values.customArrivalDate !== undefined && values.customArrivalDate !== '')
        values.customArrivalDate = values.customArrivalDate.format('DD.MM.YYYY HH:mm');

      if (values.customSendDate !== undefined && values.customSendDate !== '')
        values.customSendDate = values.customSendDate.format('DD.MM.YYYY HH:mm');

      if (values.unloadArrivalDate !== undefined && values.unloadArrivalDate !== '')
        values.unloadArrivalDate = values.unloadArrivalDate.format('DD.MM.YYYY HH:mm');

      if (values.unloadDate !== undefined && values.unloadDate !== '')
        values.unloadDate = values.unloadDate.format('DD.MM.YYYY HH:mm');

      dispatch({
        type: 'orderDetail/save' + model,
        payload: {...values, orderId}
      })
    }
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
    const handleEdit = (id) => {
      // this.setBtnEnabled();
      dispatch({
        type: 'orderDetail/get' + model + 'ById',
        payload: {id}
      })
    };
    const handleDelete = (id) => {
      dispatch({
        type: 'orderDetail/delete' + model + 'ById',
        payload: {id}
      })
    }
    const getTotals = () => {
      let weight = 0;
      let capacity = 0;
      let amount = 0;
      itemList.forEach(item => {
        item.cargoDetails && item.cargoDetails.forEach(detail => {
          weight += detail.weight;
          capacity += detail.capacity;
          amount += detail.packageAmount;
        })
      })
      return ' Вес: ' + weight + '; Объём: ' + capacity + '; Кол-во уп.: ' + amount;
    }

    const ShippingModal = () => {
      const [form] = Form.useForm();
      const getPrice = (event) => {
        let price = event.target.value;
        let rate = document.getElementById("rate").value;
        form.setFieldsValue({finalPrice: price / rate})
      }
      const getRate = (event) => {
        let price = document.getElementById("price").value;
        form.setFieldsValue({finalPrice: price / event})
      }
      const onOk = () => {
        form.submit();
      };
      return (
        <Modal {...modalProps} onOk={onOk} okText={"Добавить"} cancelText={"Отмена"}>
          <Form form={form} initialValues={currentItem !== null ? currentItem : ''}>
            <Row>
              <Col span={8}><Label>Менеджер</Label>
                <FormItem key={'managerId'} name={'managerId'} rules={[{required: true, message: 'Выберите менеджера'}]}>
                  <Select placeholder='менеджер'>
                    {managerList.map(manager => <Select.Option key={manager.id} value={manager.id}>{manager.fullName}</Select.Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}><Label>Перевозчик</Label>
                <FormItem key={'carrierId'} name={'carrierId'} rules={[{required: true, message: 'Выберите перевозчика'}]}>
                  <Select placeholder='перевозчик'>
                    {carrierList.map(carrier => <Select.Option key={carrier.id} value={carrier.id}>{carrier.name}</Select.Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}><Label>Тип транспорта</Label>
                <FormItem key={'shippingTypeId'} name={'shippingTypeId'} rules={[{required: true, message: 'Выберите тип транспорта'}]}>
                  <Select placeholder='тип транспорта'>
                    {shipTypeList.map(type => <Select.Option key={type.id} value={type.id}>{type.nameRu}</Select.Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col span={6}><Label>Цена</Label>
                <FormItem key={'price'} name={'price'} rules={[{required: true, message: 'Введите цену'}]}>
                  <Input placeholder='цена' onChange={getPrice} />
                </FormItem>
              </Col>
              <Col span={6}><Label>Валюта</Label>
                <FormItem key={'currencyId'} name={'currencyId'} rules={[{required: true, message: 'Выберите валюту'}]}>
                  <Select placeholder='валюта'>
                    {currencyList.map(currency => <Select.Option key={currency.id} value={currency.id}>{currency.nameRu}</Select.Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col span={6}><Label>Курс</Label>
                <FormItem key={'rate'} name={'rate'} rules={[{required: true, message: 'Введите курса'}]} >
                  <InputNumber placeholder='курс' onChange={getRate} precision={4}/>
                </FormItem>
              </Col>
              <Col span={6}><Label>Конечное цена (USD)</Label>
                <FormItem key={'finalPrice'} name={'finalPrice'} rules={[{required: true, message: 'Введите конечную цену'}]}>
                  <InputNumber placeholder='конечное цена' precision={2}/>
                </FormItem>
              </Col>
              <Col span={12}><Label>Номер транспорта</Label>
                <FormItem key={'shippingNum'} name={'shippingNum'} rules={[{required: true, message: 'Введите номер транспорта'}]}>
                  <Input placeholder='номер транспорта' />
                </FormItem>
              </Col>
              <Col span={12}><Label>Грузы</Label>
                <FormItem key={'cargoList'} name={'cargoList'} rules={[{required: true, message: 'Выберите грузы'}]}>
                  <Select placeholder='грузы' mode="multiple" allowClear>
                    {cargoList.map(cargo => <Select.Option key={cargo.id} value={cargo.id}>{cargo.num}</Select.Option>)}
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8} key={'load'} className={'sides'}>
                <Typography.Title level={5}>Место загрузки</Typography.Title>
                <Label>Дата и время загрузки</Label>
                <Form.Item key={'loadDate'} name={'loadDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
                <Label>Станция отправления</Label>
                <Form.Item key={'loadStation'} name={'loadStation'}><Input placeholder='станция'/></Form.Item>
                <Label>Дата и время отправления</Label>
                <Form.Item key={'loadSendDate'} name={'loadSendDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
              </Col>
              <Col span={8} key={'custom'} className={'sides'}>
                <Typography.Title level={5}>Пограничный переход</Typography.Title>
                <Label>Дата и время прибытия</Label>
                <Form.Item key={'customArrivalDate'} name={'customArrivalDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
                <Label>Станция погран перехода</Label>
                <Form.Item key={'customStation'} name={'customStation'}><Input placeholder='станция'/></Form.Item>
                <Label>Дата и время отправления</Label>
                <Form.Item key={'customSendDate'} name={'customSendDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
              </Col>
              <Col span={8} key={'unload'} className={'sides-l'}>
                <Typography.Title level={5}>Место разгрузки</Typography.Title>
                <Label>Дата и время прибытия</Label>
                <Form.Item key={'unloadArrivalDate'} name={'unloadArrivalDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
                <Label>Станция прибытия</Label>
                <Form.Item key={'unloadStation'} name={'unloadStation'}><Input placeholder='станция'/></Form.Item>
                <Label>Дата и время разгрузки</Label>
                <Form.Item key={'unloadDate'} name={'unloadDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    };
    const CargoModal = () => {
      const [form] = Form.useForm();
      const onOk = () => {
        form.submit();
      };
      return (
        <Modal {...modalProps} okButtonProps={{disabled: this.state.isBtnDisabled}} onOk={onOk} okText={"Добавить"} cancelText={"Отмена"}>
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
                <Form.Item key={'senderName'} name={'senderName'} rules={[{required: false, message: 'Введите название'}]}>
                  <Input placeholder='название'/>
                </Form.Item>
                <Label>Страна</Label>
                <Form.Item key={'senderCountryId'} name={'senderCountryId'} rules={[{required: false, message: 'Выберите страну'}]}>
                  <Select placeholder='страна' showSearch
                          filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
                    {countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Label>Город</Label>
                <Form.Item key={'senderCity'} name={'senderCity'} rules={[{required: false, message: 'Введите город'}]}>
                  <Input placeholder='город'/>
                </Form.Item>
                <Label>Другие</Label>
                <Form.Item key={'senderOthers'} name={'senderOthers'}><Input placeholder='другие'/></Form.Item>
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
                <Form.Item key={'receiverName'} name={'receiverName'} rules={[{required: false, message: 'Введите название'}]}>
                  <Input placeholder='название'/>
                </Form.Item>
                <Label>Страна</Label>
                <Form.Item key={'receiverCountryId'} name={'receiverCountryId'} rules={[{required: false, message: 'Выберите страну'}]}>
                  <Select placeholder='страна' showSearch
                          filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
                    {countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Label>Город</Label>
                <Form.Item key={'receiverCity'} name={'receiverCity'} rules={[{required: false, message: 'Введите город'}]}>
                  <Input placeholder='город'/>
                </Form.Item>
                <Label>Другие</Label>
                <Form.Item key={'receiverOthers'} name={'receiverOthers'}><Input placeholder='другие'/></Form.Item>
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
                <Form.Item key={'customFromName'} name={'customFromName'} rules={[{required: false, message: 'Введите название'}]}>
                  <Input placeholder='название'/>
                </Form.Item>
                <Label>Страна</Label>
                <Form.Item key={'customFromCountryId'} name={'customFromCountryId'} rules={[{required: false, message: 'Выберите страну'}]}>
                  <Select placeholder='страна' showSearch
                          filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
                    {countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Label>Город</Label>
                <Form.Item key={'customFromCity'} name={'customFromCity'} rules={[{required: false, message: 'Введите город'}]}>
                  <Input placeholder='город'/>
                </Form.Item>
                <Label>Другие</Label>
                <Form.Item key={'customFromOthers'} name={'customFromOthers'}><Input placeholder='другие'/></Form.Item>
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
                <Form.Item key={'customToName'} name={'customToName'} rules={[{required: false, message: 'Введите название'}]}>
                  <Input placeholder='название'/>
                </Form.Item>
                <Label>Страна</Label>
                <Form.Item key={'customToCountryId'} name={'customToCountryId'} rules={[{required: false, message: 'Выберите страну'}]}>
                  <Select placeholder='страна' showSearch
                          filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
                    {countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Label>Город</Label>
                <Form.Item key={'customToCity'} name={'customToCity'} rules={[{required: false, message: 'Введите город'}]}>
                  <Input placeholder='город'/>
                </Form.Item>
                <Label>Другие</Label>
                <Form.Item key={'customToOthers'} name={'customToOthers'}><Input placeholder='другие'/></Form.Item>
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
          <Tabs onChange={backToOrders}>
            <Tabs.TabPane tab="Заказы" key="/order">
              <Row className="order-detail-page">
                <Col span={5}>
                  <Card style={{width: '100%'}} bordered={false}>
                    <div className="row">
                      <div className="col-md-12">
                        <Space className="float-left mt-1">Номер заказа: {currentModel && currentModel.num}</Space>
                        <Button className="float-right" outline color="primary" size="sm" >Редактировать</Button>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <Select id={'orderStatusId'} style={{width: '100%', marginTop: '20px'}} defaultValue={currentModel && currentModel.statusId}>
                          {orderStatusList.map(status => <Select.Option key={status.id} value={status.id}>{status.nameRu}</Select.Option>)}
                        </Select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <table className='table-bordered table-striped'>
                          <tbody>
                          <tr><td>Начальная ставка для клиента:</td><td>1 USD</td></tr>
                          <tr><td>Фрахт:</td><td>1 USD</td></tr>
                          <tr><td>Расходы:</td><td>2500 USD</td></tr>
                          <tr><td>Прибыль:</td><td>1500 USD</td></tr>
                          <tr></tr>
                          <tr><td>Компания:</td><td>DAFEX</td></tr>
                          <tr><td>Менеджер:</td><td>{currentModel && currentModel.managerName}</td></tr>
                          <tr><td>Дата заказа:</td><td>{currentModel && currentModel.date.substring(0, currentModel.date.indexOf(' '))}</td></tr>
                          <tr></tr>
                          <tr><td>Клиент:</td><td>{currentModel && currentModel.clientName}</td></tr>
                          <tr><td>Перевозчики:</td><td>Norman logistics</td></tr>
                          <tr><td>Экспедиторы:</td><td>Дилшод Тиллаев</td></tr>
                          <tr></tr>
                          <tr><td>Документы с клиентом:</td><td>Добавить заявку</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </Card>
                </Col>
                <Col span={19}>
                  <Card style={{width: '100%'}} bordered={false}>
                    <Tabs onChange={onChange}>
                      <Tabs.TabPane tab="Грузы" key="Cargo">
                        <Row>
                          <Col span={8} offset={8}>
                            <Space className="text-center"><b>Общий размер:</b>{getTotals()}</Space>
                          </Col>
                          <Col span={8}>
                            <Button className="float-right" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> Добавить</Button>
                          </Col>
                        </Row>
                        <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
                               pagination={false}/>
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Рейсы" key="Shipping">
                        <Button className="float-right" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> Добавить</Button>
                        <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
                               pagination={false}/>
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Финансы" key="Finance">
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Документы" key="Documents">
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Статусы" key="Statuses">
                      </Tabs.TabPane>

                    </Tabs>
                    <Form.Provider onFormFinish={handleSubmit}>{model === 'Shipping' ? <ShippingModal/> : <CargoModal/>}</Form.Provider>
                  </Card>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Грузы" key="/order/cargo">Подождите пожалуйста ...</Tabs.TabPane>
            <Tabs.TabPane tab="Рейсы" key="/order/shipping">Подождите пожалуйста ...</Tabs.TabPane>
          </Tabs>

          {/*<CargoModal {...{
            modalProps,
            handleSubmit,
            isBtnDisabled: this.state.isBtnDisabled,
            currentItem, countryList,
            customRequest, uploadChange, isLoading, packageTypeList,
            senderAttachments, receiverAttachments, customFromAttachments, customToAttachments
          }} />*/}


        </Card>
      </div>
    );
  }
}

export default OrderDetail;
