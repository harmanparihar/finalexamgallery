$(function(){
    var n = localStorage.getItem('on_load_counter');
    if (n === null) {
        n = 0;
    }
    n++;
    localStorage.setItem("on_load_counter", n);
    $("#visits").html(`Visitor : ${n}`);
  $("#imgurl").focus();
  const galleryRef = firebase.database().ref('/gallery');
  $("form").submit(function(event){
    event.preventDefault();
    console.log("Form was submitted");
    let url=$("#imgurl").val();
    let caption=$("#caption").val();
    new Date($.now());
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    $("#imgurl").val("");
    $("#caption").val("");
    $("#imgurl").focus();
    galleryRef.push({ imageURL: url, caption: caption });
  });
  galleryRef.on('child_added', function(data) {
    const imageId = data.key;
    const imageObj = data.val();
    console.log(imageObj);
    let url = imageObj.imageURL;
    let caption = imageObj.caption;
    new Date($.now());
    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    $(".gallery").prepend(`<div id=${imageId}>
      <img src=${url}>
      <div>${caption} - ${time}</div>
      <button>Delete</button>
      </div>`);
      $('button').click(function() {
        $(this).parent().fadeOut(function(){
          console.log("The fadeout animation has completed");
          // we now want to officially remove it from the database
          let id = $(this).attr('id');
          console.log("id: " + id);
          firebase.database().ref(`gallery/${id}`).remove();
        });//remove()
      });
      $(".full").click(function(event){
        console.log("event was triggered");
        $(".full").html("");
        $(".gallery").toggleClass("dis");
        $(".full").toggleClass("show");
      });
  });
  newsRef.on('child_added', function(data) {
    const nId = data.key;
    const nObj = data.val();
    let n = nObj.value;
    console.log(nObj);
    $(".news").append(`<p id=${nId}>${n}</p>`);
    });
});
