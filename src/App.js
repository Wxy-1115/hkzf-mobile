import React, { lazy, Suspense } from 'react';
// import { Button } from "antd-mobile";
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Home from "./pages/Home";
// import CityList from "./pages/CityList";
// import Map from "./pages/Map";
// import Detail from './pages/HouseDetail';
// import Login from './pages/Login';
// import AuthRoute from './components/AuthRoute';
// import Favorite from './pages/Favorite';
// import Rent from './pages/Rent';
// import RentAdd from './pages/Rent/Add';
// import RentSearch from './pages/Rent/Search';

// 动态加载路由组件
const CityList = lazy(() => import('./pages/CityList'))
const Map = lazy(() => import("./pages/Map"))
const Detail = lazy(() => import('./pages/HouseDetail'))
const Login = lazy(() => import('./pages/Login'))
const AuthRoute = lazy(() => import('./components/AuthRoute'))
const Favorite = lazy(() => import('./pages/Favorite'))
const Rent = lazy(() => import('./pages/Rent'))
const RentAdd = lazy(() => import('./pages/Rent/Add'))
const RentSearch = lazy(() => import('./pages/Rent/Search'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="router-loading">loading...</div>}>
        <div className="App">
          <Route exact path='/' render={() => <Redirect to="/home" />}></Route>
          <Route path='/home' component={Home}></Route>
          <Route path='/citylist' component={CityList}></Route>
          <Route path='/map' component={Map}></Route>
          <Route path='/detail/:id' component={Detail}></Route>
          <Route path='/login' component={Login}></Route>

          {/* <AuthRoute></AuthRoute> */}
          <AuthRoute path='/favorite' component={Favorite}></AuthRoute>
          <AuthRoute path='/rent' exact component={Rent}></AuthRoute>
          <AuthRoute path='/rent/add' component={RentAdd}></AuthRoute>
          <AuthRoute path='/rent/search' component={RentSearch}></AuthRoute>
        </div>
      </Suspense>
    </Router>
  );
}

export default App;
