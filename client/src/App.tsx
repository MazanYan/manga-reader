import React, { useEffect } from 'react';
import './App.css';
import MainComponent from "./Components/MainComponent";
import { BrowserRouter } from 'react-router-dom';

const TITLE = 'Manga Reader';

function App() {
  useEffect(() => {
    document.title = TITLE;
  });

  return (
    <div className="App">
      <BrowserRouter>
        <MainComponent/>
      </BrowserRouter>
    </div>
  );
}

export default App;
