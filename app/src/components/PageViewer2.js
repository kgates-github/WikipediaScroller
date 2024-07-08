import React, { useEffect, useState, useContext, useRef } from 'react';
import { useAnimation, motion } from "framer-motion"
import Page from './Page';
import { GlobalContext } from './GlobalContext';


function PageViewer(props) {
  const [backButtonDisabled, setBackButtonDisabled] = useState(true);
  const [forwardButtonDisabled, setForwardButtonDisabled] = useState(true);
  const { GLOBAL_WIDTH } = useContext(GlobalContext);
  const pageViewerRef = useRef(null);

  /*useEffect(() => {
    if (pageViewerRef.current) {
      pageViewerRef.current.scrollTop = 0;
    }
  } ,[props.wikiPages]);*/

  useEffect(() => {
    setBackButtonDisabled(props.navigator.getBackButtonDisabled());
    setForwardButtonDisabled(props.navigator.getForwardButtonDisabled());
  } ,[props.curIndex]);

  return (
   
    <div style={{
      display:"flex", 
      flexDirection:"column", 
      alignItems:"center", 
      paddingTop:"20px",
      width:"100%",
      background:"white",
    }}>
      <div style={{display:"flex", 
        flexDirection:"row", background:"none", width:`${GLOBAL_WIDTH.current}px`, paddingBottom:"12px"}}>
       <div onClick={() => { props.navigator.moveBack() }} style={{cursor:"pointer",}}>
          <i className="material-icons" style={{fontSize:"32px", color: backButtonDisabled ? "#ddd" : "#666"}}>arrow_circle_left</i>
        </div>
        <div onClick={() => { props.navigator.moveForward() }} style={{cursor:"pointer",}}>
          <i className="material-icons" style={{fontSize:"32px", color: forwardButtonDisabled ? "#ddd" : "#666"}}>arrow_circle_right</i>
        </div>
        <div style={{flex:1, background:"none"}}></div>
        <div onClick={() => { }} 
          style={{cursor:"pointer", display: "flex", alignItems: "center", marginRight:"20px"}}>
          <i className="material-icons" style={{fontSize:"32px", color:"#666"}}>search</i>
        </div>
      </div>

      <div 
        id="page-viewer"
        ref={pageViewerRef}
        style={{
          marginBottom:"40px", 
          background:"none",
          width:"580px",
          height:"calc(100vh - 80px)",
          overflowY:"visible",
          overflowX:"visible",
          paddingRight:"20px",
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
            <Page key={"page_"+index} navigator={props.navigator} wikiPage={wikiPage} doRender={wikiPage.doRender}/>
          ))}
        </motion.div>
      </div>
      
      
    </div>
  
  );
}

export default PageViewer;



