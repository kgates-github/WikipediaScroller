import React, { useEffect, useState, useContext } from 'react';
import { useAnimation, motion } from "framer-motion"
import Page from './Page';
import { GlobalContext } from './GlobalContext';


function PageViewer(props) {
  const [backButtonDisabled, setBackButtonDisabled] = useState(true);
  const [forwardButtonDisabled, setForwardButtonDisabled] = useState(true);
  const { GLOBAL_WIDTH } = useContext(GlobalContext);
  /*const pageViewerRef = useRef(null);

  useEffect(() => {
    if (pageViewerRef.current) {
      pageViewerRef.current.scrollTop = 0;
    }
  } ,[props.wikiPages]);*/

  useEffect(() => {
    setBackButtonDisabled(props.navigator.getBackButtonDisabled());
    setForwardButtonDisabled(props.navigator.getForwardButtonDisabled());
    console.log('GLOBAL_WIDTH', GLOBAL_WIDTH.current);
  } ,[props.curWikiPage]);

  return (
   
    <div style={{
      display:"flex", 
      flexDirection:"column", 
      alignItems:"center", 
      paddingTop:"20px",
      width:"100%"
    }}>
      <div style={{display:"flex", 
        flexDirection:"row", background:"none", width:`${GLOBAL_WIDTH.current}px`, paddingBottom:"12px"}}>
       
       <div onClick={() => {props.scrollRight() }} style={{cursor:"pointer",}}>
          <i className="material-icons" style={{fontSize:"32px", color: backButtonDisabled ? "#ddd" : "#666"}}>arrow_circle_left</i>
        </div>
        <div onClick={() => {props.scrollLeft() }} style={{cursor:"pointer",}}>
          <i className="material-icons" style={{fontSize:"32px", color: forwardButtonDisabled ? "#ddd" : "#666"}}>arrow_circle_right</i>
        </div>
        <div style={{flex:1, background:"none"}}></div>
        <div onClick={() => {props.scrollLeft() }} 
          style={{cursor:"pointer", display: "flex", alignItems: "center", marginRight:"20px"}}>
          <i className="material-icons" style={{fontSize:"32px", color:"#666"}}>search</i>
        </div>
      </div>

      <div style={{background:"none", width:`${GLOBAL_WIDTH.current}px`, paddingBottom:"12px"}}>
      
        <div>
          <a href="https://en.wikipedia.org/wiki/Bauhause" target="_blank" rel="noreferrer">Bauhause</a>
        </div>
        <div>
        <a href="https://en.wikipedia.org/wiki/Dymaxion" target="_blank" rel="noreferrer">Dymaxion</a>
        </div>
        

        {(props.curWikiPage) ? (
        <div style={{marginTop:"40px"}}>
          <div>{props.curWikiPage.id}</div>
          <div>{props.curWikiPage.title}</div>
          <div>{props.curWikiPage.url}</div>
          <div>{props.curWikiPage.get}</div>
        </div>
      ) : (
        <div>No pages</div>
      )}

      </div>
      
      {/*
      <div 
        id="page-viewer"
        ref={pageViewerRef}
      style={{
        marginBottom:"40px", 
        background:"none",
        width:"780px",
        height:"calc(100vh - 80px)",
        overflowY:"hidden",
        overflowX:"hidden",
        paddingRight:"20px",
        opacity: props.coords ? 0.3 : 1,
      }}>
        <motion.div animate={props.controls}
          style={{display:"flex", flexDirection:"row", width: props.wikiPages.length * 800 }}>
           
          {props.wikiPages.map((wikiPage, index) => (
            <Page key={"page_"+index} wikiPage={wikiPage} />
          ))}
        </motion.div>
      </div>
      */}
      
    </div>
  
  );
}

export default PageViewer;



