export default ({
  namespace: 'login',
  state: {},
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
      });
    },
  },
  effects: {
  },
  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    }
  }
})
