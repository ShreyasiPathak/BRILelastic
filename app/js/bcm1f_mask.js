/*eslint strict:0 */
//
// Deal with BCM1F masking
//
bcm1f_mask = {
  me: 'bcm1f_mask',

  put: function(mask) {
  // send the new mask bits to the server
    var url = baseUrl + "/put/bcm1f/mask";
    console.log("PUTting mask to " + url);
    $.ajax({
      url: url,
      type: "put",
      data: JSON.stringify(mask),
      dataType: "text",
      success: this.successPut,
      error:   this.errorPut,
      context: this
    });
  },
  errorPut: function(response, textStatus, jqXHR) { // callback for reporting error putting data
    console.log("errorPut response:", JSON.stringify(response));
    console.log("errorPut jqXHR:", JSON.stringify(jqXHR));
    console.log("errorPut textStatus:", textStatus);
    ajaxFail("#"+this.me+"-message", jqXHR, textStatus);
  },
  successPut: function() { //response ,textStatus,jqXHR) { // callback for reporting success putting data
    console.log("Put BCM1F mask successfully");
    setFadeMessage("#"+this.me+"-message",
                   "Mask successfully uploaded",
                   "bg-success",
                   "#"+this.me+"-channels");
  },

  get: function() {
    var url = baseUrl + "/get/bcm1f/mask";
    console.log("GETting BCM1F mask from " + url);
    $.ajax({
      dataType: "json",
      url: url,
      success: this.successGet,
      error:   this.errorGet,
      context: this
    });
  },
  errorGet: function(response, textStatus, jqXHR) { // callback for reporting error getting data
    console.log("errorGet response:", JSON.stringify(response));
    console.log("errorGet jqXHR:", JSON.stringify(jqXHR));
    console.log("errorGet textStatus:", textStatus);
    ajaxFail("#"+this.me+"-message", jqXHR, textStatus);
  },
  successGet: function(response) { //, textStatus, jqXHR) { // callback for displaying data
    console.log("Got BCM1F mask successfully");

//  show the tag name we just got
    $("#bcm1f-subtitle").text("Tag: "+response.tagName);

//  update the displayed checkboxes to match the returned values
    for ( var i=1; i<=4; i++ ) {
      var detector = "BCM1F_" + i;
      for ( var channel=1; channel<=12; channel++ ) {
        var value = response[detector][channel-1];
        $('#' + detector + '-' + channel).prop("checked",( value ? true : false));
      }
    }
  },

  init: function() {
    var obj = this;

    $("#"+this.me+"-channels").click(function(event) {
      event.preventDefault();
      $("#"+obj.me+"-channels").button().prop('disabled', true);
      var i, id, nSelected,
        checkboxes = $('#'+obj.me+'-management input:checkbox:checked'),
        mask = {
          BCM1F_1:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          BCM1F_2:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          BCM1F_3:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          BCM1F_4:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };

      nSelected = checkboxes.length;
      for ( i=0; i<nSelected; i++ ) {
        id = checkboxes[i].id.split('-');
        mask[id[0]][id[1]-1] = 1;
      }
      console.log(JSON.stringify(mask));
      obj.put(mask);
    });

    return this;
  }
}.init();