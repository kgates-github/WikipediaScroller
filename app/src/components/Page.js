import React, { useEffect } from 'react';


function Page(props) {

  useEffect(() => {
    
  } ,[]);

  return (
   <div style={{lineHeight:"1.6em", width:"600px", marginRight:"20px"}} 
        dangerouslySetInnerHTML={{ __html: props.content }} />
  );
}

export default Page;



