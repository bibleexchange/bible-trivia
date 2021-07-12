import './Index.css';
import React, { useState } from 'react';
import Navigation from '../Navigation'
import {
  Link
} from "react-router-dom";

function Index() {

const [data, setData] = useState({});

  return (
    <div>
      <h1>Home</h1>
        <hr />
    </div>
  );
}

export default Index;
