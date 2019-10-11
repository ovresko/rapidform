

$(document).ready(function () {

  var counters = $(".count");
  var countersQuantity = counters.length;
  var counter = [];

  // <form action="target.php" method="post" >
  //     <input type="text" name="lname" />
  //     <input type="text" name="fname" />
  //     <input type="buttom" name ="send" onclick="return f(this.form ,this.form.fname ,this.form.lname) " >
  // </form>

  function submitForm(form, func,save = true) {

    var target = $('#spinner');

    var spinner = new Spinner({lines:12,
      length:12,
      width:3,
      scale:0.3,
      color:'#dd3a04',
    }).spin();
    target.append(spinner.el);

    var url = $(form).attr("action");
    var formData = $(form).serializeArray();
    console.log("start submit");

     $.post(url, formData).done(function (data) {
     // var pdf =JSON.stringify(data.pdfPath);
      console.log("done");

      func();
      if(save)
      {
        window.open('/pdf/'+data.pdfPath, '_blank');
      }
      spinner.stop();
    });
  }
  $('#clearbtn').on('click', function () {
    var id = $('#id').val();
    $.post('/tools/clear/' + id).done(function (data) {
      $(location).attr('href', '/tools/' + id);
    });
  });
  $('#savefinish').click(function (e) {

      var form = $('#formid');
      e.preventDefault()
      submitForm(form[0],() => {

        $("#savefinish").attr("disabled", true);
          setTimeout(function() {
              $("#savefinish").removeAttr("disabled");
          }, 10000);

      });

    // $.ajax({
    //   url: "/tools/save",
    //   type: "POST",
    //   data: {'model':'test'},
    //   success: function (response) {
    //     // .. do something
    //     alert('ok');

    //   },
    //   error: function (jqXHR, textStatus, errorMessage) {

    //   }
    // });

  });

  function uploadFile() {
    var blobFile = $('#my_file')[0].files[0];
    var formData = new FormData();
    formData.append("profile_pic", blobFile);

    $.ajax({
      url: "/tools/upload/",
      type: "POST",

      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        // .. do something

        $("#logo").attr("src", response);
        $('#import_txt').hide();
        $('#import_btn').css({ 'background': 'white', 'box-shadow': 'none' });
      },
      error: function (jqXHR, textStatus, errorMessage) {

      }
    });
  }

  var xhr;

  for (i = 0; i < countersQuantity; i++) {
    counter[i] = parseInt(counters[i].innerHTML);
  }

  var count = function (start, value, id) {
    var localStart = value - 100;
    setInterval(function () {
      if (localStart < value) {

        localStart = localStart + localStart % 3 + 1;

        let r = (localStart.toLocaleString('en'));;

        counters[id].innerHTML = r;
      }
    }, 1900);
  }

  for (j = 0; j < countersQuantity; j++) {
    count(0, counter[j], j);
  }

  var ajaxFunction = function (data) {
    xhr = $.ajax({
      type: "get",
      url: "/tools/find",
      data: { name: data },
      beforeSend: function () {

        $("#loading").fadeIn('slow');

      },
      success: function (data) {

        $("#loading").fadeOut('slow');

        if (data != null && data.length > 0) {

          $("#result").empty();

          data.forEach((a) => {
///{{f.rapidform_id}}?template={{f.id}}
            card = " <div class='column is-three-fifths is-offset-one-fifth'>   <a class='type-card box ' href='/tools/" + a.rapidform_id + "?template="+a.id+"'>"

              + "<p>" + a.title + "  </p> "
              +"<p  class='subtitle'><span class='tag is-light'>"+(a.country)+"</span>"+a.description+" </p>  </a>    </div>";

            $("#result").append(card);
          });

        }

      }
    });
  }

  $('#search').on('keyup paste', function (e) {
    var code = e.key;

    if (this.value.length >= 3 && code != 'Backspace') { ajaxFunction(this.value); } else {
      if (xhr)
        xhr.abort();
      $("#result").empty();

    }
  });

  function openTab(evt, tabName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("content-tab");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab");

    for (i = 0; i < x.length; i++) {

      tablinks[i].className = tablinks[i].className.replace(" is-active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " is-active";
  }

  var dropdown = document.querySelector('.dropdown');

  $('.dropdown').on('click', () => {
    dropdown.classList.toggle('is-active');
  });

  function rerender(){

    var renderView = $('#renderView');

    if(renderView.length){
      $.get( "/tools/dorender",{}, function( data ) {
       renderView.attr("src", '/pdf/'+data.imgpath);

       $('#box').css("background-color", "yellow");
       setTimeout(function() {
        $('#box').css("background-color", "white");
        }, 1000);
        //renderView.html(data);
      });

    }
  }

  rerender();
  var btn = $("#savebtn");
  btn.click((e) => {
    // if(!$("#savebtn").is(":disabled"))
    // {
      e.preventDefault()
      var form = $('#formid');
      submitForm(form[0],() => {

        $("#savebtn").attr("disabled", true);
        rerender();

          setTimeout(function() {

               $("#savebtn").removeAttr("disabled");
            }, 10000);

      },false);
    //}

  });

  var printBtn = $("#printBtn");
  printBtn.click((e) => {
    // if(!$("#savebtn").is(":disabled"))
    // {

      var form = $('#formid');
      submitForm(form[0],() => {

        $("#printBtn").attr("disabled", true);

        $.get( "/tools/doprint",{}, function( data ) {

         // $('#printView').html(data);
          console.log("done submitting");

           var newWin=window.open('','_blank');
           newWin.document.open();
           newWin.document.write('<html><body onload="window.print()"><head> <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js" ></script> <script src="http://localhost:3333/js/printThis.js"></script>  </head>'+data+'</body><script>$("body").printThis( )</script></html>');
          // $('#printView').printThis( );
          //newWin.document.$('body').printThis( );
         });

          setTimeout(function() {

               $("#printBtn").removeAttr("disabled");
            }, 10000);

      },false);

      e.preventDefault()

  });

});
