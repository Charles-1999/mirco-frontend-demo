import { loadMicroApp } from 'qiankun';

const app1 = loadMicroApp(
  { name: 'antd', entry: '//localhost:7077', container: '#antd'},
  {
    sandbox: {

    }
  }
)

const app2 = loadMicroApp(
  { name: 'antd', entry: '//localhost:7078', container: '#fusion'},
  {
    sandbox: {

    }
  }
)
