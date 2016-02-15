/*global swfobject:false */
import Ember from 'ember';
import layout from '../templates/components/wowza-recorder';

export default Ember.Component.extend({
  layout,
  width: 750,
  height: 450,
  recorder: null,
  camAccess: true,
  isRecording: false,
  bindFunctions: ['onRecordingStarted', 'onCamAccess', 'onFlashReady', 'onRecordingStarted', 'onUploadDone'],

  isMobile: Ember.computed(function() {
    var ua = navigator.userAgent.toLowerCase();
    return ['ipad', 'iphone', 'android', 'ipod', 'windows ce', 'windows phone'].reduce((acc, val) => acc || ua.indexOf(val) != -1, false);
  }),

  flashVars: Ember.computed(function() {
    return {
      userId : 'XXY',
      connectionstring: 'foobar',
      qualityurl: 'audio_video_quality_profiles/320x240x30x90.xml',
      recorderId: '123',
      sscode: 'php',
      lstext : 'Loading...',
      mrt: '120',
      authenticity_token: ''
    };
  }),

  params: Ember.computed(function() {
    return {
      quality: 'high',
      bgcolor: '#dfdfdf',
      play: 'true',
      loop: 'false',
      allowscriptaccess: 'sameDomain',
      wmode: 'transparent'
    };
  }),

  attributes: Ember.computed(function() {
    return {
      name: 'VideoRecorder',
      id:   'VideoRecorder',
      align: 'middle'
    };
  }),

  didInsertElement() {
    this._super(...arguments);
    this.get('bindFunctions').map(func => window[func] = this[func].bind(this));

    let el = this.$('#hdfvr-content')[0];

    //TODO What do if on mobile
    if (!this.get('isMobile')) {
      swfobject.embedSWF('VideoRecorder.swf', el, this.get('width'), this.get('height'), '10.3.0', '', this.get('flashVars'), this.get('params'), this.get('attributes'));
    }
  },

  onFlashReady() {
      console.log('OnFlashReady');
      this.set('recorder', document.VideoRecorder);
  },

  onRecordingStarted(recorderId) {
    console.log('onRecordingStarted', arguments);
    this.set('isRecording', true);
    //this function is called when HDFVR starts recording
    //recorderId: the recorderId sent via flash vars, to be used when there are many recorders on the same web page
  },

  onCamAccess(allowed,recorderId) {
    //the user clicked Allow or Deny in the Camera/Mic access dialog box in Flash Player
    //when the user clicks Deny this function is called with allowed=false
    //when the user clicks Allow this function is called with allowed=true
    //you should wait for this function before allowing the user to cal the record() function on HDFVR
    //this function can be called anytime during the life of the HDFVR instance as the user has permanent access to the Camera/Mic access dialog box in Flash Player
    //recorderId: the recorderId sent via flash vars, to be used when there are many recorders on the same web page
    console.log('onCamAccess', arguments);
    this.set('camAccess', allowed);
    // if (!allowed) {
    //   // this.set('isRecording', false);
    // }
  },

  onUploadDone(streamName,streamDuration,userId,recorderId,audioCodec,videoCodec,fileType) {
    console.log('onUploadDone', arguments);
  },

  onSaveOk(streamName,streamDuration,userId,cameraName,micName,recorderId,audioCodec,videoCodec,fileType) {
    console.log('onSaveOk', arguments);
  }

});
