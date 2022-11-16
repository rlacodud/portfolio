// 로딩창
window.addEventListener('DOMContentLoaded', function () {
  setTimeout(() => {
      $('.load').hide();
      $('body').addClass('on');
    }, 4000);
  });

// 반응형 구현을 위한 계산값
var convertPx = {
  vw: function (px) {
    px = parseFloat(px);
    var ww = $(window).width();

    return ww * px / 1920;
  }
}

// 업데이트 날짜
const updateDate = document.querySelector('.update-date');

var now = new Date();
var year = now.getFullYear(); // 연도
var month = now.getMonth() + 1; // 월 
var day = now.getDate(); // 일
var stDate = new Date(2022, 11, 17);
var endDate = new Date(year, month, day);
var btMs = endDate.getTime() - stDate.getTime();
var btDay = btMs / (1000 * 60 * 60 * 24);
function dateFormat(date) {
  let dateFormat2 = date.getFullYear() +
    '-' + ((date.getMonth() + 1) < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) +
    '-' + ((date.getDate()) < 9 ? "0" + (date.getDate()) : (date.getDate()));
  return dateFormat2;
}
let toDay = dateFormat(new Date('2022-11-17'));
$('.update-date').text(`Last Update ${toDay} (D + ${btDay})`);

// sectionTwo
let section2Top = jQuery('#sectionTwo').offset().top;
let section2Bottom = jQuery('#sectionTwo').offset().top + $('#sectionTwo').height() - $(window).height();
// 가로 스크롤될 부분
let horizontalContainer = document.querySelector(".horizontal-container");
// 가로 스크롤이 시작될 위치값
let sectionThree = document.querySelector('#sectionThree');
let sectionThreeTop = sectionThree.offsetTop;
let sectionThreeBottom = jQuery('#sectionThree').offset().top + $('#sectionThree').height() - $(window).height();

// 가로 스크롤값
let move = 0;
let varDuration = 300;
// fix 여부를 확인하는 Boolean값
var fixMode = false;
// on 여부를 확인하는 Boolean값
let hasOn = false;

$('.logo').on('click', function() {
  $('#sectionThree').removeClass('fix');
  setTimeout (function() {
    scrollTo(0, 0);
  }, 100);
  $('.projectIndexSection').removeClass('on');
  $('.projectIndexSection .projectIndex').removeClass('on');
  $('#webgl-container').css({
    'opacity': '0.7'
  })
})

$('.nav-work').on('click touchstart', function () {
  $('.projectIndexSection').toggleClass('on');
  $('.projectIndexSection .projectIndex').toggleClass('on');
  $('.header').removeClass('off');
  $('.header').removeClass('black');
})

// 메인 바코드 애니메이션
let barcodeSpans = $(".barcode").children();
function barcodeAnimation() {
  barcodeSpans.each(function (i) {
    let span = $(this);
    setTimeout(function () {
      // 각 span에 highlighted 클래스가 텀을 두고 추가
      span.toggleClass('highlighted');
    }, 200 * i);
  });

  barcodeSpans.each(function (i) {
    let span = $(this);
    setTimeout(function () {
      // 각 span에 highlighted 클래스가 텀을 두고 제거
      span.toggleClass('highlighted');

    }, 20 * i);
  });
}
$(document).ready(function () {
  setInterval(barcodeAnimation, 2000);
});


$('.random-barcode').on('click', function() {
  document.querySelector('#scan').play();
})

// Header Scroll Event
let lastScrollTop = 0;
$(window).on("scroll", function () {
  let st = $(document).scrollTop();

  // 마우스를 위로 올릴 시
  if (st > lastScrollTop) {
    // header class 추가
    $("header").addClass('off');
    // 마우스를 아래로 내릴 시
  } else {
    // header class 제거
    $("header").removeClass('off');
  }
  lastScrollTop = st;
});


function sectionTwoEvent() {
  let documentHeight = $(document).scrollTop();
  console.log(documentHeight)
  if (documentHeight >= section2Top) {
    $('#sectionTwo .container').addClass('fixed');
  } else {
    $('#sectionTwo .container').removeClass('fixed');
  }
  if (documentHeight >= section2Bottom) {
    $('#sectionTwo .container').removeClass('fixed');
    $('#sectionTwo .container').addClass('absolute');
  } else if (documentHeight < section2Bottom && documentHeight >= section2Top) {
    $('#sectionTwo .container').addClass('fixed');
    $('#sectionTwo .container').removeClass('absolute');
  }

  if (documentHeight >= section2Top && documentHeight < section2Top + convertPx.vw(100)) {
    $('#sectionTwo .container .text-container p.n1').css({
      'transform': 'translateX(150%) translateY(-50%) skewX(300deg)'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(100) && documentHeight < section2Top + convertPx.vw(200)) {
    $('#sectionTwo .container .text-container p.n1').css({
      'transform': 'translateX(130%) translateY(-50%) skewX(300deg)'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(200) && documentHeight < section2Top + convertPx.vw(300)) {
    $('#sectionTwo .container .text-container p.n1').css({
      'transform': 'translateX(100%) translateY(-50%) skewX(300deg)'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(300) && documentHeight < section2Top + convertPx.vw(400)) {
    $('#sectionTwo .container .text-container p.n1').css({
      'transform': 'translateX(70%) translateY(-50%) skewX(310deg)'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(400) && documentHeight < section2Top + convertPx.vw(500)) {
    $('#sectionTwo .container .text-container p.n1').css({
      'transform': 'translateX(40%) translateY(-50%) skewX(320deg)'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(500) && documentHeight < section2Top + convertPx.vw(600)) {
    $('#sectionTwo .container .text-container p.n1').css({
      'transform': 'translateX(0%) translateY(-50%) skewX(330deg)'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(600) && documentHeight < section2Top + convertPx.vw(700)) {
    $('#sectionTwo .container .text-container p.n1').css({
      'transform': 'translateX(-50%) translateY(-50%) skewX(360deg)'
    })
  }
  // n2=======================================================================================================
  if (documentHeight >= section2Top + convertPx.vw(800) && documentHeight < section2Top + convertPx.vw(900)) {
    $('#sectionTwo .container .text-container p.n2').css({
      'transform': 'translateX(-50%) translateY(1000%)'
    })
    $('#sectionTwo .container .text-container p.n2').css({
      'font-size': convertPx.vw(50)
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(900) && documentHeight < section2Top + convertPx.vw(1000)) {
    $('#sectionTwo .container .text-container p.n2').css({
      'transform': 'translateX(-50%) translateY(800%)'
    })
    $('#sectionTwo .container .text-container p.n2').css({
      'font-size': convertPx.vw(50)
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(1000) && documentHeight < section2Top + convertPx.vw(1100)) {
    $('#sectionTwo .container .text-container p.n2').css({
      'transform': 'translateX(-50%) translateY(600%)'
    })
    $('#sectionTwo .container .text-container p.n2').css({
      'font-size': convertPx.vw(50)
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(1100) && documentHeight < section2Top + convertPx.vw(1200)) {
    $('#sectionTwo .container .text-container p.n2').css({
      'transform': 'translateX(-50%) translateY(400%)'
    })
    $('#sectionTwo .container .text-container p.n2').css({
      'font-size': convertPx.vw(70)
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(1200) && documentHeight < section2Top + convertPx.vw(1300)) {
    $('#sectionTwo .container .text-container p.n2').css({
      'transform': 'translateX(-50%) translateY(100%)'
    })
    $('#sectionTwo .container .text-container p.n2').css({
      'font-size': convertPx.vw(90)
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(1300) && documentHeight < section2Top + convertPx.vw(1400)) {
    $('#sectionTwo .container .text-container p.n2').css({
      'transform': 'translateX(-50%) translateY(50%)'
    })
    $('#sectionTwo .container .text-container p.n2').css({
      'font-size': convertPx.vw(100)
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(1400) && documentHeight < section2Top + convertPx.vw(1500)) {
    $('#sectionTwo .container .text-container p.n2').css({
      'transform': 'translateX(-50%) translateY(0%)'
    })
    $('#sectionTwo .container .text-container p.n2').css({
      'font-size': convertPx.vw(100)
    })
    $('#sectionTwo .container .text-container p.n1').css({
      'transform': 'translateX(-50%) translateY(-70%) skewX(360deg)'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(1500) && documentHeight < section2Top + convertPx.vw(1600)) {
    $('#sectionTwo .container .text-container p.n2').css({
      'transform': 'translateX(-50%) translateY(-50%)'
    })
    $('#sectionTwo .container .text-container p.n2').css({
      'font-size': convertPx.vw(100)
    })
    $('#sectionTwo .container .text-container p.n1').css({
      'transform': 'translateX(-50%) translateY(-165%) skewX(360deg) rotate(-3deg)'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(1600) && documentHeight < section2Top + convertPx.vw(1700)) {
    $('#sectionTwo .container .text-container p.n1').css({
      'transform': 'translateX(-50%) translateY(-200%) skewX(360deg) rotate(-10deg)'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(1800) && documentHeight < section2Top + convertPx.vw(1900)) {
    $('#sectionTwo .container .text-container p.n1').css({
      'transform': 'translateX(-50%) translateY(-300%) skewX(360deg) rotate(-20deg)'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(1900) && documentHeight < section2Top + convertPx.vw(2000)) {
    $('#sectionTwo .container .text-container p.n1').css({
      'transform': 'translateX(-50%) translateY(-600%) skewX(360deg) rotate(-30deg)'
    })
    $('#sectionTwo .container .text-container p.n2').css({
      'opacity': 0.9
    })
    $('#sectionTwo .container .text-container p.n2_1').css({
      'opacity': 0
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(2000) && documentHeight < section2Top + convertPx.vw(2100)) {
    $('#sectionTwo .container .text-container p.n2').css({
      'opacity': 0.7
    })
    $('#sectionTwo .container .text-container p.n2_1').css({
      'opacity': 0.3
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(2100) && documentHeight < section2Top + convertPx.vw(2200)) {
    $('#sectionTwo .container .text-container p.n2').css({
      'opacity': 0.5
    })
    $('#sectionTwo .container .text-container p.n2_1').css({
      'opacity': 0.5
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(2200) && documentHeight < section2Top + convertPx.vw(2300)) {
    $('#sectionTwo .container .text-container p.n2').css({
      'opacity': 0.3
    })
    $('#sectionTwo .container .text-container p.n2_1').css({
      'opacity': 0.7
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(2300) && documentHeight < section2Top + convertPx.vw(2400)) {
    $('#sectionTwo .container .text-container p.n2').css({
      'opacity': 0
    })
    $('#sectionTwo .container .text-container p.n2_1').css({
      'opacity': 1
    })
    $('#sectionTwo .container .text-container p.n3').css({
      'opacity': 0
    })
    $('#sectionTwo .container .text-container p.n3 .moving-circle.n1').css({
      'stroke-dashoffset': 500
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(2400) && documentHeight < section2Top + convertPx.vw(2500)) {
    $('#sectionTwo .container .text-container p.n2_1').css({
      'opacity': 0.5
    })
    $('#sectionTwo .container .text-container p.n3').css({
      'opacity': 0.3
    })
    $('#sectionTwo .container .text-container p.n3 .moving-circle.n1').css({
      'stroke-dashoffset': 200
    })
    $('#sectionTwo .container .text-container p.n3 .moving-circle.n2').css({
      'stroke-dashoffset': 500
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(2500) && documentHeight < section2Top + convertPx.vw(2600)) {
    $('#sectionTwo .container .text-container p.n2_1').css({
      'opacity': 0
    })
    $('#sectionTwo .container .text-container p.n3').css({
      'opacity': 0.5
    })
    $('#sectionTwo .container .text-container p.n3 .moving-circle.n1').css({
      'stroke-dashoffset': 0
    })
    $('#sectionTwo .container .text-container p.n3 .moving-circle.n2').css({
      'stroke-dashoffset': 200
    })
    $('#sectionTwo .container .text-container p.n3 .moving-circle.n3').css({
      'stroke-dashoffset': -500
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(2600) && documentHeight < section2Top + convertPx.vw(2700)) {
    $('#sectionTwo .container .text-container p.n3').css({
      'opacity': 0.7
    })
    $('#sectionTwo .container .text-container p.n3 .moving-circle.n2').css({
      'stroke-dashoffset': 0
    })
    $('#sectionTwo .container .text-container p.n3 .moving-circle.n3').css({
      'stroke-dashoffset': -300
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(2700) && documentHeight < section2Top + convertPx.vw(2800)) {
    $('#sectionTwo .container .text-container p.n3').css({
      'opacity': 1
    })
    $('#sectionTwo .container .text-container p.n3_1').css({
      'opacity': 0
    })
    $('#sectionTwo .container .text-container p.n3 .moving-circle.n3').css({
      'stroke-dashoffset': 0
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(2800) && documentHeight < section2Top + convertPx.vw(2900)) {
    $('#sectionTwo .container .text-container p.n3').css({
      'opacity': 0.7
    })
  }
  // ===============================================================================================================
  if (documentHeight >= section2Top + convertPx.vw(2900) && documentHeight < section2Top + convertPx.vw(3000)) {
    $('#sectionTwo .container .text-container p.n3').css({
      'opacity': 0.5
    })
    $('#sectionTwo .container .text-container p.n3_1').css({
      'opacity': 0.5
    })
    $('#sectionTwo .container .text-container p.n4').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n4').css({
      'left': '200%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(3000) && documentHeight < section2Top + convertPx.vw(3200)) {
    $('#sectionTwo .container .text-container p.n3').css({
      'opacity': 0.3
    })
    $('#sectionTwo .container .text-container p.n3_1').css({
      'opacity': 0.7
    })
    $('#sectionTwo .container .text-container p.n4').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n4').css({
      'left': '150%'
    })
    $('#sectionTwo .container .text-container p.n5').css({
      'top': '20%'
    })
    $('#sectionTwo .container .text-container p.n5').css({
      'left': '200%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(3200) && documentHeight < section2Top + convertPx.vw(3400)) {
    $('#sectionTwo .container .text-container p.n3').css({
      'opacity': 0
    })
    $('#sectionTwo .container .text-container p.n3_1').css({
      'opacity': 1
    })
    $('#sectionTwo .container .text-container p.n4').css({
      'top': '80%'
    })
    $('#sectionTwo .container .text-container p.n4').css({
      'left': '90%'
    })
    $('#sectionTwo .container .text-container p.n5').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n5').css({
      'left': '150%'
    })
    $('#sectionTwo .container .text-container p.n6').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n6').css({
      'left': '200%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(3400) && documentHeight < section2Top + convertPx.vw(3600)) {
    $('#sectionTwo .container .text-container p.n3_1').css({
      'opacity': 0
    })
    $('#sectionTwo .container .text-container p.n4').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n4').css({
      'left': '70%'
    })
    $('#sectionTwo .container .text-container p.n5').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n5').css({
      'left': '100%'
    })
    $('#sectionTwo .container .text-container p.n6').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n6').css({
      'left': '150%'
    })
    $('#sectionTwo .container .text-container p.n7').css({
      'top': '20%'
    })
    $('#sectionTwo .container .text-container p.n7').css({
      'left': '200%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(3600) && documentHeight < section2Top + convertPx.vw(3800)) {
    $('#sectionTwo .container .text-container p.n4').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n4').css({
      'left': '50%'
    })
    $('#sectionTwo .container .text-container p.n5').css({
      'top': '40%'
    })
    $('#sectionTwo .container .text-container p.n5').css({
      'left': '70%'
    })
    $('#sectionTwo .container .text-container p.n6').css({
      'top': '80%'
    })
    $('#sectionTwo .container .text-container p.n6').css({
      'left': '90%'
    })
    $('#sectionTwo .container .text-container p.n7').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n7').css({
      'left': '150%'
    })
    $('#sectionTwo .container .text-container p.n8').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n8').css({
      'left': '200%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(3800) && documentHeight < section2Top + convertPx.vw(4000)) {
    $('#sectionTwo .container .text-container p.n4').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n4').css({
      'left': '15%'
    })
    $('#sectionTwo .container .text-container p.n5').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n5').css({
      'left': '40%'
    })
    $('#sectionTwo .container .text-container p.n6').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n6').css({
      'left': '70%'
    })
    $('#sectionTwo .container .text-container p.n7').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n7').css({
      'left': '100%'
    })
    $('#sectionTwo .container .text-container p.n8').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n8').css({
      'left': '150%'
    })
    $('#sectionTwo .container .text-container p.n9').css({
      'top': '20%'
    })
    $('#sectionTwo .container .text-container p.n9').css({
      'left': '200%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(4000) && documentHeight < section2Top + convertPx.vw(4200)) {
    $('#sectionTwo .container .text-container p.n5').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n5').css({
      'left': '18%'
    })
    $('#sectionTwo .container .text-container p.n6').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n6').css({
      'left': '50%'
    })
    $('#sectionTwo .container .text-container p.n7').css({
      'top': '40%'
    })
    $('#sectionTwo .container .text-container p.n7').css({
      'left': '70%'
    })
    $('#sectionTwo .container .text-container p.n8').css({
      'top': '80%'
    })
    $('#sectionTwo .container .text-container p.n8').css({
      'left': '90%'
    })
    $('#sectionTwo .container .text-container p.n9').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n9').css({
      'left': '150%'
    })
    $('#sectionTwo .container .text-container p.n10').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n10').css({
      'left': '200%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(4200) && documentHeight < section2Top + convertPx.vw(4400)) {
    $('#sectionTwo .container .text-container p.n6').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n6').css({
      'left': '21%'
    })
    $('#sectionTwo .container .text-container p.n7').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n7').css({
      'left': '40%'
    })
    $('#sectionTwo .container .text-container p.n8').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n8').css({
      'left': '70%'
    })
    $('#sectionTwo .container .text-container p.n9').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n9').css({
      'left': '100%'
    })
    $('#sectionTwo .container .text-container p.n10').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n10').css({
      'left': '150%'
    })
    $('#sectionTwo .container .text-container p.n11').css({
      'top': '20%'
    })
    $('#sectionTwo .container .text-container p.n11').css({
      'left': '200%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(4400) && documentHeight < section2Top + convertPx.vw(4600)) {
    $('#sectionTwo .container .text-container p.n7').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n7').css({
      'left': '24.5%'
    })
    $('#sectionTwo .container .text-container p.n8').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n8').css({
      'left': '50%'
    })
    $('#sectionTwo .container .text-container p.n9').css({
      'top': '40%'
    })
    $('#sectionTwo .container .text-container p.n9').css({
      'left': '70%'
    })
    $('#sectionTwo .container .text-container p.n10').css({
      'top': '80%'
    })
    $('#sectionTwo .container .text-container p.n10').css({
      'left': '90%'
    })
    $('#sectionTwo .container .text-container p.n11').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n11').css({
      'left': '150%'
    })
    $('#sectionTwo .container .text-container p.n12').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n12').css({
      'left': '200%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(4600) && documentHeight < section2Top + convertPx.vw(4800)) {
    $('#sectionTwo .container .text-container p.n8').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n8').css({
      'left': '28%'
    })
    $('#sectionTwo .container .text-container p.n9').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n9').css({
      'left': '40%'
    })
    $('#sectionTwo .container .text-container p.n10').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n10').css({
      'left': '70%'
    })
    $('#sectionTwo .container .text-container p.n11').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n11').css({
      'left': '100%'
    })
    $('#sectionTwo .container .text-container p.n12').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n12').css({
      'left': '150%'
    })
    $('#sectionTwo .container .text-container p.n13').css({
      'top': '20%'
    })
    $('#sectionTwo .container .text-container p.n13').css({
      'left': '200%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(4800) && documentHeight < section2Top + convertPx.vw(5000)) {
    $('#sectionTwo .container .text-container p.n9').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n9').css({
      'left': '31.5%'
    })
    $('#sectionTwo .container .text-container p.n10').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n10').css({
      'left': '50%'
    })
    $('#sectionTwo .container .text-container p.n11').css({
      'top': '40%'
    })
    $('#sectionTwo .container .text-container p.n11').css({
      'left': '70%'
    })
    $('#sectionTwo .container .text-container p.n12').css({
      'top': '80%'
    })
    $('#sectionTwo .container .text-container p.n12').css({
      'left': '90%'
    })
    $('#sectionTwo .container .text-container p.n13').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n13').css({
      'left': '150%'
    })
    $('#sectionTwo .container .text-container p.n14').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n14').css({
      'left': '200%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(5000) && documentHeight < section2Top + convertPx.vw(5200)) {
    $('#sectionTwo .container .text-container p.n10').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n10').css({
      'left': '35.5%'
    })
    $('#sectionTwo .container .text-container p.n11').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n11').css({
      'left': '40%'
    })
    $('#sectionTwo .container .text-container p.n12').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n12').css({
      'left': '70%'
    })
    $('#sectionTwo .container .text-container p.n13').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n13').css({
      'left': '100%'
    })
    $('#sectionTwo .container .text-container p.n14').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n14').css({
      'left': '150%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(5200) && documentHeight < section2Top + convertPx.vw(5400)) {
    $('#sectionTwo .container .text-container p.n11').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n11').css({
      'left': '39%'
    })
    $('#sectionTwo .container .text-container p.n12').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n12').css({
      'left': '50%'
    })
    $('#sectionTwo .container .text-container p.n13').css({
      'top': '40%'
    })
    $('#sectionTwo .container .text-container p.n13').css({
      'left': '70%'
    })
    $('#sectionTwo .container .text-container p.n14').css({
      'top': '80%'
    })
    $('#sectionTwo .container .text-container p.n14').css({
      'left': '90%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(5400) && documentHeight < section2Top + convertPx.vw(5600)) {
    $('#sectionTwo .container .text-container p.n12').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n12').css({
      'left': '41.5%'
    })
    $('#sectionTwo .container .text-container p.n13').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n13').css({
      'left': '40%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(5600) && documentHeight < section2Top + convertPx.vw(5800)) {
    $('#sectionTwo .container .text-container p.n13').css({
      'top': '50.5%'
    })
    $('#sectionTwo .container .text-container p.n13').css({
      'left': '44.5%'
    })
    $('#sectionTwo .container .text-container p.n14').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n14').css({
      'left': '70%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(5800) && documentHeight < section2Top + convertPx.vw(6000)) {
    $('#sectionTwo .container .text-container p.n14').css({
      'top': '70%'
    })
    $('#sectionTwo .container .text-container p.n14').css({
      'left': '60%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(6000) && documentHeight < section2Top + convertPx.vw(6200)) {
    $('#sectionTwo .container .text-container p.n14').css({
      'top': '50%'
    })
    $('#sectionTwo .container .text-container p.n14').css({
      'left': '49%'
    })
    $('#sectionTwo .container .text-container p.n15').css({
      'left': '150%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(6200) && documentHeight < section2Top + convertPx.vw(6400)) {
    $('#sectionTwo .container .text-container p.n15').css({
      'left': '100%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(6400) && documentHeight < section2Top + convertPx.vw(6600)) {
    $('#sectionTwo .container .text-container p.n15').css({
      'left': '70%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(6600) && documentHeight < section2Top + convertPx.vw(6800)) {
    $('#sectionTwo .container .text-container p.n15').css({
      'left': '65%'
    })
    $('.white-circle').css({
      'width': convertPx.vw(50)
    })
    $('.white-circle').css({
      'height': convertPx.vw(50)
    })
    $('.white-circle').css({
      'display': 'none'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(6600) && documentHeight < section2Top + convertPx.vw(6800)) {
    $('#sectionTwo .container .text-container p.n15').css({
      'left': '67%'
    })
    $('#sectionTwo .container .text-container p.n4').css({
      'opacity': '1'
    })
    $('#sectionTwo .container .text-container p.n5').css({
      'opacity': '1'
    })
    $('#sectionTwo .container .text-container p.n6').css({
      'opacity': '1'
    })
    $('#sectionTwo .container .text-container p.n7').css({
      'opacity': '1'
    })
    $('#sectionTwo .container .text-container p.n8').css({
      'opacity': '1'
    })
    $('#sectionTwo .container .text-container p.n9').css({
      'opacity': '1'
    })
    $('#sectionTwo .container .text-container p.n10').css({
      'opacity': '1'
    })
    $('#sectionTwo .container .text-container p.n11').css({
      'opacity': '1'
    })
    $('#sectionTwo .container .text-container p.n12').css({
      'opacity': '1'
    })
    $('#sectionTwo .container .text-container p.n13').css({
      'opacity': '1'
    })
    $('#sectionTwo .container .text-container p.n14').css({
      'opacity': '1'
    })
    $('#sectionTwo .container .text-container p.n15').css({
      'opacity': '1'
    })
    $('#sectionTwo .container .text-container p.n4_1').css({
      'opacity': 0
    })
  }
  // ==================================================================================================================
  if (documentHeight >= section2Top + convertPx.vw(6800) && documentHeight < section2Top + convertPx.vw(7000)) {
    $('#sectionTwo .container .text-container p.n4').css({
      'opacity': '0'
    })
    $('#sectionTwo .container .text-container p.n5').css({
      'opacity': '0'
    })
    $('#sectionTwo .container .text-container p.n6').css({
      'opacity': '0'
    })
    $('#sectionTwo .container .text-container p.n7').css({
      'opacity': '0'
    })
    $('#sectionTwo .container .text-container p.n8').css({
      'opacity': '0'
    })
    $('#sectionTwo .container .text-container p.n9').css({
      'opacity': '0'
    })
    $('#sectionTwo .container .text-container p.n10').css({
      'opacity': '0'
    })
    $('#sectionTwo .container .text-container p.n11').css({
      'opacity': '0'
    })
    $('#sectionTwo .container .text-container p.n12').css({
      'opacity': '0'
    })
    $('#sectionTwo .container .text-container p.n13').css({
      'opacity': '0'
    })
    $('#sectionTwo .container .text-container p.n14').css({
      'opacity': '0'
    })
    $('#sectionTwo .container .text-container p.n15').css({
      'opacity': '0'
    })
    $('#sectionTwo .container .text-container p.n4_1').css({
      'opacity': 1
    })
    $('.white-circle').css({
      'transform': 'translate(-50%, -50%) scale(0)'
    })
    $('.white-circle').css({
      'display': 'none'
    })
    $('.circle__svg').css({
      'display': 'none'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(7000) && documentHeight < section2Top + convertPx.vw(7100)) {
    $('.white-circle').css({
      'transform': 'translate(-50%, -50%) scale(1)'
    })
    $('.white-circle').css({
      'display': 'block'
    })
    $('.circle__svg').css({
      'display': 'block'
    })
    $('.circle__svg').css({
      'transform': 'translate(-50%, -50%) rotate(0deg)'
    })
    $('#sectionTwo .container .text-container p.n4_1').css({
      'opacity': 0
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(7100) && documentHeight < section2Top + convertPx.vw(7200)) {
    $('.white-circle').css({
      'transform': 'translate(-50%, -50%) scale(20)'
    })
    $('.circle__svg').css({
      'transform': 'translate(-50%, -50%) rotate(100deg)'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(7200) && documentHeight < section2Top + convertPx.vw(7300)) {
    $('.white-circle').css({
      'transform': 'translate(-50%, -50%) scale(30)'
    })
    $('.circle__svg').css({
      'transform': 'translate(-50%, -50%) rotate(200deg)'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(7300) && documentHeight < section2Top + convertPx.vw(7400)) {
    $('.white-circle').css({
      'transform': 'translate(-50%, -50%) scale(40)'
    })
    $('.circle__svg').css({
      'transform': 'translate(-50%, -50%) rotate(300deg)'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(7400) && documentHeight < section2Top + convertPx.vw(7500)) {
    $('.white-circle').css({
      'transform': 'translate(-50%, -50%) scale(50)'
    })
    $('.circle__svg').css({
      'transform': 'translate(-50%, -50%) rotate(360deg)'
    })
    $('.circle__svg').css({
      'opacity': '0.7'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(7500) && documentHeight < section2Top + convertPx.vw(7600)) {
    $('.circle__svg').css({
      'opacity': '0.5'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(7600) && documentHeight < section2Top + convertPx.vw(7700)) {
    $('.circle__svg').css({
      'opacity': '0.3'
    })
    $('#sectionTwo .container .text-container p.n16').css({
      'left': '-70%'
    })
    $('#sectionTwo .container .text-container p.n17').css({
      'left': '150%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(7700) && documentHeight < section2Top + convertPx.vw(7800)) {
    $('.circle__svg').css({
      'opacity': '0'
    })
    $('#sectionTwo .container .text-container p.n16').css({
      'left': '-50%'
    })
    $('#sectionTwo .container .text-container p.n17').css({
      'left': '80%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(7800) && documentHeight < section2Top + convertPx.vw(7900)) {
    $('#sectionTwo .container .text-container p.n16').css({
      'left': '40%'
    })
    $('#sectionTwo .container .text-container p.n17').css({
      'left': '70%'
    })
    $('#sectionTwo .container .text-container p.n18').css({
      'top': '150%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(7900) && documentHeight < section2Top + convertPx.vw(8000)) {
    $('#sectionTwo .container .text-container p.n18').css({
      'top': '100%'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(8000) && documentHeight < section2Top + convertPx.vw(8100)) {
    $('#sectionTwo .container .text-container p.n18').css({
      'top': '80%'
    })
  }
  // ==========================================================================================================
  if (documentHeight >= section2Top + convertPx.vw(8100) && documentHeight < section2Top + convertPx.vw(8200)) {
    $('#sectionTwo .container .text-container p.n18').css({
      'top': '60%'
    })
    $('.white-circle').css({
      'opacity': '0.7'
    })
    $('#sectionTwo .container .text-container p.n16').css({
      'opacity': '1'
    })
    $('#sectionTwo .container .text-container p.n17').css({
      'opacity': '1'
    })
    $('#sectionTwo .container .text-container p.n18').css({
      'opacity': '1'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(8200) && documentHeight < section2Top + convertPx.vw(8300)) {
    $('#sectionTwo .container .text-container p.n16').css({
      'opacity': '0'
    })
    $('#sectionTwo .container .text-container p.n17').css({
      'opacity': '0'
    })
    $('#sectionTwo .container .text-container p.n18').css({
      'opacity': '0'
    })
    $('.white-circle').css({
      'opacity': '0.5'
    })
    $('#sectionTwo .container .text-container p.n19').css({
      'opacity': '0'
    })
    $('#webgl-container').css({
      'opacity': '0'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(8300) && documentHeight < section2Top + convertPx.vw(8400)) {
    $('.white-circle').css({
      'opacity': '0.3'
    })
    $('#sectionTwo .container .text-container p.n19').css({
      'opacity': '0.3'
    })
    $('#webgl-container').css({
      'opacity': '0.3'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(8400) && documentHeight < section2Top + convertPx.vw(8500)) {
    $('.white-circle').css({
      'opacity': '0'
    })
    $('#sectionTwo .container .text-container p.n19').css({
      'opacity': '0.5'
    })
    $('#webgl-container').css({
      'opacity': '0.5'
    })
    $('#sectionTwo .container .text-container p.n20').css({
      'opacity': '0'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(8500) && documentHeight < section2Top + convertPx.vw(8700)) {
    $('#sectionTwo .container .text-container p.n19').css({
      'opacity': '0.7'
    })
    $('#webgl-container').css({
      'opacity': '0.7'
    })
    $('#sectionTwo .container .text-container p.n20').css({
      'opacity': '0.3'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(8700) && documentHeight < section2Top + convertPx.vw(8900)) {
    $('#sectionTwo .container .text-container p.n19').css({
      'opacity': '1'
    })
    $('#webgl-container').css({
      'opacity': '1'
    })
    $('#sectionTwo .container .text-container p.n20').css({
      'opacity': '0.5'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(8900) && documentHeight < section2Top + convertPx.vw(9000)) {
    $('#sectionTwo .container .text-container p.n20').css({
      'opacity': '0.7'
    })
  }
  if (documentHeight >= section2Top + convertPx.vw(9000) && documentHeight < section2Top + convertPx.vw(9100)) {
    $('#sectionTwo .container .text-container p.n20').css({
      'opacity': '1'
    })
  }
}

$(window).scroll(function () {
  sectionTwoEvent();
})

// 각 thumnail 클릭 시
$('.contents-container.thumnail').on('click touchStart', function (e) {
  // 이벤트 버블링 방지
  e.stopPropagation();

  // 선택한 article의 contents-container에 on 추가
  setTimeout(() => {
    $(this).next('.contents-container.scroll').addClass('on');
  }, 50);

  $('.contents-container.scroll.on').scrollTop(0);
  $('.contents-container.scroll').css({ 'transform': 'translateY(-50%)' });
  $('.contents-container.scroll').css({ 'display': 'block' });
  $('.contents-container.on .contents').css({ 'transform': 'translateY(' + 0 + 'px)' });


  // 각 article이 가운데에 위치하도록 move 대입
  if ($(this).parent('article').hasClass('iphone14')) {
    move = convertPx.vw(1);
  } else if ($(this).parent('article').hasClass('The51_Renewal')) {
    move = convertPx.vw(-1150);
  } else if ($(this).parent('article').hasClass('IKooB_Quiz')) {
    move = convertPx.vw(-2303);
  } else if ($(this).parent('article').hasClass('LG_Gram_Microsite')) {
    move = convertPx.vw(-3455);
  } else if ($(this).parent('article').hasClass('The51_Portfolio')) {
    move = convertPx.vw(-4608);
  } else if ($(this).parent('article').hasClass('Honda_Korea')) {
    move = convertPx.vw(-5759);
  } else if ($(this).parent('article').hasClass('BOOOAO')) {
    move = convertPx.vw(-6911);
  } else if ($(this).parent('article').hasClass('ZIPKID')) {
    move = convertPx.vw(-8063);
  }

  // 위치값으로 이동되게끔 함
  horizontalContainer.style.transition = "transform 0.1s linear";
  horizontalContainer.style.transform = "translateX(" + move + "px)";

  // on을 추가하였으므로 true로 변경
  hasOn = true;
})

$('.contents-container.scroll').on('scroll', function (e) {
  if ($(this).hasClass('on')) {
    let documentHeight = $(this).scrollTop();
    if (documentHeight >= convertPx.vw(600)) {
      $(this).find('.contents-description').addClass('ani');
      $(this).find('.contents-link .n1').addClass('ani');
      $(this).find('.contents-link .n1').css({ 'animation-delay': '0.3s' });
      $(this).find('.contents-link .n2').addClass('ani');
      $(this).find('.contents-link .n2').css({ 'animation-delay': '0.5s' });
    }
    if (documentHeight >= convertPx.vw(1500)) {
      $(this).find('.contents-function.n1 h4').addClass('ani');
      $(this).find('.contents-function.n1 div').addClass('ani');
      $(this).find('.contents-function.n1 div').css({ 'animation-delay': '0.2s' });
    }
    if (documentHeight >= convertPx.vw(2600)) {
      $(this).find('.contents-function.n2 h4').addClass('ani');
      $(this).find('.contents-function.n2 div').addClass('ani');
      $(this).find('.contents-function.n2 div').css({ 'animation-delay': '0.2s' });
    }
    if (documentHeight >= convertPx.vw(3000)) {
      $(this).find('.contents-function.n3 h4').addClass('ani');
      $(this).find('.contents-function.n3 div').addClass('ani');
      $(this).find('.contents-function.n3 div').css({ 'animation-delay': '0.2s' });
    }
    if ($(this).parent('article').hasClass('LG_Gram_Microsite')) {
      if (documentHeight >= convertPx.vw(1500)) {
        $(this).find('.contents-function.n1 h4').addClass('ani');
        $(this).find('.contents-function.n1 .n1_1').addClass('ani');
        $(this).find('.contents-function.n1 .n1_1').css({ 'animation-delay': '0.2s' });
        $(this).find('.contents-function.n1 .n1_2').addClass('ani');
        $(this).find('.contents-function.n1 .n1_2').css({ 'animation-delay': '0.3s' });
      }
    }
  }
})

function mainScrollEvent(e) {
  // 가로 스크롤
  function onscrollw(e) {
    // sectionThree가 fix되어있고
    if ($('#sectionThree').hasClass('fix')) {
      // hasOn이 false일 경우 실행
      if (!hasOn) {
        window.onmousewheel = function (event) {
          // 마우스를 아래로 내릴 때
          if (e.wheelDelta < 0) {
            move -= varDuration;
            // 한계갑보다 넘어갈 경우
            if (move < convertPx.vw(-7800)) {
              // 지정
              move = convertPx.vw(-7800);
            }
            // 마우스를 위로 올릴 때
          } else if (e.wheelDelta > 0) {
            move += varDuration;
            // 한계값보다 넘어갈 경우
            if (move > 0) {
              // 지정
              move = 0;
            }
          }
        };
        horizontalContainer.style.transition = "transform 0.5s linear";
        horizontalContainer.style.transform = "translateX(" + move + "px)";
      }
    }
  }

  // fix 체크
  function fixAndFixEnd(e) {
    // hasOn이 false일 때
    if (!hasOn) {
      // 현재 스크롤 위치
      let documentHeight = $(document).scrollTop();
      // 마우스를 아래로 내릴 때
      if (e.wheelDelta < 0) {
        // sectionThree 영역 안에 들어오면
        if (documentHeight >= sectionThreeTop - convertPx.vw(200)) {
          // fixMode를 true로
          fixMode = true
        }
        // 한계까지 스크롤이 완료되었다면
        if (move <= convertPx.vw(-7800)) {
          // fixMode를 false로
          fixMode = false
        }
        if (fixMode && move >= 0) {
          $('header').addClass('black');
          // fix 추가
          $('#sectionThree').addClass('fix');
        }

        // 마우스 위
      } else if (e.wheelDelta > 0) {
        // 슬라이드의 왼쪽 최대치 도달 시
        if (move === 0) {
          // false 해제
          fixMode = false;
        }
        if (documentHeight >= sectionThreeTop && move <= convertPx.vw(-7800)) {
          fixMode = true;
        }

        if (move <= convertPx.vw(-7800) && fixMode) {
          $('header').addClass('black');
          $('#sectionThree').addClass('fix');
        } else if (move === 0 && !fixMode && documentHeight <= sectionThreeTop) {
          $('header').removeClass('black');
          $('#sectionThree').removeClass('fix');
        }
      }
    }
  }

  if ($('#sectionThree').hasClass('fix') && !hasOn) {
    window.addEventListener("mousewheel", onscrollw);
  }
  if (!$('#sectionThree').hasClass('fix') && hasOn) {
    window.removeEventListener("mousewheel", onscrollw);
  }
  window.addEventListener("mousewheel", fixAndFixEnd);
}

$(window).scroll(function () {
  mainScrollEvent();
})


// close
$('.close').on('click touchstart', function (e) {
  // 이벤트 버블링 방지
  e.stopPropagation();
  // contents-container 위로 올리기
  $('.contents-container.scroll').css({ 'transform': 'translateY(-150%)' });
  // 0.5초 후 contents-container display none
  setTimeout(() => {
    $('.contents-container.scroll').css({ 'display': 'none' });
    $('#sectionThree').addClass('fix');
    hasOn = false;
  }, 500);
  setTimeout(() => {
    // 1초 후 on 해제
    $('.contents-container').removeClass('on');
    hasOn = false;
  }, 1000);
})

// cursor 이벤트
function cursor(e) {
  var cursorBgEl = document.querySelector('#cursor-dot');
  var btnListItemEl = document.querySelectorAll('.contents-link a');

  function onMoveWindow(e) {
    var posX = e.clientX;
    var posY = e.clientY;

    gsap.killTweensOf(cursorBgEl);
    gsap.to(cursorBgEl, { top: posY, left: posX, duration: 0.2 });
  }

  function onEnterBtnListItemEl() {
    if (!cursorBgEl.classList.contains('active')) {
      cursorBgEl.classList.add('active');
    }
  }

  function onLeaveBtnListItemEl() {
    if (cursorBgEl.classList.contains('active')) {
      cursorBgEl.classList.remove('active');
    }
  }

  // imageBox 영역에 cursor가 들어올 경우, 실행시키는 이벤트
  function mouseCursorEvent() {
    window.addEventListener('mousemove', onMoveWindow);
    for (var i = 0; i < btnListItemEl.length; i++) {
      btnListItemEl[i].addEventListener('mouseenter', onEnterBtnListItemEl);
      btnListItemEl[i].addEventListener('mouseleave', onLeaveBtnListItemEl);
    }
  }

  mouseCursorEvent();
}

window.addEventListener("mousemove", cursor);