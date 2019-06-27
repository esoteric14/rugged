(function($) {
    $(document).ready(function() {
        

       
        
       
        //Update Login Header
        updateLoginHeader();
    });
    
     

$(window).load(function() {
    // Initallize flexslider
    flexInit();
    // Fancybox init
    fancyboxInit();
    
    //update date field
        updateDate();
         // creeate twitter feeds
        createTwitter();
        
         //update category products
        updateCategoryProductsPosition();
        //Update unlock sign if user logged Initallize
        updateUnlockSign();
        //Update download links
        updateDownloadLinks();
// Hide address bar on IOs
        hideBar();

        // Apply background images from data attributes
        backgoundInit();

        // Portfolio hovers
        portfolioHovers();

        // Portfolio filters
        portfolioFilters();

        // Icon hovers
        iconHovers(); 

        // setup contact form
        setupContactForm();
    // selector for ie rounded images fallback
    if (window.PIE) {
        $('.img-circle , .flex-control-nav a , .well-package-heading , span.tag').each(function() {
            PIE.attach(this);
        });

        $('.img-circle').on('mouseenter',function(){
            $(this).prev().addClass('opaque');
        });
        $('.img-circle').on('mouseleave',function(){
           if (!$(this).closest('li').hasClass('inactive'))
                $(this).prev().removeClass('opaque');
        });
        //extra case for squeared portfolio.
        $('.post-media img , .no-rounded a').on('mouseenter',function(){
            $(this).addClass('opaque');
        });
        $('.post-media img').on('mouseleave',function(){
            $(this).removeClass('opaque');
        });
        // extra case for squared portfolio.
        $('.no-rounded a').on('mouseleave',function(){
            if (!$(this).closest('li').hasClass('inactive'))
                $(this).removeClass('opaque');
        });

        // timeline ie8 selectors fix
        $('#timeline .timeline-item:nth-child(even)').addClass('pull-right');
        $('#timeline .timeline-item:nth-child(even) .post').css({'margin-left': '80px' ,'margin-right': '0'});
        $('#timeline .timeline-item:nth-child(even) .post-info').css({'left': 'auto' ,'right': '100%'});
        $('#timeline .timeline-item:nth-child(even) .post-arrow').css({'left': 'auto' ,'right': '100%','background-image':'url("images/timeline-arrow-left.png")'});
        $('.thumbnails > .span2:nth-child(2n+1), .thumbnails > .span3:nth-child(4n+1), .thumbnails > .span4:nth-child(3n+1)').css({'margin-left':'0','clear':'both'});
        
      
      
    }
});
 
 function updateLoginHeader(){
   if (globalUserId) {
     var html = "<ul class='header-login-links inline-block list-style-none f-right'>" + 
                  "<li>" + 
                      "<div>Welcome " + sessionStorage.getItem("displayname")  + ", </div>" + 
                  "</li>" + 
                  "<li >" + 
                      "<a href='#' onclick='LogoutUser()' style='color:red;'>(Logout)</a>" + 
                  "</li>" + 
                "</ul>";
     
      document.getElementById("user_welcome").innerHTML = html;
    }else{
       document.getElementById("loginurl").setAttribute("href", 
        document.getElementById("loginurl").getAttribute("href") + "?redirect="+encodeURIComponent(window.location.pathname));
    }
 }

function updateDownloadLinks(){
   basePath = $("#ruggedmonitoring_logo").attr("src").substr(0, $("#ruggedmonitoring_logo").attr("src").indexOf("/images"));
    var downloadLinks = $('.download-link-class');
    for(var i =0;i<downloadLinks.length;i++){
      downloadLinks[i].setAttribute("href", basePath + downloadLinks[i].getAttribute("href"))
    }
} 
function updateDate(){
  //format date throughout the page
 //uses moment.js
 $('[data-date]').each(function(){
   $(this).html(moment($(this).attr('data-date')).format('MMM DD, YYYY'));
 })
 // format ddMMMYY
   $('[data-date-ddmmmyy]').each(function(){
   $(this).html(moment($(this).attr('data-date-ddmmmyy')).format('Do MMM YYYY'));
 })
}

function flexInit() {
    // document.getElementById("basic-banner").setAttribute("style", "display:none");
    //   document.getElementById("flexslider-row").setAttribute("style", "");
    $('.flexslider[id]').each(function() {
     
        // We use data atributes on the flexslider items to control the behaviour of the slideshow
        var slider = $(this),

            //data-slideshow: defines if the slider will start automatically (true) or not
            sliderShow = slider.attr('data-flex-slideshow') == "false" ? false : true,

            //data-flex-animation: defines the animation type, slide (default) or fade
            sliderAnimation = !slider.attr('data-flex-animation') ? "slide" : slider.attr('data-flex-animation'),

            //data-flex-speed: defines the animation speed, 7000 (default) or any number
            sliderSpeed = !slider.attr('data-flex-speed') ? 7000 : slider.attr('data-flex-speed'),

            //data-flex-directions: defines the visibillity of the nanigation arrows, hide (default) or show
            sliderDirections = slider.attr('data-flex-directions') == "hide" ? false : true,

            //data-flex-directions-type: defines the type of the direction arrows, fancy (with bg) or simple
            sliderDirectionsType = slider.attr('data-flex-directions-type') == "fancy" ? "flex-directions-fancy" : "",

            //data-flex-directions-position: defines the positioning of the direction arrows, default (inside the slider) or outside the slider
            sliderDirectionsPosition = slider.attr('data-flex-directions-position') == "outside" ? "flex-directions-outside" : "",

            //data-flex-controls: defines the visibillity of the nanigation controls, hide (default) or show
            sliderControls = slider.attr('data-flex-controls') == "hide" ? false : true,

            //data-flex-controlsposition: defines the positioning of the controls, inside (default) absolute positioning on the slideshow, or outside
            sliderControlsPosition = slider.attr('data-flex-controlsposition') == "inside" ? "flex-controls-inside" : "flex-controls-outside",

            //data-flex-controlsalign: defines the alignment of the controls, center (default) left or right
            sliderControlsAlign = !slider.attr('data-flex-controlsalign') ? "flex-controls-center" : 'flex-controls-' + slider.attr('data-flex-controlsalign'),

            //data-flex-itemwidth: the width of each item in case of a multiitem carousel, 0 (default for 100%) or a nymber representing pixels
            sliderItemWidth = !slider.attr('data-flex-itemwidth') ? 0 : parseInt(slider.attr('data-flex-itemwidth')),

            //data-flex-itemmax: the max number of items in a carousel
            sliderItemMax = !slider.attr('data-flex-itemmax') ? 0 : parseInt(slider.attr('data-flex-itemmax')),

            //data-flex-itemmin: the max number of items in a carousel
            sliderItemMin = !slider.attr('data-flex-itemmin') ? 0 : parseInt(slider.attr('data-flex-itemmin'));

        //assign the positioning classes to the navigation
        slider.addClass(sliderControlsPosition).addClass(sliderControlsAlign).addClass(sliderDirectionsType).addClass(sliderDirectionsPosition);

        slider.flexslider({
            slideshow: sliderShow,
            animation: sliderAnimation,
            slideshowSpeed: sliderSpeed,
            itemWidth: sliderItemWidth,
            minItems: sliderItemMin,
            maxItems: sliderItemMax,
            controlNav: sliderControls,
            directionNav: sliderDirections,
            
            prevText: "",
            nextText: "",
            smoothHeight: true,
            useCSS : false
        });

    });
    
}

// function to init the lightbox
function fancyboxInit() {
    $('.fancybox').fancybox({
        padding: 1,
        helpers : {
            title : {
                type : 'over'
            }
        }
    });
    $('.fancybox-media').fancybox({
        padding: 1,
        openEffect  : 'none',
        closeEffect : 'none',
        helpers : {
            media : {}
        }
    });
}

// funcrion to hide the address bar on mobile devices
function hideBar() {
    if( ( navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i) ) ) {
        if(window.addEventListener){
            window.addEventListener("load",function() {
                // Set a timeout...
                setTimeout(function(){
                    // Hide the address bar!
                    window.scrollTo(0, 1);
                }, 0);
            });
        }
    }
}

// Function to set data background images
function backgoundInit() {
    $('[data-background]').each(function() {
        var element = $(this);

        element.css('background', element.attr('data-background'));

        if ( element.attr('data-background-size') == "full" ) {
            element.css('background-size', '100%');
            element.css('background-attachment', 'fixed');
        };

    } );
    // special case for ie8 full width background page. We create a fixed position image.
    if(window.PIE){
        $('body[data-background-size]').prepend('<div class="iefullbg"></div>');
    }
}

// Function to handle the popovers in portfolio
function portfolioHovers() {
    $('.portfolio figure').find('a').on('mouseenter', function(){
        $(this).find('.plus-icon').animate({
            top: '50%'
            }, 300
        );
    });
    $('.portfolio figure').find('a').on('mouseleave', function(){
        $(this).find('.plus-icon').animate({
            top: '120%'
            }, 300, function() {
                $(this).css('top', '-100px');
            }
        );
    });
}

// Function to change Social icon colors on hover
function iconHovers(){
    $('[data-iconcolor]').each(function(){
        var element         = $(this);
        var original_color  =$(element).css('color');
        element.on('mouseenter', function(){
            element.css('color' , element.attr('data-iconcolor'));
        });
        element.on('mouseleave', function(){
            element.css('color' ,original_color);
        })

    });
}

// Function to handle the portfolio filters
function portfolioFilters() {
    var filters = $('.portfolio-filters');

    filters.on('click', 'a', function(e) {
        var active = $(this),
            portfolio = filters.next().find('.portfolio');
            activeClass = active.data('filter');


        filters.find('a').removeClass('active');
        active.addClass('active');

        if ( activeClass == 'all') {
            portfolio.find('li').removeClass('inactive');
        } else {
            portfolio.find('li').removeClass('inactive').not('.filter-' + activeClass ).addClass('inactive');
        }

        // manage PIE filters in case of ie8
        if (window.PIE) {
            // remove opacity from all PIE images
            $('ul.portfolio li a.box-inner').each(function(index,val){
            $(this).children().first().removeClass('opaque'); });
            // add opacity to the inactive ones
            $('ul.portfolio li.inactive a.box-inner').each(function(index,val){
            $(this).children().first().addClass('opaque'); });

            // for the squeared portfolio.
            $('ul.portfolio li .no-rounded a').each(function(index,val){
            $(this).removeClass('opaque'); });
            // add opacity to the inactive ones
            $('ul.portfolio li.inactive .no-rounded a').each(function(index,val){
            $(this).addClass('opaque'); });
        }
        e.preventDefault();
    });
}

function setupContactForm() {
    // bind submit handler to form
    $('#contactForm').on('submit', function(e) {
        // prevent native submit
        e.preventDefault();
        // clear all inputs tooltips
        $( ':input' ).tooltip( 'destroy' );
        // clear all errors
        $( '.control-group' ).removeClass( 'error' );

        // submit the form
        $(this).ajaxSubmit({
            url: 'contact_me.php',
            type: 'post',
            dataType: 'json',
            beforeSubmit: function() {
                // disable submit button
                $( ':input[name="submitButton"]' ).attr( 'disabled','disabled' );
            },
            success: function( response, status, xhr, form ) {
                if( response.status == "ok" ) {
                    // mail sent ok - display sent message
                    for( var msg in response.messages ) {
                        showInputMessage( response.messages[msg], 'success' );
                    }
                    // clear the form
                    form[0].reset();
                }
                else {
                    for( var error in response.messages ) {
                        showInputMessage( response.messages[error], 'error' );
                    }
                }
                // make button active
                $( ':input[name="submitButton"]' ).removeAttr( 'disabled' );
            },
            error: function() {
                for( var error in response.messages ) {
                    showInputMessage( response.messages[error], 'error' );
                }
                // make button active
                $( ':input[name="submitButton"]' ).removeAttr( 'disabled' );
            }
        })
        return false;
    });
}

function showInputMessage( message, status ) {
    var $input = $(':input[name="' + message.field + '"]');
    $input.tooltip( { title: message.message, placement : message.placement, trigger: 'manual' } );
    $input.tooltip( 'show' );
    $input.parents( '.control-group' ).addClass( status );
}

function createTwitter() {
    $( '.twitter-feed' ).each( function() {
        $( this ).tweet({
            count: 3,
            username: 'tweepsum',
            loading_text: "searching twitter...",
            template: '<i class="icon-twitter"></i>{text} <small class="info text-italic"> {time}</small>'
        });
    });
}

function updateCategoryProductsPosition(){
  var products = document.getElementsByName("category-product");
  if(products && products.length > 0 && products.length > 4){
       var products2 = "";
    for(var i=4; i<products.length; i++){
      products2 += products[i].outerHTML;
    }
    document.getElementById("category-products-2").innerHTML = products2;
    
    var products1 = "";
    for(var i=0; i<4; i++){
      products1 += products[i].outerHTML;
    }
    document.getElementById("category-products-1").innerHTML = products1;
   
    
    document.getElementById("category-section-2").setAttribute("style", ""); 
  }
}

})(jQuery);
function updateUnlockSign(){
  if(sessionStorage.getItem("userid")){
        $(".list_link_lock").addClass('list_link_unlock');
        $(".list_link_lock").removeClass('list_link_lock');
    }
}

// Google Translate
      	
// $('document').ready(function () {


// 		// RESTYLE THE DROPDOWN MENU
//     $('#google_translate_element').on("click", function () {

//         // Change font family and color
//         $("iframe").contents().find(".goog-te-menu2-item div, .goog-te-menu2-item:link div, .goog-te-menu2-item:visited div, .goog-te-menu2-item:active div, .goog-te-menu2 *")
//             .css({
//                 'color': '#544F4B',
//                 'font-family': 'Roboto',
// 								'width':'100%'
//             });
//         // Change menu's padding
//         $("iframe").contents().find('.goog-te-menu2-item-selected').css ('display', 'none');
			
// 				// Change menu's padding
//         $("iframe").contents().find('.goog-te-menu2').css ('padding', '0px');
      
//         // Change the padding of the languages
//         $("iframe").contents().find('.goog-te-menu2-item div').css('padding', '20px');
      
//         // Change the width of the languages
//         $("iframe").contents().find('.goog-te-menu2-item').css('width', '100%');
//         $("iframe").contents().find('td').css('width', '100%');
      
//         // Change hover effects
//         $("iframe").contents().find(".goog-te-menu2-item div").hover(function () {
//             $(this).css('background-color', '#4385F5').find('span.text').css('color', 'white');
//         }, function () {
//             $(this).css('background-color', 'white').find('span.text').css('color', '#544F4B');
//         });

//         // Change Google's default blue border
//         $("iframe").contents().find('.goog-te-menu2').css('border', 'none');

//         // Change the iframe's box shadow
//         $(".goog-te-menu-frame").css('box-shadow', '0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.3)');
        
      
      
//         // Change the iframe's size and position?
//         $(".goog-te-menu-frame").css({
//             'height': '100%',
//             'width': '100%',
//             'top': '0px'
//         });
//         // Change iframes's size
//         $("iframe").contents().find('.goog-te-menu2').css({
//             'height': '100%',
//             'width': '100%'
//         });
        
//     });
// });

var input = document.getElementById("searchbox");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    search();
  }
});
 

function search(event){
  
   if(document.getElementById("searchbox").value){
     window.location = "/search/" + document.getElementById("searchbox").value.trim();
   }
 }
 
 function getUserDetails(userid, callback){
        var body = {
                      "WebsiteId": "5bed49a7299c810001e423bd",
                      "PropertySegments": [{
                          "PropertyName": "ruggedmonitoring",
                          "PropertyDataType": "ruggedmonitoring",
                          "Type": 5,
                          "Index": null,
                          "Sort": null,
                          "Filter": null
                      }, 
                      {
                          "PropertyName": "users",
                          "PropertyDataType": "user",
                          "Type": 1,
                          "Index" : 0,
                          "Limit" : 10,
                          "ObjectKeys" : {"user_name" : true, "display_name" : true, "download_ids" : true, "application_note_ids" : true},
                          "Filter" : {"_kid" : userid }
                      }]
                  };
  	    var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": "https://api2.kitsune.tools/language/v1/5b17f3f68c794c0517139145/get-data-by-property",
                        "method": "POST",
                        "headers": {
                          "Authorization": "5bbdc89b52f52c0001001592",
                          "Content-Type": "application/json",
                          "Postman-Token": "2723adcb-fc97-4e7f-8fa6-98a15078676b"
                        },
                        "data": JSON.stringify(body)
                      }

          $.ajax(settings).done(function (response) {
            
            if(response && response.Data && response.Data.length > 0){
              callback(response.Data[0]);
            }else{
              callback(null);
            }
            
          });
      }