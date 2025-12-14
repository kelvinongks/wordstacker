var gm = (function () {
    'use strict';

    var winResize;
    var winOnload;
    var ratio = 1;

    var gCanvas;
    var gStage;
    var gRatio;
    var gOnResizeCallback = null;
    var gCurVoiceText = null;

    function init(canvas, onload, resize) {
        //console.log("gm init");
        gCanvas = canvas;
        gStage = new createjs.Stage(canvas);

        winOnload = onload;
        winResize = resize;

        window.addEventListener('resize', gm.resize, false);        
        $(document).ready(function () {
            // console.log("doc ready");
            winOnload();
        });
    }

    function viewport() {
        /*
        var e = window, a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return { width: e[a + 'Width'], height: e[a + 'Height'] };
        */

        var viewPortWidth;
        var viewPortHeight;

        // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
        if (typeof window.innerWidth !== 'undefined') {
            viewPortWidth = window.innerWidth,
                viewPortHeight = window.innerHeight
        }

        // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
        else if (typeof document.documentElement !== 'undefined'
            && typeof document.documentElement.clientWidth !=
            'undefined' && document.documentElement.clientWidth != 0) {
            viewPortWidth = document.documentElement.clientWidth,
                viewPortHeight = document.documentElement.clientHeight
        }

        // older versions of IE
        else {
            viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
                viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
        }
        return { width: viewPortWidth, height: viewPortHeight };

    }

    function resize() {        
        //var w = $(window).width();
        //var h = $(window).height();

        var w = viewport().width;
        var h = viewport().height;        

        var pRatio = window.devicePixelRatio
        //console.log("pRatio: " + pRatio);
        // 1280 / 960
        if (w / h > PAGE_WIDTH / PAGE_HEIGHT) {
            ratio = h / PAGE_HEIGHT;
        } else {
            ratio = w / PAGE_WIDTH;
        }
        var measuredWidth = w / ratio;                

        if (measuredWidth > 1280) {
            gCanvas.width = 1280;
        } else {
            gCanvas.width = measuredWidth;
        }        
        gRatio = ratio;
        if (!IsEmpty(gOnResizeCallback)) {
            gOnResizeCallback(ratio, { w: w, h: h });
        }        

        

        //var input = document.getElementById("inputContainer");
        //input.style.left = (w - (PAGE_WIDTH * ratio)) / 2 + "px";                
        //console.log("input.style.left: " + input.style.left);
        //console.log("canvas width: " + gCanvas.width);
        //console.log("canvas height: " + gCanvas.height);

        // gCanvas.style.left = (w - (PAGE_WIDTH * ratio)) / 2 + "px";                
        // gCanvas.style.height = (PAGE_HEIGHT * ratio) + "px";
        // gCanvas.style.top = (h - (PAGE_HEIGHT * ratio)) / 2 + "px";                
        // gStage.regX = -(gCanvas.width - PAGE_WIDTH) / 2;  
        // winResize();          
    }

    function onResize(callback) {
        gOnResizeCallback = callback        
    }

    function getRatio() {
        return gRatio;
    }

    function getViewportSize() {
        return {
            w: viewport().width, h: viewport().height
        };
    }

    function getStage() {
        return gStage;
    }

    function getCanvas() {
        return gCanvas;
    }

    function StopVoiceOver() {
        if (gCurVoiceText !== null) {
            gCurVoiceText.stop();
        }
    }


    // VO shape
    class VOShape {

        onPlaySegmentCallback;

        constructor(data, x, y, regX, regY, color, speech, speed, textEndTime, noClear) {
            this.container = new createjs.Container();
            this.color = color;
            this.shape = new createjs.Shape();
            this.shape.graphics.f(color).s().p(data);
            this.shape.setTransform(x, y, 1, 1, 0, 0, 0, regX, regY);

            this.mask = new createjs.Shape();
            this.mask.graphics.beginFill("red").drawRect(0, 0, 0, 100);
            this.mask.x = x;
            this.mask.y = y;
            this.mask.setBounds(0, -40, 0, 100);
            this.mask.width = -regX * 2;

            this.shapeOver = new createjs.Shape();
            this.shapeOver.graphics.f("#FF0000").s().p(data);
            this.shapeOver.setTransform(x, y, 1, 1, 0, 0, 0, regX, regY);
            this.shapeOver.mask = this.mask;

            this.speech = speech;
            this.speed = speed;
            this.textEndTime = textEndTime;
            this.tickHandler = this.tick.bind(this);
            this.isPlaying = false;
            this.nextMsgs = [];
            this.nextMsgIndex = 0;

            /*
            if(!IsEmpty(this.speech)){
                this.btnPlay = new createjs.Bitmap("images/btnPlay.png"); 
                this.btnPlay.cursor = "pointer";
                this.btnPlay.x = x - 50;
                this.btnPlay.y = y - 5;                            
                this.btnPlay.addEventListener("click", this.play.bind(this));
                this.container.addChild(this.btnPlay);
            }
            */

            this.nextMsgs.push({ mask: this.mask, speed: this.speed, textStartTime: 0, textEndTime: this.textEndTime, noClear: noClear });
            this.lastTextEndTime = textEndTime;

            this.container.addChild(this.shape);
            this.container.addChild(this.shapeOver);

            return this;
        }

        next(data, x, y, regX, regY, speed, textEndTime, noClear) {
            var shape = new createjs.Shape();
            shape.graphics.f(this.color).s().p(data);
            shape.setTransform(x, y, 1, 1, 0, 0, 0, regX, regY);

            var mask = new createjs.Shape();
            mask.graphics.beginFill("white").drawRect(0, 0, 0, 100);
            mask.x = x;
            mask.y = y;
            mask.width = -regX * 2;
            mask.setBounds(0, -40, 0, 80);

            var shapeOver = new createjs.Shape();
            shapeOver.graphics.f("#ff0000").s().p(data);
            shapeOver.setTransform(x, y, 1, 1, 0, 0, 0, regX, regY);
            shapeOver.mask = mask;

            this.nextMsgs.push({ mask: mask, speed: speed, textStartTime: this.nextMsgs[this.nextMsgs.length - 1].textEndTime, textEndTime: textEndTime, noClear: noClear });
            this.lastTextEndTime = textEndTime;

            this.container.addChild(shape);
            this.container.addChild(shapeOver);

            return this;
        }

        keyword(data, x, y, regX, regY, color) {
            var shape = new createjs.Shape();
            shape.graphics.f(color).s().p(data);
            shape.setTransform(x, y, 1, 1, 0, 0, 0, regX, regY);
            this.container.addChildAt(shape, this.container.numChildren - 1);
            return this;
        }

        stop() {
            // stop all sound
            createjs.Sound.stop();

            // remove listener
            if (this.isPlaying) {
                createjs.Ticker.removeEventListener("tick", this.tickHandler);
            }

            // clear all mask
            for (var i = 0; i < this.nextMsgs.length; ++i) {
                var mask = this.nextMsgs[i].mask;
                var bounds = mask.getBounds();
                mask.graphics.clear().beginFill("red").drawRect(bounds.x, bounds.y, 0, bounds.height); mask.setBounds(bounds.x, bounds.y, 0, bounds.height);
            }

            // reset 
            this.segmentEndTime = 0;
            this.isPlaying = false;

            // callback stopped segment
            if (!IsEmpty(this.onSegmentStop)) {
                this.onSegmentStop();
                this.onSegmentStop = null;
            }
        }

        play(onContinueNext, startTime) {
            this.onSentenceStop = null;
            this.onContinueNext = null;
            this.onSegmentStop = null;
            this.onTick = null;
            console.log("play starttime: " + startTime);
            // stop any playing sound
            if (!IsEmpty(gCurVoiceText)) {
                gCurVoiceText.stop();
            }
            this.nextMsgIndex = 0;
            this.mask = this.nextMsgs[0].mask;
            this.speed = this.nextMsgs[0].speed;
            this.textEndTime = this.nextMsgs[0].textEndTime;
            //this.textStartTime = this.nextMsgs[0].textStartTime;
            this.textStartTime = startTime;
            this.noClear = this.nextMsgs[0].noClear;
            this.onContinueNext = onContinueNext;

            createjs.Ticker.addEventListener("tick", this.tickHandler);
            this.soundInstance = createjs.Sound.play(this.speech);
            //this.soundInstance.position = 1;            
            this.soundInstance.position = startTime;

            if (startTime === 0) {
                this.soundInstance.position = 1;
            }

            gCurVoiceText = this;
            this.isPlaying = true;

            /*
            // only call this if click by user
            if(typeof this.onContinueNext !== "function"){                
                if(!IsEmpty(VOShape.onPlaySegmentCallback)){
                    VOShape.onPlaySegmentCallback();        
                }
            } 
            */
        }

        playSegment(startIndex, startTime, endTime, onSegmentStop) {
            this.onSentenceStop = null;
            this.onContinueNext = null;
            this.onSegmentStop = null;
            this.onTick = null;
            // stop any playing sound
            if (!IsEmpty(gCurVoiceText)) {
                gCurVoiceText.stop();
            }

            // auto set to endtime if -1
            if (endTime < 0) {
                endTime = this.nextMsgs[this.nextMsgs.length - 1].textEndTime;
            }
            this.segmentEndTime = endTime;
            this.nextMsgIndex = startIndex;
            this.mask = this.nextMsgs[startIndex].mask;
            this.speed = this.nextMsgs[startIndex].speed;
            this.textStartTime = startTime;
            this.textEndTime = this.nextMsgs[startIndex].textEndTime;
            this.noClear = this.nextMsgs[startIndex].noClear;
            this.onSegmentStop = onSegmentStop;

            createjs.Ticker.addEventListener("tick", this.tickHandler);
            this.soundInstance = createjs.Sound.play(this.speech);
            this.soundInstance.position = startTime;

            if (startTime === 0) {
                this.soundInstance.position = 1;
            }

            var textStartTime = this.nextMsgs[this.nextMsgIndex].textStartTime;
            var textEndTime = this.nextMsgs[this.nextMsgIndex].textEndTime;

            this.percentOffsetX = (this.soundInstance.position - textStartTime) / (textEndTime - textStartTime);
            this.startOffsetX = this.percentOffsetX * this.mask.width;

            gCurVoiceText = this;
            this.isPlaying = true;
            if (!IsEmpty(VOShape.onPlaySegmentCallback)) {
                VOShape.onPlaySegmentCallback();
            }
        }

        playSeek(startIndex, startTime, endTime, onSentenceStop, onTick) {
            this.onSentenceStop = null;
            this.onContinueNext = null;
            this.onSegmentStop = null;
            this.onTick = null;
            // stop any playing sound
            if (!IsEmpty(gCurVoiceText)) {
                gCurVoiceText.stop();
            }

            // auto set to endtime if -1
            if (endTime < 0) {
                endTime = this.nextMsgs[this.nextMsgs.length - 1].textEndTime;
            }
            this.segmentEndTime = endTime;
            this.nextMsgIndex = startIndex;
            this.mask = this.nextMsgs[startIndex].mask;
            this.speed = this.nextMsgs[startIndex].speed;
            this.textStartTime = startTime;
            this.textEndTime = this.nextMsgs[startIndex].textEndTime;
            this.noClear = this.nextMsgs[startIndex].noClear;
            this.onSentenceStop = onSentenceStop;
            this.onTick = onTick;
            //console.log("onTick: " + onTick)
            createjs.Ticker.addEventListener("tick", this.tickHandler);
            this.soundInstance = createjs.Sound.play(this.speech);
            this.soundInstance.position = startTime;

            if (startTime === 0) {
                this.soundInstance.position = 1;
            }

            var textStartTime = this.nextMsgs[this.nextMsgIndex].textStartTime;
            var textEndTime = this.nextMsgs[this.nextMsgIndex].textEndTime;

            this.percentOffsetX = (this.soundInstance.position - textStartTime) / (textEndTime - textStartTime);
            this.startOffsetX = this.percentOffsetX * this.mask.width;

            gCurVoiceText = this;
            this.isPlaying = true;
            /*
            if(!IsEmpty(VOShape.onPlayCallback)){
                VOShape.onPlayCallback();        
            }
            */
        }

        pause() {
            if (!IsEmpty(this.soundInstance) && this.soundInstance.paused === false) {
                this.soundInstance.paused = true;
            }
        }

        resume() {
            if (!IsEmpty(this.soundInstance)) {
                this.soundInstance.paused = false;
            }
        }

        isPaused() {
            if (!IsEmpty(this.soundInstance) && this.soundInstance.paused) {
                return true;
            } else {
                false;
            }
        }

        tick(event) {
            if (!this.soundInstance.paused && this.isPlaying && !IsEmpty(this.textEndTime)) {
                if (this.segmentEndTime > 0) {

                    if (this.soundInstance.position >= this.segmentEndTime
                        || this.soundInstance.position === 0) {
                        this.segmentEndTime = 0;
                        this.startOffsetX = 0;
                        this.stop();
                        //console.log("sentence stop: " + this.onSentenceStop);
                        if (typeof this.onSentenceStop === "function") {
                            //var play = this.onSentenceStop;
                            //this.onSentenceStop = null;
                            this.onSentenceStop();
                            //play();
                            //play = null;

                        }

                    } else {
                        if (this.soundInstance.position >= this.textEndTime) {
                            this.startOffsetX = 0;
                            if (IsEmpty(this.noClear)) {
                                if (this.nextMsgIndex < this.nextMsgs.length) {
                                    for (var i = 0; i <= this.nextMsgIndex; ++i) {
                                        var mask = this.nextMsgs[i].mask;
                                        var bounds = mask.getBounds();
                                        mask.graphics.clear().beginFill("red").drawRect(
                                            bounds.x, bounds.y, 0, bounds.height);
                                        mask.setBounds(bounds.x, bounds.y, 0, bounds.height);
                                    }
                                }
                            }
                            this.nextMsgIndex++;
                            if (this.nextMsgIndex < this.nextMsgs.length) {
                                var next = this.nextMsgs[this.nextMsgIndex];
                                this.mask = next.mask;
                                this.speed = next.speed;
                                this.textStartTime = next.textStartTime;
                                this.textEndTime = next.textEndTime;
                                this.noClear = next.noClear;
                            }
                        }
                    }
                } else {
                    this.startOffsetX = 0;

                    if (this.soundInstance.position >= this.textEndTime
                        || this.soundInstance.position === 0) {
                        if (IsEmpty(this.noClear)) {
                            if (this.nextMsgIndex < this.nextMsgs.length) {
                                for (var i = 0; i <= this.nextMsgIndex; ++i) {
                                    var mask = this.nextMsgs[i].mask;
                                    var bounds = mask.getBounds();
                                    mask.graphics.clear().beginFill("red").drawRect(
                                        bounds.x, bounds.y, 0, bounds.height);
                                    mask.setBounds(bounds.x, bounds.y, 0, bounds.height);
                                }
                            }
                        }
                        this.nextMsgIndex++;
                        if (this.nextMsgIndex < this.nextMsgs.length) {
                            var next = this.nextMsgs[this.nextMsgIndex];
                            this.mask = next.mask;
                            this.speed = next.speed;
                            this.textStartTime = next.textStartTime;
                            this.textEndTime = next.textEndTime;
                            this.noClear = next.noClear;
                        } else {
                            this.stop();
                            if (typeof this.onContinueNext === "function") {
                                this.onContinueNext();
                                //this.onContinueNext = null;
                            }
                        }
                    }
                }
            }

            if (this.nextMsgIndex < this.nextMsgs.length) {
                var bounds = this.mask.getBounds();
                var textStartTime = this.nextMsgs[this.nextMsgIndex].textStartTime;
                var textEndTime = this.nextMsgs[this.nextMsgIndex].textEndTime;
                var percent = (this.soundInstance.position - textStartTime) / (textEndTime - textStartTime);
                //console.log("this.soundInstance.position: " + this.soundInstance.position);
                //console.log("this.soundInstance.position: ");
                if (typeof this.onTick === "function") {
                    this.onTick(this.soundInstance.position, this.nextMsgs[this.nextMsgIndex].textStartTime);
                }
                var speed = 1;
                if (this.startOffsetX > 0) {
                    percent = ((percent - this.percentOffsetX) / (1 - this.percentOffsetX));
                    bounds.width = this.mask.width * (1 - this.percentOffsetX) * percent * speed;
                    this.mask.graphics.clear().beginFill("red").drawRect(bounds.x + this.startOffsetX, bounds.y, bounds.width, bounds.height);
                } else {
                    bounds.width = this.mask.width * percent * speed;
                    this.mask.graphics.clear().beginFill("red").drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
                }

                this.mask.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);

                if (!IsEmpty(this.stage)) {
                    this.stage.update(event);
                }
            }
        }
    }

    return {
        init: init,
        resize: resize,
        getStage: getStage,
        getCanvas: getCanvas,
        getRatio: getRatio,
        getViewportSize: getViewportSize,
        onResize: onResize,
        StopVoiceOver: StopVoiceOver,
        VOShape: VOShape,
    };
})();


