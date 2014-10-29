(function() {
    angular.module('fairyTree.directives').directive('scrollTo',
        function($document) {
            return {
                link: function($scope, element, attrs) {
                    element.on('click', function(e) {
                        $('body').animate({scrollTop: $(attrs.scrollTo).offset().top}, 'slow');
                    });
                }
            }
        }
    )
}());
