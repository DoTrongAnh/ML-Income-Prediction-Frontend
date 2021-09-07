import React from 'react';
import './App.css';
import {Switch, Route} from 'react-router-dom';
import IncomeClassifier from './IncomeClassifier';
import PremiumInsurance from './PremiumInsurance';
import MachineTranslation from './MachineTranslation';

const Main = () => (
  <Switch>
        <Route exact path='/' component={Home}></Route>
        <Route exact path='/income_classiifier' component={IncomeClassifier}></Route>
        <Route exact path='/premium_insurance' component={PremiumInsurance}></Route>
        <Route exact path='/machine_translation' component={MachineTranslation}></Route>
      </Switch>
  );
const Home = () => (
      <div className='home'>
        <h1>Welcome to my portfolio website</h1>
        <p>Listing Machine Learning webpages for different use cases.</p>
      </div>
    );

export default Main;