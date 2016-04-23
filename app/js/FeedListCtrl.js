angular.module('expressSeed')
    .controller('FeedListCtrl', ['$scope', 'FeedSvc', '$sce', '$rootScope',
        function($scope, FeedSvc, $sce, $rootScope) {

            var self = this;

            FeedSvc.loadFeeds();

            self.feedList = FeedSvc.feedList;

            self.toHtmlVal = function(htmlval) {
                return $sce.trustAsHtml(htmlval);
            };

            self.search = function() {
                FeedSvc.searchByTag($scope.searchVal, function(err, data) {
                    self.feedList = data;
                });
            };


        }
    ]);
