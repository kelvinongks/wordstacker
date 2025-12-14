
(function (cjs, playActivity) {
    var libs = {};
    var imgs = {};
    var curFrame = 0;
    var pages = [];    

    // globals
    var gAudioInstance = null;
    var gEffectInstance = null;
    var gMusicInstance = null;
    var gLocalMusicInstance = null;
    var gTimeoutInstances = [];
    var gMusicSetting = { vol: 0, volDefault: 0.7 };
    var gEffectSetting = { vol: 0, volDefault: 1 };
    var gParentActivity = null;

    // flags
    var gIsDevelopment = true;
    var gNoTracking = true;    

    // constants
    const TIMER_DURATION_SEC = 5400;
    const FONT_PAGE_HEADER = "700 70px Noto Sans SC";
    const FONT_PAGE_DESCRIPTION = "700 55px Noto Sans SC";   

    (libs.activity = function () {
        var activity = this;
        gParentActivity = activity;

        // menu panel
        // 0, 0
        //this.menuPanel = new libs.createMenuPanel(this, -340, 0);
        //this.menuPanel.visible = false;

        // video panel
        this.videoPanel = new libs.createVideoPanel();

        // music control
        this.musicControl = new libs.createMusicControl(1224, 52);

        // splash panel
        this.splashPanel = new libs.createSplashPanel();        

        // keyboard panel
        //this.kepboardPanel = new libs.createKeyboardPanel();        

        // user data
        this.userData = {
            userProfile: { name: "", school: "", charType: CHARACTER_TYPE.PLAYER_FEMALE },
            //badges: [BADGE_TYPE.BADGE_01, BADGE_TYPE.BADGE_02, BADGE_TYPE.BADGE_03, BADGE_TYPE.BADGE_04, BADGE_TYPE.BADGE_05],
            badges: []            
        };                        

        this.imageLoader = new createjs.DOMElement(document.getElementById('imageLoader'));
        this.imageLoader.htmlElement.style.setProperty("display", "none");
        this.imageLoader.callback = null;

        function handleImage(e) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var img = new Image();
                img.onload = function () {
                    if (!IsEmpty(activity.imageLoader.callback)) {
                        activity.imageLoader.callback(img);
                    }
                }
                img.src = event.target.result;
            }
            try {
                reader.readAsDataURL(e.target.files[0]);
            } catch (e) {
                //
            }            
        }
        this.imageLoader.htmlElement.addEventListener('change', handleImage, false);
        this.imageLoader.htmlElement.addEventListener('click', function () { this.value = null });

        // content	    
        this.content = new libs.createContent(this);

        this.addChild(this.content, this.videoPanel, this.musicControl);

        //console.log("content: " + this.content);

    }).prototype = new cjs.Container();

    // create content
    (libs.createContent = function (parent) {
        var clip = new cjs.MovieClip();
        clip.name = "content";
        clip.parent = parent;
        clip.setTransform(0, 0, 1, 1, 0, 0, 0, 0, 0);

        // timeline functions:
        var frame_0 = function () {
            clip.stop()
        }

        clip.timeline.addTween(cjs.Tween.get(this).call(frame_0).wait(1));

        // pages
        // 0

        var splashPage01 = new libs.createPage(clip, null, -1, PAGE_INDEX.SPLASH_01, 1, function (page) {
            page.addContent(new libs.contentSplashPage01(page));
        });

        var openingPage01 = new libs.createPage(clip, null, -1, PAGE_INDEX.OPENING_01, 1, function (page) {
            page.addContent(new libs.contentOpeningPage01(page));
        });

        var activityPage01 = new libs.createPage(clip, null, -1, PAGE_INDEX.ACTIVITY_01, 1, function (page) {
            page.addContent(new libs.contentActivityPage01(page));
        });

        clip.timeline.addTween(cjs.Tween.get({})
            .to({ state: [{ t: splashPage01 }] })            
            //.to({ state: [{ t: activityPage01 }] })
            .to({ state: [{ t: openingPage01 }] }, 1)
            .to({ state: [{ t: activityPage01 }] }, 1)
            .wait(1));

        return clip;
    });

    // create page
    (libs.createPage = function (parent, imgBg, prevIndex, currIndex, nextIndex, callback) {
        var page = new createjs.Container();
        page.parent = parent;

        var activity = parent.parent;
        var topHeaderBar = null;
        var menuHeaderBar = null;
        var btnNextCallback = null;
        var btnBackCallback = null;
        var btnInventoryCallback = null;
        var btnInventoryOnClose = null;        
        var isMenuHidden = false;

        page.currIndex = currIndex;

        page.hideMenu = function () {
            isMenuHidden = true;
        }

        page.showMenuNavigationBtns = function (isVisible) {
            activity.menuPanel.getMenuBtn().visible = isVisible;
            //btnProceed.visible = isVisible;
            //btnBack.visible = isVisible;
        }

        page.hideNavigation = function () {
            //btnProceed.visible = false;
            //btnBack.visible = false;
            //bottomBar.visible = false;
        }

        page.hideBtnBack = function () {
            //btnBack.visible = false;
        }

        page.hideBtnNext = function () {
            //btnProceed.visible = false;
            //btnBack.x = PAGE_WIDTH - 80;
        }

        page.showBtnNext = function () {
            /*
            if (!btnProceed.visible) {
                btnProceed.visible = true;
            }
            */
        }

        page.showBtnBack = function () {
            /*
            if (!btnBack.visible) {
                btnBack.visible = true;
            }
            */
        }

        page.disableBtnNext = function () {
            //btnProceed.disable();
        }

        page.enableBtnNext = function (extra) {
            //btnProceed.enable(extra);
        }

        page.overrideBtnNext = function (callback) {
            btnNextCallback = callback;
        }

        page.overrideBtnBack = function (callback) {
            btnBackCallback = callback;
        }

        page.btnNextText = function (text) {
            //btnProceed.setText(text);
        }

        page.btnNextSubmit = function (callback) {
            btnNextCallback = callback;
            //btnProceed.setSubmit();
        }

        page.btnNextRevert = function (callback) {
            //btnProceed.revert();
            btnNextCallback = callback;
        }

        page.getContainer = function () {
            return page;
        }

        page.getBtnBack = function () {
            //return btnBack;
        }

        page.getBtnNext = function () {
            //return btnProceed;
        }

        page.setBtnNextBackImages = function (imgNext, imgBack) {
           // btnProceed.setImage(imgNext);
            //btnBack.setImage(imgBack);
        }

        page.setUnitLogoTextColor = function (color) {
            unitLogo.setTextColor(color);
        }

        page.showInventoryBtn = function (callback, onClose) {
            // inventory Disabled
            if (ENABLE_INVENTORY) {
                btnInventory.visible = true;
                btnInventoryCallback = callback;
                btnInventoryOnClose = onClose;
            }
        }

        page.hideBottomBar = function () {
            //bottomBar.visible = false;
        }

        page.setBottomBarColor = function (color) {
            //libs.setFilters(bottomBar, color);
        }

        page.jumpTo = function (nextIndex, extra) {
            // force close any collection panel
            //activity.collectionPanel.slideOut(true);            
            if (pages[parent.currentFrame].content.stop) {
                pages[parent.currentFrame].content.stop();
            }
            parent.gotoAndStop(nextIndex);            

            // play page animation              
            pages[nextIndex].play();

            if (pages[nextIndex].content.play) {
                pages[nextIndex].content.play(extra);
            }
        }

        page.backTo = function (prevIndex) {
            // force close any collection panel
            //activity.collectionPanel.slideOut(true);

            if (pages[parent.currentFrame].content.stop) {
                pages[parent.currentFrame].content.stop();
            }
            parent.gotoAndStop(prevIndex);

            parent.parent.headerPanel.updatePowerBtn();

            // play page animation
            //pages[prevIndex].play();
            pages[prevIndex].back();
            if (pages[prevIndex].content.back) {
                pages[prevIndex].content.back();
            }
        }

        page.play = function () {
            if (!IsEmpty(topHeaderBar)) {
                topHeaderBar.y = -80;
                createjs.Tween.get(topHeaderBar, { override: true }).to({ y: -10 }, 200);
            }
            //activity.menuPanel.visible = IsEmpty(menuHeaderBar) ? false : true;
        }

        page.back = function () {
            activity.menuPanel.visible = IsEmpty(menuHeaderBar) ? false : true;
        }

        page.addContent = function (content, iconType, title, width, headerText, extra) {
            if (!IsEmpty(content.addBefore)) {
                page.addChild(content.addBefore());
            }

            if (!IsEmpty(headerText)) {
                page.addChild(topHeaderBar = createTopHeaderBar(headerText, width, extra));
            }
            //page.addChild(createUnitLogo());
            if (!IsEmpty(content)) {
                page.content = content;
                page.addChild(content);
            }

            //if (!IsEmpty(title)) {
            if (!isMenuHidden) {
                page.addChild(menuHeaderBar = createMenuHeaderBar(iconType, title, width, extra));
            }
            page.addChild(/*createUnitLogo()*/unitLogo);
            //var bottomBar = new cjs.Shape(new cjs.Graphics().beginFill("#1E2650").drawRect(0, 0, PAGE_WIDTH, 60));
            //bottomBar.setTransform(0, PAGE_HEIGHT, 1, 1, 0, 0, 0, 0, 60);

            //page.addChild(bottomBar);

            if (!IsEmpty(content.addLast)) {
                page.addChild(content.addLast());
            }

            //page.addChild(btnBack);
            //page.addChild(btnProceed);
            page.addChild(btnInventory);

            if (!IsEmpty(content.addPageLast)) {
                page.addChild(content.addPageLast());
            }
        }

        page.getPage = function () {
            return page;
        }

        page.getBg = function () {
            if (!IsEmpty(bg)) {
                return bg;
            }
            return null;
        }

        // bg
        if (!IsEmpty(imgBg)) {
            var bg = new createjs.Bitmap(imgBg);
            page.addChild(bg);
        } else {
            var empty = new cjs.Shape(new cjs.Graphics().beginFill("#212121").drawRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT));
            page.addChild(empty);
        }

        var createTopHeaderBar = function (title, width, extra) {
            if (IsEmpty(title)) {
                title = "";
            }

            var header = new createjs.Container();
            header.setTransform(-10, -10);

            //var imgBg = new createjs.Shape(new createjs.Graphics().beginFill("#622232").drawRect(-10, -10, 1310, 100));
            var imgBg = new createjs.Shape(new createjs.Graphics().beginFill("#622232").moveTo(0, 0).lineTo(1160, 0).lineTo(1140, 90).lineTo(0, 90));
            var fontSize = 24;
            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.fontSize)) {
                    fontSize = extra.fontSize;
                }
            }
            var text = new cjs.Text(title, "500 " + fontSize + "px Noto Sans SC", "#fff8e0");
            text.setTransform(width + 25, 33);

            if (title.includes("\n")) {
                text.lineHeight = 30;
                text.y -= 13;
                if (!IsEmpty(extra)) {
                    if (!IsEmpty(extra.lineHeight)) {
                        text.lineHeight = extra.lineHeight;
                    }
                    if (!IsEmpty(extra.offsetY)) {
                        text.y += (extra.offsetY + 13);
                    }

                    if (!IsEmpty(extra.offsetX)) {
                        text.x += extra.offsetX;
                    }
                }
            }

            header.addChild(imgBg);
            header.addChild(text);

            header.shadow = new createjs.Shadow("rgba(0,0,0,0.4)", 0, 8, 24);
            return header;
        }

        var createMenuHeaderBar = function (iconType, title, width, extra) {
            if (IsEmpty(title)) {
                title = "";
            }
            if (IsEmpty(width)) {
                width = 340;
            }

            var iconMenuHeaderBar = null;
            var textMenuHeaderBar = null;

            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.menuHeaderBarIcon)) {
                    iconMenuHeaderBar = new createjs.Bitmap(extra.menuHeaderBarIcon);
                    iconMenuHeaderBar.setTransform(PAGE_WIDTH - 190, 35, 0.5, 0.5, 0, 0, 0, iconMenuHeaderBar.getBounds().width * 0.5, iconMenuHeaderBar.getBounds().height * 0.5)
                }
                if (!IsEmpty(extra.menuHeaderBarText)) {
                    textMenuHeaderBar = new cjs.Text(extra.menuHeaderBarText, "700 26px Noto Sans SC", "#4E342E");
                    textMenuHeaderBar.textAlign = "right";
                    textMenuHeaderBar.textBaseline = "middle";
                    textMenuHeaderBar.setTransform(PAGE_WIDTH - 250, 35);
                }

            }

            var header = new createjs.Container();
            header.setTransform(0, 0);

            if (!IsEmpty(iconType)) {
                var imgChapterBg = new createjs.ScaleBitmap(imgs.header_bar_chapter, new createjs.Rectangle(150, 0, 20, 90));
                imgChapterBg.setDrawSize(width, 80);
                //var imgChapterBg = new createjs.Bitmap(imgs.header_bar);
                //imgChapterBg.x -= 20;

                var imgIcon;
                var rotateX = 15;
                switch (iconType) {
                    case ICON_SUBJECT_TYPE.BOOK: {
                        imgIcon = imgs.icon_chapter;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.BULB: {
                        imgIcon = imgs.icon_bulb;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.PHONE: {
                        imgIcon = imgs.icon_phone;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.POSTCARD: {
                        imgIcon = imgs.icon_postcard;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.PENCIL: {
                        imgIcon = imgs.icon_color_pencil;
                        rotateX = 0;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.CHECKBOX: {
                        imgIcon = imgs.icon_checkbox;
                        rotateX = 0;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.CHESS: {
                        imgIcon = imgs.icon_chess;
                        rotateX = 0;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.VIDEO: {
                        imgIcon = imgs.icon_video;
                        rotateX = 0;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.STARS: {
                        imgIcon = imgs.icon_2stars;
                        rotateX = 0;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.STAR: {
                        imgIcon = imgs.icon_1star;
                        rotateX = 0;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.GAMEPAD: {
                        imgIcon = imgs.icon_gamepad;
                        rotateX = 15;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.SCOOTER_01: {
                        imgIcon = imgs.icon_color_scooter_01;
                        rotateX = 0;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.SCOOTER_02: {
                        imgIcon = imgs.icon_color_scooter_02;
                        rotateX = 0;
                        break;
                    }
                    case ICON_SUBJECT_TYPE.QUESTION: {
                        imgIcon = imgs.icon_question;
                        rotateX = 15;
                        break;
                    }
                }
                // header type icon
                var iconHeaderType = new createjs.Bitmap(imgIcon);
                iconHeaderType.setTransform(200, 40, 0.5, 0.5, rotateX, 0, 0, 48, 48)
                header.addChild(imgChapterBg);
                header.addChild(iconHeaderType);
            }

            /*
            var imgBg = new createjs.ScaleBitmap(imgs.header_bar_menu, new createjs.Rectangle(0, 0, 20, 80));
            imgBg.setDrawSize(160, 90);            
            header.addChild(imgBg);            
            */

            // right icon
            var iconRight = new createjs.Bitmap(imgs.icon_caret_right);
            iconRight.setTransform(10, 20, 0.75, 0.75, 0, 0, 0, 0, 0)
            //iconRight.filters = [new createjs.ColorFilter(0, 0, 0, 1, 0, 0, 0, 0)];
            //iconRight.cache(0, 0, 48, 48);
            //libs.setFilters(iconRight, "#FFFFFF");

            // subject
            var textSubject = new cjs.Text(title, "700 32px Noto Sans SC", "#FFC7C6");
            textSubject.textBaseline = "middle";
            textSubject.setTransform(245, 40);

            //header.addChild(iconMenu);
            header.addChild(iconRight);
            if (!IsEmpty(iconMenuHeaderBar)) {
                header.addChild(iconMenuHeaderBar);
            }
            if (!IsEmpty(textMenuHeaderBar)) {
                header.addChild(textMenuHeaderBar);
            }
            header.addChild(textSubject);

            //header.shadow = new createjs.Shadow("rgba(0,0,0,0.4)", 0, 8, 24);
            //header.cache(0, 0, PAGE_WIDTH + 20, 120);
            return header;
        }

        var createBottomBar = function () {
            //var bottomBar = new cjs.Shape(new cjs.Graphics().beginFill("#4A265F").drawRect(0, 0, PAGE_WIDTH, 60));
            var bottomBar = new cjs.Bitmap(imgs.footer_bar);
            if (!IsEmpty(bottomBar)) {
                bottomBar.setTransform(PAGE_WIDTH, PAGE_HEIGHT, 1, 1, 0, 0, 0, bottomBar.getBounds().width, bottomBar.getBounds().height);
            }            
            //libs.setFilters(bottomBar, "#60C0E8");            
            //bottomBar.shadow = new libs.createShadow(SHADOW_TYPE.PANEL);
            return bottomBar
        }

        var createInventoryBtn = function () {
            var btn = new cjs.Bitmap(imgs.icon_backpack);
            btn.setTransform(PAGE_WIDTH - 240, 50, 1, 1, 15, 0, 0, 40, 50);
            btn.shadow = new libs.createShadow(SHADOW_TYPE.BUTTON);
            btn.on("mouseover", function () {
                createjs.Tween.get(btn, { override: true }).to({ scaleX: 1.05, scaleY: 1.05 }, 100, createjs.Ease.quintInOut);
            });
            btn.on("mouseout", function () {
                createjs.Tween.get(btn, { override: true }).to({ scaleX: 1, scaleY: 1 }, 100, createjs.Ease.quintInOut);
            });
            btn.on("click", function () {
                if (!IsEmpty(btnInventoryCallback)) {
                    btnInventoryCallback();
                }
                if (!IsEmpty(btnInventoryOnClose)) {
                    activity.inventoryPanel.onClose(btnInventoryOnClose);
                }

                activity.inventoryPanel.show();

            });
            btn.cursor = "pointer";
            btn.visible = false;
            return btn
        }



        // btn proceed
        var createProceedBtn = function () {
            var btn = new createjs.Container();
            btn.mouseChildren = false;
            var isDisabled = false;
            var proceedExtra = null;

            btn.setImage = function (pic) {
                //imgBg.image = pic;
            }

            btn.disable = function () {
                isDisabled = true;
                btn.scaleX = btn.scaleY = 1;
                btn.cursor = "default";
                title.color = "#cccccc";
                command.style = "#5C8278";

                libs.setFilters(icon, "#cccccc");
                //imgBg.uncache();
                //imgBg.image = imgs.button_next_disabled;
                //imgBg.filters = [new createjs.ColorFilter(0, 0, 0, 1, 214, 214, 214, 0)];
                //imgBg.updateCache();

                //imgBg.cache(-20, -20, imgBg.getBounds().width + 20, imgBg.getBounds().height + 20);
                //imgBg.cache(-20, -20, 235, 112);
                //imgBg.updateCache();
            }

            btn.enable = function (extra) {
                isDisabled = false;
                btn.cursor = "pointer";
                title.color = "#ffffff";
                command.style = "#467AAA";
                libs.setFilters(icon, "#FFFFFF");

                //imgBg.filters = [new createjs.ColorFilter(0, 0, 0, 1, 255, 255, 255, 0)];
                //imgBg.updateCache();
                //imgBg.uncache();
                //imgBg.image = imgs.icon_chevron_right;
                //imgBg.cache(-20, -20, imgBg.getBounds().width + 20, imgBg.getBounds().height + 20);
                //imgBg.cache(-20, -20, 235, 112);
                proceedExtra = extra
            }

            btn.setText = function (text) {
                title.text = text;
            }

            btn.setSubmit = function () {
                imgBg.uncache();
                imgBg.image = imgs.btn_submit;
                imgBg.cache(-20, -20, 235, 112);
                imgIcon.image = imgs.icon_submit;
                title.text = "提交";
            }

            btn.revert = function () {
                imgBg.uncache();
                imgBg.image = imgs.btn_continue;
                imgBg.cache(-20, -20, 235, 112);
                imgIcon.image = imgs.icon_chevron_right;
                title.text = "继续";
            }


            //var circle = new cjs.Shape(new cjs.Graphics().beginFill("#AC0D5002").drawCircle(0, 0, 30));
            //circle.setTransform(30, 30, 1, 1, 0, 0, 0, 30, 30);

            var icon = new cjs.Bitmap(imgs.icon_chevron_right);
            if (!IsEmpty(icon)) {
                icon.setTransform(55, 0, 0.75, 0.75, 0, 0, 0, icon.getBounds().width * 0.5, icon.getBounds().height * 0.5);
                libs.setFilters(icon, "#FFFFFF");
            }

            var imgBg = new cjs.Shape();
            var command = imgBg.graphics.beginFill("#467AAA").command;
            imgBg.graphics.moveTo(19, 0).lineTo(230, 0).lineTo(230, 80).lineTo(3, 80);
            imgBg.setTransform(0, 0, 1, 1, 0, 0, 0, 115, 40);
            imgBg.shadow = libs.createShadow(SHADOW_TYPE.PANEL);

            //var imgBg = new cjs.Shape(new cjs.Graphics().beginFill("#007E5C"));
            //var imgBg = new cjs.Shape();
            //var command = imgBg.graphics.beginFill("#007D7E").command;
            //imgBg.graphics.moveTo(19, 0).lineTo(230, 0).lineTo(230, 80).lineTo(3, 80);
            //imgBg.setTransform(0, 0, 1, 1, 0, 0, 0, 40, 40);            

            //var imgIcon = new createjs.Bitmap(imgs.icon_chevron_right);
            //imgIcon.setTransform(90, 0, 0.75, 0.75, 0, 0, 0, 24, 24);
            //imgIcon.filters = [new createjs.ColorFilter(0, 0, 0, 1, 225, 255, 134, 0)];
            //imgIcon.filters = [new createjs.ColorFilter(0, 0, 0, 1, 225, 255, 255, 0)];
            //imgIcon.cache(0, 0, 48, 48);

            btn.cursor = "pointer";
            btn.setTransform(PAGE_WIDTH + 10, PAGE_HEIGHT + 10, 1, 1, 0, 0, 0, 115, 40);
            btn.on("click", function () {
                if (isDisabled) return;

                // force close any collection panel
                //activity.collectionPanel.slideOut(true);

                // override callback if any
                if (!IsEmpty(btnNextCallback)) {
                    btnNextCallback();
                } else {
                    if (pages[parent.currentFrame].content.beforeNext) {
                        pages[parent.currentFrame].content.beforeNext();
                    }
                    if (pages[parent.currentFrame].content.stop) {
                        pages[parent.currentFrame].content.stop();
                    }
                    parent.gotoAndStop(nextIndex);
                    //console.log("nextIndex: " + nextIndex);

                    parent.parent.headerPanel.updatePowerBtn();

                    // play page animation                                
                    pages[nextIndex].play();

                    if (pages[nextIndex].content.play) {
                        pages[nextIndex].content.play(proceedExtra);
                        proceedExtra = null;
                    }
                }
                gm.getStage()._testMouseOver(true)
            });
            btn.addEventListener("mouseover", function () {
                if (isDisabled) return;
                //btn.y -= 5;
                createjs.Tween.get(btn, { override: true }).to({ y: PAGE_HEIGHT + 5 }, 100, createjs.Ease.quintInOut);
            });
            btn.addEventListener("mouseout", function () {
                if (isDisabled) return;
                //btn.y += 5;
                createjs.Tween.get(btn, { override: true }).to({ y: PAGE_HEIGHT + 10 }, 100, createjs.Ease.quintInOut);
            });

            var title = new cjs.Text("继续", "500 32px Noto Sans SC", /*"#e1ff86"*/"#FFFFFF");
            title.textAlign = "center";
            title.textBaseline = "middle";
            title.setTransform(-5, 0);
            //title.y -= 5;
            //imgIcon.y -= 5;

            /*
            var shadow = new cjs.Shape(new cjs.Graphics().beginFill("#ffffff").setStrokeStyle(3).beginStroke("#ffffff00")
                .moveTo(16, 0).lineTo(230, 0).lineTo(230, 80).lineTo(0, 80));
            shadow.setTransform(4, 0, 1, 1, 0, 0, 0, 115, 40);
            shadow.shadow = libs.createShadow(SHADOW_TYPE.BUTTON);
            */

            //btn.addChild(shadow);
            //btn.addChild(circle);            
            btn.addChild(imgBg);
            btn.addChild(icon);
            btn.addChild(title);
            //btn.addChild(imgIcon);            

            return btn;
        }

        // btn back        
        var createBackBtn = function () {
            var btn = new createjs.Container();
            btn.mouseChildren = false;

            btn.setImage = function (pic) {
                //imgBg.image = pic;
            }

            //var circle = new cjs.Shape(new cjs.Graphics().beginFill("#047766").drawCircle(0, 0, 30));
            //circle.setTransform(30, 30, 1, 1, 0, 0, 0, 30, 30);

            //var imgBg = new createjs.ScaleBitmap(imgs.btn_back, new createjs.Rectangle(40, 0, 20, 60));
            //var circle = new cjs.Shape(new cjs.Graphics().beginFill("#AC0D5002").drawCircle(0, 0, 30));
            //circle.setTransform(30, 30, 1, 1, 0, 0, 0, 30, 30);
            var icon = new cjs.Bitmap(imgs.icon_chevron_right);
            icon.setTransform(-35, -5, -0.625, 0.625, 0, 0, 0, icon.getBounds().width * 0.5, icon.getBounds().height * 0.5);
            libs.setFilters(icon, "#FFFFFF");

            var imgBg = new cjs.Shape();
            var command = imgBg.graphics.beginFill("#265076").command;
            imgBg.graphics.moveTo(19, 0).lineTo(230, 0).lineTo(230, 80).lineTo(3, 80);
            imgBg.setTransform(0, 0, 1, 1, 0, 0, 0, 115, 40);
            imgBg.shadow = libs.createShadow(SHADOW_TYPE.PANEL);

            //imgBg.filters = [new createjs.ColorFilter(0, 0, 0, 1, 237, 254, 62, 0)];
            //imgBg.cache(0, 0, imgBg.getBounds().width, imgBg.getBounds().height);
            //imgBg.setDrawSize(155, 60);
            //imgBg.shadow = libs.createShadow(SHADOW_TYPE.PANEL);
            //imgBg.cache(-20, -20, 210, 100);

            //imgBg.setTransform(0, 0, 1, 1, 0, 0, 0, 40, 40);
            //var imgIcon = new createjs.Bitmap(imgs.icon_chevron_right);
            //imgIcon.setTransform(0, 0, -0.625, 0.625, 0, 0, 0, 24, 24);
            //imgIcon.filters = [new createjs.ColorFilter(0, 0, 0, 1, 225, 255, 134, 0)];
            //imgIcon.filters = [new createjs.ColorFilter(0, 0, 0, 1, 225, 255, 255, 0)];
            //imgIcon.cache(0, 0, 48, 48);

            btn.cursor = "pointer";
            btn.setTransform(PAGE_WIDTH - 200, PAGE_HEIGHT + 10, 1, 1, 0, 0, 0, 100, 30);
            btn.on("click", function () {
                // force close any collection panel
                //activity.collectionPanel.slideOut(true);

                if (!IsEmpty(btnBackCallback)) {
                    btnBackCallback();
                } else {
                    if (pages[parent.currentFrame].content.stop) {
                        pages[parent.currentFrame].content.stop();
                    }
                    if (prevIndex < 0) {
                        window.location = MAIN_WIN_LOCATION;
                    } else {
                        parent.gotoAndStop(prevIndex);

                        parent.parent.headerPanel.updatePowerBtn();

                        // play page animation
                        //pages[prevIndex].play();
                        pages[prevIndex].back();
                        if (pages[prevIndex].content.back) {
                            pages[prevIndex].content.back();
                        }
                    }
                }
                gm.getStage()._testMouseOver(true)
            });
            btn.addEventListener("mouseover", function () {
                //btn.y -= 5;
                createjs.Tween.get(btn, { override: true }).to({ y: PAGE_HEIGHT + 5 }, 100, createjs.Ease.quintInOut);
            });
            btn.addEventListener("mouseout", function () {
                //btn.y += 5;
                createjs.Tween.get(btn, { override: true }).to({ y: PAGE_HEIGHT + 10 }, 100, createjs.Ease.quintInOut);
            });

            var title = new cjs.Text("返回", "500 28px Noto Sans SC", /*"#e1ff86"*/"#FFFFFF");
            title.textAlign = "center";
            title.textBaseline = "middle";
            title.setTransform(15, -5);

            //title.y -= 5;
            //imgIcon.y -= 5;

            btn.addChild(imgBg);
            btn.addChild(icon);
            btn.addChild(title);
            //btn.addChild(imgIcon);
            //btn.shadow = new createjs.Shadow("rgba(0,0,0,0.4)", 0, 8, 24);
            //btn.cache(-100, -80, 230, 120);
            return btn;
        }

        var createUnitLogo = function () {
            var width = 200;
            var height = 50;
            var container = new cjs.Container();
            container.setTransform(PAGE_WIDTH, 13, 1, 1, 0, 0, 0, width, 0);

            container.setTextColor = function (color) {
                title.color = color;
            }
            /*
            var imgBg = new createjs.ScaleBitmap(imgs.header_bar_unit, new createjs.Rectangle(25, 0, 5, 50));
            imgBg.setDrawSize(width, height);
            imgBg.cache(-20, -20, width + 40, height + 40);
            imgBg.shadow = libs.createShadow(SHADOW_TYPE.PANEL);            
            */

            var title = new cjs.Text("", "600 24px Noto Sans SC", TEXT_COLOR.DEFAULT);
            title.textAlign = "center";
            title.textBaseline = "middle";
            title.setTransform((width * 0.5) + 15, (height * 0.5) - 3);

            //container.addChild(imgBg);
            container.addChild(title);
            //container.addChild(imgBg2);
            //container.shadow = libs.createShadow(SHADOW_TYPE.PANEL);
            //container.cache(-20, -20, width + 40, height + 40);
            return container;
        }


        //var btnProceed = createProceedBtn();
        //var btnBack = createBackBtn();
        //var bottomBar = createBottomBar()
        var btnInventory = createInventoryBtn();
        var unitLogo = createUnitLogo();
        //var collectionPanel = activity.inventoryPanel.getCollectionPanel();

        //bottomBar.visible = false;

        if (!IsEmpty(callback)) {
            callback(page);
        }
        pages.push(page)
        return page;
    });

    // menu panel
    (libs.createMenuPanel = function(parent, x, y) {
        var container = new createjs.Container();
        container.parent = parent;
        container.setTransform(x, y);

        var menuItems = [];
        var isBusy = false;
        var onMenuOpenCallback = null;

        container.getMenuBtn = function() {
            return iconMenu;
        }

        container.onMenuOpen = function(callback) {
            onMenuOpenCallback = callback;
        }

        var slideMenu = function(index) {
            if (!isBusy) {
                isBusy = true;
                //var activity = parent;
                //activity.menuPanel.visible = false;

                // update active item                
                menuItems.forEach(function(item, index) {
                    item.showActive(parent.content.currentFrame);
                });

                if (container.x < 0) {
                    if (!IsEmpty(onMenuOpenCallback)) {
                        onMenuOpenCallback(true);
                    }
                    createjs.Sound.stop();
                    createjs.Tween.get(iconMenu, { override: true }).to({ x: 60 }, 200).call(function() {

                    });
                    createjs.Tween.get(bg, { override: true }).to({ alpha: 0.75 }, 200).call(function() {

                    });
                    createjs.Tween.get(container, { override: true }).to({ x: 0 }, 200).call(function() {
                        //console.log("opened!");
                        isBusy = false;
                    });
                } else {
                    if (!IsEmpty(onMenuOpenCallback)) {
                        onMenuOpenCallback(false, index);
                    }
                    createjs.Tween.get(iconMenu, { override: true }).to({ x: 190 }, 200).call(function() {

                    });
                    createjs.Tween.get(bg, { override: true }).to({ alpha: 0 }, 200).call(function() {

                    });
                    createjs.Tween.get(container, { override: true }).to({ x: -330 }, 200).call(function() {
                        //console.log("closed!");
                        isBusy = false;
                    });
                }
            }
        }

        var playSelectedItem = function(index) {
            slideMenu(index);
            if (pages[parent.content.currentFrame].content.stop) {
                pages[parent.content.currentFrame].content.stop();
            }
            parent.content.gotoAndStop(index);
            if (pages[index].content.play) {
                pages[index].content.play();
            }
        }

        var bg = new createjs.Shape(new createjs.Graphics().beginFill("rgba(0,0,0,0.75)").drawRect(0, 0, 1680, 960));
        bg.on("click", function() {
            slideMenu();
        });
        bg.alpha = 0;

        var sideMenuBg = new createjs.Shape(new createjs.Graphics().beginFill("#ECEEF0").drawRect(-10, -10, 340, 980));
        //var sideMenuBg = new cjs.Bitmap(imgs.panel_side_menu);
        sideMenuBg.setTransform(-10, -10);
        sideMenuBg.shadow = new createjs.Shadow("rgba(0,0,0,0.4)", 0, 8, 24);
        sideMenuBg.on("click", function() { });

        // btn menu close        
        var panelMenuClose = new createjs.Container();
        var iconMenu = new createjs.Bitmap(imgs.icon_menu);
        //iconMenu.setTransform(160, 0, 0.83, 0.83, 0, 0, 0, 0, 0);
        iconMenu.setTransform(200, /*48*/ 38, 0.83, 0.83, 0, 0, 0, 48, 48);
        iconMenu.shadow = new createjs.Shadow("rgba(0,0,0,0.4)", 0, 8, 24);
        iconMenu.cursor = "pointer";
        iconMenu.on("click", function() {
            slideMenu();
            createjs.Tween.get(iconMenu, { override: true }).to({ scaleX: 0.83, scaleY: 0.83 }, 100, createjs.Ease.quintInOut);
        });
        iconMenu.addEventListener("mouseover", function() {
            createjs.Tween.get(iconMenu, { override: true }).to({ scaleX: 0.88, scaleY: 0.88 }, 100, createjs.Ease.quintInOut);
        });
        iconMenu.addEventListener("mouseout", function() {
            createjs.Tween.get(iconMenu, { override: true }).to({ scaleX: 0.83, scaleY: 0.83 }, 100, createjs.Ease.quintInOut);
        });


        // left icon
        var iconLeft = new createjs.Bitmap(imgs.icon_caret_right);
        if (!IsEmpty(iconLeft)) {
            iconLeft.setTransform(10, 30, -0.75, 0.75, 0, 0, 0, 24, 24);
            iconLeft.filters = [new createjs.ColorFilter(0, 0, 0, 1, 0, 0, 0, 0)];
            iconLeft.cache(0, 0, 48, 48);
        }        

        panelMenuClose.setTransform(220, 10);
        panelMenuClose.addChild(iconMenu);
        panelMenuClose.addChild(iconLeft);

        var lineStyle = new createjs.Graphics().setStrokeStyle(2).beginLinearGradientStroke(
            ["rgba(38,50,56,1)", "rgba(38,50,56,0)"], [0.5, 1], 0, 150, 300, 150
        ).moveTo(0, 0).lineTo(330, 0);

        var line01 = new createjs.Shape(lineStyle);
        line01.setTransform(0, 100);

        //var line02 = line01.clone()
        //line02.setTransform(0, 550);

        //var textActivity = new cjs.Text("单元一\n写作指导", "700 24px Noto Sans SC", "#960A46");
        //textActivity.textBaseline = "middle";
        //textActivity.lineHeight = 35;
        //textActivity.setTransform(30, 40);
        var textActivity = libs.createCustomText(30, 50, "写作指导", { textColor: "#960A46", fontSize: 30 })

        var createHeader = function(x, y, msg, img, bgColor) {
            var container = new cjs.Container();
            container.setTransform(x, y);

            var bg = new cjs.Shape(new cjs.Graphics().beginFill(bgColor).drawRect(0, 0, 320, 30));
            var icon = new cjs.Bitmap(img);
            icon.setTransform(240, -15, 0.45, 0.45, 1, 1, 1, 0, 0);
            var text = new cjs.Text(msg, "700 22px Noto Sans SC", "#FFFFFF");
            text.textAlign = "right";
            //text.textBaseline = "middle";
            text.setTransform(230, 4);

            container.addChild(bg);
            container.addChild(icon);
            container.addChild(text);
            return container;
        }

        var textHeader01 = createHeader(0, 165, "", imgs.icon_color_2stars, "#FF7043");
        var textHeader02 = createHeader(0, 355, "", imgs.icon_color_3stars, "#EF5350");        

        //var textHeader01 = createHeader(0, 365, "初级");
        //var textHeader02 = createHeader(0, 515, "中级");
        //var textHeader03 = createHeader(0, 665, "高级");
        //var textHeader03 = createHeader(0, 600, "活动三");

        /*
        menuItems.push(new libs.createMenuItem("解读图表", ICON_SUBJECT_TYPE.BOOK, 120, 45, "#263238", [2, 4], function () {
            playSelectedItem(2);
        }));
        menuItems.push(new libs.createMenuItem("审题", ICON_SUBJECT_TYPE.BOOK, menuItems[menuItems.length - 1].nextPosY, 45, "#263238", [5, 7], function () {
            playSelectedItem(5);
        }));
        menuItems.push(new libs.createMenuItem("列提纲", ICON_SUBJECT_TYPE.CHECKBOX, menuItems[menuItems.length - 1].nextPosY, 45, "#263238", [8, 8], function () {
            playSelectedItem(8);
        }));
        */

        /*
        menuItems.push(new libs.createMenuItem("选择挑战难度", ICON_SUBJECT_TYPE.BOOK, 120, 50, "#263238", [2, 2], function () {
            playSelectedItem(2);
        }));
        */

        /*
        menuItems.push(new libs.createMenuItem("题目", ICON_SUBJECT_TYPE.BOOK, 115, 60, "#263238", [2, 2], function() {
            playSelectedItem(2);
        }));        
        menuItems.push(new libs.createMenuItem("审题", ICON_SUBJECT_TYPE.BOOK, menuItems[menuItems.length - 1].nextPosY, 60, "#263238", [3, 3], function() {
            playSelectedItem(3);
        }));
        menuItems.push(new libs.createMenuItem("在记叙时加入\n人物描写", ICON_SUBJECT_TYPE.CHECKBOX, menuItems[menuItems.length - 1].nextPosY, 70, "#263238", [4, 8], function() {
            playSelectedItem(4);
        }));
        menuItems.push(new libs.createMenuItem("表达感受", ICON_SUBJECT_TYPE.CHECKBOX, menuItems[menuItems.length - 1].nextPosY, 60, "#263238", [9, 9], function () {
            playSelectedItem(9);
        }));
        menuItems.push(new libs.createMenuItem("检查与修改", ICON_SUBJECT_TYPE.PENCIL, menuItems[menuItems.length - 1].nextPosY, 60, "#263238", [10, 10], function () {
            playSelectedItem(10);
        }));
        */
        /*
        menuItems.push(new libs.createMenuItem("如何详写", ICON_SUBJECT_TYPE.BOOK, menuItems[menuItems.length - 1].nextPosY, 50, "#263238", [13, 15], function() {
            playSelectedItem(13);
        }));
        
        menuItems.push(new libs.createMenuItem("审题", ICON_SUBJECT_TYPE.BOOK, 500, 35, "#263238", [8, 8], function() {
            playSelectedItem(8);
        }));
        
        menuItems.push(new libs.createMenuItem("小练笔", ICON_SUBJECT_TYPE.CHECKBOX, menuItems[menuItems.length - 1].nextPosY, 50, "#263238", [16, 18], function () {
            playSelectedItem(16);
        }));
        */
        /*
        menuItems.push(new libs.createMenuItem("选择材料", ICON_SUBJECT_TYPE.BOOK, menuItems[menuItems.length - 1].nextPosY, 35, "#263238", [17, 17], function () {
            playSelectedItem(17);
        }));
        */
        /*
        menuItems.push(new libs.createMenuItem("加入景物描写", ICON_SUBJECT_TYPE.CHECKBOX, menuItems[menuItems.length - 1].nextPosY, 35, "#263238", [18, 18], function() {
            playSelectedItem(18);
        }));
        
        menuItems.push(new libs.createMenuItem("活动（二）", ICON_SUBJECT_TYPE.SCOOTER_02, menuItems[menuItems.length - 1].nextPosY, 35, "#263238", [11, 11], function () {
            playSelectedItem(11);
        }));
        menuItems.push(new libs.createMenuItem("列提纲", ICON_SUBJECT_TYPE.CHECKBOX, menuItems[menuItems.length - 1].nextPosY, 35, "#263238", [12, 12], function () {
            playSelectedItem(12);
        }));
        */

        /*
        var textHeader01 = new cjs.Text("写明信片", "700 30px Noto Sans SC", "#263238");
        textHeader01.textBaseline = "middle";
        textHeader01.setTransform(30, 160);
        
        var textHeader02 = new cjs.Text("写短信", "700 30px Noto Sans SC", "#263238");
        textHeader02.textBaseline = "middle";
        textHeader02.setTransform(30, 530);
        */


        // start here
        /*
        menuItems.push(new libs.createMenuItem("题目", ICON_SUBJECT_TYPE.BOOK, 150, 60, "#3E2723", [2, 2], function () {
            playSelectedItem(2);
        }));
        menuItems.push(new libs.createMenuItem("审题", ICON_SUBJECT_TYPE.BOOK, menuItems[menuItems.length - 1].nextPosY, 60, "#3E2723", [3, 3], function () {
            playSelectedItem(3);
        }));
        menuItems.push(new libs.createMenuItem("选材", ICON_SUBJECT_TYPE.BOOK, menuItems[menuItems.length - 1].nextPosY, 90, "#3E2723", [4, 8], function () {
            playSelectedItem(4);
        }));
        menuItems.push(new libs.createMenuItem("列提纲", ICON_SUBJECT_TYPE.BOOK, menuItems[menuItems.length - 1].nextPosY, 60, "#3E2723", [9, 11], function () {
            playSelectedItem(9);
        }));
        menuItems.push(new libs.createMenuItem("在记叙事件时\n加入动物描写", ICON_SUBJECT_TYPE.CHECKBOX, menuItems[menuItems.length - 1].nextPosY, 90, "#3E2723", [12, 16], function () {
            playSelectedItem(12);
        }));
        
        menuItems.push(new libs.createMenuItem("小练笔", ICON_SUBJECT_TYPE.PENCIL, menuItems[menuItems.length - 1].nextPosY, 60, "#3E2723", [17, 17], function () {
            playSelectedItem(17);
        }));
        menuItems.push(new libs.createMenuItem("总结", ICON_SUBJECT_TYPE.BOOK, menuItems[menuItems.length - 1].nextPosY, 60, "#3E2723", [18, 19], function () {
            playSelectedItem(18);
        }));
        */
        /*
        menuItems.push(new libs.createMenuItem("我来写一写", ICON_SUBJECT_TYPE.PENCIL, menuItems[menuItems.length - 1].nextPosY, 60, "#3E2723", [14, 17], function () {
            playSelectedItem(14);
        }));
        */



        /*
        menuItems.push(new libs.createMenuItem("完成贴文", ICON_SUBJECT_TYPE.PENCIL, menuItems[menuItems.length - 1].nextPosY, 60, "#263238", [10, 10], function () {
            playSelectedItem(10);
        }));
        */
        /*
        menuItems.push(new libs.createMenuItem("在记叙事件时\n加入人物描写", ICON_SUBJECT_TYPE.BULB, menuItems[menuItems.length - 1].nextPosY, 90, "#263238", [9, 10], function () {
            playSelectedItem(9);
        }));
        */
        /*
        menuItems.push(new libs.createMenuItem("我来挑战", ICON_SUBJECT_TYPE.CHESS, menuItems[menuItems.length - 1].nextPosY, 60, "#263238", [14, 17], function () {
            playSelectedItem(14);
        }));
        menuItems.push(new libs.createMenuItem("小练笔", ICON_SUBJECT_TYPE.PENCIL, menuItems[menuItems.length - 1].nextPosY, 60, "#263238", [18, 19], function () {
            playSelectedItem(18);
        }));
        */
        /*
        var textMenuItem01 = new libs.createMenuItem("题目", ICON_SUBJECT_TYPE.BOOK, 200, 60, "#263238", [1, 1], function () {
            playSelectedItem(2);
        });
        var textMenuItem02 = new libs.createMenuItem("审题", ICON_SUBJECT_TYPE.BOOK, textMenuItem01.nextPosY, 60, "#263238", [1, 1], function () {
            playSelectedItem(3);
        });
        var textMenuItem03 = new libs.createMenuItem("选材", ICON_SUBJECT_TYPE.BOOK, textMenuItem02.nextPosY, 60, "#263238", [1, 1], function () {
            playSelectedItem(5);
        });
        var textMenuItem04 = new libs.createMenuItem("列提纲", ICON_SUBJECT_TYPE.BOOK, textMenuItem03.nextPosY, 60, "#263238", [1, 1], function () {
            playSelectedItem(6);
        });
        var textMenuItem05 = new libs.createMenuItem("在记叙事件时\n加入人物描写", ICON_SUBJECT_TYPE.BULB, textMenuItem04.nextPosY, 90, "#263238", [1, 1], function () {
            playSelectedItem(9);
        });
        var textMenuItem06 = new libs.createMenuItem("我来挑战", ICON_SUBJECT_TYPE.CHESS, textMenuItem05.nextPosY, 60, "#BE9B54", [1, 1], function () {

        });
        var textMenuItem07 = new libs.createMenuItem("小练笔", ICON_SUBJECT_TYPE.PENCIL, textMenuItem06.nextPosY, 60, "#263238", [1, 1], function () {
            playSelectedItem(18);
        });
        */

        var copyright = new cjs.Bitmap(imgs.copyrights);
        copyright.setTransform(0, PAGE_HEIGHT, 1, 1, 0, 0, 0, 0, 160);

        container.addChild(bg);        
        container.addChild(sideMenuBg);        
        container.addChild(panelMenuClose);
        container.addChild(textActivity);
        //container.addChild(textHeader01);
        //container.addChild(textHeader02);
        //container.addChild(textHeader03);
        container.addChild(line01);
        //container.addChild(line02);
        menuItems.forEach(function(item, index) {
            container.addChild(item);
        });        
        container.addChild(copyright);
        
        //container.addChild(textMenuItem01, textMenuItem02, textMenuItem03, textMenuItem04, textMenuItem05, textMenuItem06, textMenuItem07);

        return container;
    });

    // menu panel
    (libs.createMenuItem = function(text, iconType, y, height, textColor, range, onClick, extra) {
        var container = new createjs.Container();
        container.setTransform(0, y);
        container.nextPosY = y + height + 10;

        container.showActive = function(pageNum) {
            //console.log("pageNum: " + pageNum);
            //console.log("range: " + range[0] + ", " + range[1]);
            if (pageNum >= range[0] && pageNum <= range[1]) {
                bgActive.visible = true;
            } else {
                bgActive.visible = false;
            }
        };

        var bg = new createjs.Container();
        var imgBg = new createjs.Shape(new createjs.Graphics().beginFill("#263238").drawRect(0, 0, 330, height));
        imgBg.shadow = new createjs.Shadow("rgba(0,0,0,0.4)", 0, 8, 24);

        if (textColor !== "#BE9B54") {
            bg.on("click", onClick);
            bg.cursor = "pointer";
        }
        var imgArrow = new createjs.Bitmap(imgs.icon_chevron_right);
        imgArrow.setTransform(300, height * 0.5, 0.5, 0.5, 0, 0, 0, imgArrow.getBounds().width * 0.5, imgArrow.getBounds().height * 0.5);

        bg.addChild(imgBg);
        bg.addChild(imgArrow);
        bg.alpha = 0.00;
        bg.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000000").drawRect(0, 0, 330, height));

        var bgActive = new createjs.ScaleBitmap(imgs.btn_sidemenu_active, new createjs.Rectangle(0, 5, 40, 30));
        bgActive.setDrawSize(320, height);
        bgActive.visible = false;

        var imgIcon;
        var rotateX = 15;
        switch (iconType) {
            case ICON_SUBJECT_TYPE.BOOK: {
                imgIcon = imgs.icon_chapter;
                break;
            }
            case ICON_SUBJECT_TYPE.BULB: {
                imgIcon = imgs.icon_bulb;
                break;
            }
            case ICON_SUBJECT_TYPE.PHONE: {
                imgIcon = imgs.icon_phone;
                break;
            }
            case ICON_SUBJECT_TYPE.POSTCARD: {
                imgIcon = imgs.icon_postcard;
                break;
            }
            case ICON_SUBJECT_TYPE.QUESTION: {
                imgIcon = imgs.icon_question;
                rotateX = 15;
                break;
            }
            case ICON_SUBJECT_TYPE.CHECKBOX: {
                imgIcon = imgs.icon_checkbox;
                rotateX = 0;
                break;
            }
            case ICON_SUBJECT_TYPE.PENCIL: {
                imgIcon = imgs.icon_color_pencil;
                rotateX = 0;
                break;
            }
            case ICON_SUBJECT_TYPE.CHESS: {
                imgIcon = imgs.icon_chess;
                rotateX = 0;
                break;
            }
            case ICON_SUBJECT_TYPE.VIDEO: {
                imgIcon = imgs.icon_video;
                rotateX = 0;
                break;
            }
            case ICON_SUBJECT_TYPE.GAMEPAD: {
                imgIcon = imgs.icon_gamepad;
                rotateX = 15;
                break;
            }
            case ICON_SUBJECT_TYPE.SCOOTER_01: {
                imgIcon = imgs.icon_color_scooter_01;
                rotateX = 0;
                break;
            }
            case ICON_SUBJECT_TYPE.SCOOTER_02: {
                imgIcon = imgs.icon_color_scooter_02;
                rotateX = 0;
                break;
            }
        }

        var icon = new createjs.Bitmap(imgIcon);
        icon.setTransform(45, height * 0.5, 0.42, 0.42, rotateX, 0, 0, icon.getBounds().width * 0.5, icon.getBounds().height * 0.5)
        icon.shadow = new createjs.Shadow("rgba(0,0,0,0.6)", 0, 4, 12);

        var textMenuItem = libs.createCustomText(85, height * 0.5, text, { lineHeight: 28, fontSize: 24, textColor: textColor, fontWeight: 700 });
        /*
        var textMenuItem = new cjs.Text(text, "bold 22px arial", textColor);
        textMenuItem.textBaseline = "middle";
        textMenuItem.lineHeight = 30;
        textMenuItem.setTransform(85, height * 0.5);
        */
        if (text.includes("\n")) {
            textMenuItem.y -= 15;
        }


        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.offsetY)) {
                textMenuItem.y += extra.offsetY;
            }
        }


        bg.addEventListener("mouseover", function() {
            if (textMenuItem.color !== "#BE9B54") {
                textMenuItem.color = "white";
                bg.alpha = 1;
            }
        });
        bg.addEventListener("mouseout", function() {
            textMenuItem.color = textColor;
            bg.alpha = 0.00;
        });

        container.addChild(bgActive);
        container.addChild(bg);
        container.addChild(icon);
        container.addChild(textMenuItem);
        return container;
    });

    /************ PAGES STARTS ************/
    // unit page01
    (libs.contentUnitPage01 = function (parent) {
        var container = this;
        var clip = parent.parent;

        container.reset = function () {
        }

        container.stop = function () {
        };

        container.play = function () {
            container.reset();
        };

        parent.hideBtnBack();

        var btnTitle = new cjs.Text("华文伴我行", "700 100px Noto Sans SC", "#000000");
        btnTitle.textAlign = "center";
        btnTitle.textBaseline = "middle";
        btnTitle.setTransform(PAGE_WIDTH * 0.5, PAGE_HEIGHT * 0.5, 1, 1, 0, 0, 0, 0, 0);

        container.addChild(btnTitle);
        container.reset();
        return this;
    }).prototype = p = new cjs.Container();
    
    // cover page01
    (libs.contentCoverPage01 = function (parent) {
        var container = this;
        var clip = parent.parent;

        container.reset = function () {
            //clip.parent.menuPanel.visible = false;
            libs.stopSound();
            coverPage.reset();            
        }

        container.stop = function () {
            libs.stopSound();
        };

        container.play = function () {
            container.reset();
        };

        container.back = function () {
            container.reset();
        };

        parent.hideMenu();  
        parent.hideNavigation();
        parent.hideBottomBar();
        parent.setUnitLogoTextColor("#000000");
        parent.showMenuNavigationBtns(true);

        var requestFullScreen = function () {
            var canvas = document.getElementById("canvas");
            if (canvas.requestFullscreen) {
                canvas.requestFullscreen()
                    .then(function () {
                        // element has entered fullscreen mode successfully
                        screen.orientation.lock("landscape")
                            .then(function () {
                                //alert('Locked');
                            })
                            .catch(function (error) {
                                //alert(error);
                                title.text = error;
                            });
                    })
                    .catch(function (error) {
                        // element could not enter fullscreen mode
                        // error message
                        title.text = error.message;
                    });
            }
            else if (canvas.webkitRequestFullScreen) {
                canvas.webkitRequestFullScreen();
                screen.orientation.lock("landscape")
                    .then(function () {
                        //alert('Locked');
                    })
                    .catch(function (error) {
                        //alert(error);
                        title.text = error;
                    });
            }
        }

        var showSplash = function () {            
            var activity = clip.parent;
            activity.splashPanel.visible = true;
            activity.splashPanel.setText("开始游戏");            

            activity.splashPanel.onClose(function () {                
            })
        }

        var createCoverPage = function (x, y) {
            var container = new cjs.Container();
            container.setTransform(x, y);

            container.reset = function () {
                btn.enable();
            }

            var bg = new cjs.Bitmap(imgs.bg_cover);
            container.addChild(bg);

            var title = new cjs.Text("写作指导", "700 60px Noto Sans SC", "#000000");
            title.textAlign = "center";
            title.textBaseline = "middle";
            title.setTransform(950, 350);
            
            var desc = new cjs.Text("在记叙时加入\n人物描写并表达感受", "700 20px Noto Sans SC", "#000000");
            desc.textAlign = "center";
            desc.textBaseline = "middle";
            desc.lineHeight = 48;
            desc.setTransform(950, 450);            

            /*
            console.log("set focus");
            window.addEventListener("focus", function () {                
                setTimeout(function () {
                    title.text = "on focus";
                    requestFullScreen();
                }, 5000);
                
            })
            */
            var btn02 = new libs.createGenericBtn(parent, "MAP", 950, 300, BTN_TYPE.SIZE_200X80, function () {
                document.getElementById("newTab").href = "https://www.google.com/maps/dir/492A+Admiralty+Link,+Singapore+751492/1.4487263,103.8100453/@1.4553457,103.8071358,15z";
                document.getElementById("newTab").click();
            });

            var btn = new libs.createGenericBtn(parent, "开始", 950, 600, BTN_TYPE.SIZE_200X80, function () {
                btn.disable();            
                /*
                var speech = cjs.Sound.play("s03_u4b_writing_title");
                speech.on("complete", function () {
                    parent.jumpTo(1);                      
                })
                */
                /*
    if (document.querySelector("#appContainer").requestFullscreen)
        document.querySelector("#appContainer").requestFullscreen();
    else if (document.querySelector("#appContainer").webkitRequestFullScreen)
        document.querySelector("#appContainer").webkitRequestFullScreen();
    */
                /*
                var element = document.querySelector("#appContainer");

                document.addEventListener('fullscreenchange', function () {
                    var full_screen_element = document.fullscreenElement;

                    if (full_screen_element !== null) {
                        var canvas = document.getElementById("canvas");    
                        //alert(document.body.clientHeight)
                        //canvas.width = window.innerWidth;
                        //canvas.height = window.innerHeight;
                        desc.text = "client width: " + document.body.clientWidth
                            + "\n" + "client height: " + document.body.clientHeight
                            + "\n" + "canvas width: " + canvas.width
                            + "\n" + "canvas height: " + canvas.height;
                    }

                    else {

                    }
                        
                	
                });
                */

                /*
                element.requestFullscreen()
                    .then(function () {
                        // element has entered fullscreen mode successfully
                    })
                    .catch(function (error) {
                        // element could not enter fullscreen mode
                        // error message
                        alert(error.message);
                    });

                screen.orientation.lock("landscape")
                    .then(function () {
                        //alert('Locked');
                    })
                    .catch(function (error) {
                        alert(error);
                    });
                parent.jumpTo(1);                      
                */
                
                if (IsMobileDevice()) {
                    //console.log("Is mobile device");
                    var canvas = document.getElementById("canvas");
                    canvas.addEventListener('fullscreenchange', function () {
                        var full_screen_element = document.fullscreenElement;
                        if (full_screen_element !== null) {

                        } else {

                        }
                    });

                    requestFullScreen();
                }
                
                parent.jumpTo(1);       
            }, { fontSize: 40 });
                        

            container.addChild(bg);
            container.addChild(title);
            container.addChild(desc);
            container.addChild(btn);
            container.addChild(btn02);
            return container;
        }

        var coverPage = createCoverPage(0, 0);

        if (IsMobileDevice()) {
            showSplash();
        }        

        container.addBefore = function () {
            return coverPage;
        }
        
        container.reset();
        return this;
    }).prototype = p = new cjs.Container();            

    (libs.contentSplashPage01 = function (parent) {
        var container = this;
        var clip = parent.parent;
        var videoPanel = clip.parent.videoPanel;
        var imgBg = null;

        container.addBefore = function () {
            imgBg = new cjs.Bitmap(imgs.bg_splash);
            return imgBg;
        }

        container.reset = function () {
            //clip.parent.musicControl.show(false);
            libs.stopSound();
            scene01.reset();
        }

        container.stop = function () {
            libs.stopSound();
            scene01.removeListeners();
        };

        container.play = function () {
            container.reset();
        };

        container.back = function () {
            container.reset();
        };

        parent.hideMenu();
        parent.hideNavigation();
        parent.hideBottomBar();
        parent.setUnitLogoTextColor("#000000");

        var handleVisibilityChange = function () {
            if (document[hidden]) {
                if (!IsEmpty(gMusicInstance)) gMusicInstance.paused = true;
                if (!IsEmpty(gLocalMusicInstance)) gLocalMusicInstance.paused = true;
                if (!IsEmpty(gAudioInstance)) gAudioInstance.paused = true;
            } else {
                if (!IsEmpty(gMusicInstance)) gMusicInstance.paused = false;
                if (!IsEmpty(gLocalMusicInstance)) gLocalMusicInstance.paused = false;
                if (!IsEmpty(gAudioInstance)) gAudioInstance.paused = false;
            }
        }
        AddVisibilityChange(handleVisibilityChange);

        var createScene = function () {
            var container = new cjs.Container();
            var idStage = -1;

            // do not reset
            var hasAddedVideoListeners = false;

            var videoTimeUpdateHandler = function () {

            }

            var videoPlayHandler = function () {
                //videoPanel.setVideoPlaying(true);
                switch (idStage) {
                    /*
                    case 1:
                        img.x -= PAGE_WIDTH;
                        img.visible = true;
                        cjs.Tween.get(img, { override: true }).to({ x: 0 }, 1000, cjs.Ease.linear).call(function () {
                            cjs.Tween.removeTweens(img)
                        });
                        break;
                    */
                }
            }

            var videoEndedHandler = function () {
                //console.log("on ended: " + idStage);
                //videoPanel.setVideoPlaying(false);
                switch (idStage) {
                    case 0:
                        img.visible = false;
                        //imgBg.visible = true;
                        imgBg.image = imgs.bg_credits;                        
                        setTimeout(function () {                            
                            parent.jumpTo(PAGE_INDEX.OPENING_01);
                        }, 2000);
                        
                        //img.visible = false;
                        //parent.jumpTo(PAGE_INDEX.ACTIVITY_01);
                        break;
                }

            }

            container.removeListeners = function () {
                if (hasAddedVideoListeners) {
                    hasAddedVideoListeners = false;
                    videoPanel.video.removeEventListener('timeupdate', videoTimeUpdateHandler);
                    videoPanel.video.removeEventListener("play", videoPlayHandler)
                    videoPanel.video.removeEventListener("ended", videoEndedHandler);
                    //console.log("Removed opening listeners!")
                }
            }

            container.play = function () {
                idStage++;
                //console.log("stage: " + idStage);
                let src = null;
                let startTime = 0
                switch (idStage) {
                    case 0:
                        src = "videos/CPDD.mp4";
                        break;
                }
                if (!IsEmpty(src)) {
                    videoPanel.video.src = src;
                    videoPanel.video.currentTime = startTime;
                    switch (idStage) {
                        case 0:
                            break;
                    }
                    if (!hasAddedVideoListeners) {
                        hasAddedVideoListeners = true;
                        videoPanel.video.addEventListener('timeupdate', videoTimeUpdateHandler);
                        videoPanel.video.addEventListener("play", videoPlayHandler)
                        videoPanel.video.addEventListener("ended", videoEndedHandler);
                        //console.log("Added opening listeners!")
                    }
                }
            }

            container.reset = function () {
                idStage = -1;
                if (!IsEmpty(imgBg)) imgBg.image = img.bg_splash;
                img.visible = false;
            }

            container.showAll = function () { }

            var btnStart = libs.createCustomBtn((PAGE_WIDTH * 0.5) - 1, 635, "", imgs.btn_start_off, imgs.btn_start_on, function () {
                btnStart.visible = false;
                img.visible = true;
                scene01.play();
                //parent.jumpTo(PAGE_INDEX.ACTIVITY_01);
            }, { isClickInteraction: false });

            var textDeviceInfo = libs.createCustomText(20, PAGE_HEIGHT - 30, GetUserDeviceInfo(), { textColor: "#FFFFFF" });

            var img = new cjs.Bitmap(videoPanel.video);

            container.addChild(img);
            container.addChild(btnStart);
            //container.addChild(textDeviceInfo);
            return container;
        }

        var scene01 = createScene();

        container.addChild(scene01);
        container.reset();
        return this;
    }).prototype = p = new cjs.Container();

    (libs.contentOpeningPage01 = function (parent) {
        var container = this;
        var clip = parent.parent;
        var videoPanel = clip.parent.videoPanel;
        var imgBg = null;
        var imgSplash = null;

        container.addBefore = function () {
            imgBg = new cjs.Bitmap(imgs.pre_select);
            return imgBg;           
        }

        container.reset = function () {
            //console.log("reset");            
            //clip.parent.menuPanel.visible = false;
            //clip.parent.musicControl.show(true);
            libs.stopSound();
            scene01.reset();
        }

        container.stop = function () {
            libs.stopSound();
            scene01.removeListeners();
        };

        container.play = function () {
            clip.parent.musicControl.show(true);
            container.reset();
            libs.fadeOut(imgSplash, 1000);                        
            scene01.play();            
        };

        container.back = function () {
            container.reset();
        };

        parent.hideMenu();
        parent.hideNavigation();
        parent.hideBottomBar();
        parent.setUnitLogoTextColor("#000000");        

        var captureVideoToImg = function (video, callback) {
            var canvas = document.getElementById('canvas_temp');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

            try {
                const img = new Image();
                img.src = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                img.onload = function () {
                    callback(img);
                }
            } catch (e) {
                callback(null);
            }
        }        

        var createScene = function () {
            var container = new cjs.Container();
            var idStage = -1;            

            // do not reset
            var hasAddedVideoListeners = false;

            var videoTimeUpdateHandler = function () {

            }

            var videoPlayHandler = function () {                
                switch (idStage) {
                    case 1:
                        img.x -= PAGE_WIDTH;
                        img.visible = true;
                        cjs.Tween.get(img, { override: true }).to({ x: 0 }, 1000, cjs.Ease.linear).call(function () {
                            cjs.Tween.removeTweens(img)
                        });
                        break;
                }
            }

            var videoEndedHandler = function () {
                switch (idStage) {
                    case 0:
                        libs.fadeIn(panelHowToPlay, null, function () {
                            img.visible = false;
                            btnSkip.visible = false;
                        })                        
                        libs.playMusic("Playdate_loop", { pos: 2196 });
                        /*
                        imgBg.visible = true;
                        libs.playMusic("Playdate_loop", { pos: 2196 });
                        libs.captureImgToImg(img, imgBg);
                        img.visible = false;
                        libs.fadeIn(btnNext);
                        libs.fadeIn(btnCross);
                        btnSkip.visible = false;
                        btnPlay.visible = true;
                        */
                        /*
                        libs.captureImgToImg(img, function (pic) {
                            imgBg.image = pic;
                            
                        })
                        */
                        break;
                    case 1:
                        //libs.playMusic("Playdate_loop", { pos: 2196 });
                        /*
                        captureVideoToImg(videoPanel.video, function (pic) {
                            imgBg.image = pic;
                            overlayPlayerSelection.visible = true;
                        })
                        */
                        libs.captureImgToImg(img, imgBg);
                        overlayPlayerSelection.visible = true;
                        break;
                }
            }

            container.removeListeners = function () {
                if (hasAddedVideoListeners) {
                    hasAddedVideoListeners = false;
                    videoPanel.video.removeEventListener('timeupdate', videoTimeUpdateHandler);
                    videoPanel.video.removeEventListener("play", videoPlayHandler)
                    videoPanel.video.removeEventListener("ended", videoEndedHandler);
                    //console.log("Removed opening listeners!")
                }                
            }

            container.play = function () {
                idStage++;
                //console.log("stage: " + idStage);
                let src = null;
                let startTime = 0
                switch (idStage) {
                    case 0: src = "videos/intro_trim_02.mp4"; break;
                    case 1: src = "videos/pre_select.mp4"; break;                    
                }
                if (!IsEmpty(src)) {
                    videoPanel.video.src = src;
                    videoPanel.video.currentTime = startTime;
                    switch (idStage) {
                        case 0:
                            btnSkip.visible = true;
                            libs.stopMusic();
                            break;
                        case 1:                            
                            videoPanel.video.play();
                            break;                        
                    }
                    if (!hasAddedVideoListeners) {
                        hasAddedVideoListeners = true;
                        videoPanel.video.addEventListener('timeupdate', videoTimeUpdateHandler);
                        videoPanel.video.addEventListener("play", videoPlayHandler)
                        videoPanel.video.addEventListener("ended", videoEndedHandler);
                        //console.log("Added opening listeners!")
                    }
                }
            }

            container.reset = function () {
                idStage = -1;                
                btnNext.visible = false;
                btnPrev.visible = false;
                btnCross.visible = false;
                btnSkip.visible = false;
                btnPlay.visible = false;
                panelHowToPlay.visible = false;
                btnPrev.reset();
                btnNext.reset();
                btnCross.reset();
                btnNext.setPos(1100, 450);
                if (!IsEmpty(imgBg)) {
                    imgBg.visible = false;
                }                
            }

            container.showAll = function () {
            }            
            

            var createPlayerSelectionOverlay = function (onSelect) {
                var container = new cjs.Container();

                var createSelection = function (id, x, y, onSelect) {
                    var container = new cjs.Container();
                    var width = 280;
                    var height = 500;

                    container.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);

                    var bg = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF02").drawRect(0, 0, width, height));

                    container.cursor = "pointer";
                    container.on("mousedown", function () {
                        onSelect(id);
                    })

                    container.addChild(bg);
                    return container;
                }

                var selection01 = createSelection(0, 250, 380, onSelect);
                var selection02 = createSelection(1, 1050, 380, onSelect);

                container.addChild(selection01, selection02);
                return container;
            }                        

            var overlayPlayerSelection = createPlayerSelectionOverlay(function (id) {
                overlayPlayerSelection.visible = false;
                parent.jumpTo(PAGE_INDEX.ACTIVITY_01, { id: id, pic: imgBg.image });
            });            

            var panelHowToPlay = libs.createHowToPlayPanel(function () {
                //console.log("Stage: " + idStage);
                switch (idStage) {
                    case 0:                        
                        libs.captureCanvasToImg(function (pic) {
                            panelHowToPlay.visible = false;
                            imgBg.image = pic;
                            imgBg.visible = true;
                            btnPlay.visible = false;
                            scene01.play();
                        })
                        break;
                }
            });

            var btnNext = libs.createCustomBtn(1100, 450, "", imgs.button1, imgs.button1a, function () {
                //console.log("idStage: " + idStage);
                switch (idStage) {
                    case 0:
                        btnNext.visible = false;
                        btnPrev.visible = true;
                        imgBg.image = imgs.How_play2a;
                        btnNext.reset();
                        break;
                }

            }, {  });

            var btnPrev = libs.createCustomBtn(1100, 450, "", imgs.button1, imgs.button1a, function () {
                //console.log("idStage: " + idStage);
                switch (idStage) {
                    case 0:
                        btnNext.visible = true;
                        btnPrev.visible = false;
                        imgBg.image = imgs.How_play2;
                        btnPrev.reset();
                        break;
                }

            }, { isFlipped: true });

            var btnCross = libs.createCustomBtn(1200, 650, "", imgs.close_butt1, imgs.close_butt1a, function () {
                switch (idStage) {
                    case 0:
                        libs.captureCanvasToImg(function (pic) {                                                        
                            imgBg.image = pic;
                            btnCross.visible = false;
                            btnNext.visible = false;
                            btnPrev.visible = false;
                            scene01.play();
                        })
                        break;
                }
            }, {});

            var btnSkip = libs.createBtnOverlay(1185, 617, 100, 100, function () {                
                //console.log("duration: " + videoPanel.video.duration);
                libs.captureImgToImg(img, imgBg);
                //imgBg.image = imgs.intro_end;
                imgBg.visible = true;
                img.visible = false;
                videoPanel.video.pause();
                btnSkip.visible = false;
                libs.playMusic("Playdate_loop", { pos: 2196 });
                btnCross.click();
                //
            });

            var btnPlay = libs.createBtnOverlay(1000, 430, 150, 150, function () {
                switch (idStage) {
                    case 0:
                        libs.captureCanvasToImg(function (pic) {
                            imgBg.image = pic;
                            btnPlay.visible = false;                            
                            scene01.play();
                        })
                        break;
                }
            });

            btnPrev.visible = false;
            btnNext.visible = false;
            btnCross.visible = false;
            panelHowToPlay.visible = false;
            
            overlayPlayerSelection.visible = false;

            var img = new cjs.Bitmap(videoPanel.video);
            
            container.addChild(img);
            container.addChild(overlayPlayerSelection);            
            //container.addChild(btnPrev);
            //container.addChild(btnNext);
            //container.addChild(btnCross);
            container.addChild(btnSkip);
            container.addChild(panelHowToPlay);
            container.addChild(btnPlay);

            return container;
        }

        var scene01 = createScene();        

        container.addPageLast = function () {
            imgSplash = new cjs.Bitmap(imgs.bg_credits);
            return imgSplash;
         };

        container.addChild(scene01);
        container.reset();
        return this;
    }).prototype = p = new cjs.Container();

    (libs.contentActivityPage01 = function (parent) {
        var container = this;
        var clip = parent.parent;

        const STAGE_MENU_01 = 0;
        const STAGE_MENU_02 = 3;
        const STAGE_MENU_03 = 6;
        const STAGE_LVL_START_01 = 1;
        const STAGE_LVL_START_02 = 4;
        const STAGE_LVL_START_03 = 7;
        const STAGE_GAME_PLAY_01 = 2;
        const STAGE_GAME_PLAY_02 = 5;
        const STAGE_GAME_PLAY_03 = 8;
        const STAGE_LVL_END = 9;

        var videoPanel = clip.parent.videoPanel;
        var pImgBg = null
        var imgOverlay = null;        

        const VIDEO_HOW_TO_PLAY = "videos/how_to_play.mp4";

        const WORD_TYPE = {
            NOUN: 0,
            ADVERB: 1,
            VERB: 2,
            ADJECTIVE: 3,
        }

        const TOTAL_BURGERS_TO_COMPLETE = 10;

        var idPlayer = 0;

        var playerInfo = [
            {
                select: { pic: imgs.Nadia },
                menu: [
                    { pic: imgs.menu_1_nadia, video: "videos/menu_1_nadia.mp4", btnPlayOffset: { x: 0, y: 0 }, btnPlayTimeDelay: 2.5 },
                    { pic: imgs.menu_2_nadia, video: "videos/menu_2_nadia.mp4", btnPlayOffset: { x: 35, y: 35 }, btnPlayTimeDelay: 8.5 },
                    { pic: imgs.menu_3_nadia, video: "videos/menu_3_nadia.mp4", btnPlayOffset: { x: 0, y: 0 }, btnPlayTimeDelay: 6.8 },
                ],
                lvl: [
                    { duration: /*90*/90, extra: { rackOffset: { x: -3, y: 11 } }, pic: imgs.Level_1a_nadia, picTryAgain: imgs.sign1_01_nadia, picWin: imgs.sign2_01_nadia, video: "videos/Level_1_nadia.mp4" },
                    { duration: /*90*/90, extra: { rackOffset: { x: -13, y: 11 }, nextOffset: { x: -6, y: -9 } }, pic: imgs.Level_2a_nadia, picTryAgain: imgs.sign1_02_nadia, picWin: imgs.sign2_02_nadia, video: "videos/Level_2_nadia.mp4" },
                    { duration: /*90*/90, extra: { rackOffset: { x: -5, y: 11 }, nextOffset: { x: -2, y: -5 } }, pic: imgs.Level_3a_nadia, picTryAgain: imgs.sign1_03_nadia, picWin: imgs.sign2_03_nadia, video: "videos/Level_3_nadia.mp4" }
                ],
                complete: [
                    { video: "videos/Level_1_nadia_end.mp4", btnNextOffset: { x: -5, y: 15 } },
                    { video: "videos/Level_2_nadia_end.mp4", btnNextOffset: { x: -5, y: 18 } },
                    { video: "videos/Level_3_nadia_end.mp4", btnNextOffset: { x: -2, y: -5 } },
                ],
                end: { video: "videos/last_scene_nadia.mp4" }
            },
            {                
                select: { pic: imgs.David },
                menu: [
                    { pic: imgs.menu_1_david, video: "videos/menu_1_david.mp4", btnPlayOffset: { x: 0, y: 0 }, btnPlayTimeDelay: 2.5 },
                    { pic: imgs.menu_2_david, video: "videos/menu_2_david.mp4", btnPlayOffset: { x: 35, y: 35 }, btnPlayTimeDelay: 8.5 },
                    { pic: imgs.menu_3_david, video: "videos/menu_3_david.mp4", btnPlayOffset: { x: 0, y: 0 }, btnPlayTimeDelay: 6.8 },
                ],
                lvl: [
                    { duration: /*90*/90, extra: { rackOffset: { x: -3, y: 11 } }, pic: imgs.Level_1a_david, picTryAgain: imgs.sign1_01_david, picWin: imgs.sign2_01_david, video: "videos/Level_1_david.mp4" },
                    { duration: /*90*/90, extra: { rackOffset: { x: -13, y: 11 }, nextOffset: { x: -5, y: -6 } }, pic: imgs.Level_2a_david, picTryAgain: imgs.sign1_02_david, picWin: imgs.sign2_02_david, video: "videos/Level_2_david.mp4" },
                    { duration: /*90*/90, extra: { rackOffset: { x: -5, y: 11 }, nextOffset: { x: -2, y: -5 } }, pic: imgs.Level_3a_david, picTryAgain: imgs.sign1_03_david, picWin: imgs.sign2_03_david, video: "videos/Level_3_david.mp4" }
                ],
                complete: [
                    { video: "videos/Level_1_david_end.mp4", btnNextOffset: { x: -5, y: 15 } },
                    { video: "videos/Level_2_david_end.mp4", btnNextOffset: { x: -5, y: 18 } },
                    { video: "videos/Level_3_david_end.mp4", btnNextOffset: { x: -2, y: -5 } },
                ],
                end: { video: "videos/last_scene_david.mp4" }
            },
        ]

        var gameData = [
            {
                nouns: ["Advertisement", "Apple", "Company", "Existence", "Hour", "Moment", "People", "Presentation", "Remainder", "Summer", "Thing", "Year"],
                adverbs: ["Always", "Certainly", "Generally", "Momentarily", "Often", "Rapidly", "Really", "Seldom", "Silently", "Swiftly", "Truly", "Unbelievably"],
                verbs: ["Apply", "Arrive", "Continue", "Create", "Develop", "Forget", "Have", "Know", "Learn", "Listen", "Suggest", "Think", "Understand", "Would"],
                adjectives: ["Bitter", "Charming", "Difficult", "Forgetful", "Important", "Incapable", "Old", "Possible", "Real", "Rich", "Unsure", "Wondrous"]
            },
            // Arial regular size 35
            {
                nouns: [
                    
                    { msg: "The old man has very strong beliefs.", shape: "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" },                    
                    { msg: "Use your creativity to paint!", shape: "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" },
                    { msg: "A suit and tie are considered formal wear.", shape: "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" },
                    { msg: "It’s anyone’s guess who will win the match.", shape: "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" },
                    { msg: "As it’s getting late, I shall take my leave.", shape: "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" },
                    { msg: "If you don’t hire someone as skilled as Lucy, it’s your loss.", shape: "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" },
                    { msg: "It’s two miles to the train station.", shape: "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" },
                    { msg: "I have proof to support my claim.", shape: "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" },
                    { msg: "Where are your shoes?", shape: "AD2E+QgVgPgHgaIAwgHQADAOAJAHQAKAHAQAAQAUAAAIgHQAHgEAAgIQAAgGgDgEQgEgDgNgDQg6gNgPgKQgVgPgBgaQABgYASgQQASgQAoAAQAlAAASAMQASAMAHAYIgtAJQgDgLgIgGQgJgFgOAAQgTAAgJAFQgFAEAAAGQAAAFAFADQAHAFAmAJQAmAJAPAMQAPANAAAXQAAAZgVASQgUASgqAAQgkAAgWgPgAAsEuQgSgZAAgmQAAgtAXgZQAZgaAkAAQAoAAAYAbQAWAbgBA3Ih3AAQAAAVALAMQALAMAQAAQAMAAAHgGQAJgGADgOIAwAIQgJAagUAOQgUAOgeAAQgvAAgXgfgABWC/QgKAMAAATIBIAAQgBgUgKgLQgKgLgPAAQgPAAgLALgAiKFCQgXgMgLgVQgMgWAAggQAAgXAMgXQALgWAXgMQAVgMAaAAQApAAAbAbQAZAbABAoQgBAqgZAbQgbAbgoAAQgZAAgXgLgAh6DFQgNAOAAAbQAAAbANAOQANAPASAAQAUAAANgPQAMgOAAgbQAAgbgMgOQgNgPgUAAQgSAAgNAPgAo6E+QgWgPgGgaIAwgHQADAOAKAHQAJAHARAAQASAAAKgHQAGgEAAgIQAAgGgDgEQgEgDgNgDQg5gNgQgKQgVgPAAgaQAAgYASgQQATgQAnAAQAlAAASAMQASAMAHAYIgtAJQgDgLgIgGQgIgFgQAAQgSAAgJAFQgFAEAAAGQAAAFAFADQAGAFAmAJQAnAJAPAMQAPANAAAXQAAAZgVASQgUASgpAAQgmAAgVgPgAHjFJIAAgjIAjAAIAAAjgAkOFJIAAhgQAAgdgDgHQgDgIgGgEQgHgFgLAAQgMAAgJAGQgJAGgFALQgEAMAAAXIAABbIgwAAIAAj7IAwAAIAABcQAXgbAhAAQAQAAANAGQAOAGAGAKQAIAKACALQACAMAAAYIAABrgAHkELIAAgJQABgSAFgNQADgKAJgKQAGgIAQgOQAQgOAEgIQAFgJABgKQAAgSgOgNQgPgOgUAAQgUAAgMANQgOAMgEAaIgggEQAEgjAWgSQAVgTAiAAQAlAAAWAUQAWAUAAAcQAAARgIAOQgHANgWAUQgQAOgEAGQgFAGgCAIQgDAJAAASgAIegLIgEgdQAKADAIAAQAKAAAGgEQAHgDADgGQADgFAHgSIADgIIhFi2IAhAAIAmBpQAHAUAFAWQAGgVAIgUIAmhqIAfAAIhFC5QgLAegGALQgJAPgKAHQgLAHgOAAQgKAAgKgDgAOwhTQgOgGgHgKQgGgJgDgOQgCgJAAgTIAAhxIAeAAIAABlQAAAYACAIQAEANAJAHQAJAGAOAAQAOAAAMgHQAMgHAFgMQAGgMAAgYIAAhhIAeAAIAAC2IgcAAIAAgbQgUAfglAAQgQAAgOgGgALahmQgYgYABguQgBgyAcgZQAYgUAhAAQAmAAAYAZQAYAYAAArQAAAjgLAVQgLAUgUALQgTALgZAAQglAAgYgZgALxjgQgPARAAAjQAAAjAPARQAQASAWAAQAXAAAQgSQAPgRAAgkQAAgigPgRQgQgRgXAAQgWAAgQARgAEJhmQgYgYAAgsQABguAXgaQAXgZAmAAQAlAAAWAZQAYAZAAAtIAAAIIiIAAQACAeAPAQQAPAQAXAAQARAAAMgJQAMgJAHgUIAgAEQgIAcgUAPQgUAQggAAQgoAAgXgZgAEjjjQgOAOgCAYIBlAAQgCgXgKgMQgOgSgXAAQgWAAgOAPgAg1hcQgQgOAAgXQAAgNAGgLQAHgLAJgHQAKgHAMgDQAJgDASgCQAlgEASgGIAAgIQAAgTgJgIQgMgKgXAAQgVAAgKAHQgLAIgEATIgfgEQAFgTAJgMQAKgMARgGQASgHAWAAQAXAAAPAGQAOAFAIAIQAGAJADAMQACAIgBAVIAAApQAAArACALQADALAFALIggAAQgEgKgCgNQgRAPgQAGQgQAGgRAAQgeAAgQgPgAAGihQgSADgIADQgHAEgFAHQgEAGAAAIQAAAMAJAJQAKAIARAAQASAAANgIQAOgIAGgNQAGgLAAgUIAAgLQgRAGgiAFgAlRhmQgXgYAAgsQAAguAXgaQAYgZAmAAQAkAAAXAZQAXAZAAAtIAAAIIiHAAQACAeAPAQQAOAQAYAAQAQAAAMgJQANgJAGgUIAgAEQgHAcgVAPQgUAQgfAAQgpAAgXgZgAk2jjQgPAOgCAYIBlAAQgCgXgJgMQgPgSgXAAQgVAAgOAPgAqIhmQgXgYAAgsQAAguAXgaQAYgZAlAAQAlAAAXAZQAXAZAAAtIAAAIIiIAAQACAeAPAQQAQAQAWAAQASAAAMgJQAMgJAHgUIAfAEQgIAcgUAPQgUAQggAAQgnAAgYgZgApujjQgOAOgBAYIBlAAQgCgXgKgMQgOgSgYAAQgWAAgOAPgARShRIAAi2IAdAAIAAAcQAKgUAJgGQAJgGALAAQAPAAAQAKIgLAdQgLgHgLAAQgKAAgIAGQgIAGgEALQgEAQAAAUIAABfgACGhRIAAi2IAdAAIAAAcQAKgUAJgGQAJgGALAAQAPAAAQAKIgLAdQgLgHgLAAQgKAAgIAGQgIAGgEALQgEAQAAAUIAABfgAnThRIAAi2IAcAAIAAAcQAKgUAKgGQAIgGALAAQAQAAAQAKIgLAdQgLgHgLAAQgLAAgHAGQgJAGgDALQgFAQAAAUIAABfgArjhRIAAhzQAAgXgKgLQgKgKgSAAQgOAAgMAHQgLAHgGAMQgEAMAAAVIAABkIggAAIAAj7IAgAAIAABaQAVgZAhAAQAUAAAPAIQAOAIAHAOQAGAOABAbIAABzgAvXhRIg1i/IgIgeIgHAeIg1C/IgiAAIhCj7IAhAAIAnCkIAKA0IAMgvIAvipIAoAAIAkB/QANAvAHAqQAEgYAIgfIAnihIAhAAIhED7g" },
                    
                    { msg: "He took a seat in the restaurant.", shape: "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" },
                    
                    { msg: "Their son has just joined the army.", shape: "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" },
                    { msg: "What are your thoughts on this?", shape: "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" },
                    { msg: "School begins next week.", shape: "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" },
                    
                ],
                adverbs: [                    
                    { msg: "I’ve already finished eating.", shape: "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" },
                    
                    { msg: "Sprinting fast, he managed to win the race.", shape: "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" },
                    { msg: "The bug leapt high into the air.", shape: "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" },
                    { msg: "They grinned merrily at each other.", shape: "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" },
                    { msg: "I rarely see him leave the house.", shape: "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" },
                    { msg: "The students are remarkably quiet today.", shape: "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" },
                    { msg: "The burglar crept stealthily out of the house.", shape: "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" },
                    { msg: "My parents don’t usually eat fast food.", shape: "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" },
                    { msg: "It’s a very warm day.", shape: "AVlCgIgDgdQAKADAHAAQAKAAAHgEQAGgDAEgGQADgFAGgSIADgIIhFi1IAhAAIAmBoQAHAUAGAWQAFgVAIgUIAmhpIAfAAIhFC4QgLAegGALQgIAPgLAHQgLAHgOAAQgJAAgLgDgAj+ChIgEgmQALACAJAAQARAAAIgKQAIgKAEgPIhDiwIgOAqQgNgIgKAAQgKAAgHAGQgHAFgEAPQgEAOAAAuIAAA4IgwAAIAAi1IAsAAIAAAaQAMgSAJgGQAJgGAMAAQAQAAAPAJIgCgFIAzAAIAsCAIAqiAIAyAAIhMDOQgGAPgGAJQgGAIgHAFQgHAGgLADQgLACgOAAQgOAAgNgCgASpBPQgQgOAAgXQAAgNAHgLQAGgLAJgHQAKgGAMgDQAKgDASgCQAlgEASgGIAAgIQAAgTgJgIQgMgKgXAAQgWAAgKAHQgKAIgFATIgegEQAEgTAJgMQAKgMARgGQASgHAYAAQAXAAAOAGQAPAFAHAIQAHAJACAMQACAIAAAVIAAAoQAAArACALQACALAGALIghAAQgEgKgCgNQgRAPgQAGQgPAGgTAAQgdAAgRgPgATlAKQgTADgHADQgIAEgFAHQgEAGAAAIQAAAMAKAJQAJAIASAAQASAAANgIQAOgIAHgNQAFgLAAgUIAAgKQgRAFgiAFgAP8BSQgSgMgKgVQgKgWAAgbQAAgbAJgWQAJgWASgMQATgMAWAAQAQAAANAHQANAHAIALIAAhaIAfAAIAAD6IgdAAIAAgXQgRAbgiAAQgVAAgTgMgAQEg1QgOARAAAkQAAAiAPARQAOASAUAAQAUAAAPgRQAOgQAAgiQAAglgPgRQgOgRgVAAQgVAAgNAQgAErBPQgQgOAAgXQAAgNAHgLQAGgLAJgHQAKgGAMgDQAKgDASgCQAlgEASgGIAAgIQAAgTgJgIQgMgKgXAAQgWAAgKAHQgKAIgFATIgegEQAEgTAJgMQAKgMARgGQASgHAYAAQAXAAAOAGQAPAFAHAIQAHAJACAMQACAIAAAVIAAAoQAAArACALQACALAGALIghAAQgEgKgCgNQgRAPgQAGQgPAGgTAAQgdAAgRgPgAFnAKQgTADgHADQgIAEgFAHQgEAGAAAIQAAAMAKAJQAJAIASAAQASAAANgIQAOgIAHgNQAFgLAAgUIAAgKQgRAFgiAFgAo+A/QgSgZAAgmQAAgsAYgZQAYgaAkAAQAoAAAYAbQAXAbgBA2Ih4AAQAAAVALAMQALAMARAAQALAAAIgGQAIgGADgOIAwAIQgJAagUAOQgUAOgeAAQgvAAgXgfgAoTgvQgLAMAAATIBIAAQAAgUgLgLQgKgLgPAAQgPAAgKALgAwkBPQgQgOAAgXQAAgNAGgLQAGgLAKgHQAKgGAMgDQAJgDASgCQAmgEARgGIAAgIQAAgTgIgIQgMgKgXAAQgWAAgKAHQgLAIgFATIgegEQAEgTAKgMQAJgMASgGQASgHAXAAQAXAAAPAGQAOAFAHAIQAHAJADAMQABAIAAAVIAAAoQAAArACALQACALAGALIggAAQgFgKgBgNQgRAPgQAGQgQAGgSAAQgeAAgQgPgAvoAKQgTADgIADQgIAEgEAHQgEAGAAAIQAAAMAJAJQAJAIASAAQASAAAOgIQAOgIAGgNQAFgLAAgUIAAgKQgRAFghAFgA0uBPQgTgPgFgcIAegFQADASAMAKQALAKAVAAQAWAAAKgJQAKgJAAgLQAAgLgJgGQgGgEgZgGQgigJgNgFQgNgGgHgLQgHgLAAgOQAAgMAGgKQAFgKAKgHQAHgFAMgEQANgEAOAAQAVAAARAGQAQAGAHALQAIAKADASIgeAEQgCgOgKgIQgKgIgSAAQgVAAgJAHQgJAHAAAKQAAAGAEAFQADAFAIADIAcAIQAgAIANAGQANAFAHAKQAIALAAAPQAAAQgJANQgJAOgRAIQgRAHgVAAQgkAAgSgPgA3SBXQgKgFgDgJQgEgJAAgbIAAhoIgXAAIAAgYIAXAAIAAgtIAfgSIAAA/IAeAAIAAAYIgeAAIAABpQAAANABAEQACAEAEACQADACAHAAIANgBIAFAbQgNADgKAAQgRAAgJgFgAYeBaIAAgjIAjAAIAAAjgAM0BaIAAhyQAAgSgDgIQgDgIgIgFQgIgFgKAAQgTAAgNANQgNAMAAAcIAABpIgeAAIAAh1QAAgVgIgKQgHgKgRAAQgNAAgLAHQgMAGgEAOQgFANAAAZIAABdIgfAAIAAi1IAbAAIAAAaQAJgOAOgIQAOgIASAAQAVAAANAJQAMAIAGAPQAVggAjAAQAbAAAOAPQAPAPAAAfIAAB8gAHoBaIAAi1IAcAAIAAAcQAKgUAJgGQAJgGALAAQAQAAAQAKIgLAdQgLgHgMAAQgKAAgIAGQgIAGgDALQgFAQAAAUIAABegAC0BaIgkiLIglCLIggAAIg4i1IAgAAIAoCPIAJglIAdhqIAgAAIAkCLIApiLIAeAAIg4C1gArSBaIhJi1IAyAAIAsB7IAFgQIAFgPIAjhcIAxAAIhIC1gA5ABaIAAj6IAhAAIAAD6gA2MhcQAJgEAFgIQAEgIABgPIgRAAIAAgjIAhAAIAAAcQAAAXgFAKQgHAOgQAHg" },
                    { msg: "Mrs Lam grasped the walking stick weakly.", shape: "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" },                    
                    { msg: "You did well on the test.", shape: "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" },
                    
                ],
                verbs: [                    
                    { msg: "The deer lived in the forest.", shape: "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" },
                    
                    { msg: "Be safe, and don’t get into trouble.", shape: "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" },
                    { msg: "I believe I have lost my pen.", shape: "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" },
                    { msg: "Grate the cheese well.", shape: "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" },
                    { msg: "He leafed through the magazine out of boredom.", shape: "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" },
                    { msg: "He refused to shell out money for a new TV.", shape: "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" },
                    { msg: "You may seek advice from the guidance counsellor.", shape: "A4WIuQgUgOABgeIAeAFQACAOAJAGQALAIAUAAQAVAAAMgIQALgJAEgPQADgJAAgfQgUAZgfAAQglAAgUgbQgVgcAAglQAAgaAJgWQAKgWASgMQASgMAYAAQAgAAAVAaIAAgWIAcAAIAACdQAAArgJARQgIASgTAKQgTAKgbAAQghAAgUgPgA4BFkQgOARAAAgQAAAkAOAQQAOARAVAAQAWAAAOgQQAOgRAAgjQAAghgOgQQgPgRgVAAQgVgBgOARgATZHfQgYgYAAguQAAgzAcgYQAYgUAhAAQAmAAAYAZQAXAYAAArQAAAjgKAVQgLATgUALQgUAMgYgBQgmABgXgZgATwFlQgPARAAAjQAAAjAPARQAPARAXAAQAXAAAQgRQAPgSAAgjQAAgigPgRQgQgRgXAAQgXAAgPARgAN7HfQgXgZAAgrQAAgvAYgZQAXgZAmAAQAkAAAXAZQAXAYAAAuIAAAIIiHAAQACAdAPARQAPAPAXAAQARAAAMgJQAMgIAHgUIAfAEQgHAcgVAPQgUAPgfAAQgoABgYgZgAOWFiQgPAOgBAYIBlAAQgCgYgKgLQgOgSgYAAQgVAAgOAPgALLHpQgTgPgFgcIAegGQADATAMAJQALAKAVAAQAWABAKgJQAKgJAAgMQAAgKgJgGQgGgEgZgHQgigIgNgGQgNgHgHgKQgHgMAAgNQAAgMAGgKQAFgLAKgGQAHgGAMgDQANgEAOAAQAVAAARAGQAQAGAHALQAIAKADASIgeAEQgCgOgKgIQgKgIgSAAQgVAAgJAHQgJAHAAAKQAAAFAEAGQADAEAIAEIAcAIQAgAIANAGQANAGAHAKQAIAKAAAQQAAAPgJAOQgJAOgRAHQgRAIgVgBQgkAAgSgOgAFaHyQgOgHgHgJQgHgJgCgOQgCgJAAgUIAAhwIAeAAIAABlQAAAYACAIQADAMAKAIQAJAGAOAAQAOAAAMgHQAMgHAFgMQAFgMAAgYIAAhhIAfAAIAAC2IgcAAIAAgbQgVAfgkgBQgQAAgOgFgACEHfQgYgYAAguQAAgzAcgYQAYgUAhAAQAmAAAYAZQAXAYAAArQAAAjgKAVQgLATgUALQgUAMgYgBQgmABgXgZgACbFlQgPARAAAjQAAAjAPARQAPARAXAAQAXAAAQgRQAPgSAAgjQAAgigPgRQgQgRgXAAQgXAAgPARgAgpHgQgXgZAAgtQAAgeAKgWQAKgWAUgLQAUgLAWAAQAeAAATAPQASAPAGAcIgeAEQgFgTgKgJQgLgJgQAAQgWAAgOARQgPARAAAkQAAAkAOARQAOAQAWAAQASABAMgMQAMgLADgXIAfAEQgFAfgVASQgUARgeAAQgkAAgXgXgAlNHfQgXgZAAgrQAAgvAYgZQAXgZAmAAQAkAAAXAZQAXAYAAAuIAAAIIiHAAQACAdAPARQAPAPAXAAQARAAAMgJQAMgIAHgUIAfAEQgHAcgVAPQgUAPgfAAQgoABgYgZgAkyFiQgPAOgBAYIBlAAQgCgYgKgLQgOgSgYAAQgVAAgOAPgAn7HgQgXgZAAgtQAAgeAKgWQAJgWAUgLQAUgLAYAAQAdAAATAPQATAPAFAcIgeAEQgEgTgLgJQgLgJgPAAQgXAAgPARQgOARAAAkQAAAkAOARQAOAQAWAAQASABAMgMQANgLADgXIAeAEQgFAfgUASQgVARgeAAQglAAgWgXgAuIHpQgQgOAAgYQAAgMAGgLQAGgMAKgGQAKgHAMgDQAJgDASgCQAmgFARgFIAAgJQAAgTgIgHQgMgLgXABQgWAAgKAHQgLAIgFATIgegEQAEgUAKgLQAJgNASgFQASgHAXAAQAXAAAPAGQAOAFAHAIQAHAIADANQABAIAAAVIAAAoQAAAsACALQACALAGALIggAAQgFgKgBgNQgRAOgQAHQgQAFgSAAQgeAAgQgOgAtMGkQgTADgIADQgIADgEAIQgEAGAAAIQAAAMAJAJQAJAHASABQASAAAOgIQAOgIAGgOQAFgKAAgUIAAgLQgRAGghAFgAw1HsQgSgMgKgWQgKgVAAgcQAAgbAJgXQAJgVASgNQASgLAWAAQARAAANAHQAMAHAJALIAAhaIAeAAIAAD7IgcAAIAAgYQgSAbghAAQgWABgSgMgAwuFkQgOARAAAkQAAAjAPARQAPARAUAAQAUAAAOgQQAOgQAAgjQAAglgOgRQgPgRgVAAQgUgBgOARgA1BHyQgOgHgHgJQgHgJgCgOQgCgJAAgUIAAhwIAeAAIAABlQAAAYACAIQADAMAKAIQAJAGAOAAQAOAAAMgHQAMgHAFgMQAFgMAAgYIAAhhIAfAAIAAC2IgcAAIAAgbQgVAfgkgBQgQAAgOgFgAYNH0IAAgjIAjAAIAAAjgAWPH0IAAi2IAcAAIAAAcQAKgUAJgGQAJgGALAAQAQAAAQAKIgLAcQgLgGgMAAQgKgBgIAHQgIAGgDAKQgFARAAATIAABggAR+H0IAAj7IAfAAIAAD7gAQwH0IAAj7IAfAAIAAD7gAJyH0IAAhvQAAgSgEgKQgEgJgJgGQgJgFgMgBQgUAAgOANQgOAMAAAkIAABjIgfAAIAAi2IAcAAIAAAaQAUgeAlAAQARAAAOAGQANAGAHAKQAHAJADANQABAIAAAWIAABwgApWH0IAAhvQAAgSgEgKQgEgJgJgGQgJgFgMgBQgUAAgOANQgOAMAAAkIAABjIgfAAIAAi2IAcAAIAAAaQAUgeAlAAQARAAAOAGQANAGAHAKQAHAJADANQABAIAAAWIAABwgAyeH0IAAi2IAfAAIAAC2gAyeEdIAAgkIAfAAIAAAkgAQWBEQgXgYAAgsQAAgtAYgaQAXgZAmAAQAkAAAXAYQAXAaAAAsIAAAIIiHAAQACAeAPAPQAPAQAXABQARgBAMgIQAMgJAHgUIAfAEQgHAcgVAPQgUAPgfABQgoAAgYgZgAQxg4QgPANgBAYIBlAAQgCgXgKgLQgOgSgYAAQgVAAgOAPgACrBEQgYgYAAgtQAAgyAcgZQAYgUAhAAQAmAAAYAYQAXAZAAArQAAAigKAVQgLAUgUAKQgUAMgYAAQgmAAgXgZgADCg2QgPASAAAjQAAAhAPASQAPASAXAAQAXAAAQgSQAPgRAAgjQAAgigPgRQgQgSgXAAQgXAAgPARgAlMBEQgXgYAAgsQAAgtAXgaQAYgZAlAAQAlAAAXAYQAXAaAAAsIAAAIIiIAAQACAeAPAPQAPAQAXABQARgBAMgIQAMgJAHgUIAgAEQgIAcgUAPQgUAPggABQgoAAgXgZgAkyg4QgOANgCAYIBlAAQgCgXgJgLQgPgSgXAAQgWAAgOAPgAn7BFQgXgZAAgtQAAgdAKgWQAKgWAUgLQAUgLAXAAQAeAAATAPQASAPAGAcIgeAEQgFgSgKgKQgLgJgQAAQgXAAgOARQgPAQAAAkQAAAkAOARQAOAQAXABQASAAAMgMQAMgLADgXIAfAEQgFAfgVASQgUARgeABQglAAgXgYgAutBQQgSgMgKgUQgKgWAAgbQAAgbAJgWQAJgWASgMQATgMAWAAQAQAAANAHQANAGAIAMIAAhaIAfAAIAAD5IgdAAIAAgWQgRAbgiAAQgVAAgTgNgAulg2QgOARAAAkQAAAiAPARQAOASAUAAQAUAAAPgRQAOgQAAgjQAAgkgPgRQgOgSgVAAQgVAAgNARgAyFBOQgQgPAAgWQAAgNAHgMQAGgKAJgHQAKgGAMgEQAKgCASgCQAlgEASgHIAAgIQAAgSgJgIQgMgLgXAAQgWAAgKAIQgKAHgFAUIgegEQAEgTAJgNQAKgLARgHQASgGAYAAQAXAAAOAFQAPAGAHAIQAHAJACAMQACAIAAAUIAAApQAAAqACAMQACALAGAKIghAAQgEgJgCgNQgRAOgQAHQgPAFgTABQgdAAgRgPgAxJAJQgTADgHADQgIAEgFAGQgEAHAAAIQAAAMAKAIQAJAJASAAQASgBANgHQAOgIAHgNQAFgLAAgVIAAgKQgRAGgiAFgAL8BWQgJgGgEgIQgEgJAAgcIAAhnIgWAAIAAgYIAWAAIAAgtIAfgSIAAA/IAfAAIAAAYIgfAAIAABpQAAANACAEQABADAEADQAEACAGAAIAOgBIAEAbQgNADgKAAQgRAAgJgFgAO8BYIAAhyQAAgWgKgLQgKgLgSAAQgOABgMAGQgMAHgFAMQgFANAAAVIAABiIgfAAIAAj5IAfAAIAABaQAVgZAhAAQAUAAAPAIQAPAIAGAOQAHAOAAAaIAABygAI5BYIAAhxQAAgSgDgJQgDgIgIgFQgIgEgLgBQgTAAgMAOQgNAMAAAcIAABoIgfAAIAAh1QAAgUgHgKQgIgLgRAAQgNABgLAGQgLAHgFANQgFANAAAaIAABcIgfAAIAAi0IAcAAIAAAaQAIgOAPgIQAOgIASAAQAUAAANAIQANAJAFAOQAWgfAiAAQAbAAAPAPQAOAPAAAfIAAB7gAAqBYIAAi0IAcAAIAAAbQAKgTAJgGQAJgGALAAQAQAAAQAKIgLAdQgLgIgMAAQgKABgIAGQgIAGgDALQgFAQAAAUIAABdgAguBYIAAicIgcAAIAAgYIAcAAIAAgTQAAgTADgIQAEgMAMgIQALgHATAAQANgBAQAEIgFAaIgSgBQgNAAgGAGQgGAGAAAQIAAARIAjAAIAAAYIgjAAIAACcgApWBYIAAi0IAfAAIAAC0gArTBYIhFi0IAhAAIAnBrIALAlIAMgjIAohtIAgAAIhFC0gApWh+IAAgjIAfAAIAAAjgABsj8IgDgdQAKADAIAAQAKABAGgEQAGgEAEgFQADgFAHgTIACgHIhFi2IAiAAIAlBpQAIAUAFAWQAGgVAHgUIAnhqIAfAAIhFC5QgLAdgHAMQgIAPgKAHQgLAHgPAAQgJAAgLgEgAMJldQgSgYAAgmQAAgtAXgZQAYgaAkAAQApAAAXAbQAXAbgBA3Ih4AAQABAVALAMQALAMAQAAQAMAAAHgHQAIgFAEgPIAwAJQgJAagUAOQgUAOgeAAQgvAAgXgggAMznLQgKAMAAATIBIAAQgBgUgKgMQgKgLgPABQgQAAgKALgAJGldQgSgYAAgmQAAgtAYgZQAYgaAkAAQAoAAAYAbQAXAbgBA3Ih4AAQAAAVALAMQALAMARAAQALAAAIgHQAIgFADgPIAwAJQgJAagUAOQgUAOgeAAQgvAAgXgggAJxnLQgLAMAAATIBIAAQAAgUgLgMQgKgLgPABQgPAAgKALgAGLlNQgVgOgHgaIAwgHQADAOAKAGQAJAIARAAQATAAAJgHQAGgFAAgHQAAgGgDgEQgEgDgMgDQg6gNgQgKQgVgPAAgbQAAgXASgQQATgQAnAAQAlAAASAMQASAMAHAYIgtAIQgDgLgIgFQgIgGgPABQgTAAgIAEQgGAFAAAFQAAAGAFADQAHAFAmAJQAmAIAPANQAPANAAAXQAAAYgUATQgVARgpABQglgBgWgPgAhOlMQgQgOAAgYQAAgNAGgLQAGgKAKgIQAKgGAMgEQAJgCASgCQAlgFARgFIAAgIQAAgUgIgHQgMgKgWAAQgWgBgKAIQgLAIgFATIgegEQAEgUAKgLQAJgMASgGQASgHAXAAQAWAAAPAFQAOAGAHAIQAHAJADAMQABAIAAAUIAAAqQAAAqACAMQACALAGAKIggAAQgFgJgBgNQgRAPgQAFQgPAHgSAAQgeAAgQgPgAgSmRQgTADgIADQgIAEgEAGQgEAHAAAIQAAAMAJAIQAJAJASgBQASAAANgHQAOgIAGgOQAFgKAAgUIAAgMQgRAHggAFgAp7lEQgOgFgHgKQgHgKgCgNQgCgJAAgTIAAhxIAeAAIAABkQAAAZACAIQADAMAKAHQAJAHAOAAQAOAAAMgHQAMgHAFgMQAFgNAAgXIAAhhIAfAAIAAC1IgcAAIAAgaQgVAegkABQgQAAgOgHgAtRlWQgYgZAAgtQAAgzAcgYQAYgUAhAAQAmAAAYAZQAXAYAAArQAAAjgKAUQgLAVgUALQgUAKgYABQgmgBgXgYgAs6nQQgPARAAAjQAAAiAPASQAPARAXAAQAXAAAQgRQAPgSAAgkQAAghgPgRQgQgRgXAAQgXgBgPASgAQ6lCIguhRIgWAXIAAA6IgwAAIAAj6IAwAAIAACFIA4hAIA7AAIg+BDIBCBygAiglCIAAhyQAAgTgDgHQgDgIgIgGQgIgEgKAAQgTgBgNANQgNANAAAcIAABpIgeAAIAAh2QAAgUgIgKQgHgKgRAAQgNgBgLAIQgMAGgEAOQgFANAAAYIAABeIgfAAIAAi1IAbAAIAAAZQAJgNAOgIQAOgIASAAQAVAAANAJQAMAHAGAPQAVgfAjAAQAbAAAOAPQAPAPAAAfIAAB8gAv8lCIAAhpIhhiRIApAAIAxBLQAOAWALAVIAcgsIAwhKIAnAAIhkCRIAABpg" },
                    { msg: "Help me shoo the chickens away!", shape: "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" },
                    { msg: "They intend to marry each other next year.", shape: "AAAI6IgEgeQAJAEAIAAQAKAAAGgEQAHgDADgHQAEgEAGgSIADgIIhFi2IAhAAIAmBpQAHAUAFAWQAGgVAIgUIAmhqIAfAAIhFC4QgLAegGAMQgJAPgKAHQgLAHgPAAQgJAAgJgDgAF3HpQgQgOAAgYQAAgMAHgLQAFgMAKgGQAKgHAMgDQAJgDATgCQAlgFASgFIAAgJQAAgTgJgHQgMgLgXABQgWAAgKAHQgLAIgEATIgfgEQAFgUAJgLQAJgNASgFQASgHAYAAQAWAAAPAGQAPAFAGAIQAHAIADANQABAIAAAVIAAAoQAAAsADALQACALAFALIggAAQgEgKgCgNQgRAOgQAHQgPAFgTAAQgeAAgQgOgAGzGkQgTADgIADQgHADgFAIQgEAGAAAIQAAAMAKAJQAIAHATABQASAAANgIQAOgIAGgOQAGgKAAgUIAAgLQgSAGghAFgAC8HfQgXgZAAgrQAAgvAYgZQAXgZAmAAQAkAAAXAZQAXAYAAAuIAAAIIiHAAQACAdAPARQAOAPAYAAQAQAAAMgJQANgIAGgUIAgAEQgHAcgVAPQgUAPgfAAQgoABgYgZgADXFiQgPAOgCAYIBlAAQgCgYgJgLQgPgSgXAAQgVAAgOAPgAolHfQgYgZAAgrQABgvAXgZQAXgZAmAAQAlAAAWAZQAYAYAAAuIAAAIIiIAAQACAdAPARQAPAPAXAAQARAAAMgJQAMgIAHgUIAgAEQgIAcgUAPQgUAPggAAQgoABgXgZgAoLFiQgOAOgCAYIBlAAQgCgYgJgLQgPgSgXAAQgWAAgOAPgAiqHwQgKgEgEgJQgEgJAAgbIAAhpIgWAAIAAgYIAWAAIAAgtIAfgSIAAA/IAfAAIAAAYIgfAAIAABqQAAANACAEQABAEAEACQAEACAGAAIAOgBIAEAbQgMADgKAAQgRAAgJgGgAKyH0IAAgjIAiAAIAAAjgAI0H0IAAi2IAcAAIAAAcQAKgUAJgGQAJgGALAAQAPAAARAKIgMAcQgKgGgMAAQgKgBgIAHQgIAGgDAKQgGARAAATIAABggAkBH0IgvhIIgvBIIglAAIBChfIg+hXIAnAAIAcAqIAMAVIAPgUIAegrIAkAAIg+BVIBEBhgAqAH0IAAhvQAAgSgEgKQgDgJgJgGQgKgFgMgBQgTAAgPANQgOAMAAAkIAABjIgfAAIAAi2IAcAAIAAAaQAUgeAlAAQARAAAOAGQANAGAIAKQAGAJADANQACAIgBAWIAABwgApBCgIgFgmQAMACAJAAQARAAAHgKQAJgKAEgPIhDiwIgOAqQgNgIgLAAQgJAAgIAGQgGAFgEAOQgEAPgBAuIAAA3IgwAAIAAi0IAtAAIAAAaQALgSAKgHQAJgFAMAAQAQAAAPAJIgCgFIAzAAIArCAIAriAIAyAAIhMDOQgHAPgFAJQgGAIgHAFQgIAGgLADQgKACgOAAQgOAAgNgCgAQwBEQgXgYABgsQAAgtAXgaQAXgZAmAAQAlAAAXAYQAWAaAAAsIAAAIIiHAAQACAeAPAPQAPAQAXABQARgBAMgIQAMgJAHgUIAgAEQgIAcgUAPQgVAPgfABQgoAAgYgZgARLg4QgPANgBAYIBlAAQgCgXgKgLQgOgSgXAAQgWAAgOAPgAJKBEQgYgYAAgtQAAgyAcgZQAYgUAhAAQAlAAAZAYQAXAZAAArQAAAigLAVQgKAUgUAKQgUAMgYAAQgmAAgXgZgAJhg2QgPASAAAjQAAAhAPASQAPASAXAAQAXAAAPgSQAPgRABgjQgBgigPgRQgPgSgXAAQgXAAgPARgAB4BFQgWgZAAgtQgBgdALgWQAJgWAUgLQAUgLAYAAQAdAAATAPQASAPAGAcIgeAEQgFgSgKgKQgLgJgQAAQgXAAgOARQgPAQAAAkQAAAkAPARQAOAQAWABQASAAAMgMQANgLADgXIAeAEQgFAfgUASQgVARgeABQglAAgXgYgAhRBOQgQgPAAgWQAAgNAHgMQAFgKAKgHQAKgGAMgEQAKgCARgCQAlgEARgHIAAgIQAAgSgIgIQgMgLgWAAQgWAAgKAIQgLAHgFAUIgdgEQADgTAKgNQAJgLASgHQASgGAYAAQAVAAAPAFQAPAGAGAIQAIAJACAMQACAIAAAUIAAApQAAAqACAMQABALAHAKIghAAQgFgJgBgNQgRAOgPAHQgPAFgTABQgdAAgRgPgAgVAJQgTADgHADQgJAEgEAGQgEAHAAAIQAAAMAKAIQAIAJATAAQARgBANgHQAOgIAHgNQAEgLAAgVIAAgKQgRAGggAFgAkMBEQgXgYAAgsQAAgtAXgaQAYgZAmAAQAkAAAXAYQAXAaAAAsIAAAIIiIAAQADAeAPAPQAOAQAXABQARgBAMgIQANgJAGgUIAgAEQgHAcgVAPQgUAPggABQgoAAgXgZgAjxg4QgPANgCAYIBlAAQgCgXgJgLQgOgSgYAAQgVAAgOAPgAwKBOQgPgQgBgXQAAgQAIgLQAHgMANgGQANgGAagFQAhgHAOgFIAAgFQAAgNgIgHQgGgFgUAAQgMgBgHAGQgIAEgEANIgrgIQAHgaASgMQARgNAkAAQAgAAAQAHQAPAIAHAMQAGALAAAgIAAA3QAAAYACALQACAMAHAMIgvAAIgGgNIgBgGQgNALgOAHQgNAFgQABQgcAAgRgPgAvGAIQgUAFgGAEQgKAGABALQgBAKAIAHQAHAIAMAAQANAAAMgJQAIgGAEgKQACgGAAgRIAAgKIgeAHgAMXBWQgKgGgEgIQgDgJAAgcIAAhnIgXAAIAAgYIAXAAIAAgtIAegSIAAA/IAfAAIAAAYIgfAAIAABpQAAANACAEQACADADADQAEACAGAAIAOgBIAEAbQgNADgJAAQgSAAgIgFgATlBYIAAi0IAcAAIAAAbQALgTAJgGQAJgGALAAQAQAAAPAKIgLAdQgLgIgLAAQgKABgIAGQgIAGgEALQgEAQAAAUIAABdgAPWBYIAAhyQAAgWgKgLQgKgLgSAAQgOABgMAGQgMAHgFAMQgFANAAAVIAABiIgfAAIAAj5IAfAAIAABaQAWgZAgAAQAUAAAPAIQAPAIAHAOQAGAOAAAaIAABygAGPBYIAAhyQAAgWgKgLQgKgLgSAAQgOABgMAGQgMAHgFAMQgFANAAAVIAABiIgfAAIAAj5IAfAAIAABaQAWgZAgAAQAVAAAOAIQAPAIAGAOQAHAOAAAaIAABygAtNBYIAAi0IAtAAIAAAaQALgSAKgHQAJgFAMAAQAQAAAPAJIgPAqQgMgIgKAAQgKAAgHAGQgIAFgDAOQgFAPAAAuIAAA3gAxtBYIAAhmQABgbgGgIQgGgLgOABQgKgBgJAHQgJAGgEAMQgDAMgBAYIAABXIgvAAIAAhiQAAgbgDgHQgDgIgFgEQgGgDgJAAQgLAAgJAFQgJAHgEALQgEALAAAZIAABYIgvAAIAAi0IAsAAIAAAZQAXgdAiAAQARAAAMAHQANAHAJAPQALgPAOgHQAOgHAQAAQAUAAAOAIQANAIAIAQQAEALAAAaIAABzgAnwj8IgDgdQAKADAHAAQAKABAHgEQAGgEAEgFQADgFAGgTIADgHIhFi2IAiAAIAlBpQAHAUAGAWQAGgVAHgUIAnhqIAeAAIhEC5QgLAdgHAMQgIAPgKAHQgLAHgPAAQgJAAgLgEgAOolWQgYgZAAgtQAAgzAcgYQAYgUAhAAQAmAAAYAZQAXAYAAArQAAAjgLAUQgKAVgUALQgUAKgYABQgmgBgXgYgAO/nQQgPARAAAjQAAAiAPASQAPARAXAAQAXAAAQgRQAPgSAAgkQAAghgPgRQgQgRgXAAQgXgBgPASgAIylJQgSgNgKgUQgKgWAAgcQAAgbAJgWQAJgXASgMQASgLAXAAQAQAAANAHQAMAHAJALIAAhaIAfAAIAAD6IgdAAIAAgWQgRAbgiAAQgVgBgTgLgAI5nRQgNARAAAkQAAAjAOARQAPARAUAAQAUAAAOgQQAPgQAAgiQgBgmgOgRQgOgRgWAAQgUAAgOAQgACflWQgXgYAAgsQAAgvAYgZQAXgZAlAAQAlAAAXAZQAXAYAAAtIAAAIIiHAAQABAeAPAQQAQARAXgBQAQABANgKQALgJAIgTIAfAEQgIAcgUAPQgUAQgfAAQgogBgYgYgAC6nUQgPAPgBAXIBlAAQgCgWgKgMQgOgSgYAAQgWAAgNAOgAqklWQgXgYAAgsQAAgvAYgZQAXgZAmAAQAkAAAXAZQAXAYAAAtIAAAIIiHAAQABAeAQAQQAPARAXgBQAQABAMgKQANgJAGgTIAgAEQgHAcgVAPQgUAQgfAAQgogBgYgYgAqJnUQgPAPgBAXIBkAAQgBgWgKgMQgOgSgYAAQgVAAgOAOgANRlFQgJgEgEgJQgEgJAAgbIAAhpIgWAAIAAgYIAWAAIAAgtIAfgTIAABAIAeAAIAAAYIgeAAIAABqQAAANABAEQACAEAEACQADACAHAAIANgBIAFAbQgNADgKAAQgRAAgJgGgABIlFQgKgEgEgJQgEgJAAgbIAAhpIgWAAIAAgYIAWAAIAAgtIAfgTIAABAIAfAAIAAAYIgfAAIAABqQAAANACAEQABAEAEACQAEACAGAAIAOgBIAEAbQgMADgKAAQgSAAgIgGgAHKlCIAAhuQAAgTgFgJQgDgKgJgFQgJgGgMABQgUAAgOAMQgOANgBAiIAABjIgeAAIAAi1IAcAAIAAAaQATgeAmAAQARAAAOAGQANAFAHAKQAHAKACANQACAJAAAVIAABvgAgblCIAAhuQAAgTgFgJQgDgKgJgFQgJgGgMABQgUAAgOAMQgOANgBAiIAABjIgeAAIAAi1IAcAAIAAAaQATgeAmAAQARAAAOAGQANAFAHAKQAHAKACANQABAJAAAVIAABvgAjflCIAAi1IAgAAIAAC1gAr+lCIAAhyQgBgYgJgKQgKgKgTAAQgOgBgLAIQgMAGgFANQgGAMAAAVIAABjIgeAAIAAj6IAeAAIAABaQAWgZAgAAQAVAAAOAIQAPAIAHAOQAGAOAAAbIAABygAwGlCIAAjcIhTAAIAAgeIDHAAIAAAeIhTAAIAADcgAjfoYIAAgkIAgAAIAAAkg" },
                    { msg: "Candice mulled over the task.", shape: "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" },
                    { msg: "Can you piece the puzzle together?", shape: "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" },
                    { msg: "Prepare to be wowed by the performance!", shape: "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" },
                    { msg: "Mr Tan proved the class wrong.", shape: "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" },
                    { msg: "I realise I’ve made a mistake.", shape: "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" },
                    
                ],
                adjectives: [                    
                    { msg: "The cowardly dog hid under the chair.", shape: "AQTE+QgQgOAAgXQAAgNAGgLQAHgLAJgHQAKgHAMgDQAJgDATgCQAlgEASgGIAAgIQAAgTgJgIQgMgKgXAAQgWAAgKAHQgLAIgEATIgfgEQAFgTAJgMQAKgMARgGQASgHAXAAQAYAAAOAGQAOAFAIAIQAGAJADAMQACAIgBAVIAAApQAAArACALQADALAFALIggAAQgEgKgCgNQgRAPgQAGQgQAGgSAAQgeAAgQgPgARPD5QgTADgIADQgHAEgFAHQgEAGAAAIQAAAMAJAJQAKAIARAAQATAAANgIQAOgIAGgNQAGgLAAgUIAAgLQgRAGgiAFgAKpE1QgWgZAAgtQgBgeALgWQAJgWAUgLQAUgLAXAAQAeAAATAPQASAPAGAcIgeAEQgFgSgKgJQgLgKgQAAQgWAAgPARQgPARAAAkQAAAkAPARQAOARAWAAQASAAAMgMQANgLACgXIAfAEQgFAfgUASQgVASgeAAQglAAgXgYgAGGE0QgYgYAAgsQABguAXgaQAXgZAmAAQAlAAAWAZQAYAZAAAtIAAAIIiIAAQACAeAPAQQAPAQAXAAQARAAAMgJQAMgJAHgUIAgAEQgIAcgUAPQgUAQggAAQgoAAgXgZgAGgC3QgOAOgCAYIBlAAQgCgXgJgMQgPgSgXAAQgWAAgOAPgAk1E0QgXgYAAgsQAAguAXgaQAYgZAmAAQAkAAAXAZQAXAZAAAtIAAAIIiIAAQACAeAPAQQAQAQAWAAQASAAALgJQAMgJAIgUIAfAEQgHAcgVAPQgUAQggAAQgoAAgXgZgAkbC3QgOAOgCAYIBmAAQgDgXgJgMQgPgSgXAAQgWAAgOAPgAnqFBQgRgMgKgVQgLgWABgcQgBgbAKgWQAJgWASgMQASgMAWAAQARAAANAHQAMAHAJALIAAhaIAeAAIAAD7IgdAAIAAgXQgRAbghAAQgWAAgTgMgAniC5QgOARAAAkQAAAjAPARQAOASAVAAQATAAAPgRQAOgQAAgiQAAgmgOgRQgPgRgVAAQgUAAgOAQgAtqFHQgOgGgHgKQgGgJgDgOQgCgJAAgTIAAhxIAeAAIAABlQAAAYACAIQAEANAJAHQAJAGAOAAQAOAAAMgHQAMgHAFgMQAGgMAAgYIAAhhIAeAAIAAC2IgcAAIAAgbQgUAfglAAQgQAAgOgGgAySFBQgSgMgKgVQgKgWAAgcQAAgbAJgWQAJgWASgMQASgMAXAAQAQAAANAHQAMAHAJALIAAhaIAfAAIAAD7IgdAAIAAgXQgRAbgiAAQgWAAgSgMgAyLC5QgOARABAkQgBAjAPARQAPASAUAAQAUAAAOgRQAPgQAAgiQAAgmgPgRQgPgRgVAAQgUAAgOAQgABsFGQgKgFgEgJQgDgJAAgbIAAhpIgXAAIAAgYIAXAAIAAgtIAegSIAAA/IAfAAIAAAYIgfAAIAABqQABANABAEQACAEAEACQADACAHAAIANgBIAEAbQgNADgKAAQgRAAgIgFgAWbFJIAAgjIAjAAIAAAjgAUdFJIAAi2IAcAAIAAAcQALgUAJgGQAJgGALAAQAQAAAPAKIgKAdQgLgHgMAAQgKAAgIAGQgIAGgEALQgEAQAAAUIAABfgATQFJIAAi2IAfAAIAAC2gAPAFJIAAhzQAAgXgKgLQgKgKgSAAQgOAAgMAHQgMAHgFAMQgFAMAAAVIAABkIgfAAIAAj7IAfAAIAABaQAWgZAgAAQAVAAAOAIQAPAIAHAOQAGAOAAAbIAABzgAErFJIAAhzQAAgXgKgLQgKgKgSAAQgOAAgMAHQgMAHgFAMQgFAMAAAVIAABkIgfAAIAAj7IAfAAIAABaQAVgZAhAAQAUAAAPAIQAPAIAHAOQAGAOAAAbIAABzgAiAFJIAAi2IAcAAIAAAcQALgUAJgGQAIgGALAAQAQAAAQAKIgLAdQgLgHgLAAQgLAAgHAGQgJAGgDALQgFAQAAAUIAABfgApSFJIAAhvQAAgSgEgKQgEgJgIgGQgJgFgNAAQgUAAgOAMQgOANAAAjIAABjIgfAAIAAi2IAcAAIAAAaQAUgeAmAAQAQAAAOAGQANAGAIAKQAGAJADANQABAJABAVIAABwgAz7FJIAAi2IAfAAIAAC2gA1JFJIAAhzQABgXgLgLQgKgKgRAAQgOAAgNAHQgLAHgGAMQgEAMAAAVIAABkIggAAIAAj7IAgAAIAABaQAVgZAhAAQAUAAAPAIQAPAIAGAOQAHAOAAAbIAABzgATQByIAAgkIAfAAIAAAkgAz7ByIAAgkIAfAAIAAAkgAUOgWQgUgPABgdIAeAEQABAOAKAGQALAJATAAQAWAAAMgJQALgIAEgQQACgJABgeQgVAYgeAAQglAAgUgbQgVgbAAgmQAAgaAJgWQAJgWATgMQASgMAXAAQAhAAAUAaIAAgWIAcAAIAACdQABArgJARQgJASgSAKQgTAKgcAAQggAAgUgOgAUjjhQgPARAAAhQABAjAOARQAOAQAVAAQAWAAAOgQQAOgQAAgjQAAgigOgQQgQgRgUAAQgVAAgOAQgAJUgKIgFgmQAMACAJAAQAQAAAIgKQAIgKAFgPIhFi2IAzAAIArCBIAqiBIAyAAIhMDPQgGAPgFAJQgGAIgHAFQgIAGgLADQgLACgNAAQgOAAgNgCgARKhmQgYgYABguQgBgyAcgZQAYgUAhAAQAmAAAYAZQAYAYAAArQAAAjgLAVQgLAUgUALQgTALgZAAQglAAgYgZgARhjgQgPARAAAjQAAAjAPARQAQASAWAAQAYAAAPgSQAPgRAAgkQAAgigPgRQgPgRgYAAQgWAAgQARgAOXhZQgTgMgJgVQgLgWAAgcQABgbAIgWQAKgWARgMQATgMAWAAQARAAAMAHQANAHAJALIAAhaIAeAAIAAD7IgcAAIAAgXQgSAbgiAAQgVAAgSgMgAOejhQgOARAAAkQAAAjAPARQAPASATAAQAVAAAOgRQAOgQAAgiQAAgmgPgRQgOgRgVAAQgVAAgNAQgAEuhmQgVgaAAgtQgBguAWgYQAWgYAhAAQAeAAAWAZIAAhaIAwAAIAAD7IgsAAIAAgbQgLAQgPAHQgPAIgQAAQgfAAgXgZgAFVjYQgMANAAAbQABAdAHANQAMATAVAAQAQAAAMgOQALgOAAgcQABgggLgNQgMgOgRAAQgSAAgLAOgAgjhcQgQgQAAgXQAAgPAIgMQAGgMAOgHQANgGAYgFQAigGANgGIAAgEQAAgOgHgGQgHgGgTAAQgMAAgIAFQgHAFgEANIgrgIQAHgbASgMQASgNAiAAQAgAAAQAIQAQAHAHAMQAGAMAAAfIAAA4QAAAYACALQACAMAHANIgwAAIgFgOIgBgGQgNAMgOAGQgOAGgPAAQgcAAgQgPgAAfihQgTAEgHAEQgIAHAAAKQAAAKAHAIQAHAHALAAQANAAANgJQAIgGADgJQACgHAAgRIAAgJIgeAHgAnphYQgXgMgMgVQgMgWABggQgBgXAMgXQAMgWAWgMQAVgMAbAAQApAAAbAbQAaAbAAAoQAAAqgaAbQgcAbgoAAQgYAAgXgLgAnZjVQgOAOAAAbQAAAbAOAOQANAPASAAQATAAANgPQAMgOAAgbQAAgbgMgOQgNgPgTAAQgSAAgNAPgArChmQgYgZAAgtQAAgtAYgZQAYgZAoAAQAiAAATAPQAUAOAIAdIgvAIQgDgOgHgHQgKgHgNAAQgSAAgLAMQgKANAAAdQAAAgALANQAKAOATAAQANAAAKgIQAIgIADgTIAwAIQgIAhgVAQQgUARgkAAQgnAAgYgZgAvohmQgWgYAAgsQgBguAYgaQAYgZAlAAQAkAAAYAZQAXAZgBAtIAAAIIiHAAQACAeAPAQQAPAQAXAAQARAAAMgJQAMgJAHgUIAfAEQgHAcgVAPQgUAQgfAAQgoAAgYgZgAvNjjQgPAOgBAYIBlAAQgCgXgJgMQgPgSgYAAQgVAAgOAPgAH5hRIAAj7IAwAAIAAD7gACZhRIAAi2IAtAAIAAAaQALgSAKgGQAJgGALAAQARAAAPAJIgPAqQgMgIgLAAQgKAAgHAGQgHAFgEAPQgEAOAAAvIAAA4gAiohRIgfh1IgfB1IguAAIg6i2IAvAAIAhB3IAgh3IAvAAIAdB3IAjh3IAvAAIg6C2gAxChRIAAhzQAAgXgKgLQgKgKgSAAQgOAAgMAHQgMAHgFAMQgFAMAAAVIAABkIgfAAIAAj7IAfAAIAABaQAWgZAgAAQAVAAAOAIQAPAIAGAOQAHAOAAAbIAABzgA1KhRIAAjdIhSAAIAAgeIDHAAIAAAeIhTAAIAADdg" },                    
                    
                    { msg: "She is a dear friend of mine.", shape: "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" },
                    { msg: "Let me offer you some friendly advice.", shape: "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" },
                    { msg: "What a great day!", shape: "ASTCeIgDgdQAKADAHAAQAKABAHgEQAGgEAEgFQADgFAGgTIADgHIhFi1IAiAAIAlBoQAHAUAGAWQAGgVAHgUIAmhpIAfAAIhEC4QgLAdgHAMQgIAPgKAHQgLAHgPAAQgJAAgLgEgAiXCTQgTgQAAgZIAAgFIA3AGQABAKAFADQAGAFAQABQASAAAKgGQAGgEADgIQADgHgBgQIAAgaQgVAdghAAQgkAAgWgeQgQgZAAgkQAAgtAVgYQAWgYAhAAQAhAAAXAdIAAgZIAsAAIAACiQAAAggFAQQgFAQgKAJQgKAJgPAFQgQAFgYAAQgvAAgTgPgAh0guQgMANAAAcQAAAcAMAOQALANARgBQARAAAMgNQAMgOAAgaQAAgcgMgOQgLgOgSABQgRAAgLANgAPYBOQgQgOgBgYQABgNAGgLQAGgKAKgHQAJgGAMgEQAKgCASgCQAlgFASgFIAAgIQAAgUgJgHQgMgKgXAAQgVgBgKAIQgLAIgFATIgegEQAEgUAJgLQAKgMARgGQATgHAXAAQAXAAAPAFQAOAGAHAIQAHAJACAMQACAIAAAUIAAApQAAAqACAMQACALAGAKIghAAQgEgJgCgNQgRAPgPAFQgQAHgTAAQgdAAgQgPgAQUAJQgTADgIADQgIAEgFAGQgDAHAAAIQAAAMAJAIQAJAJASgBQASAAANgHQAPgIAGgOQAFgKAAgUIAAgLQgRAGghAFgAMrBRQgTgNgJgUQgLgWAAgbQABgbAIgWQAKgXARgMQATgLAWAAQARAAAMAHQANAHAJALIAAhaIAeAAIAAD5IgcAAIAAgWQgSAbgiAAQgVgBgSgLgAMyg2QgOARAAAkQAAAiAPARQAPARATAAQAVAAAOgQQAOgQAAgiQAAglgPgRQgOgRgVAAQgVAAgNAQgAJWBYQgKgEgGgHQgEgHgCgMQgCgIAAgaIAAhNIgVAAIAAgnIAVAAIAAgkIAxgcIAABAIAgAAIAAAnIggAAIAABIQAAAVABAFQABADADACQADADAFAAQAGAAANgFIAFAlQgSAIgUAAQgOAAgKgFgAF9BNQgQgPAAgXQAAgPAIgMQAHgMANgGQANgHAZgEQAigGANgGIAAgEQAAgOgHgGQgHgHgTABQgMAAgIAFQgHAEgEANIgsgHQAIgbARgNQASgMAjAAQAhAAAQAIQAPAHAGAMQAHAMAAAfIAAA3QgBAYADALQACALAGANIgvAAIgFgNIgCgHQgMANgOAFQgOAHgPAAQgcgBgRgPgAHAAJQgTAEgGAEQgKAGAAALQAAAKAHAHQAIAIALAAQANAAAMgJQAJgHADgJQACgGAAgRIAAgJIgeAHgAC7A9QgSgYAAglQAAgtAYgZQAYgaAkAAQAoAAAYAbQAWAbgBA2Ih3AAQAAAVALAMQALAMAQAAQAMAAAHgHQAJgFADgPIAwAJQgJAagUAOQgUAOgeAAQgvAAgXgggADlgwQgKAMAAATIBIAAQgBgUgKgMQgKgLgPABQgPAAgLALgAnGBOQgQgOAAgYQAAgNAHgLQAGgKAJgHQAKgGAMgEQAJgCASgCQAmgFARgFIAAgIQABgUgJgHQgMgKgXAAQgWgBgKAIQgKAIgGATIgdgEQADgUAKgLQAKgMARgGQASgHAXAAQAYAAAOAFQAOAGAIAIQAGAJADAMQABAIABAUIAAApQAAAqABAMQACALAHAKIghAAQgFgJgBgNQgRAPgQAFQgQAHgSAAQgeAAgQgPgAmKAJQgTADgHADQgJAEgEAGQgEAHAAAIQAAAMAJAIQAKAJARgBQASAAAOgHQAOgIAHgOQAEgKAAgUIAAgLQgQAGgiAFgAtKBOQgQgOgBgYQABgNAGgLQAGgKAKgHQAJgGAMgEQAKgCASgCQAlgFASgFIAAgIQAAgUgJgHQgMgKgXAAQgVgBgKAIQgLAIgFATIgegEQAEgUAJgLQAKgMARgGQATgHAXAAQAXAAAPAFQAOAGAHAIQAHAJACAMQACAIAAAUIAAApQAAAqACAMQACALAGAKIghAAQgEgJgCgNQgRAPgPAFQgQAHgTAAQgdAAgQgPgAsOAJQgTADgIADQgIAEgFAGQgDAHAAAIQAAAMAJAIQAJAJASgBQASAAANgHQAPgIAGgOQAFgKAAgUIAAgLQgRAGghAFgAp3BVQgJgEgEgJQgEgJAAgbIAAhoIgXAAIAAgYIAXAAIAAgtIAfgTIAABAIAeAAIAAAYIgeAAIAABpQAAANABAEQACAEAEACQADACAHAAIANgBIAFAbQgNADgKAAQgRAAgJgGgAVMBYIAAgiIAjAAIAAAigAAtBYIAAi0IAtAAIAAAaQALgTAKgGQAJgFALAAQARAAAPAJIgPAqQgMgIgLAAQgKAAgHAFQgHAGgEAOQgEAPAAAtIAAA4gAudBYIAAhxQgBgYgJgKQgKgKgTAAQgOgBgLAIQgMAGgFANQgGAMAAAVIAABiIgeAAIAAj5IAeAAIAABaQAWgZAgAAQAVAAAOAIQAPAIAHAOQAGAOAAAbIAABxgAySBYIg1i+IgIgdIgHAdIg2C+IghAAIhCj5IAiAAIAmCjIAKA0IALgvIAwioIAoAAIAkB/QAOAuAFAqQAFgZAIgdIAnihIAiAAIhFD5gAVUAbIgKiEIAAg4IAmAAIAAA4IgICEg" },
                    { msg: "We’ve landed ourselves in a hairy situation.", shape: "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" },
                    { msg: "They stared out at the peaceful sea.", shape: "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" },
                    { msg: "Jean looks poorly today.", shape: "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" },
                    { msg: "The sickly man struggled to walk.", shape: "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" },
                    { msg: "Those two boys look similar.", shape: "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" },
                    { msg: "It looks like it’ll be sunny all day.", shape: "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" },
                    { msg: "It is unusual for him to be up this early.", shape: "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" },
                    { msg: "This is one of the family’s yearly traditions.", shape: "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" },
                    
                ]
            },
            {
                sentences: [
                    
                    { highlights: [{ pos: { x: -120, y: -60, width: 120 }, type: WORD_TYPE.ADJECTIVE }, { pos: { x: 65, y: -20, width: 90 }, type: WORD_TYPE.ADJECTIVE }], msg: "The ageing[adjective] man enjoys a breakfast of aged[adjective] cheese every day.", shape: "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" },
                    { highlights: [{ pos: { x: -15, y: -60, width: 60 }, type: WORD_TYPE.NOUN }, { pos: { x: -150, y: -20, width: 110 }, type: WORD_TYPE.VERB }], msg: "With his bat[noun], Dean batted[verb] the ball into the air.", shape: "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" },
                    { highlights: [{ pos: { x: -140, y: -20, width: 80 }, type: WORD_TYPE.ADVERB }, { pos: { x: 60, y: -20, width: 80 }, type: WORD_TYPE.ADJECTIVE }], msg: "He visits the shop daily[adverb] for the daily[adjective] newspaper.", shape: "AFAI7IAAj7IAcAAIAAAXQAKgNANgHQAMgHASAAQAXAAASAMQARAMAKAVQAIAXABAaQAAAbgLAWQgJAXgUAMQgTALgUAAQgQAAgMgGQgMgHgIgJIAABYgAFrFnQgPASAAAjQAAAjAOARQAOAQAVAAQAUAAAOgRQAPgRAAglQAAgjgOgQQgOgSgUAAQgUAAgPATgAhEI7IAAj7IAcAAIAAAXQAKgNAMgHQANgHARAAQAXAAASAMQASAMAIAVQAJAXAAAaQAAAbgKAWQgKAXgTAMQgSALgVAAQgPAAgMgGQgNgHgHgJIAABYgAgZFnQgPASAAAjQAAAjAOARQAPAQASAAQAVAAAOgRQAPgRAAglQAAgjgOgQQgPgSgTAAQgTAAgPATgAIPHhQgXgZABgrQAAgvAXgZQAXgZAmAAQAlAAAXAZQAWAYAAAuIAAAIIiHAAQACAdAPARQAPAPAXAAQARAAAMgJQAMgIAHgUIAgAEQgIAcgUAPQgVAPgfAAQgoABgYgZgAIqFkQgPAOgBAYIBlAAQgCgYgKgLQgOgSgYAAQgVAAgOAPgACDHrQgQgOAAgYQAAgMAGgLQAHgMAJgGQAKgHAMgDQAJgDASgCQAmgFARgFIAAgJQABgTgJgHQgMgLgXABQgWAAgKAHQgKAIgGATIgdgEQADgUAKgLQAKgNARgFQASgHAXAAQAYAAAOAGQAOAFAIAIQAGAIADANQABAIABAVIAAAoQAAAsABALQACALAHALIghAAQgFgKgBgNQgRAOgQAHQgQAFgSAAQgeAAgQgOgAC/GmQgTADgHADQgJADgEAIQgEAGAAAIQAAAMAJAJQAKAHARABQASAAAOgIQAOgIAHgOQAEgKAAgUIAAgLQgQAGgiAFgAjnHrQgTgPgFgcIAegGQADATAMAJQALAKAVAAQAVABAKgJQALgJAAgMQAAgKgJgGQgHgEgYgHQgjgIgMgGQgNgHgIgKQgGgMAAgNQAAgMAFgKQAGgLAKgGQAHgGAMgDQAMgEAPAAQAVAAAQAGQAQAGAIALQAIAKACASIgdAEQgCgOgKgIQgKgIgSAAQgVAAgJAHQgKAHABAKQAAAFADAGQAEAEAIAEIAcAIQAgAIANAGQANAGAHAKQAIAKAAAQQgBAPgIAOQgKAOgQAHQgRAIgVgBQgkAAgSgOgAqlHhQgXgZAAgrQAAgvAXgZQAYgZAmAAQAkAAAXAZQAXAYAAAuIAAAIIiIAAQACAdAPARQAQAPAWAAQASAAALgJQAMgIAIgUIAfAEQgHAcgVAPQgUAPggAAQgoABgXgZgAqLFkQgOAOgCAYIBmAAQgDgYgJgLQgPgSgXAAQgWAAgOAPgANCH2IAAgjIAjAAIAAAjgALEH2IAAi2IAcAAIAAAcQALgUAJgGQAJgGALAAQAQAAAPAKIgKAcQgMgGgLAAQgKgBgIAHQgIAGgEAKQgEARAAATIAABggAllH2IgkiMIglCMIggAAIg3i2IAfAAIAoCQIAKgmIAchqIAgAAIAkCMIApiMIAfAAIg5C2gAsAH2IAAhvQAAgSgDgKQgEgJgJgGQgJgFgMgBQgUAAgPANQgNAMAAAkIAABjIggAAIAAi2IAcAAIAAAaQAVgeAlAAQAQAAAPAGQANAGAHAKQAGAJADANQACAIAAAWIAABwgAS5CiIgFgmQAMACAJAAQARAAAHgKQAJgKAEgPIhFi1IAzAAIAsCAIAqiAIAyAAIhMDOQgHAPgFAJQgGAIgHAFQgIAGgKADQgMACgNAAQgOAAgNgCgAsECiIgFgmQAMACAJAAQARAAAHgKQAJgKAEgPIhFi1IAzAAIArCAIAriAIAyAAIhMDOQgGAPgGAJQgGAIgHAFQgIAGgLADQgKACgOAAQgOAAgNgCgAM/BQQgQgQgBgXQABgQAHgLQAHgNANgFQANgGAZgFQAjgHANgFIAAgFQgBgNgGgHQgIgFgSAAQgNgBgHAGQgIAEgEANIgrgIQAHgaARgMQATgNAjAAQAgAAAQAHQAPAIAHAMQAGALABAgIgBA3QAAAYADALQACAMAGAMIgvAAIgGgNIgBgGQgMALgPAHQgOAFgPABQgcAAgQgPgAOCAKQgUAFgGAEQgKAGAAALQAAAKAIAHQAHAIAMAAQANAAAMgJQAIgGADgKQACgGABgRIAAgKIgeAHgAJxBGQgXgaAAgsQABguAVgYQAWgYAhAAQAfAAAWAZIAAhaIAvAAIAAD5IgsAAIAAgaQgLAQgPAHQgQAIgPAAQgfAAgWgZgAKXgsQgLAOAAAbQgBAcAJANQALASAVAAQAQAAAMgNQAMgOAAgdQgBgegKgOQgMgNgSAAQgQAAgMANgAFMBGQgWgYAAgtQgBgsAYgaQAYgZAlAAQAkAAAYAYQAXAagBAsIAAAIIiHAAQACAeAPAPQAPAQAXABQARgBAMgIQAMgJAHgUIAfAEQgHAcgVAPQgTAPggABQgoAAgYgZgAFng2QgPANgBAYIBlAAQgCgXgJgLQgPgSgYAAQgVAAgOAPgAlvBGQgYgYABguQgBgxAcgZQAYgUAhAAQAmAAAYAYQAYAZAAArQAAAigLAVQgLAUgUAKQgTAMgZAAQglAAgYgZgAlYg0QgPASAAAiQAAAiAPASQAQASAWAAQAXAAAQgSQAPgRAAgjQAAgigPgRQgQgSgXAAQgWAAgQARgAx+BQQgRgQABgXQAAgQAHgLQAHgNAOgFQAMgGAZgFQAjgHAMgFIAAgFQAAgNgGgHQgIgFgSAAQgNgBgIAGQgGAEgFANIgsgIQAIgaARgMQASgNAkAAQAgAAAQAHQAQAIAGAMQAHALAAAgIgBA3QAAAYADALQACAMAGAMIgwAAIgEgNIgCgGQgNALgNAHQgOAFgQABQgcAAgQgPgAw7AKQgUAFgGAEQgKAGAAALQABAKAHAHQAIAIALAAQANAAAMgJQAJgGACgKQACgGAAgRIAAgKIgdAHgA1MBGQgXgaAAgsQABguAVgYQAWgYAhAAQAeAAAXAZIAAhaIAwAAIAAD5IgtAAIAAgaQgLAQgPAHQgQAIgPAAQgfAAgWgZgA0mgsQgLAOAAAbQAAAcAIANQALASAVAAQAQAAAMgNQAMgOAAgdQAAgegMgOQgLgNgSAAQgQAAgMANgAAyBYQgJgGgDgIQgFgJAAgcIAAhnIgWAAIAAgYIAWAAIAAgtIAggSIAAA/IAeAAIAAAYIgeAAIAABpQAAANABAEQABADAEADQAEACAHAAIANgBIAFAbQgNADgLAAQgQAAgKgFgARfBaIAAj5IAvAAIAAD5gAP+BaIAAi0IAvAAIAAC0gADyBaIAAhyQAAgWgKgLQgKgLgSAAQgOABgMAGQgMAHgFAMQgFANAAAVIAABiIgfAAIAAj5IAfAAIAABaQAWgZAgAAQAVAAAOAIQAPAIAGAOQAHAOAAAaIAABygAi5BaIAAi0IAcAAIAAAbQAKgTAJgGQAKgGAKAAQAQAAAQAKIgLAdQgLgIgMAAQgKABgIAGQgHAGgEALQgFAQAAAUIAABdgAnVBaIAAicIgbAAIAAgYIAbAAIAAgTQAAgTAEgIQAEgMALgIQALgHAVAAQANgBAPAEIgEAaIgSgBQgOAAgGAGQgGAGAAAQIAAARIAkAAIAAAYIgkAAIAACcgAteBaIAAj5IAwAAIAAD5gAu/BaIAAi0IAvAAIAAC0gAP+hzIAAgsIAvAAIAAAsgAu/hzIAAgsIAvAAIAAAsgAS0j6IAAj7IAcAAIAAAYQAKgOANgHQAMgHARAAQAYAAASAMQASAMAJAWQAIAWABAZQgBAcgJAXQgKAWgUAMQgSAMgWAAQgPgBgMgGQgMgHgIgKIAABZgATfnOQgPARAAAkQAAAjAOAQQAPARAUAAQAUAAAPgRQAOgSAAgkQAAgigOgSQgOgRgUAAQgUAAgPATgAP+lUQgYgZAAgtQAAgzAcgYQAYgUAhAAQAlAAAZAZQAXAYAAArQAAAjgLAUQgKAVgUALQgUAKgYABQgmgBgXgYgAQVnOQgPARAAAjQAAAiAPASQAPARAXAAQAXAAAPgRQAPgSABgkQgBghgPgRQgPgRgXAAQgXgBgPASgAKMlKQgTgPgFgdIAegEQADASALAKQAMAKAVgBQAWAAAJgIQALgJAAgLQAAgLgJgGQgGgEgZgGQgjgJgMgGQgOgHgGgLQgHgKAAgOQAAgMAFgKQAGgKAJgIQAIgEAMgFQANgDANAAQAWAAAQAGQARAGAHALQAIAKACASIgdAEQgCgOgKgIQgKgIgSAAQgWAAgJAHQgJAHAAAJQAAAHAFAEQADAGAIACIAcAIQAgAJANAGQANAGAHAKQAHALAAAPQABAPgKAOQgJAOgRAHQgRAIgUAAQgkAAgSgPgAFqlUQgYgYAAgsQAAgvAYgZQAXgZAmAAQAkAAAXAZQAYAYAAAtIAAAIIiIAAQACAeAPAQQAPARAXgBQARABAMgKQAMgJAHgTIAgAEQgIAcgVAPQgTAQggAAQgogBgXgYgAGEnSQgPAPgBAXIBlAAQgCgWgJgMQgPgSgXAAQgWAAgOAOgAjKlKQgTgPgFgdIAegEQADASALAKQAMAKAVgBQAWAAAJgIQALgJAAgLQAAgLgJgGQgGgEgagGQgigJgMgGQgOgHgGgLQgHgKAAgOQAAgMAFgKQAGgKAJgIQAIgEAMgFQANgDANAAQAWAAAQAGQARAGAHALQAIAKACASIgdAEQgCgOgKgIQgKgIgSAAQgWAAgJAHQgJAHAAAJQAAAHAFAEQADAGAIACIAcAIQAgAJANAGQANAGAHAKQAHALABAPQAAAPgKAOQgJAOgRAHQgRAIgUAAQgkAAgSgPgAoplKQgSgPgFgdIAegEQADASALAKQAMAKAVgBQAWAAAJgIQALgJAAgLQAAgLgJgGQgGgEgagGQghgJgNgGQgOgHgGgLQgHgKAAgOQAAgMAGgKQAFgKAJgIQAIgEAMgFQAMgDAOAAQAWAAARAGQAPAGAIALQAIAKACASIgeAEQgBgOgKgIQgKgIgSAAQgVAAgKAHQgIAHgBAJQAAAHAFAEQADAGAIACIAcAIQAgAJANAGQANAGAHAKQAHALAAAPQABAPgKAOQgJAOgRAHQgQAIgVAAQgkAAgTgPgAxHlUQgYgYAAgsQAAgvAYgZQAXgZAmAAQAkAAAXAZQAYAYAAAtIAAAIIiIAAQACAeAPAQQAPARAXgBQARABAMgKQAMgJAHgTIAgAEQgIAcgVAPQgTAQggAAQgogBgXgYgAwtnSQgPAPgBAXIBlAAQgCgWgJgMQgPgSgXAAQgWAAgOAOgABPlDQgJgEgDgJQgEgJgBgbIAAhpIgWAAIAAgYIAWAAIAAgtIAggTIAABAIAeAAIAAAYIgeAAIAABqQgBANACAEQABAEAFACQADACAHAAIANgBIAFAbQgNADgLAAQgQAAgKgGgAkhlDQgJgEgDgJQgEgJgBgbIAAhpIgWAAIAAgYIAWAAIAAgtIAggTIAABAIAeAAIAAAYIgeAAIAABqQgBANACAEQABAEAFACQADACAHAAIANgBIAFAbQgNADgLAAQgQAAgKgGgAOklAIAAhyQAAgYgKgKQgKgKgSAAQgOgBgMAIQgMAGgFANQgFAMAAAVIAABjIgfAAIAAj6IAfAAIAABaQAWgZAgAAQAVAAAOAIQAPAIAHAOQAGAOAAAbIAABygAEPlAIAAhyQAAgYgKgKQgKgKgSAAQgOgBgMAIQgMAGgFANQgFAMAAAVIAABjIgfAAIAAj6IAfAAIAABaQAVgZAhAAQAUAAAPAIQAPAIAGAOQAHAOAAAbIAABygAmFlAIAAi1IAfAAIAAC1gAqClAIAAi1IAfAAIAAC1gAr/lAIhEi1IAgAAIAnBsIAMAlIALgiIAphvIAfAAIhFC1gAyolAIAAh2IiDAAIAAB2IghAAIAAj6IAhAAIAABnICDAAIAAhnIAhAAIAAD6gAmFoWIAAgkIAfAAIAAAkgAqCoWIAAgkIAfAAIAAAkg" },
                    { highlights: [{ pos: { x: -85, y: -60, width: 180 }, type: WORD_TYPE.VERB }, { pos: { x: -150, y: 20, width: 190 }, type: WORD_TYPE.ADJECTIVE }],  msg: "He demanded[verb] an apology from his demanding[adjective] friend.", shape: "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" },
                    { highlights: [{ pos: { x: -25, y: -60, width: 95 }, type: WORD_TYPE.ADJECTIVE }, { pos: { x: -115, y: -20, width: 95 }, type: WORD_TYPE.ADVERB }], msg: "Feeling down[adjective], Matt lay down[adverb] and refused to move.", shape: "AGgICQgXgZABgsQAAguAXgZQAXgZAmAAQAkAAAYAYQAWAZAAAtIAAAIIiHAAQACAeAPAQQAPAQAXAAQARAAAMgJQAMgJAHgTIAgAEQgIAcgUAPQgVAPgfAAQgoAAgYgYgAG7GEQgPAOgBAYIBlAAQgCgXgKgLQgOgSgYAAQgVAAgOAOgAAuICQgXgZgBgtQAAgzAcgYQAYgUAiAAQAlAAAYAYQAYAZgBArQAAAjgKAUQgLAUgTALQgUALgYAAQgnAAgXgYgABGGHQgQASAAAjQAAAiAQASQAPARAXAAQAWAAAQgRQAPgSAAgkQAAghgPgRQgQgSgWAAQgXAAgPARgAoYICQgXgZAAgtQAAgzAcgYQAXgUAiAAQAlAAAYAYQAXAZAAArQABAjgLAUQgLAUgTALQgVALgXAAQgnAAgXgYgAoAGHQgQASAAAjQAAAiAQASQAOARAYAAQAXAAAPgRQAPgSAAgkQAAghgPgRQgPgSgXAAQgYAAgOARgApuITQgKgFgEgIQgDgJAAgcIAAhoIgXAAIAAgYIAXAAIAAgtIAegTIAABAIAfAAIAAAYIgfAAIAABqQABANABAEQACADAEADQADACAGAAIAOgBIAEAbQgNADgKAAQgRAAgIgGgAJfIWIAAgjIAjAAIAAAjgAEXIWIhFi1IAhAAIAmBsIAMAlIAMgjIAohuIAgAAIhGC1gAgpIWIAAhyQAAgTgDgIQgDgIgIgFQgIgFgKAAQgUAAgMANQgNANAAAcIAABpIgfAAIAAh2QAAgUgHgKQgIgLgQAAQgNAAgLAHQgMAHgFANQgEANAAAZIAABeIggAAIAAi1IAcAAIAAAZQAIgNAPgIQAOgIASAAQAUAAANAIQANAIAFAPQAWgfAiAAQAbAAAPAPQAPAPAAAfIAAB8gA19DBIgDgdQAKADAHAAQAKAAAHgDQAGgEAEgGQADgFAGgSIADgHIhFi1IAiAAIAlBoQAHAUAGAWQAGgVAHgUIAnhpIAeAAIhEC3QgLAegHAMQgIAPgKAHQgMAHgOAAQgJAAgLgEgAYWBzQgSgMgKgVQgKgVAAgcQAAgbAJgWQAJgWASgMQATgLAVAAQARAAANAHQANAGAIAMIAAhaIAeAAIAAD5IgcAAIAAgXQgSAbghAAQgWAAgSgMgAYegTQgOARgBAjQABAjAPARQAOARAUAAQAUAAAPgQQAOgRgBgiQAAgkgOgRQgPgSgUAAQgVAAgNARgAVGBnQgYgZAAgsQABgtAXgZQAXgZAmAAQAlAAAWAYQAYAZAAAsIAAAIIiIAAQACAeAPAQQAPAQAXAAQARAAAMgJQAMgJAHgTIAgAEQgIAcgUAPQgUAPggAAQgoAAgXgYgAVggWQgOAOgCAXIBlAAQgCgWgJgLQgPgSgXAAQgWAAgOAOgASVBxQgTgPgEgdIAegFQACATAMAJQAMAKAUAAQAWAAAKgIQALgJAAgMQgBgKgIgGQgHgEgZgHQgigIgNgGQgNgHgHgLQgGgLgBgMQABgMAFgKQAGgLAJgHQAHgFANgEQAMgDAOAAQAWAAAQAGQAQAGAHALQAJAKACASIgeAEQgCgOgJgIQgLgIgRAAQgWAAgJAHQgJAHAAAJQAAAGAEAFQAEAEAHADIAcAIQAgAJANAGQAOAFAGALQAIAKAAAQQAAAPgJAOQgJANgRAIQgRAHgVAAQgkAAgSgOgAPnB5QgPgGgGgJQgHgKgDgNQgCgJAAgUIAAhvIAfAAIAABjQAAAZACAIQADAMAJAHQAKAHAOAAQAOAAAMgHQAMgHAFgMQAFgNAAgXIAAhgIAfAAIAAC0IgcAAIAAgaQgVAeglAAQgPAAgOgGgAKwBnQgWgZAAgsQgBgtAYgZQAYgZAlAAQAkAAAYAYQAWAZAAAsIAAAIIiHAAQACAeAPAQQAPAQAXAAQARAAAMgJQAMgJAHgTIAfAEQgHAcgVAPQgTAPggAAQgoAAgYgYgALLgWQgOAOgCAXIBlAAQgCgWgKgLQgOgSgYAAQgVAAgOAOgAEnBzQgTgMgKgVQgJgVgBgcQABgbAIgWQAKgWARgMQATgLAWAAQARAAAMAHQANAGAIAMIAAhaIAfAAIAAD5IgcAAIAAgXQgSAbghAAQgWAAgSgMgAEugTQgOARAAAjQAAAjAPARQAPARATAAQAVAAAOgQQAOgRAAgiQAAgkgPgRQgOgSgVAAQgVAAgNARgAhzBxQgQgPAAgXQAAgNAHgLQAFgLAKgHQAKgGAMgEQAJgCASgCQAmgFARgGIAAgIQAAgSgIgHQgMgLgXAAQgWAAgKAIQgKAHgGAUIgdgEQADgUAKgMQAJgMASgGQASgGAYAAQAWAAAPAFQAOAGAGAIQAIAIACANQACAIAAATIAAApQAAArACAMQABALAHAKIghAAQgEgJgBgNQgRAOgQAGQgQAGgSAAQgeAAgQgOgAg3AsQgTADgHADQgJADgEAHQgEAHAAAIQAAAMAKAIQAJAIASAAQARAAAOgHQAOgIAHgOQAEgKAAgVIAAgLQgQAHgiAFgAtwB0QgXgLgMgWQgMgWABgfQgBgYAMgVQAMgXAWgMQAWgLAaAAQApAAAbAaQAaAbAAAoQAAApgaAbQgbAbgpAAQgZAAgWgLgAtggIQgNAOgBAbQABAbANAOQAMAOATAAQATAAANgOQAMgOAAgcQAAgagMgOQgNgOgTAAQgTAAgMAOgAxeBmQgWgZAAgtQAAgtAVgYQAWgYAiAAQAeAAAWAZIAAhaIAwAAIAAD5IgsAAIAAgaQgMAPgOAIQgQAHgQAAQgeAAgXgZgAw3gLQgMANAAAbQAAAdAIANQALASAVAAQARAAALgOQAMgOAAgcQAAgfgLgNQgLgOgSAAQgRAAgLAOgA44BxQgQgPgBgXQABgNAGgLQAGgLAJgHQAKgGANgEQAJgCASgCQAlgFASgGIAAgIQAAgSgJgHQgMgLgXAAQgWAAgJAIQgLAHgFAUIgegEQAEgUAJgMQAKgMARgGQASgGAYAAQAXAAAPAFQAOAGAHAIQAHAIACANQACAIAAATIAAApQAAArACAMQACALAGAKIghAAQgEgJgCgNQgQAOgQAGQgQAGgSAAQgeAAgQgOgA39AsQgSADgIADQgIADgFAHQgDAHAAAIQAAAMAJAIQAJAIASAAQASAAANgHQAPgIAGgOQAFgKAAgVIAAgLQgRAHgiAFgANtB7IAAicIgbAAIAAgYIAbAAIAAgUQAAgSAEgJQAEgMALgHQALgIAVAAQANAAAPAEIgEAaIgSgBQgPAAgFAGQgGAGAAAQIAAARIAkAAIAAAYIgkAAIAACcgAIvB7IAAi0IAbAAIAAAbQALgTAJgGQAJgGAKAAQARAAAQAKIgLAcQgLgHgMAAQgKAAgIAHQgIAGgDAKQgFAQgBATIAABfgAC+B7IAAhuQAAgSgEgJQgDgKgKgFQgJgGgMAAQgTAAgPANQgOAMAAAiIAABjIgfAAIAAi0IAcAAIAAAaQAUgeAlAAQARAAAOAGQAOAFAGAKQAHAKADANQABAIAAAVIAABvgAk5B7IAAhcQAAgegCgHQgEgJgGgFQgIgFgJAAQgNAAgKAHQgKAHgDALQgEALAAAeIAABSIgvAAIAAi0IAsAAIAAAaQAXgeAlAAQAPAAAOAFQANAGAGAJQAHAJADALQACALAAAUIAABxgAovB7Igfh0IgfB0IguAAIg6i0IAuAAIAiB2IAgh2IAvAAIAdB2IAjh2IAvAAIg5C0gA6NB7IAAj5IAfAAIAAD5gAoMjkQgUgOABgeIAeAFQABAOAKAGQALAIATAAQAWAAALgIQAMgJAEgPQACgJAAgfQgTAYgfAAQglAAgVgbQgUgbAAgmQAAgZAJgWQAJgWATgMQASgMAXAAQAhAAAUAaIAAgWIAcAAIAACdQABAqgJASQgJARgSALQgTAKgcAAQggAAgUgPgAn3muQgPAQAAAhQABAkAOAQQAOARAVAAQAWAAAOgQQAOgRAAgjQAAghgOgRQgQgRgUAAQgVAAgOARgAKhj6QAKgFAEgIQAFgIABgQIgSAAIAAgjIAjAAIAAAjQAAAUgHAMQgHALgOAHgASGkpQgQgPAAgXQAAgNAGgLQAHgLAJgHQAKgGAMgEQAJgCATgCQAlgFASgGIAAgIQAAgTgJgHQgMgLgXAAQgWAAgKAIQgLAHgEAUIgfgEQAFgUAJgMQAKgMARgGQASgGAXAAQAXAAAPAFQAOAGAHAIQAHAIADANQACAIgBAUIAAApQAAArACAMQADALAFAKIggAAQgEgJgCgNQgRAOgQAGQgQAGgSAAQgeAAgQgOgATCluQgTADgIADQgHADgFAHQgEAHAAAIQAAAMAJAIQAKAIARAAQATAAANgHQAOgIAGgOQAGgKAAgVIAAgLQgRAHgiAFgAAEkmQgVgLgMgWQgMgWAAgfQAAgYAMgWQAMgXAUgMQAWgLAbAAQApAAAaAaQAbAbgBApQABApgbAbQgbAbgoAAQgZAAgXgLgAAUmjQgNAPAAAbQAAAbANAOQANAOATAAQASAAANgOQANgOAAgcQAAgagNgPQgNgOgSAAQgTAAgNAOgAjok0QgXgZAAgtQABguAVgYQAWgYAhAAQAfAAAWAZIAAhaIAvAAIAAD6IgsAAIAAgaQgLAPgPAIQgQAHgPAAQgfAAgWgZgAjCmmQgLAOAAAbQgBAdAJANQALASAVAAQAQAAAMgOQAMgOAAgcQgBgfgKgOQgMgOgSAAQgQAAgMAOgAwtkzQgYgZAAgsQABguAXgZQAXgZAmAAQAlAAAWAYQAYAZAAAtIAAAIIiIAAQACAeAPAQQAPAQAXAAQARAAAMgJQAMgJAHgTIAgAEQgIAcgUAPQgUAPggAAQgoAAgXgYgAwTmxQgOAOgCAYIBlAAQgCgXgKgLQgOgSgXAAQgWAAgOAOgAzwkzQgXgZAAgsQAAguAXgZQAYgZAlAAQAlAAAXAYQAXAZAAAtIAAAIIiIAAQACAeAPAQQAQAQAWAAQASAAAMgJQALgJAIgTIAfAEQgIAcgUAPQgUAPggAAQgnAAgYgYgAzWmxQgOAOgCAYIBmAAQgCgXgKgLQgPgSgXAAQgWAAgOAOgAW7kiQgKgFgEgIQgDgJAAgcIAAhoIgXAAIAAgYIAXAAIAAgtIAegTIAABAIAfAAIAAAYIgfAAIAABqQAAANACAEQACADADADQAEACAGAAIAOgBIAEAbQgNADgJAAQgSAAgIgGgAVZkiQgJgFgDgIQgFgJAAgcIAAhoIgWAAIAAgYIAWAAIAAgtIAggTIAABAIAeAAIAAAYIgeAAIAABqQAAANABAEQABADAEADQAEACAGAAIAOgBIAEAbQgNADgJAAQgRAAgKgGgAQvkfIAAjRIhIDRIgfAAIhIjVIAADVIggAAIAAj6IAyAAIA7CxIAMAlIAOgoIA7iuIAtAAIAAD6gAI8kfIAAhcQAAgegDgIQgDgJgHgFQgHgFgKAAQgMAAgKAHQgKAHgEALQgDAMAAAeIAABSIgwAAIAAi1IAsAAIAAAaQAYgeAkAAQAQAAANAFQANAGAHAJQAHAJACALQADALAAAVIAABxgAFFkfIgeh0IggB0IguAAIg5i1IAuAAIAiB3IAfh3IAvAAIAeB3IAih3IAwAAIg6C1gApnkfIAAhuQAAgTgEgJQgEgKgIgFQgJgGgNAAQgUAAgOANQgOAMAAAjIAABjIgfAAIAAi1IAcAAIAAAaQAUgeAmAAQAQAAAOAGQANAFAIAKQAGAKADANQABAIABAWIAABvgAsqkfIAAi1IAfAAIAAC1gAt4kfIAAj6IAeAAIAAD6gA3NkfIAAj6ICoAAIAAAdIiHAAIAABOIB1AAIAAAdIh1AAIAABygAsqn2IAAgjIAfAAIAAAjg" },
                    { highlights: [{ pos: { x: -85, y: -60, width: 120 }, type: WORD_TYPE.ADJECTIVE }, { pos: { x: -35, y: 20, width: 120 }, type: WORD_TYPE.NOUN }],  msg: "The elderly[adjective] woman lives in a home for the elderly[noun].", shape: "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" },
                    { highlights: [{ pos: { x: -20, y: -60, width: 180 }, type: WORD_TYPE.NOUN }, { pos: { x: -150, y: 25, width: 180 }, type: WORD_TYPE.ADJECTIVE }], msg: "If you like electronics[noun], you’ll enjoy this electronic[adjective] device.", shape: "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" },
                    { highlights: [{ pos: { x: -90, y: -60, width: 170 }, type: WORD_TYPE.ADVERB }, { pos: { x: 20, y: -20, width: 160 }, type: WORD_TYPE.NOUN }], msg: "The extremely[adverb] loud man goes to extremes[noun] to please others.", shape: "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" },
                    { highlights: [{ pos: { x: -15, y: -60, width: 85 }, type: WORD_TYPE.VERB }, { pos: { x: -120, y: 25, width: 85 }, type: WORD_TYPE.NOUN }], msg: "As Grace eyed[verb] Delia, she noticed that Delia’s eyes[noun] were red.", shape: "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" },
                    { highlights: [{ pos: { x: -170, y: -20, width: 80 }, type: WORD_TYPE.NOUN }, { pos: { x: -15, y: -20, width: 85 }, type: WORD_TYPE.VERB }], msg: "Bob put on a brave face[noun] and faced[verb] up to his problems.", shape: "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" },
                    { highlights: [{ pos: { x: -15, y: -80, width: 80 }, type: WORD_TYPE.NOUN }, { pos: { x: 55, y: -40, width: 120 }, type: WORD_TYPE.VERB }], msg: "On the field[noun], the football player fielded[verb] the reporters’ questions.", shape: "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" },
                    { highlights: [{ pos: { x: -30, y: -60, width: 70 }, type: WORD_TYPE.ADJECTIVE }, { pos: { x: 95, y: 20, width: 70 }, type: WORD_TYPE.NOUN }], msg: "George’s fine[adjective] day was ruined when he was given a speeding fine[noun].", shape: "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" },
                    { highlights: [{ pos: { x: -175, y: -20, width: 130 }, type: WORD_TYPE.ADJECTIVE }, { pos: { x: -20, y: 20, width: 165 }, type: WORD_TYPE.ADVERB }], msg: "You’re being too forceful[adjective] – try to hit the ball less forcefully[adverb].", shape: "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" },
                    { highlights: [{ pos: { x: -80, y: -60, width: 85 }, type: WORD_TYPE.ADVERB }, { pos: { x: -125, y: 20, width: 85 }, type: WORD_TYPE.ADJECTIVE }], msg: "Work hard[adverb], and you’ll be able to solve the hard[adjective] questions.", shape: "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" },
                    { highlights: [{ pos: { x: -180, y: -40, width: 90 }, type: WORD_TYPE.VERB }, { pos: { x: 100, y: -40, width: 80 }, type: WORD_TYPE.NOUN }], msg: "Look[verb] at the stern look[noun] on Ms Chan’s face!", shape: "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" },
                    { highlights: [{ pos: { x: 45, y: -60, width: 90 }, type: WORD_TYPE.VERB }, { pos: { x: 10, y: -20, width: 95 }, type: WORD_TYPE.NOUN }], msg: "The team will meet[verb] at the sports meet[noun] on Saturday.", shape: "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" },
                    { highlights: [{ pos: { x: -130, y: -20, width: 160 }, type: WORD_TYPE.ADVERB }, { pos: { x: -80, y: 20, width: 145 }, type: WORD_TYPE.NOUN }], msg: "The doctor spoke patiently[adverb] to the patients[noun].", shape: "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" },
                    { highlights: [{ pos: { x: -170, y: -15, width: 130 }, type: WORD_TYPE.ADJECTIVE }, { pos: { x: -10, y: -15, width: 120 }, type: WORD_TYPE.VERB }], msg: "The song was so moving[adjective] it moved[verb] me to tears.", shape: "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eIAeAFQACAOAJAGQAKAIAUAAQAVAAAMgIQALgJAEgPQADgJAAgfQgUAYgfAAQgkAAgUgbQgVgbAAgmQAAgZAJgWQAKgWASgMQARgMAYAAQAgAAAVAaIAAgWIAcAAIAACdQAAAqgJASQgIARgTALQgTAKgbAAQggAAgUgPgAgDmuQgOAQAAAhQAAAkAOAQQANARAVAAQAWAAAOgQQAOgRAAgjQAAghgOgRQgPgRgVAAQgVAAgNARgASHkzQgXgZAAgtQAAgzAcgYQAXgUAiAAQAlAAAYAYQAYAZAAArQAAAjgLAUQgKAUgUALQgUALgYAAQgmAAgYgYgASfmuQgQASAAAjQAAAiAQASQAPARAXAAQAXAAAPgRQAPgSAAgkQAAghgPgRQgPgSgXAAQgXAAgPARgAPYkpQgTgPgFgdIAegFQADATAMAJQALAKAVAAQAWAAAKgIQAKgJAAgMQAAgKgJgGQgGgEgZgHQgigIgNgGQgNgHgHgLQgHgLAAgNQAAgMAGgKQAFgLAKgHQAHgFAMgEQANgDAOAAQAVAAARAGQAQAGAHALQAIAKADASIgeAEQgCgOgKgIQgKgIgSAAQgVAAgJAHQgJAHAAAJQAAAGAEAFQADAFAIADIAcAIQAgAJANAGQANAFAHALQAIAKAAAQQAAAPgJAOQgJANgRAIQgRAHgVAAQgkAAgSgOgALIkpQgTgPgFgdIAegFQADATAMAJQALAKAVAAQAWAAAKgIQAKgJAAgMQAAgKgJgGQgGgEgZgHQgigIgNgGQgNgHgHgLQgHgLAAgNQAAgMAGgKQAFgLAKgHQAHgFAMgEQANgDAOAAQAVAAARAGQAQAGAHALQAIAKADASIgeAEQgCgOgKgIQgKgIgSAAQgVAAgJAHQgJAHAAAJQAAAGAEAFQADAFAIADIAcAIQAgAJANAGQANAFAHALQAIAKAAAQQAAAPgJAOQgJANgRAIQgRAHgVAAQgkAAgSgOgAH/kpQgQgPAAgXQAAgNAHgLQAGgLAJgHQAKgGAMgEQAKgCASgCQAlgFASgGIAAgIQAAgTgJgHQgMgLgXAAQgWAAgKAIQgKAHgFAUIgegEQAEgUAJgMQAKgMARgGQASgGAYAAQAXAAAOAFQAPAGAHAIQAHAIACANQACAIAAAUIAAApQAAArACAMQACALAGAKIghAAQgEgJgCgNQgRAOgQAGQgPAGgTAAQgdAAgRgOgAI7luQgTADgHADQgIADgFAHQgEAHAAAIQAAAMAKAIQAJAIASAAQASAAANgHQAOgIAHgOQAFgKAAgVIAAgLQgRAHgiAFgAmekzQgYgZAAgtQAAgzAcgYQAYgUAhAAQAmAAAYAYQAXAZAAArQAAAjgKAUQgLAUgUALQgUALgYAAQgmAAgXgYgAmHmuQgPASAAAjQAAAiAPASQAPARAXAAQAXAAAQgRQAPgSAAgkQAAghgPgRQgQgSgXAAQgXAAgPARgApOkpQgSgPgFgdIAegFQADATALAJQAMAKAVAAQAVAAAKgIQALgJAAgMQAAgKgJgGQgHgEgZgHQgigIgNgGQgNgHgHgLQgGgLAAgNQAAgMAFgKQAGgLAJgHQAIgFAMgEQAMgDAOAAQAWAAAQAGQAQAGAIALQAIAKACASIgeAEQgCgOgJgIQgKgIgSAAQgWAAgJAHQgJAHAAAJQAAAGAEAFQAEAFAIADIAbAIQAhAJANAGQANAFAHALQAHAKAAAQQAAAPgJAOQgJANgRAIQgRAHgVAAQgjAAgTgOgAtwkzQgXgZAAgsQAAguAYgZQAXgZAmAAQAkAAAXAYQAXAZAAAtIAAAIIiHAAQACAeAPAQQAPAQAXAAQARAAAMgJQAMgJAHgTIAfAEQgHAcgVAPQgUAPgfAAQgoAAgYgYgAtVmxQgPAOgBAYIBlAAQgCgXgKgLQgOgSgYAAQgVAAgOAOgAGIkfIgkiLIglCLIggAAIg4i1IAgAAIAoCPIAJglIAdhqIAgAAIAkCMIApiMIAeAAIg4C1gAhzkfIAAhuQAAgTgEgJQgDgKgJgFQgJgGgNAAQgTAAgPANQgOAMAAAjIAABjIgfAAIAAi1IAcAAIAAAaQAUgeAmAAQAQAAAOAGQAOAFAHAKQAGAKADANQACAIAAAWIAABvgAvKkfIAAhzQAAgXgKgKQgKgLgSAAQgOAAgMAHQgMAHgFAMQgFANAAAVIAABjIgfAAIAAj6IAfAAIAABaQAVgZAhAAQAUAAAPAIQAPAIAGAOQAHAOAAAaIAABzgAzSkfIAAjdIhSAAIAAgdIDHAAIAAAdIhTAAIAADdg" },
                    { highlights: [{ pos: { x: -65, y: -60, width: 120 }, type: WORD_TYPE.ADJECTIVE }, { pos: { x: 10, y: 25, width: 80 }, type: WORD_TYPE.NOUN }], msg: "The playful[adjective] child performed in the school play[noun].", shape: "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" },
                    { highlights: [{ pos: { x: -165, y: -60, width: 75 }, type: WORD_TYPE.NOUN }, { pos: { x: 40, y: 25, width: 75 }, type: WORD_TYPE.VERB }], msg: "Part[noun] of me hopes we can meet once more before we part[verb].", shape: "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" },
                    { highlights: [{ pos: { x: -25, y: -60, width: 95 }, type: WORD_TYPE.ADJECTIVE }, { pos: { x: 50, y: -15, width: 75 }, type: WORD_TYPE.VERB }], msg: "Don’t be picky[adjective] – just hurry up and pick[verb] a seat!", shape: "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" },
                    { highlights: [{ pos: { x: 75, y: -75, width: 60 }, type: WORD_TYPE.VERB }, { pos: { x: -25, y: 5, width: 65 }, type: WORD_TYPE.NOUN }], msg: "As the police ran[verb] towards him, the thief made a run[noun] for the door.", shape: "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" },
                    
                    { highlights: [{ pos: { x: -70, y: -60, width: 65 }, type: WORD_TYPE.NOUN }, { pos: { x: -25, y: 20, width: 90 }, type: WORD_TYPE.VERB }], msg: "At the rate[noun] he’s going, his performance will surely be rated[verb] poorly.", shape: "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" },
                    
                    { highlights: [{ pos: { x: -35, y: -80, width: 55 }, type: WORD_TYPE.VERB }, { pos: { x: -110, y: 45, width: 60 }, type: WORD_TYPE.NOUN }], msg: "Max has set[verb] a date for his housewarming party, so let’s get him a set[noun] of cutlery.", shape: "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" },
                    { highlights: [{ pos: { x: -5, y: -55, width: 95 }, type: WORD_TYPE.VERB }, { pos: { x: 10, y: 25, width: 95 }, type: WORD_TYPE.NOUN }], msg: "Can you show[verb] me where I can watch the new TV show[noun] ?", shape: "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" },
                    { highlights: [{ pos: { x: -150, y: -35, width: 170 }, type: WORD_TYPE.ADVERB }, { pos: { x: -145, y: 5, width: 175 }, type: WORD_TYPE.VERB }], msg: "The event went smoothly[adverb] after we smoothed[verb] out the issues.", shape: "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" },
                    { highlights: [{ pos: { x: -130, y: -60, width: 145 }, type: WORD_TYPE.ADVERB }, { pos: { x: -75, y: 20, width: 145 }, type: WORD_TYPE.NOUN }], msg: "I strongly[adverb] feel that your argument lacks strength[noun].", shape: "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" },
                    { highlights: [{ pos: { x: -10, y: -60, width: 160 }, type: WORD_TYPE.ADVERB }, { pos: { x: -10, y: 20, width: 130 }, type: WORD_TYPE.ADJECTIVE }], msg: "The rain suddenly[adverb] started pouring – it was all very sudden[adjective].", shape: "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" },
                    { highlights: [{ pos: { x: -190, y: -15, width: 140 }, type: WORD_TYPE.NOUN }, { pos: { x: -155, y: 25, width: 85 }, type: WORD_TYPE.VERB }], msg: "You must undergo training[noun] before you can train[verb] other officers.", shape: "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" },
                    { highlights: [{ pos: { x: -50, y: -60, width: 110 }, type: WORD_TYPE.NOUN }, { pos: { x: -85, y: -20, width: 105 }, type: WORD_TYPE.VERB }], msg: "Wear a watch[noun] so you can watch[verb] the time closely.", shape: "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" },                   
                    
                ]
            }
            
        ]

        var wordBank = [];

        container.addBefore = function () {            
            pImgBg = new cjs.Bitmap(imgs.bg);
            return pImgBg;
        }

        container.reset = function () {
            //console.log("container reset");            
            //clip.parent.menuPanel.visible = false;
            libs.stopSound();
            //scene01.reset();                        
        }

        container.stop = function () {
            libs.stopSound();
            libs.stopMusic();
            scene01.removeListeners();
        };

        container.play = function (data) {
            //console.log("data: " + data);
            if (!IsEmpty(data)) {
                idPlayer = data.id;
                //imgBg.image = playerInfo[idPlayer].select.pic;
                pImgBg.image = data.pic;
            }
            scene01.reset();
            scene01.play();            
        };

        container.back = function () {
            
        };        

        parent.hideMenu();
        parent.hideNavigation();
        parent.hideBottomBar();
        parent.setUnitLogoTextColor("#000000");        

        var captureVideoToImg = function (video, callback) {
            var canvas = document.getElementById('canvas_temp');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

            try {
                const img = new Image();
                img.src = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                img.onload = function () {
                    callback(img);
                }
            } catch (e) {
                callback(null);
            }
        }

        var createScene = function () {
            var container = new cjs.Container();

            var img = null;
            var idStage = -1;
            var curLevel = 0;
            var curLevelProgress = 0;
            var wordCount = 0;
            var isTryAgain = false;
            var isTimesUp = false;
            var isLvlCompleted = false;
            var isGameCompleted = false;
            var isDontUpdateImgBg = false;

            let callbackVideoSecondaryEnded = null;
            let callbackVideoSecondaryTimeupdate = null;
            // do not reset
            var hasAddedVideoListeners = false;            

            var videoTimeUpdateHandler = function () {
                if (videoPanel.video.paused) return;
                switch (idStage) {
                    case STAGE_MENU_01:
                    case STAGE_MENU_02:
                    case STAGE_MENU_03:
                        //console.log(videoPanel.video.currentTime);
                        if (!btnPlayOverlay.visible && videoPanel.video.currentTime > playerInfo[idPlayer].menu[curLevel].btnPlayTimeDelay) {                            
                            btnPlayOverlay.show(true, playerInfo[idPlayer].menu[curLevel].btnPlayOffset);
                            let posX = (idStage === STAGE_MENU_02) ? 143 : 93;
                            //panelHowToPlay.showSelection(container, { pos: { x: posX, y: 610 } });
                            panelMenu.show(true, posX);
                        }                        
                        break;
                    case STAGE_LVL_START_01:
                    case STAGE_LVL_START_02:
                    case STAGE_LVL_START_03:
                        if (!btnMenuOverlay.visible && videoPanel.video.currentTime > videoPanel.video.duration - 2) {
                            btnMenuOverlay.visible = true;
                        }
                        
                        break;
                }
            }

            var videoPlayHandler = function () {
                img.visible = true;
                switch (idStage) {
                    case STAGE_LVL_START_01:
                    case STAGE_LVL_START_02:
                    case STAGE_LVL_START_03:
                        if (isTryAgain) {
                            isTryAgain = false;
                            img.x -= PAGE_WIDTH;
                            img.visible = true;
                            cjs.Tween.get(img, { override: true }).to({ x: 0 }, 1000, cjs.Ease.linear).call(function () {
                                cjs.Tween.removeTweens(img)
                            });
                        } else {
                            //console.log("Fadeout");
                            libs.fadeOut(imgOverlay, 1000);
                        }                        
                        break;
                    case STAGE_MENU_02:
                    case STAGE_MENU_03:
                    case STAGE_LVL_END:
                        //if(idStage !== 9) libs.playMusic("Playdate_loop", { pos: 2196 });
                        img.x -= PAGE_WIDTH;
                        img.visible = true;
                        cjs.Tween.get(img, { override: true }).to({ x: 0 }, 1000, cjs.Ease.linear).call(function () {
                            cjs.Tween.removeTweens(img)
                        });                        
                        break;
                }
                
            }

            var videoEndedHandler = function () {
                switch (idStage) {
                    case STAGE_MENU_01:
                    case STAGE_MENU_02:
                    case STAGE_MENU_03:
                        //img.image = playerInfo[idPlayer].menu[curLevel].pic;                        
                        createMug(img.parent, function () {
                            scene01.play();
                            //panelHowToPlay.visible = false;
                            panelMenu.show(false);
                        });                        
                        //panelHowToPlay.showSelection(container)

                        
                        libs.captureCanvasToImg(function (pic) {
                            pImgBg.image = pic;
                        })
                        btnPlayOverlay.showPic();
                        
                        break;
                    case STAGE_LVL_START_01:
                    case STAGE_LVL_START_02:
                    case STAGE_LVL_START_03:
                        //libs.playMusic("Playdate_loop", { pos: 4920 });

                        btnNext.setExtra(playerInfo[idPlayer].lvl[curLevel].extra);
                        //btnNext.visible = true;
                        btnNext.show(true);

                        //btnMenuOverlay.visible = true;
                        showWordBtns(true);
                        enableWordBtns(false);                        
                        break;
                    case STAGE_GAME_PLAY_01:
                    case STAGE_GAME_PLAY_02:
                    case STAGE_GAME_PLAY_03:
                        /*
                        captureVideoToImg(videoPanel.video, function (pic) {
                            imgBg.image = pic;
                        })
                        */
                        libs.captureImgToImg(img, pImgBg);
                        break;
                    case STAGE_LVL_END:
                        libs.playMusic("Playdate_loop", { pos: 4920 });
                        libs.captureCanvasToImg(function (pic) {
                            pImgBg.image = pic;
                            img.visible = false;
                            //panelHowToPlay.showSelection(container, { pos: { x: 210, y: 610 } })
                            panelMenu.show(true);
                            libs.fadeIn(btnMenu);
                            //btnPlayAgainOverlay.visible = true;
                            //btnPlayAgainOverlay.show(true);
                        })
                        break;
                }
            }

            container.removeListeners = function () {
                if (hasAddedVideoListeners) {
                    hasAddedVideoListeners = false;
                    videoPanel.video.removeEventListener('timeupdate', videoTimeUpdateHandler);
                    videoPanel.video.removeEventListener("play", videoPlayHandler)
                    videoPanel.video.removeEventListener("ended", videoEndedHandler);
                    //console.log("Removed activity listeners!")
                }
            }

            container.play = function (id, lvl) {
                if (!IsEmpty(id)) {
                    idStage = id
                } else {
                    idStage++;
                }

                if (!IsEmpty(lvl)) {
                    curLevel = lvl;
                }

                //console.log("stage: " + idStage);
                let src = null;
                let startTime = 0;
                

                //TODO:
                panelHelp.show(false);

                switch (idStage) {
                    case STAGE_MENU_01:
                    case STAGE_MENU_02:
                    case STAGE_MENU_03:
                        img.image = videoPanel.video;
                        src = playerInfo[idPlayer].menu[curLevel].video;                        
                        break;
                    case STAGE_LVL_START_01:
                    case STAGE_LVL_START_02:
                    case STAGE_LVL_START_03:
                        //libs.stopMusic();
                        img.image = videoPanel.video;                        
                        src = playerInfo[idPlayer].lvl[curLevel].video;
                        panelHelp.show(false);
                        break;
                    case STAGE_GAME_PLAY_01:
                    case STAGE_GAME_PLAY_02:
                    case STAGE_GAME_PLAY_03:
                        libs.stopMusic();
                        break;                        
                    case STAGE_LVL_END:
                        isGameCompleted = true;
                        libs.stopMusic();
                        img.image = videoPanel.video;
                        src = playerInfo[idPlayer].end.video;
                        break;                    
                }
                if (!IsEmpty(src)) {
                    videoPanel.video.src = src;
                    videoPanel.video.currentTime = startTime;
                    //videoPanel.video.play();
                    img.visible = false;

                    videoPanel.video.pause();
                    var onVideoLoaded = function () {
                        videoPanel.video.removeEventListener('loadeddata', onVideoLoaded);
                        libs.captureImgToImg(img, null, function (pic) {
                            if (!isDontUpdateImgBg) {
                                pImgBg.image = pic;
                                pImgBg.visible = true;
                            } else {
                                isDontUpdateImgBg = false;
                            }                            
                            videoPanel.video.play();
                        })
                        /*
                        if (!isDontUpdateImgBg) {
                            libs.captureImgToImg(img, pImgBg, function () {
                                pImgBg.visible = true;
                                videoPanel.video.play();
                            })
                        } else {
                            isDontUpdateImgBg = false;
                            videoPanel.video.play();
                        }         
                        */
                    }
                    videoPanel.video.addEventListener('loadeddata', onVideoLoaded);

                    if (!hasAddedVideoListeners) {
                        hasAddedVideoListeners = true;
                        videoPanel.video.addEventListener('timeupdate', videoTimeUpdateHandler);
                        videoPanel.video.addEventListener("play", videoPlayHandler)
                        videoPanel.video.addEventListener("ended", videoEndedHandler);
                        //console.log("Added activity listeners!")
                    }
                // not playing of any video
                } else {
                    switch (idStage) {
                        case STAGE_GAME_PLAY_01:
                        case STAGE_GAME_PLAY_02:
                        case STAGE_GAME_PLAY_03:
                            loadWordBank();
                            libs.playMusic("Bg_kitchen");
                            pImgBg.image = playerInfo[idPlayer].lvl[curLevel].pic;
                            img.visible = false;
                            word.show();
                            enableWordBtns(true);
                            btnRetryOverlay.visible = true;
                            
                            break;
                    }
                }                
            }

            container.reset = function () {
                idStage = -1;
                wordCount = 0;
                curLevel = 0;
                curLevelProgress = 0;
                isTryAgain = false;
                isTimesUp = false;
                isLvlCompleted = false;
                isGameCompleted = false;

                //btnNext.visible = false;
                btnNext.show(false);
                btnTryAgain.visible = false;
                btnMenu.visible = false;
                btnPlayAgainOverlay.show(false);
                btnPlayOverlay.show(false);
                
                //btnPlay.visible = false;
                btnRetryOverlay.visible = false;
                btnMenuOverlay.visible = false;

                btnNext.reset();                
                btnTryAgain.reset();
                btnMenu.reset();
                panelMenu.show(false);

                //panelHowToPlay.visible = false;
                panelTimer.visible = false;

                panelMenu.show(false);
                
                word.reset();

                resetWordBtns();
                enableWordBtns(false)

                img.visible = true;
                libs.removeLocalTimeout();

                trayBurger.reset();

                callbackVideoSecondaryEnded = null;
                callbackVideoSecondaryTimeupdate = null;

                //TODO:
                panelHelp.show(false);

                /*
                gameData[curLevel].nouns.forEach(function (item) {
                    wordBank.push({ word: item, type: WORD_TYPE.NOUN })
                })                
                gameData[curLevel].adverbs.forEach(function (item) {
                    wordBank.push({ word: item, type: WORD_TYPE.ADVERB })
                })
                gameData[curLevel].verbs.forEach(function (item) {
                    wordBank.push({ word: item, type: WORD_TYPE.VERB })
                })
                gameData[curLevel].adjectives.forEach(function (item) {
                    wordBank.push({ word: item, type: WORD_TYPE.ADJECTIVE })
                })
                */
                
            }

            container.showAll = function () {
            }            

            container.showBtnProceed = function (isVisible) {
                btnProceed.visible = isVisible;
            }            

            let createHelpPanel = function (x, y) {
                var container = new cjs.Container();

                const WIDTH = 300;
                const HEIGHT = 80;

                container.setTransform(x, y, 1, 1, 0, 0, 0, WIDTH * 0.5, HEIGHT * 0.5);

                container.setText = function (type) {
                    switch (type) {
                        case 0: text.text = "noun"; break;
                        case 1: text.text = "adverb"; break;
                        case 2: text.text = "verb"; break;
                        case 3: text.text = "adjective"; break;
                    }
                    
                }

                container.show = function (isVisible) {
                    if (SHOW_DEBUG_INFO === true) {
                        container.visible = isVisible;
                    }                    
                }

                var bg = new cjs.Shape(new cjs.Graphics().beginFill("#000000").drawRect(0, 0, WIDTH, HEIGHT));
                var text = libs.createCustomText(WIDTH * 0.5, HEIGHT * 0.5, "XXXXXX", { textAlign: "center", textColor: "#FFFFFF" });

                container.visible = false;

                container.addChild(bg)
                container.addChild(text)
                return container;
            }

            let onVideoSecondaryEnded = function () {
                videoPanel.video02.removeEventListener("ended", onVideoSecondaryEnded);
                if (!IsEmpty(callbackVideoSecondaryEnded)) {
                    callbackVideoSecondaryEnded();
                }                
            }
            let onVideoSecondaryTimeupdate = function () {
                if (videoPanel.video02.paused) return;
                if (!IsEmpty(callbackVideoSecondaryTimeupdate)) {
                    callbackVideoSecondaryTimeupdate();
                }
            }
            
            var playSecondaryVideo = function (src, callbackEnded, callbackTimeupdate, extra) {
                let isSlideIn = false;

                callbackVideoSecondaryEnded = callbackEnded;
                callbackVideoSecondaryTimeupdate = callbackTimeupdate;

                if (!IsEmpty(extra)) {
                    if (!IsEmpty(extra.isSlideIn) && extra.isSlideIn === true) {
                        isSlideIn = true;
                    }
                }
                
                videoPanel.video02.removeEventListener("ended", onVideoSecondaryEnded);
                videoPanel.video02.removeEventListener("timeupdate", onVideoSecondaryTimeupdate);
                videoPanel.video02.addEventListener("ended", onVideoSecondaryEnded);
                videoPanel.video02.addEventListener("timeupdate", onVideoSecondaryTimeupdate);
                videoPanel.video02.src = src;
                videoPanel.video02.play();
                img.image = videoPanel.video02;
                //img.visible = true;                

                if (isSlideIn) {
                    img.x -= PAGE_WIDTH;
                    cjs.Tween.get(img, { override: true }).to({ x: 0 }, 1000, cjs.Ease.linear).call(function () {
                        cjs.Tween.removeTweens(img)
                    });
                }
                img.visible = true;
            }

            var loadWordBank = function() {
                wordBank = [];
                //console.log("curLvl: " + curLevel);
                switch (curLevel) {
                    case 0:                    
                        gameData[curLevel].nouns.forEach(function (item) {
                            wordBank.push({ word: item, type: WORD_TYPE.NOUN })
                        })
                        gameData[curLevel].adverbs.forEach(function (item) {
                            wordBank.push({ word: item, type: WORD_TYPE.ADVERB })
                        })
                        gameData[curLevel].verbs.forEach(function (item) {
                            wordBank.push({ word: item, type: WORD_TYPE.VERB })
                        })
                        gameData[curLevel].adjectives.forEach(function (item) {
                            wordBank.push({ word: item, type: WORD_TYPE.ADJECTIVE
                                })
                        })
                        Shuffle(wordBank);
                        break
                    case 1:
                        gameData[curLevel].nouns.forEach(function (item) {
                            wordBank.push({ word: item.shape, type: WORD_TYPE.NOUN })
                        })
                        gameData[curLevel].adverbs.forEach(function (item) {
                            wordBank.push({ word: item.shape, type: WORD_TYPE.ADVERB })
                        })
                        gameData[curLevel].verbs.forEach(function (item) {
                            wordBank.push({ word: item.shape, type: WORD_TYPE.VERB })
                        })
                        gameData[curLevel].adjectives.forEach(function (item) {
                            wordBank.push({ word: item.shape, type: WORD_TYPE.ADJECTIVE })
                        })
                        Shuffle(wordBank);
                        break;
                    case 2:
                        Shuffle(gameData[curLevel].sentences);                        
                        gameData[curLevel].sentences.forEach(function (item) {
                            item.highlights.forEach(function (highlight) {
                                wordBank.push({ word: item.shape, type: highlight.type, pos: highlight.pos });
                            })
                            
                        })
                        break;
                }

                /*
                gameData[curLevel].nouns.forEach(function (item) {
                    wordBank.push({ word: item, type: WORD_TYPE.NOUN, keyword: item.keyword.word })
                })
                */



                
                /*
                wordBank.forEach(function (item) {
                    console.log(item);
                })
                */
            }

            var showWordBtns = function (isVisible) {
                btnNoun.visible = btnAdverb.visible = btnVerb.visible = btnAdjective.visible = isVisible;
            }

            var enableWordBtns = function (isEnabled) {
                btnNoun.mouseEnabled = btnAdverb.mouseEnabled = btnVerb.mouseEnabled = btnAdjective.mouseEnabled = isEnabled;
            }

            var resetWordBtns = function () {
                btnNoun.reset();
                btnAdverb.reset();
                btnVerb.reset();
                btnAdjective.reset();;
            }

            var createHowToPlayPanel = function () {
                var container = new cjs.Container();                 

                container.showSelection = function (parent, extra) {
                    let pos = { x: 270, y: 610 };
                    if (!IsEmpty(extra)) {
                        if (!IsEmpty(extra.pos)) {
                            pos = extra.pos;
                        }
                    }
                    selection.x = pos.x;
                    selection.y = pos.y;
                    //parent.addChild(container);
                    container.visible = true;                    
                }

                container.hideSelection = function () {
                    container.visible = false;
                }

                var createPanel = function () {
                    var container = new cjs.Container();

                    container.show = function (isVisible) {
                        if (isVisible) {
                            imgBg.image = imgs.How_play2;
                            btnNext.visible = true;
                            btnPrev.visible = false;
                            libs.fadeIn(container);
                        } else {
                            container.visible = false;
                        }
                        
                    }

                    var imgBg = new cjs.Bitmap(imgs.How_play2);

                    var btnNext = libs.createCustomBtn(1100, 450, "", imgs.button1, imgs.button1a, function () {                        
                        btnNext.visible = false;
                        btnPrev.visible = true;
                        imgBg.image = imgs.How_play2a;
                        btnNext.reset();

                    }, {});

                    var btnPrev = libs.createCustomBtn(1100, 450, "", imgs.button1, imgs.button1a, function () {                        
                        btnNext.visible = true;
                        btnPrev.visible = false;
                        imgBg.image = imgs.How_play2;
                        btnPrev.reset();

                    }, { isFlipped: true });

                    var btnCross = libs.createCustomBtn(1200, 650, "", imgs.close_butt1, imgs.close_butt1a, function () {
                        container.visible = false;
                    }, {});

                    btnPrev.visible = false;
                    container.on("click", function () { });
                    container.addChild(imgBg);
                    container.addChild(btnNext);
                    container.addChild(btnPrev);
                    container.addChild(btnCross);
                    return container;
                }

                var createSelection = function (x, y, onSelect) {
                    var container = new cjs.Container();
                    var width = 140;
                    var height = 60;

                    container.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);

                    var bg = new cjs.Shape(new cjs.Graphics().beginFill("#FF000002").drawRect(0, 0, width, height));

                    container.cursor = "pointer";
                    container.on("mousedown", function () {
                        onSelect();
                    })

                    container.addChild(bg);
                    return container;
                }

                var selection = createSelection(270, 610, function () {                    
                    //panel.show(true);                          
                    videoPanel.video.pause();
                    btnPlayOverlay.show(false);
                    btnPlayAgainOverlay.show(false);
                    //panelHowToPlay.hideSelection();                    
                    libs.captureCanvasToImg(function (pic) {
                        pImgBg.image = pic;
                        
                        playSecondaryVideo(VIDEO_HOW_TO_PLAY, function () {
                            
                        }, function () {                            
                            if (idStage === STAGE_LVL_END) {
                                if (!btnPlayAgainOverlay.visible && videoPanel.video02.currentTime > 8) {
                                    btnPlayAgainOverlay.show(true, { x: -190, y: -190 });
                                }
                            } else {
                                if (!btnPlayOverlay.visible && videoPanel.video02.currentTime > 8) {
                                    btnPlayOverlay.show(true, { x: 450, y: -160 });
                                }
                            }                            
                        }, { isSlideIn: true});
                    })
                    
                    
                });

                var panel = createPanel();
                panel.visible = false;

                container.addChild(selection);
                //container.addChild(panel);
                return container;
            }

            var createTimerPanel = function (x, y, onTimesUp) {
                var container = new cjs.Container();
                container.setTransform(x, y);

                let secsBegin = 60;
                let min = 0;
                let sec = 0;
                let interval = null;                

                container.start = function (secs) {
                    secsBegin = secs;
                    min = 0;
                    sec = 0;
                    clearInterval(interval);
                    interval = null;
                    container.resume();
                    container.visible = true;
                }

                container.stop = function () {                    
                    clearInterval(interval);
                    interval = null;
                }

                container.resume = function () {                    
                    if (!IsEmpty(interval)) return;
                    var calTime = function () {
                        sec = secsBegin--;
                        if (sec < 0) sec = 0;
                        
                        text.text = displayTime(sec);
                        if (sec === 0) {
                            container.stop();
                            // time's up
                            if (!IsEmpty(onTimesUp)) {
                                onTimesUp();
                            }
                        }
                    }
                    interval = setInterval(function () {
                        calTime();                        
                    }, 1000);
                    calTime();
                }

                var displayTime = function (secs) {
                    var toHrs = (secs / 3600);
                    var fullHr = Math.trunc(toHrs);
                    var toMins = (toHrs - fullHr) * 60;
                    var fullMins = Math.trunc(toMins);
                    var toSecs = (toMins - fullMins) * 60;
                    var fullSecs = Math.round(toSecs);

                    if (fullSecs >= 60) {
                        fullSecs = 0;
                        fullMins += 1;
                    }
                    /*
                    console.log("secs: " + secs);
                    console.log("toHrs: " + toHrs);
                    console.log("fullHr: " + fullHr);
                    console.log("toMins: " + toMins);
                    console.log("fullMins: " + fullMins);
                    console.log("toSecs: " + toSecs);
                    console.log("fullSecs: " + fullSecs);
                    */
                    return fullMins + ":" + ("0" + fullSecs).slice(-2);
                }

                var text = libs.createCustomText(0, 0, "0:00", { fontSize: 40, textAlign: "center", fontWeight: 600 });

                container.addChild(text);
                return container;
            }

            var createMug = function (parent, onPlay, extra) {
                var container = new cjs.Container();

                var picMug = null;
                var picMugSelect = null;

                switch (curLevel) {
                    case 0: picMug = imgs.Mug2; picMugSelect = imgs.Mug2_2; break;
                    case 1: picMug = imgs.Mug3; picMugSelect = imgs.Mug3_3; break;
                    case 2: picMug = imgs.Mug4; picMugSelect = imgs.Mug4_4; break;                    
                }                

                var createSelection = function (id, x, y, onSelect) {
                    var container = new cjs.Container();
                    var width = 180;
                    var height = 40;

                    container.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);

                    var bg = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF02").drawRect(0, 0, width, height));

                    container.cursor = "pointer";
                    container.on("mousedown", function () {
                        onSelect(id);
                    })

                    container.addChild(bg);
                    return container;
                }                

                var createMenu = function (x, y, onStart, extra) {
                    var container = new cjs.Container();
                    container.setTransform(x, y);

                    var picMenu = null;
                    var posYStart = 0;

                    container.slideOut = function () {
                        cjs.Tween.get(img, { override: true }).to({ x: 0 }, 700, createjs.Ease.backOut).call(function () {
                            cjs.Tween.removeTweens(img);
                            libs.fadeIn(btnStart);
                        });
                    }

                    switch (curLevel) {
                        case 0: picMenu = imgs.menu_msg1; posYStart = 180; break;
                        case 1: picMenu = imgs.menu_msg2; posYStart = 220; break;
                        case 2: picMenu = imgs.menu_msg3; posYStart = 220; break;                        
                    }

                    var img = new cjs.Bitmap(picMenu);
                    img.mask = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF").drawRect(0, 0, img.getBounds().width, img.getBounds().height));
                    img.x = -img.getBounds().width;

                    var btnStart = libs.createCustomBtn(img.getBounds().width - 120, posYStart, "", imgs.start_butt1, imgs.start_butt1a, function () {
                        btnStart.visible = false;
                        onStart();
                        //parent.jumpTo(PAGE_INDEX.OPENING_01);
                    }, { isClickInteraction: false, scale: 1.1 });                                                           

                    //btnStart.visible = false;                   

                    container.addChild(img);
                    //container.addChild(btnStart);                    
                    return container;
                }

                var onSelect = function (id) {
                    mug.image = picMugSelect;
                    selection.mouseEnabled = false;
                    menu.slideOut(id);
                }

                var mug = new cjs.Bitmap(picMug);
                mug.setTransform(145, 207);

                var posX = mug.x + mug.getBounds().width * 0.5;
                var posY = (455 + (curLevel * 50));
                var selection = createSelection(0, posX, posY, onSelect);
                //var selection02 = createSelection(1, posX, 505, onSelect);
                //var selection03 = createSelection(2, posX, 550, onSelect);

                var menu = createMenu(330, 407, function () {                    
                    libs.setLocalTimeout(function () {
                        libs.captureCanvasToImg(function (pic) {
                            imgOverlay.image = pic;
                            //imgOverlay.visible = true;
                            parent.removeChild(container);
                            onPlay();
                        })
                    }, 100);
                }, extra);                                

                //container.addChild(menu);
                //container.addChild(mug);
                //container.addChild(selection);
                
                parent.addChild(container);
            }           

            var createMenuPanel = function (x, y, parent) {
                var container = new cjs.Container();
                container.setTransform(x, y);

                container.show = function (isVisible, posX) {
                    if (!IsEmpty(posX)) {
                        container.x = posX
                    } else {
                        container.x = 93;
                    }

                    container.visible = isVisible;
                    if (isVisible) {
                        
                        if (curLevelProgress >= 0) btnLevel01Overlay.visible = true;
                        if (curLevelProgress >= 1) btnLevel02Overlay.visible = true;
                        if (curLevelProgress >= 2) btnLevel03Overlay.visible = true;
                        
                        
                    } else {
                        btnLevel01Overlay.visible = false;
                        btnLevel02Overlay.visible = false;
                        btnLevel03Overlay.visible = false;
                    }                    
                }

                var switchToLevel = function (stage, level) {
                    videoPanel.video.pause();
                    videoPanel.video02.pause();

                    btnPlayOverlay.show(false);
                    libs.captureCanvasToImg(function (pic) {
                        pImgBg.image = pic;
                        imgOverlay.image = pic;
                        imgOverlay.visible = true;
                        imgOverlay.alpha = 1;
                        btnMenu.visible = false;
                        scene01.play(stage, level);
                        panelMenu.show(false);
                    });
                }

                var imgBg = new cjs.Bitmap(imgs.Mug1_1);
                var btnHowToPlayOverlay = libs.createBtnOverlay(123, 396, 160, 60, function () {
                    var panel = libs.createHowToPlayPanel(function () {
                        libs.fadeOut(panel, null, function () {
                            parent.removeChild(panel);
                        });

                    })
                    panel.x -= PAGE_WIDTH;
                    parent.addChild(panel);
                    cjs.Tween.get(panel, { override: true }).to({ x: 0 }, 1000, cjs.Ease.linear).call(function () {
                        cjs.Tween.removeTweens(panel)
                    });
                });
                var btnLevel01Overlay = libs.createBtnOverlay(123, 250, 160, 40, function () {
                    switchToLevel(STAGE_LVL_START_01, 0); 
                });
                var btnLevel02Overlay = libs.createBtnOverlay(123, 296, 160, 40, function () {
                    switchToLevel(STAGE_LVL_START_02, 1); 
                });
                var btnLevel03Overlay = libs.createBtnOverlay(123, 342, 160, 40, function () {
                    switchToLevel(STAGE_LVL_START_03, 2); 
                });

                imgBg.alpha = 0;

                container.addChild(imgBg);
                container.addChild(btnHowToPlayOverlay);
                container.addChild(btnLevel01Overlay, btnLevel02Overlay, btnLevel03Overlay);

                return container;
            }

            var createWord = function (x, y) {
                var container = new cjs.Container();
                container.setTransform(x, y);

                container.reset = function () {
                    text01.text = "";
                    if (!IsEmpty(shape01)) container.removeChild(shape01);
                    if (!IsEmpty(highlight01)) container.removeChild(highlight01);
                    container.visible = false;
                }

                container.show = function () {
                    container.visible = true;
                    text01.text = "";
                    if (!IsEmpty(shape01)) container.removeChild(shape01);
                    if (!IsEmpty(highlight01)) container.removeChild(highlight01);
                    switch (curLevel) {
                        case 0:
                            text01.text = wordBank[wordCount].word;                            
                            break;
                        case 1:                            
                            shape01 = new cjs.Shape(new cjs.Graphics().f("#230A01").s().p(wordBank[wordCount].word));
                            container.addChild(shape01);
                            break;
                        case 2:                            
                            shape01 = new cjs.Shape(new cjs.Graphics().f("#230A01").s().p(wordBank[wordCount].word));                                                        
                            highlight01 = new cjs.Shape(new cjs.Graphics().beginFill("#FFFF00").drawRect(wordBank[wordCount].pos.x, wordBank[wordCount].pos.y, wordBank[wordCount].pos.width, 35));
                            container.addChild(highlight01);
                            container.addChild(shape01);
                            break;
                    }
                    //TOTO:
                    panelHelp.setText(wordBank[wordCount].type);
                }

                var shape01 = null;
                var highlight01 = null;
                var text01 = libs.createCustomText(0, 0, "", { fontSize: 50, fontWeight: 600, textAlign: "center", lineHeight: 45 });

                container.addChild(text01);
                return container;
            }                        

            var checkWord = function (btn, btnType) {                
                enableWordBtns(false);
                if (isTimesUp) return;

                var nextWord = function () {
                    libs.setLocalTimeout(function () {
                        wordCount++;
                        if (wordCount >= wordBank.length) {
                            wordCount = 0;
                        }
                        resetWordBtns();

                        word.show();
                        enableWordBtns(true);

                    }, 300)
                }

                if (btnType === wordBank[wordCount].type) {
                    if (trayBurger.isLastBurger()) {
                        //console.log("is Completed")
                        isLvlCompleted = true;
                    }
                    btn.setCorrect(true);
                    trayBurger.make(function (isCompleted) {
                        if (isCompleted) {
                            libs.stopMusic();
                            //console.log("isCompleted")
                            panelTimer.stop();
                            resetWordBtns();                            
                            word.reset();
                            //imgBg.image = playerInfo[idPlayer].lvl[curLevel].picWin;

                            // adjust position for lvl 2
                            if (curLevel === 1) {
                                trayBurger.setBurgersOffsetX(5);
                            }
                            
                            libs.playMusic("Playdate_loop", { pos: 2196 });
                            playSecondaryVideo(playerInfo[idPlayer].complete[curLevel].video, function () {
                                //btnNext.visible = true;
                                btnNext.show(true, playerInfo[idPlayer].complete[curLevel].btnNextOffset);
                            })
                            /*
                            img.image = videoPanel.video02;
                            videoPanel.video02.src = playerInfo[idPlayer].complete[curLevel].video;
                            videoPanel.video02.play();
                            videoPanel.video02.addEventListener("ended", onVideoEnded);
                            img.visible = true;
                            */
                            //btnRetryOverlay.visible = false;
                            //btnMenuOverlay.visible = false;
                        } else {
                            nextWord();
                        }
                    });                    
                } else {
                    btn.setCorrect(false);
                    libs.setLocalTimeout(function () {
                        switch (wordBank[wordCount].type) {
                            case WORD_TYPE.NOUN: btnNoun.setCorrect(true); break;
                            case WORD_TYPE.ADVERB: btnAdverb.setCorrect(true); break;
                            case WORD_TYPE.VERB: btnVerb.setCorrect(true); break;
                            case WORD_TYPE.ADJECTIVE: btnAdjective.setCorrect(true); break;
                        }
                        nextWord();
                    }, 50);
                }                
            }

            var createTrayBurger = function (x, y, parent) {
                var container = new cjs.Container();
                container.setTransform(x, y);

                const POS_RACK = { x: 842, y: 397 };

                var posRack = { x: 842, y: 397 };
                var posBurger = { x: 0, y: 0 };
                var burgers = [];
                var step = 0;
                var numBurgersToComplete = TOTAL_BURGERS_TO_COMPLETE;

                container.setBurgersOffsetX = function (offsetX) {
                    burgers.forEach(function (item) {
                        item.x += offsetX;
                    })
                }

                container.reset = function () {
                    step = 0;                    
                    burgers.forEach(function (item) {
                        parent.removeChild(item);
                    })
                    burgers = [];

                    if (!isTryAgain) {
                        if (!IsEmpty(playerInfo[idPlayer].lvl[curLevel]) && !IsEmpty(playerInfo[idPlayer].lvl[curLevel].extra) && !IsEmpty(playerInfo[idPlayer].lvl[curLevel].extra.rackOffset)) {
                            var offset = playerInfo[idPlayer].lvl[curLevel].extra.rackOffset;
                            posRack.x = POS_RACK.x + offset.x;
                            posRack.y = POS_RACK.y + offset.y;
                        }
                    }                    
                    
                    posBurger.x = posRack.x;
                    posBurger.y = posRack.y;
                    container.visible = false;
                }

                container.isLastBurger = function () {
                    return (burgers.length === (numBurgersToComplete - 1) && step === 2);
                }

                container.make = function (callback) {                    
                    if (!container.visible) {
                        bgImg.image = imgs.mark3
                        container.visible = true;
                    } else {
                        if (bgImg.image === imgs.mark3) {
                            bgImg.image = imgs.mark2;
                        } else if (bgImg.image === imgs.mark2) {
                            bgImg.image = imgs.mark1;                            
                        }
                    }
                    step++;
                    //console.log("step: " + step);
                    if (step >= 3) {                        
                        libs.setLocalTimeout(function () {
                            container.visible = false;
                            sendBurger(callback);
                            step = 0;
                        }, 100)                        
                    } else {                        
                        callback();
                    }                    
                }

                container.forceSend = function (callback) {
                    container.visible = false;
                    if (step > 0) {
                        sendBurger(callback);
                    } else {
                        callback();
                    }
                }

                var sendBurger = function (callback) {
                    //console.log("step: " + step);
                    var rackBurger = function (x, y) {
                        var container = new cjs.Container();
                        container.setTransform(x, y);

                        var pic = null;
                        switch (step) {
                            case 1: pic = imgs.score1; break;
                            case 2: pic = imgs.score2; break;
                            case 3: pic = imgs.score3; break;
                        }

                        var bgImg = new cjs.Bitmap(pic)
                        bgImg.setTransform(0, 0, 1, 1, 0, 0, 0, bgImg.getBounds().width * 0.5, bgImg.getBounds().height * 0.5);

                        container.addChild(bgImg);
                        return container;
                    }

                    var burger = rackBurger(posBurger.x, posBurger.y);
                    burgers.push(burger);
                    parent.addChild(burger)
                    if (burgers.length === 5) {
                        posBurger.x = posRack.x;
                        posBurger.y += 78;
                    } else {
                        posBurger.x += 85;
                    }

                    libs.playEffect("Bell_timer")
                    libs.setLocalTimeout(function () {
                        callback((burgers.length === numBurgersToComplete));
                    }, 100)

                }
                var bgImg = new cjs.Bitmap(imgs.mark3);
                switch (step) {
                    case 1: bgImg.image = imgs.mark1; break;
                    case 2: bgImg.image = imgs.mark2; break;
                }

                bgImg.setTransform(0, 0, 1, 1, 0, 0, 0, bgImg.getBounds().width * 0.5, bgImg.getBounds().height * 0.5);

                container.visible = false;                

                container.addChild(bgImg);
                return container;
            }            

            var onRetryGame = function () {
                btnRetryOverlay.visible = false;
                btnMenuOverlay.visible = false;
                libs.captureCanvasToImg(function (pic) {
                    pImgBg.image = pic;
                    panelTimer.visible = false;
                    isTryAgain = true;
                    isTimesUp = false;
                    trayBurger.reset();
                    showWordBtns(false);
                    resetWordBtns();
                    btnTryAgain.visible = false;
                    btnTryAgain.reset();
                    libs.stopMusic();
                    libs.playMusic("Playdate_loop", { pos: 4920 });
                    isDontUpdateImgBg = true;
                    scene01.play(idStage - 1);
                })
            }

            var onTimesUp = function () {
                if (isLvlCompleted) return;
                libs.stopMusic();
                isTimesUp = true;
                //console.log("Times up");
                libs.removeLocalTimeout();
                enableWordBtns(false);                
                word.reset();
                trayBurger.forceSend(function () {                    
                    pImgBg.image = playerInfo[idPlayer].lvl[curLevel].picTryAgain;
                    btnTryAgain.visible = true;
                });
            }

            var btnNext = libs.createCustomBtn(723, 292, "", imgs.button1_lvl, imgs.button1a_lvl, function () {                
                switch (idStage) {
                    case STAGE_LVL_START_01:
                    case STAGE_LVL_START_02:
                    case STAGE_LVL_START_03:                                                
                        scene01.play();
                        //btnNext.visible = false;
                        btnNext.show(false);
                        btnNext.reset();
                        panelTimer.start(playerInfo[idPlayer].lvl[curLevel].duration);
                        panelHelp.show(true);
                        break;
                    case STAGE_GAME_PLAY_01:                        
                    case STAGE_GAME_PLAY_02:                        
                    case STAGE_GAME_PLAY_03:
                        //console.log("btn next");
                        btnRetryOverlay.visible = false;
                        btnMenuOverlay.visible = false;

                        if (idStage === STAGE_GAME_PLAY_01) { if (curLevelProgress < 1) curLevelProgress = 1; }
                        else if (idStage === STAGE_GAME_PLAY_02) { if (curLevelProgress < 2) curLevelProgress = 2; }                        

                        //curLevel++;
                        //if (curLevel > 2) curLevel = 2;                        
                        curLevel = curLevelProgress;

                        isLvlCompleted = false;
                        libs.captureCanvasToImg(function (pic) {
                            panelTimer.visible = false;
                            pImgBg.image = pic;
                            trayBurger.reset();
                            showWordBtns(false);
                            resetWordBtns();
                            //btnNext.visible = false;
                            btnNext.show(false);
                            btnNext.reset();
                            isDontUpdateImgBg = true;
                            if (isGameCompleted) {
                                scene01.play(STAGE_MENU_03);
                            } else {
                                scene01.play();
                            }                            
                        })                        
                        break;                        
                }
            }, { isOverlay: true });

            var btnTryAgain = libs.createCustomBtn(723, 292, "", imgs.button1_lvl, imgs.button1a_lvl, function () {
                switch (idStage) {
                    case 2:
                    case 5:
                    case 8:
                        onRetryGame();
                        /*
                        libs.captureCanvasToImg(function (pic) {
                            imgBg.image = pic;
                            panelTimer.visible = false;
                            isTryAgain = true;
                            isTimesUp = false;                            
                            trayBurger.reset();
                            showWordBtns(false);
                            resetWordBtns();                            
                            btnTryAgain.visible = false;                            
                            btnTryAgain.reset();
                            scene01.play(idStage - 1);
                        })
                        */
                        break;
                }
            }, { isFlipped: true });

            var btnMenu = libs.createCustomBtn(1184, 626, "", imgs.menu_butt1, imgs.menu_butt1, function () {
                btnMenu.reset();
                btnMenu.visible = false;
                panelMenu.show(false);
                isDontUpdateImgBg = true;
                scene01.play(STAGE_MENU_03, curLevelProgress);
            }, {});                      


            var btnNoun = libs.createCustomBtn(479, 648, "", imgs.noun, imgs.noun, function () {
                switch (idStage) {
                    case 2:
                    case 5:
                    case 8:
                        checkWord(btnNoun, WORD_TYPE.NOUN);
                        break;                    
                }
            }, { picCorrect: imgs.noun1, picWrong: imgs.noun2 });

            var btnAdverb = libs.createCustomBtn(676, 648, "", imgs.adverb, imgs.adverb, function () {
                switch (idStage) {
                    case 2:
                    case 5:
                    case 8:
                        checkWord(btnAdverb, WORD_TYPE.ADVERB);
                        break;
                }
            }, { picCorrect: imgs.adverb1, picWrong: imgs.adverb2 });

            var btnVerb = libs.createCustomBtn(864, 648, "", imgs.verb, imgs.verb, function () {
                switch (idStage) {
                    case 2:
                    case 5:
                    case 8:
                        checkWord(btnVerb, WORD_TYPE.VERB);
                        break;
                }
            }, { picCorrect: imgs.verb1, picWrong: imgs.verb2 });

            var btnAdjective = libs.createCustomBtn(1071, 648, "", imgs.adjective, imgs.adjective, function () {
                switch (idStage) {
                    case 2:
                    case 5:
                    case 8:
                        checkWord(btnAdjective, WORD_TYPE.ADJECTIVE);
                        break;
                }
            }, { picCorrect: imgs.adjective1, picWrong: imgs.adjective2 });            

            var word = createWord(568, 190);

            var trayBurger = createTrayBurger(540, 440, container);

            var panelTimer = createTimerPanel(1100, 100, onTimesUp);

            //var panelHowToPlay = createHowToPlayPanel();            

            var panelMenu = createMenuPanel(93, 207, container);

            var btnPlayOverlay = libs.createBtnOverlay(540, 595, 150, 150, function () {
                videoPanel.video.pause();
                videoPanel.video02.pause();
                
                //btnPlay.visible = false;
                btnPlayOverlay.show(false);
                libs.captureCanvasToImg(function (pic) {
                    pImgBg.image = pic;
                    imgOverlay.image = pic;
                    imgOverlay.visible = true;
                    imgOverlay.alpha = 1;
                    scene01.play();
                    //panelHowToPlay.visible = false;
                    panelMenu.show(false);
                });
            }, { pic: imgs.start_butt1, picScale: 1.1 });

            /*
            var btnPlay = libs.createCustomBtn(540, 595, "", imgs.start_butt1, imgs.start_butt1a, function () {
                
            }, { isClickInteraction: false, scale: 1.1 });
            */
            var btnPlayAgainOverlay = libs.createBtnOverlay(1184, 626, 100, 100, function () {
                parent.jumpTo(PAGE_INDEX.OPENING_01);
            })

            var btnRetryOverlay = libs.createBtnOverlay(1150, 200, 60, 60, function () {
                libs.removeLocalTimeout();
                videoPanel.video.pause();
                videoPanel.video02.pause();
                panelTimer.stop();                
                word.reset();
                onRetryGame();
            })

            var btnMenuOverlay = libs.createBtnOverlay(1060, 200, 60, 60, function () {
                libs.removeLocalTimeout();
                videoPanel.video.pause();
                videoPanel.video02.pause();
                panelTimer.stop();                
                word.reset();
                btnRetryOverlay.visible = false;
                btnMenuOverlay.visible = false;
                
                libs.captureCanvasToImg(function (pic) {
                    pImgBg.image = pic;
                    panelTimer.visible = false;
                    isTryAgain = false;
                    isTimesUp = false;
                    trayBurger.reset();
                    showWordBtns(false);
                    resetWordBtns();
                    btnTryAgain.visible = false;
                    btnTryAgain.reset();
                    //btnNext.visible = false;
                    btnNext.show(false);
                    btnNext.reset();
                    libs.stopMusic();
                    img.visible = true;                    
                    libs.stopMusic();
                    libs.playMusic("Playdate_loop", { pos: 4920 });
                    //console.log("curLevelProgress: " + curLevelProgress)                    
                    switch (curLevelProgress) {
                        case 0: scene01.play(STAGE_MENU_01, curLevelProgress); break;
                        case 1: isDontUpdateImgBg = true; scene01.play(STAGE_MENU_02, curLevelProgress); break;
                        case 2: isDontUpdateImgBg = true; scene01.play(STAGE_MENU_03, curLevelProgress); break;
                    }                    
                    /*
                    switch (idStage) {
                        case STAGE_LVL_START_01:
                        case STAGE_LVL_START_02:
                        case STAGE_LVL_START_03:
                            scene01.play(idStage - 1);
                            break;
                        case STAGE_GAME_PLAY_01:
                        case STAGE_GAME_PLAY_02:
                        case STAGE_GAME_PLAY_03:
                            scene01.play(idStage - 2);
                            break;
                    }
                    */
                    
                    
                })
            })

            //TODO:
            var panelHelp = createHelpPanel(PAGE_WIDTH * 0.5, 60);            
            word.reset();
            //btnNext.visible = false;
            btnNext.show(false);
            btnTryAgain.visible = false;
            btnMenu.visible = false;
            btnNoun.visible = btnAdverb.visible = btnVerb.visible = btnAdjective.visible = false;

            img = new cjs.Bitmap(videoPanel.video);            

            container.addChild(img);            
            container.addChild(btnNext, btnTryAgain);
            container.addChild(btnMenu);
            container.addChild(btnPlayAgainOverlay);
            container.addChild(btnNoun, btnAdverb, btnVerb, btnAdjective);
            container.addChild(word);
            container.addChild(trayBurger);
            container.addChild(panelTimer);                        
            //container.addChild(btnPlay);
            container.addChild(btnPlayOverlay);
            container.addChild(btnRetryOverlay);
            container.addChild(btnMenuOverlay);            
            container.addChild(panelMenu);
            container.addChild(panelHelp);

            return container;
        }

        var scene01 = createScene();        

        var btnProceed = libs.createCustomBtn((PAGE_WIDTH * 0.5) - 1, 635, "", imgs.button1, imgs.button1a, function () {
            
            btnProceed.visible = false;
            idPlayer = 0;
            pImgBg.image = playerInfo[idPlayer].select.pic;
            scene01.reset();            
            //scene01.play(1, 2);
            scene01.play(0, 1);
            
            //sceneEnd.run();

        }, { isClickInteraction: false });

        var createEndScene = function () {
            var container = new cjs.Container();
            var interval = null;
            var i = 1000;
            var end = 200;
            container.run = function () {
                if (!IsEmpty(interval)) return;
                
                let animate = function () {
                    imgBg.mask = new cjs.Shape(new cjs.Graphics().beginFill("#000000").drawCircle(1000, 260, i));
                    i -= 3;
                    if (i < end) {
                        i = end;
                        imgBg.mask = new cjs.Shape(new cjs.Graphics().beginFill("#000000").drawCircle(1000, 260, i));                        
                        clearInterval(interval);
                        interval = null;
                        end = 0;
                    }
                }

                interval = setInterval(function () {
                    animate();
                }, 1);
            }

            var imgBg = new cjs.Bitmap(imgs.Level_1a_david);
            imgBg.mask = new cjs.Shape(new cjs.Graphics().beginFill("#000000").drawCircle(1000, 260, 0));

            container.addChild(imgBg);
            return container;
        }
        var sceneEnd = createEndScene();

        container.addPageLast = function () {
            var container = new cjs.Container();
            imgOverlay = new cjs.Bitmap(imgs.Level_1a_david);
            imgOverlay.visible = false;

            container.addChild(imgOverlay);
            //container.addChild(sceneEnd);
            //container.addChild(btnProceed);
            return container;
        };

        container.addChild(scene01);        
        container.reset();
        return this;
    }).prototype = p = new cjs.Container();
    /************ PAGES ENDS ************/

    /************ HELPER STARTS ************/
    (libs.playSound = function (audioCilp, onComplete) {
        if (!IsEmpty(gAudioInstance)) {
            gAudioInstance.stop();
        }
        gAudioInstance = cjs.Sound.play(audioCilp);
        gAudioInstance.volume = 1;
        //if (document[hidden]) audioInstance.paused = true;
        gAudioInstance.on("complete", function () {
            if (!IsEmpty(onComplete)) {
                onComplete();
            }
        })
        return gAudioInstance;
    });

    (libs.playEffect = function (audioCilp, onComplete) {
        if (!IsEmpty(gEffectInstance)) {
            gEffectInstance.stop();
        }
        gEffectInstance = cjs.Sound.play(audioCilp);
        //gEffectInstance.volume = 1;
        gEffectInstance.volume = gEffectSetting.vol;
        //if (document[hidden]) audioInstance.paused = true;
        gEffectInstance.on("complete", function () {
            if (!IsEmpty(onComplete)) {
                onComplete();
            }
        })
        return gEffectInstance;
    });

    (libs.stopSound = function () {
        if (!IsEmpty(gAudioInstance)) {
            gAudioInstance.stop();
        }
        gAudioInstance = null;
    });

    (libs.stopEffect = function () {
        if (!IsEmpty(gEffectInstance)) {
            gEffectInstance.stop();
        }
        gEffectInstance = null;
    });

    (libs.playMusic = function (audioCilp, extra) {
        if (!IsEmpty(gMusicInstance)) {
            gMusicInstance.stop();
        }
        let pos = 0;

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.pos)) {
                pos = extra.pos;
            }
        }

        gMusicInstance = cjs.Sound.play(audioCilp);
        gMusicInstance.volume = gMusicSetting.vol;
        gMusicInstance.position = pos;
        gMusicInstance.loop = -1;
        //gMusicInstance.muted = true;
    });

    (libs.stopMusic = function () {
        if (!IsEmpty(gMusicInstance)) {
            gMusicInstance.stop();
        }
        gMusicInstance = null;
    });

    (libs.pauseMusic = function () {
        if (!IsEmpty(gMusicInstance)) {
            gMusicInstance.volume = 0.0;
        }        
    });  

    (libs.resumeMusic = function () {
        if (!IsEmpty(gMusicInstance)) {
            gMusicInstance.volume = gMusicSetting.vol;
        }
    });  

    (libs.playLocalMusic = function (audioClip) {
        if (IsEmpty(gLocalMusicInstance)) {
            gLocalMusicInstance = cjs.Sound.play(audioClip);
            gLocalMusicInstance.volume = 0.2;
            gLocalMusicInstance.loop = -1;
        }
    });

    (libs.stopLocalMusic = function () {
        if (!IsEmpty(gLocalMusicInstance)) {
            gLocalMusicInstance.stop();
            gLocalMusicInstance = null;
        }
    });

    (libs.createCustomText = function (x, y, msg, extra) {
        var fontSize = 30;
        var lineHeight = 40;
        var textAlign = "left";
        var textColor = TEXT_COLOR.DEFAULT;
        var fontWeight = 700;
        var fontType = "Noto Sans SC";

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.fontSize)) {
                fontSize = extra.fontSize;
            }
            if (!IsEmpty(extra.fontWeight)) {
                fontWeight = extra.fontWeight;
            }
            if (!IsEmpty(extra.lineHeight)) {
                lineHeight = extra.lineHeight;
            }
            if (!IsEmpty(extra.textAlign)) {
                textAlign = extra.textAlign;
            }
            if (!IsEmpty(extra.textColor)) {
                textColor = extra.textColor;
            }
            if (!IsEmpty(extra.fontType)) {
                fontType = extra.fontType;
            }
        }                

        var text = new cjs.Text(msg, fontWeight + " " + fontSize + "px " + fontType, textColor);
        text.textBaseline = "middle";
        text.textAlign = textAlign;
        text.lineHeight = lineHeight;
        text.setTransform(x, y);

        text.setFont = function (fontSize, fontWeight) {
            text.font = fontWeight + " " + fontSize + "px " + fontType;
        }

        return text;
    });

    // video panel
    (libs.createVideoPanel = function (parent, x, y) {
        var container = new createjs.Container();
        container.parent = parent;
        container.setTransform(x, y);

        var onVideoCloseCallback;

        container.onVideoClose = function (callback) {
            onVideoCloseCallback = callback;
        }

        var videoBg = new createjs.Shape(new createjs.Graphics().beginFill("rgba(0,0,0,0.75)").drawRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT));
        videoBg.on("click", function () { });
        var btnClose = new createjs.Bitmap(imgs.btn_close);
        btnClose.cursor = "pointer";
        btnClose.setTransform(1150, 170, 1.5, 1.5, 0, 0, 0, 30, 30);
        btnClose.shadow = new createjs.Shadow("rgba(0,0,0,0.6)", 0, 8, 36);
        btnClose.on("click", function () {
            container.videoContainer.style.setProperty("display", "none");
            container.video.pause();
            container.visible = false;
            if (!IsEmpty(onVideoCloseCallback)) {
                onVideoCloseCallback();
            }
        });
        btnClose.addEventListener("mouseover", function () {
            createjs.Tween.get(btnClose).to({ scaleX: 1.55, scaleY: 1.55 }, 100, createjs.Ease.quintInOut);
        });
        btnClose.addEventListener("mouseout", function () {
            createjs.Tween.get(btnClose).to({ scaleX: 1.5, scaleY: 1.5 }, 100, createjs.Ease.quintInOut);
        });

        container.addChild(videoBg);
        container.addChild(btnClose);
        container.visible = false;

        container.videoContainer = document.getElementById("videoContainer");
        container.videoContainer.style.display = 'none';

        container.video = document.getElementById("video");
        container.video02 = document.getElementById("video02");
        container.video.style.display = 'none';
        container.video02.style.display = 'none';

        return container;
    });

    // menu panel
    (libs.createMusicControl = function (x, y) {
        var container = new createjs.Container();        
        container.setTransform(x, y);

        container.show = function (isVisible) {
            container.visible = isVisible;
        }

        var btnMusic = libs.createCustomBtn(0, 0, "", imgs.speaker1, imgs.speaker1a, function () {
            let img = btnMusic.getImg();            
            if (img.image === imgs.speaker1) {
                btnMusic.setPic(imgs.speaker1a);
                gMusicSetting.vol = 0;
                gEffectSetting.vol = 0;
                gParentActivity.videoPanel.video.muted = true;
            } else {
                btnMusic.setPic(imgs.speaker1);
                gMusicSetting.vol = gMusicSetting.volDefault;
                gEffectSetting.vol = gEffectSetting.volDefault;
                gParentActivity.videoPanel.video.muted = false;
            }
            if (!IsEmpty(gMusicInstance)) {
                gMusicInstance.volume = gMusicSetting.vol;
            }
            if (!IsEmpty(gEffectInstance)) {
                gEffectInstance.volume = gEffectSetting.vol;
            }
            
        }, { isClickInteraction: true });

        btnMusic.setPic(imgs.speaker1);
        gMusicSetting.vol = gMusicSetting.volDefault;
        gEffectSetting.vol = gEffectSetting.volDefault;

        container.visible = false;

        container.addChild(btnMusic);
        return container;
    });

    /*
    (libs.createGifPanel = function (parent, x, y) {
        var container = new createjs.Container();
        container.parent = parent;
        container.setTransform(x, y);

        var animation = null;

        var onVideoCloseCallback;

        container.play = function (sprites, extra) {            
            if (!IsEmpty(animation)) {                
                container.removeChild(animation);
            }
            // animation
            var framerate = 13;
            var isMobile = IsMobileDevice();
            var width = isMobile ? 300 : 600;//800;
            var height = isMobile ? 225 : 450;//;600;

            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.width)) {
                    width = extra.width;
                }
                if (!IsEmpty(extra.height)) {
                    height = extra.height;
                }
                if (!IsEmpty(extra.framerate)) {
                    framerate = extra.framerate;
                }
            }

            var data = {
                images: [sprites],
                frames: { width: width, height: height },
                animations: {
                    idle: 0,
                }
            };

            var spriteSheet = new createjs.SpriteSheet(data);
            animation = new createjs.Sprite(spriteSheet, "play");
            animation.framerate = framerate;
            animation.mouseEnabled = false;

            animation.setTransform(PAGE_WIDTH * 0.5, PAGE_HEIGHT * 0.5, 1.2, 1.2, 0, 0, 0, animation.getBounds().width * 0.5, animation.getBounds().height * 0.5);

            if (isMobile) {
                animation.scaleX = 1.9;
                animation.scaleY = 1.9;
            }

            container.addChild(animation);            
        }

        container.onVideoClose = function (callback) {
            onVideoCloseCallback = callback;
        }

        var createExitBtn = function (x, y, onClick) {
            var container = new cjs.Container();

            const width = 190;
            const height = 80;

            container.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);

            var bg = new cjs.Shape(new cjs.Graphics().setStrokeStyle(4).beginStroke("#106AB0").beginFill("#0091EA").drawRect(0, 0, width, height));
            var text = libs.createCustomText(width * 0.5, height * 0.5, "关闭视频", { textColor: "#FFFFFF", textAlign: "center" })

            libs.createBtnEffect(container, onClick)

            container.addChild(bg);
            container.addChild(text);
            return container;
        }

        var videoBg = new createjs.Shape(new createjs.Graphics().beginFill("#78909CF0").drawRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT));
        videoBg.on("click", function () { });
        var btnClose = new createjs.Bitmap(imgs.btn_close);
        btnClose.cursor = "pointer";
        btnClose.setTransform(1150, 170, 1.5, 1.5, 0, 0, 0, 30, 30);
        btnClose.shadow = new createjs.Shadow("rgba(0,0,0,0.6)", 0, 8, 36);
        btnClose.on("click", function () {
            container.videoContainer.style.setProperty("display", "none");
            container.video.pause();
            container.visible = false;
            if (!IsEmpty(onVideoCloseCallback)) {
                onVideoCloseCallback();
                onVideoCloseCallback = null;
            }
        });
        btnClose.addEventListener("mouseover", function () {
            createjs.Tween.get(btnClose).to({ scaleX: 1.55, scaleY: 1.55 }, 100, createjs.Ease.quintInOut);
        });
        btnClose.addEventListener("mouseout", function () {
            createjs.Tween.get(btnClose).to({ scaleX: 1.5, scaleY: 1.5 }, 100, createjs.Ease.quintInOut);
        });

        var btnExit = createExitBtn(PAGE_WIDTH * 0.5, PAGE_HEIGHT - 100, function () {            
            container.visible = false;
            if (!IsEmpty(onVideoCloseCallback)) {
                onVideoCloseCallback();
                onVideoCloseCallback = null;
            }
        });

        container.addChild(videoBg);
        //container.addChild(btnClose);
        container.addChild(btnExit);
        container.visible = false;     
        return container;
    });        
    */

    (libs.createSplashPanel = function (parent, x, y) {
        var container = new createjs.Container();
        container.parent = parent;
        container.setTransform(x, y);        

        var onCloseCallback;        

        container.onClose = function (callback) {
            onCloseCallback = callback;
        }       

        container.setText = function (msg) {
            btn.setText(msg);
        }

        var requestFullScreen = function () {
            var canvas = document.getElementById("canvas");
            if (canvas.requestFullscreen) {
                canvas.requestFullscreen()
                    .then(function () {
                        // element has entered fullscreen mode successfully
                        screen.orientation.lock("landscape")
                            .then(function () {
                                //alert('Locked');
                            })
                            .catch(function (error) {
                                //alert(error);
                                title.text = error;
                            });
                    })
                    .catch(function (error) {
                        // element could not enter fullscreen mode
                        // error message
                        //title.text = error.message;
                    });
            }
            else if (canvas.webkitRequestFullScreen) {
                canvas.webkitRequestFullScreen();
                screen.orientation.lock("landscape")
                    .then(function () {
                        //alert('Locked');
                    })
                    .catch(function (error) {
                        //alert(error);
                        //title.text = error;
                    });
            }
        }

        var createBtn = function (x, y, onClick) {
            var container = new cjs.Container();

            const width = 300;
            const height = 120;

            container.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);

            container.setText = function (msg) {
                text.text = msg;
            }

            var bg = new cjs.Shape(new cjs.Graphics().setStrokeStyle(4).beginStroke("#106AB0").beginFill("#0091EA").drawRect(0, 0, width, height));
            var text = libs.createCustomText(width * 0.5, height * 0.5, "关闭视频", { textColor: "#FFFFFF", textAlign: "center", fontSize: 40 })

            libs.createBtnEffect(container, onClick)

            container.addChild(bg);
            container.addChild(text);
            return container;
        }

        var bg = new createjs.Shape(new createjs.Graphics().beginFill("#78909CF0").drawRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT));
        bg.on("click", function () { });        

        var btn = createBtn(PAGE_WIDTH * 0.5, PAGE_HEIGHT * 0.5, function () {
            container.visible = false;

            requestFullScreen();

            if (!IsEmpty(onCloseCallback)) {
                onCloseCallback();
                onCloseCallback = null;
            }
        });

        container.addChild(bg);        
        container.addChild(btn);
        container.visible = false;
        return container;
    });        
    
    

    

    /*
    (libs.createKeyboardPanel = function () {
        var container = new cjs.Container();
        container.setTransform(x, y);

        const height = 320;

        container.reset = function () {
            btnConfirm.visible = false;
        }

        container.showBtnConfirm = function (isVisible) {
            btnConfirm.visible = isVisible;
        }

        var createBtnConfirm = function (x, y, onClick) {
            var container = new cjs.Container();
            container.setTransform(x, y);

            const width = 200;
            const height = 108;

            var imgBg = new cjs.ScaleBitmap(imgs.button_success, new cjs.Rectangle(50, 0, 10, 108));
            imgBg.setDrawSize(width, height)
            imgBg.setTransform(0, -30, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);

            var text = libs.createCustomText(0, -30, "确定", { textColor: "#A0FA78", textAlign: "center", fontSize: 26 });

            container.hitArea = new cjs.Shape(new cjs.Graphics().beginFill("#000000A0").drawRect(-width * 0.5 + 30, -height * 0.5, width - 60, height * 0.5));
            libs.createBtnEffect(container, onClick);

            container.addChild(imgBg);
            container.addChild(text);
            return container;
        }

        var createKey = function (x, y, msg, onClick, extra) {
            var container = new cjs.Container();
            container.setTransform(x, y);

            var width = 50;

            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.width)) {
                    width = extra.width;
                }
            }

            var bg = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFFA0").drawRoundRect(-width * 0.5, -25, width, 50, 8));

            var text01 = libs.createCustomText(0, 0, msg, { textColor: TEXT_COLOR.DEFAULT, textAlign: "center", fontSize: 26, fontWeight: 700 });

            container.cursor = "pointer";
            container.on("mousedown", function () { onClick(text01.text) });

            container.addChild(bg);
            container.addChild(text01);
            return container;
        }

        var imgBg = new cjs.ScaleBitmap(imgs.header_player, new cjs.Rectangle(45, 45, 20, 20));
        imgBg.setDrawSize(width, height);

        var btnConfirm = createBtnConfirm(width - 120, height - 45, onSubmit);

        container.mask = new cjs.Shape(new cjs.Graphics().beginFill("#000000").drawRoundRect(0, 108, width, height, 16));

        container.addChild(imgBg);

        var onNumKeyClick = function (msg) {
            selectedEntry.addText(msg);
        }

        var digits = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];
        let pos = { x: width * 0.5 - 60, y: 70 };
        for (let i = 0; i < 10; ++i) {
            if (i !== 0 && i % 3 === 0) {
                pos.x = width * 0.5 - 60;
                pos.y += 60;
            }
            var key = createKey(pos.x, pos.y, digits[i], onNumKeyClick);
            container.addChild(key);
            pos.x += 60;
        }

        var keyDel = createKey(pos.x + 30, pos.y, "Del", function () {
            selectedEntry.deleteText();
        }, { width: 110 });
        container.addChild(keyDel);
        container.addChild(btnConfirm);
        return container;
    });    
    */

    // create btn effect
    (libs.createBtnEffect = function (container, onClick, extra) {
        var defaultScale = 1;
        var expandScale = 1;
        var isClickInteraction = false;

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.defaultScale)) {
                defaultScale = extra.defaultScale;
            }
            if (!IsEmpty(extra.expandScale)) {
                expandScale = extra.expandScale;
            }
            if (!IsEmpty(extra.isClickInteraction) && extra.isClickInteraction === true) {
                isClickInteraction = extra.isClickInteraction;
            }
        }

        container.on("mouseover", function () {
            if (!IsEmpty(extra) && !IsEmpty(extra.bypassScale) && extra.bypassScale === true) return;
            createjs.Tween.get(container, { /*override: true*/ }).to({ scaleX: expandScale, scaleY: expandScale }, 100, createjs.Ease.quintInOut);
            if (!IsEmpty(extra) && !IsEmpty(extra.onMouseover)) {
                extra.onMouseover();
            }
        });
        container.on("mouseout", function () {
            if (!IsEmpty(extra) && !IsEmpty(extra.bypassScale) && extra.bypassScale === true) return;
            createjs.Tween.get(container, { /*override: true*/ }).to({ scaleX: defaultScale, scaleY: defaultScale }, 100, createjs.Ease.quintInOut);
            if (!IsEmpty(extra) && !IsEmpty(extra.onMouseout)) {
                extra.onMouseout();
            }
        });
        container.on("mouseup", function () {
            //console.log("mouseup");
            if (!IsEmpty(extra) && !IsEmpty(extra.onMouseup)) {
                extra.onMouseup();
            }
        });
        container.on("mousedown", function () {
            //console.log("mousedown");            
            if (!IsEmpty(extra) && !IsEmpty(extra.onMousedown)) {
                extra.onMousedown();
            }            
        });
        /*
        container.on("click", function () {
            if (!IsEmpty(onClick)) {
                onClick();
            }
        });
        */
        container.cursor = "pointer";
    });  

    // create shadow
    (libs.createShadow = function (type, shadowColor) {
        var color = "#000000";
        if (!IsEmpty(shadowColor)) {
            color = shadowColor;
        }
        switch (type) {
            case SHADOW_TYPE.PANEL: {
                return new cjs.Shadow(color + "66", 0, 8, 24);
            }
            case SHADOW_TYPE.BUTTON: {
                return new cjs.Shadow(color + "99", 0, 8, 36);
            }
            case SHADOW_TYPE.ICON: {
                return new cjs.Shadow(color + "99", 0, 4, 12);
            }
        }
    });    

    // set filters
    (libs.setFilters = function (target, color, extra) {
        var x = 0;
        var y = 0;
        var width = 0;
        var height = 0;
        target.uncache();

        if (!IsEmpty(target.getBounds())) {
            width = target.getBounds().width;
            height = target.getBounds().height;
        }
        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.size)) {
                width = extra.size.width;
                height = extra.size.height;
            }
            if (!IsEmpty(extra.pos)) {
                x = extra.pos.x;
                y = extra.pos.y;
            }
        }
        var colorDec = ColorHex2Dec(color);
        target.filters = [new createjs.ColorFilter(0, 0, 0, 1, colorDec[0], colorDec[1], colorDec[2], 0)];
        target.cache(x, y, width, height);
    }); 

    // create play button
    (libs.createPlayBtn = function (x, y, onClick, extra) {
        var container = new cjs.Container();
        container.setTransform(x, y)

        var scale = 1;

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.scale)) {
                scale = extra.scale;
            }
        }

        var btn = new createjs.Shape(new cjs.Graphics().beginFill("#D84848").setStrokeStyle(4).beginStroke("#FFFFFF").drawCircle(0, 0, 40));
        btn.setTransform(30, 30, 1, 1, 0, 0, 0, 30, 30)

        var icon = new createjs.Bitmap(imgs.icon_play);
        icon.setTransform(5, 0, 0.75, 0.75, 0, 0, 0, icon.getBounds().width * 0.5, icon.getBounds().height * 0.5);
        libs.setFilters(icon, "#FFFFFF");

        container.on("mouseover", function () {
            createjs.Tween.get(container, { override: true }).to({ scaleX: (scale * 1.05), scaleY: (scale * 1.05) }, 100, createjs.Ease.quintInOut);
        });
        container.on("mouseout", function () {
            createjs.Tween.get(container, { override: true }).to({ scaleX: scale, scaleY: scale }, 100, createjs.Ease.quintInOut);
        });
        container.on("click", function () {
            onClick();
        });
        container.cursor = "pointer";        

        container.scaleX = container.scaleY = scale;

        container.addChild(btn);
        container.addChild(icon);
        return container;
    });

    // create generic button
    (libs.createGenericBtn = function (parent, title, x, y, btnSize, onClick, extra) {
        var container = new createjs.Container();
        container.parent = parent;
        container.setTransform(x, y);
        var isDisabled = false;
        container.disable = function () {
            commandBg.style = "#B0BEC5";
            commandStroke.style = "#78909C";
            btn.cursor = "default";
            container.scaleX = container.scaleY = 1;
            isDisabled = true;
        }

        container.enable = function () {
            commandBg.style = "#0091EA";
            commandStroke.style = "#106AB0";
            btn.cursor = "pointer";
            isDisabled = false;
        }

        var width = btnSize.w;
        var height = btnSize.h;
        var fontSize = 30;

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.fontSize)) {
                fontSize = extra.fontSize;
            }
        }
        
        var btn = new cjs.Shape();
        var commandBg = btn.graphics.beginFill("#0091EA").command;
        var commandStroke = btn.graphics.setStrokeStyle(3).beginStroke("#106AB0").command;
        btn.graphics.drawRect(0, 0, width, height);
        btn.shadow = libs.createShadow(SHADOW_TYPE.PANEL);        
        btn.setTransform(0, 0, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);
        btn.cursor = "pointer";
        btn.on("click", function () {
            if (isDisabled) return;
            onClick();
        });
        btn.addEventListener("mouseover", function () {
            if (isDisabled) return;
            createjs.Tween.get(container, { override: true }).to({ scaleX: 1.05, scaleY: 1.05 }, 100, createjs.Ease.quintInOut);
        });
        btn.addEventListener("mouseout", function () {
            if (isDisabled) return;
            createjs.Tween.get(container, { override: true }).to({ scaleX: 1, scaleY: 1 }, 100, createjs.Ease.quintInOut);
        });

        var btnTitle = new cjs.Text(title, "500 " + fontSize + "px Noto Sans SC", "#FFFFFF");
        btnTitle.textAlign = "center";
        btnTitle.textBaseline = "middle";
        btnTitle.setTransform(0, 0, 1, 1, 0, 0, 0, 0, 0);

        container.addChild(btn);
        container.addChild(btnTitle);

        return container;
    });
    
    // fade in item
    (libs.fadeIn = function (item, duration, callback) {
        item.visible = true;
        item.alpha = 0;
        if (IsEmpty(duration)) {
            duration = 550;
        }
        createjs.Tween.get(item, { override: true }).to({ alpha: 1 }, duration, createjs.Ease.linear).call(function () {                                    
            if (!IsEmpty(callback)) {
                callback();
            }
        });        
    });  

    // fade in item
    (libs.fadeOut = function (item, duration, callback) {
        item.visible = true;
        item.alpha = 1;
        if (IsEmpty(duration)) {
            duration = 550;
        }
        createjs.Tween.get(item, { override: true }).to({ alpha: 0 }, duration).call(function () {
            if (!IsEmpty(callback)) {
                callback();
            }
        });   ;
    });  

    (libs.blinkColor = function (text, defaultColor, nextColor, speed) {
        if (!IsEmpty(text.isBlinking) && text.isBlinking) {
            text.color = (text.color === defaultColor) ? text.color = nextColor : text.color = defaultColor;
            setTimeout(function () {
                libs.blinkColor(text, defaultColor, nextColor, speed);
            }, speed);
            //createjs.Tween.get(box).to({ scaleX: 1.05, scaleY: 1.05 }, 100, createjs.Ease.quintInOut);
        }
    });        

    (libs.createVideoBtn = function (x, y, onClick) {
        var container = new cjs.Container();
        container.setTransform(x, y)

        var imgBg = new cjs.ScaleBitmap(imgs.button_hex_01, new cjs.Rectangle(45, 0, 20, 80));
        imgBg.setDrawSize(300, 80);
        imgBg.setTransform(0, 0, 1, 1, 0, 0, 0, 150, 40);

        var text = libs.createCustomText(45, 0, "观看动画", { textAlign: "center", textColor: "#FFFFFF" });

        var icon = new cjs.Bitmap(imgs.icon_video);
        icon.setTransform(-70, -15, 0.7, 0.7, 0, 0, 0, icon.getBounds().width * 0.5, icon.getBounds().height * 0.5);;

        container.on("mouseover", function () {
            createjs.Tween.get(container, { override: true }).to({ scaleX: 1.02, scaleY: 1.02 }, 100, createjs.Ease.quintInOut);
        });
        container.on("mouseout", function () {
            createjs.Tween.get(container, { override: true }).to({ scaleX: 1, scaleY: 1 }, 100, createjs.Ease.quintInOut);
        });
        container.on("click", function () {
            onClick();
        });
        container.cursor = "pointer";

        container.addChild(imgBg);
        container.addChild(icon);
        container.addChild(text);
        return container;
    });

    (libs.createPlayAndPauseBtn = function (x, y, vo, extra) {
        var container = new cjs.Container();
        container.setTransform(x, y);

        var speech = null;
        var scale = 1;

        container.isVoPlaying = function () {
            return icon.image === imgs.icon_pause;
        }

        container.setVo = function (newVo) {
            vo = newVo;
        }
        //var props = new cjs.PlayPropsConfig().set({ interrupt: cjs.Sound. })        
        container.reset = function () {
            if (!IsEmpty(speech)) {
                speech.paused = true;
            }
            speech = null;
            icon.image = imgs.icon_play;
            icon.x = 2;
            icon.updateCache();
        }

        container.play = function () {
            if (IsEmpty(vo)) return;
            if (icon.image === imgs.icon_play) {
                if (!IsEmpty(speech)) {
                    speech.paused = false;
                } else {
                    libs.stopSound();
                    speech = libs.playSound(vo);
                    speech.on("complete", function () {
                        speech = null;
                        icon.image = imgs.icon_play;
                        icon.x = 2;
                        icon.updateCache();
                    })
                    if (!IsEmpty(extra)) {
                        if (!IsEmpty(extra.onPlay)) {
                            extra.onPlay();
                        }
                    }
                }
                icon.image = imgs.icon_pause;
                icon.x = 0;
                icon.updateCache();
            } else {
                speech.paused = true;
                icon.image = imgs.icon_play;
                icon.x = 2;
                icon.updateCache();
            }

        }

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.scale)) {
                scale = extra.scale;
            }
        }
        var bg = new createjs.Shape(new cjs.Graphics().beginFill("#FFC5C8").setStrokeStyle(3).beginStroke("#D34946").drawRect(0, 0, 40, 40));
        bg.setTransform(0, 0, 1, 1, 0, 0, 0, 20, 20)

        var icon = new cjs.Bitmap(imgs.icon_play);
        icon.setTransform(2, 0, 0.35, 0.35, 0, 0, 0, icon.getBounds().width * 0.5, icon.getBounds().height * 0.5);
        libs.setFilters(icon, "#D34946");

        container.on("mouseover", function (evt) {
            createjs.Tween.get(container, { override: true }).to({ scaleX: scale + 0.1, scaleY: scale + 0.1 }, 100, createjs.Ease.quintInOut);
        });
        container.on("mouseout", function () {
            createjs.Tween.get(container, { override: true }).to({ scaleX: scale, scaleY: scale }, 100, createjs.Ease.quintInOut);
        });
        container.on("mousedown", function () {
            if (!IsEmpty(extra) && !IsEmpty(extra.onPlay)) {
                extra.onPlay();
            }
            container.play()
        });
        container.cursor = "pointer";
        container.scaleX = container.scaleY = scale;

        container.addChild(bg);
        container.addChild(icon);
        return container;
    });                

    (libs.createStandardBtn = function (x, y, bgPic, iconPic, msg, onClick, extra) {
        var container = new cjs.Container();
        container.setTransform(x, y);

        var width = 140;
        var height = 60;
        var iconRotate = 0;
        var iconScale = 0.7;
        var iconOffsetX = 40;
        var textOffsetX = -15;
        var fontSize = 26;
        var colorStroke = "#FFFFFF00";
        var colorText = "#184832";

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.width)) {
                width = extra.width;
            }
            if (!IsEmpty(extra.height)) {
                height = extra.height;
            }
            if (!IsEmpty(extra.iconRotate)) {
                iconRotate = extra.iconRotate;
            }
            if (!IsEmpty(extra.iconScale)) {
                iconScale = extra.iconScale;
            }
            if (!IsEmpty(extra.iconOffsetX)) {
                iconOffsetX = extra.iconOffsetX;
            }
            if (!IsEmpty(extra.fontSize)) {
                fontSize = extra.fontSize;
            }
            if (!IsEmpty(extra.textOffsetX)) {
                textOffsetX = extra.textOffsetX;
            }
            if (!IsEmpty(extra.colorStroke)) {
                colorStroke = extra.colorStroke;
            }
            if (!IsEmpty(extra.colorText)) {
                colorText = extra.colorText;
            }
        }

        var bg = new cjs.ScaleBitmap(bgPic, new cjs.Rectangle(26, 0, 10, 60));
        bg.setDrawSize(width, height);
        bg.setTransform(0, 0, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);
        bg.cache(0, 0, width, height);
        bg.shadow = libs.createShadow(SHADOW_TYPE.PANEL);

        var icon = new cjs.Bitmap(iconPic);
        if (!IsEmpty(iconPic)) {
            icon.setTransform(iconOffsetX, 0, iconScale, iconScale, iconRotate, 0, 0, icon.getBounds().width * 0.5, icon.getBounds().height * 0.5)
            libs.setFilters(icon, colorText);
        }

        var text = libs.createCustomText(textOffsetX, 0, msg, { textAlign: "center", fontSize: fontSize, textColor: colorText });

        if (!IsEmpty(onClick)) {
            libs.createBtnEffect(container, onClick)
        }        

        container.addChild(bg);
        container.addChild(icon);
        container.addChild(text);
        return container;
    });

    (libs.createCustomSelector = function (x, y, color, iconPic, msg, onClick, extra) {
        var container = new cjs.Container();
        container.setTransform(x, y);

        var width = 320;
        var height = 80;
        var fontSize = 32;
        var textOffsetX = 0;
        var iconOffsetX = 0;
        var iconSize = 1;

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.width)) {
                width = extra.width;
            }
            if (!IsEmpty(extra.height)) {
                height = extra.height;
            }
            if (!IsEmpty(extra.fontSize)) {
                fontSize = extra.fontSize;
            }
            if (!IsEmpty(extra.textOffsetX)) {
                textOffsetX = extra.textOffsetX;
            }
            if (!IsEmpty(extra.iconOffsetX)) {
                iconOffsetX = extra.iconOffsetX;
            }
            if (!IsEmpty(extra.iconSize)) {
                iconSize = extra.iconSize;
            }
        }

        container.setText = function (msg) {
            text.text = msg;
        }

        container.setIcon = function (pic) {
            icon.image = pic;
        }

        container.setBgColor = function (color) {
            commandBg.style = color;
        }

        container.setTextColor = function (color) {
            text.color = color;
        }

        var bg = new cjs.Shape(new cjs.Graphics());
        var commandBg = bg.graphics.beginFill(color).command;
        bg.graphics.drawRoundRect(0, 0, width, height, height * 0.5);
        bg.setTransform(0, 0, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);
        bg.shadow = libs.createShadow(SHADOW_TYPE.PANEL);

        var icon = new cjs.Bitmap(iconPic);
        icon.setTransform(120 + iconOffsetX, 0, iconSize, iconSize, 0, 0, 0, icon.getBounds().width * 0.5, icon.getBounds().height * 0.5)

        var text = libs.createCustomText(-20 + textOffsetX, 0, msg, { textAlign: "center", fontSize: fontSize });

        libs.createBtnEffect(container, onClick)

        container.addChild(bg);
        container.addChild(icon);
        container.addChild(text);
        return container;
    });    

    (libs.createShenTiTable = function (x, y, extra) {
        var container = new cjs.Container();

        const width = 1000;
        const height = 600
        const border = 8;
        var isAnimate = true;

        container.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);

        container.reset = function () {
            header01.reset();
            header02.reset();
            header03.reset();
            header04.reset();
        }

        container.isVisibleByIndex = function (index) {
            switch (index) {
                case 0: return header01.isHeaderVisible();                
                case 1: return header02.isHeaderVisible();                
                case 2: return header03.isHeaderVisible();                
                case 3: return header04.isHeaderVisible();                
                case 4: return header01.isAnsVisible();
                case 5: return header03.isAnsVisible();
                case 6: return header04.isAnsVisible();
                case 7: return header02.isAnsVisible();                
                case 8: return header02.isHintVisible();                
            }
        }

        container.setVisibleByIndex = function (index) {
            switch (index) {
                case 0: header01.showHeader(); break;
                case 1: header02.showHeader(); break;
                case 2: header03.showHeader(); break;
                case 3: header04.showHeader(); break;
                case 4: header01.showAns(); break;
                case 5: header03.showAns(); break;
                case 6: header04.showAns(); break;
                case 7: header02.showAns(); break;
                case 8: header02.showHint(); break;
            }
        }

        container.showAllByIndex = function (index) {
            switch (index) {
                case 0:
                    header01.showHeader(true);
                    header02.showHeader(true);
                    header03.showHeader(true);
                    header04.showHeader(true);
                    break;
                case 1:
                    header01.showAns(true);
                    header02.showAns(true);
                    header03.showAns(true);
                    header04.showAns(true);
                    break;
                case 2:
                    isAnimate = false;
                    break;
                case 3:
                    header02.showHint(true);
                    break;
            }
        }

        var createHeader = function (x, y, colorBg, colorHeader, msg, ans, hint) {
            var container = new cjs.Container();
            container.setTransform(x, y);

            const defaultBgColor = "#CDCDCD";
            var commandBgColor;

            container.reset = function () {
                commandBgColor.style = defaultBgColor;
                text01.visible = false;
                text02.visible = false;
                if (!IsEmpty(hint)) {
                    text03.visible = false;
                }
            }

            container.showHeader = function (isShowAll) {                
                if (IsEmpty(isShowAll)) {
                    libs.fadeIn(text01);
                } else {
                    text01.visible = true;
                }                
            }            

            container.showAns = function (isShowAll) {
                commandBgColor.style = colorBg;
                if (IsEmpty(isShowAll)) {
                    libs.fadeIn(text02);
                } else {
                    text02.visible = true;
                }                  
            }

            container.showHint = function (isShowAll) {
                if (!IsEmpty(hint)) {
                    text02.visible = false;
                    if (IsEmpty(isShowAll)) {
                        libs.fadeIn(text03);
                    } else {
                        text03.visible = true;
                    }
                }                
            }

            container.isHeaderVisible = function () {
                return text01.visible;
            }

            container.isAnsVisible = function () {
                return text02.visible;
            }

            container.isHintVisible = function () {
                if (!IsEmpty(hint)) {
                    return text03.visible;
                }
                return false;                
            }

            var createQuestion = function (x, y) {
                var container = new cjs.Container();
                container.setTransform(x, y);

                var rot = 20;

                var rotate = function () {
                    if (!isAnimate) {
                        img.rotation = 0;
                        container.mouseEnabled = false;
                        return;
                    }
                    rot = -rot;
                    var t = createjs.Tween.get(img, { override: true }).to({ rotation: rot }, 600, createjs.Ease.quintInOut).call(function () {
                        cjs.Tween.removeTweens(img);
                        setTimeout(function () {
                            rotate();
                        }, 100)                        
                    });
                }

                var img = new cjs.Bitmap(imgs.icon_question);
                img.setTransform(0, 0, 1, 1, 0, 0, 0, img.getBounds().width * 0.5, img.getBounds().height * 0.5);

                var overlay = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF02").drawCircle(0, 0, 45));

                libs.createBtnEffect(container, function () {
                    if (!IsEmpty(extra)) {
                        if (!IsEmpty(extra.onQuestionClick)) {
                            extra.onQuestionClick();
                        }
                    }
                }, { expandScale: 1 });

                rotate();                

                container.addChild(img);
                container.addChild(overlay);
                return container;
            }

            var bg = new cjs.Shape(new cjs.Graphics());
            commandBgColor = bg.graphics.beginFill(colorBg).command;
            bg.graphics.drawRect(border * 0.5, border * 0.5, width - border, (height / 4) - border);

            var bgHeader = new cjs.Shape(new cjs.Graphics().beginFill(colorHeader).drawRect(border * 0.5, border * 0.5, 450, (height / 4) - border));

            var text01 = libs.createCustomText(30, 75, msg, { textColor: "#FFFFFF", fontSize: 30, textAlign: "left", lineHeight: 80 });
            var text02 = libs.createCustomText(480, 35, ans, { textColor: TEXT_COLOR.DEFAULT, fontSize: 30, textAlign: "left", lineHeight: 40 });
            if (!IsEmpty(hint)) {
                var text03 = libs.createCustomText(480, 35, hint, { textColor: TEXT_COLOR.DEFAULT, fontSize: 30, textAlign: "left", lineHeight: 40 });
            }
            if (IsEmpty(ans)) {
                text02 = createQuestion(720, 75);
            }

            container.addChild(bg);
            container.addChild(bgHeader);
            container.addChild(text01, text02);
            if (!IsEmpty(hint)) {
                container.addChild(text03);
            }
            return container;
        }

        var createLine = function (x0, y0, x1, y1, color) {
            var line = new cjs.Shape(new cjs.Graphics().setStrokeStyle(8).beginStroke(color).moveTo(x0, y0).lineTo(x1, y1));
            return line;
        }

        var bg = new cjs.Shape(new cjs.Graphics().setStrokeStyle(border).beginStroke("#000000").beginFill("#FFFFFF").drawRect(0, 0, width, height));

        var header01 = createHeader(0, 0, "#BAF0F5", "#0277BD", "为什么你认为朋友不重要？", "你向来自以为是，觉得自己不需要\n朋友。");
        var header02 = createHeader(0, 150, "#F2E4A4", "#E1A900", "后来发生了什么事？", "", "你参加一个户外活动时，不小心受伤\n了，朋友十分关心你、还处处帮助你，\n让你很感动。");
        var header03 = createHeader(0, 300, "#FAD6B6", "#F46A3E", "在这件事中，朋友做了什么？", "朋友帮助了你。");
        var header04 = createHeader(0, 450, "#CDF8C3", "#2E7D32", "你的看法有什么改变？", "意识到朋友很重要，明白友谊的珍贵。");

        var line01 = createLine(0, 150, width, 150, "#000000");
        var line02 = createLine(0, 300, width, 300, "#000000");
        var line03 = createLine(0, 450, width, 450, "#000000");

        container.addChild(bg);
        container.addChild(header01, header02, header03, header04);
        container.addChild(line01, line02, line03);
        return container;
    });         

    (libs.createBurgerScene = function (x, y) {
        var container = new cjs.Container();
        container.setTransform(x, y);

        container.reset = function () {
            burger.visible = false;
            banner01.reset();
            banner02.reset();
            banner03.reset();
            arrow01.visible = arrow02.visible = arrow03.visible = false;
            linesLue.visible = linesXiang.visible = false;
            lineBanner01.visible = lineBanner02.visible = false;
        }

        container.showAllByIndex = function (index) {            
            switch (index) {
                case 0:                
                    burger.visible = true;
                    banner01.showAll();
                    banner02.showAll();
                    banner03.showAll();
                    arrow01.visible = arrow02.visible = arrow03.visible = true;
                    break;
                case 1:
                    banner01.showAll();
                    banner02.showAll();
                    banner03.showAll();
                    banner01.showAns();
                    banner02.showAns();
                    banner03.showAns();                          
                    break;                
                case 2:
                    linesLue.visible = linesXiang.visible = true;
                    lineBanner01.visible = lineBanner02.visible = true;
                    break;                
            }            
        }        

        container.isVisibleByIndex = function (index) {
            switch (index) {
                case 0: return burger.visible;
                case 1: return banner01.visible;
                case 2: return banner01.isContentVisibleByIndex(0);
                case 3: return banner02.visible;
                case 4: return banner02.isContentVisibleByIndex(0);
                case 5: return banner02.isContentVisibleByIndex(1);
                case 6: return banner02.isContentVisibleByIndex(2);
                case 7: return banner03.visible;
                case 8: return banner03.isContentVisibleByIndex(0);
                case 9: return linesXiang.visible;
                case 10: return linesLue.visible;
            }
        }

        container.setVisibleByIndex = function (index) {
            switch (index) {
                case 0:
                    libs.fadeIn(burger);
                    break;
                case 1:
                    libs.fadeIn(banner01);
                    libs.fadeIn(arrow01);
                    break;
                case 2:
                    banner01.setContentVisibleByIndex(0);
                    break;
                case 3:
                    libs.fadeIn(banner02);
                    libs.fadeIn(arrow02);
                    break;
                case 4:
                    banner02.setContentVisibleByIndex(0);
                    break;
                case 5:
                    banner02.setContentVisibleByIndex(1);
                    break;
                case 6:
                    banner02.setContentVisibleByIndex(2);
                    break;
                case 7:
                    libs.fadeIn(banner03);
                    libs.fadeIn(arrow03);
                    break;
                case 8:
                    banner03.setContentVisibleByIndex(0);
                    break;
                case 9:
                    libs.fadeIn(linesXiang);
                    libs.fadeIn(lineBanner02);
                    break;
                case 10:
                    libs.fadeIn(linesLue);
                    libs.fadeIn(lineBanner01);
                    break;
            }
        }

        container.getTextContentByIndex = function (indexBanner, indexContent) {
            switch (indexBanner) {
                case 0: return banner01.getContentByIndex(indexContent);
                case 1: return banner02.getContentByIndex(indexContent);;
                case 2: return banner03.getContentByIndex(indexContent);;                
            }
        }

        var createArrow = function (x, y, color, pic, extra) {
            var container = new cjs.Container();
            container.setTransform(x, y);

            var rotate = 0;

            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.rotate)) {
                    rotate = extra.rotate;
                }
            }

            var img = new cjs.Bitmap(pic);
            img.setTransform(0, 0, 1, 1, rotate, 0, 0, 0, img.getBounds().height * 0.5);

            libs.setFilters(img, color);

            container.addChild(img);
            return container;
        }

        var createBanner = function (x, y, color, msg, contents, answers) {
            var container = new cjs.Container();
            container.setTransform(x, y);

            var textContentList = [];

            const widthContent = 230;
            const width = contents.length * widthContent;
            const height = 180            

            container.showAll = function () {
                container.visible = true;
                textContentList.forEach(function (textContent) {
                    textContent.visible = true;
                })
            }

            container.showAns = function () {
                container.visible = true;
                textContentList.forEach(function (textContent) {
                    textContent.showAns();
                })
            }

            container.reset = function () {
                container.visible = false;
                textContentList.forEach(function (textContent) {
                    textContent.reset();
                })
            }

            container.isContentVisibleByIndex = function (index) {
                return textContentList[index].visible;
            }

            container.setContentVisibleByIndex = function (index) {
                libs.fadeIn(textContentList[index]);
            }            

            container.getContentByIndex = function (index) {
                return textContentList[index];
            }            

            var createTextContent = function (x, y, content, ans) {
                var container = new cjs.Container();
                container.setTransform(x, y);

                container.reset = function () {                    
                    container.visible = false;
                    commandStroke.style = "#CDCDCD";
                    bannerAns.visible = false;                    
                }               

                container.onEntered = function () {
                    commandStroke.style = "#FF0000";
                }               

                container.onExited = function () {
                    commandStroke.style = "#CDCDCD";
                }               

                container.setAns = function (msg, color) {
                    bannerAns.setText(msg, color);
                    bannerAns.visible = true;                    
                }

                container.showAns = function () {
                    //ans.setText(msg, color);                         
                    commandStroke.style = "#FF0000";
                    bannerAns.visible = true;
                }

                var createAnsBanner = function (x, y) {
                    var container = new cjs.Container();
                    container.setTransform(x, y);

                    container.setText = function (msg, color) {
                        text.text = msg;
                        text.color = color;
                        container.visible = true;
                        commandStrokeColor.style = color;
                    }

                    var bg = new cjs.Shape(new cjs.Graphics());
                    var commandStrokeColor = bg.graphics.setStrokeStyle(4).beginStroke(ans.color).command;
                    bg.graphics.beginFill("#FFFFFF").drawCircle(0, 0, 30);
                    var text = libs.createCustomText(0, 0, ans.text, { textColor: ans.color, fontSize: 35, textAlign: "center" });

                    container.addChild(bg);
                    container.addChild(text);
                    return container;
                }
                var bannerAns = createAnsBanner(widthContent - 33, 15);                

                var bg = new cjs.Shape(new cjs.Graphics());
                var commandStroke = bg.graphics.setStrokeStyle(2).beginStroke("#CDCDCD").command;
                bg.graphics.beginFill("#FFFFFF").drawRoundRect(0, 14, widthContent - 20, height - 28, 8);
                var text = libs.createCustomText(5, 34, content, { textColor: TEXT_COLOR.DEFAULT, textAlign: "left", fontSize: 20, lineHeight: 28, fontWeight: 500 });                              

                container.addChild(bg);
                container.addChild(text);                
                container.addChild(bannerAns);                
                return container;
            }

            var bgHeader = new cjs.Shape(new cjs.Graphics().beginFill(color).drawRoundRectComplex(0, 0, 100, height, 16, 0, 0, 16));
            bgHeader.setTransform(0, 0, 1, 1, 0, 0, 0, 0, height * 0.5);

            var bgBody = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF").drawRoundRect(0, 0, width + 100, height, 16));
            bgBody.setTransform(0, 0, 1, 1, 0, 0, 0, 0, height * 0.5);
            bgBody.shadow = libs.createShadow(SHADOW_TYPE.PANEL);

            var textHeader = libs.createCustomText(50, 0, msg, { textColor: "#FFFFFF", textAlign: "center", fontSize: 30 });            

            container.addChild(bgBody);
            container.addChild(bgHeader);
            container.addChild(textHeader);            

            var posX = 110;
            contents.forEach(function (content, index) {
                var textContent = createTextContent(posX, -(height * 0.5), content, answers[index]);
                posX += (widthContent)
                textContentList.push(textContent);
                container.addChild(textContent);
            });
            
            return container;
        }

        var createBurger = function (x, y) {
            var container = new cjs.Container();
            container.setTransform(x, y)

            var img01 = new cjs.Bitmap(imgs.item_burger_bread_top);
            var img02 = new cjs.Bitmap(imgs.item_burger_pickles);
            var img03 = new cjs.Bitmap(imgs.item_burger_tomatoes);
            var img04 = new cjs.Bitmap(imgs.item_burger_patty);
            var img05 = new cjs.Bitmap(imgs.item_burger_cheese);
            var img06 = new cjs.Bitmap(imgs.item_burger_bread_bottom);

            img01.setTransform(0, 70);
            img02.setTransform(0, 160);
            img03.setTransform(0, 210);
            img04.setTransform(0, 250);
            img05.setTransform(0, 300);
            img06.setTransform(0, 350);

            container.shadow = libs.createShadow(SHADOW_TYPE.PANEL);
            container.addChild(img06, img01, img05, img04, img03, img02);
            return container;
        }

        var createLueLines = function (x, y) {
            var container = new cjs.Container();
            container.setTransform(x, y);

            var line01 = new cjs.Shape(new cjs.Graphics().setStrokeStyle(8).beginStroke("#D70F64").moveTo(0, 0).lineTo(50, 0).lineTo(50, 400).lineTo(0, 400));
            var line02 = new cjs.Shape(new cjs.Graphics().setStrokeStyle(8).beginStroke("#D70F64").moveTo(0, 200).lineTo(50, 200));
            var line03 = new cjs.Shape(new cjs.Graphics().setStrokeStyle(8).beginStroke("#D70F64").moveTo(50, 100).lineTo(500, 100));
            
            container.addChild(line01, line02, line03);
            return container;
        }

        var createXiangLines = function (x, y) {
            var container = new cjs.Container();
            container.setTransform(x, y);

            var line01 = new cjs.Shape(new cjs.Graphics().setStrokeStyle(8).beginStroke("#084A3A").moveTo(0, 0).lineTo(0, 170).lineTo(300, 170));
            var line02 = new cjs.Shape(new cjs.Graphics().setStrokeStyle(8).beginStroke("#084A3A").moveTo(230, 0).lineTo(230, 170));            

            container.addChild(line01, line02);
            return container;
        }

        var createLineBanner = function (x, y, width, height, color, msg) {
            var container = new cjs.Container();            
            container.setTransform(x, y, 1, 1, 0, 0, 0, 0, height * 0.5);

            var bg = new cjs.Shape(new cjs.Graphics().beginFill(color).drawRoundRect(0, 0, width, height, 16));
            var text = libs.createCustomText(20, 50, msg, { textColor: "#FFFFFF", textAlign: "left", fontSize: 28, lineHeight: 37 });                              

            container.addChild(bg);
            container.addChild(text);
            return container;
        }

        var burger = createBurger(10, 200);

        var arrow01 = createArrow(140, 380, "#FF8400", imgs.item_process_line_01, { rotate: -15 });
        var arrow02 = createArrow(135, 480, "#418CBC", imgs.item_process_line_02);
        var arrow03 = createArrow(140, 580, "#4C8832", imgs.item_process_line_01, { rotate: 15 });

        var banner01 = createBanner(470, 280, "#FF8400", "开头", ["你向来自以为是，\n觉得自己不需要朋友。"], [{ text: "略", color: "#D70F64"}]);
        var banner02 = createBanner(470, 480, "#418CBC", "主体", ["你和同学一起参加\n学校举办的登山活动，\n你本来觉得靠自己的\n能力，要完成活动是\n很容易的。", "没想到，你不小心\n扭伤了脚。同学纷纷\n向你伸出援手，开始\n时，你不想接受同学\n的帮助。", "后来，你渐渐被\n同学的关心和帮助\n感动，也发现了朋友\n的重要。"], [{ text: "略", color: "#D70F64" }, { text: "详", color: "#084A3A" }, { text: "详", color: "#084A3A" }]);
        var banner03 = createBanner(470, 680, "#4C8832", "结尾", ["你明白了友谊的\n珍贵。"], [{ text: "略", color: "#D70F64" }]);

        var linesLue = createLueLines(805, 200);
        var linesXiang = createXiangLines(1010, 435);

        var lineBanner01 = createLineBanner(1300, 300, 350, 140, "#D70F64", "和故事发展有关，但没有\n突出表现主题，要略写。");
        var lineBanner02 = createLineBanner(1300, 600, 350, 140, "#084A3A", "能够突出表现主题，要\n详写。");

        container.addChild(arrow01, arrow02, arrow03);
        container.addChild(burger);
        container.addChild(banner01, banner02, banner03);
        container.addChild(linesLue, linesXiang);
        container.addChild(lineBanner01, lineBanner02);
        return container;
    });

    (libs.createCustom01DragAndDropBox = function (x, y, width, height, pic, colorStroke, targets, destinations, boxParent, extra) {
        var box = new cjs.Container();
        box.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);
        box.setBounds(0, 0, width, height);
        box.cursor = "pointer";

        var targetEntered = null;
        var target = null;
        var boundsCol = { x: 0, y: 0, width: width, height: height };
        var defaultPos = { x: x, y: y };

        box.setPosX = function (posX) {
            box.x = posX;
            defaultPos.x = posX
        }

        box.setPosY = function (posY) {
            box.y = posY;
            defaultPos.y = posY
        }

        box.setBoxParent = function (parent) {
            boxParent = parent;
        }

        box.enable = function (isEnabled) {
            box.mouseEnabled = isEnabled;
        }

        box.updatePos = function (posY) {
            defaultPos.y = posY;
            box.y = posY;
        }

        box.reset = function () {
            box.visible = true;
            if (!IsEmpty(target) && !IsEmpty(target.selected)) {
                target.selected = false;
                target = null;
            }
            box.mouseEnabled = true;
            box.x = defaultPos.x;
            box.y = defaultPos.y;
            box.cursor = "pointer";
            //bg.shadow = libs.createShadow(SHADOW_TYPE.ICON);
            box.scaleX = box.scaleY = 1;
            //bg.visible = false;
        }

        box.resetVo = function () {
            btnPlay.reset();
        }

        box.setNewTarget = function (newTarget) {
            target = newTarget;
            newTarget.setSelected(box);
            box.x = newTarget.x;
            box.y = newTarget.y;
        }

        box.getData = function () {
            return { width: width };
        }

        box.setText = function (msg) {
            //text.text = msg;
        }

        box.setData = function (msg, posY) {
            //text.text = msg;
            box.y = posY;
            defaultPos.y = posY;
        }

        var bg = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF90").setStrokeStyle(3).beginStroke(colorStroke).drawCircle(width * 0.5, width * 0.5, width * 0.5));

        //var bg = new cjs.Shape(new cjs.Graphics().setStrokeStyle(2).beginStroke(colorStroke).beginFill("#FFFFFF").drawRoundRect(0, 0, width, height, 8));
        //bg.cache(0, 0, width, height);
        //bg.shadow = libs.createShadow(SHADOW_TYPE.ICON);
        //box.hitArea = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF").drawRect(0, 0, width, height, 8));

        
        var img = new cjs.Bitmap(pic);
        if (!IsEmpty(pic)) {
            var imgScale = libs.calImgScaleAtWidth(img, width, height);
            img.setTransform(width * 0.5, (height * 0.5), imgScale, imgScale, 0, 0, 0, img.getBounds().width * 0.5, img.getBounds().height * 0.5);            
            img.mask = new cjs.Shape(new cjs.Graphics().drawCircle(width * 0.5, width * 0.5, width * 0.5));

            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.isImgFlipped) && extra.isImgFlipped === true) {
                    img.scaleX = -imgScale;
                }
            }
        }
        

        //var imgText = new cjs.Shape(new cjs.Graphics().f("#230A01").s().p(shape));
        //imgText.setTransform(width * 0.5, height * 0.5);

        //var text = libs.createCustomText(width * 0.5, height * 0.5, msg, { textColor: color, fontSize: 45, textAlign: "center", lineHeight: 50 });

        box.on("pressmove", function (evt) {
            box.scaleX = box.scaleY = 1;
            var inTarget = null;
            targets.forEach(function (item, index) {
                if (IsEmpty(inTarget)) {
                    var source = { x: box.x + boundsCol.x, y: box.y + boundsCol.y, width: boundsCol.width, height: boundsCol.height };
                    var target = { x: item.x + 50, y: item.y + 50, width: item.getBounds().width - 100, height: item.getBounds().height - 100 };
                    if (IntersectRect2RectComplex(source, target)) {
                        inTarget = item;
                    };
                }
            });

            if (!IsEmpty(inTarget)) {
                if (targetEntered !== inTarget) {
                    if (!IsEmpty(targetEntered)) {
                        targetEntered.onExited();
                        targetEntered = null;
                    }
                    targetEntered = inTarget;
                    targetEntered.onEntered();
                }
            } else {
                if (!IsEmpty(targetEntered)) {
                    targetEntered.onExited();
                    targetEntered = null;
                }
            }

            evt.currentTarget.x = evt.stageX;
            evt.currentTarget.y = evt.stageY;
            gm.getStage().update();
        });
        box.on("pressup", function (evt) {
            var isCorrect = false;
            destinations.forEach(function (item, index) {
                var destination = item;
                if (!IsEmpty(destination) && (IsEmpty(destination.selected) || destination.selected === false)) {
                    var sourceRect = { x: box.x + boundsCol.x, y: box.y + boundsCol.y, width: boundsCol.width, height: boundsCol.height };
                    var targetRect = { x: item.x + 50, y: item.y + 50, width: item.getBounds().width - 100, height: item.getBounds().height - 100 };

                    if (IntersectRect2RectComplex(sourceRect, targetRect)) {
                        if (!IsEmpty(target)) {
                            target.clear();
                            //console.log("clear previous target box ");
                        }
                        //console.log("on target");
                        target = destination;
                        isCorrect = true;
                    }
                }
            });

            if (!IsEmpty(targetEntered)) {
                if (!isCorrect) {
                    box.reset();
                    //console.log("on wrong")
                    if (!IsEmpty(extra) && !IsEmpty(extra.onWrong)) {
                        if (!targetEntered.selected) {
                            extra.onWrong(box);
                        }
                    }
                } else {
                    //console.log("on correct")
                    if (!IsEmpty(target) && !IsEmpty(target.selected)) {
                        target.setSelected(box);
                    }
                    if (!IsEmpty(extra) && !IsEmpty(extra.onCorrect)) {
                        extra.onCorrect(box);
                    }
                }
            } else {
                box.reset();
                //console.log("rebounce home")
                if (!IsEmpty(extra) && !IsEmpty(extra.onBounce)) {
                    extra.onBounce();
                }
            }

            if (!IsEmpty(targetEntered)) {
                targetEntered.onExited();
                targetEntered = null;
            }
            gm.getStage()._testMouseOver(true, true);

        });
        box.on("mouseover", function (evt) {
            //createjs.Tween.get(box).to({ scaleX: 1.05, scaleY: 1.05 }, 100, createjs.Ease.quintInOut);
            //bg.visible = true;
            if (box.scaleX === 1) {
                if (!IsEmpty(extra) && !IsEmpty(extra.onMouseOver)) {
                    extra.onMouseOver();
                }
            }
        });
        box.on("mouseout", function (evt) {
            // createjs.Tween.get(box).to({ scaleX: 1, scaleY: 1 }, 100, createjs.Ease.quintInOut);
            //bg.visible = false;
        });
        box.on("mousedown", function (evt) {
            if (!IsEmpty(boxParent)) {
                boxParent.setChildIndex(box, boxParent.numChildren - 1);
                bg.shadow = null;
            }
        })

        box.addChild(bg);
        box.addChild(img);
        //box.addChild(imgText);

        /*
        if (!IsEmpty(extra) && !IsEmpty(extra.msg)) {
            var text = libs.createCustomText(width * 0.5, height - 20, extra.msg, { textColor: "#ff0000", fontSize: 24, textAlign: "center" });
            box.addChild(text);
        }       
        */
        return box;
    });

    (libs.createCustom01Target = function (x, y, width, height, color, pinLocation, pinLength, num, extra) {
        var container = new cjs.Container();
        container.selected = false;
        container.box = null;

        var offsetX = 20;
        var colorHighlight = "#FFFFFF";
        var strokeColorHighlight = "#FF0000";        
        var pic = imgs.item_stain;

        container.setComplete = function (isComplete) {
            textNum.setComplete(isComplete);
        }

        container.blink = function (numTimes) {
            var count = 0;
            var blink = function () {
                if (commandStrokeColor.style === color) {
                    commandStrokeColor.style = strokeColorHighlight;
                } else {
                    commandStrokeColor.style = color;
                }
                if (count < numTimes) {
                    setTimeout(blink, 600);
                } else {
                    commandStrokeColor.style = color;
                }
                count++;
            }

            blink();
        }

        container.setPos = function (pos) {
            container.x = pos.x;
            container.y = pos.y;
        }

        container.highlight = function (isEnable) {
            if (isEnable) {
                commandBgColor.style = colorHighlight;
            } else {
                commandBgColor.style = "#FFFFFF";
            }
        }

        container.setSelected = function (box) {            
            box.x = x;
            box.y = y;
            box.mouseEnabled = false;
            //imgStain.visible = false;
            container.selected = true;
            container.visible = false;
        }

        container.update = function (update) {
            container.x = x + update.offsetX;
        }

        container.getData = function () {
            return { bgColor: "#FFFFFF00" };
        }

        container.reset = function () {
            container.selected = false;
            if (!IsEmpty(container.box)) {
                //console.log("clear target: " + x)
                container.box.reset();
                container.box = null;
            }
            commandBgColor.style = "#FFFFFF90";
            commandStrokeColor.style = color;
            img.image = null;
            imgStain.visible = true;
            //containerMain.mouseEnabled = false;
            offsetX = 20;
            container.visible = true;
        }

        container.clear = function () {
            container.selected = false;
            container.box = null;
        }

        container.onEntered = function () {
            if (!container.selected) {
                //console.log("Entered");
                commandStrokeColor.style = strokeColorHighlight
                //commandBgColor.style = colorHighlight;
                //imgStain.image = picHighlight;
            }
        }

        container.onExited = function () {
            if (!container.selected) {
                //console.log("Exited");
                commandStrokeColor.style = color
                //commandBgColor.style = "#FFFFFF";
                //imgStain.image = pic;
            }
        }

        container.setMouseEnabled = function (isEnabled) {
            containerMain.mouseEnabled = isEnabled;
            if (isEnabled) {
                libs.fadeIn(textNum);
            }
        }

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.pinOffsetX)) {
                pinOffsetX = extra.pinOffsetX;
            }
        }

        var bg = new cjs.Shape(new cjs.Graphics());
        var commandBgColor = bg.graphics.beginFill("#FFFFFF90").command;
        var commandStrokeColor = bg.graphics.setStrokeStyle(3).beginStroke(color).command;
        bg.graphics.drawCircle(0, 0, width * 0.5);

        container.setTransform(x, y);//, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);
        container.setBounds(0, 0, width, height);

        var img = new cjs.Bitmap();
        img.mask = new cjs.Shape(new cjs.Graphics().drawRect(3, 3, width - 6, height - 6, 16));

        var imgStain = new cjs.Bitmap(pic);
        imgStain.setTransform(0, 0, 0.40, 0.40, 0, 0, 0, imgStain.getBounds().width * 0.5, imgStain.getBounds().height * 0.5);

        var text = libs.createCustomText(-(width * 0.5) + 30, 0, "", { textColor: color, fontSize: 40, textAlign: "left", lineHeight: 80 });

        //var containerMain = new cjs.Container();
        //containerMain.setTransform(0, 0, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);
        //containerMain.addChild(bg);
        //containerMain.addChild(imgStain);
        /*
        libs.createBtnEffect(container, function () {
            if (!IsEmpty(extra) && !IsEmpty(extra.onClick)) {
                extra.onClick();
            }
        }, { expandScale: 1.02 })
        */

        //container.addChild(containerMain);        
        container.addChild(bg);
        return container;
    });   

    (libs.createCustom02DragAndDropBox = function (index, x, y, width, height, pic, colorStroke, targets, destinations, boxParent, extra) {
        var box = new cjs.Container();
        box.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);
        box.setBounds(0, 0, width, height);
        box.cursor = "pointer";

        var targetEntered = null;
        var target = null;
        var prevTarget = null;
        var boundsCol = { x: 0, y: 0, width: width, height: height };
        var defaultPos = { x: x, y: y };
        var lastPos = { x: x, y: y };       

        const colorStrokeDefault = "#FFFFFF00";
        const colorStrokeHighlight = "#FF0000";

        box.setHighlight = function (isHightlighted) {
            if (isHightlighted) {
                commandStroke.style = colorStrokeHighlight;
            } else {
                commandStroke.style = colorStrokeDefault;
            }
            
        }

        box.getIndex = function () {
            return index;
        }

        box.getPrevTarget = function () {
            return prevTarget;
        }

        box.setTarget = function (newTarget) {
            target = newTarget;
            target.setBox(box);
        }

        box.isFromHome = function () {
            return (lastPos.y === defaultPos.y)
        }

        box.setLastPos = function (pos) {
            lastPos = pos;
            //console.log("Set last pos: " + JSON.stringify(pos));
        }

        box.getLastPos = function () {
            return lastPos;
        }

        box.setPosX = function (posX) {
            box.x = posX;
            defaultPos.x = posX
        }

        box.setPosY = function (posY) {
            box.y = posY;
            defaultPos.y = posY
        }

        box.setBoxParent = function (parent) {
            boxParent = parent;
        }

        box.enable = function (isEnabled) {
            box.mouseEnabled = isEnabled;
        }

        box.updatePos = function (posY) {
            defaultPos.y = posY;
            box.y = posY;
        }

        box.reset = function () {            
            box.visible = true;
            if (!IsEmpty(target)) {                
                target.clearBox();
                target = null;
            }
            /*
            if (!IsEmpty(target) && !IsEmpty(target.selected)) {
                target.selected = false;
                target = null;
            }
            */
            box.mouseEnabled = true;
            box.x = defaultPos.x;
            box.y = defaultPos.y;
            box.cursor = "pointer";
            //bg.shadow = libs.createShadow(SHADOW_TYPE.ICON);
            box.scaleX = box.scaleY = 1;
            //bg.visible = false;        
            box.setLastPos({ x: x, y: y });
            commandStroke.style = colorStrokeDefault;      
            textHelper.visible = gIsDevelopment;
        }

        box.resetVo = function () {
            btnPlay.reset();
        }

        box.setNewTarget = function (newTarget) {
            target = newTarget;
            newTarget.setSelected(box);
            box.x = newTarget.x;
            box.y = newTarget.y;
        }

        box.getData = function () {
            return { width: width };
        }

        box.setText = function (msg) {
            //text.text = msg;
        }

        box.setData = function (msg, posY) {
            //text.text = msg;
            box.y = posY;
            defaultPos.y = posY;
        }

        var bg = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF00"));
        var commandStroke = bg.graphics.setStrokeStyle(10).beginStroke(colorStroke).command;
        bg.graphics.drawRect(0, 0, width, height);

        //var bg = new cjs.Shape(new cjs.Graphics().setStrokeStyle(2).beginStroke(colorStroke).beginFill("#FFFFFF").drawRoundRect(0, 0, width, height, 8));
        //bg.cache(0, 0, width, height);
        //bg.shadow = libs.createShadow(SHADOW_TYPE.ICON);
        //box.hitArea = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF").drawRect(0, 0, width, height, 8));


        var img = new cjs.Bitmap(pic);
        if (!IsEmpty(pic)) {
            var imgScale = libs.calImgScaleAtWidth(img, width, height);
            img.setTransform(width * 0.5, (height * 0.5), imgScale, imgScale, 0, 0, 0, img.getBounds().width * 0.5, img.getBounds().height * 0.5);
            //img.mask = new cjs.Shape(new cjs.Graphics().drawCircle(width * 0.5, width * 0.5, width * 0.5));

            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.isImgFlipped) && extra.isImgFlipped === true) {
                    img.scaleX = -imgScale;
                }
            }
        }


        //var imgText = new cjs.Shape(new cjs.Graphics().f("#230A01").s().p(shape));
        //imgText.setTransform(width * 0.5, height * 0.5);

        //var text = libs.createCustomText(width * 0.5, height * 0.5, msg, { textColor: color, fontSize: 45, textAlign: "center", lineHeight: 50 });

        box.on("pressmove", function (evt) {
            box.scaleX = box.scaleY = 1;
            var inTarget = null;
            targets.forEach(function (item, index) {
                if (IsEmpty(inTarget)) {
                    var source = { x: box.x + boundsCol.x, y: box.y + boundsCol.y, width: boundsCol.width, height: boundsCol.height };
                    var target = { x: item.x + 100, y: item.y + 50, width: item.getBounds().width - 200, height: item.getBounds().height - 100 };
                    if (IntersectRect2RectComplex(source, target)) {
                        inTarget = item;
                    };
                }
            });

            if (!IsEmpty(inTarget)) {
                if (targetEntered !== inTarget) {
                    if (!IsEmpty(targetEntered)) {
                        targetEntered.onExited();
                        targetEntered = null;
                    }
                    targetEntered = inTarget;
                    targetEntered.onEntered();
                }
            } else {
                if (!IsEmpty(targetEntered)) {
                    targetEntered.onExited();
                    targetEntered = null;
                }
            }

            evt.currentTarget.x = evt.stageX;
            evt.currentTarget.y = evt.stageY;
            gm.getStage().update();
        });
        box.on("pressup", function (evt) {
            var isCorrect = false;
            commandStroke.style = colorStrokeDefault;
            destinations.forEach(function (item, index) {
                var destination = item;
                if (!IsEmpty(destination) && (IsEmpty(destination.selected) || destination.selected === false)) {
                    var sourceRect = { x: box.x + boundsCol.x, y: box.y + boundsCol.y, width: boundsCol.width, height: boundsCol.height };
                    var targetRect = { x: item.x + 100, y: item.y + 50, width: item.getBounds().width - 200, height: item.getBounds().height - 100 };

                    if (IntersectRect2RectComplex(sourceRect, targetRect)) {
                        prevTarget = target;
                        if (!IsEmpty(target)) {                            
                            target.clear();
                            //console.log("clear previous target box ");
                        }
                        //console.log("on target");
                        target = destination;
                        isCorrect = true;
                    }
                }
            });

            if (!IsEmpty(targetEntered)) {
                if (!isCorrect) {
                    box.reset();
                    //console.log("on wrong")
                    if (!IsEmpty(extra) && !IsEmpty(extra.onWrong)) {
                        if (!targetEntered.selected) {
                            extra.onWrong(box);
                        }
                    }
                } else {
                    //console.log("on correct")
                    if (!IsEmpty(target) && !IsEmpty(target.selected)) {
                        target.setSelected(box);
                    }
                    if (!IsEmpty(extra) && !IsEmpty(extra.onCorrect)) {
                        extra.onCorrect(box);
                    }
                }
            } else {
                box.reset();                
                if (!IsEmpty(extra) && !IsEmpty(extra.onBounce)) {
                    extra.onBounce();
                }
            }

            if (!IsEmpty(targetEntered)) {
                targetEntered.onExited();
                targetEntered = null;
            }
            gm.getStage()._testMouseOver(true, true);

        });
        box.on("mouseover", function (evt) {
            //createjs.Tween.get(box).to({ scaleX: 1.05, scaleY: 1.05 }, 100, createjs.Ease.quintInOut);
            //bg.visible = true;
            if (box.scaleX === 1) {
                if (!IsEmpty(extra) && !IsEmpty(extra.onMouseOver)) {
                    extra.onMouseOver();
                }
            }
        });
        box.on("mouseout", function (evt) {
            // createjs.Tween.get(box).to({ scaleX: 1, scaleY: 1 }, 100, createjs.Ease.quintInOut);
            //bg.visible = false;
        });
        box.on("mousedown", function (evt) {
            if (!IsEmpty(boxParent)) {
                boxParent.setChildIndex(box, boxParent.numChildren - 1);
                bg.shadow = null;
            }
        })        
        
        box.addChild(img);
        box.addChild(bg);
        //box.addChild(imgText);

        var textHelper = libs.createCustomText(width - 20, height - 20, (index + 1), { textColor: "#FF0000" });        
        box.addChild(textHelper);

        /*
        if (!IsEmpty(extra) && !IsEmpty(extra.msg)) {
            var text = libs.createCustomText(width * 0.5, height - 20, extra.msg, { textColor: "#ff0000", fontSize: 24, textAlign: "center" });
            box.addChild(text);
        }       
        */
        return box;
    });

    (libs.createCustom02Target = function (index, x, y, width, height, color, extra) {
        var container = new cjs.Container();
        container.selected = false;
        var myBox = null;

        var offsetX = 20;
        var colorHighlight = "#FFFFFF";
        var strokeColorHighlight = "#FF0000";
        var pic = imgs.item_stain;

        container.checkCorrect = function () {
            if (!IsEmpty(myBox)) {
                if (myBox.getIndex() !== index) {
                    myBox.setHighlight(true);
                };
                
            }            
        }

        container.isCorrect = function () {
            if (!IsEmpty(myBox)) {
                //console.log("myBox index: " + myBox.getIndex() + " => " + index);
                if (myBox.getIndex() === index) return true;
                return false;
            } 
            return false;
        }

        container.hasBox = function () {
            return myBox !== null;
        }

        container.setBox = function (box) {            
            setBox(box);
            //console.log("myBox at target: " + x + " is " + myBox);;
        }

        container.clearBox = function () {            
            setBox(null);
            //console.log("clearbox: " + x)
        }

        container.setComplete = function (isComplete) {
            textNum.setComplete(isComplete);
        }

        container.blink = function (numTimes) {
            var count = 0;
            var blink = function () {
                if (commandStrokeColor.style === color) {
                    commandStrokeColor.style = strokeColorHighlight;
                } else {
                    commandStrokeColor.style = color;
                }
                if (count < numTimes) {
                    setTimeout(blink, 600);
                } else {
                    commandStrokeColor.style = color;
                }
                count++;
            }

            blink();
        }

        container.setPos = function (pos) {
            container.x = pos.x;
            container.y = pos.y;
        }

        container.highlight = function (isEnable) {
            if (isEnable) {
                commandBgColor.style = colorHighlight;
            } else {
                commandBgColor.style = "#FFFFFF";
            }
        }

        container.setSelected = function (box) {                        
            //console.log("myBox at target: " + x + " is " + myBox);;
            if (!IsEmpty(myBox)) {                                
                if (box.isFromHome()) {                    
                    myBox.reset();                    
                } else {
                    var pos = box.getLastPos();
                    //console.log("send box to: " + JSON.stringify(pos));
                    myBox.x = pos.x;
                    myBox.y = pos.y;       
                    myBox.setLastPos({ x: pos.x, y: pos.y });
                    myBox.setTarget(box.getPrevTarget());                    
                    myBox.setHighlight(false);
                }

            }            
            setBox(box);
            //console.log("myBox at target: " + x + " is " + myBox);
            box.x = x;
            box.y = y;
            box.setLastPos({ x: box.x, y: box.y });
            //console.log("set last pos: " + JSON.stringify(box.getLastPos()));
            commandStrokeColor.style = color;            
            myBox.setHighlight(false);
        }

        container.update = function (update) {
            container.x = x + update.offsetX;
        }

        container.getData = function () {
            return { bgColor: "#FFFFFF00" };
        }

        container.reset = function () {
            container.selected = false;
            if (!IsEmpty(myBox)) {
                myBox.reset();
                setBox(null);
                //console.log("clearbox: " + x)
            }
            commandBgColor.style = "#FFFFFF90";
            commandStrokeColor.style = color;
            img.image = null;
            imgStain.visible = true;
            //containerMain.mouseEnabled = false;
            offsetX = 20;
            container.visible = true;
            container.mouseEnabled = false;
            container.cursor = "default";
        }

        container.clear = function () {            
            container.selected = false;
            setBox(null);
            //console.log("clearbox: " + x)
        }

        container.onEntered = function () {
            if (!container.selected) {
                //console.log("Entered");
                commandStrokeColor.style = strokeColorHighlight
                //commandBgColor.style = colorHighlight;
                //imgStain.image = picHighlight;
            }
        }

        container.onExited = function () {
            if (!container.selected) {
                //console.log("Exited");
                commandStrokeColor.style = color
                //commandBgColor.style = "#FFFFFF";
                //imgStain.image = pic;
            }
        }

        container.setMouseEnabled = function (isEnabled) {
            container.mouseEnabled = isEnabled;
            container.cursor = "pointer";
        }

        container.click = function () {
            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.onClick)) {
                    extra.onClick(index);
                }
            }
        }

        container.on("click", function () {
            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.onClick)) {
                    extra.onClick(index);
                }
            }
        });

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.pinOffsetX)) {
                pinOffsetX = extra.pinOffsetX;
            }
        }

        var setBox = function (box) {
            myBox = box;            
            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.onTarget)) {
                    extra.onTarget();
                }
            }
        }

        var bg = new cjs.Shape(new cjs.Graphics());
        var commandBgColor = bg.graphics.beginFill("#FFFFFF90").command;
        var commandStrokeColor = bg.graphics.setStrokeStyle(3).beginStroke(color).command;
        bg.graphics.drawRect(0, 0, width, height);

        container.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);
        container.setBounds(0, 0, width, height);

        var img = new cjs.Bitmap();
        img.mask = new cjs.Shape(new cjs.Graphics().drawRect(3, 3, width - 6, height - 6, 16));

        var imgStain = new cjs.Bitmap(pic);
        imgStain.setTransform(0, 0, 0.40, 0.40, 0, 0, 0, imgStain.getBounds().width * 0.5, imgStain.getBounds().height * 0.5);

        var text = libs.createCustomText(-(width * 0.5) + 30, 0, "", { textColor: color, fontSize: 40, textAlign: "left", lineHeight: 80 });

        //var containerMain = new cjs.Container();
        //containerMain.setTransform(0, 0, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);
        //containerMain.addChild(bg);
        //containerMain.addChild(imgStain);
        /*
        libs.createBtnEffect(container, function () {
            if (!IsEmpty(extra) && !IsEmpty(extra.onClick)) {
                extra.onClick();
            }
        }, { expandScale: 1.02 })
        */

        //container.addChild(containerMain);        
        container.addChild(bg);
        return container;
    });   

    (libs.createCustom03DragAndDropBox = function (index, x, y, width, height, pic, colorStroke, targets, destinations, boxParent, extra) {
        var box = new cjs.Container();
        box.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);
        box.setBounds(0, 0, width, height);
        box.cursor = "pointer";

        var targetEntered = null;
        var target = null;
        var prevTarget = null;
        var boundsCol = { x: 0, y: 0, width: width, height: height };
        var defaultPos = { x: x, y: y };
        var lastPos = { x: x, y: y };

        const colorStrokeDefault = colorStroke;
        const colorStrokeHighlight = "#FF0000";

        box.setHighlight = function (isHightlighted) {
            if (isHightlighted) {
                commandStroke.style = colorStrokeHighlight;
            } else {
                commandStroke.style = colorStrokeDefault;
            }

        }

        box.getIndex = function () {
            return index;
        }

        box.getPrevTarget = function () {
            return prevTarget;
        }

        box.setTarget = function (newTarget) {
            //console.log("newTarget: " + newTarget)
            target = newTarget;
            if (!IsEmpty(target)) {
                target.setBox(box);
            }            
        }

        box.isFromHome = function () {
            return (lastPos.x === defaultPos.x)
        }

        box.setLastPos = function (pos) {
            lastPos = pos;
            //console.log("Set last pos: " + JSON.stringify(pos));
        }

        box.getLastPos = function () {
            return lastPos;
        }

        box.setPosX = function (posX) {
            box.x = posX;
            defaultPos.x = posX
        }

        box.setPosY = function (posY) {
            box.y = posY;
            defaultPos.y = posY
        }

        box.setBoxParent = function (parent) {
            boxParent = parent;
        }

        box.enable = function (isEnabled) {
            box.mouseEnabled = isEnabled;
        }

        box.updatePos = function (posY) {
            defaultPos.y = posY;
            box.y = posY;
        }

        box.reset = function () {
            box.visible = true;
            if (!IsEmpty(target)) {
                target.clearBox();
                target = null;
            }
            /*
            if (!IsEmpty(target) && !IsEmpty(target.selected)) {
                target.selected = false;
                target = null;
            }
            */
            box.mouseEnabled = true;
            box.x = defaultPos.x;
            box.y = defaultPos.y;
            box.cursor = "pointer";
            //bg.shadow = libs.createShadow(SHADOW_TYPE.ICON);
            box.scaleX = box.scaleY = 1;
            //bg.visible = false;        
            box.setLastPos({ x: x, y: y });
            commandStroke.style = colorStrokeDefault;
        }

        box.resetVo = function () {
            btnPlay.reset();
        }

        box.setNewTarget = function (newTarget) {
            target = newTarget;
            newTarget.setSelected(box);
            box.x = newTarget.x;
            box.y = newTarget.y;
        }

        box.getData = function () {
            return { width: width };
        }

        box.setText = function (msg) {
            //text.text = msg;
        }

        box.setData = function (msg, posY) {
            //text.text = msg;
            box.y = posY;
            defaultPos.y = posY;
        }

        var bg = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF90"));
        var commandStroke = bg.graphics.setStrokeStyle(3).beginStroke(colorStroke).command;
        bg.graphics.drawCircle(width * 0.5, width * 0.5, width * 0.5);

        //var bg = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF90").setStrokeStyle(3).beginStroke(colorStroke).drawCircle(width * 0.5, width * 0.5, width * 0.5));

        //var bg = new cjs.Shape(new cjs.Graphics().setStrokeStyle(2).beginStroke(colorStroke).beginFill("#FFFFFF").drawRoundRect(0, 0, width, height, 8));
        //bg.cache(0, 0, width, height);
        //bg.shadow = libs.createShadow(SHADOW_TYPE.ICON);
        //box.hitArea = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF").drawRect(0, 0, width, height, 8));


        var img = new cjs.Bitmap(pic);
        if (!IsEmpty(pic)) {
            var imgScale = libs.calImgScaleAtWidth(img, width, height);
            img.setTransform(width * 0.5, (height * 0.5), imgScale, imgScale, 0, 0, 0, img.getBounds().width * 0.5, img.getBounds().height * 0.5);
            img.mask = new cjs.Shape(new cjs.Graphics().drawCircle(width * 0.5, width * 0.5, width * 0.5));

            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.isImgFlipped) && extra.isImgFlipped === true) {
                    img.scaleX = -imgScale;
                }
            }
        }


        //var imgText = new cjs.Shape(new cjs.Graphics().f("#230A01").s().p(shape));
        //imgText.setTransform(width * 0.5, height * 0.5);

        //var text = libs.createCustomText(width * 0.5, height * 0.5, msg, { textColor: color, fontSize: 45, textAlign: "center", lineHeight: 50 });

        box.on("pressmove", function (evt) {
            box.scaleX = box.scaleY = 1;
            var inTarget = null;
            targets.forEach(function (item, index) {
                if (IsEmpty(inTarget)) {
                    var source = { x: box.x + boundsCol.x, y: box.y + boundsCol.y, width: boundsCol.width, height: boundsCol.height };
                    var target = { x: item.x + 50, y: item.y + 50, width: item.getBounds().width - 100, height: item.getBounds().height - 100 };
                    if (IntersectRect2RectComplex(source, target)) {
                        inTarget = item;
                    };
                }
            });

            if (!IsEmpty(inTarget)) {
                if (targetEntered !== inTarget) {
                    if (!IsEmpty(targetEntered)) {
                        targetEntered.onExited();
                        targetEntered = null;
                    }
                    targetEntered = inTarget;
                    targetEntered.onEntered();
                }
            } else {
                if (!IsEmpty(targetEntered)) {
                    targetEntered.onExited();
                    targetEntered = null;
                }
            }

            evt.currentTarget.x = evt.stageX;
            evt.currentTarget.y = evt.stageY;
            gm.getStage().update();
        });
        box.on("pressup", function (evt) {
            var isCorrect = false;
            commandStroke.style = colorStrokeDefault;
            destinations.forEach(function (item, index) {
                var destination = item;
                if (!IsEmpty(destination) && (IsEmpty(destination.selected) || destination.selected === false)) {
                    var sourceRect = { x: box.x + boundsCol.x, y: box.y + boundsCol.y, width: boundsCol.width, height: boundsCol.height };
                    var targetRect = { x: item.x + 50, y: item.y + 50, width: item.getBounds().width - 100, height: item.getBounds().height - 100 };

                    if (IntersectRect2RectComplex(sourceRect, targetRect)) {
                        prevTarget = target;
                        if (!IsEmpty(target)) {
                            target.clear();
                            //console.log("clear previous target box ");
                        }
                        //console.log("on target");
                        target = destination;
                        isCorrect = true;
                    }
                }
            });

            if (!IsEmpty(targetEntered)) {
                if (!isCorrect) {
                    box.reset();
                    //console.log("on wrong")
                    if (!IsEmpty(extra) && !IsEmpty(extra.onWrong)) {
                        if (!targetEntered.selected) {
                            extra.onWrong(box);
                        }
                    }
                } else {
                    //console.log("on correct")
                    if (!IsEmpty(target) && !IsEmpty(target.selected)) {
                        target.setSelected(box);
                    }
                    if (!IsEmpty(extra) && !IsEmpty(extra.onCorrect)) {
                        extra.onCorrect(box);
                    }
                }
            } else {
                box.reset();
                if (!IsEmpty(extra) && !IsEmpty(extra.onBounce)) {
                    extra.onBounce();
                }
            }

            if (!IsEmpty(targetEntered)) {
                targetEntered.onExited();
                targetEntered = null;
            }
            gm.getStage()._testMouseOver(true, true);

        });
        box.on("mouseover", function (evt) {
            //createjs.Tween.get(box).to({ scaleX: 1.05, scaleY: 1.05 }, 100, createjs.Ease.quintInOut);
            //bg.visible = true;
            if (box.scaleX === 1) {
                if (!IsEmpty(extra) && !IsEmpty(extra.onMouseOver)) {
                    extra.onMouseOver();
                }
            }
        });
        box.on("mouseout", function (evt) {
            // createjs.Tween.get(box).to({ scaleX: 1, scaleY: 1 }, 100, createjs.Ease.quintInOut);
            //bg.visible = false;
        });
        box.on("mousedown", function (evt) {
            if (!IsEmpty(boxParent)) {
                boxParent.setChildIndex(box, boxParent.numChildren - 1);
                bg.shadow = null;
            }
        })

        box.addChild(bg);
        box.addChild(img);
        
        //box.addChild(imgText);

        var textHelper = libs.createCustomText(width - 20, height - 20, (index + 1), { textColor: "#FF0000" });
        textHelper.visible = gIsDevelopment;

        //box.addChild(textHelper);

        /*
        if (!IsEmpty(extra) && !IsEmpty(extra.msg)) {
            var text = libs.createCustomText(width * 0.5, height - 20, extra.msg, { textColor: "#ff0000", fontSize: 24, textAlign: "center" });
            box.addChild(text);
        }       
        */
        return box;
    });

    (libs.createCustom03Target = function (index, x, y, width, height, color, extra) {
        var container = new cjs.Container();
        container.selected = false;
        var myBox = null;

        var offsetX = 20;
        var colorHighlight = "#FFFFFF00";
        var strokeColorHighlight = "#FF0000";
        var pic = imgs.item_stain;

        container.checkCorrect = function () {
            if (!IsEmpty(myBox)) {
                if (myBox.getIndex() !== index) {
                    myBox.setHighlight(true);
                };

            }
        }

        container.isCorrect = function () {
            if (!IsEmpty(myBox)) {
                //console.log("myBox index: " + myBox.getIndex() + " => " + index);
                if (myBox.getIndex() === index) return true;
                return false;
            }
            return false;
        }

        container.hasBox = function () {
            return myBox !== null;
        }

        container.setBox = function (box) {
            setBox(box);
            //console.log("myBox at target: " + x + " is " + myBox);;
        }

        container.clearBox = function () {
            setBox(null);
            //console.log("clearbox: " + x)
        }

        container.setComplete = function (isComplete) {
            textNum.setComplete(isComplete);
        }

        container.blink = function (numTimes) {
            var count = 0;
            var blink = function () {
                if (commandStrokeColor.style === color) {
                    commandStrokeColor.style = strokeColorHighlight;
                } else {
                    commandStrokeColor.style = color;
                }
                if (count < numTimes) {
                    setTimeout(blink, 600);
                } else {
                    commandStrokeColor.style = color;
                }
                count++;
            }

            blink();
        }

        container.setPos = function (pos) {
            container.x = pos.x;
            container.y = pos.y;
        }

        container.highlight = function (isEnable) {
            if (isEnable) {
                commandBgColor.style = colorHighlight;
            } else {
                commandBgColor.style = "#FFFFFF00";
            }
        }

        container.setSelected = function (box) {
            //console.log("myBox at target: " + x + " is " + myBox);;
            if (!IsEmpty(myBox)) {
                if (box.isFromHome()) {
                    myBox.reset();
                } else {
                    var pos = box.getLastPos();
                    //console.log("send box to: " + JSON.stringify(pos));
                    myBox.x = pos.x;
                    myBox.y = pos.y;
                    myBox.setLastPos({ x: pos.x, y: pos.y });
                    //console.log("lastPosY: " + pos.y);
                    myBox.setTarget(box.getPrevTarget());
                    myBox.setHighlight(false);
                }

            }
            setBox(box);
            //console.log("myBox at target: " + x + " is " + myBox);
            box.x = x;
            box.y = y;
            box.setLastPos({ x: box.x, y: box.y });
            //console.log("set last pos: " + JSON.stringify(box.getLastPos()));
            commandStrokeColor.style = color;            
            //commandBgColor.style = "#FF0000";
            myBox.setHighlight(false);
        }

        container.update = function (update) {
            container.x = x + update.offsetX;
        }

        container.getData = function () {
            return { bgColor: "#FFFFFF00" };
        }

        container.reset = function () {            
            container.selected = false;
            if (!IsEmpty(myBox)) {
                myBox.reset();
                setBox(null);
                //console.log("clearbox: " + x)
            }
            commandBgColor.style = "#FFFFFF90";
            commandStrokeColor.style = color;
            img.image = null;
            imgStain.visible = true;
            //containerMain.mouseEnabled = false;
            offsetX = 20;
            container.visible = true;
            container.mouseEnabled = false;
            container.cursor = "default";
        }

        container.clear = function () {
            container.selected = false;
            setBox(null);
            //console.log("clearbox: " + x)
            //commandBgColor.style = "#FFFFFF90";
        }

        container.onEntered = function () {
            if (!container.selected) {
                //console.log("Entered");
                commandStrokeColor.style = strokeColorHighlight
                //commandBgColor.style = "#FFFFFF00";
                //commandBgColor.style = colorHighlight;
                //imgStain.image = picHighlight;
            }
        }

        container.onExited = function () {
            if (!container.selected) {
                //console.log("Exited");                
                commandStrokeColor.style = color
                //commandBgColor.style = "#FFFFFF90";                
                
                //commandBgColor.style = "#FFFFFF";
                //imgStain.image = pic;
            }
        }

        container.setMouseEnabled = function (isEnabled) {
            container.mouseEnabled = isEnabled;
            container.cursor = "pointer";
        }

        container.on("click", function () {
            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.onClick)) {
                    extra.onClick(index);
                }
            }
        });

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.pinOffsetX)) {
                pinOffsetX = extra.pinOffsetX;
            }
        }

        var setBox = function (box) {
            myBox = box;
            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.onTarget)) {
                    extra.onTarget();
                }
            }
        }

        var bg = new cjs.Shape(new cjs.Graphics());
        var commandBgColor = bg.graphics.beginFill("#FFFFFF00").command;
        var commandStrokeColor = bg.graphics.setStrokeStyle(3).beginStroke(color).command;
        bg.graphics.drawCircle(width * 0.5, width * 0.5, width * 0.5);

        container.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);
        container.setBounds(0, 0, width, height);

        var img = new cjs.Bitmap();
        img.mask = new cjs.Shape(new cjs.Graphics().drawRect(3, 3, width - 6, height - 6, 16));

        var imgStain = new cjs.Bitmap(pic);
        imgStain.setTransform(0, 0, 0.40, 0.40, 0, 0, 0, imgStain.getBounds().width * 0.5, imgStain.getBounds().height * 0.5);

        var text = libs.createCustomText(-(width * 0.5) + 30, 0, "", { textColor: color, fontSize: 40, textAlign: "left", lineHeight: 80 });

        //var containerMain = new cjs.Container();
        //containerMain.setTransform(0, 0, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);
        //containerMain.addChild(bg);
        //containerMain.addChild(imgStain);
        /*
        libs.createBtnEffect(container, function () {
            if (!IsEmpty(extra) && !IsEmpty(extra.onClick)) {
                extra.onClick();
            }
        }, { expandScale: 1.02 })
        */

        //container.addChild(containerMain);        
        container.addChild(bg);
        return container;
    });   

    (libs.createPicPanel = function (x, y, msg, extra) {
        var container = new cjs.Container();

        var width = 560;
        var height = 315;

        var regX = 0;
        var toX = x;
        var toY = y;

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.zoomStyle)) {
                if (extra.zoomStyle === "LEFT") {
                    regX = width;
                } else {
                    regX = 0;
                }
            }
            if (!IsEmpty(extra.toX)) {
                toX = extra.toX;
            }
            if (!IsEmpty(extra.toY)) {
                toY = extra.toY;
            }
            if (!IsEmpty(extra.width)) {
                width = extra.width;
            }
            if (!IsEmpty(extra.height)) {
                height = extra.height;
            }
        }

        container.setTransform(x, y, 1, 1, 0, 0, 0, regX, height * 0.5);

        container.reset = function () {
            container.x = x;
            container.y = y;
            container.scaleX = container.scaleY = 0;
            container.visible = false;
            if (!IsEmpty(btnPlay)) {
                btnPlay.visible = false;
            }
        }

        container.showAll = function () {
            container.x = toX;
            container.y = toY;
            container.scaleX = container.scaleY = 1;
            container.visible = true;
            if (!IsEmpty(btnPlay)) {
                btnPlay.visible = true;
            }
        }

        container.isVisibleByIndex = function (index) {
            switch (index) {
                case 0:
                    if (!IsEmpty(btnPlay)) {
                        return btnPlay.visible;
                    }
                    return false;
            }
        }

        container.setVisibleByIndex = function (index) {
            switch (index) {
                case 0:
                    if (!IsEmpty(btnPlay)) {
                        libs.fadeIn(btnPlay);
                    }
            }
        }

        container.zoomIn = function () {
            container.scaleX = container.scaleY = 0;
            container.visible = true;
            createjs.Tween.get(container, { override: true }).to({ scaleX: 1, scaleY: 1, alpha: 1, x: toX, y: toY }, 800, createjs.Ease.quintInOut).call(function () {
                cjs.Tween.removeTweens(container);
            });
        }

        var createHeader = function (x, y) {
            var container = new cjs.Container();
            const width = 440;
            const height = 60;

            container.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);

            var bg = new cjs.Shape(new cjs.Graphics().beginFill("#000000").drawRect(0, 0, width, height, 8));
            var text = libs.createCustomText(width * 0.5, height * 0.5, msg, { textColor: "#FFFFFF", textAlign: "center", fontSize: 24 });

            container.addChild(bg);
            container.addChild(text);
            return container;
        }

        var bg = new cjs.Shape(new cjs.Graphics());
        var commandBgColor = bg.graphics.setStrokeStyle(10).beginStroke("#000000").beginFill("#CDCDCD").command;
        bg.graphics.drawRect(0, 0, width, height, 8);
        var header = createHeader(width * 0.5, 0);

        if (!IsEmpty(extra) && !IsEmpty(extra.pic)) {
            var img = new cjs.Bitmap(extra.pic);
            var scale = height / img.getBounds().height;
            img.setTransform(width * 0.5, height * 0.5, scale, scale, 0, 0, 0, img.getBounds().width * 0.5, img.getBounds().height * 0.5);
            commandBgColor.style = "#CDCDCDA0";
            container.addChild(img);
        }

        container.addChild(bg);
        if (msg !== "") {
            container.addChild(header);
        }

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.onPlay)) {
                var btnPlay = libs.createPlayBtn(width * 0.5, height * 0.5, extra.onPlay);
                container.addChild(btnPlay);
            }
        }

        return container;
    });

    (libs.createCustomBanner = function (x, y, msg, hint, vo, extra) {
        var container = new cjs.Container();

        const width = 320;
        const height = 160;

        container.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);

        container.isVisibleByIndex = function (index) {
            switch (index) {
                case 0: return btnHint.visible;
                case 1: return panelHint.isBlinking();
                case 2: return panelEntry.visible;
            }
        }

        container.setVisibleByIndex = function (index) {
            switch (index) {
                case 0: libs.fadeIn(btnHint); break;
                case 1:
                    panelHint.blink(true);                    
                    break;
                case 2:
                    libs.fadeIn(panelEntry);
                    break;
            }
        }

        container.reset = function () {            
            btnHint.visible = false;
            panelEntry.visible = false;
            btnHint.mouseEnabled = true;
            container.visible = false;
            panelHint.reset();
            panelHint.blink(false);            
        }

        container.showAllByIndex = function (index) {
            switch (index) {
                case 0:
                    panelHint.visible = true;
                    btnHint.visible = true;
                    btnHint.mouseEnabled = false;
                    container.visible = true;
                    break;
                case 1:
                    panelHint.visible = true;                    
                    container.visible = true;
                    break;
                case 2:
                    panelEntry.visible = true;                    
                    break;
            }            
        }

        var createEntryPanel = function (x, y) {
            var container = new cjs.Container();

            const width = 470;
            const height = 160;            

            container.setTransform(x, y, 1, 1, 0, 0, 0, 0, height * 0.5);            

            var bg = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF").drawRoundRect(0, 0, width, height, 8));
            
            container.addChild(bg);            
            return container;
        }

        var createHintPanel = function (x, y) {
            var container = new cjs.Container();

            const width = 470;
            const height = 160;

            var colorStroke = "#FFFFFF";
            var isBlinking = false;     
            var blinkTimeout = null;

            container.setTransform(x, y, 1, 1, 0, 0, 0, 0, height * 0.5);

            container.isBlinking = function () {
                return isBlinking;
            }

            container.blink = function (toBlink) {                
                clearTimeout(blinkTimeout);
                if (toBlink) {
                    isBlinking = true;
                    commandStroke.style = "#FFFFFF";
                    container.mouseEnabled = true;
                    blink();
                } else {
                    isBlinking = false;
                    commandStroke.style = "#FFFFFF";                    
                }
            }

            container.reset = function () {
                container.mouseEnabled = false;
                container.scaleY = 1;
                container.visible = false;     
                isBlinking = false;
                textAns.visible = false;
                text.visible = true;
                commandBg.style = "#FFFFFF";
            }

            var blink = function () {
                if (!isBlinking) {
                    commandStroke.style = "#FFFFFF";
                    return;
                }                
                (commandStroke.style === "#FFFFFF") ? colorStroke = "#FF0000" : colorStroke = "#FFFFFF";
                commandStroke.style = colorStroke;
                blinkTimeout = setTimeout(function () {
                    blink();
                }, 1000);
            }

            var bg = new cjs.Shape(new cjs.Graphics());
            var commandStroke = bg.graphics.setStrokeStyle(4).beginStroke(colorStroke).command;
            var commandBg = bg.graphics.beginFill("#FFFFFF").command;
            bg.graphics.drawRoundRect(0, 0, width, height, 8);
            var text = libs.createCustomText(15, 35, hint, { textColor: TEXT_COLOR.DEFAULT, fontSize: 24, lineHeight: 33 });            
            var textAns = libs.createCustomText(15, 38, hint, { textColor: TEXT_COLOR.DEFAULT, fontSize: 22, lineHeight: 31 });            

            libs.createBtnEffect(container, function () {
                if (!IsEmpty(extra)) {                    
                    if (!IsEmpty(extra.onAnsFlip)) {
                        extra.onAnsFlip();
                    }
                }
                createjs.Tween.get(container, { override: true }).to({ scaleY: 0 }, 600, createjs.Ease.quadInOut).call(function () {
                    cjs.Tween.removeTweens(container);      
                    container.blink(false);
                    container.mouseEnabled = false;
                    commandBg.style = "#BAF0F5";    
                    text.visible = false;                    
                    if (!IsEmpty(extra)) {                        
                        if (!IsEmpty(extra.ans)) {
                            textAns.text = extra.ans;
                            textAns.visible = true;                    
                        }                        
                    }
                    
                    createjs.Tween.get(container, { override: true }).to({ scaleY: 1 }, 600, createjs.Ease.quadInOut).call(function () {
                        cjs.Tween.removeTweens(container);
                        if (!IsEmpty(extra) && !IsEmpty(extra.onAnsShown)) {
                            extra.onAnsShown();
                        }
                    });                    
                });
            }, { bypassScale: true });

            container.addChild(bg);
            container.addChild(text);
            container.addChild(textAns);
            return container;

        }

        var createHintBtn = function (x, y, onClick) {
            var container = new cjs.Container();
            container.setTransform(x, y);

            var img = new cjs.Bitmap(imgs.icon_bulb);
            img.setTransform(10, 5, 0.75, 0.75, 15, 0, 0, img.getBounds().width * 0.5, img.getBounds().width * 0.5);

            libs.createBtnEffect(container, onClick)

            container.addChild(img);
            return container;

        }

        var bg = new cjs.Shape(new cjs.Graphics().beginFill("#F46A3E").drawRoundRect(0, 0, width, height, 8));

        var text = libs.createCustomText(15, 35, msg, { textColor: "#FFFFFF", fontSize: 24, lineHeight: 33 });

        var panelHint = createHintPanel(width, height * 0.5)
        var panelEntry = createEntryPanel(width, height * 0.5)

        var btnHint = createHintBtn(width, 0, function () {
            btnHint.mouseEnabled = false;
            if (!panelHint.visible) {
                libs.fadeIn(panelHint);
            }
            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.onBtnHintClick)) {
                    extra.onBtnHintClick(vo);
                }
            }            
        });

        container.addChild(bg);
        container.addChild(text);
        container.addChild(panelHint);
        container.addChild(panelEntry);
        container.addChild(btnHint);
        return container;
    });

    (libs.createLayer = function (posY, height) {
        var container = new cjs.Container();
        container.setTransform(0, posY, 1, 1, 0, 0, 0, 0, height * 0.5);

        var bg = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF70").drawRect(0, 0, PAGE_WIDTH, height));

        container.addChild(bg);
        return container;
    });

    (libs.createCustomNextBtn = function (x, y, title, onClick, extra) {
        var container = new cjs.Container();

        var width = 230;
        var height = 80;
        var iconOffsetX = 0; 
        var textOffsetX = 0; 
        var onClickCallback = null;        

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.width)) {
                width = extra.width;
            }
            if (!IsEmpty(extra.iconOffsetX)) {
                iconOffsetX = extra.iconOffsetX;
            }
            if (!IsEmpty(extra.textOffsetX)) {
                textOffsetX = extra.textOffsetX;
            }
        }

        container.setTransform(x, y, 1, 1, 0, 0, 0, width, height);

        container.overrideBtnNext = function (callback) {
            onClickCallback = callback
        }

        container.disable = function () { 
            container.mouseEnabled = false;
            container.scaleX = container.scaleY = 1;            
            title.color = "#cccccc";
            commandBg.style = "#5C8278";
            libs.setFilters(icon, "#cccccc");            
        }

        container.enable = function () {
            container.mouseEnabled = true;
            title.color = "#ffffff";
            commandBg.style = "#603A2E";
            libs.setFilters(icon, "#FFFFFF");            
        }

        var icon = new cjs.Bitmap(imgs.icon_chevron_right);
        icon.setTransform(iconOffsetX + (width * 0.5) + 55, height * 0.5, 0.75, 0.75, 0, 0, 0, icon.getBounds().width * 0.5, icon.getBounds().height * 0.5);
        libs.setFilters(icon, "#FFFFFF");

        var bg = new cjs.Shape(new cjs.Graphics());
        var commandBg = bg.graphics.beginFill("#603A2E").command;
        bg.graphics.moveTo(19, 0).lineTo(width, 0).lineTo(width, height).lineTo(3, height);
        bg.shadow = libs.createShadow(SHADOW_TYPE.PANEL);

        var text = libs.createCustomText(textOffsetX + (width * 0.5) - 5, height * 0.5, title, { textAlign: "center", textColor: "#FFFFFF", fontSize: 32, fontWeight: 500 });

        container.cursor = "pointer";
        container.on("mouseover", function () {
            cjs.Tween.get(container).to({ y: PAGE_HEIGHT + 5 }, 100, createjs.Ease.quintInOut);
        });
        container.on("mouseout", function () {
            cjs.Tween.get(container).to({ y: PAGE_HEIGHT + 10 }, 100, createjs.Ease.quintInOut);
        });
        container.on("click", function () {
            if (!IsEmpty(onClickCallback)) {
                onClickCallback();
                onClickCallback = null;
            } else {
                onClick();
            }
        });

        container.addChild(bg);
        container.addChild(icon);
        container.addChild(text);
        return container;
    });

    (libs.calImgScale = function (img, imgWidth, imgHeight) {
        var imgScale = 1;
        if (!IsEmpty(img) && !IsEmpty(img.getBounds())) {
            if (img.getBounds().height > imgHeight) {
                imgScale = imgHeight / img.getBounds().height;
            } else {
                if (img.getBounds().width > img.getBounds().height) {
                    imgScale = imgWidth / img.getBounds().width;
                } else {
                    if (img.getBounds().width > imgWidth) {
                        imgScale = imgWidth / img.getBounds().width;
                    } else {
                        imgScale = imgHeight / img.getBounds().height;
                    }
                }                
            }
        }
        return imgScale;
    });

    (libs.calImgScaleAtHeight = function (img, imgWidth, imgHeight) {
        var imgScale = 1;
        if (!IsEmpty(img) && !IsEmpty(img.getBounds())) {
            if (img.getBounds().height > imgHeight) {
                imgScale = imgHeight / img.getBounds().height;
            } else {
                if (img.getBounds().width > imgWidth) {
                    imgScale = imgHeight / img.getBounds().height;                    
                } else {
                    imgScale = imgWidth / img.getBounds().width;
                }
            }
        }
        return imgScale;
    });

    (libs.calImgScaleAtWidth = function (img, imgWidth, imgHeight) {
        var imgScale = 1;
        if (!IsEmpty(img) && !IsEmpty(img.getBounds())) {
            if (img.getBounds().width < img.getBounds().height) {
                imgScale = imgHeight / img.getBounds().height;
            } else {
                if (img.getBounds().width > imgWidth) {
                    imgScale = imgWidth / img.getBounds().width;
                } else {
                    if (img.getBounds().height > imgHeight) {
                        imgScale = imgHeight / img.getBounds().height;
                    } else {
                        imgScale = imgWidth / img.getBounds().width;
                    }
                }
            }
            
        }
        return imgScale;
    });

    (libs.createCustomImgPanel = function (x, y, extra) {
        var container = new cjs.Container();
        container.setTransform(x, y);

        const width = 320;
        const height = 240;

        var panelHelp = null;        

        container.resetVo = function () {
            if (!IsEmpty(panelHelp)) {
                panelHelp.resetVo();
            }            
        }

        container.update = function (index, data) {
            if (!IsEmpty(data)) {
                switch (index) {
                    case 0:
                        {
                            num.update(data.num);
                            img.image = data.pic;
                            if (data.isShared) {
                                btnPlay01.x = (width * 0.5) - 60;
                                btnPlay01.y = (height * 0.5) - 40;
                                btnPlay02.visible = true;
                            } else {
                                btnPlay01.x = width * 0.5;
                                btnPlay01.y = height * 0.5;
                                btnPlay02.visible = false;
                            }                            
                            if (!IsEmpty(img.image)) {
                                var imgScale = libs.calImgScale(img, width, height);
                                img.setTransform(width * 0.5, (height * 0.5), imgScale, imgScale, 0, 0, 0, img.getBounds().width * 0.5, img.getBounds().height * 0.5);
                                img.mask = new cjs.Shape(new cjs.Graphics().drawRect(0, 0, width, height));                                
                            }
                            if (!IsEmpty(data.noPlay) && data.noPlay === true) {
                                btnPlay01.visible = false;
                            } else {
                                btnPlay01.visible = true;
                            }
                            break
                        }
                    case 1:
                        {
                            if (!IsEmpty(panelHelp)) {
                                container.removeChild(panelHelp);
                            }

                            panelHelp = createHelpPanel(0, height, data.msg, data.vo, function () {
                                if (!IsEmpty(extra) && !IsEmpty(extra.onPlayClick)) {
                                    extra.onPlayClick();
                                }
                            });
                            container.addChild(panelHelp);
                            break;
                        }
                    
                }            
            }            
        }

        var createHelpPanel = function (x, y, msg, vo, onPlay) {
            var container = new cjs.Container();
            
            const height = 160;

            container.setTransform(x, y);

            container.resetVo = function () {
                btnPlay.reset();
            }

            var bg = new cjs.Shape(new cjs.Graphics().beginFill("#000000").drawRect(0, 0, width, height));
            var text = libs.createCustomText(10, 30, msg, { textColor: "#FFFFFF", fontSize: 22, fontWeight: 500 })
            var btnPlay = libs.createPlayAndPauseBtn(width - 10, height, vo, {
                onPlay: function() {
                    onPlay();
                }
            });

            container.addChild(bg);
            container.addChild(text);
            container.addChild(btnPlay);
            return container;
        }

        var createNum = function (x, y) {
            var container = new cjs.Container();

            const width = 60;
            const height = 50;

            container.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);

            container.update = function (msg) {
                text.text = msg;
            }

            var bg = new cjs.Shape(new cjs.Graphics().beginFill("#000000").drawRect(0, 0, width, height));
            var text = libs.createCustomText(width * 0.5, height * 0.5, "1", { textColor: "#FFFFFF", textAlign: "center", fontSize: 28 });

            container.addChild(bg);
            container.addChild(text);
            return container;
        }

        var bg = new cjs.Shape(new cjs.Graphics().setStrokeStyle(2).beginStroke("#000000").beginFill("#FFFFFF").drawRect(0, 0, width, height));
        var num = createNum(10, -10);
        var pointer = new cjs.Bitmap(imgs.dialogbox_pointer_direct);
        pointer.setTransform(width - 10, height * 0.5, 1, 1, 0, 0, 0, 0, pointer.getBounds().height * 0.5);
        libs.setFilters(pointer, "#000000");

        var btnPlay01 = libs.createPlayBtn(width * 0.5, height * 0.5, function () {
            if (!IsEmpty(extra) && !IsEmpty(extra.onVideoPlay)) {
                extra.onVideoPlay(0);
            }
        }, { scale: 0.6 });
        var btnPlay02 = libs.createPlayBtn((width * 0.5) + 60, (height * 0.5) + 40, function () {
            if (!IsEmpty(extra) && !IsEmpty(extra.onVideoPlay)) {
                extra.onVideoPlay(1);
            }
        }, { scale: 0.6 });
        btnPlay02.visible = false;

        var img = new cjs.Bitmap();        

        container.addChild(pointer);        
        container.addChild(bg);     
        container.addChild(img);
        container.addChild(num);
        container.addChild(btnPlay01, btnPlay02);
        return container;
    });

    (libs.createCustomEntryPanel = function (x, y, extra) {
        var container = new cjs.Container();
        container.setTransform(x, y);

        const width = 840;
        const height = 480;

        container.update = function (index, data) {
            switch (index) {
                case 0:
                    textHeaderHighlight01.visible = true;
                    btnBulb.visible = true;
                    bgHeader.visible = true;
                    btnHelp.visible = true;
                    textHeader.visible = true;
                    panelHelp.visible = false;
                    btnBulb.update(data);                    
                    break;
                case 1:
                    textHeaderHighlight02.visible = true;
                    btnBulb.visible = false;
                    panelHelp.visible = true;
                    bgHeader.visible = true;
                    btnHelp.visible = true;
                    textHeader.visible = true;
                    panelHelp.update(data);
                    panelHelp.hideItems();
                    break;
                case 2:
                    textHeaderHighlight03.visible = true;
                    btnBulb.visible = false;
                    panelHelp.visible = true;
                    bgHeader.visible = true;
                    btnHelp.visible = true;
                    textHeader.visible = true;
                    panelHelp.update(data);
                    panelHelp.hideItems();
                    break;
                case 3:
                    btnBulb.visible = false;
                    panelHelp.visible = false;
                    bgHeader.visible = true;
                    btnHelp.visible = false;
                    textHeader.visible = true;
                    break;
                case 4:
                    btnBulb.visible = false;
                    panelHelp.visible = false;
                    bgHeader.visible = false;
                    btnHelp.visible = false;
                    textHeader.visible = false;
                    break;

                // last item
                case 5:
                    textHeaderHighlight04.visible = true;
                    btnBulb.visible = false;
                    panelHelp.visible = true;
                    bgHeader.visible = true;
                    btnHelp.visible = true;
                    textHeader.visible = false;
                    panelHelp.update(data);         
                    panelHelp.hideItems();
                    break;
                case 6:
                    textHeaderHighlight05.visible = true;
                    btnBulb.visible = false;
                    panelHelp.visible = true;
                    bgHeader.visible = true;
                    btnHelp.visible = true;
                    textHeader.visible = false;
                    panelHelp.update(data);         
                    panelHelp.hideItems();
                    break;
                case 7:
                    btnBulb.visible = false;
                    panelHelp.visible = false;
                    bgHeader.visible = true;
                    btnHelp.visible = false;                    
                    break;
            }
        }

        container.hideHelp = function () {
            btnBulb.reset();
            panelHelp.reset();            
        }

        container.resetVo = function () {
            btnBulb.resetVo();
            panelHelp.resetVo();
        }

        container.reset = function () {
            btnBulb.reset();
            panelHelp.reset();
            textHeaderHighlight01.visible = false;
            textHeaderHighlight02.visible = false;
            textHeaderHighlight03.visible = false;
            textHeaderHighlight04.visible = false;
            textHeaderHighlight05.visible = false;
        }

        container.isVisibleByIndex = function (index) {            
            return panelHelp.isVisibleByIndex(index);
        }

        container.setVisibleByIndex = function (index) {
            panelHelp.setVisibleByIndex(index);
        }

        container.showAll = function () {
            panelHelp.showAll();
        }

        var createBulbPanel = function (x, y, onClick, onPlay) {
            var container = new cjs.Container();

            const width = 300;
            const height = 160;

            container.setTransform(x, y, 1, 1, 0, 0, 0, width, 0);
            
            container.resetVo = function (data) {
                btnPlay.reset();
            }            

            container.reset = function () {
                containerBg.visible = false;                
            }

            container.update = function (data) {
                if (!IsEmpty(data)) {
                    btnPlay.setVo(data.vo);
                    text.text = data.msg;
                }                
            }

            var bg = new cjs.Shape(new cjs.Graphics().setStrokeStyle(5).beginStroke("#AFB32B").beginFill("#E6EE9B").drawRect(0, 0, width, height));
            var text = libs.createCustomText(20, 40, "你在哪里？\n你在做什么？\n你为什么会心情不好？", { textColor: TEXT_COLOR.DEFAULT, fontSize: 24 })
            var btnPlay = libs.createPlayAndPauseBtn(width - 10, height, "", { onPlay: function() { onPlay("bulb"); } });

            var bulb = new cjs.Bitmap(imgs.icon_bulb);
            bulb.setTransform(width - 10, 0, 0.7, 0.7, 15, 0, 0, bulb.getBounds().width * 0.5, bulb.getBounds().height * 0.5);

            libs.createBtnEffect(bulb, function () {
                containerBg.visible = !containerBg.visible;     
                onClick(containerBg.visible);
            }, { expandScale: 0.75, defaultScale: 0.7 });

            var containerBg = new cjs.Container();

            containerBg.addChild(bg);
            containerBg.addChild(text);
            containerBg.addChild(btnPlay);

            container.addChild(containerBg);
            container.addChild(bulb);
            return container;
        }

        var createHelpPanel = function (x, y, onClick, onPlay) {
            var container = new cjs.Container();

            var items = [];

            const height = 50;
            container.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, 0);                        

            container.showAll = function () {
                items.forEach(function (item) {
                    item.visible = true;
                })
            }

            container.isVisibleByIndex = function (index) {
                switch (index) {
                    case 0: return items[0].visible;
                    case 1: return items[1].visible;
                    case 2: return items[2].visible;
                    case 3: return items[3].visible;
                }
            }

            container.setVisibleByIndex = function (index) {
                switch (index) {
                    case 0: libs.fadeIn(items[0]); break;
                    case 1: libs.fadeIn(items[1]); break;
                    case 2: libs.fadeIn(items[2]); break;
                    case 3: libs.fadeIn(items[3]); break;
                }
            }

            container.hideItems = function () {
                items.forEach(function (item) {
                    item.visible = false;
                })
            }

            container.resetVo = function () {
                items.forEach(function (item) {
                    item.resetVo();
                })
            }

            container.reset = function () {
                items.forEach(function (item) {
                    item.reset();
                })
            }

            container.update = function (data) {
                if (!IsEmpty(data)) {
                    item01.update(data[0]);
                    item02.update(data[1]);
                    item03.update(data[2]);
                    item04.update(data[3]);
                }                
            }

            var bg = new cjs.Shape(new cjs.Graphics().beginFill("#36474F").drawRect(0, 0, width, 30));

            var createItem = function (x, y, msg, pic, onClick, onPlay) {
                var container = new cjs.Container();

                const width = 190;                        

                container.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);            

                container.resetVo = function () {
                    panel.resetVo();
                }

                container.reset = function () {
                    panel.visible = false;
                }

                container.update = function (data) {
                    panel.update(data.msg, data.vo)                    
                }

                container.isPanelVisible = function () {
                    return panel.visible;
                }

                var createPanel = function (x, y, onPlay) {
                    var container = new cjs.Container();

                    const height = 160;
                    var speech = "";

                    container.isVoPlaying = function () {
                        return btnPlay.isVoPlaying();
                    }

                    container.resetVo = function () {
                        btnPlay.reset();
                    }

                    container.setTransform(x, y);

                    container.update = function (msg, vo) {                        
                        text.text = msg;
                        btnPlay.setVo(vo);
                    }

                    var bg = new cjs.Shape(new cjs.Graphics().beginFill("#AFB42B").drawRect(-2, 0, width + 4, height));
                    var text = libs.createCustomText(10, 30, "你在哪里？\n你在做什么？\n你为什么会心情不好？", { textColor: "#263238", fontSize: 22, lineHeight: 30 })
                    var btnPlay = libs.createPlayAndPauseBtn(width - 10, height, "", {
                        onPlay: function() {
                            onPlay();
                        }
                    });

                    container.addChild(bg);
                    container.addChild(text);
                    container.addChild(btnPlay);
                    return container;
                }

                var bg = new cjs.Shape(new cjs.Graphics().setStrokeStyle(3).beginStroke("#AFB42B").beginFill("#E6EE9C").drawRect(0, 0, width, height));
                var text = libs.createCustomText((width * 0.5) + 25, height * 0.5, msg, { textColor: "#263238", fontSize: 25, textAlign: "center" })
                var icon = new cjs.Bitmap(pic);
                if (!IsEmpty(pic)) {
                    icon.setTransform((width * 0.5) - 60, (height * 0.5) - 5, 1.1, 1.1, 0, 0, 0, icon.getBounds().width * 0.5, icon.getBounds().height * 0.5);
                }                

                var panel = createPanel(0, height, function () { onPlay(container); });

                var containerBtn = new cjs.Container();
                containerBtn.setTransform(width * 0.5, height * 0.5, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);
                containerBtn.addChild(bg);
                containerBtn.addChild(text);
                containerBtn.addChild(icon);
                libs.createBtnEffect(containerBtn, function () {
                    panel.visible = !panel.visible;
                    if (!panel.visible && panel.isVoPlaying()) {
                        libs.stopSound();
                        panel.resetVo();
                    }
                    onClick();
                });

                container.addChild(containerBtn);
                container.addChild(panel);
                return container;
            }

            var onItemClick = function () {
                if (!item01.isPanelVisible()
                    && !item02.isPanelVisible()
                    && !item03.isPanelVisible()
                    && !item04.isPanelVisible()) {
                    onClick(false);
                } else {
                    onClick(true);
                }                 
            }

            var onVoPlay = function (source) {
                items.forEach(function (item) {
                    if (item !== source) {
                        item.resetVo();
                    }
                })
                onPlay();
            }

            var item01 = createItem((width * 0.5) - 310, height * 0.5, "行动描写", imgs.icon_description_action, onItemClick, onVoPlay);
            var item02 = createItem((width * 0.5) - 103, height * 0.5, "语言描写", imgs.icon_description_language, onItemClick, onVoPlay);
            var item03 = createItem((width * 0.5) + 103, height * 0.5, "心理描写", imgs.icon_description_mental, onItemClick, onVoPlay);
            var item04 = createItem((width * 0.5) + 310, height * 0.5, "外貌描写", imgs.icon_description_visual, onItemClick, onVoPlay);

            items = [item01, item02, item03, item04];

            container.addChild(bg);
            container.addChild(item01, item02, item03, item04);
            return container;
        }

        var createHighlightedText = function (x, dist, y, msg, color, vo, onClick, extra) {
            var container = new cjs.Container();
            container.setTransform(x + dist, y);

            var bg = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF02").drawRect(0, -13, msg.length * 26, 26));

            var text = libs.createCustomText(0, 0, msg, { textColor: color, fontSize: 26, fontWeight: 500 })    

            libs.createBtnEffect(container, function () {                
                onClick();
                libs.stopSound();
                libs.playSound(vo);
            }, { expandScale: 1, onMouseover: function () { text.color = "#FFEE00" }, onMouseout: function () { text.color = color } });
            
            container.addChild(bg);
            container.addChild(text);
            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.header)) {
                    var textHeader = libs.createCustomText(-dist, 0, extra.header, { textColor: "#FFFFFF", fontSize: 26, fontWeight: 500 })
                    textHeader.mouseEnabled = false;
                    container.addChild(textHeader);
                }
            }
            return container;
        }

        var bg = new cjs.Shape(new cjs.Graphics().setStrokeStyle(6).beginStroke("#36474F").beginFill("#FFFFFF").drawRect(0, 0, width, height));
        var bgHeader = new cjs.Shape(new cjs.Graphics().beginFill("#36474F").drawRect(0, 0, width, 80));
        var btnBulb = createBulbPanel(width, 78, function (isVisible) {
            if (!IsEmpty(extra) && !IsEmpty(extra.onBulbClick)) {
                extra.onBulbClick(isVisible);
            }
        }, function (type) {
                if (!IsEmpty(extra) && !IsEmpty(extra.onPlayClick)) {
                    extra.onPlayClick(type);
                }
        });
        var btnHelp = libs.createStandardBtn(width - 100, height + 20, "#D84848", imgs.icon_question, "帮助", function () {
            if (!IsEmpty(extra) && !IsEmpty(extra.onHelpClick)) {
                extra.onHelpClick();
            }
        }, { iconRotate: 0, colorStroke: "#863933", width: 160, iconOffsetX: 30, textOffsetX: 10 });

        var onHighlightClick = function () {            
            if (!IsEmpty(extra) && !IsEmpty(extra.onPlayClick)) {
                extra.onPlayClick("highlight");
            }
        }

        var pos = { x: 20, y: 40 };
        var textHeader = libs.createCustomText(pos.x, pos.y, "参考词语：闷闷不乐、疲倦、不耐烦、失望、内疚、发脾气", { textColor: "#FFFFFF", fontSize: 26, fontWeight: 500 })        
        var textHeaderHighlight01 = createHighlightedText(pos.x, 130, pos.y, "闷闷不乐", "#FFC7C7", "s03_u4b_writing_04_hh_01", onHighlightClick);        
        var textHeaderHighlight02 = createHighlightedText(pos.x, 260, pos.y, "疲倦、不耐烦、失望", "#FFC7C7", "s03_u4b_writing_04_hh_02", onHighlightClick);        
        var textHeaderHighlight03 = createHighlightedText(pos.x, 520, pos.y, "内疚、发脾气", "#FFC7C7", "s03_u4b_writing_04_hh_03", onHighlightClick);        
        var textHeaderHighlight04 = createHighlightedText(pos.x, 130, pos.y, "鼓起勇气、停顿了一下、惭愧、知错能改", "#FFC7C7", "s03_u4b_writing_04_hh_04", onHighlightClick, { header: "参考词语：" });
        var textHeaderHighlight05 = createHighlightedText(pos.x, 130, pos.y, "渴了吧、停顿了一下、惭愧、知错能改", "#FFC7C7", "s03_u4b_writing_04_hh_05", onHighlightClick, { header: "参考词语：" });

        var panelHelp = createHelpPanel(width * 0.5, 70, function (isVisible) {
            if (!IsEmpty(extra) && !IsEmpty(extra.onBulbClick)) {
                extra.onBulbClick(isVisible);                
            } 
        }, function (type) {
            if (!IsEmpty(extra) && !IsEmpty(extra.onPlayClick)) {
                extra.onPlayClick(type);
            }
        });

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.hideBtns) && extra.hideBtns === true) {
                btnHelp.visible = false;
                btnBulb.visible = false;
            }

            if (!IsEmpty(extra.hidePanel) && extra.hidePanel === true) {
                panelHelp.visible = false;                
            }
        }

        container.addChild(bg);
        container.addChild(bgHeader);
        container.addChild(textHeader);
        container.addChild(textHeaderHighlight01);
        container.addChild(textHeaderHighlight02);
        container.addChild(textHeaderHighlight03);
        container.addChild(textHeaderHighlight04);
        container.addChild(textHeaderHighlight05);
        container.addChild(btnBulb);
        container.addChild(btnHelp);
        container.addChild(panelHelp);
        return container;
    });

    (libs.createLine = function (x0, y0, x1, y1, color, extra) {
        var thickness = 8;

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.thickness)) {
                thickness = extra.thickness;
            }
        }
        var line = new cjs.Shape(new cjs.Graphics().setStrokeStyle(thickness).beginStroke(color).moveTo(x0, y0).lineTo(x1, y1));
        return line;
    });

    (libs.createCustomBtn = function (x, y, msg, imgOff, imgOn, onClick, extra) {
        var container = new cjs.Container();        
        
        let textColor = "#A0FA78";
        var isClickInteraction = false;
        let effect = "click_button";
        let scaleX = 1;
        let scale = 1;
        let picCorrect = null;
        let picWrong = null;
        let posDefault = { x: x, y: y };
        let isOverlay = false;

        if (!IsEmpty(extra)) {            
            if (!IsEmpty(extra.textColor)) {
                textColor = extra.textColor;
            }
            if (!IsEmpty(extra.isClickInteraction) && extra.isClickInteraction === true) {
                isClickInteraction = extra.isClickInteraction;
            }
            if (!IsEmpty(extra.effect)) {
                effect = extra.effect;
            }
            if (!IsEmpty(extra.isFlipped) && extra.isFlipped === true) {
                scaleX = -1;
            }
            if (!IsEmpty(extra.picCorrect)) {
                picCorrect = extra.picCorrect;
            }
            if (!IsEmpty(extra.picWrong)) {
                picWrong = extra.picWrong;
            }
            if (!IsEmpty(extra.scale)) {
                scale = extra.scale;
            }
            if (!IsEmpty(extra.isOverlay) && extra.isOverlay === true) {
                isOverlay = true;
            }
        }

        container.reset = function () {
            imgBg.image = imgOff;

            if (isOverlay) {
                imgBg.visible = false;
            }
        }

        container.setExtra = function (extra) {
            container.setOffsetPos(0, 0);
            if (!IsEmpty(extra)) {
                if (!IsEmpty(extra.nextOffset)) {
                    container.setOffsetPos(extra.nextOffset.x, extra.nextOffset.y);
                } 
            }            
        }

        container.setPos = function (x, y) {
            container.x = x;
            container.y = y;
        }

        container.setOffsetPos = function (x, y) {
            container.x = (posDefault.x + x);
            container.y = (posDefault.y + y);
        }

        container.setEffect = function (sound) {
            effect = sound;
        }        

        container.getImg = function () {
            return imgBg;
        }

        container.setPic = function (pic) {
            imgBg.image = pic;
        }

        container.setCorrect = function (isCorrect) {
            if (IsEmpty(isCorrect)) return;
            if(isCorrect && !IsEmpty(picCorrect)){
                imgBg.image = picCorrect;
            }
            if (!isCorrect && !IsEmpty(picWrong)) {
                imgBg.image = picWrong;
            }
        }

        container.click = function () {
            if (!IsEmpty(onClick)) {
                onClick();
            }
        }

        container.show = function (isShown, offset) {
            if (isShown) {
                if (!IsEmpty(offset)) {
                    container.x = x + offset.x;
                    container.y = y + offset.y;
                }
                container.visible = true;
            } else {                
                container.visible = false;
                container.x = x;
                container.y = y;
            }
        }

        var imgBg = new cjs.Bitmap(imgOff);
        imgBg.crossOrigin = "Anonymous"
        imgBg.hitArea = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF").drawRect(0, 0, imgBg.getBounds().width, imgBg.getBounds().height));
        container.setTransform(x, y, scale * scaleX, scale, 0, 0, 0, imgBg.getBounds().width * 0.5, imgBg.getBounds().height * 0.5);

        var text = libs.createCustomText(0, 0, msg, { textColor: textColor, textAlign: "center", fontSize: 26 });

        //container.hitArea = new cjs.Shape(new cjs.Graphics().beginFill("#000000A0").drawRect(-width * 0.5 + 30, -height * 0.5, width - 60, height * 0.5));
        container.cursor = "pointer";
        if (isClickInteraction) {
            container.on("click", function () {
                libs.playEffect("btn_click");
                onClick();
            });            
        } else {
            container.on("mousedown", function () {                
                libs.playEffect(effect);
                imgBg.image = imgOn;

                if (isOverlay) {
                    imgBg.visible = true;
                }
            });
            container.on("pressup", function () {                
                onClick();
            })
        }
        

        /*
        container.on("click", function () {
            onClick();
        })
        */       

        container.addChild(imgBg);
        container.addChild(text);

        if (isOverlay) {
            var overlay = new cjs.Shape(new cjs.Graphics().beginFill("#FF000002").drawRect(0, 0, imgBg.getBounds().width, imgBg.getBounds().height));
            container.addChild(overlay);
            imgBg.visible = false;
        }

        return container;
    });    

    (libs.captureCanvasToImg = function (callback) {        
        gParentActivity.cache(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
        callback(gParentActivity.cacheCanvas);
        gParentActivity.uncache();
    });

    (libs.setLocalTimeout = function (handler, timeout) {        
        let runningTime = 0;
        var tick = function (evt) {
            runningTime += evt.delta;
            if (runningTime >= timeout) {
                createjs.Ticker.removeEventListener("tick", tick);
                var index = gTimeoutInstances.indexOf(tick);
                if (index !== -1) {
                    gTimeoutInstances.splice(index, 1);
                    //console.log("remove " + gTimeoutInstances.length)
                }
                handler();
            }
        };
        createjs.Ticker.addEventListener("tick", tick);
        gTimeoutInstances.push(tick)
        //console.log("add " + gTimeoutInstances.length)
    });

    (libs.removeLocalTimeout = function () {
        gTimeoutInstances.forEach(function (tick) {
            createjs.Ticker.removeEventListener("tick", tick);
            //console.log("remove " + gTimeoutInstances.length)
        })
        gTimeoutInstances = [];
    });

    (libs.circleIn = function (img) {
        var interval = null;
        var i = 1200;
        var end = 200;

        var run = function () {
            if (!IsEmpty(interval)) return;

            let animate = function () {
                img.mask = new cjs.Shape(new cjs.Graphics().beginFill("#000000").drawCircle(1000, 260, i));
                i -= 3;
                if (i < end) {
                    i = end;
                    img.mask = new cjs.Shape(new cjs.Graphics().beginFill("#000000").drawCircle(1000, 260, i));
                    clearInterval(interval);
                    interval = null;
                    end = 0;
                }
            }

            interval = setInterval(function () {
                animate();
            }, 1);
            //console.log("animate");
        }

        img.mask = new cjs.Shape(new cjs.Graphics().beginFill("#000000").drawCircle(1000, 260, i));

        run();
    });

    (libs.captureImgToImg = function (imgSrc, imgDest, callback) {
        imgSrc.cache(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
        if (IsEmpty(imgDest)) {
            if (!IsEmpty(callback)) {
                if (IsMobileDevice()) {
                    libs.setLocalTimeout(function () {
                        callback(imgSrc.cacheCanvas);
                    }, 10);
                } else {
                    callback(imgSrc.cacheCanvas);
                }
                imgSrc.uncache();
            }
        } else {
            imgDest.image = imgSrc.cacheCanvas;
            imgSrc.uncache();
            if (!IsEmpty(callback)) {
                if (IsMobileDevice()) {
                    libs.setLocalTimeout(callback, 10);
                } else {
                    callback();
                }
            }
        }        
    });

    (libs.createBtnOverlay = function (x, y, width, height, onClick, extra) {
        var container = new cjs.Container();
        container.setTransform(x, y, 1, 1, 0, 0, 0, width * 0.5, height * 0.5);

        container.show = function (isShown, posOffset) {
            if (!isShown) {            
                if (!IsEmpty(img)) {
                    img.visible = false;
                }
            }
            if (!IsEmpty(posOffset)) {
                container.x = x + posOffset.x;
                container.y = y + posOffset.y;
            }
            container.visible = isShown;            
        }

        container.showPic = function () {
            if (!IsEmpty(img)) {
                img.visible = true;
            }
        }

        var bg = new cjs.Shape(new cjs.Graphics().beginFill("#FF000002").drawRect(0, 0, width, height));

        container.on("mousedown", onClick);
        container.cursor = "pointer";

        if (!IsEmpty(extra)) {
            if (!IsEmpty(extra.pic)) {
                let picScale = 1;

                if (!IsEmpty(extra.picScale)) {
                    picScale = extra.picScale;
                }

                var img = new cjs.Bitmap(extra.pic);
                img.crossOrigin = "Anonymous"
                img.hitArea = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF").drawRect(0, 0, img.getBounds().width, img.getBounds().height));
                img.setTransform(width * 0.5, height * 0.5, picScale, picScale, 0, 0, 0, img.getBounds().width * 0.5, img.getBounds().height * 0.5);
                container.addChild(img);
            }
        }

        container.addChild(bg);
        return container;
    });

    (libs.createHowToPlayPanel = function (onPlay) {
        let container = new cjs.Container();

        container.reset = function () {
            btnNext.visible = true;
            btnPrev.visible = false;
            btnPlay.visible = false;
            imgBg.image = imgs.How_play2b;
        }

        let imgBg = new cjs.Bitmap(imgs.How_play2b);
        imgBg.hitArea = new cjs.Shape(new cjs.Graphics().beginFill("#FFFFFF").drawRect(0, 0, imgBg.getBounds().width, imgBg.getBounds().height));

        var btnNext = libs.createCustomBtn(1105, 425, "", imgs.button1, imgs.button1a, function () {
            btnNext.visible = false;
            btnPrev.visible = true;
            imgBg.image = imgs.How_play2c;
            btnNext.reset();

            if (!btnPlay.visible) {
                btnPlay.scaleX = btnPlay.scaleY = 0;
                btnPlay.visible = true;
                cjs.Tween.get(btnPlay, { override: true }).to({ scaleX: 1.0, scaleY: 1.0 }, 500, createjs.Ease.backOut).call(function () {
                    cjs.Tween.removeTweens(btnPlay);
                });
            }
        }, {});

        var btnPrev = libs.createCustomBtn(1105, 425, "", imgs.button1, imgs.button1a, function () {
            btnNext.visible = true;
            btnPrev.visible = false;
            imgBg.image = imgs.How_play2b;
            btnPrev.reset();

        }, { isFlipped: true });

        var btnPlay = libs.createCustomBtn(1190, 605, "", imgs.play_butt1, imgs.play_butt1, function () {
            btnPlay.reset();
            if (!IsEmpty(onPlay)) onPlay();
        }, {});

        imgBg.on("click", function () { });
        container.reset();

        container.addChild(imgBg);
        container.addChild(btnNext);
        container.addChild(btnPrev);
        container.addChild(btnPlay);
        return container;
    });
    /************ HELPER ENDS ************/
    
    (libs.pageActivityBg = function (parent, timeline) {
        this.initialize(imgs.page_activity01_bg);
        this.parent = parent;
        this.setTransform(-((1280 - PAGE_WIDTH) * 0.5), -((960 - PAGE_HEIGHT) * 0.5));
        if(!IsEmpty(timeline)){
            timeline.addTween(cjs.Tween.get(this).wait(1)); 
        } 
    }).prototype = p = new cjs.Bitmap();
    p.nominalBounds = new cjs.Rectangle(0,0,1741,960);       
    
    // functions
    playActivity.functions = {
        getLibraries: function() {             
            return libs; 
        },
        getImages: function() { return imgs; },        
        getCurFrame: function() { return curFrame; }
    };
    
})(createjs = createjs||{}, PlaytivateActivity = PlaytivateActivity||{});
var createjs, PlaytivateActivity;


