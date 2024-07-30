import React, { useEffect, useState, useMemo } from 'react';
import { motion } from "framer-motion"


function SuggestionCard(props) {
  const [HTMLContent, setHTMLContent] = useState({ __html : '' });
  const titleWidth = Math.floor(Math.random() * 100) + 200;

  useMemo(() => {
    
  }, [props.suggestion.wikiPage]);
  
  return (
    <div  
      onClick={() => props.navigator.handleLinkClick(props.suggestion.link)}
      style={{ 
        borderBottom:"1px solid #eee",
        paddingTop:"12px",
        paddingBottom:"12px",
        maxWidth: `400px`,
        minHeight: props.index == 0 ? '140px' : '34px',
        pointerEvents: "auto",
        overflow: "hidden",
        cursor:"pointer",
      }}
    >
      <div>{props.suggestion.title}</div>
    </div>
  );
}

export default SuggestionCard;




