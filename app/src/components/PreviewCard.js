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
        
        if (props.index === 0) {
          setHTMLContent(
            { __html: `
              <div style="line-height:1.4em;">
                <div style="font-weight:500;  background:#FFE604; padding: 4px 12px;">${newWikiSummary.title}</div>
                <div style="font-weight:300; font-style:italic; padding-left:12px; padding-top:4px;">${newWikiSummary.description}</div> 
                <div style="font-weight:400; height:190px; padding-left:12px; padding-top:4px;
                overflow:hidden; text-overflow:ellipsis; display: -webkit-box; -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;">${newWikiSummary.extract}</div>
              </div>`
            }
          );
        } else {
          setHTMLContent(
            { __html: `
              <div style="line-height:1.4 em;">
                <div style="font-weight:500; display:inline-block; background:#ddd; padding: 4px 12px">${newWikiSummary.title}</div>
                <div style="font-weight:300; font-style:italic; padding-left:12px; padding-top: 4px;">${newWikiSummary.description}</div> 
              </div>`
            }
          );
        }
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
        //background:"#FFE604",
        borderBottom:"1px solid #eee",
        paddingTop:"12px",
        width: `340px`,
        height: props.index == 0 ? '240px' : '68px',
        pointerEvents: "auto",
        overflow: "hidden",
        //boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.3  )",
      }}
      dangerouslySetInnerHTML={HTMLContent} 
    />
  );
}

export default PreviewCard;




