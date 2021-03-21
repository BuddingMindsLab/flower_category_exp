/** (July 2012, Erik Weitnauer)
The html-plugin will load and display an external html pages. To proceed to the next, the
user might either press a button on the page or a specific key. Afterwards, the page get hidden and
the plugin will wait of a specified time before it proceeds.

documentation: docs.jspsych.org
*/

jsPsych.plugins['external-html-flower-recon'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'external-html-flower-recon',
    description: '',
    parameters: {
      url: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'URL',
        default: undefined,
        description: 'The url of the external html page'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      background: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Background',
        default: undefined,
        description: 'The background image to be displayed'
      },
      cont_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Continue key',
        default: null,
        description: 'The key to continue to the next page.'
      },
      cont_btn: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Continue button',
        default: null,
        description: 'The button to continue to the next page.'
      },
      check_fn: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Check function',
        default: function() { return true; },
        description: ''
      },
      force_refresh: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Force refresh',
        default: false,
        description: 'Refresh page.'
      },
      // if execute_Script == true, then all javascript code on the external page
      // will be executed in the plugin site within your jsPsych test
      execute_script: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Execute scripts',
        default: false,
        description: 'If true, JS scripts on the external html file will be executed.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var url = trial.url;
    if (trial.force_refresh) {
      url = trial.url + "?t=" + performance.now();
    }

    load(display_element, url, function() {
      var t0 = performance.now();
      var t;
      var finish = function() {
        if (trial.check_fn && !trial.check_fn(display_element)) { return };
        if (trial.cont_key) { display_element.removeEventListener('keydown', key_listener); }
        var trial_data = {
          rt: performance.now() - t0,
          url: trial.url,
          colour: display_element.getElementsByTagName("input")[0].value,
          shape: display_element.getElementsByTagName("input")[1].value,
          responded: display_element.getElementsByTagName("input")[0].getAttribute("clicked")
        };
        clearTimeout(t);
        display_element.innerHTML = '';
        jsPsych.finishTrial(trial_data);
      };

      // by default, scripts on the external page are not executed with XMLHttpRequest().
      // To activate their content through DOM manipulation, we need to relocate all script tags
      if (trial.execute_script) {
        for (const scriptElement of display_element.getElementsByTagName("script")) {
        const relocatedScript = document.createElement("script");
        relocatedScript.text = scriptElement.text;
        relocatedScript.type = scriptElement.type;
        if (scriptElement.hasAttribute("src")){
            relocatedScript.src = scriptElement.src;
        } 
        if (scriptElement.hasAttribute("canvas")) {
            relocatedScript.setAttribute("canvas", "myCanvas");
        }    
        scriptElement.parentNode.replaceChild(relocatedScript, scriptElement);
        };
      }

      // change background image
      display_element.getElementsByTagName("img")[0].setAttribute("src", trial.background);
      
      // add countdown
      var s = 0;
      function startTime(){
        display_element.getElementsByTagName("p")[0].innerHTML = trial.trial_duration/1000 - s;
        s += 1;
        if (s > 30) {
          return;
        }
        t = setTimeout(function(){ startTime() }, 1000);;
      }
      startTime();

      if (trial.cont_btn) { display_element.querySelector('#'+trial.cont_btn).addEventListener('click', finish); }
      if (trial.cont_key) {
        var key_listener = function(e) {
          if (e.which == trial.cont_key) finish();
        };
        display_element.addEventListener('keydown', key_listener);
      }

      // end trial if trial_duration is set
      if (trial.trial_duration !== null) {
        jsPsych.pluginAPI.setTimeout(function() {
          finish();
        }, trial.trial_duration);
      }
    });
  };

  // helper to load via XMLHttpRequest
  function load(element, file, callback){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", file, true);
    xmlhttp.onload = function(){
        if(xmlhttp.status == 200 || xmlhttp.status == 0){ //Check if loaded
            element.innerHTML = xmlhttp.responseText;
            callback();
        }
    }
    xmlhttp.send();
  }

  return plugin;
})();
