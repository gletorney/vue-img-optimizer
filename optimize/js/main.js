// @gletorney

window.addEventListener('DOMContentLoaded', function() {

  var Vue = window.Vue;
  var URL = window.URL || window.webkitURL;
  var ImageCompressor = window.ImageCompressor;

  var vm = new Vue({
    el: '#app',

    data: function() {
      return {
        options: {
          maxWidth: undefined,
          maxHeight: undefined,
          minWidth: 0,
          minHeight: 0,
          width: undefined,
          height: undefined,
          quality: 0.8,
          mimeType: '',
          convertSize: 5000000,
          success: function (file) {
            console.log('Output: ', file);
            $('.dragover').removeClass('active');
            $('.active-msg').text('');
            if (URL) {
              vm.outputURL = URL.createObjectURL(file);
              var millis = Date.now() - start;
              vm.timer = Math.floor(millis/1000);
            }
            vm.output = file;
            vm.$refs.input.value = '';
          },
          error: function (e) {
            if (e.message){
              window.alert(e.message)
            }
            else {
              window.alert('There was a problem with your file type. Please resave it.');
            }
          },
        },
        inputURL: '',
        outputURL: '',
        input: {},
        output: {},
        getInputDims: function(){
          var image = new Image();
          image.src = $('img.input-img').attr("src");
          var inputDims = '(' + image.naturalHeight +'h x ' + image.naturalWidth + 'w)';
          $('.input-dims').html(inputDims);
        },
        getOutputDims: function(){
          var image = new Image();
          image.src = $('img.compressed').attr("src");
          var outputDims = '(' + image.naturalHeight +'h x ' + image.naturalWidth + 'w)';
          $('.output-dims').html(outputDims);
        }
      };
      timer: ''
    },

    filters: {
      prettySize: function(size) {
        var kilobyte = 1024;
        var megabyte = kilobyte * kilobyte;
        if (size > megabyte) {
          return (size / megabyte).toFixed(2) + ' MB';
        } else if (size > kilobyte) {
          return (size / kilobyte).toFixed(2) + ' KB';
        } else if (size >= 0) {
          return size + ' B';
        }
        return '-';
      },
    },

    methods: {
      compress: function(file) {
        start = Date.now();
        if (!file) {
          return;
        }
        console.log('Input: ', file);
        if (URL) {
          this.inputURL = URL.createObjectURL(file);
        }
        this.input = file;
        new ImageCompressor(file, this.options);

      },

      change: function(e) {
        this.compress(e.target.files ? e.target.files[0] : null);
      },

      dragover: function(e) {
        e.preventDefault();
      },

      drop: function(e) {
        e.preventDefault();
        this.compress(e.dataTransfer.files ? e.dataTransfer.files[0] : null);
      },
    },
  });

  //Trigger loading state
  var msg = '|cmpresn|';

  $('.dragover').on('drop',function(){
    $('.dragover').addClass('active');
    $('.active-msg').text(msg);
  });

  $('#file').on('click',function(){
    $('.dragover').addClass('active');
    $('.active-msg').html(msg);
  });

  //Themes
  console.log('Theme: '+localStorage.getItem("theme"));
  var theme = localStorage.getItem("theme");

  if ( theme == 'color'){
    $('.color-theme').removeClass('hide');
    var bgColorClass = [
      'spectrum-0',
      'spectrum-1',
      'spectrum-2',
      'spectrum-3',
      'spectrum-4',
      'spectrum-5'
    ];
    var randm = Math.floor(Math.random() * bgColorClass.length);
    $('body').addClass(bgColorClass[randm]);
  } else {
    $('.light-theme').removeClass('hide');
  }

  //if you're on light theme, change it to color
  $('.light-theme').click(function(){
    $('body').addClass('spectrum-1');
    $('.theme span').toggle();
    localStorage.setItem('theme', 'color');
    //console.log(localStorage.getItem("theme"));
  });

  //if you're on color theme, change it to light
  $('.color-theme').click(function(){
    $('body').removeAttr('class');
    $('.theme span').toggle();
    localStorage.setItem('theme', 'light');
    //console.log(localStorage.getItem("theme"));
  });

  $('.quality-input-wrapper input').click(function(){
    $('.quality-input-wrapper').toggleClass('view-all');
  });

  $('#app').mouseleave(function(){
    $('.quality-input-wrapper').removeClass('view-all');
  });

});