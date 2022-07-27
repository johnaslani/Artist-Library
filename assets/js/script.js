var searchTerm = document.querySelector("#search-input");
var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
var formatEl = document.querySelector('#format-input');

console.log(searchTerm);

function searchWiki(searchInputVal) {
   
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "a535281b61mshce35bc85549ab99p1420dcjsn610a2113d2c1",
      "X-RapidAPI-Host": "search-celebrity-biography.p.rapidapi.com",
    },
  };

  
  fetch(
    `https://search-celebrity-biography.p.rapidapi.com/search/${searchInputVal}`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
        console.log(response);
        var wiki = "";
        for (var i = 0; i < response.moreFacts.length; i++) {
            if (response.moreFacts[i].name === "Wiki"){
                wiki = response.moreFacts[i].value
            }
        }
        var linkEl = document.createElement("a");
        linkEl.setAttribute("href", wiki);
        linkEl.textContent = response.name;
        resultTextEl.append(linkEl);
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
  if (formatInputVal === "wiki") {
    searchWiki(searchInputVal);
  }

  if (formatInputVal === "video") {
    searchVideo(searchInputVal)
  }
    
  }
  

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
// getParams();