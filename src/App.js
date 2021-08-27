import './App.css';
import React from "react";
import { NavLink} from 'react-router-dom';
import Main from './Main';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Main />
    </div>
  );
}

const Navigation = () => (
      <nav>
        <ul>
          <li><NavLink exact activeClassName="current" to='/'>Home</NavLink></li>
          <li><NavLink exact activeClassName="current" to='/income_classiifier'>Income Classifier</NavLink></li>
          <li><NavLink exact activeClassName="current" to='/premium_insurance'>Premium Insurance</NavLink></li>
        </ul>
      </nav>
    );

export default App;