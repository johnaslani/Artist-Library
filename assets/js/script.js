// Globals
var NAPSTER_API_KEY = "ZTE3MmM4YTItMzY0Ni00OGM1LWE2NDUtMDc2ZDgyNGUwMGQz"


// =============================================================================
// DOM Objects
var searchTerm = document.querySelector("#search-input");
var resultTextEl = document.querySelector('#result-text');
// var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
var formatEl = document.querySelector('#format-input');
var searchResultsEl = document.querySelector('#search-results');

// =============================================================================
// Napster API Fetch Calls

// Generate the DOM elements for an artist card
function generateArtistCard(artistContents) {
  var card = $("<div>")
  card.addClass("card")

  // Generate the header
  var header = $("<header>")
  header.addClass("card-header")
  var headerTitle = $("<p>")
  headerTitle.addClass("card-header-title")
  headerTitle.text(artistContents.name)
  header.append(headerTitle)
  card.append(header)

  // Card content
  var cardContent = $("<div>")
  cardContent.addClass("card-content")
  var content = $("<div>")
  content.addClass("content")
  content.text(artistContents.bio)
  cardContent.append(content)
  card.append(cardContent)

  console.log(card);

  return card
}

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
      console.log(responseData);

      var data = responseData.search.data;
      var artistData = data.artists[0];

      // Album IDs
      // var topAlbums = artistData.albumGroups.main.slice(0, 5);
      
      var artistContents = {
        name: artistData.name,
        bio: artistData.bios[0].bio,
        id: artistData.id,
        imagesRef: artistData.links.images.href,
      };

      // var domCardContents = generateArtistCard(artistContents)
      var card = $("<div>");
      card.addClass("card");

      // Generate the header
      var header = $("<header>");
      header.addClass("card-header");
      var headerTitle = $("<p>");
      headerTitle.addClass("card-header-title");
      headerTitle.text(artistContents.name);
      header.append(headerTitle);
      card.append(header);

      // Card content
      var cardContent = $("<div>");
      cardContent.addClass("card-content");
      var content = $("<div>");
      content.addClass("content");
      content.text(artistContents.bio);
      cardContent.append(content);
      card.append(cardContent);

      // Footer
      var footerEl = $("<footer>");
      footerEl.addClass("card-footer");
      var saveEl = $("<a>");
      saveEl.addClass("card-footer-item").text("Save")
      saveEl.attr("#")
      footerEl.append(saveEl)
      
      var moreInfoEl = $("<a>");
      moreInfoEl.addClass("card-footer-item").text("More Info")
      moreInfoEl.attr("#")
      footerEl.append(moreInfoEl)
      card.append(footerEl)

      card.appendTo(searchResultsEl);
      // searchResultsEl.append(card)

    })
    .catch(function (error) {
      console.error(error);
    });
}

  // Image Search
function searchArtistImages(albumSearchInput) {
    
  var albumSearchUrl = (
    "https://api.napster.com/v2.2/artists/art.15352652/images"
    + '?apikey='
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
        resultTextEl.append(textEl);
     
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
