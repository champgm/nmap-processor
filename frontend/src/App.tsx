import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { HostsApi } from './api/HostsApi';
import { HostList } from './components/HostList';

const hostsApi = new HostsApi();

const App: React.FC = () => {
  return (
    <div className="App">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      {/* <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <HostList hostsApi={hostsApi} ></HostList>
    </div>
  );
}

export default App;
