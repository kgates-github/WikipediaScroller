import React, { useEffect, useState, useRef, useContext } from 'react';
import { useAnimation, motion } from "framer-motion"
import PageViewer from './PageViewer2';
import WikipediaNavigator from '../utils/WikipediaNavigator';
import TabBar from './TabBar';
import { GlobalContext } from './GlobalContext';


function WikipediaExplorer(props) {
  const [tab, setTab] = useState('browse');
  const [navigator, setNavigator] = useState(null);
  const [curIndex, setCurIndex] = useState(null);
  const [wikiPages, setWikiPages] = useState([]);
  const { GLOBAL_WIDTH } = useContext(GlobalContext);
  
  const scroll_x = useRef(0);
  const scrollXControls = useAnimation();

  function toggleTab(tab) {
    setTab(tab);
  }

  useEffect(() => {
    setNavigator(
      new WikipediaNavigator(
        setWikiPages, 
        scroll_x, 
        scrollXControls, 
        setCurIndex,
        GLOBAL_WIDTH
    ));
  }, []);

  useEffect(() => {
    if (!navigator) return;
     // Capture all anchor clicks and prevent default behavior
    document.addEventListener('click', function(event) {
      let target = event.target.closest('a');

      if (target) {
        event.preventDefault();
        navigator.handleLinkClick(target.href)
      }
    });

    navigator.addPageToQueue("Arthur_C._Clarke");
  }, [navigator]);

  return (
    <>
      <TabBar toggleTab={toggleTab} tab={tab} />
      {
        (navigator) ? (
          <>
          <div style={{display: tab == 'browse' ? 'block' : 'none'}}>
          <PageViewer 
            navigator={navigator} 
            curIndex={curIndex} 
            wikiPages={wikiPages}
            scroll_x={scroll_x}
            scrollXControls={scrollXControls}
            subscribe={props.subscribe}
            unsubscribe={props.unsubscribe}
            highlightMode={props.highlightMode}
            changeHighlightMode={props.changeHighlightMode}
          />
          </div>

          <div 
            style={{
              display:tab == 'history' ? 'flex' : "none", 
              alignItems:'center', 
              flexDirection:"column", 
              marginTop:"20px"
            }}
          >
            <div style={{width:"600px", marginBottom:"20px"}}>
              {navigator.getHistory().map((wikiPage, index) => (
                <div key={"hist_"+index} style={{ marginTop:"16px"}}>{wikiPage.title}</div>
              ))}
            </div>
          </div>
          </>
        ) : null }
    </>
  );
}

export default WikipediaExplorer;


{/* 
  <PageViewer 
    coords={coords} 
    selectMode={selectMode} 
    scrollLeft={scrollLeft}
    scrollRight={scrollRight}
    controls={controls}
    scroll_x={scroll_x}
    wikiPages={wikiPages}
  /> 
*/}