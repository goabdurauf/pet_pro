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

export function saveClient(data) {return request({url: '/api/client/save', method: 'post', data})}
export function getClientList() {return request({url: '/api/client/list', method: 'get',})}
export function getClientById(id) {return request({url: '/api/client/' + id, method: 'get',})}
export function deleteClientById(id) {return request({url: '/api/client/' + id, method: 'delete',})}

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
export function deleteShippingById(id) {return request({url: '/api/shipping/' + id, method: 'delete',})}

export function saveOrder(data) {return request({url: '/api/order/save', method: 'post', data})}
export function getOrderList(data) {return request({url: '/api/order/list', method: 'post', data})}
export function getSelectOrders() {return request({url: '/api/order/select', method: 'get'})}
export function getOrderById(id) {return request({url: '/api/order/' + id, method: 'get',})}
export function deleteOrderById(id) {return request({url: '/api/order/' + id, method: 'delete',})}

export function uploadFile(data) {return request({url: '/api/file', method: 'post', data})}
export function deleteFile(id) {return request({url: '/api/file/' + id, method: 'delete'})}

export function saveCargo(data) {return request({url: '/api/cargo/save', method: 'post', data})}
export function getCargoList() {return request({url: '/api/cargo/list', method: 'get',})}
export function getCargoListByOrderId(id) {return request({url: '/api/cargo/order/' + id, method: 'get',})}
export function getCargoById(id) {return request({url: '/api/cargo/' + id, method: 'get',})}
export function deleteCargoById(id) {return request({url: '/api/cargo/' + id, method: 'delete',})}


