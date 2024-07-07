import React, { useEffect, useState, useRef, useContext } from 'react';
import { useAnimation, motion } from "framer-motion"
import PageViewer from './PageViewer2';
import WikipediaNavigator from '../utils/WikipediaNavigator';
import TabBar from './TabBar';



function WikipediaExplorer(props) {
  const [tab, setTab] = useState('browse');
  const [curWikiPage, setCurWikiPage] = useState(null);
  const [navigator, setNavigator] = useState(null);

  function toggleTab(tab) {
    setTab(tab);
  }

  useEffect(() => {
    setNavigator(new WikipediaNavigator());
  }, []);

  useEffect(() => {
    // Capture all anchor clicks and prevent default behavior
    if (!navigator) return;
    document.addEventListener('click', function(event) {
      let target = event.target.closest('a');

      if (target) {
        event.preventDefault();
        navigator.handleLinkClick(target.href)
        setCurWikiPage(navigator.getCurPage());
      }
    });
  }, [navigator]);

  return (
    <>
      <TabBar toggleTab={toggleTab} tab={tab} />
      {(tab === 'browse' && navigator) ? (
        <PageViewer navigator={navigator} curWikiPage={curWikiPage}/>
      ) : (
        <div>History</div>
      )}
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