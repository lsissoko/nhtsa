$(document).ready(function() {

    String.prototype.squish = function() {
        return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    };

  function years(data) {
    $("#results").empty();

    $("<tr>")
      .html("<td><strong>year</strong></td><td><strong>make</strong></td>")
      .appendTo("#results");

    $.each(data.Results, function(key, val) {
      $("<tr>").html(
        "<td>" + val.ModelYear + "</td>" +
        "<td>" + val.Make + "</td>"
      ).appendTo($("#results"));
    });
  }


  function year_make(data) {
    $("#results").empty();

    $("<tr>")
      .html("<td><strong>year</strong></td><td><strong>make</strong></td><td><strong>model</strong></td>")
      .appendTo("#results");

    $.each(data.Results, function(key, val) {
      $("<tr>").html(
        "<td>" + val.ModelYear + "</td>" +
        "<td>" + val.Make + "</td>" +
        "<td>" + val.Model + "</td>"
      ).appendTo($("#results"));
    });
  }


  function year_make_model(data) {
    $("#results").empty();

    $("<tr>").html("<td><strong>id</strong></td>" +
      "<td>&nbsp;&nbsp;</td>" +
      "<td><strong>year/make/model</strong></td>"
    ).appendTo("#results");

    $.each(data.Results, function(key, val) {
      $("<tr id='" + val.VehicleId + "'>").html(
        "<td>" + val.VehicleId + "</td>" +
        "<td>&nbsp;&nbsp;</td>" +
        "<td>" + val.VehicleDescription + "</td>"
      ).appendTo($("#results"));
    });
  }


  function rating(data) {
    $("#results").empty();

    $("<tr>").html("<td><strong>year/make/model</strong></td>" +
      "<td>&nbsp;&nbsp;</td>" +
      "<td><strong>rating</strong></td>"
    ).appendTo("#results");

    $.each(data.Results, function(key, val) {
      $("<tr>").html(
        "<td>" + val.VehicleDescription + "</td>" +
        "<td>&nbsp;&nbsp;</td>" +
        "<td>" + val.OverallRating + "</td>"
      ).appendTo($("#results"));
    });
  }


  $("#search_btn_id").click(function(e) {
    e.preventDefault();

    var year = $(":input[name=year]").val().squish();
    var make = $(":input[name=make]").val().squish();
    var model = $(":input[name=model]").val().squish();

    // Step 1 works if the following fields are filled:
    // - year
    // - year, make
    // - year, make, model
    var valid = true;
    if (year === "") {
      valid = false;
    } else {
      if (make === "" && model !== "") {
        valid = false;
      }
    }

    if (valid) {
      $("#search_btn_id").removeClass("disabled");

      var successFunction = years;
      var apiParam = "/modelyear/" + year;
      if (make !== "") {
        apiParam += "/make/" + make;
        successFunction = year_make;
      }
      if (model !== "") {
        apiParam += "/model/" + model;
        successFunction = year_make_model;
      }

      $.ajax({
        type: "GET",
        url: "http://www.nhtsa.gov/webapi/api/SafetyRatings" + apiParam + "?format=json",
        dataType: "jsonp",
        success: function (data) {
          successFunction(data);
        }
      });
    } else {
      $("#search_btn_id").addClass("disabled");
    }
  });


  $("#search_btn_rating").click(function(e) {
    e.preventDefault();

    var vehicle_id = $(":input[name=vehicle_id]").val().squish();

    if (vehicle_id !== "") {
      $("#search_btn_rating").removeClass("disabled");

      $.ajax({
        type: "GET",
        url: "http://www.nhtsa.gov/webapi/api/SafetyRatings/vehicleID/" + vehicle_id + "?format=json",
        dataType: "jsonp",
        success: function (data) {
          rating(data);
        }
      });
    } else {
      $("#search_btn_rating").addClass("disabled");
    }
  });

});
