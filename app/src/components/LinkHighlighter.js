import React, { useEffect, useState, useRef } from 'react';
import HighlightedLink from './HighlightedLink';
import { motion } from "framer-motion"

function LinkHighlighter(props) {
  const [highlightedLinks, setHighlightedLinks] = useState([]);
  const containerRef = props.containerRef;


  const highlightLinks = () => {
    const curPage = props.navigator.getCurPage();
    const links = document.querySelectorAll(`#${curPage.id} a`);
    const visibleLinks = Array.from(links).filter(link => {
      const rect = link.getBoundingClientRect();
      const isVisible = rect.top >= 140 && rect.left >= 0 && 
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
        rect.right <= (window.innerWidth || document.documentElement.clientWidth);
      
      const isToFile = /file/i.test(link.href) && /\.(File|pdf|docx|xlsx|pptx|txt|zip|png|gif|jpg|jpeg)$/i.test(link.href);
      return isVisible && !isToFile;
    });
    visibleLinks.forEach((link, index) => {
      link.classList.add('activated');
    });

    setHighlightedLinks(visibleLinks.splice(0, 6).map(link => {
      const containerRect = containerRef.current.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();

      return {
        link: link.href,
        text: link.innerText,
        left: linkRect.left - containerRect.left - 8,
        top:  linkRect.top - containerRect.top - 6
      }
    }));
  }

  useEffect(() => {
    if (props.highlightMode === 'highlight') {
      highlightLinks();
      
      // Cleanup function to remove 'activated' class from all links
      return () => {
        const curPage = props.navigator.getCurPage();
        const links = document.querySelectorAll(`#${curPage.id} a`);
        links.forEach(link => link.classList.remove('activated'));
      };
    } else if (props.highlightMode === 'preview') {
      console.log('preview');
    } else if (props.highlightMode === 'dormant') {
      setHighlightedLinks([])
    }
  }, [props.highlightMode, props.curIndex]);

  useEffect(() => {
    if (props.highlightMode === 'highlight') {
      const handleScroll = () => {
        // TO DO: Only highlight links when top link is no visible
        highlightLinks();
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
      {highlightedLinks.map((link, index) => (
        <HighlightedLink 
          key={index} 
          link={link} 
          highlightMode={props.highlightMode} 
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



