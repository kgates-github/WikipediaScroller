class WikipediaNavigator {
  constructor() {
    this.pageQueue = [];
    this.queueIndex = -1;
    this.count = 0
    console.log('WikipediaNavigator constructor');
  }

  addPageToQueue(wikiPage) {
    this.count++;

    // If we are trying to add a page to the queue that is not the last page in the queue
    if (this.queueIndex < this.pageQueue.length - 1) {
      this.pageQueue = this.pageQueue.slice(0, this.queueIndex);
    }
    this.pageQueue.push({
      title: wikiPage,
      id: `${wikiPage}_${this.count}`,
      url: `https://en.wikipedia.org/wiki/${wikiPage}`,
      get: `https://en.wikipedia.org/w/api.php?action=parse&page=${wikiPage}&prop=text&format=json`,
      summary: 'This is a summary',
    });

    // Make the new page the current page
    this.queueIndex = this.pageQueue.length - 1;
    console.log('-----------------')
    console.log('addPageToQueue', this.pageQueue);
    console.log('queueIndex', this.queueIndex);
  }

  getCurPage() {
    return this.pageQueue[this.queueIndex];
  }

  getBackButtonDisabled() {
    return this.queueIndex <= 0;
  }

  getForwardButtonDisabled() {
    return this.queueIndex === this.pageQueue.length - 1;
  }

  handleLinkClick(href) {
    const wikiPage = href.split('/').pop();
    this.addPageToQueue(wikiPage);
  }

  replacementFunction = (match, href) => {
    if (href.includes('wiki')) {
      return match;
    } else {
      return '';
    }
  };

  fetchWikiPage = async(wikiPage) => {
    try {
      const pattern = /<a\s+[^>]*href=["'][^"']*?([^"']*wiki[^"']*|[^"'>]*)["'][^>]*>(.*?)<\/a>/gi;
      const response = await fetch(
        wikiPage.get
      );

      if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
    
      const data = await response.json();
      let truncatedText = data.parse.text["*"].split("References")[0];
      
      // Apply the replacement function to the truncatedText
      let cleanedText = truncatedText.replace(pattern, this.replacementFunction);
      cleanedText = cleanedText.replace(/\[|\]/g, '');

      return {
        id: wikiPage.id,
        title: data.parse.title,
        text: cleanedText
      };
    } catch (error) {
      console.log(error.message);
    }
  };
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