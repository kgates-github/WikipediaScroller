import React, { useEffect, useState, useRef, useContext } from 'react';
import { useAnimation, motion } from "framer-motion"
import PageViewer from './PageViewer2';
import WikipediaNavigator from '../utils/WikipediaNavigator';
import TabBar from './TabBar';


function WikipediaExplorer(props) {
  const [tab, setTab] = useState('browse');
  const [navigator, setNavigator] = useState(null);
  const [curWikiPage, setCurWikiPage] = useState(null);
  const [wikiPages, setWikiPages] = useState([]);

  function toggleTab(tab) {
    setTab(tab);
  }

  useEffect(() => {
    setNavigator(new WikipediaNavigator(setWikiPages));
  }, []);

  useEffect(() => {
    if (!navigator) return;
     // Capture all anchor clicks and prevent default behavior
    document.addEventListener('click', function(event) {
      let target = event.target.closest('a');

      if (target) {
        event.preventDefault();
        navigator.handleLinkClick(target.href)
        setCurWikiPage(navigator.getCurPage());
      }
    });

    navigator.addPageToQueue("Switzerland");
    setCurWikiPage(navigator.getCurPage());
  }, [navigator]);

  return (
    <>
      <TabBar toggleTab={toggleTab} tab={tab} />
      {(tab === 'browse' && navigator) ? (
        <PageViewer navigator={navigator} curWikiPage={curWikiPage} wikiPages={wikiPages}/>
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