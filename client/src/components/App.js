import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MessageList from './Message/MessageList';
import './App.css';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={MessageList} />
      </Switch>
    </div>
  );
}

export default App;
