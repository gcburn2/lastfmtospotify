(function() {

  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  var params = getHashParams();

  var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      // render oauth info
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });

      $.ajax({
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            userProfilePlaceholder.innerHTML = userProfileTemplate(response);

            $('#login').hide();
            $('#loggedin').show();
          }
      });
    } else {
        // render initial screen
        $('#login').show();
        $('#loggedin').hide();
    }

    document.getElementById('obtain-new-token').addEventListener('click', function() {
      $.ajax({
        url: '/refresh_token',
        data: {
          'refresh_token': refresh_token
        }
      }).done(function(data) {
        access_token = data.access_token;
      });
    }, false);

    document.getElementById('get-loved-tracks').addEventListener('click', function() {
      $.ajax({
          url: 'http://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&user=khardman51&api_key=ddf133674ebcf8752b9cf7919884feb1&limit=5&format=json',
          success: function(response) {
              res = response.lovedtracks.track;
              res.forEach(function(entry) {
                  console.log(entry.name.toString());
                  $("#lastfm").append("<li>" + entry.name.toString() + "</li>");
              });
              var s = $('#name').serialize()
              console.log(s);
            response2 = JSON.stringify(response);
            console.log(response2)
              // $("#lastfm").append(response2);
          }
      });
    }, false);
  }
})();
