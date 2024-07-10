import React, { useEffect, useState, useRef } from 'react';
import { motion } from "framer-motion"


function LinkHighlighter(props) {

  useEffect(() => {
     
  }, [props.isHighlighted]);
  
  return (
    <div>
      {props.isHighlighted ? (
        <div style={{
          position: "absolute",
          left: "800px",
          top: "500px",
          background: "#FFE604",
          paddingLeft: "12px",
          paddingRight: "12px",
          paddingTop: "4px",
          paddingBottom: "4px",
          fontWeight: "600",
        }}>
          Buckminster Fuller
        </div>
      ) : null}
    </div>
  );
}

export default LinkHighlighter;

/*
{
    "<p>The <b>Old Swiss Confederacy</b>, also known as <b>Switzerland</b> or the <b>Swiss Confederacy</b>, was a loose confederation of independent small states, initially within the Holy Roman Empire. It is the precursor of the modern state of Switzerland.</p>"
}*/



