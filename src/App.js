import React from 'react';
// import { Button } from "antd-mobile";
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import CityList from "./pages/CityList";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Detail from './pages/HouseDetail';
import Login from './pages/Login';
import AuthRoute from './components/AuthRoute';
import Favorite from './pages/Favorite';

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path='/' render={() => <Redirect to="/home" />}></Route>
        <Route path='/home' component={Home}></Route>
        <Route path='/citylist' component={CityList}></Route>
        <Route path='/map' component={Map}></Route>
        <Route path='/detail/:id' component={Detail}></Route>
        <Route path='/login' component={Login}></Route>
        <AuthRoute path='/favorite' component={Favorite}></AuthRoute>
        {/* <AuthRoute></AuthRoute> */}
      </div>
    </Router>
  );
}

export default App;
