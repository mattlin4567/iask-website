jQuery(document).ready(function ($) {

  /* ======= Scrollspy ======= */
  $('body').scrollspy({ target: '#top', offset: 400 });

  /* ======= Flexslider ======= */
  $('.flexslider').flexslider({
    animation: "fade",
    touch: true,
    directionNav: false,
    slideshowSpeed: 5000
  });

  /* ======= jQuery Placeholder ======= */
  $('input, textarea').placeholder();

  /* ======= jQuery FitVids - Responsive Video ======= */
  $("#video-container").fitVids();

  /* ======= jQuery Responsive equal heights plugin ======= */
  /* Ref: https://github.com/liabru/jquery-match-height */

  $('#testimonials .quote-box').matchHeight();

  /* ======= Style Switcher (Remove on production site) ======= */
  $('#config-trigger').on('click', function (e) {
    var $panel = $('#config-panel');
    var panelVisible = $('#config-panel').is(':visible');
    if (panelVisible) {
      $panel.hide();
    } else {
      $panel.show();
    }
    e.preventDefault();
  });

  $('#config-close').on('click', function (e) {
    e.preventDefault();
    $('#config-panel').hide();
  });


  $('#color-options a').on('click', function (e) {
    var $styleSheet = $(this).attr('data-style');
    var $logoImage = $(this).attr('data-logo');
    $('#theme-style').attr('href', $styleSheet);
    $('#logo-image').attr('src', $logoImage);

    var $listItem = $(this).closest('li');
    $listItem.addClass('active');
    $listItem.siblings().removeClass('active');

    e.preventDefault();
  });

  $('#contact-form').submit(function (event) {
    var validate = function () {
      return ($("#name").val().length > 0 && $("#email").val().length > 0 && $("#message").val().length > 0);
    };
    if (validate()) {
      $("#contactUsSubmit").attr('disabled', 'disabled');
      $.ajax({
        type: "POST",
        url: "http://www.iask.today:3000/contactUs",
        data: $(this).serialize(), // serializes the form's elements.
        success: function () {
          $('#contactUsError').text("感激您與我們聯繫。我們會在最短的時間回覆您。");
        },
        error: function () {
          $('#contactUsError').text("系統發生錯誤。麻煩於上班時間透過電話聯繫我們。");
        }
      });
    } else {
      $('#contactUsError').text("請填入所有欄位。");
    }
    event.preventDefault();
  });

  $('#coupon-form').submit(function (event) {
    var email = $('#email').val();
    var coupon = $('#coupon').val();
    var success = $('#success');
    var errorBlk = $('#error');
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    success.removeClass('show').addClass('hide');
    errorBlk.removeClass('show').addClass('hide');
    if (!email || !coupon || !regex.test(email)) {
      errorBlk.removeClass('hide').addClass('show');
      errorBlk.html('您輸入有誤！');
    } else {
      $.ajax({
        method: 'POST',
        url: 'http://www.iask.today:3000/exchangeCoupon',
        data: {
          email: email,
          coupon: coupon
        },
        success: function (data) {
          if (data.msg) {
            console.log(data.error);
            errorBlk.removeClass('hide').addClass('show');
            errorBlk.html(data.msg);
          } else {
            success.removeClass('hide').addClass('show');
          }
        },
        error: function (error) {
          errorBlk.removeClass('hide').addClass('show');
          errorBlk.html('系統有誤，請稍後再試！');
          console.log(error);
        }
      });
    }

    event.preventDefault();
  });

  $('#check-email-form').submit(function (event) {
    var email = $('#email').val();
    var errorBlk = $('#error');
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    errorBlk.removeClass('show').addClass('hide');
    if (!email) {
      errorBlk.removeClass('hide').addClass('show');
      console.log('email is null!!');
    } else if (!regex.test(email)) {
      console.log('email validation failed!!');
    } else {
      $.ajax({
        method: 'POST',
        url: 'http://www.iask.today:3000/checkIAskUidByEmail',
        data: {
          email: email
        },
        success: function (data) {
          if (data.error) {
            errorBlk.removeClass('hide').addClass('show');
            console.log('email not found!!');
          } else if (!data.uid) {
            errorBlk.removeClass('hide').addClass('show');
            console.log('uid is null!!');
          } else {
            location.href = 'http://66.172.33.130/iAsk/app/user/plan_select.php?uid=' + data.uid + '&email=' + email;
          }
        },
        error: function (error) {
          errorBlk.removeClass('hide').addClass('show');
          console.log(error);
        }
      });
    }
    event.preventDefault();
  });
});