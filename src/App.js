import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './App.css';

import Home from './Pages/Home'
import Admin from './Pages/Admin'
import SpeedTrivia from './Pages/SpeedTrivia'
import Style from './Pages/Style'
import Navigation from './Pages/Navigation'
import MusicPlayer from './Pages/MusicPlayer'

export default function BibleGames() {
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
          <Route path="/music">
            <MusicPlayer />
          </Route>
        </Switch>
        <Navigation />
    </Router>
  );
}