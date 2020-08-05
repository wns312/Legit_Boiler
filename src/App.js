import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LandingPage from './components/LandingPage/LandingPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import Namespaces from './components/Namespaces/Namespaces';
import UserModify from './components/UserModify/UserModify';
import Auth from "./hoc/auth"
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Auth(LandingPage, true)}/>
        <Route exact path="/login" component={Auth(LoginPage, false)}/>
        <Route exact path="/register" component={Auth(RegisterPage, false)}/>
        <Route exact path="/chat" component={Auth(Namespaces, true)}/>
        <Route exact path="/usermodify" component={Auth(UserModify, true)}/>
      </Switch>
    </Router>
  );
}

export default App;
