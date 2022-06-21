/**
 * jspsych-image-bkg-keyboard-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


jsPsych.plugins["image-bkg-keyboard-response"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('image-bkg-keyboard-response', 'stimulus', 'image');
    jsPsych.pluginAPI.registerPreload('image-bkg-button-response', 'background', 'image');

  plugin.info = {
    name: 'image-bkg-keyboard-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      background: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Background',
        default: undefined,
        description: 'The background image to be displayed'
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
      background_height: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Background height',
          default: null,
          description: 'Set the background image height in pixels'
      },
      background_width: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Background width',
          default: null,
          description: 'Set the background image width in pixels'
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Maintain aspect ratio',
        default: true,
        description: 'Maintain the aspect ratio after setting width or height'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEY,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      options: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Option strings',
        default: null,
        description: 'Choices to be displayed on either side of the stimulus'
      },
      option_img: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Option images',
        default: null,
        description: 'The image options to be displayed'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus at end of trial.'
      },
      stimulus_onset: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus onset',
        default: null,
        description: 'How long to hide the stimulus before reveal.'
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
      }, 
      warning_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Duration after which a warning to respond appears',
        default: null,
        description: 'How long after trial starts to show warning.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var html = '';
    if (trial.practice) {
      html += '<h3>Practice session</h3>';
    }
    
    html += '<div style="display:flex; align-items:center; margin: 0% 0% 0% 0%;">';
    
    if (trial.option_img != null) {
      html +=     '<div style="float:left; width:15%; vertical-align: middle;">\
                      <img src="'+trial.option_img[0]+'" style="width:100%; vertical-align: middle;"></img>\
                  </div>\
                  <div style="float:left; width:10%; vertical-align: middle;">\
                      <p style="font-size:400%">&#8592;</p>\
                  </div>';
    } else {
      html +=     '<div style="float:left; width:25%; vertical-align: middle;">\
                      <p style="font-size:300%; vertical-align: middle;">'+trial.options[0]+' &#8592;</p>\
                  </div>';
    }
    
    html += '<div id="jspsych-image-bkg-keyboard-response-container" style="float:left; max-width:50%; max-height: 100vh; vertical-align: middle;">'

    // add background
    html += '<img src="'+trial.background+'" id="jspsych-image-bkg-keyboard-response-background" style="padding: 10px; border: medium solid white; '
    if(trial.background_height !== null){
      html += 'height:'+trial.background_height+'%; '
      if(trial.background_width == null && trial.maintain_aspect_ratio){
        html += 'width: auto; ';
      }
    }
    if(trial.background_width !== null){
      html += 'width:'+trial.background_width+'%; '
      if(trial.background_height == null && trial.maintain_aspect_ratio){
        html += 'height: auto; ';
      }
    } 

    html += '"></img>';

    // display stimulus
    html += '<img src="'+trial.stimulus+'" id="jspsych-image-bkg-keyboard-response-stimulus" style="';
    if(trial.stimulus_height !== null){
          html += 'height:'+trial.stimulus_height+'px; '
          if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
          html += 'width: auto; ';
          }
    }
    if(trial.stimulus_width !== null){
          html += 'width:'+trial.stimulus_width+'px; '
          if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
          html += 'height: auto; ';
          }
    }
    if (trial.stimulus_height !== null) {
          html +='top:'+trial.stimulus_height*1.5+'px; ';
          if(trial.stimulus_width !== null){
          html += 'right:'+trial.stimulus_width*1.5+'px; ';
          }
          else {
          html += 'right:'+trial.stimulus_height*2.5+'px; ';
          }
    }

    // hide stimulus
    if (trial.stimulus_onset !== null) {
      html += 'visibility: hidden; ';
    }
      
    html +='"></img>';

    html += "</div>";

    if (trial.option_img != null) {
      html += '<div style="float:left; width:10%; vertical-align: middle;">\
                  <p style="font-size:400%">&#8594;</p>\
              </div>\
              <div style="float:left; width:15%; vertical-align: middle;">\
                <img src="'+trial.option_img[1]+'" style="width:100%; vertical-align: middle;"></img>\
              </div>';
    } else {
      html += '<div style="float:left; width:25%; vertical-align: middle;">\
                <p style="font-size:300%; vertical-align: middle;">&#8594; '+trial.options[1]+'</p>\
              </div>';
    }      
    html += '</div>';

    // add prompt
    if(trial.prompt !== null){
      html += trial.prompt;
    }

    // draw
    display_element.innerHTML = html;

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
        rt: response.rt,
        stimulus: trial.stimulus,
        response: response.key
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-image-bkg-keyboard-response-stimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-image-bkg-keyboard-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    if (trial.warning_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-image-bkg-keyboard-response-background').style.border = 'medium solid red';
        //display_element.querySelector('#jspsych-image-bkg-keyboard-response-container').style.borderColor = 'red';
        //display_element.querySelector('#jspsych-image-bkg-keyboard-response-background').style.padding = '10px';
      }, trial.warning_duration);
    }

    // hide stimulus if stimulus_onset is set
    if (trial.stimulus_onset !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-image-bkg-keyboard-response-stimulus').style.visibility = 'visible';
      }, trial.stimulus_onset);
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
