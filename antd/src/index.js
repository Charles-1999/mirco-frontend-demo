import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './public-path'

export async function bootstrap() {
  console.log('[antd demo] react app bootstraped');
}

export async function mount(props = {}) {
  console.log('[antd demo] props from main framework', props);
  const { container } = props;
  ReactDOM.render(
    <App />,
    container ? container.querySelector('#antdRoot') : document.getElementById('antdRoot'),
  );
  import('./dynamic.css').then(() => {
    console.log('[antd demo] dynamic style load');
  });
}

// 增加 update 钩子以便主应用手动更新微应用
export async function update(props) {
  console.log('update [antd demo] props from main framework', props);
  const { container } = props;
  ReactDOM.render(
    <App />,
    container ? container.querySelector('#antdRoot') : document.getElementById('antdRoot'),
  );
  import('./dynamic.css').then(() => {
    console.log('[antd demo] dynamic style load');
  });
}

export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(
    container ? container.querySelector('#antdRoot') : document.getElementById('antdRoot'),
  );
}

if (!window.__POWERED_BY_QIANKUN__) {
  bootstrap().then(mount);
}
