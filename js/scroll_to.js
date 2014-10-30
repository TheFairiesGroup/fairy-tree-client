(function() {
    angular.module('fairyTree.directives').directive('scrollTo',
        function($document) {
            return {
                priority: 1000, /* XXX: this is a hack */
                link: function($scope, element, attrs) {
                    element.on('click', function(e) {
                        $('body').animate({scrollTop: $(attrs.scrollTo).offset().top}, 'slow');
                    });
                }
            }
        }
    )
}());
