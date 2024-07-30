class WikipediaNavigator {
  constructor(
    setWikiPages, scroll_x, scrollXControls, 
    setCurIndex, GLOBAL_WIDTH, setPageQueueLength) {
    
    this.pageQueue = [];
    this.queueIndex = 0;
    this.count = 0;
    this.setWikiPages = setWikiPages;
    this.scroll_x = scroll_x;
    this.scrollXControls = scrollXControls;
    this.setCurIndex = setCurIndex;
    this.history = [];
    this.width = GLOBAL_WIDTH.current
    this.setPageQueueLength = setPageQueueLength;
  }

  addPageToQueue(wikiPage, moveForward = true) {
    this.count++;

    // If we are trying to add a page to the queue that is not the last page in the queue
    if (this.queueIndex < this.pageQueue.length - 1) {
      this.pageQueue = this.pageQueue.slice(0, this.queueIndex + 1);
    }

    const newPage = {
      wikiPage: wikiPage,
      prevWikiPage: this.pageQueue[this.queueIndex] ? this.pageQueue[this.queueIndex].wikiPage : null,
      title: wikiPage.replace(/_/g, ' '),
      id: `wikipage_${this.count}`,
      doRender: true,
      isCurPage: false,
      url: `https://en.wikipedia.org/wiki/${wikiPage}`,
      api: `https://en.wikipedia.org/w/api.php?action=parse&page=${wikiPage}&prop=text&format=json`,
      summary: 'This is a summary',
      wordCount: null, // Placeholder until we load content
    }

    this.pageQueue.push(newPage);

    // If we only have one page, render it
    if (this.pageQueue.length === 1) {
      this.setDoRender();
      this.queueIndex = 0;

      // Set the current index to trigger renders
      this.setCurIndex(this.queueIndex) 
    }  

    this.history.push({ 
      nodeId: newPage.id, 
      parentId: this.pageQueue.length === 1 ? null : this.pageQueue[this.queueIndex].id, 
      linkPosition: 50, 
      name: newPage.title,
      wordCount: 100, // Placeholder until we load content
    });
    
    this.setPageQueueLength(this.pageQueue.length);
    this.setWikiPages(this.pageQueue);
    if (moveForward) this.moveForward(false);
  }

  updateHistory(wikiPage) {
    // Find the history object with the matching ID
    const historyWikiPage = this.history.find(item => item.nodeId === wikiPage.id);
    if (historyWikiPage) {
      historyWikiPage.wordCount = wikiPage.wordCount; 
      historyWikiPage.title = wikiPage.title;
    }
  }

  setDoRender(renderNextPage = true) {
    // Render the current page and the pages before and after it
    this.pageQueue.map((page, index) => {
      page.doRender = index === this.queueIndex || 
        index === this.queueIndex - 2 || 
        index === this.queueIndex - 1 || 
        (index === this.queueIndex + 1 && renderNextPage) ||
        (index === this.queueIndex + 2 && renderNextPage);
      page.isCurPage = index === this.queueIndex;
    });
  }

  moveForward(renderNextPage = true) { 
    console.log('moveForward', this.queueIndex, this.pageQueue.length - 1);
    if (this.queueIndex === this.pageQueue.length - 1) return;
    this.queueIndex++;

    this.setCurIndex(this.queueIndex) 
    this.setDoRender(renderNextPage); 
    this.setWikiPages(this.pageQueue);
    
    this.scroll_x.current -= this.width;
    this.scrollXControls.start({ 
      x: this.scroll_x.current, 
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }  
    });
  }

  moveBack() {  
    if (this.queueIndex <= 0) return;
    this.queueIndex--;

    this.setCurIndex(this.queueIndex) 
    this.setDoRender();
    this.setWikiPages(this.pageQueue);

    this.scroll_x.current += this.width;
    this.scrollXControls.start({ 
      x: this.scroll_x.current, 
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }  
    });
  }

  getCurPage() {
    return this.pageQueue[this.queueIndex];
  }

  getHistory() {
    return this.history;
  }

  getBackButtonDisabled() {
    return this.queueIndex === 0;
  }

  getForwardButtonDisabled() {
    return this.queueIndex === this.pageQueue.length - 1;
  }

  handleLinkClick(href) {
    const wikiPage = href.split('/').pop();
    this.addPageToQueue(wikiPage);
  }
}

export default WikipediaNavigator;