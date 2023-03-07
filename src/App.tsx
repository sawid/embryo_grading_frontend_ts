import React from 'react';
import { HashRouter as Router, Route, Link, Routes } from 'react-router-dom'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/home.component';
import MatchData from './components/matchdata.component';
import { currentUser } from './components/function.component/authen.function';
import { useRecoilState } from 'recoil';
import UserRoute from './components/route/UserRoute';
import { useDispatch } from 'react-redux';

function App() {

  const dispatch = useDispatch();
  
  const idtoken = localStorage.token;
  if (idtoken) {
    currentUser(idtoken)
    .then(res => {
      console.log(res.data);
      dispatch({
        type:'LOGIN',
        payload: {
          token: idtoken,
          username: res.data.username,
        }
      });
    })
    .catch(err => {
      console.log(err);
    })
  }

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matchdata" element={<UserRoute><MatchData /></UserRoute>} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
