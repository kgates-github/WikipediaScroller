import React, { useEffect, useState, useRef } from 'react';
import { motion } from "framer-motion"


function Page(props) {
  const [HTMLContent, setHTMLConent] = useState({ __html: '' });
  const motionDivRef = useRef(null); // 

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

  return (
   <motion.div 
    ref={motionDivRef} 
    id={props.wikiPage.id}
    style={{
      lineHeight:"1.6em",
      width:"600px", 
      marginRight:"20px", 
      height:"calc(100vh - 80px)", 
      overflowY:"scroll", 
      overflowX:"hidden", 
      background:"none", 
      opacity: props.wikiPage.isCurPage ? 1 : 0.4,
      filter: !props.wikiPage.isCurPage ? "grayscale(100%)" : "none",
    }} 
    dangerouslySetInnerHTML={HTMLContent} />
  );
}

export default Page;

/*
{
    "<p>The <b>Old Swiss Confederacy</b>, also known as <b>Switzerland</b> or the <b>Swiss Confederacy</b>, was a loose confederation of independent small states, initially within the Holy Roman Empire. It is the precursor of the modern state of Switzerland.</p>"
}*/



