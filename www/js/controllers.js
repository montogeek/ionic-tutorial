angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  },

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.fbLogin = function() {
    openFB.login(
        function(response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                $scope.closeLogin();
            } else {
                alert('Facebook login failed');
            }
        },
        {scope: 'email,publish_actions'});
  }
})

.controller('SessionsCtrl', function($scope, Session) {
  $scope.sessions = Session.query();
})

.controller('SessionCtrl', function($scope, $stateParams, Session) {
  $scope.session = Session.get({ sessionId: $stateParams.sessionId });
  $scope.share = function(event) {
    openFB.api({
        method: 'POST',
        path: '/me/feed',
        params: {
            message: "I'll be attending: '" + $scope.session.title + "' by " +
                $scope.session.speaker
        },
        success: function () {
            alert('The session was shared on Facebook');
        },
        error: function () {
            alert('An error occurred while sharing this session on Facebook');
        }
    });
};
})

.controller('ProfileCtrl', function($scope) {
  openFB.api({
      path: '/me',
      params: {fields: 'id,name'},
      success: function(user) {
          $scope.$apply(function() {
              $scope.user = user;
          });
      },
      error: function(error) {
          alert('Facebook error: ' + error.error_description);
      }
  });
})
