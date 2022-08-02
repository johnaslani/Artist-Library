$(document).ready(function () {
  // TODO: Move all contents to jquery
  //  - DOM selection (query selector)
  //  - listening events
  //  - element creation

  // Globals
  const NAPSTER_API_KEY = "ZTE3MmM4YTItMzY0Ni00OGM1LWE2NDUtMDc2ZDgyNGUwMGQz";

  const WIKI_ENDPOINT_OPTIONS = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "a535281b61mshce35bc85549ab99p1420dcjsn610a2113d2c1",
      "X-RapidAPI-Host": "wiki-briefs.p.rapidapi.com",
    },
  };

  // =============================================================================
  // DOM Objects
  // TODO: Convert these DOM objects to jquery: //// Done
  // var searchTerm = document.querySelector("#search-input");
  var searchTerm = $("#search-input");
  var resultTextEl = $("#result-text");
  // var resultContentEl = document.querySelector('#result-content');
  var searchFormEl = $("#search-form");
  // var formatEl = document.querySelector('#format-input');
  var searchResultsEl = $("#search-results");
  var savedArtistsEl = $("#saved-artists");

  // =============================================================================
  // Use the Wiki briefs API to get the Wiki link to the artist.
  // Modify the artist card footer Wiki tag to use the href from the Wiki API.
  function setArtistWikiUrl(artistId, searchInputVal) {
    // Replace any empty string characters prior to making the API call
    searchInputVal = searchInputVal.split(" ").join("%20");
    var wikiSearchUrl = `https://wiki-briefs.p.rapidapi.com/search?q=${searchInputVal}`;

    fetch(wikiSearchUrl, WIKI_ENDPOINT_OPTIONS)
      .then((response) => response.json())
      .then((response) => {
        console.log("Wiki artist search: ", response);

        // The artist card footer has an ID of `#<artist.id>-wiki`.
        // Grab that element and assign the `href` with the URL from the Wiki
        var artistWikiEl = $("#" + artistId + "-wiki");
        artistWikiEl.attr("href", response.url);
      })
      .catch((err) => console.error(err));
  }

  // =============================================================================
  // Napster API Fetch Calls

  // Based on an event, remove the artist from the "Saved Artists" HTML
  //  container, as well as from local storage.
  function removeArtistFromSearchHistory(event) {
    // The `event` must have been passed with data used to
    // retrieve the appropriate element based on ID.
    var elementToRemove = $("#" + event.data.cardId);

    // Remove the element from the DOM
    elementToRemove.remove();

    // Remove the artist from local storage. Again, we need data passed in
    // with the event.
    localStorage.removeItem(event.data.artistId);
  }

  // TODO: investigate using the stored data to make a new card instead
  //  of calling the Napster API again. (see function below)

  // Populate the artist search results container by making another call to
  //  the Napster API. Only return the first search result.
  // Ideally we wouldn't be making another API search call, but to avoid
  //  duplicating large amounts of code, we'll make another search call
  //  using the values stashed in local storage.
  function showArtistSearch(event) {
    searchNapsterArtist(event.data.name, 1);
  }

  // Based on the provided artist information, save the contents to
  //  local storage if the artist ID is not already stored.
  function saveArtistToLocalStorage(artistId, artistData) {
    // Save to local storage if the artist ID hasn't already been saved
    var savedArtists = Object.keys(localStorage); // returns array of keys

    // Ensure the artist isn't already in storage.
    var artistIsAlreadySaved = savedArtists.includes(artistId); // returns bool
    if (!artistIsAlreadySaved) {
      localStorage.setItem(artistId, JSON.stringify(artistData));
    }
  }

  // Create a new Bulma Card that contains different footer information
  //  than the original artist Card that is being saved.
  function addArtistToSavedList(artistId, artistData) {
    // Make a new element/card for the saved artist data
    var card = $("<div>");
    card.addClass("card");
    var cardId = artistId + "-card-saved";
    card.attr("id", cardId);

    // Generate the header
    var header = $("<header>");
    header.addClass("card-header");
    var headerTitle = $("<p>");
    headerTitle.addClass("card-header-title");
    headerTitle.text(artistData.name);
    header.append(headerTitle);
    card.append(header);

    // Generate the Card Footer - buttons below the header (no content)
    var footerEl = $("<footer>");
    footerEl.addClass("card-footer");

    // Make a "remove" button to remove the artist from the search history
    var removeEl = $("<a>");
    removeEl.addClass("card-footer-item").text("Remove");
    removeEl.attr("#");
    // Add event listener to remove from saved searches
    removeEl.on(
      "click",
      { cardId: cardId, artistId: artistId },
      removeArtistFromSearchHistory
    );
    footerEl.append(removeEl);

    // Show results for this artist by creating a new card in the search results conatainer
    var showEl = $("<a>");
    showEl.addClass("card-footer-item").text("Show Artist");
    showEl.attr("#");
    showEl.on("click", { name: artistData.name }, showArtistSearch);

    footerEl.append(showEl);
    card.append(footerEl);

    // Append to the saved artist container
    savedArtistsEl.append(card);
  }

  // When the event listener on the artist "save" element is clicked,
  //  add the artist name to a field that can be refreshed from
  //  local storage.
  function saveArtistOnClick(event) {
    // Function requires for the event object to contain the artist data
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
    card.addClass(artistId + "-card");

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
    }
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
    var artistEventData = { artistId: artistId, artistData: artistData };
    saveEl.on("click", artistEventData, saveArtistOnClick);

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
  }

  // Make another fetch to capture the Image link and assign it to the
  // appropriate HTML element for the associated artist
  function setArtistImageUrl(artistId, artistImageSearchUrl) {
    fetch(artistImageSearchUrl)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
        return response.json();
      })
      .then(function (responseData) {
        // Make a new Element ID that has form `#<artist.id>-img`
        var imageEl = $("#" + artistId + "-img");
        if (responseData.images.length > 0) {
          imageEl.attr("src", responseData.images[0].url);
        } else {
          // Not all artists have available image data from Napster
          imageEl.attr("alt", "(No image available)");
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  // Use the Artist Search endpoint from Napster to search for the provided
  //  artist name.
  // The `numberOfResponse` argument can be used to limit the number
  //  of artistst returned from the endpoint.
  // More data on the Napster API can be found here:
  //  - https://developer.prod.napster.com/api/v2.2#artists
  //  - https://developer.prod.napster.com/api/v2.2#Artist-object
  function searchNapsterArtist(artistSearchInput, numberOfResponses) {
    // First, clear out any existing contents for the container
    searchResultsEl.empty();

    var artistSearchUrl =
      "https://api.napster.com/v2.2/search?query=" +
      artistSearchInput.split(" ").join("%20") +
      "&type=artist" +
      "&per_type_limit=" +
      structuredClone(numberOfResponses) +
      "&apikey=" +
      NAPSTER_API_KEY;

    fetch(artistSearchUrl)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
        return response.json();
      })
      .then(function (responseData) {
        var data = responseData.search.data;

        // Generate new cards for each artist in the response.
        // To limit the number of artists, provide a different value for
        //  the `numberOfResponses` argument to this function.
        var loopCounter = 0;
        for (var artistData of data.artists) {
          // Add a counter for debugging purposes.
          // TODO: delete this prior to submitting the assignment
          loopCounter += 1;
          console.log("On loop: ", loopCounter);
          console.log("Artist Data: ", artistData);

          // The artist ID will be used for Element IDs such that
          // the appropriate element can be populated asynchronously
          var artistId = artistData.id.replace(".", "-");

          // Generate the DOM contents for the card for the current artist response
          var artistCardEl = generateArtistCard(artistId, artistData);
          searchResultsEl.append(artistCardEl);

          // Make another Napster API fetch to populate the Image link
          var artistImageSearchUrl =
            artistData.links.images.href + "?apikey=" + NAPSTER_API_KEY;
          setArtistImageUrl(artistId, artistImageSearchUrl);

          // Make a Wiki API fetch to set the Wiki URL in the card footer
          setArtistWikiUrl(artistId, artistData.name);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  // Currently not used/working!
  // Album Search
  function searchNapsterAlbum(albumSearchInput) {
    var albumSearchUrl =
      "https://api.napster.com/v2.2/search?query=" +
      albumSearchInput.split(" ").join("%20") +
      "&type=album&per_type_limit=1&apikey=" +
      NAPSTER_API_KEY;

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
    var trackSearchUrl =
      "https://api.napster.com/v2.2/search?query=" +
      trackSearchInput.split(" ").join("%20") +
      "&type=track&per_type_limit=1&apikey=" +
      NAPSTER_API_KEY;

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
  // Capture user search input and make appropriate API calls
  function handleSearchFormSubmit(event) {
    event.preventDefault();

    var searchInputVal = searchTerm.val();
    console.log(searchInputVal);
    // var formatInputVal = formatEl.value;
    // console.log(formatInputVal);

    if (!searchInputVal) {
      console.error("You need a search input value!");
      return;
    }
    searchNapsterArtist(searchInputVal, 3);

    // // Currently not used/working!
    // else if (formatInputVal === "album") {
    //     searchNapsterAlbum(searchInputVal);
    //     console.log("Calling Napster API for album search: ", formatInputVal)
    // }
    // // Currently not used/working!
    // else if (formatInputVal === "track") {
    //     searchNapsterTrack(searchInputVal);
    //     console.log("Calling Napster API for track search: ", formatInputVal)
    // }
  }

  // Initialize the page using artist information from local storage.
  function init() {
    console.log("Local storage getting called.");

    // Used local storage to pre-populate the saved fields
    // The keys are saved as the "artist-id", which is not known at runtime,
    // so loop over all local storage keys and retrieve the associated value.
    var localKeys = Object.keys(localStorage);

    for (var artistId of localKeys) {
      var artistData = JSON.parse(localStorage.getItem(artistId));
      addArtistToSavedList(artistId, artistData);
    }
  }

  // Event listener for the artist search form that initializes the search
  searchFormEl.on("submit", function (event) {
    handleSearchFormSubmit(event);
  });

  // Initialize the page to retrieve the local storage data for the saved searches
  init();
});
