class WikipediaNavigator {
  constructor(setWikiPages, scroll_x, scrollXControls, setCurIndex) {
    this.pageQueue = [];
    this.queueIndex = 0;
    this.count = 0;
    this.setWikiPages = setWikiPages;
    this.scroll_x = scroll_x;
    this.scrollXControls = scrollXControls;
    this.setCurIndex = setCurIndex;
  }

  addPageToQueue(wikiPage) {
    this.count++;

    // If we are trying to add a page to the queue that is not the last page in the queue
    if (this.queueIndex < this.pageQueue.length - 1) {
      this.pageQueue = this.pageQueue.slice(0, this.queueIndex);
    }
    this.pageQueue.push({
      wikiPage: wikiPage,
      title: wikiPage.replace(/_/g, ' '),
      id: `${wikiPage}_${this.count}`,
      doRender: true,
      url: `https://en.wikipedia.org/wiki/${wikiPage}`,
      api: `https://en.wikipedia.org/w/api.php?action=parse&page=${wikiPage}&prop=text&format=json`,
      summary: 'This is a summary',
    });


    // If we only have one page, render it
    if (this.pageQueue.length === 1) {
      this.setDoRender();
      this.queueIndex = 0;

      // Set the current index to trigger renders
      this.setCurIndex(this.queueIndex) 
    }

    this.setWikiPages(this.pageQueue);
    this.moveForward();

    console.log('-------------')
    console.log('addPageToQueue', this.pageQueue);
    console.log('queueIndex', this.queueIndex);
    console.log('-------------')
  }

  setDoRender() {
    // Render the current page and the pages before and after it
    this.pageQueue.map((page, index) => {
      page.doRender = index === this.queueIndex || index === this.queueIndex-1 || index === this.queueIndex+1;
    })
  }

  moveForward() { 
    if (this.queueIndex === this.pageQueue.length - 1) return;
    this.queueIndex++;

    this.setCurIndex(this.queueIndex) 
    this.setDoRender();
    this.setWikiPages(this.pageQueue);
    
    this.scroll_x.current -= 800;
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

    this.scroll_x.current += 800;
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

/*

Create wikiPage for pageQueue
{
  title: 'Main Page',
  id: 'Main_Page_0',
  url: 'https://en.wikipedia.org/wiki/Main_Page',
  get: 'https://en.wikipedia.org/w/api.php?action=parse&page=Main_Page&prop=text&format=json',
  summary: 'Main Page',
}
Set queueIndex to 0
Set curPage to wikiPage at queueIndex (which renders the new page)

CLICK LINK
  If queueIndex < length of pageQueue, truncate pageQueue (let truncatedArray = originalArray.slice(0, 3))
  Remove all pages before queueIndex - 1 (memory management)
  Add wikiPage to pageQueue
  Set queueIndex to queueIndex + 1
  Set curPage to wikiPage at queueIndex (which renders the new page)
  Scroll left to show the new page



*/