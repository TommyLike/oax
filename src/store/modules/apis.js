import * as types from '../types'
import yqlProxy from '../../utils/yql-proxy'
import axios from 'axios'

const LIST = 'https://api.apis.guru/v2/list.json'

export const state = {
  apis: null
}

export const mutations = {
  [types.SET_APIS] (state, payload) {
    state.apis = payload
  }
}

let loadingApis = false

export const actions = {
  [types.LOAD_APIS] ({commit}) {
    if (loadingApis || state.apis) {
      return
    }

    loadingApis = true
    let proxy = false

    if (proxy) {
      yqlProxy(LIST).then(res => {
        const data = res.data.query.results.json
        const apis = getApis(data)
        loadingApis = false
        commit(types.SET_APIS, apis)
      })
    } else {
      axios.get(LIST).then(res => {
        const data = res.data
        const apis = getApis(data)
        loadingApis = false
        commit(types.SET_APIS, apis)
      })
    }

    function getApis (data) {
      const apis = []

      for (let key in data) {
        const versions = Object.keys(data[key].versions)
        versions.sort()
        let v = data[key].versions[versions[0]]

        let title = (v.info && v.info.title) || key
        let url = v.swaggerUrl

        apis.push({title, key, url})
      }

      apis.sort((a, b) => a.key.localeCompare(b.key))

      return apis
    }
  }
}

export const getters = {
  [types.APIS]: (state) => state.apis
}

export default {
  state,
  mutations,
  getters,
  actions
}
