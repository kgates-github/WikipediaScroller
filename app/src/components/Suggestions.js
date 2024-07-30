import React, { useEffect, useMemo, useState } from 'react';
import SuggestionCard from './SuggestionCard';
    
function Suggestions(props) {
  const testData = [
    {
      id: 1,
      title: "The Great Gatsby",
      description: "The Great Gatsby is a novel written by American author F. Scott Fitzgerald that follows a cast of characters living in the fictional towns of West Egg and East Egg on prosperous Long Island in the summer of 1922.",
      image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/42/Gatsby_1974.jpg/220px-Gatsby_1974.jpg",
      url: "https://en.wikipedia.org/wiki/The_Great_Gatsby"
    },
    {
      id: 2,
      title: "The Catcher in the Rye",
      description: "The Catcher in the Rye is a novel by J. D. Salinger, partially published in serial form in 1945–1946 and as a novel in 1951.",
      image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/32/Rye_catcher.jpg/220px-Rye_catcher.jpg",
      url: "https://en.wikipedia.org/wiki/The_Catcher_in_the_Rye"
    },
    {
      id: 3,
      title: "To Kill a Mockingbird",
      description: "To Kill a Mockingbird is a novel by Harper Lee published in 1960. Instantly successful, widely read in high schools and middle schools in the United States, it has become a classic of modern American literature.",
      image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/79/To_Kill_a_Mockingbird.jpg/220px-To_Kill_a_Mockingbird.jpg",
      url: "https://en.wikipedia.org/wiki/To_Kill_a_Mockingbird"
    },
    {
      id: 4,
      title: "1984",
      description: "Nineteen Eighty-Four: A Novel, often referred to as 1984, is a dystopian social science fiction novel by the English novelist George Orwell.",
      image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/1984first.jpg/220px-1984first.jpg",
      url: "https://en.wikipedia.org/wiki/Nineteen_Eighty-Four"
    },
  ]

  useEffect(() => {
    console.log('Suggestions props.curIndex', props.curIndex);
    return () => {
      console.log('Suggestions unmounted');
    }
  },[props.curIndex]);
  
  return (
    <div style={{ paddingTop:"8px", paddingLeft:"12px", maxWidth:"600px", paddingRight:"12px"}}>
      {props.highlightMode == 'highlight' ? testData.map((suggestion, index) => (
        <SuggestionCard key={index} suggestion={suggestion} />
      )) : null}
    </div>
  );
}

export default Suggestions;
