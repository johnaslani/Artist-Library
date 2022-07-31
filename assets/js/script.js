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

// =============================================================================
// Napster API Fetch Calls

// Generate the DOM elements for an artist card
function generateArtistCard(artistContents) {
  var card = $("<div>")

  return card
}

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
function searchNapsterArtist(artistSearchInput) {
    
  var artistSearchUrl = (
    'https://api.napster.com/v2.2/search?query='
    + artistSearchInput.split(' ').join('%20')
    + '&type=artist&per_type_limit=3&apikey='
    + NAPSTER_API_KEY
  );

  fetch(artistSearchUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (responseData) {
      // console.log(responseData);

      var data = responseData.search.data;
      // var artistData = data.artists[0];

      var loopCounter = 0
      for (var artistData of data.artists) {
        loopCounter += 1
        console.log("On loop: ", loopCounter);
        console.log("Artist Data: ", artistData);

        // The artist ID will be used for Element IDs such that
        // asynchronous calls can reference the appropriate element
        var artistId = artistData.id.replace(".", "-");

        // var domCardContents = generateArtistCard(artistContents)
        var card = $("<div>");
        card.addClass("card");

        // Generate the header
        var header = $("<header>");
        header.addClass("card-header");
        var headerTitle = $("<p>");
        headerTitle.addClass("card-header-title");
        headerTitle.text(artistData.name);
        header.append(headerTitle);
        card.append(header);

        // Generate the Image content (with a placeholder for the image)
        var artistImageDivEl = $("<div>");
        artistImageDivEl.addClass("card");
        var imageDivEl = $("<div>");
        imageDivEl.addClass("card-image");
        var figureEl = $("<figure>");
        figureEl.addClass("image");
        var imageEl = $("<img>");
        imageEl.attr("id", artistId + "-img");
        imageEl.attr("alt", "Cover Image for " + artistData.name)
        figureEl.append(imageEl)
        imageDivEl.append(figureEl)
        artistImageDivEl.append(imageDivEl)
        card.append(artistImageDivEl)

        // Card content
        var cardContent = $("<div>");
        cardContent.addClass("card-content");
        var content = $("<div>");
        content.addClass("content");
        var bioText = "(No artist bio available.)";
        if (artistData.blurbs.length >= 1) {
          bioText = artistData.blurbs[0];
        }
        content.text(bioText);
        cardContent.append(content);
        card.append(cardContent);

        // Footer
        var footerEl = $("<footer>");
        footerEl.addClass("card-footer");
        var saveEl = $("<a>");
        saveEl.addClass("card-footer-item").text("Save")
        saveEl.attr("#")
        footerEl.append(saveEl)
      
        // Albums


        // Wiki page
        var moreInfoEl = $("<a>");
        moreInfoEl.addClass("card-footer-item").text("Wiki")
        moreInfoEl.attr("href", "#")
        moreInfoEl.attr("id", artistId + "-wiki");
        footerEl.append(moreInfoEl)
        card.append(footerEl)

        searchResultsEl.append(card)

        // Make another featch to capture the Image link
        var artistImageSearchUrl = (
          artistData.links.images.href
          + '?apikey='
          + NAPSTER_API_KEY
        );
        setArtistImageUrl(artistId, artistImageSearchUrl)

        // Make another fetch call to set the Wiki URL
        setArtistWikiUrl(artistId, artistData.name)

      };
    })
    .catch(function (error) {
      console.error(error);
    });
}


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

      // var data = responseData.search.data;
      // var artistData = data.artists[0];
      // var artistName = artistData.name;
      // var artistId = artistData.id;

      // // Album IDs
      // var topAlbums = artistData.albumGroups.main.slice(0, 5);

      // console.log("name: ", artistName);
      // console.log("id: ", artistId);

    })
    .catch(function (error) {
      console.error(error);
    });
  }

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
   
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'a535281b61mshce35bc85549ab99p1420dcjsn610a2113d2c1',
		'X-RapidAPI-Host': 'wiki-briefs.p.rapidapi.com'
	}
};

  var newSearchInput =  searchInputVal.split(' ').join("%20");

  fetch(`https://wiki-briefs.p.rapidapi.com/search?q=${newSearchInput}`, options
  )
    .then((response) => response.json())
    .then((response) => {
        console.log(response);
        
        // Loop over the blurb to join the strings into one response
        var wiki = "";
        for (var i = 0; i < response.summary.length; i++) {
                wiki += response.summary[i] + ' ';
        }
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
      searchNapsterArtist(searchInputVal);
      console.log("Calling Napster API for artist search: ", formatInputVal)
  }
  if (formatInputVal === "album") {
      searchNapsterAlbum(searchInputVal);
      console.log("Calling Napster API for album search: ", formatInputVal)
  }
  if (formatInputVal === "track") {
      searchNapsterTrack(searchInputVal);
      console.log("Calling Napster API for track search: ", formatInputVal)
  }

}
  

searchFormEl.addEventListener('submit', handleSearchFormSubmit);

// TODO: Add another search input field after the Napster call is returned
//    ... or maybe add another search box on the napster return?
