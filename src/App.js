import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css';

import Home from './Pages/Home'
import Admin from './Pages/Admin'
import SpeedTrivia from './Pages/SpeedTrivia'
import Style from './Pages/Style'
import Navigation from './Pages/Navigation'

export default function BasicExample() {
  return (
    <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/speed-trivia/:questionId?">
            <SpeedTrivia />
          </Route>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/style">
            <Style />
          </Route>
        </Switch>
        <Navigation />
    </Router>
  );
}