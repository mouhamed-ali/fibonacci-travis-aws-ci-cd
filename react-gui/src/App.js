import React from "react";
import logo from "./logo.svg";
import "./App.css";
export { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Fib from "./components/Fib";
import AboutUs from "./components/AboutUs";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Welcome to <code>React</code>
          </p>
          <Link to="/">Home</Link>
          <Link to="/about-us">About us</Link>
        </header>
        <div>
          <Route exact path="/" component={Fib} />
          <Route path="/about-us" component={AboutUs} />
        </div>
      </div>
    </Router>
  );
}

export default App;
