import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion"


function Page(props) {
  const [wikiPageBody, setWikiPageBody] = useState("");

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

  useEffect(() => {
    if (props.doRender) {
      async function fetchWiki() {
        const newWikiPageBody = await fetchWikiPage(props.wikiPage.wikiPage);
        setWikiPageBody(newWikiPageBody);
      }
      fetchWiki();
    } else {
      setWikiPageBody("");
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
    dangerouslySetInnerHTML={{
       __html: props.doRender ? `
        <div class="title-header"/>${props.wikiPage.title}</div>
        ${wikiPageBody}` 
        :
        `<div class="title-header"/>${props.wikiPage.title}</div>`
    }} />
  );
}

export default Page;



