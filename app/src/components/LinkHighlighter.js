import React, { useEffect, useState, useRef } from 'react';
import HighlightedLink from './HighlightedLink';
import { motion } from "framer-motion"

function LinkHighlighter(props) {
  //const [highlightedLinks, setHighlightedLinks] = useState([]);
  //const containerRef = props.containerRef;


  const highlightLinks = (retryCount = 0) => {
    const curPage = props.navigator.getCurPage();
    const links = document.querySelectorAll(`#${curPage.id} a`);

    if (!links.length && retryCount < 3) { // Check if no links are found and retry count is less than 3
      setTimeout(() => {
        highlightLinks(retryCount + 1); 
      }, 500); 
      return;
    }
    
    const visibleLinks = Array.from(links).filter(link => {
      const rect = link.getBoundingClientRect();
      const isVisible = rect.top >= 180 && rect.left >= 0 && 
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
        rect.right <= (window.innerWidth || document.documentElement.clientWidth);
      
        const isNotImageOrSVG = !/\.(svg|png|gif|jpeg|jpg)$/i.test(link.href) && 
          !/(Special|Help|Wikipedia):/i.test(link.href) && !/google\.com/i.test(link.href);
      return isVisible && isNotImageOrSVG;
    });
    props.setHighlightedLinks(visibleLinks.splice(0, 6  ).map(link => {
      const containerRect = props.containerRef.current.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();

      return {
        link: link.href,
        wikiPage: link.href.split('/wiki/')[1],
        text: link.innerText,
        left: linkRect.left - containerRect.left - 8,
        top:  linkRect.top - containerRect.top - 6
      }
    }));
  }

  useEffect(() => {
    console.log('------- props.highlightMode, props.curIndex', props.highlightMode, props.curIndex)
    if (props.highlightMode === 'dormant') {
      props.setHighlightedLinks([])
      
    } else {
        highlightLinks();
    }
  }, [props.highlightMode, props.curIndex]);

  useEffect(() => {
    if (props.highlightMode === 'highlight' || props.highlightMode === 'preview') {
      let scrollTimeout = null; 
      
      const handleScroll = () => {
        props.setIsScrolling(true);
        highlightLinks();
  
        // Clear any existing timeout to reset the timer
        clearTimeout(scrollTimeout);
  
        // Set a new timeout
        scrollTimeout = setTimeout(() => {
          props.setIsScrolling(false); 
        }, 150); // 150ms delay to determine end of scrolling, adjust as needed
      };
  
      const page = props.pageRef.current;
      if (page) {
        page.addEventListener("scroll", handleScroll);
      }
       
      return () => {
        if (page) {
          page.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, [props.pageRef, props.highlightMode]); 

  
  return (
    <div>
      {props.highlightedLinks.map((link, index) => (
        <HighlightedLink 
          key={index} 
          link={link} 
          highlightMode={props.highlightMode} 
          navigator={props.navigator}
          index={index}
          containerRef={props.containerRef}
        />
      ))}
    </div>
  );
}

export default LinkHighlighter;

/*
{
    "<p>The <b>Old Swiss Confederacy</b>, also known as <b>Switzerland</b> or the <b>Swiss Confederacy</b>, was a loose confederation of independent small states, initially within the Holy Roman Empire. It is the precursor of the modern state of Switzerland.</p>"
}*/



