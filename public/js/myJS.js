(function ($) {
var map
var infowindow
var icon

  window.init = function () {
    console.log('init')
  }

  window.withLocation = function (cb) {
    if (!navigator.geolocation)
      throw new Error('Geolocation not available')

    navigator.geolocation.getCurrentPosition(cb)
  }
  window.gInitMap = function(el, options) {
    
    options = Object.assign({
        zoom: 15
    }, options)

    map = new google.maps.Map(el, options)
    infowindow = new google.maps.InfoWindow()
    icon = {
        url: "http://www.myiconfinder.com/uploads/iconsets/256-256-a5485b563efc4511e0cd8bd04ad0fe9e.png",
        scaledSize: new google.maps.Size(25, 25),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(0, 0)
    };
  }
  window.gSearchPlaces = function (cb, options) {
    if (!cb)
      return

    options = Object.assign({
      location: null,
      radius: 500,
      types: '',
      name: ''
    }, options)

    var service = new google.maps.places.PlacesService(map)
    service.nearbySearch(options, cb)
  }

  window.createMarker = function(place) {
    var placeLoc = place.geometry.location
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: icon
    })

    google.maps.event.addListener(marker, 'click', function () {
    //   infowindow.setContent(place.name)
        console.log(place)
      var contents = '<h3>'+place.name+'</h3>'
                        + '<p>' + place.vicinity + '</p>'
                        + '<p>'
                        + (place.photos || []).map(function(photo) {
                            var url = photo.getUrl({ maxWidth: 100, maxHeight: 100 })
                            return '<a href="' + url + '"><img style="height: 100px" src="' + url + '" /></a>'
                        }).join('')
                        + '</p>'
      infowindow.setContent(
          contents
          + '<p><button onclick="poke(\'' + btoa(unescape(encodeURIComponent((contents)))) + '\')">Lets poke him!</button><p>'
      );
      infowindow.open(map, this)
    })
  }

  window.poke = function(contents) {
    $.ajax({
        url: '/map/th/poke',
        type: 'POST',
        data: {
            contents: contents
        },
        success: function(response) {
            alert('Email sent !')
        },
        error: function(error) {
            console.log(error)
        }
    })
  }

  window.mapIndexInit = function () {

    withLocation(function (location) {
      gInitMap(document.getElementById('map'), { 
          center: { 
              lat: location.coords.latitude, 
              lng: location.coords.longitude
            }
      })
      gSearchPlaces(function (result) {
          if(!result || !result.length) {
              return;
          }
          result.forEach(function(place) {
              createMarker(place)
          }, this);
      }, {
        location: {lat: location.coords.latitude, lng: location.coords.longitude}
      })
    })
  }
})(window.jQuery)
