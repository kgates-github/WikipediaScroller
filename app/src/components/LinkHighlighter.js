import React, { useEffect, useState, useRef } from 'react';
import HighlightedLink from './HighlightedLink';
import { motion } from "framer-motion"




function LinkHighlighter(props) {
  const [highlightedLinks, setHighlightedLinks] = useState([]);

  useEffect(() => {
    if (props.highlightMode === 'highlight') {
      const curPage = props.navigator.getCurPage();
      const links = document.querySelectorAll(`#${curPage.id} a`);
      const visibleLinks = Array.from(links).filter(link => {
        const rect = link.getBoundingClientRect();
        const isVisible = rect.top >= 140 && rect.left >= 0 && 
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
          rect.right <= (window.innerWidth || document.documentElement.clientWidth);
        return isVisible;
      });
      visibleLinks.forEach(link => {
        link.classList.add('activated');
        console.log(link.href); // Optionally log the href if needed
      });

      setHighlightedLinks(visibleLinks.splice(0, 6).map(link => {
        const rect = link.getBoundingClientRect();
        return {
          link: link.href,
          text: link.innerText,
          left: rect.left - 8,
          top: rect.top - 5
        }
      }));
  
      // Cleanup function to remove 'activated' class from all links
      return () => {
        links.forEach(link => link.classList.remove('activated'));
      };
    } else if (props.highlightMode === 'preview') {
      console.log('preview');
    } else if (props.highlightMode === 'dormant') {
      setHighlightedLinks([])
    }
  }, [props.highlightMode, props.curIndex]);
  
  return (
    <div>
      {highlightedLinks.map((link, index) => (
        <HighlightedLink 
          key={index} 
          link={link} 
          highlightMode={props.highlightMode} 
          index={index}
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



