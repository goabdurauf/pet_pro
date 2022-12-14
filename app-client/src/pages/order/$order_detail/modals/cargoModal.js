import React from 'react'
import {Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Typography} from 'antd'
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Label} from "reactstrap";
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
import PropTypes from "prop-types";

const modal = ({ currentItem, isBtnDisabled, handleSubmit, isLoading, packageTypeList, countryList, documentAttachments, cargoRegTypeList, modalType,
                 currencyList, transportKindList, transportConditionList, productList, searchProduct, ...modalProps }) => {
  const [form] = Form.useForm()
  function handleFormSubmit (values) {
    if (values.loadDate !== null && values.loadDate !== undefined && values.loadDate !== '')
      values.loadDate = values.loadDate.format('DD.MM.YYYY HH:mm');

    if (values.unloadDate !== null && values.unloadDate !== undefined && values.unloadDate !== '')
      values.unloadDate = values.unloadDate.format('DD.MM.YYYY HH:mm');

    handleSubmit(values);
  }
  function handleSave () {
    form.submit()
  }
  function handleSearch (val) {
    if (val.length > 2)
      searchProduct(val)
  }
  function handleChangeForm (changedValues, allValues) {
    // if (onFormValuesChange) onFormValuesChange(changedValues, allValues)
  }

  const getWeight = () => {
    let weight = '(';
    let comma = '';
    currentItem.cargoDetails && currentItem.cargoDetails.forEach(detail => {
      weight += comma + detail.weight;
      comma = ', ';
    })
    return weight + ')'
  }
  const getCapacity = () => {
    let capacity = '(';
    let comma = '';
    currentItem.cargoDetails && currentItem.cargoDetails.forEach(detail => {
      capacity += comma + detail.capacity;
      comma = ', ';
    })
    return capacity + ')'
  }
  const getPackageAmount = () => {
    let packageAmount = '(';
    let comma = '';
    currentItem.cargoDetails && currentItem.cargoDetails.forEach(detail => {
      packageAmount += comma + detail.packageAmount;
      comma = ', ';
    })
    return packageAmount + ')'
  }
  const priceChange = (event) => {
    let price = event.target.value;
    let rate = document.getElementById("rate").value;
    form.setFieldsValue({finalPrice: price / (rate !== '' && rate !== null ? rate : 1)})
  }
  const rateChange = (event) => {
    let price = document.getElementById("price").value;
    form.setFieldsValue({finalPrice: price / (event !== '' && event !== null ? event : 1)})
  }

  return (<Modal {...modalProps} okButtonProps={{disabled: isBtnDisabled}} onOk={handleSave} okText={"????????????????"} cancelText={"????????????"}>
    <Form form={form} initialValues={currentItem !== null ? currentItem : ''} onFinish={handleFormSubmit} onValuesChange={handleChangeForm}>
      <Row>
        <Col span={6} key={'name'}><Label>???????????????? ??????????</Label>
          <Form.Item key={'name'} name={'name'} rules={[{required: true, message: '?????????????? ???????????????? ??????????'}]}>
            <Input placeholder='???????????????? ??????????'/>
          </Form.Item>
        </Col>
        <Col span={18} key={'productId'}><Label>??????????????</Label>
          <Form.Item key={'productId'} name={'productId'} rules={[{required: true, message: '???????????????? ????????????????'}]}>
            <Select placeholder='??????????????' clearIcon showSearch filterOption={false} onSearch={handleSearch}>
              {productList && productList.map(product => <Select.Option key={product.id} value={product.id}>{product.code} - {product.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={4} key={'loadDate'}><Label>???????? ????????????????</Label>
          <Form.Item key={'loadDate'} name={'loadDate'} rules={[{required: true, message: '???????????????? ????????'}]}>
            <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          </Form.Item>
        </Col>
        <Col span={4} key={'unloadDate'}><Label>???????? ??????????????????</Label>
          <Form.Item key={'unloadDate'} name={'unloadDate'} rules={[{required: true, message: '???????????????? ????????'}]}>
            <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
          </Form.Item>
        </Col>
        <Col span={5} key={'regTypeId'}><Label>?????? ???????????????????? ??????????</Label>
          <Form.Item key={'regTypeId'} name={'regTypeId'} rules={[{required: false, message: '???????????????? ?????? ???????????????????? ??????????'}]}>
            <Select placeholder='?????? ???????????????????? ??????????' showSearch
                    filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
              {cargoRegTypeList && cargoRegTypeList.map(regType => <Select.Option key={regType.id} value={regType.id}>{regType.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={5} key={'transportKindId'}><Label>?????? ????????????????????</Label>
          <Form.Item key={'transportKindId'} name={'transportKindId'} rules={[{required: true, message: '???????????????? ?????? ????????????????????'}]}>
            <Select placeholder='?????? ????????????????????' showSearch
                    filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
              {transportKindList && transportKindList.map(trKind => <Select.Option key={trKind.id} value={trKind.id}>{trKind.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6} key={'transportConditionId'}><Label>?????????????? ????????????????????</Label>
          <Form.Item key={'transportConditionId'} name={'transportConditionId'} rules={[{required: true, message: '???????????????? ?????????????? ????????????????????'}]}>
            <Select placeholder='?????????????? ????????????????????' showSearch
                    filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
              {transportConditionList && transportConditionList.map(trCond => <Select.Option key={trCond.id} value={trCond.id}>{trCond.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={4}><Label>????????</Label>
          <Form.Item key={'price'} name={'price'} rules={[{required: true, message: '?????????????? ????????'}]}>
            <Input placeholder='????????' onChange={priceChange} />
          </Form.Item>
        </Col>
        <Col span={4}><Label>????????????</Label>
          <Form.Item key={'currencyId'} name={'currencyId'} rules={[{required: true, message: '???????????????? ????????????'}]}>
            <Select placeholder='????????????'>
              {currencyList && currencyList.map(currency => <Select.Option key={currency.id} value={currency.id}>{currency.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={4}><Label>????????</Label>
          <Form.Item key={'rate'} name={'rate'} rules={[{required: true, message: '?????????????? ??????????'}]} >
            <InputNumber placeholder='????????' onChange={rateChange} precision={4}/>
          </Form.Item>
        </Col>
        <Col span={5}><Label>???????????????? ???????? (USD)</Label>
          <Form.Item key={'finalPrice'} name={'finalPrice'} rules={[{required: true, message: '?????????????? ???????????????? ????????'}]}>
            <InputNumber placeholder='???????????????? ????????' precision={2}/>
          </Form.Item>
        </Col>
        <Col span={7} key={'comment'}><Label>??????????????????????</Label>
          <Form.Item key={'comment'} name={'comment'}>
            <Input placeholder='??????????????????????'/>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} key={'cargoDetails'} id={'cargoDetails'} className={'cargoDetails'}>
          <Typography.Title level={5}>?????????????????? ??????????</Typography.Title>
          <Row>
            <Col span={5}>?????? {modalType === 'clone' ? getWeight() : ''}</Col>
            <Col span={5}>?????????? {modalType === 'clone' ? getCapacity() : ''}</Col>
            <Col span={5}>?????? ????????????????</Col>
            <Col span={5}>??????-???? ???????????????? {modalType === 'clone' ? getPackageAmount() : ''}</Col>
          </Row>
          <Form.List name={'cargoDetails'}>
            {(fields, { add, remove }) =>
              fields.map((field, index) => (
                <Row key={field.key}>
                  <Col span={5}>
                    <Form.Item name={[index, 'weight']} rules={[{ required: true, message: '?????????????? ??????' }]}>
                      <Input placeholder="??????" />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item name={[index, 'capacity']} rules={[{ required: true, message: '?????????????? ??????????' }]}>
                      <Input placeholder="??????????" />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item name={[index, 'packageTypeId']} rules={[{ required: true, message: '???????????????? ?????? ????????????????' }]}>
                      <Select name={'packageTypeId'} placeholder='?????? ????????????????'>
                        {packageTypeList.map(type => <Select.Option key={type.id} value={type.id}>{type.nameRu}</Select.Option>)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item name={[index, 'packageAmount']} rules={[{ required: true, message: '?????????????? ???????????????????? ????????????????' }]}>
                      <Input placeholder="???????????????????? ????????????????" />
                    </Form.Item>
                  </Col>
                  <Col span={2} className={'text-center'}>
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
          <Typography.Title level={5}>??????????????????????</Typography.Title>
          <Label>????????????????</Label>
          <Form.Item key={'senderName'} name={'senderName'} rules={[{required: false, message: '?????????????? ????????????????'}]}>
            <Input placeholder='????????????????'/>
          </Form.Item>
          <Label>????????????</Label>
          <Form.Item key={'senderCountryId'} name={'senderCountryId'} rules={[{required: false, message: '???????????????? ????????????'}]}>
            <Select placeholder='????????????' showSearch
                    filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
              {countryList && countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
          <Label>??????????</Label>
          <Form.Item key={'senderCity'} name={'senderCity'} rules={[{required: false, message: '?????????????? ??????????'}]}>
            <Input placeholder='??????????'/>
          </Form.Item>
          <Label>????????????</Label>
          <Form.Item key={'senderOthers'} name={'senderOthers'}><Input placeholder='????????????'/></Form.Item>
        </Col>
        <Col span={6} key={'receiver'} className={'sides'}>
          <Typography.Title level={5}>????????????????????</Typography.Title>
          <Label>????????????????</Label>
          <Form.Item key={'receiverName'} name={'receiverName'} rules={[{required: false, message: '?????????????? ????????????????'}]}>
            <Input placeholder='????????????????'/>
          </Form.Item>
          <Label>????????????</Label>
          <Form.Item key={'receiverCountryId'} name={'receiverCountryId'} rules={[{required: false, message: '???????????????? ????????????'}]}>
            <Select placeholder='????????????' showSearch
                    filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
              {countryList && countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
          <Label>??????????</Label>
          <Form.Item key={'receiverCity'} name={'receiverCity'} rules={[{required: false, message: '?????????????? ??????????'}]}>
            <Input placeholder='??????????'/>
          </Form.Item>
          <Label>????????????</Label>
          <Form.Item key={'receiverOthers'} name={'receiverOthers'}><Input placeholder='????????????'/></Form.Item>
        </Col>
        <Col span={6} key={'customFrom'} className={'sides'}>
          <Typography.Title level={5}>?????????????? ??????????????????????</Typography.Title>
          <Label>????????????????</Label>
          <Form.Item key={'customFromName'} name={'customFromName'} rules={[{required: false, message: '?????????????? ????????????????'}]}>
            <Input placeholder='????????????????'/>
          </Form.Item>
          <Label>????????????</Label>
          <Form.Item key={'customFromCountryId'} name={'customFromCountryId'} rules={[{required: false, message: '???????????????? ????????????'}]}>
            <Select placeholder='????????????' showSearch
                    filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
              {countryList && countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
          <Label>??????????</Label>
          <Form.Item key={'customFromCity'} name={'customFromCity'} rules={[{required: false, message: '?????????????? ??????????'}]}>
            <Input placeholder='??????????'/>
          </Form.Item>
          <Label>????????????</Label>
          <Form.Item key={'customFromOthers'} name={'customFromOthers'}><Input placeholder='????????????'/></Form.Item>
        </Col>
        <Col span={6} key={'customTo'} className={'sides-l'}>
          <Typography.Title level={5}>?????????????? ????????????????????</Typography.Title>
          <Label>????????????????</Label>
          <Form.Item key={'customToName'} name={'customToName'} rules={[{required: false, message: '?????????????? ????????????????'}]}>
            <Input placeholder='????????????????'/>
          </Form.Item>
          <Label>????????????</Label>
          <Form.Item key={'customToCountryId'} name={'customToCountryId'} rules={[{required: false, message: '???????????????? ????????????'}]}>
            <Select placeholder='????????????' showSearch
                    filterOption={(input, option) => option.children.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) >= 0 }>
              {countryList && countryList.map(country => <Select.Option key={country.id} value={country.id}>{country.nameRu}</Select.Option>)}
            </Select>
          </Form.Item>
          <Label>??????????</Label>
          <Form.Item key={'customToCity'} name={'customToCity'} rules={[{required: false, message: '?????????????? ??????????'}]}>
            <Input placeholder='??????????'/>
          </Form.Item>
          <Label>????????????</Label>
          <Form.Item key={'customToOthers'} name={'customToOthers'}><Input placeholder='????????????'/></Form.Item>
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
