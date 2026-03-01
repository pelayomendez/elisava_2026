import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Master from "./Master";
import Home from './Home';
import About from './About';
import Contact from './Contact';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      data:"Akhil"
    }
  }
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
            <nav>
              <Link to="/">Home</Link> | <Link to="/about">About</Link> | <Link to="/contact">Contact</Link>
            </nav>
          </header>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
          </Switch>
          <p className="App-intro">
            <Master sample={this.state.data}/>
          </p>
        </div>
      </Router>
    );
  }
}

export default App;
