/**
 * afc-keyboard-response
 * Merron Woodbury
 *
 * plugin for Alternative Forced Choice Task with button response
 *
 *
 **/


jsPsych.plugins["afc-keyboard-response"] = (function() {

    var plugin = {};
  
    jsPsych.pluginAPI.registerPreload('afc-keyboard-response', 'stimulus', 'image');
    jsPsych.pluginAPI.registerPreload('afc-keyboard-response', 'choice1', 'image');
    jsPsych.pluginAPI.registerPreload('afc-keyboard-response', 'choice2', 'image');
    jsPsych.pluginAPI.registerPreload('afc-keyboard-response', 'choice3', 'image');

    plugin.info = {
      name: 'afc-keyboard-response',
      description: '',
      parameters: {
        stimulus: {
          type: jsPsych.plugins.parameterType.IMAGE,
          pretty_name: 'Stimulus',
          default: undefined,
          description: 'The image to be displayed'
        },
        key_choices: {
          type: jsPsych.plugins.parameterType.KEYCODE,
          array: true,
          pretty_name: 'Key Choices',
          default: jsPsych.ALL_KEYS,
          description: 'The keys the subject is allowed to press to respond to the stimulus.'
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
      html += '<div style="clear:both; align-items:top; top:0%; right:20%">\
                <img src="'+trial.stimulus+'" id="afc-stimulus" style="';
      if(trial.stimulus_height !== null){
            html += 'height:'+trial.stimulus_height+'%; '
            if(trial.stimulus_width == null){
            html += 'width: auto; ';
            }
      }
      if(trial.stimulus_width !== null){
            html += 'width:'+trial.stimulus_width+'%; '
            if(trial.stimulus_height == null){
            html += 'height: auto; ';
            }
      }

      html +='"></img></div><br>';

      // options
      html += '<div style="clear:both; align-items:center; margin: 0% 25% 0% 25%;">';
      var sep = (100/trial.choices.length).toString();
      for (i=0; i<trial.choices.length; i++) {
        html += '<div style="float:left; width:'+sep+'%; vertical-align: middle;">\
                    <img src="'+trial.choices[i]+'" style="vertical-align: middle;" id="afc-choice"></img>\
                    <p>'+(i+1)+'</p>\
                </div>';
      }
      html += "</div>";
  
      // render
      display_element.innerHTML = html;

      // start time
      var start_time = performance.now();
    
      // store response
      var response = {
        rt: null,
        key: null
      };
  
      // function to end trial when it is time
      var end_trial = function() {
  
        // kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();
  
        // kill keyboard listeners
        if (typeof keyboardListener !== 'undefined') {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        }

        // gather the data to store for the trial
        var trial_data = {
          "rt": response.rt,
          "stimulus": trial.stimulus,
          "key_press": response.key
        };
  
        // clear the display
        display_element.innerHTML = '';
  
        // move on to the next trial
        jsPsych.finishTrial(trial_data);
      };

      // function to handle responses by the subject
      var after_response = function(choice) {

        // after a valid response, the stimulus will have the CSS class 'responded'
        // which can be used to provide visual feedback that a response was recorded
        display_element.querySelector('#afc-stimulus').className += ' responded';

        // only record the first response
        if (response.key == null) {
          response = choice;
        }

        if (trial.response_ends_trial) {
          end_trial();
        }
        
      };
  
      // start the response listener
      if (trial.key_choices != jsPsych.NO_KEYS) {
        var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: trial.key_choices,
          rt_method: 'performance',
          persist: false,
          allow_held_key: false
        });
      }
  
      // end trial if trial_duration is set
      if (trial.trial_duration !== null) {
        jsPsych.pluginAPI.setTimeout(function() {
          end_trial();
        }, trial.trial_duration);
      }
  
    };
  
    return plugin;
  })();