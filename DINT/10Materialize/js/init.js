(function($){
  $(function(){

    $('.sidenav').sidenav();

  });
  $('.carousel.carousel-slider').carousel({fullWidth: true});
autoplay();
function autoplay() {
    $('.carousel').carousel('next');
    setTimeout(autoplay, 4500);
} 
  $(".dropdown-trigger").dropdown();// end of document ready
})(jQuery); // end of jQuery name space
