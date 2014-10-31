(function() {
    angular.module('fairyTree.directives').directive('scrollTo',
        function($document) {
            return {
                priority: 100, /* XXX: this is a hack */
                link: function($scope, element, attrs) {
                    element.on('click', function(e) {
                        $('html,body').animate({scrollTop: $(attrs.scrollTo).offset().top}, 'slow');
                    });
                }
            }
        }
    )
}());
