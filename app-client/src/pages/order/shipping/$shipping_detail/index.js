import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Card, Col, notification, Popconfirm, Row, Space, Table, Tabs, Tooltip} from "antd";
import {DeleteOutlined, FormOutlined, PlusOutlined, ApartmentOutlined} from "@ant-design/icons";
import {BsCircleFill, BsJournalArrowDown} from "react-icons/bs";
import DocumentModal from './modals/documentModal'
import ExpenseModal from '../../$order_detail/modals/expenseModal'
import DivideModal from './modals/divideModal'
import InvoiceModal from "./modals/invoiceModal";
import {Button} from "reactstrap";

const ShippingDetail = ({dispatch, shippingDetail}) => {

  const {model, shippingId, isModalOpen, isDivideModalOpen, loadingFile, cargoList, currentModel, currentItem, modalType, modalWidth, createTitle, editTitle, visibleColumns,
    isBtnDisabled, documentList, documentAttachments, carrierList, currencyList, expenseList, expenseDivideList, expenseDivide, isAddInvoiceModalOpen, expenseNameList
  } = shippingDetail;

  const openModal = () => {
    dispatch({
      type: 'shippingDetail/updateState',
      payload: {
        isModalOpen: !isModalOpen,
        modalType: 'create',
        currentItem: null,
        documentAttachments: []
      }
    })
  }
  const modalProps = {
    title: modalType === 'create' ? createTitle : editTitle,
    visible: isModalOpen,
    onCancel: openModal,
    width: modalWidth
  }
  const openDivideModal = (id) => {
    dispatch({
      type: 'shippingDetail/getExpenseDivideId',
      payload: {shippingId, id}
    })
  };
  const handleDivideChange = (data) => {
    dispatch({
      type: 'shippingDetail/updateState',
      payload: {expenseDivideList: data}
    })
  };
  const closeDivideModal = () => {
    dispatch({
      type: 'shippingDetail/updateState',
      payload: {
        isDivideModalOpen: false,
        expenseDivide: {},
        expenseDivideList: []
      }
    })
  }
  const handleDivideSubmit = () => {
    if (expenseDivideList.length === 0) {
      notification.error({
        description: '?????????????? ???????????????????? ?????????? ???? ???????? ????????',
        placement: 'topRight',
        duration: 3,
        style: {backgroundColor: '#ffd9d9'}
      });
      return;
    }
    let fPrice = 0;
    expenseDivideList.forEach(divide => {
      fPrice += Number.parseFloat(divide.finalPrice);
    })
    if (fPrice !== expenseDivide.expensePrice) {
      notification.error({
        description: '?????????? ?????????? ???? ?????????????????? ?? ?????????????????????? ?????????? (' + expenseDivide.expensePrice + ' <> ' + fPrice + ')',
        placement: 'topRight',
        duration: 3,
        style: {backgroundColor: '#ffd9d9'}
      });
      return;
    }
    dispatch({
      type: 'shippingDetail/updateState',
      payload: {
        isBtnDisabled: true
      }
    })
    dispatch({
      type: 'shippingDetail/divideExpense',
      payload: {
        id: expenseDivide.id,
        typeId: document.getElementById("selectedId").value,
        expensePrice: expenseDivide.expensePrice,
        totalWeight: expenseDivide.totalWeight,
        totalCapacity: expenseDivide.totalCapacity,
        divideList: expenseDivideList
      }
    })
  }
  const modalDivideProps = {
    title: '??????????????',
    visible: isDivideModalOpen,
    onCancel: closeDivideModal,
    onOk: handleDivideSubmit,
    width: 1100
  }
  const customRequest = (options) => {
    dispatch({
      type: 'shippingDetail/updateState',
      payload: {
        loadingFile: true
      }
    })
    if (modalType === 'create') {
      dispatch({
        type: 'shippingDetail/uploadAttachment',
        payload: {
          file: options.file,
          fileUpload: true,
          type: options.file.type
        }
      })
    } else {
      dispatch({
        type: 'shippingDetail/uploadDocumentAttachment',
        payload: {
          id: currentItem.id,
          file: options.file,
          fileUpload: true,
          type: options.file.type
        }
      })
    }
  }
  const uploadChange = (options) => {
    if (options.file.status === 'removed'){
      if (modalType === 'create') {
        dispatch({
          type: 'shippingDetail/deleteAttachment',
          payload: {
            id: options.file.id
          }
        })
      } else {
        dispatch({
          type: 'shippingDetail/deleteDocumentAttachment',
          payload: {
            docId: currentItem.id,
            id: options.file.id
          }
        })
      }
    }
  }
  const pushToPage = (key) => {
    dispatch({
      type: 'shippingDetail/pushToPage',
      payload: {key}
    })
  }
  const onChange = (key) => {
    dispatch({type: 'shippingDetail/query' + key, payload: {id: shippingId}});
  }
  const handleSubmit = (values) => {
    dispatch({
      type: 'shippingDetail/updateState',
      payload: {isBtnDisabled: true}
    })

    if (modalType !== 'create')
      values = {...values, id: currentItem.id}

    if (values.date !== undefined && values.date !== '')
      values.date = values.date.format('DD.MM.YYYY HH:mm:ss');

    dispatch({
      type: 'shippingDetail/save' + model,
      payload: {
        ...values,
        ownerId: shippingId,
        attachments: documentAttachments
      }
    })
  }
  const handleInvoiceSubmit = (values) => {
    dispatch({
      type: 'shippingDetail/updateState',
      payload: {isBtnDisabled: true}
    })

    if (modalType === 'create')
      values = {...values, expenseId: currentItem.expenseId, type: 2}
    else
      values = {...values, type: 1}

    dispatch({
      type: 'shippingDetail/saveInvoice',
      payload: {
        ...values,
        shippingId
      }
    })
  }
  const columns = [
    ...visibleColumns,
    {
      title: '????????????????',
      key: 'operation',
      width: 100,
      // fixed: 'right',
      align: 'center',
      render: (text, record) => (
        <Space size="middle">
          {model !== 'Cargo' ?
            <Tooltip title="??????????????????????????" placement={"bottom"} color={"#1f75a8"}>
              <FormOutlined onClick={() => handleEdit(record.id)}/>
            </Tooltip>: ''}
          <Popconfirm title="???????????????" onConfirm={() => handleDelete(record.id)} okText="????" cancelText="??????">
            <Tooltip title="??????????????" placement={"bottom"} color={"red"}>
              <DeleteOutlined style={{color: 'red'}}/>
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];
  const expenseColumns = [
    ...visibleColumns,
    {
      title: '????????????????',
      key: 'operation',
      width: 100,
      // fixed: 'right',
      align: 'center',
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="??????????????" placement={"bottom"} color={"purple"}>
            <ApartmentOutlined onClick={() => openDivideModal(record.id)}/>
          </Tooltip>
          {record.invoiceInId === null
            ? <Tooltip title="???????????????? ???????????????????? ????????" placement={"bottom"} color={"cyan"}>
              <BsCircleFill style={{color:'gold'}}/>
              <BsJournalArrowDown onClick={() => openExpenseInvoiceModal(record.id)}/>
            </Tooltip>
            : <div>
              <BsCircleFill style={{color:'springgreen'}}/>
              <BsJournalArrowDown />
            </div>
          }
          <Tooltip title="??????????????????????????" placement={"bottom"} color={"#1f75a8"}>
            <FormOutlined onClick={() => handleEdit(record.id)}/>
          </Tooltip>
          <Popconfirm title="???????????????" onConfirm={() => handleDelete(record.id)} okText="????" cancelText="??????">
            <Tooltip title="??????????????" placement={"bottom"} color={"red"}>
              <DeleteOutlined style={{color: 'red'}}/>
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];
  const handleEdit = (id) => {
    // this.setBtnEnabled();
    dispatch({
      type: 'shippingDetail/get' + model + 'ById',
      payload: {id}
    })
  };
  const handleDelete = (id) => {
    dispatch({
      type: 'shippingDetail/delete' + model + 'ById',
      payload: {
        shippingId,
        id
      }
    })
  }
  const getTotals = () => {
    let weight = 0;
    let capacity = 0;
    let amount = 0;
    cargoList.forEach(item => {
      item.cargoDetails && item.cargoDetails.forEach(detail => {
        weight += detail.weight;
        capacity += detail.capacity;
        amount += detail.packageAmount;
      })
    })
    return ' ??????: ' + weight + '; ??????????: ' + capacity + '; ??????-???? ????.: ' + amount;
  }
  const getTotalCapacity = () => {
    let capacity = 0;
    cargoList.forEach(item => {
      item.cargoDetails && item.cargoDetails.forEach(detail => {
        capacity += detail.capacity;
      })
    })
    capacity = currentModel && currentModel.shippingTypeCapacity - capacity;
    return capacity > 0 ? '+' + capacity : capacity;
  }
  const getTotalWeight = () => {
    let weight = 0;
    cargoList.forEach(item => {
      item.cargoDetails && item.cargoDetails.forEach(detail => {
        weight += detail.weight;
      })
    })
    weight = currentModel && currentModel.shippingTypeWeight - weight;
    return weight > 0 ? '+' + weight : weight;
  }

  const carrierColumns = [
    {
      title: '????????????????',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '????????????????????',
      dataIndex: 'carrierName',
      key: 'carrierName',
    },
    {
      title: '????????',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '????????????????',
      key: 'operation',
      width: 100,
      align: 'center',
      render: (text, record) => (
        <Space size="middle">
          {record.invoiceInId === null
            ? <Tooltip title="???????????????? ???????????????????? ????????" placement={"bottom"} color={"cyan"}>
              <BsCircleFill style={{color:'gold', display: "block"}}/>
              <BsJournalArrowDown onClick={openInvoiceModal} />
            </Tooltip>
            : <div>
              <BsCircleFill style={{color:'springgreen', display: "block"}}/>
              <BsJournalArrowDown />
            </div>
          }
        </Space>
      )
    }
  ];
  const carrierData = [
    {
      id: currentModel && currentModel.id,
      name: '???????????????????????? ???????????? ( ????????)',
      carrierName: currentModel && currentModel.carrierName,
      price: currentModel && currentModel.finalPrice !== null && (currentModel.finalPrice + ' USD (' + currentModel.price + ' ' + currentModel.currencyName + ')'),
      invoiceInId: currentModel && currentModel.invoiceInId
    }
  ]
  const openExpenseInvoiceModal = (id) => {
    dispatch({
      type: 'shippingDetail/getExpenseForInvoiceById',
      payload: {id}
    })
  }
  const openInvoiceModal = () => {
    dispatch({
      type: 'shippingDetail/updateState',
      payload: {
        isAddInvoiceModalOpen: !isAddInvoiceModalOpen,
        modalType: 'update',
        currentItem: {
          price: currentModel.price,
          rate: currentModel.rate,
          currencyId: currentModel.currencyId,
          finalPrice: currentModel.finalPrice,
          comment: currentModel.comment
        },
      }
    })
  }
  const closeAddInvoiceModal = () => {
    dispatch({
      type: 'shippingDetail/updateState',
      payload: {
        isAddInvoiceModalOpen: !isAddInvoiceModalOpen,
        currentItem: null,
      }
    })
  }
  const modalAddInvoiceProps = {
    title: modalType === 'create' ? '???????????????? ???????????????????? ????????' : '?????????????????????????? ???????????????????? ????????',
    visible: isAddInvoiceModalOpen,
    onCancel: closeAddInvoiceModal
  }




  return (
    <div className="order-page">
      <Card style={{width: '100%'}} bordered={false}>
        <Tabs onChange={pushToPage} defaultActiveKey="/order/shipping">
          <Tabs.TabPane tab="??????????????" key="/order/request">?????????????????? ???????????????????? ...</Tabs.TabPane>
          <Tabs.TabPane tab="????????????" key="/order">?????????????????? ???????????????????? ...</Tabs.TabPane>
          <Tabs.TabPane tab="??????????" key="/order/cargo">?????????????????? ???????????????????? ...</Tabs.TabPane>
          <Tabs.TabPane tab="??????????" key="/order/shipping">
            <Row className="shipping-detail-page">
              <Col span={5}>
                <Card style={{width: '100%'}} bordered={false}>
                  <div className="row">
                    <div className="col-md-12">
                      <Space className="float-left mt-1">?????????? ??????????: {currentModel && currentModel.num}</Space>
                      <Button className="float-right" outline color="primary" size="sm" >??????????????????????????</Button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <table className='table-bordered table-striped'>
                        <tbody>
                        <tr><td>????????????????:</td><td>{currentModel && currentModel.managerName}</td></tr>
                        <tr><td>????????????????????:</td><td>{currentModel && currentModel.carrierName}</td></tr>
                        <tr><td>????????:</td><td>{currentModel && currentModel.finalPrice !== null && (currentModel.finalPrice + ' USD (' + currentModel.price + ' ' + currentModel.currencyName + ')')}</td></tr>
                        <tr><td>?????? ????????????????????:</td><td>{currentModel && currentModel.shippingTypeName}</td></tr>
                        <tr><td>?????????? ????????????????????:</td><td>{currentModel && currentModel.shippingNum}</td></tr>
                        <tr><td>???????? ????????????????:</td><td>{currentModel && currentModel.loadDate}</td></tr>
                        <tr><td>???????? ??????????????????:</td><td>{currentModel && currentModel.unloadDate}</td></tr>
                        <tr><td>???????????????????? ??????????:</td><td>{currentModel && currentModel.shippingTypeCapacity} ??3 ({getTotalCapacity()})</td></tr>
                        <tr><td>???????????????????? ??????:</td><td>{currentModel && currentModel.shippingTypeWeight} ???? ({getTotalWeight()})</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                </Card>
              </Col>
              <Col span={19}>
                <Card style={{width: '100%'}} bordered={false}>
                  <Tabs onChange={onChange}>
                    <Tabs.TabPane tab="??????????" key="Cargo">
                      <Row>
                        <Col span={8} offset={8}>
                          <Space className="text-center shipping-cargo-header"><b>?????????? ????????????:</b>{getTotals()}</Space>
                        </Col>
                      </Row>
                      <Table columns={columns} dataSource={cargoList} bordered size="middle" rowKey={record => record.id}
                             pagination={false}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="??????????????????" key="Document">
                      <Button className="float-right" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> ????????????????</Button>
                      <Table columns={columns} dataSource={documentList} bordered size="middle" rowKey={record => record.id}
                             pagination={false}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="??????????" key="Account">
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="??????????????" key="Expense">
                      <Table style={{marginBottom: '15px'}}
                        columns={carrierColumns} dataSource={carrierData} bordered size="middle" rowKey={record => record.id}
                        pagination={false}/>
                      <Button className="float-right" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> ????????????????</Button>
                      <Table
                        columns={expenseColumns} dataSource={expenseList} bordered size="middle" rowKey={record => record.id}
                        pagination={false}/>
                    </Tabs.TabPane>

                  </Tabs>
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab="????????????????????????" key="/order/tracking">?????????????????? ???????????????????? ...</Tabs.TabPane>
        </Tabs>
      </Card>

      {isModalOpen &&
      <DocumentModal {...modalProps}
             isBtnDisabled={isBtnDisabled} loadingFile={loadingFile} handleSubmit={handleSubmit} currentItem={currentItem}
             documentAttachments={documentAttachments} customRequest={customRequest} uploadChange={uploadChange}
      />}
      {isModalOpen && model === 'Expense' &&
      <ExpenseModal
        {...modalProps}
        handleSubmit={handleSubmit} isBtnDisabled={isBtnDisabled} currentItem={currentItem} ownerType={'Shipping'}
        carrierList={carrierList} currencyList={currencyList} expenseNameList={expenseNameList}/>
      }
      {isDivideModalOpen &&
        <DivideModal
          {...modalDivideProps}
          expenseDivideList={expenseDivideList} isBtnDisabled={isBtnDisabled} onChange={handleDivideChange} expenseDivide={expenseDivide}
        />
      }
      {isAddInvoiceModalOpen &&
        <InvoiceModal
          {...modalAddInvoiceProps} headerText={currentItem ? currentItem.carrierName : currentModel ? currentModel.carrierName : ''}
          currencyList={currencyList} currentItem={currentItem} handleSubmit={handleInvoiceSubmit} isBtnDisabled={isBtnDisabled}
        />
      }

    </div>
  )
};

ShippingDetail.propTypes = {
  shippingDetail: PropTypes.object,
  dispatch: PropTypes.func
};

export default connect(({shippingDetail}) => ({shippingDetail}))(ShippingDetail)
