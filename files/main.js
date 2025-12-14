$(function () {
    "use strict"

    var loadText;
    var stage;
    var canvas = document.getElementById("canvas");    

    gm.init(canvas, load, resize);

    function load() {
        var today = new Date();
        var dated = "";//"?" + today.getTime();        
        var manifest = [
            // Resource 02 UI            
            { id: "bg_splash", src: "images/UI/bg_splash.jpg" + dated },
            { id: "bg_credits", src: "images/UI/Credits.jpg" + dated },
            { id: "How_play2", src: "images/UI/How_play2.jpg" + dated },
            { id: "How_play2a", src: "images/UI/How_play2a.jpg" + dated },
            { id: "How_play2b", src: "images/UI/How_play2b.jpg" + dated },
            { id: "How_play2c", src: "images/UI/How_play2c.jpg" + dated },
            { id: "pre_select", src: "images/UI/pre_select.jpg" + dated },
            { id: "menu_1_david", src: "images/UI/menu_1_david.jpg" + dated },
            { id: "menu_1_nadia", src: "images/UI/menu_1_nadia.jpg" + dated },
            { id: "menu_2_david", src: "images/UI/menu_2_david.jpg" + dated },
            { id: "menu_2_nadia", src: "images/UI/menu_2_nadia.jpg" + dated },
            { id: "menu_3_david", src: "images/UI/menu_3_david.jpg" + dated },
            { id: "menu_3_nadia", src: "images/UI/menu_3_nadia.jpg" + dated },
            { id: "David", src: "images/UI/David.jpg" + dated },
            { id: "Nadia", src: "images/UI/Nadia.jpg" + dated },
            { id: "intro_end", src: "images/UI/intro_end.jpg" + dated },

            { id: "btn_start_off", src: "images/UI/btn_start_off.png" + dated },
            { id: "btn_start_on", src: "images/UI/btn_start_on.png" + dated },
            { id: "start_butt1", src: "images/UI/start_butt1.png" + dated },
            { id: "start_butt1a", src: "images/UI/start_butt1a.png" + dated },
            { id: "play_butt1", src: "images/UI/play_butt1.png" + dated },
            { id: "menu_butt1", src: "images/UI/menu_butt1.png" + dated },
            { id: "play_1", src: "images/UI/play_1.png" + dated },
            { id: "play_2", src: "images/UI/play_2.png" + dated },

            { id: "button1", src: "images/UI/intro/button1.png" + dated },
            { id: "button1a", src: "images/UI/intro/button1a.png" + dated },            
            { id: "close_butt1", src: "images/UI/intro/close_butt1.png" + dated },
            { id: "close_butt1a", src: "images/UI/intro/close_butt1a.png" + dated },
            { id: "speaker1", src: "images/UI/intro/speaker1.png" + dated },
            { id: "speaker1a", src: "images/UI/intro/speaker1a.png" + dated },

            { id: "button1_lvl", src: "images/UI/level/button1.png" + dated },
            { id: "button1a_lvl", src: "images/UI/level/button1a.png" + dated },

            { id: "adjective", src: "images/UI/level/adjective.jpg" + dated },
            { id: "adjective1", src: "images/UI/level/adjective1.jpg" + dated },
            { id: "adjective2", src: "images/UI/level/adjective2.jpg" + dated },
            { id: "adverb", src: "images/UI/level/adverb.jpg" + dated },
            { id: "adverb1", src: "images/UI/level/adverb1.jpg" + dated },
            { id: "adverb2", src: "images/UI/level/adverb2.jpg" + dated },
            { id: "noun", src: "images/UI/level/noun.jpg" + dated },
            { id: "noun1", src: "images/UI/level/noun1.jpg" + dated },
            { id: "noun2", src: "images/UI/level/noun2.jpg" + dated },
            { id: "verb", src: "images/UI/level/verb.jpg" + dated },
            { id: "verb1", src: "images/UI/level/verb1.jpg" + dated },
            { id: "verb2", src: "images/UI/level/verb2.jpg" + dated },
            
            { id: "mark1", src: "images/UI/level/mark1.png" + dated },
            { id: "mark2", src: "images/UI/level/mark2.png" + dated },
            { id: "mark3", src: "images/UI/level/mark3.png" + dated },
            { id: "score1", src: "images/UI/level/score1.png" + dated },
            { id: "score2", src: "images/UI/level/score2.png" + dated },
            { id: "score3", src: "images/UI/level/score3.png" + dated },
            { id: "Level_1a_david", src: "images/UI/level/Level_1a_david.jpg" + dated },
            { id: "Level_1a_nadia", src: "images/UI/level/Level_1a_nadia.jpg" + dated },
            { id: "Level_2a_david", src: "images/UI/level/Level_2a_david.jpg" + dated },
            { id: "Level_2a_nadia", src: "images/UI/level/Level_2a_nadia.jpg" + dated },
            { id: "Level_3a_david", src: "images/UI/level/Level_3a_david.jpg" + dated },
            { id: "Level_3a_nadia", src: "images/UI/level/Level_3a_nadia.jpg" + dated },
            { id: "sign1_01_david", src: "images/UI/level/sign1_01_david.jpg" + dated },
            { id: "sign2_01_david", src: "images/UI/level/sign2_01_david.jpg" + dated },
            { id: "sign1_01_nadia", src: "images/UI/level/sign1_01_nadia.jpg" + dated },
            { id: "sign2_01_nadia", src: "images/UI/level/sign2_01_nadia.jpg" + dated },
            { id: "sign1_02_david", src: "images/UI/level/sign1_02_david.jpg" + dated },
            { id: "sign2_02_david", src: "images/UI/level/sign2_02_david.jpg" + dated },
            { id: "sign1_02_nadia", src: "images/UI/level/sign1_02_nadia.jpg" + dated },
            { id: "sign2_02_nadia", src: "images/UI/level/sign2_02_nadia.jpg" + dated },
            { id: "sign1_03_nadia", src: "images/UI/level/sign1_03_nadia.jpg" + dated },
            { id: "sign2_03_nadia", src: "images/UI/level/sign2_03_nadia.jpg" + dated },
            { id: "sign1_03_david", src: "images/UI/level/sign1_03_david.jpg" + dated },
            { id: "sign2_03_david", src: "images/UI/level/sign2_03_david.jpg" + dated },

            { id: "Mug1", src: "images/UI/Mug1.png" + dated },
            { id: "Mug1_1", src: "images/UI/Mug1_1.png" + dated },
            { id: "Mug2", src: "images/UI/Mug2.png" + dated },
            { id: "Mug2_2", src: "images/UI/Mug2_2.png" + dated },
            { id: "Mug3", src: "images/UI/Mug3.png" + dated },
            { id: "Mug3_3", src: "images/UI/Mug3_3.png" + dated },
            { id: "Mug4", src: "images/UI/Mug4.png" + dated },
            { id: "Mug4_4", src: "images/UI/Mug4_4.png" + dated },
            { id: "menu_msg1", src: "images/UI/menu_msg1.png" + dated },
            { id: "menu_msg2", src: "images/UI/menu_msg2.png" + dated },
            { id: "menu_msg3", src: "images/UI/menu_msg3.png" + dated },

            // musics
            { id: "Playdate_loop", src: "sounds/musics/Playdate_loop.mp3" + dated },
            { id: "Bg_kitchen", src: "sounds/musics/Bg_kitchen.wav" + dated },

            // effects
            { id: "click_button", src: "sounds/effects/click_button.wav" + dated },
            { id: "Bell_timer", src: "sounds/effects/Bell_timer.wav" + dated },
            
        ];

        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        document.body.oncontextmenu = function () { return false; };

        stage = gm.getStage();
        stage.enableMouseOver();

        gm.resize();
        canvas.style.backgroundColor = "#ffffff"
        loadText = new createjs.Text("请稍等", "bold 24px Arial", "#000000");
        loadText.maxWidth = 1000;
        loadText.textAlign = "center";
        loadText.textBaseline = "middle";
        loadText.x = PAGE_WIDTH * 0.5;
        loadText.y = PAGE_HEIGHT * 0.5;

        stage.addChild(loadText);


        // preload fonts
        //var font100 = new createjs.Text("font100", "100 10px Noto Sans SC", "#00000000");
        //var font300 = new createjs.Text("font300", "300 10px Noto Sans SC", "#00000000");
        var font400 = new createjs.Text("4", "400 1px Noto Sans SC", "#00000000");
        var font500 = new createjs.Text("5", "500 1px Noto Sans SC", "#00000000");
        var font700 = new createjs.Text("7", "700 1px Noto Sans SC", "#00000000");
        //var font900 = new createjs.Text("9", "900 1px Noto Sans SC", "#00000000");
        stage.addChild(font400, font500, font700);

        var queue = new createjs.LoadQueue(false);
        queue.installPlugin(createjs.Sound);
        queue.on("fileload", handleFileLoad, this);
        queue.on("progress", handleProgress, this);
        queue.on("complete", handleComplete, this);
        queue.loadManifest(manifest);
        queue.setMaxConnections(10);
        queue.load();

        createjs.Ticker.addEventListener("tick", tick);
    }

    function handleFileLoad(event) {
        var item = event.item;
        var type = item.type;        

        var images = PlaytivateActivity.functions.getImages();
        if (event && (event.item.type === "image")) {
            images[event.item.id] = event.result;
        }
    }

    function handleProgress(event) {
        var percentage = (event.target.progress * 100 | 0)
        loadText.text = "Fetching Data  " + percentage + "%";
        if (percentage >= 100) {
            percentage = 100;
            loadText.text = "Loading...Pls Wait";
        }        
        stage.update();
    }

    function handleComplete(event) {
        init();
        
    }

    function resize() {
        //stage.regX = -(canvas.width - PAGE_WIDTH) / 2;  
    }

    function init() {
        stage.removeChild(loadText);
        stage.autoClear = true;
        stage.enableDOMEvents(true);

        // canvas.style.backgroundColor="#FFFFFF"
        // document.body.style.backgroundColor="#FFFFFF";        
        configure();
    }

    function configure() {

        createjs.Touch.enable(stage);
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.framerate = 30;//24;
        //createjs.Tween.ignoreGlobalPause = true;
        //createjs.Tween.useTicks = true;

        var libs = PlaytivateActivity.functions.getLibraries(stage, canvas);
        var content = new libs["activity"]();
        stage.addChild(content);
        //console.log("end");
    }

    function tick(event) {
        stage.update(event);
    }
})