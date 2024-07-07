import React, { useEffect } from 'react';
import { motion } from "framer-motion"


function Page(props) {

  useEffect(() => {
    
  } ,[]);

  return (
   <motion.div 
    id={props.wikiPage.id}
    style={{
      lineHeight:"1.6em",
       width:"800px", 
       marginRight:"20px", 
       height:"calc(100vh - 80px)", 
       overflowY:"scroll", overflowX:"hidden", background:"none", opacity: props.coords ? 0.3 : 1,}} 
    dangerouslySetInnerHTML={{ __html: `<div class="title-header"/>${props.wikiPage.title}</div>${props.wikiPage.text}` }} />
  );
}

export default Page;



