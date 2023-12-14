import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      env: window.sessionStorage.getItem('env') || 'test',
    }
  },
  getters: {
  },
  mutations: {
    changeEnv(state: any, env: string) {
      state.env = env
      window.sessionStorage.setItem('env', env)
    }
  },
  actions: {
  },
  modules: {
  }
})
