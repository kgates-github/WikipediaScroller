import React, { useEffect, useState, useContext, useRef } from 'react';
import { useAnimation, motion } from "framer-motion"
import Page from './Page';
import PreviewCard from './PreviewCard';
import { GlobalContext } from './GlobalContext';


function PageViewer(props) {
  const [backButtonDisabled, setBackButtonDisabled] = useState(true);
  const [forwardButtonDisabled, setForwardButtonDisabled] = useState(true);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [highlightedLinks, setHighlightedLinks] = useState([]);
  const { GLOBAL_WIDTH } = useContext(GlobalContext);
  const pageViewerRef = useRef(null);

  function handleOpenPalm(e) {
    console.log('handleOpenPalm');
    setIsHighlighted(true);
  }

  function handleNoGesture() {
    console.log('handleNoGesture');
    setIsHighlighted(false);
  }

  useEffect(() => {
    // Handler to capture keydown events
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        // Left arrow key pressed
        if (!backButtonDisabled) {
          props.navigator.moveBack();
        }
      } else if (event.key === 'ArrowRight') {
        // Right arrow key pressed
        if (!forwardButtonDisabled) {
          props.navigator.moveForward();
        }
      } else if (event.key === ' ' || event.keyCode === 32) {
        event.preventDefault(); 
        props.changeHighlightMode();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [backButtonDisabled, forwardButtonDisabled, props.navigator, props.highlightMode]);

  useEffect(() => {
    setBackButtonDisabled(props.navigator.getBackButtonDisabled());
    setForwardButtonDisabled(props.navigator.getForwardButtonDisabled());
  }, [props.curIndex]);

  useEffect(() => {
    /*if (isHighlighted) {
      document.addEventListener('open-palm', handleOpenPalm);
      document.addEventListener('no-gesture', handleNoGesture);
    } else {
      document.removeEventListener('open-palm', handleOpenPalm);
      document.removeEventListener('no-gesture', handleNoGesture);
    }

    return () => {
      document.removeEventListener('open-palm', handleOpenPalm);
      document.removeEventListener('no-gesture', handleNoGesture);
    }*/
  }, []);

  return (
    <>
      <div style={{
        display:"flex", 
        flexDirection:"row", 
        height:"calc(100vh - 80px)",
        width:"100%",
        position:"fixed",
        pointerEvents: "auto", 
        zIndex: '0',
        background: 'none',
      }}>
        <div style={{flex:1, background:"none", zIndex:"1"}}></div>
        <div 
          id="page-viewer"
          ref={pageViewerRef}
          style={{
            marginBottom:"400px", 
            marginTop:"48px",
            background:"none",
            width:"600px",
            height:"calc(100vh - 80px)",
            overflowY:"visible",
            overflowX:"visible",
            //paddingRight:"0px",
            opacity: 1,
          }}
        >
          <motion.div 
            animate={props.scrollXControls}
            style={{
              display:"flex", 
              flexDirection:"row", 
              background:"none",
              width: props.wikiPages.length * GLOBAL_WIDTH.current 
            }}>
              
            {props.wikiPages.map((wikiPage, index) => (
              <Page 
                key={"page_"+index} 
                navigator={props.navigator} 
                wikiPage={wikiPage} 
                doRender={wikiPage.doRender}
                highlightMode={props.highlightMode} 
                setHighlightedLinks={setHighlightedLinks}
                highlightedLinks={highlightedLinks}
                curIndex={props.curIndex}
              />
            ))}
          </motion.div>
        </div>
        <div style={{flex:1, background:"none"}}></div>
      </div>
      <div style={{
        display:"flex", 
        flexDirection:"row", 
        height:"calc(100vh - 80px)",
        width:"100%",
        position:"fixed",
        pointerEvents: "none", 
      }}>
        <div style={{ flex:1, background:"white", opacity:"0.8" }}>
          <div style={{
            background:"#f1f1f1",
            height:"48px",
            //borderBottom:"1px solid #ccc",
          }}></div>
        </div>
        <div style={{
          background:"none", 
          width:`${GLOBAL_WIDTH.current}px`, 
          height:"calc(100vh - 80px)",
          borderLeft:"1px solid #ccc",
          borderRight:"1px solid #ccc",
        }}>
          <div style={{
            display:"flex", 
            flexDirection:"row", 
            background:"#f6f6f6",
            height:"48px",
            alignItems:"center",
            //borderBottom:"1px solid #ccc",
            paddingLeft:"20px",
            paddingRight:"20px",
            pointerEvents: "auto", 
          }}>
            <div onClick={() => { props.navigator.moveBack() }} style={{cursor:"pointer",}}>
              <i className="material-icons" style={{fontSize:"28px", color: backButtonDisabled ? "#ccc" : "#555"}}>arrow_circle_left</i>
            </div>
            <div onClick={() => { props.navigator.moveForward() }} style={{cursor:"pointer", marginLeft:"2px"}}>
              <i className="material-icons" style={{fontSize:"28px", color: forwardButtonDisabled ? "#ccc" : "#555"}}>arrow_circle_right</i>
            </div>
            <div style={{flex:1, background:"none"}}></div>
            <div onClick={() => { props.changeHighlightMode() }} 
              style={{cursor:"pointer", display: "flex", alignItems: "center",}}>
              <i className="material-icons" style={{
                fontSize:"40px", 
                color: props.highlightMode == 'highlight' ? "#D5BF00" : "#666",
              }}>
                {props.highlightMode == 'highlight' ? "toggle_on" : "toggle_off"}
              </i>
            </div>
          </div>

        </div>
        <div style={{ flex:1, background:"white", opacity:"0.8" }}>
          <div style={{
            background:"#f1f1f1",
            height:"48px",
            //borderBottom:"1px solid #ccc",
          }}></div>
        </div>
      </div>
      
      <div 
        style={{
          position: "fixed", 
          display: props.highlightMode == 'highlight' ? "flex" : "none",
          flexDirection: "row",
          width: "100%",
          height:"calc(100vh - 80px)",
          pointerEvents: "none" ,
          background: "none", 
        }}
      >
        <div style={{ flex:1, }}></div>
        <div style={{ width:"600px", background:"none"}}></div>
        <div style={{ flex:1, background:"#fff", borderLeft:"1px solid #ccc"}}>
          <div style={{ background:"#F9F9F9", height:"48px", }}></div>
          <div style={{ paddingTop:"8px", paddingLeft:"12px" }}>
            {props.highlightMode == 'highlight' ? highlightedLinks.map((highlightedLink, index) => (
              <PreviewCard 
                key={highlightedLink.id} 
                index={index}
                highlightedLink={highlightedLink} 
                highlightMode={props.highlightMode} 
              />
            )) : null}
          </div>
        </div>
      </div>
    </>
  
  );
}

export default PageViewer;



