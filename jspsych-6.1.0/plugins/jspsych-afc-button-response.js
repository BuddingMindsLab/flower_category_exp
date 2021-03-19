/**
 * afc-button-response
 * Merron Woodbury
 *
 * plugin for Alternative Forced Choice Task with button response
 *
 *
 **/


jsPsych.plugins["afc-button-response"] = (function() {

    var plugin = {};
  
    jsPsych.pluginAPI.registerPreload('afc-button-response', 'stimulus', 'image');
    jsPsych.pluginAPI.registerPreload('afc-button-response', 'choice1', 'image');
    jsPsych.pluginAPI.registerPreload('afc-button-response', 'choice2', 'image');
    jsPsych.pluginAPI.registerPreload('afc-button-response', 'choice3', 'image');

    plugin.info = {
      name: 'afc-button-response',
      description: '',
      parameters: {
        stimulus: {
          type: jsPsych.plugins.parameterType.IMAGE,
          pretty_name: 'Stimulus',
          default: undefined,
          description: 'The image to be displayed'
        },
        choices: {
          type: jsPsych.plugins.parameterType.IMAGE,
          pretty_name: 'Choice1',
          default: undefined,
          description: 'The first choice image to be displayed'
        },
        stimulus_height: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Image height',
          default: null,
          description: 'Set the image height in pixels'
        },
        stimulus_width: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Image width',
          default: null,
          description: 'Set the image width in pixels'
        },
        choice_height: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Background height',
            default: null,
            description: 'Set the background image height in pixels'
        },
        choice_width: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Background width',
            default: null,
            description: 'Set the background image width in pixels'
        },
        prompt: {
          type: jsPsych.plugins.parameterType.STRING,
          pretty_name: 'Prompt',
          default: null,
          description: 'Any content here will be displayed below the stimulus.'
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
        },
        practice: {
          type: jsPsych.plugins.parameterType.BOOL,
          pretty_name: 'Practice trial',
          default: false,
          description: 'If true, trial include a practice trial header.'
        }
      }
    }
  
    plugin.trial = function(display_element, trial) {
  
      var html = '';
      if (trial.practice) {
        html += '<h3>Practice session</h3>';
      }
      
      if (trial.prompt) {
        html += trial.prompt;
      }
      // stimulus
      html += '<div style="clear:both; align-items:top; top:5%; right:20%"><img src="'+trial.stimulus+'" id="afc-stimulus" style="';
      if(trial.stimulus_height !== null){
            html += 'height:'+trial.stimulus_height+'%; '
            if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
            html += 'width: auto; ';
            }
      }
      if(trial.stimulus_width !== null){
            html += 'width:'+trial.stimulus_width+'%; '
            if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
            html += 'height: auto; ';
            }
      }

      html +='"></img></div><br>';

      // options
      html += '<div style="clear:both; align-items:center; margin: 0% 0% 0% 0%;">';
      var sep = (100/trial.choices.length).toString();
      for (i=0; i<trial.choices.length; i++) {
        html += '<div style="float:left; width:'+sep+'%; vertical-align: middle;">\
                    <input type="image" src="'+trial.choices[i]+'" style="width:50%; vertical-align: middle;" id=jspsych-html-button-response-button-' + i +' class="afc_choice"></img>\
                </div>';
      }
      html += "</div>";
  
      // render
      display_element.innerHTML = html;

      // start time
      var start_time = performance.now();
  
      // add event listeners to buttons
      for (var i = 0; i < trial.choices.length; i++) {
        display_element.querySelector('#jspsych-html-button-response-button-' + i).addEventListener('click', function(e){
          var choice = e.currentTarget.getAttribute('src'); // don't use dataset for jsdom compatibility
          after_response(choice);
        });
      }
    
      // store response
      var response = {
        rt: null,
        button: null
      };
  
      // function to handle responses by the subject
      var after_response = function(choice) {
  
        // measure rt
        var end_time = performance.now();
        var rt = end_time - start_time;
        response.button = choice;
        response.rt = rt;

        // after a valid response, the stimulus will have the CSS class 'responded'
        // which can be used to provide visual feedback that a response was recorded
        display_element.querySelector('#afc-stimulus').className += ' responded';

        // disable all the buttons after a response
        var btns = document.querySelectorAll('.jspsych-html-button-response-button button');
        for(var i=0; i<btns.length; i++){
          //btns[i].removeEventListener('click');
          btns[i].setAttribute('disabled', 'disabled');
        }

        if (trial.response_ends_trial) {
          end_trial();
        }
        
      };
  
      // function to end trial when it is time
      var end_trial = function() {
  
        // kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();
  
  
        // gather the data to store for the trial
        var trial_data = {
          "rt": response.rt,
          "stimulus": trial.stimulus,
          "button": response.button
        };
  
        // clear the display
        display_element.innerHTML = '';
  
        // move on to the next trial
        jsPsych.finishTrial(trial_data);
      };
  
  
      // end trial if trial_duration is set
      if (trial.trial_duration !== null) {
        jsPsych.pluginAPI.setTimeout(function() {
          end_trial();
        }, trial.trial_duration);
      }
  
    };
  
    return plugin;
  })();