(function() {
    angular.module('fairyTree.directives').directive('scrollIndicator',
        function($document) {
            return {
                template: '<div class="scroll-indicator bounce"></div>',
                link: function($scope, element, attrs) {
                    if (attrs.target) {
                        element.on('click', function(e) {
                            $('body').animate({scrollTop: $(attrs.target).offset().top}, 'slow');
                        });
                    }
                }
            }
        }
    )
}());
