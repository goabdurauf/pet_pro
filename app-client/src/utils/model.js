import modelExtend from 'dva-model-extend'

export const model = {
  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  }
};

export const pageModel = modelExtend(model, {
  state: {
    list: [],
    columns: [],
    pagination: {
      showTotal: total => `Total ${total} Items`,
      current: 0,
      total: 0,
      pageSize: 10,
    },
  },

  reducers: {
    querySuccess(state, {payload}) {
      const {list, pagination} = payload;
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
  },

});

export const tableModel = modelExtend(pageModel, {
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    languages: [],
  },
  effects: {

  },

  reducers: {
  }
});

