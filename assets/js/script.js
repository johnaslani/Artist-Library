var searchTerm = document.querySelector("#search-input");
var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
var formatEl = document.querySelector('#format-input');
var bioSummary = document.querySelector('#bio');


console.log(searchTerm);

function searchWiki(searchInputVal) {
   
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'a535281b61mshce35bc85549ab99p1420dcjsn610a2113d2c1',
		'X-RapidAPI-Host': 'wiki-briefs.p.rapidapi.com'
	}
};

  var brokenSearch = searchInputVal.split(' ');
  var newSearchInput =  brokenSearch.join("%20");
  console.log(newSearchInput);


  fetch(`https://wiki-briefs.p.rapidapi.com/search?q=${newSearchInput}`, options
  )
    .then((response) => response.json())
    .then((response) => {
        console.log(response);
        var wiki = " ";
        for (var i = 0; i < response.summary.length; i++) {
                wiki += response.summary[i]
        }
        var textEl = document.createElement("a");
        var linkEl = document.createElement("a")
        linkEl.setAttribute("href", response.url);
        linkEl.textContent = response.title;
        textEl.textContent = wiki;
        resultTextEl.append(linkEl); 
        bioSummary.textContent = wiki;
        console.log(bioSummary);
     
    })
    .catch((err) => console.error(err));
}
// add the Video Api -


function handleSearchFormSubmit(event) {
    event.preventDefault();
  
    var searchInputVal = searchTerm.value;
    var formatInputVal = formatEl.value;
  
    console.log(searchInputVal);
    console.log(formatInputVal);

    if (!searchInputVal) {
      console.error('You need a search input value!');
      return;
    }

    // localStorage.setItem("lastname", searchInputVal);

  if (formatInputVal === "wiki") {
    searchWiki(searchInputVal);
  }

  if (formatInputVal === "video") {
    searchVideo(searchInputVal)
  }
    
  }
  

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
// getParams();