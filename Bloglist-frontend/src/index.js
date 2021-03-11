import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from './store'

ReactDOM.render(
  <div className="container">
    <Provider store={store}>
      <App />
    </Provider>
  </div>,
     document.getElementById('root'))