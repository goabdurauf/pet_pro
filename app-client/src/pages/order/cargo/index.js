import React, {Component} from 'react';
import {Card, Tabs, Space, Popconfirm, Table, Row, Col, Select, Modal, Typography, notification} from 'antd';
import {connect} from "react-redux";
import {DeleteOutlined, FormOutlined} from "@ant-design/icons";
import CargoModal from '../$order_detail/modals/cargoModal'
const { TabPane } = Tabs;

@connect(({cargo, app}) => ({cargo, app}))
class Cargo extends Component {

  onRowSelect = selectedRowKeys => {
    const {dispatch} = this.props;
    dispatch({
      type: 'cargo/updateState',
      payload: {selectedRowKeys}
    })
  };

  render() {
    const {cargo, dispatch} = this.props;
    const {itemList, currentItem, currentModal, selectedStatusId, isModalOpen, isBtnDisabled, isLoading,  countryList, packageTypeList, documentAttachments,
      isTableLoading, pagination, selectedRowKeys, cargoStatusList, visibleColumns} = cargo;

    const onChange = (key) => {
      if (key !== 'Cargo') {
        dispatch({type: 'cargo/pushToPage', payload: {key}});
      }
    }
    const handleSubmit = (values) => {
      dispatch({
        type: 'cargo/updateState',
        payload: {isBtnDisabled: true}
      })

      if (values.loadDate !== undefined && values.loadDate !== '')
        values.loadDate = values.loadDate.format('DD.MM.YYYY HH:mm');

      if (values.docDate !== null && values.docDate !== '')
        values.docDate = values.docDate.format('DD.MM.YYYY HH:mm');

      if (values.unloadDate !== undefined && values.unloadDate !== '')
        values.unloadDate = values.unloadDate.format('DD.MM.YYYY HH:mm');

      dispatch({
        type: 'cargo/saveCargo',
        payload: {
          ...values,
          id: currentItem.id,
          docId: currentItem.docId,
          orderId: currentItem.orderId,
          docAttachments: documentAttachments
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
    const confirmModalProps = {
      visible: isModalOpen,
      title: '',
      width: 400,
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
    const customRequest = (options) => {
      dispatch({
        type: 'cargo/updateState',
        payload: {
          isLoading: true
        }
      })
      dispatch({
        type: 'cargo/uploadAttachment',
        payload: {
          file: options.file,
          fileUpload: true,
          type: options.file.type
        }
      })
    }
    const uploadChange = (options) => {
      if (options.file.status === 'removed'){
        if (currentItem.docId === null) {
          dispatch({
            type: 'cargo/deleteAttachment',
            payload: {
              id: options.file.id
            }
          })
        } else {
          dispatch({
            type: 'cargo/deleteDocumentAttachment',
            payload: {
              docId: currentItem.docId,
              id: options.file.id
            }
          })
        }
      }
    }
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onRowSelect,
    };
    const handleSelect = (id) => {
      if (selectedRowKeys.length > 0) {
        dispatch({
          type: 'cargo/updateState',
          payload: {
            isModalOpen: true,
            currentModal: 'Confirm',
            selectedStatusId: id
          }
        })
      } else {
        notification.error({
          description: 'Сначала выберите груза',
          placement: 'topRight',
          duration: 3,
          style: {backgroundColor: '#ffd9d9'}
        });
      }
    }
    const handleStatusConfirm = () => {
        dispatch({
          type: 'cargo/changeCargoStatus',
          payload: {
            statusId: selectedStatusId,
            cargoIdList: selectedRowKeys
          }
        })
    }
    const handleTableChange = (pagination) => {
      console.log(pagination)
    }

    return (
      <div className="cargo-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs onChange={onChange} defaultActiveKey="Cargo">
            <TabPane tab="Заказы" key="/order">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Грузы" key="Cargo">
              <Row>
                <Col span={6} offset={12}>
                  <Select placeholder='статус груза' onSelect={handleSelect}>
                    {cargoStatusList && cargoStatusList.map(status => <Select.Option key={status.id} value={status.id}>{status.nameRu}</Select.Option>)}
                  </Select>
                </Col>
              </Row>
              <Table rowSelection={rowSelection} columns={columns} dataSource={itemList} bordered size="middle"
                     rowKey={record => record.id} pagination={pagination} loading={isTableLoading}
                     onChange={handleTableChange}/>
            </TabPane>
            <TabPane tab="Рейсы" key="/order/shipping">Подождите пожалуйста ...</TabPane>
          </Tabs>

          {isModalOpen && currentModal === 'Cargo' &&
          <CargoModal
            {...modalProps}
            handleSubmit={handleSubmit} isBtnDisabled={isBtnDisabled} currentItem={currentItem} countryList={countryList}
            customRequest={customRequest} uploadChange={uploadChange} isLoading={isLoading} packageTypeList={packageTypeList}
            documentAttachments={documentAttachments}
          />}

          {isModalOpen && currentModal === 'Confirm' &&
          <Modal {...confirmModalProps} onOk={handleStatusConfirm} okText={"Подтвердить"} cancelText={"Отмена"}>

            <Typography.Title level={5}>Вы действительно хотите изменить статусы выбранных грузов?</Typography.Title>
          </Modal>
          }
        </Card>
      </div>
    );
  }
}

export default Cargo;
