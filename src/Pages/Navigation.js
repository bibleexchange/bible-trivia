import React from 'react';
import {
  Link
} from "react-router-dom";
import "./Navigation.css";

function Navigation() {

  return (
<ul id="nav">
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/speed-trivia">Speed Trivia</Link>
    </li>
    <li>
      <Link to="/admin">Admin</Link>
    </li>
  </ul>
  );
}

export default Navigation;