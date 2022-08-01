// TODO: Move all contents to jquery
//  - DOM selection (query selector)
//  - listening events
//  - element creation

// Globals
const NAPSTER_API_KEY = "ZTE3MmM4YTItMzY0Ni00OGM1LWE2NDUtMDc2ZDgyNGUwMGQz"

const WIKI_ENDPOINT_OPTIONS = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'a535281b61mshce35bc85549ab99p1420dcjsn610a2113d2c1',
		'X-RapidAPI-Host': 'wiki-briefs.p.rapidapi.com'
	}
};

// =============================================================================
// DOM Objects
// TODO: Convert these DOM objects to jquery
var searchTerm = document.querySelector("#search-input");
var resultTextEl = document.querySelector('#result-text');
// var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
var formatEl = document.querySelector('#format-input');
var searchResultsEl = $('#search-results');
var savedArtistsEl = $('#saved-artists');

// =============================================================================
// Napster API Fetch Calls

function removeArtistFromSearchHistory(event) {
  var elementToRemove = $("#" + event.data.cardId);
  elementToRemove.remove();
  // TODO: remove an item from local storage

}

function showArtistSearch(event) {
  searchNapsterArtist(event.data.name, 1);
};

function saveArtistToLocalStorage(artistId, artistData) {
  // Save to local storage if the artist ID hasn't already been saved
  var savedArtists = Object.keys(localStorage);  // returns array of keys

  // var artistIsAlreadySaved = (savedArtists.indexOf("artistId") > -1);  // returns bool
  var artistIsAlreadySaved = savedArtists.includes(artistId);  // returns bool
  if (!artistIsAlreadySaved) {
    localStorage.setItem(artistId, JSON.stringify(artistData));
  };

}

function addArtistToSavedList(artistId, artistData) {

  // Make a new element/card
  var card = $("<div>");
  card.addClass("card");
  var cardId = artistId + "-card-saved";
  card.attr("id", cardId);

  // Generate the header
  var header = $("<header>");
  header.addClass("card-header");
  var headerTitle = $("<p>");
  headerTitle.addClass("card-header-title");
  console.log("Artist name, logged from listApend: ", artistData.name);
  headerTitle.text(artistData.name);
  header.append(headerTitle);
  card.append(header);

  // Card Footer - buttons below the Card Content
  var footerEl = $("<footer>");
  footerEl.addClass("card-footer");
  
  // Make a "remove" button to remove the artist from the search history
  var removeEl = $("<a>");
  removeEl.addClass("card-footer-item").text("Remove");
  removeEl.attr("#");
  // Event listener to move to saved searches
  removeEl.on("click", {cardId: cardId}, removeArtistFromSearchHistory);
  footerEl.append(removeEl);

  // Show results for this artist
  var showEl = $("<a>");
  showEl.addClass("card-footer-item").text("Show Artist");
  showEl.attr("#");
  // Event listener to move to saved searches
  showEl.on("click", {name: artistData.name}, showArtistSearch);
  
  footerEl.append(showEl);
  card.append(footerEl);

  // Append to list
  savedArtistsEl.append(card);

}


function saveArtistOnClick(event) {
  console.log("Artist save button has been clicked.");
  var artistId = event.data.artistId;
  var artistData = event.data.artistData;
  addArtistToSavedList(artistId, artistData);
  saveArtistToLocalStorage(artistId, artistData);
}


// Generate the DOM elements for an artist card
function generateArtistCard(artistId, artistData) {
  // Docs for the Bulma card can be found here:
  //  https://bulma.io/documentation/components/card/

  var card = $("<div>");
  card.addClass("card");
  card.addClass(artistId + "-card")

  // Generate the header
  var header = $("<header>");
  header.addClass("card-header");
  var headerTitle = $("<p>");
  headerTitle.addClass("card-header-title");
  headerTitle.text(artistData.name);
  header.append(headerTitle);
  card.append(header);

  // Generate the Image content.
  // The image URL requires a different API endpoint,
  //  so the image `src` will be set by a different function.
  var artistImageDivEl = $("<div>");
  artistImageDivEl.addClass("card");
  var imageDivEl = $("<div>");
  imageDivEl.addClass("card-image");
  var figureEl = $("<figure>");
  figureEl.addClass("image");
  var imageEl = $("<img>");
  imageEl.attr("id", artistId + "-img");
  imageEl.attr("alt", "Cover Image for " + artistData.name);
  figureEl.append(imageEl);
  imageDivEl.append(figureEl);
  artistImageDivEl.append(imageDivEl);
  card.append(artistImageDivEl);

  // Card Content - the API response `artist.bios.bio` is not
  //  consistently returned, so use the `artist.blurbs` array
  //  to populate the card content.
  var cardContent = $("<div>");
  cardContent.addClass("card-content");
  var content = $("<div>");
  content.addClass("content");
  var bioText = "(No artist bio available.)";
  if (artistData.blurbs.length >= 1) {
    bioText = artistData.blurbs[0];
  };
  content.text(bioText);
  cardContent.append(content);
  card.append(cardContent);

  // Card Footer - buttons below the Card Content
  var footerEl = $("<footer>");
  footerEl.addClass("card-footer");
  
  // The save button adds the artist to the "Saved Artists" list,
  // and adds the artist contents to local storage for later
  // retrieval when the page is refreshed
  var saveEl = $("<a>");
  saveEl.addClass("card-footer-item").text("Save");
  saveEl.attr("#");
  // Event listener to move to saved searches
  var artistEventData = {artistId: artistId, artistData: artistData}
  saveEl.on("click", artistEventData, saveArtistOnClick)

  footerEl.append(saveEl);

  // The Wiki link button will take the user to the artist page.
  // The URL will be set asynchronously after the Wiki API fetch
  //  response returns the URL for the artist.
  var moreInfoEl = $("<a>");
  moreInfoEl.addClass("card-footer-item").text("Wiki");
  moreInfoEl.attr("href", "#");
  moreInfoEl.attr("id", artistId + "-wiki");
  footerEl.append(moreInfoEl);
  card.append(footerEl);
  
  return card;
};

function setArtistImageUrl(artistId, artistImageSearchUrl) {
// Make another fetch to capture the Image link

  console.log("Artist image search URL: ", artistImageSearchUrl);

  fetch(artistImageSearchUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (responseData) {
      console.log(responseData);

      var imageEl = $("#" + artistId + "-img");
      console.log("imageEl: ", imageEl);
      if (responseData.images.length > 0) {
        imageEl.attr("src", responseData.images[0].url);
        console.log("Image URL: ", responseData.images[0].url);
      }
      else {
        imageEl.attr("alt", "(No image available)");
      }
    })
    .catch(function (error) {
      console.error(error);
    });
};


// Use the Wiki briefs API to get the Wiki link
function setArtistWikiUrl(artistId, searchInputVal) {
   
  searchInputVal =  searchInputVal.split(' ').join("%20");
  var wikiSearchUrl = `https://wiki-briefs.p.rapidapi.com/search?q=${searchInputVal}`;

  fetch(wikiSearchUrl, WIKI_ENDPOINT_OPTIONS)
    .then((response) => response.json())
    .then((response) => {
        console.log("Wiki artist search: ", response);
        
        var artistWikiEl = $("#" + artistId + "-wiki");
        artistWikiEl.attr("href", response.url);
    })
    .catch((err) => console.error(err));
};


// Artist Search
function searchNapsterArtist(artistSearchInput, numberOfResponses) {

  // First, clear out any existing contents for the container
  searchResultsEl.empty();
    
  var artistSearchUrl = (
    'https://api.napster.com/v2.2/search?query='
    + artistSearchInput.split(' ').join('%20')
    + '&type=artist'
    + '&per_type_limit=' + structuredClone(numberOfResponses)
    + '&apikey=' + NAPSTER_API_KEY
  );

  fetch(artistSearchUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (responseData) {

      var data = responseData.search.data;

      var loopCounter = 0
      for (var artistData of data.artists) {
        loopCounter += 1
        console.log("On loop: ", loopCounter);
        console.log("Artist Data: ", artistData);

        // The artist ID will be used for Element IDs such that
        // the appropriate element can be populated asynchronously
        var artistId = artistData.id.replace(".", "-");

        // Generate the DOM contents for the card for the current artist response
        var artistCardEl = generateArtistCard(artistId, artistData);
        searchResultsEl.append(artistCardEl)

        // Make another Napster API fetch to populate the Image link
        var artistImageSearchUrl = (
          artistData.links.images.href
          + '?apikey='
          + NAPSTER_API_KEY
        );
        setArtistImageUrl(artistId, artistImageSearchUrl)

        // Make a Wiki API fetch to set the Wiki URL in the card footer
        setArtistWikiUrl(artistId, artistData.name)

      };
    })
    .catch(function (error) {
      console.error(error);
    });
}


  // Currently not used/working!
// Album Search
function searchNapsterAlbum(albumSearchInput) {
    
  var albumSearchUrl = (
    'https://api.napster.com/v2.2/search?query='
    + albumSearchInput.split(' ').join('%20')
    + '&type=album&per_type_limit=1&apikey='
    + NAPSTER_API_KEY
  );

  fetch(albumSearchUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (responseData) {
      console.log(responseData);

    })
    .catch(function (error) {
      console.error(error);
    });
}


// Currently not used/working!
// Track Seach
function searchNapsterTrack(trackSearchInput) {
    
  var trackSearchUrl = (
    'https://api.napster.com/v2.2/search?query='
    + trackSearchInput.split(' ').join('%20')
    + '&type=track&per_type_limit=1&apikey='
    + NAPSTER_API_KEY
  );

  fetch(trackSearchUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (responseData) {
      console.log(responseData);

    })
    .catch(function (error) {
      console.error(error);
    });
  }
  
// =============================================================================
// Wikipedia (Wiki Briefs) API Fetch Calls
console.log(searchTerm);

function searchWiki(searchInputVal) {
   
  searchInputVal =  searchInputVal.split(' ').join("%20");

  fetch(`https://wiki-briefs.p.rapidapi.com/search?q=${searchInputVal}`, WIKI_ENDPOINT_OPTIONS
  )
    .then((response) => response.json())
    .then((response) => {
        console.log(response);
        
        // // Loop over the blurb to join the strings into one response
        // var wiki = "";
        // for (var i = 0; i < response.summary.length; i++) {
        //         wiki += response.summary[i] + ' ';
        // }
        // var textEl = $("<a>");
        // var linkEl = $("<a>")
        // linkEl.attr("href", response.url);
        // linkEl.text = response.title;
        // textEl.text = wiki;
        // resultTextEl.append(linkEl); 
        // resultTextEl.append(textEl);
     
    })
    .catch((err) => console.error(err));
}
// add the Video Api -


// =============================================================================
// Capture user search input and make appropriate API calls
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
  if (formatInputVal === "artist") {
      searchNapsterArtist(searchInputVal, 3);
      console.log("Calling Napster API for artist search: ", formatInputVal)
  }
  // Currently not used/working!
  else if (formatInputVal === "album") {
      searchNapsterAlbum(searchInputVal);
      console.log("Calling Napster API for album search: ", formatInputVal)
  }
  // Currently not used/working!
  else if (formatInputVal === "track") {
      searchNapsterTrack(searchInputVal);
      console.log("Calling Napster API for track search: ", formatInputVal)
  }

}
  

searchFormEl.addEventListener('submit', handleSearchFormSubmit);

// TODO: Add another search input field after the Napster call is returned
//    ... or maybe add another search box on the napster return?


// Initialize the page using local storage.
function init() {
  console.log("Local storage getting called.");

  // Used local storage to pre-populate the saved fields
  // The keys are saved as the "artist-id", which is not known at runtime,
  // so loop over all local storage keys and retrieve the associated value.
  var localKeys = Object.keys(localStorage);
  
  for (var artistId of localKeys) {
    var artistData = JSON.parse(localStorage.getItem(artistId));
    addArtistToSavedList(artistId, artistData)
  };
}

// Initialize the page to retrive the local storage data for the saved searches
init()
