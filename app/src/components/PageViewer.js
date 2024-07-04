import React, { useEffect, useState, useRef } from 'react';
import { useAnimation, motion } from "framer-motion"
import Page from './Page';



function PageViewer(props) {

  useEffect(() => {
    
  } ,[]);

  return (
   
    <div style={{
      display:"flex", flexDirection:"row", justifyContent:"center",}}>
      
      <div style={{
        
        marginBottom:"40px", 
        background:"none",
        width:"580px",
        height:"calc(100vh - 80px)",
        overflowY:"scroll",
        overflowX:"hidden",
        paddingRight:"20px",
        opacity: props.coords ? 0.3 : 1,
      }}>
        <motion.div animate={props.controls}
          style={{display:"flex", flexDirection:"row", width: props.content.length * 600 }}>
           
          {props.content.map((pageContent, index) => (
            <Page key={"page_"+index} content={pageContent} />
          ))}
        </motion.div>
      </div>
      <div style={{marginLeft:"12px", 
        opacity: props.selectMode == 'dormant' ? 1 : props.coords ? 0.3 : 1,}}>
        <div onClick={() => {props.scrollRight() }} style={{cursor:"pointer"}}>
          <i className="material-icons-outlined" style={{fontSize:"36px", color:"#ccc"}}>arrow_circle_left</i>
        </div>
        <div onClick={() => {props.scrollLeft() }} style={{cursor:"pointer"}}>
          <i className="material-icons-outlined" style={{fontSize:"36px", color:"#ccc"}}>arrow_circle_right</i>
        </div>
      </div>
    </div>
  
  );
}

export default PageViewer;



