import React, { useEffect, useState, useRef, useContext } from 'react';
import { testContent } from './helpers';
import { useAnimation, motion, transform } from "framer-motion"
import PageViewer from './PageViewer';

var style = document.createElement('style');


const activatedScrollbar = `
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1; /* color of the tracking area */
  }
  ::-webkit-scrollbar-thumb {
    background: #999;
    border: 3px solid #999;
  }
`
const deactivatedScrollbar = `
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: #fff; /* color of the tracking area */
  }
`
const highlightedScrollbar = `
  ::-webkit-scrollbar {
    background: #f1f1f1;
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1; /* color of the tracking area */
  }
  ::-webkit-scrollbar-thumb {
    background: #777;
    border: 2px solid #ffcc00;
  }
`
const triggeredScrollbar = `
  ::-webkit-scrollbar {
    background: #f1f1f1;
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1; /* color of the tracking area */
  }
  ::-webkit-scrollbar-thumb {
    background: #ffcc00;
    border: 2px solid #ffcc00;
  }
`
const clearedScrollbar = `
  ::-webkit-scrollbar {
    background: #fff;
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: #fff; /* color of the tracking area */
  }
  ::-webkit-scrollbar-thumb {
    background: #fff;
    border: 4px solid #fff;
  }
`

function WikipediaExplorer(props) {
  const [selectedLink, setSelectedLink] = useState("");
  const [selectMode, setSelectMode] = useState('dormant'); // dormant, active, selected
  const [coords, setCoords] = useState(null);
  const [cockedState, setCockedState] = useState('dormant'); // dormant, partial, cocked
  const [content, setContent] = useState([]);
  const [curPage, setCurPage] = useState(-1);

  const elementSelectedRef = useRef(false);
  const anchor_x = useRef(-10);
  const cock_anchor_x = useRef(-10);
  const selectables = useRef([]);
  const index = useRef(0);
  const scroll_x = useRef(0);
  const cockedStateRef = useRef(cockedState)

  const controls = useAnimation();
  
  const variants = {
    dormant: {
      translateX: 0,
      rotate: 0,
    },
    partial: {
      translateX: -40,
      rotate: -5,
      transition: { duration: 0.1, ease: 'easeInOut' }
    },
    cocked: {
      translateX: -40,
      rotate: 5,
      transition: { duration: 0.1, ease: 'easeInOut' }
    },
  }

  function addPage(pageContent) {
    const newContent = content;
    newContent.push(pageContent);
    setContent(newContent);
    setCurPage(curPage + 1)
    //if (curPage > 0) scrollLeft()
  }

  const scrollLeft = () => {
    scroll_x.current -= 600;
    controls.start({ 
      x: scroll_x.current, 
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }  
    });
  };

  const scrollRight = () => {
    scroll_x.current += 600;
    controls.start({ 
      x: scroll_x.current, 
      transition: { 
        duration: 0.3,
        ease: 'easeInOut'
      }   
    });
  };
  
  function handleOpenPalm(e) {
    console.log('handleOpenPalm', cockedStateRef.current)
    props.unsubscribe("Hand_Coords", handleDetectCocking);

    if (cockedStateRef.current == 'partial') {
      setCockedState('dormant')
      handleOpenPalmRelease();
      handleNoGesture();
      return
    } else {
      setCoords(null);
    }

    setSelectMode('active');
    elementSelectedRef.current = false;
    anchor_x.current = e.detail.x;
    
    if (selectables.current.length > 0) {
      selectables.current.forEach(selectable => {
        selectable.unhighlight();
      });
    }

    const windowHeight = window.innerHeight;
    style.innerHTML = activatedScrollbar;
    document.head.appendChild(style);
    
    selectables.current = [];
    selectables.current.push(
      {
        element:null, 
        type:"scrollbar", 
        highlight:() => {
          style.innerHTML = highlightedScrollbar;
          document.head.appendChild(style);
        },
        unhighlight:() => {
          style.innerHTML = activatedScrollbar;
          document.head.appendChild(style);
        },
        trigger:() => {
          style.innerHTML = triggeredScrollbar;
          document.head.appendChild(style);
        },
        untrigger:() => {
          style.innerHTML = activatedScrollbar;
          document.head.appendChild(style);
        },
        clear:() => {
          style.innerHTML = clearedScrollbar;
          document.head.appendChild(style);
        }
      }
    ); // Scrollbar is special case

    const links = document.querySelectorAll('a');
    links.forEach((link) => {
      if (link.offsetHeight < windowHeight) {
        selectables.current.push({
          element:link,
          type:link.tagName,
          name: link.innerHTML,
          href: link.href,
          highlight:() => {
            link.classList.add('highlighted');
            link.classList.remove('triggered');
            link.classList.add('activated');
          },
          unhighlight:() => {
            link.classList.remove('highlighted');
            link.classList.remove('triggered');
            link.classList.add('activated');
          },
          trigger:() => {
            link.classList.remove('highlighted');
            link.classList.remove('activated');
            link.classList.add('triggered');
          },
          untrigger:() => {
            link.classList.remove('triggered');
            link.classList.add('activated');
          },
          clear:() => {
            link.classList.remove('triggered');
            link.classList.remove('activated');
            link.classList.remove('highlighted');
          }
        });
        link.classList.add('activated');
      }
      
    });

    selectables.current[index.current].highlight();
    props.unsubscribe("Hand_Coords", handleDetectCocking);
    props.subscribe("Hand_Coords", (e) => handleGestureXY(e));
    props.subscribe("Closed_Fist", (e) => handleClosedFist(e));
  }

  function handleOpenPalmRelease(e) {
    console.log('handleOpenPalmRelease')

    props.unsubscribe("Hand_Coords", handleGestureXY);
    props.unsubscribe("Closed_Fist", handleClosedFist);
    props.unsubscribe("Hand_Coords", handleDetectCocking);
    props.unsubscribe("Open_Palm", handleOpenPalm);
    addPage("THIS IS A TEST PAGE");
    scrollLeft();
  }

  function handleNoGesture() { 
    console.log('handleNoGesture')

    setCoords(null);
    setSelectMode('dormant');
    setCockedState('dormant')
    anchor_x.current = -10; // Reset anchor
    style.innerHTML = deactivatedScrollbar;
    document.head.appendChild(style);

    selectables.current.forEach(selectable => {
      selectable.clear();
    });
    props.unsubscribe("Hand_Coords", handleGestureXY);   
    props.unsubscribe("Hand_Coords", handleDetectCocking);
  }

  function handleGestureXY(e) {
    //console.log('handleGestureXY')

    if (!elementSelectedRef.current) {
      selectables.current[index.current].unhighlight();
      selectables.current[index.current].untrigger();
      
      const { x, y, z } = e.detail;
      index.current = selectables.current.length - Math.floor(Math.abs((0.3 - (x - anchor_x.current)) / 0.3) * selectables.current.length)
      
      if (index.current < 0) index.current = 0;
      if (index.current > selectables.current.length - 1) index.current = selectables.current.length - 1;

      selectables.current[index.current].highlight();
    }
  }

  function handleDetectCocking(e) {
    console.log('handleDetectCocking')

    const x = e.detail.x;
    const test_x = Math.abs(cock_anchor_x.current - x)
   
    if (test_x > 0.1) {
      setCockedState('partial')
    } else {
      setCockedState('dormant')
    }
  }

  function handleClosedFist(e) {
    console.log('handleClosedFist')

    elementSelectedRef.current = true;
    if (selectables.current[index.current]) {
      selectables.current[index.current].trigger();
      if ( selectables.current[index.current].type === 'A' ) {
        const rect = selectables.current[index.current].element.getBoundingClientRect();
        const x = rect.left - 8;
        const y = rect.top - 4;
        setSelectedLink(selectables.current[index.current].element.innerHTML);
        setCoords({ x, y });

        // Set anchor point for cocking gesture
        const hand_x = e.detail.x;
        cock_anchor_x.current = hand_x;
        props.unsubscribe("Hand_Coords", handleGestureXY);
        console.log(`1 props.subscribe("Hand_Coords")`)
        props.subscribe("Hand_Coords", (e) => handleDetectCocking(e));
      }
    }
    props.unsubscribe("Hand_Coords", handleGestureXY); 
    props.unsubscribe("Closed_Fist", handleClosedFist); 
    console.log(`2 props.unsubscribe("Hand_Coords")`)
    props.unsubscribe("Hand_Coords", handleDetectCocking);
  }

  useEffect(() => {
    props.subscribe("Open_Palm", (e) => handleOpenPalm(e));
    props.subscribe("No_Gesture", handleNoGesture);

    addPage(testContent);
  }, []);

  useEffect(() => {
    cockedStateRef.current = cockedState
    console.log('cockedStateRef.current', cockedStateRef.current)
  }, [cockedState]);

  
  return (
    <>
      <div style={{height:"60px", background:"none", marginTop:"40px"}}></div>

      <PageViewer 
        coords={coords} 
        selectMode={selectMode} 
        scrollLeft={scrollLeft}
        scrollRight={scrollRight}
        controls={controls}
        scroll_x={scroll_x}
        content={content}
        curPage={curPage}
      />
      
      {/* Other components */}
      {coords && <motion.div 
        animate={cockedState}
        variants={variants}
        initial="dormant"
        style={{ 
        position: 'absolute', 
        left: coords.x, 
        top: coords.y,
        background: '#fff200',
        paddingTop: '4px',
        paddingBottom: '4px',
        paddingLeft: '12px',
        paddingRight: '12px',
        boxShadow: '0px 0px 10px 0px #666',
        }}>{selectedLink}</motion.div>}

    </>
  );
}

export default WikipediaExplorer;
