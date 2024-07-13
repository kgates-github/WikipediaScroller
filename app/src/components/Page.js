import React, { useEffect, useState, useRef } from 'react';
import LinkHighlighter from './LinkHighlighter';
import { motion } from "framer-motion"


function Page(props) {
  const [HTMLContent, setHTMLConent] = useState({ __html: '' });
  const containerRef = useRef(null);
  const pageRef = useRef(null);

  const getFilters = (highlightMode) => {
    if (highlightMode == "preview") return "grayscale(100%) opacity(0.3)";
    if (highlightMode == "highlight") return "grayscale(100%)"; 
    return "none";
  }

  const replacementFunction = (match, href) => {
    if (href.includes('wiki')) {
      return match;
    } else {
      return '';
    }
  };

  const fetchWikiSummary = async(wikiPage) => {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiPage}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
  }

  const fetchWikiPage = async(wikiPage) => {
    try {
      const pattern = /<a\s+[^>]*href=["'][^"']*?([^"']*wiki[^"']*|[^"'>]*)["'][^>]*>(.*?)<\/a>/gi;
    
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=parse&page=${wikiPage}&format=json&origin=*`
      );

      if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
    
      const data = await response.json();
      let truncatedText = data.parse.text["*"].split("References")[0];
      const title = data.parse.title;
      
      // Apply the replacement function to the truncatedText
      let cleanedText = truncatedText.replace(pattern, replacementFunction);
      cleanedText = cleanedText.replace(/\[|\]/g, '');

      return {
        title: title,
        text: cleanedText
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const isRendered = () => {
    return HTMLContent && HTMLContent.__html && HTMLContent.__html.trim() !== '';
  }

  useEffect(() => {
    if (props.doRender && (!isRendered() || 
      props.wikiPage.prevWikiPage != props.wikiPage.wikiPage)) {
      
      async function fetchWiki() {
        const newWikiPage = await fetchWikiPage(props.wikiPage.wikiPage);
        
        setHTMLConent(
          { __html: `
            <div class="title-header">${newWikiPage.title}</div>
            ${newWikiPage.text}`  
          }
        );
      }
      fetchWiki();
    } else {
      setHTMLConent({ __html: '' });
    }
  }, [props.doRender, props.wikiPage.wikiPage]);

  /*useEffect(() => {
    console.log('isCurPage', props.wikiPage.isCurPage);
    if (props.wikiPage.isCurPage) {
      pageDivRef.current.scrollTop = 0;
    }  
  }, [props.wikiPage.isCurPage]);*/
  
  return (
   <div 
    id={props.wikiPage.id}
    ref={pageRef}
    style={{
      position: 'relative',
      lineHeight:"1.6em",
      width:"600px", 
      paddingRight:"20px",
      paddingLeft:"20px", 
      height:"calc(100vh - 80px)", 
      overflowY:"scroll", 
      overflowX:"hidden", 
      pointerEvents: "auto",
    }}>  
      <div 
        style={{ 
          position:'absolute ', 
          width:"600px", 
          filter: getFilters(props.highlightMode),  pointerEvents: "auto",}}
        dangerouslySetInnerHTML={HTMLContent} 
      />
      {props.wikiPage.isCurPage && (
        <div 
          ref={containerRef} 
          style={{
            position:'absolute', zIndex:'100000',
            top:'0', left:'0', 
            width:'100%', height:'100%',   
            background:'none',
            pointerEvents: "none"
          }}
        >
          <LinkHighlighter 
            navigator={props.navigator} 
            highlightMode={props.highlightMode} 
            curIndex={props.curIndex}
            containerRef={containerRef}
            pageRef={pageRef}
          />
        </div>
      )}
    </div>
  );
}

export default Page;

/*
 {props.wikiPage.isCurPage && (
        <LinkHighlighter 
          navigator={props.navigator} 
          highlightMode={props.highlightMode} 
          curIndex={props.curIndex}
        />
      )}
{
    "<p>The <b>Old Swiss Confederacy</b>, also known as <b>Switzerland</b> or the <b>Swiss Confederacy</b>, was a loose confederation of independent small states, initially within the Holy Roman Empire. It is the precursor of the modern state of Switzerland.</p>"
}*/



