class WikipediaNavigator {
  constructor(setWikiPages, scroll_x, scrollXControls, setCurIndex) {
    this.pageQueue = [];
    this.queueIndex = 0;
    this.count = 0;
    this.setWikiPages = setWikiPages;
    this.scroll_x = scroll_x;
    this.scrollXControls = scrollXControls;
    this.setCurIndex = setCurIndex;
    this.history = [];
  }

  addPageToQueue(wikiPage) {
    this.count++;

    // If we are trying to add a page to the queue that is not the last page in the queue
    if (this.queueIndex < this.pageQueue.length - 1) {
      this.pageQueue = this.pageQueue.slice(0, this.queueIndex + 1);
    }

    const newPage = {
      wikiPage: wikiPage,
      prevWikiPage: this.pageQueue[this.queueIndex] ? this.pageQueue[this.queueIndex].wikiPage : null,
      title: wikiPage.replace(/_/g, ' '),
      id: `${wikiPage}_${this.count}`,
      doRender: true,
      isCurPage: false,
      url: `https://en.wikipedia.org/wiki/${wikiPage}`,
      api: `https://en.wikipedia.org/w/api.php?action=parse&page=${wikiPage}&prop=text&format=json`,
      summary: 'This is a summary',
    }

    this.pageQueue.push(newPage);
    this.history.push(newPage);

    // If we only have one page, render it
    if (this.pageQueue.length === 1) {
      this.setDoRender();
      this.queueIndex = 0;

      // Set the current index to trigger renders
      this.setCurIndex(this.queueIndex) 
    }

    this.setWikiPages(this.pageQueue);
    this.moveForward(false);
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
    if (this.queueIndex === this.pageQueue.length - 1) return;
    this.queueIndex++;

    this.setCurIndex(this.queueIndex) 
    this.setDoRender(renderNextPage); 
    this.setWikiPages(this.pageQueue);
    
    this.scroll_x.current -= 600;
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

    this.scroll_x.current += 600;
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