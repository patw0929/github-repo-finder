import React from 'react';
import Header from './app/header';
import '../style/style.scss';

const App = (props) =>
  <div>
    <Header />

    <main className="container">
      {props.children}
    </main>
  </div>;

export default App;
