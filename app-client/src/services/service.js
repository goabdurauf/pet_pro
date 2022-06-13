import {request} from 'utils'

export function userMe(data) {return request({url: '/api/user/me', data,})}
export function signIn(data) {return request({url: '/api/auth/login', method: 'post', data,});}

export function saveUser(data) {return request({url: '/api/user/save', method: 'post', data})}
export function getUserList() {return request({url: '/api/user/list', method: 'get',})}
export function getUserById(id) {return request({url: '/api/user/' + id, method: 'get',})}
export function deleteUserById(id) {return request({url: '/api/user/delete/' + id, method: 'delete',})}
export function getManagers() {return request({url: '/api/user/manager', method: 'get',})}
export function getRoleList() {return request({url: '/api/user/role', method: 'get',})}

export function saveListItem(data) {return request({url: '/api/list/save', method: 'post', data})}
export function deleteListItemById(id) {return request({url: '/api/list/delete/' + id, method: 'delete',})}
export function getListItems(type) {return request({url: '/api/list/' + type, method: 'get',})}
export function getListItemById(id) {return request({url: '/api/list/item/' + id, method: 'get',})}

export function saveProduct(data) {return request({url: '/api/product/save', method: 'post', data})}
export function getProductList() {return request({url: '/api/product/list', method: 'get',})}
export function getProductById(id) {return request({url: '/api/product/' + id, method: 'get',})}
export function deleteProductById(id) {return request({url: '/api/product/' + id, method: 'delete',})}
export function searchProduct(word) {return request({url: '/api/product/search?word=' + word, method: 'get'})}
export function deleteAttachmentFromProductById(data) {return request({url: '/api/product/' + data.docId + '/attachment/' + data.id, method: 'delete'})}

export function saveClient(data) {return request({url: '/api/client/save', method: 'post', data})}
export function getClientList() {return request({url: '/api/client/list', method: 'get',})}
export function getClientById(id) {return request({url: '/api/client/' + id, method: 'get',})}
export function deleteClientById(id) {return request({url: '/api/client/' + id, method: 'delete',})}
export function getClientDataForDashboard(days) {return request({url: '/api/client/dashboard?days=' + days, method: 'get'})}

export function saveSupplier(data) {return request({url: '/api/supplier/save', method: 'post', data})}
export function getSupplierList() {return request({url: '/api/supplier/list', method: 'get',})}
export function getSupplierById(id) {return request({url: '/api/supplier/' + id, method: 'get',})}
export function deleteSupplierById(id) {return request({url: '/api/supplier/' + id, method: 'delete',})}

export function saveCarrier(data) {return request({url: '/api/carrier/save', method: 'post', data})}
export function getCarrierList() {return request({url: '/api/carrier/list', method: 'get',})}
export function getCarrierById(id) {return request({url: '/api/carrier/' + id, method: 'get',})}
export function deleteCarrierById(id) {return request({url: '/api/carrier/' + id, method: 'delete',})}

export function saveShipping(data) {return request({url: '/api/shipping/save', method: 'post', data})}
export function getShippingList() {return request({url: '/api/shipping/list', method: 'get',})}
export function getShippingListByOrderId(id) {return request({url: '/api/shipping/order/' + id, method: 'get',})}
export function getShippingById(id) {return request({url: '/api/shipping/' + id, method: 'get',})}
export function getShippingDetailById(id) {return request({url: '/api/shipping/detail/' + id, method: 'get',})}
export function deleteShippingById(id) {return request({url: '/api/shipping/' + id, method: 'delete',})}
export function deleteCargoFromShippingById(data) {return request({url: '/api/shipping/' + data.shippingId + '/cargo/' + data.id, method: 'delete'})}
export function addShippingDocument(data) {return request({url: '/api/shipping/document', method: 'post', data})}
export function deleteDocumentFromShippingById(data) {return request({url: '/api/shipping/' + data.shippingId + '/document/' + data.id, method: 'delete'})}
export function addShippingExpense(data) {return request({url: '/api/shipping/expense', method: 'post', data})}
export function getShippingExpenses(id) {return request({url: '/api/shipping/expense/' + id, method: 'get',})}
export function deleteExpenseFromShippingById(id) {return request({url: '/api/shipping/expense/' + id, method: 'delete',})}
export function getShippingExpenseDivide(data) {return request({url: '/api/shipping/' + data.shippingId + '/expense/divide/' + data.id, method: 'get',})}

export function getDocumentById(id) {return request({url: '/api/document/' + id, method: 'get'})}
export function deleteAttachmentFromDocumentById(data) {return request({url: '/api/document/' + data.docId + '/attachment/' + data.id, method: 'delete'})}
export function addAttachmentToDocument(data) {return request({url: '/api/document/' + data.id + '/attachment', method: 'post', data})}
export function saveDocument(data) {return request({url: '/api/document/add', method: 'post', data})}

export function saveOrder(data) {return request({url: '/api/order/save', method: 'post', data})}
export function getOrderList(data) {return request({url: '/api/order/list', method: 'post', data})}
export function getSelectOrders() {return request({url: '/api/order/select', method: 'get'})}
export function getOrderById(id) {return request({url: '/api/order/' + id, method: 'get',})}
export function getOrderDetailById(id) {return request({url: '/api/order/detail/' + id, method: 'get',})}
export function deleteOrderById(id) {return request({url: '/api/order/' + id, method: 'delete',})}
export function downloadOrder(data) { return request({url: '/api/order/report', method: 'get'}) }

export function uploadFile(data) {return request({url: '/api/file', method: 'post', data})}
export function deleteFile(id) {return request({url: '/api/file/' + id, method: 'delete'})}

export function saveCargo(data) {return request({url: '/api/cargo/save', method: 'post', data})}
export function cloneCargo(data) {return request({url: '/api/cargo/clone', method: 'post', data})}
export function setCargoStatus(data) {return request({url: '/api/cargo/status', method: 'post', data})}
export function getCargoList() {return request({url: '/api/cargo/list', method: 'get',})}
export function getCargoListByOrderId(id) {return request({url: '/api/cargo/order/' + id, method: 'get',})}
export function getCargoDocumentByOrderId(id) {return request({url: '/api/cargo/document/' + id, method: 'get',})}
export function getCargoById(id) {return request({url: '/api/cargo/' + id, method: 'get',})}
export function deleteCargoById(id) {return request({url: '/api/cargo/' + id, method: 'delete',})}
export function addCargoDocument(data) {return request({url: '/api/cargo/document', method: 'post', data})}
export function getSelectOrderCargos(id) {return request({url: '/api/cargo/select/order/' + id, method: 'get'})}
export function getCargoDocument(id) {return request({url: '/api/cargo/doc/' + id, method: 'get'})}
export function deleteDocumentFromCargo(data) {return request({url: '/api/cargo/' + data.orderId + '/document/' + data.id, method: 'delete',})}
export function addCargoExpense(data) {return request({url: '/api/cargo/expense', method: 'post', data})}
export function getCargoExpenseByOrderId(id) {return request({url: '/api/cargo/expense/' + id, method: 'get',})}
export function deleteExpenseFromCargoById(id) {return request({url: '/api/cargo/expense/' + id, method: 'delete',})}
export function divideShippingExpenseToCargos(data) {return request({url: '/api/cargo/expense/divide', method: 'post', data})}
export function getCargoForInvoiceById(id) {return request({url: '/api/cargo/' + id + '/invoice', method: 'get',})}

export function saveCargoTracking(data) {return request({url: '/api/shipping/tracking', method: 'post', data})}
export function getCargoTrackingList() {return request({url: '/api/shipping/tracking', method: 'get'})}
export function getCargoTrackingById(id) {return request({url: '/api/shipping/tracking/' + id, method: 'get'})}

export function getExpenseById(id) {return request({url: '/api/expense/' + id, method: 'get',})}
export function getExpenseForInvoiceById(id) {return request({url: '/api/expense/' + id + '/invoice', method: 'get',})}
export function getExpenseForInvoiceInById(id) {return request({url: '/api/expense/' + id + '/invoicein', method: 'get',})}

export function saveInvoice(data) {return request({url: '/api/invoice/save', method: 'post', data})}
export function updateInvoice(data) {return request({url: '/api/invoice/update', method: 'put', data})}
export function getInvoiceList(data) {return request({url: '/api/invoice/list/' + data.type, method: 'get',})}
export function getInvoicesByTypeAndClientId(data) {return request({url: '/api/invoice/' + data.type + '/' + data.clientId, method: 'get'})}
export function getInvoicesByTypeAndClientIdAndCurrencyId(data) {return request({url: '/api/invoice/' + data.type + '/' + data.clientId + '/' + data.currencyId, method: 'get'})}
export function getInvoiceById(id) {return request({url: '/api/invoice/' + id, method: 'get',})}
export function deleteInvoiceById(id) {return request({url: '/api/invoice/' + id, method: 'delete',})}

export function saveKassa(data) {return request({url: '/api/kassa/save', method: 'post', data})}
export function getKassaList() {return request({url: '/api/kassa/list', method: 'get',})}
export function getKassaById(id) {return request({url: '/api/kassa/' + id, method: 'get',})}
export function deleteKassaById(id) {return request({url: '/api/kassa/' + id, method: 'delete',})}

export function saveTransactionIn(data) {return request({url: '/api/transaction/in/save', method: 'post', data})}
export function updateTransactionIn(data) {return request({url: '/api/transaction/in/update', method: 'put', data})}
export function saveTransactionOut(data) {return request({url: '/api/transaction/out/save', method: 'post', data})}
export function updateTransactionOut(data) {return request({url: '/api/transaction/out/update', method: 'put', data})}
export function getTransactionList() {return request({url: '/api/transaction/list', method: 'get',})}
export function getTransactionById(id) {return request({url: '/api/transaction/' + id, method: 'get',})}
export function getTransactionNextNum() {return request({url: '/api/transaction/num', method: 'get',})}

export function getClientBalances() {return request({url: '/api/balances/client', method: 'get'})}
export function getCarrierBalances() {return request({url: '/api/balances/carrier', method: 'get'})}
export function getBalancesByDate(date) {return request({url: '/api/balances/bar/date?date=' + date, method: 'get'})}
export function getClientVerificationActs() {return request({url: '/api/balances/client/verification', method: 'get'})}
export function getCarrierVerificationActs() {return request({url: '/api/balances/carrier/verification', method: 'get'})}
export function getIncomeByShipping() {return request({url: '/api/balances/shipping/income', method: 'get'})}
