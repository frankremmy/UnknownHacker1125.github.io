var chosenGames = ["Minecraft", "Creative", "Counter-Strike: Global Offensive", "Dark Souls III", "League of Legends", "Call of Duty: Black Ops III"];
var chosenUsers = ["jamalizcool", "joshog", "summit1g", "stronglegss", "xbiocsgo", "iamtinyy", "mlg", "vinesauce", "esl_csgo", "swiftor"];

function addUserBox (name, init) {
   // bypassing the existance check when initializing the site 
   if (addUsersToLocalStorage(name) || init) {
      $("#search-user").popover("hide");
      getUser(name);
   } else {
      $("#search-user").popover("show");
   } 
}

function getUser (name) {
   $.getJSON("https://api.twitch.tv/kraken/channels/" + name + "?callback=?", function (result) {
      // when the account does not exist or the account is closed
      if (result.hasOwnProperty("error")) {
         var clonedOffline = $(".offline.template").clone();
         clonedOffline.attr("id", "offline-" + name).removeClass("template");
         $("#users").prepend(clonedOffline);
         $("#offline-" + name).html("User " + name + " doesn't exist on Twitch.");
      } 
      //when a user is offline
      else if (result.stream == null){
         var clonedOffline = $(".offline.template").clone();
         clonedOffline.attr("id", "offline-" + name).removeClass("template");
         $("#users").prepend(clonedOffline);
         $("#offline-" + name).html(name + " is offline");
      } 
      //when a user is streaming
      else {                       
         // hiding everybody offline hint in case a new user added when everybody is offline
         $("#everybody-offline").addClass("hidden");
         var clonedOnline = $(".online.template").clone();
         clonedOnline.attr("id", "online-" + name).removeClass("template");
         $("#users").prepend(clonedOnline);
         var id = "#online-" + name;
         $(id + " .link").attr("href", result.stream.channel.url);
         $(id + " .title").html(result.stream.channel.status);
         $(id + " .user").html("by " + result.stream.channel.display_name);
         $(id + " .image").attr("src", result.stream.preview.medium);
         $(id + " .image").attr("alt", result.stream.channel.display_name);
      }
   });
}

function addGamesToLocalStorage (name) {
   // Check browser support for local storage
   if (typeof(Storage) !== "undefined") {
      // check if game name was once chosen to the array, if indexOf equals -1 it does not exist in the array yet
      if (chosenGames.indexOf(name) == -1) {
         // Store chosen games by appending them to the chosenGames array
         chosenGames.push(name);
         // local storage requires converting strings to the format needed
         localStorage.setItem("gameName", JSON.stringify(chosenGames));
         return true;
      } else {
         return false;
      }
   }
   // whether local storage is supported by a browser or not the button should be possible to add
   return true;
}

function addGameButton (name, init) {
   // bypassing the existance check when initializing the site 
   if (addGamesToLocalStorage(name) || init) {
      var clonedGame = $(".game.template").clone();
      // setting html of selected item
      $(".game-item", clonedGame).html(name);
      clonedGame.removeClass("template");
      $("#game-list").append(clonedGame);
   }
}

function getStreams (game) {
   // cleaning results from previous streams list but leaving template
   $(".stream:not(.template):not(#off-stream)").remove();
   
   $.getJSON("https://api.twitch.tv/kraken/streams?game=" + encodeURI(game) + "&callback=?", function (result) {
      // when nobody plays the game right now
      if (result.streams.length == 0) {
         $(".game-off").html(game);
         $("#off-stream").removeClass("hidden");
      } else {
         $("#off-stream").addClass("hidden");
         for (var i=0; i<result.streams.length; i++) {
            var stream = result.streams[i];
            //when a user is streaming                   
            var clonedStream = $(".stream.template").clone();
            clonedStream.attr("id", "stream-" + stream._id).removeClass("template");
            $("#streams #stream-row").append(clonedStream);
            var id = "#stream-" + stream._id;
            $(id + " .stream-link").attr("href", stream.channel.url);
            $(id + " .stream-title").html(stream.channel.status);
            $(id + " .stream-image").attr("src", stream.preview.medium);
            $(id + " .stream-image").attr("alt", stream.channel.display_name);
            $(id + " .language").html("Language: " + stream.channel.language);
            var counter;
            if (stream.viewers == 1) {
               counter = " person is ";
            } else {
               counter = " people are ";
            }
            $(id + " .watching-now").html(stream.viewers + counter +"watching now");
         }
      }
      // scrolling to the stream section when game button clicked
      $('html, body').animate({
         scrollTop: $("#streams").offset().top
      }, 1000);
      // arrow to top
      gamesTop();
   });
}

function addTwitchPlayer () {
   var name = $("#search-user").val();
   addUserBox(name);
   // cleaning search
   $("#search-user").val("");
   arrowBack();
}

function addUsersToLocalStorage (name) {
   // check browser support
   if (typeof(Storage) !== "undefined") {
      // check if a user name was once chosen to the array, if indexOf equals -1 it does not exist in the array yet && prevent empty strings to be add a user box
      if (chosenUsers.indexOf(name) == -1 && name !== "") {
         // store chosen users by prepending them to the chosenUsers array
         chosenUsers.push(name);
         // local storage requires converting strings to the format needed
         localStorage.setItem("userName", JSON.stringify(chosenUsers));
         return true;
      } else {
         return false;
      }
   }
   // whether local storage is supported by a browser or not the user should be added
   return true;
}

function getFreeCodeCamp (name) {
   var name = "freecodecamp";
   $.getJSON("https://api.twitch.tv/kraken/channels/" + name + "?callback=?", function (result) {
      // when the account does not exist or the account is closed
      if (result.hasOwnProperty("error")) {
         fccFooter(false);
         $("#fcc-off").html("Write to Quincy and ask about FCC Twitch.");
      } 
      //when FCC is offline
      else if (result.stream == null){
         fccFooter(false);
      } 
      //when FCC is streaming
      else {
         fccFooter(true);
         var id = "#fcc-on";
         $(id + " .link").attr("href", result.stream.channel.url);
         $(id + " .title").html(result.stream.channel.status);
         $(id + " .image").attr("src", result.stream.preview.medium);
         $(id + " .image").attr("alt", result.stream.channel.display_name);
      }
   });
}

function fccFooter(live){
   if (live) {
      $("#fcc-off").addClass("hidden");
      $("#fcc-on").removeClass("hidden");
   } else {
      $("#fcc-off").removeClass("hidden");
      $("#fcc-on").addClass("hidden");
   }
}

function arrowBack () {
   if ($("body").height() - $("footer").height() > $(window).height()){
      $("#back-to-top").removeClass("hidden");
   } else {
      $("#back-to-top").addClass("hidden");
   }
}

function gamesTop () {
   if ($("body").height() - $("footer").height() > $(window).height()){
      $("#games-to-top").removeClass("hidden");
   } else {
      $("#games-to-top").addClass("hidden");
   }
}

$(document).ready(function () {
   // converting fata from JSON to an array & setting temporary variable for the case when local storage is empty
   var startGames = JSON.parse(localStorage.getItem("gameName"));
   if (startGames !== null) {
      chosenGames = startGames;
   }
   // adding the game buttons (if local storage empty ==> I add only two first games pre-chosen in the chosenGames array)
   for (var i = 0; i < chosenGames.length; i++) {
      // init == true because the page is loaded the first time
      addGameButton(chosenGames[i], true);
   }
   
   var startUsers = JSON.parse(localStorage.getItem("userName"));
   if (startUsers !== null) {
      chosenUsers = startUsers;
   }
   // adding the users (if local storage empty ==> I add only the few first users pre-chosen in the chosenUsers array)
   for (var i = 0; i < chosenUsers.length; i++) {
      // init == true because the page is loaded the first time
      addUserBox(chosenUsers[i], true);
   }
   
   // FCC in footer
   getFreeCodeCamp();
   
   // autocomplete with Bootstrap typehead from API response
   $("#search-game").typeahead({ 
      // start suggesting after the 3rd character provided by a user
      minLength: 3,
      // getting the list of suggestions for a query a user provides
      source: function(query, process) {
         $.getJSON("https://api.twitch.tv/kraken/search/streams?" + query + "&type=suggest&live=true", function (result){
            // preparing game names to feed typeahead
            var gameNames = [];
            for (var i=0; i<result.games.length; i++) {
               gameNames.push(result.games[i].name);
            }
            // up to this moment there are all names gathered
            return process(gameNames);
         });
      },
      afterSelect: function(selectedItem) {
         addGameButton(selectedItem);
         // cleaning search
         $("#search-game").val("");
      }	
   });
   // listening for the future game-items clicks
   $(document).on("click", ".game-item", function (e) {
      getStreams($(this).html());
      // preventing redirection of a tag
      e.preventDefault();
   });
   // listening for the new Twitch user accounts added to the players list
   $("#add-button").on("click", function () {
      addTwitchPlayer();
   });
   // listening for enter pressed on input
   $("#search-user").on("keypress", function (e) {
      if (e.which == 13) {
         addTwitchPlayer();
      } else {
         // popover hint for doubled players
         $("#search-user").popover("hide");
      }
   });
   // arrow back for players section with timeout
   $("#player-tab").on("click", function () {
      setTimeout(function () {
         arrowBack();
      },1000);
   });
   // toggle all & online in players
   $("#toggle").on("change", function(){
      if ($(this).prop("checked")) {
         $(".offline:not(.template):not(.card-fcc)").show();
         $("#everybody-offline").addClass("hidden");
      } else {
         $(".offline:not(.card-fcc)").hide();
         // setting everybody-offline hint
         if ($(".online:not(.card-fcc):visible").length == 0){
            $("#everybody-offline").removeClass("hidden");
         } else {
            $("#everybody-offline").addClass("hidden");
         }
      }
      arrowBack();
   });
   
});