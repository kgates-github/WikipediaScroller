import React, { useEffect, useState, useRef } from 'react';
import { motion } from "framer-motion"


function PreviewCard(props) {
  const [HTMLContent, setHTMLContent] = useState({ __html : '' });
 

  const fetchWikiSummary = async(wikiPage) => {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiPage}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  useEffect(() => {
    if (props.highlightedLink.wikiPage) {
      setHTMLContent({ __html: 'Loading...' });

      async function fetchWiki() {
        const newWikiSummary = await fetchWikiSummary(props.highlightedLink.wikiPage);
        
        setHTMLContent(
          { __html: `
            <div style="font-weight:600">${newWikiSummary.title}</div>
            <div style="font-weight:300; font-style:italic; ">${newWikiSummary.description}</div> 
            <div style="font-weight:400; margin-top:12px; height:140px; 
            overflow:hidden; text-overflow:ellipsis; display: -webkit-box; -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;">${newWikiSummary.extract}</div>`
          }
        );
      }
      fetchWiki();
    } else {
      setHTMLContent({ __html: 'Loading...' });
    }
  }, [props.highlightedLink.wikiPage]);
  
  useEffect(() => {
    console.log('useEffect props.highlightedLink', props.highlightedLink.text);
  }, [props.highlightedLink.text]);
  
  return (
    <div  
      style={{ 
        background:"#FFE604",
        padding:"12px",
        width: `340px`,
        height: `210px`,
        pointerEvents: "auto",
        boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.3  )",
      }}
      dangerouslySetInnerHTML={HTMLContent} 
    />
  );
}

export default PreviewCard;




