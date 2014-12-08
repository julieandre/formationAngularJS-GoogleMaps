"use strict";

angular.module('app', [])

    .controller('Ctrl', function($scope) {
        $scope.maps = [
            { label : "Nantes", center: {lat: 47.211, lng: -1.566}, zoom: 12 },
            { label : "Mountain View", center: {lat: 37.423, lng: -122.086}, zoom: 9 }
        ];
    })

    .directive('gmaps', function () {
        return {
            restrict: 'EA',
            templateUrl: 'gmaps.html',
            replace: false,
            transclude: true,
            scope: {
                zoom : '=zoom',
                center : '=center'
            },
            link: function (scope, element, attrs) {

                var mapOptions = {
                    center: scope.center,
                    zoom: scope.zoom
                };

                var map = new google.maps.Map(element.find('div')[0], mapOptions);

                scope.$watch('center', function() {
                    map.setCenter(new google.maps.LatLng(+scope.center.lat, scope.center.lng));
                }, true);

                scope.$watch('zoom', function() {
                    map.setZoom(+scope.zoom);
                });


                google.maps.event.addListener(map, 'zoom_changed', function () {
                    scope.$applyAsync(function() {
                        scope.zoom = map.getZoom();
                    });
                });

                google.maps.event.addListener(map, 'center_changed', function () {

                    scope.$applyAsync(function() {
                        scope.center.lat = map.getCenter().lat();
                        scope.center.lng = map.getCenter().lng();
                    });
                });

                scope.snapshots = [];

                scope.addMarker = function() {
                    scope.waiting = true;
                    new google.maps.Marker({
                        position: new google.maps.LatLng(scope.center.lat, scope.center.lng),
                        map: map,
                        title: scope.markerLabel
                    });

                    scope.snapshots.push({
                        lat: scope.center.lat,
                        lng: scope.center.lng,
                        zoom: scope.zoom,
                        label: scope.markerLabel
                    });

                    scope.markerLabel = '';
                    //element.find('form')[0].after('');
                };

                scope.goTo = function(snapshot) {
                    scope.center.lat = snapshot.lat;
                    scope.center.lng = snapshot.lng;
                    scope.zoom = snapshot.zoom;
                };

            }
        };
    });
