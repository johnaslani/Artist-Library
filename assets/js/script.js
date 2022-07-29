var searchTerm = document.querySelector("#search-input");
var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
var formatEl = document.querySelector('#format-input');

var API_KEY = "ZTE3MmM4YTItMzY0Ni00OGM1LWE2NDUtMDc2ZDgyNGUwMGQz"

function searchNapsterArtist(artistSearchInput) {
    
    var artistSearchUrl = (
        'https://api.napster.com/v2.2/search?query='
        + artistSearchInput.split(' ').join('%20')
        + '&type=artist&per_type_limit=1&apikey='
        + API_KEY
    );
    // var locQueryUrl = 'https://api.napster.com/v2.0/playlists?apikey=ZTk2YjY4MjMtMDAzYy00MTg4LWE2MjYtZDIzNjJmMmM0YTdm';
  
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
        var artistName = artistData.name;
        var artistId = artistData.id;

        // Album IDs
        var topAlbums = artistData.albumGroups.main.slice(0, 5);

        console.log("name: ", artistName);
        console.log("id: ", artistId);

      })
      .catch(function (error) {
        console.error(error);
      });
  }
  
// function handleSearchFormSubmit(event) {
//     event.preventDefault();

//     searchApi();
// }


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
        console.log("Calling napster function.")
    }

    
  }

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
  
  