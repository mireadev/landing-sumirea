function l(str) {
    console.log(str);
}

document.addEventListener('DOMContentLoaded', function () {
    //load video
    new Vidage('#video', 'Vidage--allow', true);

    //full-page.js horizontal scroll
    var allowRoundSliding = false;
    var isSliding = true;
    //@TODO test this with sliders on first page
    //@TODO add keyboard
    //@TODO fix floating menu navigation
    var pages = {};
    pages.lastPage = document.getElementsByClassName('section');
    pages.lastPageIndex = pages.lastPage.length;
    pages.lastPage = pages.lastPage[pages.lastPageIndex - 1];

    //full-page.js
    $(document).ready(function () {
        $('#main').fullpage({
            anchors: [
                'video-section',
                'about',
                //'history',
                //'people',
                'movements',
                'projects',
                'contact'
            ],
            navigation: true,
            navigationPosition: 'right',
            navigationTooltips: [
                '',
                'Об организации',
                //'История',
                //'Люди',
                'Подразделения',
                'Проекты',
                'Контакты'
            ],
            showActiveTooltip: false,
            slidesNavigation: true,
            slidesNavPosition: 'bottom',
            onLeave: function (index, nextIndex, direction) {
                if (checkSlideScroll(index, nextIndex, direction)) {
                    return false;
                }
            },
            afterSlideLoad: function () {
                isSliding = true;
            },
            afterLoad: function (anchorLink, index) {
                isSliding = true;

                //check if we move to last page
                if (index === pages.lastPageIndex) {
                    bindWheel(window, moveSlideOnLastPage);
                } else {
                    //check if we move out from last page
                    if (index < pages.lastPageIndex) {
                        unbindWheel(window, moveSlideOnLastPage);
                    }
                }
            }
        });

        //bind next slide btns
        $('.next-slide').on('click', function(){
            $.fn.fullpage.moveSlideRight();
        });
    });

    function checkSlideScroll(index, nextIndex, direction) {
        // find this section
        var section = document.getElementsByClassName('section')[index - 1];
        // check if we have slider on it
        if (section.classList.contains('slider')) {
            if (isSliding) {
                isSliding = !isSliding;

                //get amount of slides
                var slides = {};
                slides.all = section.getElementsByClassName('slide');
                slides.amount = slides.all.length;
                slides.arr = [];
                for (var i = 0; i < slides.amount; i++) {
                    slides.arr.push(slides.all[i]);

                    //get active slide
                    if (slides.all[i].classList.contains('active')) {
                        slides.active = slides.all[i];
                        slides.activeIndex = i;
                    }
                }

                l(direction + ' ' + slides.activeIndex + ' ' + (slides.amount - 1))
                //get direction
                switch (direction) {
                    case 'up':
                        if (slides.activeIndex === 0) {
                            //it's first slide, so move up to previous page
                            $.fn.fullpage.moveSectionUp();
                            return true;
                        } else {
                            $.fn.fullpage.moveSlideLeft();
                            return true;
                        }
                        break;
                    case 'down':
                        //check if it's last slide and not last page
                        if (slides.activeIndex === slides.amount - 1 && index !== pages.lastPageIndex) {
                            //it's last slide, so move up to next page
                            $.fn.fullpage.moveSectionDown();
                            return true;
                        } else {
                            //check if it is last slide on last page and we don't want it to scroll to first slide
                            if ((slides.activeIndex + 1) !== slides.amount || allowRoundSliding) {
                                $.fn.fullpage.moveSlideRight();
                            }else{
                                //dirty hack to prevent scrolling to upper page
                                $.fn.fullpage.moveTo(pages.lastPageIndex, slides.activeIndex);
                            }
                            return true;
                        }
                        break;
                }
            }
        }
        return false;
    }

    //bind moveslide on last page
    function moveSlideOnLastPage(e) {
        e = e || window.event;
        var delta = e.deltaY || e.detail || e.wheelDelta;
        var direction = "up";

        if (delta > 0) {
            direction = "down";
        }

        checkSlideScroll(pages.lastPageIndex, null, direction);
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    }

    //bind wheel event
    function bindWheel(el, cb) {
        if (el.addEventListener) {
            if ('onwheel' in document) {
                // IE9+, FF17+, Ch31+
                el.addEventListener("wheel", cb);
            } else if ('onmousewheel' in document) {
                // deprecated
                el.addEventListener("mousewheel", cb);
            } else {
                // Firefox < 17
                el.addEventListener("MozMousePixelScroll", cb);
            }
        } else { // IE8-
            el.attachEvent("onmousewheel", cb);
        }
    }

    //unbind wheel event
    function unbindWheel(el, cb) {
        if (el.removeEventListener) {
            if ('onwheel' in document) {
                // IE9+, FF17+, Ch31+
                el.removeEventListener("wheel", cb);
            } else if ('onmousewheel' in document) {
                // deprecated
                el.removeEventListener("mousewheel", cb);
            } else {
                // Firefox < 17
                el.removeEventListener("MozMousePixelScroll", cb);
            }
        } else { // IE8-
            el.detachEvent("onmousewheel", cb);
        }
    }














    
    //generate colors for sections
    function getSectionBg(color) {
        return Please.make_color({
            base_color: color, //set your base color
            colors_returned: 1,
            hue: .001, //set your hue manually
            saturation: .9 //set your saturation manually
        });
    }

    function getColorSheme(color) {
        return Please.make_scheme(Please.NAME_to_HSV(color), {
            scheme_type: 'analogous', //set scheme type
            format: 'rgb-string' //give it to us in rgb
        });
    }

    var c = ['plum', 'salmon', 'lightblue', 'skyblue'];
    var cc = c[getRandomInt(0, c.length)];
    var colors = getColorSheme(cc);

    var sections = document.getElementsByClassName('section');
    var i = 1;
    while (i < sections.length) {
        sections[i].style.background = "#FAFAFA"; //colors[i]; //;//getSectionBg('aliceblue');
        i++;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
});