import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion"


function Page(props) {
  const [HTMLContent, setHTMLConent] = useState({ __html: '' });

  const replacementFunction = (match, href) => {
    if (href.includes('wiki')) {
      return match;
    } else {
      return '';
    }
  };

  const fetchWikiPage = async(wikiPage) => {
    console.log('fetchWikiPage', wikiPage);
    try {
      const pattern = /<a\s+[^>]*href=["'][^"']*?([^"']*wiki[^"']*|[^"'>]*)["'][^>]*>(.*?)<\/a>/gi;
    
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=parse&page=${wikiPage}&format=json&origin=*`
      );

      if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
    
      const data = await response.json();
      let truncatedText = data.parse.text["*"].split("References")[0];
      
      // Apply the replacement function to the truncatedText
      let cleanedText = truncatedText.replace(pattern, replacementFunction);
      cleanedText = cleanedText.replace(/\[|\]/g, '');

      return cleanedText;
    } catch (error) {
      console.log(error.message);
    }
  };

  const isRendered = () => {
    return HTMLContent && HTMLContent.__html && HTMLContent.__html.trim() !== '';
  }

  useEffect(() => {
    // Render the page if it hasn't been rendered yet abd doRender is true
    if (props.doRender && !isRendered()) {
      async function fetchWiki() {
        const newWikiPageBody = await fetchWikiPage(props.wikiPage.wikiPage);
        setHTMLConent(
          { __html: `
            <div class="title-header"/>${props.wikiPage.title}</div>
            ${newWikiPageBody}`  
          }
        );
      }
      fetchWiki();
    } else {
      setHTMLConent({ __html: '' });
    }
  }, [props.doRender]);

  return (
   <motion.div 
    id={props.wikiPage.id}
    style={{
      lineHeight:"1.6em",
      width:"800px", 
      marginRight:"20px", 
      height:"calc(100vh - 80px)", 
      overflowY:"scroll", 
      overflowX:"hidden", 
      background:"none", 
      opacity: props.coords ? 0.3 : 1,
    }} 
    dangerouslySetInnerHTML={HTMLContent} />
  );
}

export default Page;

/*
{
       __html: props.doRender ? `
        <div class="title-header"/>${props.wikiPage.title}</div>
        ${wikiPageBody}` 
        :
        ""
    }*/



