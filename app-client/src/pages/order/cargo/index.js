import React, {Component} from 'react';
import {Card, Tabs, Space, Popconfirm, Table} from 'antd';
import {connect} from "react-redux";
import {DeleteOutlined, FormOutlined} from "@ant-design/icons";
import CargoModal from '../$order_detail/modals/cargoModal'
const { TabPane } = Tabs;

@connect(({cargo, app}) => ({cargo, app}))
class Cargo extends Component {
  render() {
    const {cargo, dispatch} = this.props;
    const {itemList, currentItem, isModalOpen, isBtnDisabled, isLoading,  countryList, packageTypeList, documentAttachments, visibleColumns} = cargo;

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

          {isModalOpen &&
          <CargoModal
            {...modalProps}
            handleSubmit={handleSubmit} isBtnDisabled={isBtnDisabled} currentItem={currentItem} countryList={countryList}
            customRequest={customRequest} uploadChange={uploadChange} isLoading={isLoading} packageTypeList={packageTypeList}
            documentAttachments={documentAttachments}
          />}
        </Card>
      </div>
    );
  }
}

export default Cargo;
