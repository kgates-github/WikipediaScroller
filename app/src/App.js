import './App.css';
import GestureCapturer from './components/GestureCapturer';
import React, { useState, useRef } from 'react';
import { GlobalContext } from './components/GlobalContext';
import WikipediaExplorer from './components/WikipediaExplorer3';

function App() {
  const userAgent = navigator.userAgent;
  const [isLoaded, setIsLoaded] = useState(false);
  const [highlightMode, setHighlightMode] = useState('dormant');
  const [introDisplay, setIntroDisplay] = useState('none');
  const GLOBAL_WIDTH = useRef(640);

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

  const changeHighlightMode = () => {
    let mode = 'dormant' 
    if (highlightMode === 'dormant') mode = 'highlight';
    //if (highlightMode === 'highlight') mode = 'preview';
    setHighlightMode(mode);
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
          <div style={{display:"flex", flexDirection:"row", alignItems:"center", width:"200px", background:"none"}}>
            <i className="material-icons-outlined" style={{fontSize:"20px", color: "#666"}}>keyboard_arrow_left</i>
            <div className="header-06">Projects</div>
          </div>
          
          <div style={{flex:1}}></div>
          <div className="title">
            <div className="header-06">Wikipedia Browser</div>
          </div>
          <div style={{flex:1}}></div>
          <div style={{width:"200px", display:"flex", justifyContent:"flex-end", marginRight:"30px"}}>
            <div 
            className="header-06" 
            onClick={() => { setIntroDisplay(introDisplay == 'none' ? 'flex' : 'none') }}
            style={{cursor:"pointer", background:""}}>
              <i className="material-icons-outlined" style={{fontSize:"28px",  color: "#555"}}>info</i>
            </div>
          </div>
        </div>
        {!isLoaded ? <WikipediaExplorer
          subscribe={subscribe} 
          unsubscribe={unsubscribe} 
          highlightMode={highlightMode}
          changeHighlightMode={changeHighlightMode}
          setIntroDisplay={setIntroDisplay}/>: null}

        <div 
          onClick={() => { setIntroDisplay(introDisplay == 'none' ? 'flex' : 'none') }}
          style={{
            display: introDisplay, 
            position:"fixed", 
            top:0, left:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.8)", zIndex:1000
          }}
        >
          <div style={{
            position:"absolute", 
            top:"50%", left:"50%", 
            transform:"translate(-50%, -50%)",
            color:"#fff",
          }}>
            <div style={{fontSize:"14px", marginBottom:"20px", textAlign:"center"}}>Press spacebar to toggle to preview mode</div>
            <div style={{marginBottom:"40px", display:"flex", justifyContent:"center"}}>
              <img src={`${process.env.PUBLIC_URL}/spacebar.png`} alt="Description" />
            </div>
            <div style={{fontSize:"14px", marginBottom:"20px", textAlign:"center"}}>Press left or right arrows to go forward or back</div>
            <div style={{marginBottom:"40px", display:"flex", justifyContent:"center"}}>
              <img src={`${process.env.PUBLIC_URL}/left_right_arrows.png`} alt="Description" />
            </div>
            <div style={{fontSize:"14px", marginBottom:"20px", textAlign:"center"}}>Press left or right arrows to go forward or back</div>
            <div style={{marginBottom:"80px", display:"flex", justifyContent:"center"}}>
              <img src={`${process.env.PUBLIC_URL}/up_down_arrows.png`} alt="Description" />
            </div>
            <div style={{fontSize:"14px", textAlign:"center", textDecoration:"underline", cursor:"pointer"}}>Close</div>
          </div>
        </div>
       
       
      </div>
     : <div style={{padding: "20px", textAlign:"center"}}>This app is only supported in Google Chrome</div> }
    </GlobalContext.Provider>
  );

}

export default App;

/*
 {isLoaded ? <WikipediaExplorer
          subscribe={subscribe} 
          unsubscribe={unsubscribe} 
          setIntroDisplay={setIntroDisplay}/>: null}



    { (userAgent.indexOf("Chrome") > -1) ? 
      <div className="App">
        <GestureCapturer 
          publish={publish} 
          setIsLoaded={setIsLoaded} 
          introDisplay={introDisplay}
          setIntroDisplay={setIntroDisplay}
        />
        <div className="header" style={{position:"fixed", top:0, left:0,}}>
          <div style={{display:"flex", flexDirection:"row", alignItems:"center",}}>
            <i className="material-icons-outlined" style={{fontSize:"20px", color: "#666"}}>keyboard_arrow_left</i>
            <div className="header-06">Projects</div>
          </div>
          
          <div style={{flex:1}}></div>
          <div className="title">
            <div className="header-06">Wikipedia Browser</div>
          </div>
          <div style={{flex:1}}></div>
        </div>
        {isLoaded ? <WikipediaExplorer
          subscribe={subscribe} 
          unsubscribe={unsubscribe} 
          setIntroDisplay={setIntroDisplay}/>: null}
       
       
      </div>
     : <div style={{padding: "20px", textAlign:"center"}}>This app is only supported in Google Chrome</div> }
    </GlobalContext.Provider>
  );
*/
