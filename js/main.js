var isMobile = function() {
    return (/iPad|iPod|iPhone|Android/).test(navigator.userAgent) || document
        .location.hash == "#ipad";
}
var isPhone = function() {
    return isMobile() && window.innerWidth < 768;
}
if (isMobile()) {
    document.documentElement.className = document.documentElement.className +
        " ios";
}
/* ****************************************************
*  array of functions added throught page which should be called at the end of page parsing with "await"  
*  function which is called at the bottom of the page
/*********************************************************/
(function() {
    var defers = [];
    defer = function(f) {
        defers.push(f);
    };
    await = function() {
        defers.forEach(function(f, s) {
            f();
        });
    };
})();
/*    ****************************************************
 *  collecting navigation sections and it's markers
 *  binding click events on anchors and navigation section on resize and scroll
 *********************************************************
 */
defer(function() {
    var anchor = d3.selectAll(".internal-navigation").on("click",
            clicked),
        marker = d3.selectAll(".navigation-marker"),
        markerOffsets;
    d3.select(".navigation-headline").on("click", clicked);
    d3.select(window).on("resize.navigation", resized).on(
        "load.navigation", resized).on("scroll.navigation",
        scrolled);
    resized();

    function resized() {
        markerOffsets = marker.datum(function(d, i) {
            return i ? this.offsetTop : 0;
        }).data();
        scrolled();
    }

    function scrolled() {
        var j = Math.max(0, Math.min(markerOffsets.length - 1, d3.bisectLeft(
            markerOffsets, pageYOffset + 80) - 1));
        anchor.classed("navigation-section--active", function(d, i) {
            return i === j;
        });
    }

    function clicked(d, i) {
        d3.event.preventDefault();
        d3.transition().duration(750).tween("scroll", function() {
            var offset = d3.interpolateNumber(pageYOffset,
                markerOffsets[i]);
            return function(t) {
                scrollTo(0, offset(t));
            };
        });
    }
});
/*    ****************************************************
 *  data hash for mobile devices , they use different images
 ********************************************************* -->
 */
var mobileImages = [{
    "type": "media",
    "file": "mobile_1024/4700__primrose.jpg",
    "section": 7,
    "slide": 1,
    "align": "left"
}, {
    "type": "media",
    "file": "mobile_1024/4701__primrose18.jpg",
    "section": 12,
    "slide": 1,
    "align": "center"
}, {
    "type": "media",
    "file": "mobile_1024/4702__julia7.jpg",
    "section": 14,
    "slide": 1,
    "align": "left"
}, {
    "type": "media",
    "file": "mobile_1024/4703__julia8.jpg",
    "section": 17,
    "slide": 1,
    "align": "center"
}, {
    "type": "media",
    "file": "mobile_1024/4704__nosiphiwo8.jpg",
    "section": 19,
    "slide": 1,
    "align": "left"
}, {
    "type": "media",
    "file": "mobile_1024/4705__nosiphiwo1.jpg",
    "section": 22,
    "slide": 1,
    "align": "left"
}, {
    "type": "media",
    "file": "mobile_1024/4706__nosiphiwo6.jpg",
    "section": 25,
    "slide": 1,
    "align": "center"
}];

function mobileReorient() {
        var height = window.innerHeight - 40;
        if (height > (720 * .59) && window.innerWidth < 768) height = (720 * .59);
        var firstVideo = document.querySelector(".video-sequence");
        if (firstVideo !== null && firstVideo.length) {
            firstVideo.querySelector(".video:first-of-type .video-container")[0]
                .style.height = height + "px";
            firstVideo.querySelector(".video:first-of-type .video-headline")[0]
                .style.height = height + "px";
        }
    }
    (function() {
        if (isMobile()) mobileReorient();
    })();
defer(function() {
    /* Only do if we're on iPad, iPhone or Android -- TG */
    if (!isMobile()) return false;
    var _mobile_assets = "media/images/";
    var _slideshow_assets = "media/slideshow/";
    d3.select(window).on("resize", mobileReorient).on("scroll",
        function() {
            d3.select(".navigation").classed("navigation-solid",
                window.scrollY > 350)
        });
    /*
      remove br from headlines
      add ios-loaded class to first video-sequence
      remove br from byline style
      we don't need this it's for map sequence

    */
    //  d3.select(".headline").html( d3.select(".headline").html().replace("<br>", " <br>") )
    d3.select(".video-sequence:first-of-type").classed("ios-loaded",
        true);
    //d3.select(".column .byline").html( d3.select(".column .byline").html().replace("<br>", " <br>") )
    //d3.select(".section:nth-child(7)").classed("map-sequence", true);
    /*
      scripts work with two devices phones and other devices like pads
      so it would 2 devices in the future phone and pad

      with small delay loop through hash 

      if device is phone then replace values with phone inner values
    */
    setTimeout(function() {
        mobileImages.forEach(function(image) {
            /* if device is phone then replace values with phone inner values */
            if (isPhone() && image.phone) {
                for (var i in image.phone) {
                    image[i] = image.phone[i];
                }
            }
            /* if device is phone then change path from 1024 to 640 */
            if (isPhone()) {
                if (image.file) image.file = image.file
                    .replace("mobile_1024",
                        "mobile_640");
            }
            /* on section missing stop here current loop */
            if (!image.section) return false;
            /* create path to image with fixed path and file name */
            if (image.type == "media") {
                image.url = _mobile_assets + image.file;
            } else if (image.type == "slideshow") {
                image.url = _slideshow_assets + image.file;
            }
            var container;
            /*  if slide number exicts 
          find container
          if type not (map && hide) change html to img tag with url
          if type not (hide) 
            if type map caption from file options without # (caption-)
            else caption- with first word of file options
          slide assign
        */
            if (image.slide) {
                if (image.type == "media") {
                    container = d3.select(
                        ".section:nth-child(" +
                        image.section +
                        ") .video:nth-of-type(" +
                        image.slide +
                        ") .video-container")
                    if (image.type != "map" && image.type !=
                        "hide") {
                        container.html("").append("img")
                            .attr("src", image.url);
                    }
                    if (image.type != "hide") {
                        var css;
                        if (image.type == "map") css =
                            "caption-" + image.file.replace(
                                "#", "");
                        else css = "caption-" + image.file
                            .match(/\/([\w-]+)/)[1];
                        d3.select(".section:nth-child(" +
                            image.section +
                            ") .video:nth-of-type(" +
                            image.slide +
                            ") .video-caption").classed(
                            css, true)
                    }
                    var slide = d3.select(
                        ".section:nth-child(" +
                        image.section +
                        ") .video:nth-of-type(" +
                        image.slide + ")");
                } else if (image.type == "slideshow") {
                    container = d3.select(
                        ".section:nth-child(" +
                        image.section +
                        ") .slideshow-wrapper");
                    if (container.select(
                        ".slideshow-images").empty()) {
                        var temp = container.append(
                            "div").attr("class",
                            "slideshow-container");
                        temp.append("div").attr("class",
                            "slideshow-images");
                    }
                    var tempImages = d3.select(
                        ".section:nth-child(" +
                        image.section +
                        ") .slideshow-wrapper .slideshow-container .slideshow-images"
                    );
                    caption = container.select(
                        ".slideshow-captions .slideshow-caption:nth-of-type(" +
                        image.slide + ")");
                    tempImages.append("img").attr("src",
                        image.url).attr("class",
                        "slideshow-image");
                }
            }
            /* aligning by options */
            if (image.align && image.type == "media") d3
                .select(".section:nth-child(" + image.section +
                    ") .video:nth-of-type(" + image.slide +
                    ") .video-caption").classed(image.align
                    .split(" ").map(function(dir) {
                        return "align-" + dir
                    }).join(" "), true)
            if (!image.hideRule && slide) slide.append(
                    "div").attr("class", "video-rule")
                /* if phone and map then replace tag */
            if (image.target == "map") {
                container = d3.select(
                    ".section:nth-child(" + image.section +
                    ") .map")
                var source = d3.select(".map-source").html();
                if (isPhone()) container.html(
                    "<div class='map-source'>" +
                    source + "</div>")
            }
            /* map-hide class it type hide */
            if (image.type == "media" && image.type ==
                "hide") slide.classed("map-hide", true)
            if (image.type == "media" && image.type ==
                "map") {
                container.html(container.html() + d3.select(
                    image.file).text())
            }
            /* add custom caption if specified */
            if (image.type == "media" && image.mobileCaption) {
                d3.select(".section:nth-child(" + image
                    .section +
                    ") .video:nth-of-type(" + image
                    .slide + ") .video-caption").html(
                    image.mobileCaption);
            }
            /* add src to image tag and if has diptych use it */
            if (image.type == "image") d3.select(
                ".section:nth-child(" + image.section +
                ") .image:nth-child(" + image.slide +
                ") img").attr("src", function(d) {
                return image.url;
            })
            if (image.type == "diptych") d3.select(
                ".section:nth-child(" + image.section +
                ") .image:nth-child(" + image.slide +
                ") img:nth-child(" + image.image +
                ")").attr("src", function(d) {
                return image.url;
            })
        })
    }, 200)
});
/* this scripts included when device is not mobile */
defer(function() {
    /* Just skip if we're on iPad, iPhone or Android -- TG */
    if (isMobile()) return false;
    var _video_assets = "media/video/processed/",
        _poster_assets = "media/video/poster/",
        _image_assets = "media/images/fullscreen/",
        _audio_assets = "media/audio/";
    var mute = false,
        muteVolume = "volume",
        fixRatio = 16 / 9,
        fixHeight = innerWidth / fixRatio,
        fixTop = Math.round((innerHeight - fixHeight) / 2),
        fadeTop = Math.max(200, fixTop),
        fadeBottom = Math.min(innerHeight - 200, fixTop + fixHeight),
        fade = d3.interpolateRgb("#000", "#fff");
    // var headline = d3.select(".navigation-headline");
    var scrollprompt = d3.select('.scroll-prompt');
    var sequence = d3.selectAll(".video-sequence").datum(function() {
        return {
            first: !this.previousElementSibling,
            audio: this.getAttribute("data-audio"),
            length: this.querySelectorAll(".video").length
        };
    }).call(d3.behavior.watch().on("scroll", sequencescrolled).on(
        "statechange", sequencestatechanged));
    sequence.filter(function(d) {
        return d.audio;
    }).append("audio").attr("src", function(d) {
        return _audio_assets + d.audio + ".mp3";
    }).property("loop", true);
    // Add for content to have audio track
    var section_content = d3.selectAll(".column").datum(function() {
        return {
            audio: this.getAttribute("data-audio")
        };
    }).call(d3.behavior.watch().on("scroll", sequencescrolled).on(
        "statechange", sequencestatechanged));
    section_content.filter(function(d) {
        return d.audio;
    }).append("audio").attr("src", function(d) {
        return _audio_assets + d.audio + ".mp3";
    }).property("loop", true);
    // content audio end
    var section = d3.selectAll(".video").datum(function() {
        var previous = this.previousElementSibling,
            next = this.nextElementSibling;
        return {
            video: this.getAttribute("data-video"),
            animation: this.hasAttribute("data-animation"),
            loop: this.hasAttribute("data-videoloop"),
            first: !previous || !d3.select(previous).classed(
                "video"),
            last: !next || !d3.select(next).classed("video")
        };
    });
    var sectionFixed = sequence.selectAll(".video").each(function(d) {
        d.sequence = this.parentNode.__data__;
    }).call(d3.behavior.watch().on("scroll", fixscrolled).on(
        "statechange", fixstatechanged));
    var container = section.select(".video-container");
    var video = container.filter(function(d) {
        return d.video;
    }).append("video").attr("preload", "none").attr("poster",
        function(d) {
            return _poster_assets + d.video + ".jpg";
        }).property("loop", function(d) {
        return !d.animation;
    }).property("loop", function(d) {
        return d.loop;
    }).text("Your browser does not support this video.");
    video.append("source").attr("src", function(d) {
        return _video_assets + d.video + ".mp4";
    }).attr("type", "video/mp4");
    // video.append("source")
    //     .attr("src", function(d) { return _video_assets + d.video + ".webm"; })
    //     .attr("type", "video/webm");
    if (!supportsViewportUnits()) sectionFixed.append("div").style(
        "height", fixHeight + "px");
    var containerFixed = sectionFixed.select(".video-container").style(
        "z-index", function(d) {
            return d.first || d.last ? 1 : 2;
        }).style("position", function(d) {
        return d.first || d.last ? "absolute" : "fixed";
    }).style("top", function(d) {
        return d.first || d.last ? null : fixTop + "px";
    }).style("display", function(d) {
        return d.first || d.last ? null : "none";
    });
    containerFixed.select(function(d, i) {
        return d.sequence.length > 1 ? this : null;
    }).append("div").attr("class", "video-sequence-indicator").style(
        "margin-top", function(d) {
            return -d.sequence.length * 1.4 / 2 + "em";
        }).text(function(d, i) {
        return d3.range(d.sequence.length).map(function(j) {
            return i === j ? "●" : "○";
        }).join("\n");
    });
    var muteButton = d3.select(".navigation-volume").on("click", muted);
    d3.select(window).on("load.video", loaded).on("resize.video",
        resized);
    d3.select("video").attr("preload", "auto");
    resized();

    function loaded() {
        video.attr("preload", function(d) {
            return d.first ? "auto" : "none";
        });
    }

    function muted() {
        mute = !mute;
        muteVolume = mute ? "_volume" : "volume";
        muteButton.classed("navigation-volume--muted", mute);
        d3.event.preventDefault();
        d3.selectAll("audio,video").interrupt().property("volume",
            mute ? function() {
                this._volume = this.volume;
                return 0;
            } : function() {
                return this._volume;
            });
    }

    function resized() {
        fixHeight = innerWidth / fixRatio;
        fixTop = Math.round((innerHeight - fixHeight) / 2);
        fadeTop = Math.max(200, fixTop);
        fadeBottom = Math.min(innerHeight - 200, fixTop + fixHeight);
        d3.select(".video-sequence:first-child").style("margin-top",
            fixTop + "px");
        containerFixed.style("height", fixHeight + "px").filter(
            function(d) {
                var rect = this.parentNode.getBoundingClientRect();
                return d.first ? rect.top < fixTop : d.last ?
                    rect.bottom >= fixTop + fixHeight : true;
            }).style("top", fixTop + "px");
    }

    function fixscrolled(d) {
        if (d.first || d.last) {
            //!(d.first && d.last) && () for bug when media section has only one media
            var fixed = !(d.first && d.last) && ((d.first && d3.event
                .rect.top < fixTop) || (d.last && d3.event.rect
                .bottom >= fixTop + fixHeight));
            d3.select(this.querySelector(".video-container")).style(
                "z-index", fixed ? 2 : 1).style("position",
                fixed ? "fixed" : "absolute").style("top",
                fixed ? fixTop + "px" : null);
        }
        var section = d3.select(this),
            container = section.select(".video-container"),
            videoNode = this.querySelector(".video-container video"),
            volume = 1;
        var opacityTop = d3.event.rect.top - fixHeight / 4,
            opacity = opacityTop > fixTop + fixHeight * 4 / 5 ? 0 // previous video fully opaque
            : !d.last && opacityTop < fixTop - fixHeight ? 0 // next video fully covers this video
            : opacityTop < fixTop ? 1 // this video is fully opaque, but may be covered by next video
            : Math.max(0, Math.min(1, 1 - (opacityTop - fixTop) / (
                fixHeight / 5))); // this video is partially opaque
        if (d.first) {
            if (videoNode) {
                volume = d3.event.rect.top < fixTop + fadeTop ?
                    Math.max(0, Math.min(1, 1 - (d3.event.rect.top -
                        fixTop) / fadeTop)) : 0;
                var play = d3.event.rect.top <= fixTop + fadeTop;
                if (videoNode.paused) {
                    if (play && (!d.animation || (videoNode.currentTime <
                        videoNode.duration && volume > .8))) {
                        videoNode.play();
                    }
                } else if (!play) {
                    videoNode.pause();
                }
            }
            container.style("opacity", opacityTop >= fixTop -
                fixHeight ? 1 : 0);
        } else {
            container.style("opacity", opacity);
            if (videoNode) {
                if (videoNode.paused) {
                    if (opacity) {
                        if (!d.animation || (videoNode.currentTime <
                            videoNode.duration && opacity > .8)) {
                            videoNode.play();
                        }
                    } else if (videoNode.currentTime) {
                        videoNode.currentTime = 0;
                    }
                } else if (!opacity) {
                    videoNode.pause();
                    if (videoNode.currentTime) videoNode.currentTime =
                        0;
                }
            }
        }
        if (d.last) {
            if (videoNode) {
                volume = d3.event.rect.bottom < fadeBottom ? Math.max(
                    0, Math.min(1, 1 - (fadeBottom - d3.event.rect
                        .bottom) / fadeTop)) : 1;
                var play = d3.event.rect.bottom >= fadeBottom -
                    fadeTop;
                if (videoNode.paused) {
                    if (play && (!d.animation || (videoNode.currentTime <
                        videoNode.duration && volume > .8))) {
                        videoNode.play();
                    }
                } else if (!play) {
                    videoNode.pause();
                }
            }
        }
        section.select(".video-caption").style("opacity",
            opacityTop > fixTop ? (d.first ? 0.5 : Math.max(0,
                0.5 - (opacityTop - fixTop) / (fixHeight /
                    5))) // fade in from bottom
            : opacityTop > fixTop - fixHeight * 4 / 5 ? 0.7 // this video is fully opaque and not covered
            : d.last ? 0.5 : Math.max(0, (opacityTop - fixTop +
                fixHeight * 4 / 5) / (fixHeight / 5) + 0.5)); // fade out to top
        if (videoNode) {
            videoNode[muteVolume] = volume = volume !== 1 ? volume // special-case volume for first and last fade
                : opacityTop < fixTop - fixHeight ? 0 // video is fully covered by next video
                : opacityTop < fixTop - fixHeight / 2 ? Math.max(0,
                    Math.min(1, (opacityTop - fixTop + fixHeight) /
                        (fixHeight / 2))) : opacity;
            if (d.first && d.sequence.first) scrollprompt.style(
                "opacity", volume == 1 ? 1 : (volume - 0.7) > 0 ?
                (volume - 0.7) : 0);
            //if (d.first && d.sequence.first) headline.style("opacity", 1 - volume);
        }
    }

    function fixstatechanged(d) {
        d3.select(this.querySelector(".video-container")).style(
            "display", d3.event.state ? null : "none").select(
            "video").each(function() {
            if (!d3.event.state) {
                if (!this.paused) this.pause();
                if (this.currentTime) this.currentTime = 0;
            }
        });
        if (d.first && d.sequence.first && !d3.event.state)
            scrollprompt.style("opacity", 1);
        //if (d.first && d.sequence.first && !d3.event.state) headline.style("opacity", null);
    }

    function sequencescrolled() {
        var opacity = Math.max(0, Math.min(1, d3.event.rect.bottom <
            fadeBottom ? (fadeBottom - d3.event.rect.bottom) /
            fadeTop : d3.event.rect.top < fixTop + fadeTop ?
            (d3.event.rect.top - fixTop) / fadeTop : 1));
        // bug for column background change deny #if(){ data }
        if (!d3.select(this).classed("column")) {
            d3.select("body").style("background", fade(opacity));
        }
        d3.select(this).select("audio").property(muteVolume, 1 -
            opacity);
    }

    function sequencestatechanged() {
        var sequence = d3.select(this),
            audio = sequence.select("audio");
        if (d3.event.state) {
            sequence.selectAll("video").each(function() {
                this.preload = "auto";
            });
            audio.each(function() {
                this.play();
            });
        } else {
            d3.select("body").style("background", null);
            audio.each(function() {
                this.pause();
            });
        }
    }

    function supportsViewportUnits() {
        var element = d3.select("body").append("div").style("width",
                "50vw"),
            expected = innerWidth / 2,
            actual = parseFloat(element.style("width"));
        element.remove();
        return Math.abs(expected - actual) <= 1;
    }
});
defer(function() {
    if (isMobile()) return false;
    var assets = "media/slideshow/slideshow/";
    /*" + (innerWidth * (window.devicePixelRatio || 1) * .7 > 900 ? "large" : "medium") + "*/
    d3.selectAll(".slideshow").each(function() {
        var currentIndex = 0,
            playInterval;
        var watch = d3.behavior.watch().on("statechange.first",
            firststatechanged).on("statechange",
            statechanged);
        var slideshow = d3.select(this).select(
                ".slideshow-wrapper").on("mouseover", stopPlay)
            .on("mouseout", stopPlay).call(watch);
        var caption = slideshow.select(".slideshow-captions").selectAll(
            ".slideshow-caption").datum(function() {
            return {
                slug: this.getAttribute("data-slug")
            };
        }).classed("slideshow-caption--active", function(d,
            i) {
            return i === currentIndex;
        });
        var images = caption.data();
        var container = slideshow.insert("div",
            ".slideshow-captions").attr("class",
            "slideshow-container");
        var image = container.append("div").attr("class",
            "slideshow-images").selectAll(
            ".slideshow-image").data(images).enter().append(
            "img").attr("class", "slideshow-image");
        image.filter(function(d, i) {
            return i === currentIndex;
        }).classed("slideshow-image--active", true).attr(
            "src", function(d) {
                return assets + d.slug;
            }).each(moveToFront);
        container.append("div").attr("class",
            "slideshow-button slideshow-button--next").on(
            "click", function() {
                stopPlay();
                showNext();
            }).html(
            "<svg class='slideshow-button-arrow' width='45' height='59' viewBox='-13 -21 45 59'><path d='M3,1.008L20.742,9.045L3,17.083L6,8.917Z'></path></svg>"
        );
        container.append("div").attr("class",
            "slideshow-button slideshow-button--previous").on(
            "click", function() {
                stopPlay();
                showPrevious();
            }).html(
            "<svg class='slideshow-button-arrow' width='45' height='59' viewBox='-13 -21 45 59'><path d='M18.742,0.758L1,8.795L18.742,16.833L15.742,8.667Z'></path></svg>"
        );
        var thumb = container.insert("div",
            ".slideshow-captions").attr("class",
            "slideshow-thumbs").selectAll(
            ".slideshow-thumb").data(images).enter().append(
            "img").attr("class", function(d, i) {
            return "slideshow-thumb" + (i ===
                currentIndex ?
                " slideshow-thumb--active" : "");
        }).attr("src", function(d) {
            return "media/slideshow/thumbnail/" + d.slug;
        }).on("click", function(d, i) {
            stopPlay();
            show(i);
        });

        function firststatechanged() {
            if (d3.event.state) {
                image.attr("src", function(d, i) {
                    return assets + d.slug;
                });
                watch.on("statechange.first", null);
            }
        }

        function statechanged() {
            if (d3.event.state) startPlay();
            else stopPlay();
        }

        function startPlay() {
            if (!playInterval) playInterval = setInterval(
                showNext, 7000);
        }

        function stopPlay() {
            if (playInterval) playInterval = clearInterval(
                playInterval);
        }

        function show(index) {
            var oldImage = d3.select(image[0][currentIndex]),
                oldCaption = d3.select(caption[0][
                    currentIndex
                ]),
                oldThumb = d3.select(thumb[0][currentIndex]),
                newImage = d3.select(image[0][index]),
                newCaption = d3.select(caption[0][index]),
                newThumb = d3.select(thumb[0][index]);
            oldImage.classed("slideshow-image--active",
                false);
            oldCaption.classed("slideshow-caption--active",
                false);
            oldThumb.classed("slideshow-thumb--active",
                false);
            newImage.classed("slideshow-image--active",
                true).style("opacity", 0).each(
                moveToFront);
            newCaption.classed("slideshow-caption--active",
                true);
            newThumb.classed("slideshow-thumb--active",
                true);
            currentIndex = index;
            d3.timer(function() {
                newImage.style("opacity", null);
            }, 20);
        }

        function showNext() {
            show((currentIndex + 1) % images.length);
        }

        function showPrevious() {
            show((currentIndex ? currentIndex : images.length) -
                1);
        }
    });

    function moveToFront() {
        this.parentNode.appendChild(this);
    }
});
(function() {
    var watched = [];
    d3.behavior.watch = function() {
        var event = d3.dispatch("statechange", "scroll");

        function watch(selection) {
            selection.each(function(i) {
                watched.push({
                    element: this,
                    state: 0,
                    index: i,
                    event: event
                });
            });
        }
        return d3.rebind(watch, event, "on");
    };
    if (/iPhone|iPad|iPad|Android/.test(navigator.userAgent) || location.hash ==
        "#ipad") {
        d3.select(window).on("resize.watch", watch_scrolledStatic).on(
            "DOMContentLoaded.watch", watch_scrolledStatic);
    } else {
        d3.select(window).on("resize.watch", watch_scrolled).on(
            "scroll.watch", watch_scrolled).on("DOMContentLoaded.watch",
            watch_scrolled);
    }

    function watch_scrolled() {
        watched.forEach(function(watch) {
            var rect = watch.element.getBoundingClientRect();
            if (rect.top + rect.height < 0 || rect.bottom -
                rect.height - innerHeight > 0) {
                watch_state(watch, 0);
            } else {
                var t = rect.top / (innerHeight - rect.height);
                watch_state(watch, t < 0 || t > 1 ? 1 : 2);
                watch_dispatch(watch, {
                    type: "scroll",
                    offset: t,
                    rect: rect
                });
            }
        });
    }

    function watch_scrolledStatic() {
        watched.forEach(function(watch) {
            watch_state(watch, 1);
            watch_dispatch(watch, {
                type: "scroll",
                offset: .5,
                rect: {
                    top: 0
                }
            }); // XXX rect
        });
    }

    function watch_state(watch, state1) {
        var state0 = watch.state;
        if (state0 !== state1) watch_dispatch(watch, {
            type: "statechange",
            state: watch.state = state1,
            previousState: state0
        });
    }

    function watch_dispatch(watch, event) {
        var element = watch.element,
            sourceEvent = event.sourceEvent = d3.event;
        try {
            d3.event = event;
            watch.event[event.type].call(element, element.__data__,
                watch.index);
        } finally {
            d3.event = sourceEvent;
        }
    }
    await();
})();
