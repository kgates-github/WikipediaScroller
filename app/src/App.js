import './App.css';
import GestureCapturer from './components/GestureCapturer';
import Log from './components/Log';
import React, { useState, useRef } from 'react';
import { GlobalContext } from './components/GlobalContext';
import WikipediaExplorer from './components/WikipediaExplorer3';

function App() {
  const userAgent = navigator.userAgent;
  const [logEntries, setLogEntries] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [introDisplay, setIntroDisplay] = useState('none');
  const GLOBAL_WIDTH = useRef(600);

  const log = (entry) => {
    setLogEntries(prevEntries => [...prevEntries, entry]);
  }

  // Set up our custom gesture events
  const subscribe = (eventName, listener) => {
    //console.log('Subscribing to ' + eventName);
    document.addEventListener(eventName, listener);
  }
  
  const unsubscribe = (eventName, listener) => {
    //console.log('Unsubscribing from ' + eventName);
    document.removeEventListener(eventName, listener);
  }
  
  const publish = (eventName, data) => {
    const event = new CustomEvent(eventName, { detail: data });
    //console.log('publishing event', eventName, data);
    document.dispatchEvent(event);
  }

  return (
    <GlobalContext.Provider value={{GLOBAL_WIDTH}}>
    { (userAgent.indexOf("Chrome") > -1) ? 
      <div className="App">
        {/*<GestureCapturer 
          publish={publish} 
          setIsLoaded={setIsLoaded} 
          introDisplay={introDisplay}
          setIntroDisplay={setIntroDisplay}
        />*/}
        <div className="header" style={{position:"fixed", top:0, left:0,}}>
        
          <div style={{display:"flex", flexDirection:"row", alignItems:"center",}}>
            <i className="material-icons-outlined" style={{fontSize:"20px", color: "#666"}}>keyboard_arrow_left</i>
            <div className="header-06">Projects</div>
          </div>
          
          <div style={{flex:1}}></div>
          <div className="title">
            <div className="header-06">Wikipedia Explorer</div>
          </div>
          <div style={{flex:1}}></div>
        </div>
        {!isLoaded ? <WikipediaExplorer
          subscribe={subscribe} 
          unsubscribe={unsubscribe} 
          setIntroDisplay={setIntroDisplay}/>: null}
        {/*<Log entries={logEntries}/>*/}
      </div>
     : <div style={{padding: "20px", textAlign:"center"}}>This app is only supported in Google Chrome</div> }
    </GlobalContext.Provider>
  );
}

export default App;

/*
<Assistant
          subscribe={subscribe} 
          unsubscribe={unsubscribe} 
          setIntroDisplay={setIntroDisplay}/>
*/
