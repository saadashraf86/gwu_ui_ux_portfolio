$(document).ready(function() {

  // Function to show the targeted section and hide all others
  function showSection(target) {
    // Hide the current section and the wrapper
    $('.active-section, #wrapper').fadeOut(0, function() {
      // Remove the active class from all sections
      $('.content-section').removeClass('active-section');

      // Now show the targeted section
      $(target).fadeIn(500).addClass('active-section');
    });
  }

  // Function to reset to the home view
  function showHome() {
    // Hide the current section
    $('.active-section').fadeOut(0, function() {
      // Remove the active class from all sections
      $('.content-section').removeClass('active-section');

      // Show the home section and the wrapper
      $('#home, #wrapper').fadeIn(500);
    });
  }

  // Click event for nav items
  $('.nav-item').click(function(e) {
    e.preventDefault();

    // Get the target section based on the 'data-target' attribute of the clicked item
    var target = '#' + $(this).attr('data-target');

    // Either show the targeted section or reset to the home view
    if (target === '#home') {
      showHome();
    } else {
      showSection(target);
    }
  });

  // Click event for the logo to reset to the home view
  $('#logo').click(function() {
    showHome();
  });

  // Initialize the site with only the home section visible
  showHome();

  // Optionally, handle the closing of a section if you have a close button
  // $('.close-button').click(function() {
  //   $(this).parent('.content-section').fadeOut(500, function() {
  //     // After the section is hidden, show the home section and wrapper
  //     showHome();
  //   });
  // });

});