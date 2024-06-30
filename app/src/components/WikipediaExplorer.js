import React, { useEffect, useState, useRef, useContext } from 'react';
import { LogContext } from './LogContext';

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

var index = 0;

function WikipediaExplorer(props) {
  const [selectedLink, setSelectedLink] = useState("");
  const [elementSelected, setElementSelected] = useState(false);
  const [coords, setCoords] = useState(null);

  const elementSelectedRef = useRef(false);
  const anchor_x = useRef(-10);
  const selectables = useRef([]);
  
  function handleOpenPalm(e) {
    console.log('handleOpenPalm')

    setCoords(null);
    elementSelectedRef.current = false;
    if (anchor_x.current < -1) anchor_x.current = e.detail.x;
    
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
  
    selectables.current[index].highlight();
    props.subscribe("Hand_Coords", (e) => handleGestureXY(e));
    props.subscribe("Closed_Fist", handleClosedFist);
    props.subscribe("No_Gesture", handleNoGesture);
  }

  function handleNoGesture(e) { 
    console.log('handleNoGesture')

    setCoords(null);
    anchor_x.current = -10; // Reset anchor
    style.innerHTML = deactivatedScrollbar;
    document.head.appendChild(style);

    selectables.current.forEach(selectable => {
      selectable.clear();
    });
    props.unsubscribe("Hand_Coords", handleGestureXY);   
  }

  function handleGestureXY(e) {
    if (!elementSelectedRef.current) {
      selectables.current[index].unhighlight();
      selectables.current[index].untrigger();
      
      const { x, y, z } = e.detail;
      index = Math.floor(Math.abs((0.4 - x - anchor_x.current) / 0.4) * selectables.current.length)
      
      if (index < 0) index = 0;
      if (index > selectables.current.length - 1) index = selectables.current.length - 1;

      selectables.current[index].highlight();
    }
  }

  function handleClosedFist() {
    console.log('handleClosedFist')

    elementSelectedRef.current = true;
    if (selectables.current[index]) {
      selectables.current[index].trigger();
      if ( selectables.current[index].type === 'A' ) {
        const rect = selectables.current[index].element.getBoundingClientRect();
        const x = rect.left - 8;
        const y = rect.top - 8;
        setSelectedLink(selectables.current[index].element.innerHTML);
        setCoords({ x, y });
      }
    }
    props.unsubscribe("Hand_Coords", handleGestureXY); 
    props.unsubscribe("Closed_Fist", handleClosedFist); 
  }

  useEffect(() => {
    props.subscribe("Open_Palm", (e) => handleOpenPalm(e));
  }, []);

  
  return (
    <>
      <div style={{height:"60px", background:"none", marginTop:"40px"}}>

      </div>
      <div style={{
        display:"flex", 
        flexDirection:"row", 
        marginLeft:"120px",
        marginBottom:"40px", 
        background:"none",
        width:"600px",
        height:"calc(100vh - 80px)",
        overflowY:"scroll",
        paddingRight:"20px",
        opacity: coords ? 0.3 : 1,
      }}>
        <div style={{lineHeight:"1.6em"}}>
        <p>
        Richard Buckminster Fuller (/ˈfʊlər/; July 12, 1895 – July 1, 1983)[1] was an American architect, systems theorist, writer, designer, inventor, philosopher, and futurist. He styled his name as R. Buckminster Fuller in his writings, publishing more than 30 books and coining or popularizing such terms as "Spaceship Earth", "<a href="https://en.wikipedia.org/wiki/Dymaxion">Dymaxion</a>" (e.g., Dymaxion house, Dymaxion car, Dymaxion map), "ephemeralization", "synergetics", and "tensegrity".
        </p>
        <p>
        Fuller developed numerous inventions, mainly architectural designs, and popularized the widely known geodesic dome; carbon molecules known as fullerenes were later named by scientists for their structural and mathematical resemblance to geodesic spheres. He also served as the second World President of <a href="https://en.wikipedia.org/wiki/Dymaxion">Mensa International</a> from 1974 to 1983.[2][3]
        </p>
        <p>
        Fuller was awarded 28 United States patents[4] and many honorary doctorates. In 1960, he was awarded the Frank P. Brown Medal from The Franklin Institute. He was elected an honorary member of Phi Beta Kappa in 1967, on the occasion of the 50-year reunion of his Harvard class of 1917 (from which he was expelled in his first year).[5][6] He was elected a Fellow of the American Academy of Arts and Sciences in 1968.[7] The same year, he was elected into the National Academy of Design as an Associate member. He became a full Academician in 1970, and he received the Gold Medal award from the <a href="https://en.wikipedia.org/wiki/Dymaxion">American Institute of Architects</a> the same year. Also in 1970, Fuller received the title of Master Architect from Alpha Rho Chi (APX), the national fraternity for architecture and the allied arts.[8] In 1976, he received the St. Louis Literary Award from the Saint Louis University Library Associates.[9][10] In 1977, he received the Golden Plate Award of the American Academy of Achievement.[11] He also received numerous other awards, including the Presidential Medal of Freedom, presented to him on February 23, 1983, by President Ronald Reagan.[12]
        </p>
        <p>
        Life and work
        </p>
        <p>
        Fuller c. 1910
        </p>
        <p>
        Fuller was born on July 12, 1895, in Milton, Massachusetts, the son of <a href="https://en.wikipedia.org/wiki/Dymaxion">Richard Buckminster Fuller</a> and Caroline Wolcott Andrews, and grand-nephew of Margaret Fuller, an American journalist, critic, and women's rights advocate associated with the American transcendentalism movement. The unusual middle name, Buckminster, was an ancestral family name. As a child, Richard Buckminster Fuller tried numerous variations of his name. He used to sign his name differently each year in the guest register of his family summer vacation home at Bear Island, Maine. He finally settled on R. Buckminster Fuller.[13]
        </p>
        <p>
        Fuller spent much of his youth on Bear Island, in Penobscot Bay off the coast of Maine. He attended Froebelian Kindergarten.[14] He was dissatisfied with the way geometry was taught in school, disagreeing with the notions that a chalk dot on the blackboard represented an "empty" mathematical point, or that a line could stretch off to infinity. To him these were illogical, and led to his work on synergetics. He often made items from materials he found in the woods, and sometimes made his own tools. He experimented with designing a new apparatus for human propulsion of small boats. By age 12, he had invented a 'push pull' system for propelling a rowboat by use of an inverted umbrella connected to the transom with a simple oar lock which allowed the user to face forward to point the boat toward its destination. Later in life, Fuller took exception to the term "invention".
        </p>
        <p>
        Years later, he decided that this sort of experience had provided him with not only an interest in design, but also a habit of being familiar with and knowledgeable about the materials that his later projects would require. Fuller earned a machinist's certification, and knew how to use the press brake, stretch press, and other tools and equipment used in the sheet metal trade.[15]
        </p>
        <p>
        Education
        </p>
        <p>
        Fuller attended Milton Academy in Massachusetts, and after that began studying at Harvard College, where he was affiliated with Adams House. He was expelled from Harvard twice: first for spending all his money partying with a vaudeville troupe, and then, after having been readmitted, for his "irresponsibility and lack of interest". By his own appraisal, he was a non-conforming misfit in the fraternity environment.[15]
        </p>
        <p>
        Wartime experience
        </p>
        <p>
        Between his sessions at Harvard, Fuller worked in Canada as a mechanic in a textile mill, and later as a laborer in the meat-packing industry. He also served in the U.S. Navy in World War I, as a shipboard radio operator, as an editor of a publication, and as commander of the crash rescue boat USS Inca. After discharge, he worked again in the meat-packing industry, acquiring management experience. In 1917, he married Anne Hewlett. During the early 1920s, he and his father-in-law developed the Stockade Building System for producing lightweight, weatherproof, and fireproof housing—although the company would ultimately fail[15] in 1927.[16]
        </p>
        <p>
          Depression and epiphany
        </p>
        <p>
        Fuller recalled 1927 as a pivotal year of his life. His daughter Alexandra had died in 1922 of complications from polio and spinal meningitis[17] just before her fourth birthday.[18] Barry Katz, a Stanford University scholar who wrote about Fuller, found signs that around this time in his life Fuller had developed depression and anxiety.[19] Fuller dwelled on his daughter's death, suspecting that it was connected with the Fullers' damp and drafty living conditions.[18] This provided motivation for Fuller's involvement in Stockade Building Systems, a business which aimed to provide affordable, efficient housing.[18]
        </p>
        <p> 
        In 1927, at age 32, Fuller lost his job as president of Stockade. The Fuller family had no savings, and the birth of their daughter Allegra in 1927 added to the financial challenges. Fuller drank heavily and reflected upon the solution to his family's struggles on long walks around Chicago. During the autumn of 1927, Fuller contemplated suicide by drowning in Lake Michigan, so that his family could benefit from a life insurance payment.[20]
        </p>
        <p>
        Fuller said that he had experienced a profound incident which would provide direction and purpose for his life. He felt as though he was suspended several feet above the ground enclosed in a white sphere of light. A voice spoke directly to Fuller, and declared:
        </p>
        <p>
        From now on you need never await temporal attestation to your thought. You think the truth. You do not have the right to eliminate yourself. You do not belong to you. You belong to the Universe. Your significance will remain forever obscure to you, but you may assume that you are fulfilling your role if you apply yourself to converting your experiences to the highest advantage of others.[21]
        </p>
        <p>
        Fuller stated that this experience led to a profound re-examination of his life. He ultimately chose to embark on "an experiment, to find what a single individual could contribute to changing the world and benefiting all humanity".[22]
        </p>
        <p>
        Speaking to audiences later in life, Fuller would frequently recount the story of his Lake Michigan experience, and its transformative impact on his life.
        </p>
        <p>
        Recovery
        </p>
        <p>
        In 1927, Fuller resolved to think independently which included a commitment to "the search for the principles governing the universe and help advance the evolution of humanity in accordance with them ... finding ways of doing more with less to the end that all people everywhere can have more and more".[citation needed] By 1928, Fuller was living in Greenwich Village and spending much of his time at the popular café Romany Marie's,[23] where he had spent an evening in conversation with Marie and Eugene O'Neill several years earlier.[24] Fuller accepted a job decorating the interior of the café in exchange for meals,[23] giving informal lectures several times a week,[24][25] and models of the Dymaxion house were exhibited at the café. Isamu Noguchi arrived during 1929—Constantin Brâncuși, an old friend of Marie's,[26] had directed him there[23]—and Noguchi and Fuller were soon collaborating on several projects,[25][27] including the modeling of the Dymaxion car based on recent work by Aurel Persu.[28] It was the beginning of their lifelong friendship.
        </p>
        <p>
        Geodesic domes
        </p>
        <p>
        Fuller taught at Black Mountain College in North Carolina during the summers of 1948 and 1949,[29] serving as its Summer Institute director in 1949. Fuller had been shy and withdrawn, but he was persuaded to participate in a theatrical performance of Erik Satie's Le piège de Méduse produced by John Cage, who was also teaching at Black Mountain. During rehearsals, under the tutelage of Arthur Penn, then a student at Black Mountain, Fuller broke through his inhibitions to become confident as a performer and speaker.[30]
        </p>
        <p>
        At Black Mountain, with the support of a group of professors and students, he began reinventing a project that would make him famous: the geodesic dome. Although the geodesic dome had been created, built and awarded a German patent on June 19, 1925, by Dr. Walther Bauersfeld, Fuller was awarded United States patents. Fuller's patent application made no mention of Bauersfeld's self-supporting dome built some 26 years prior. Although Fuller undoubtedly popularized this type of structure he is mistakenly given credit for its design.
        </p>
        <p>
        One of his early models was first constructed in 1945 at Bennington College in Vermont, where he lectured often. Although Bauersfeld's dome could support a full skin of concrete it was not until 1949 that Fuller erected a geodesic dome building that could sustain its own weight with no practical limits. It was 4.3 meters (14 feet) in diameter and constructed of aluminium aircraft tubing and a vinyl-plastic skin, in the form of an icosahedron. To prove his design, Fuller suspended from the structure's framework several students who had helped him build it. The U.S. government recognized the importance of this work, and employed his firm Geodesics, Inc. in Raleigh, North Carolina to make small domes for the Marines. Within a few years, there were thousands of such domes around the world.
        </p>
        <p>
        For the structural principle, based on compression and tension, named by Fuller in the 1960s, see Tensegrity.
        </p>
        <p>
        Fuller's first "continuous tension – discontinuous compression" geodesic dome (full sphere in this case) was constructed at the University of Oregon Architecture School in 1959 with the help of students.[31] These continuous tension – discontinuous compression structures featured single force compression members (no flexure or bending moments) that did not touch each other and were 'suspended' by the tensional members.
        </p>

        </div>
      </div>
      {/* Other components */}
      {coords && <div style={{ 
        position: 'absolute', 
        left: coords.x, 
        top: coords.y,
        background: '#fff200',
        paddingTop: '4px',
        paddingBottom: '4px',
        paddingLeft: '12px',
        paddingRight: '12px',
        boxShadow: '0px 0px 10px 0px #666',
        }}>{selectedLink}</div>}

    </>
  );
}

export default WikipediaExplorer;
