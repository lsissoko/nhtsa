var main = function() {
  
  $("#search_btn_id").click(function(e) {
    e.preventDefault();
    
    var apiUrl = "http://www.nhtsa.gov/webapi/api/SafetyRatings"
    
    var year = $(":input[name=year]").val();
    var make = $(":input[name=make]").val();
    var model = $(":input[name=model]").val();
    
    if (!((year === "") && (make === "" && model != ""))) {
      $("#search_btn_id").removeClass("disabled");
      
      var func = "year";
      var apiParam = "/modelyear/" + year;
      if (make != "") {
        apiParam += "/make/" + make
        func = "year_make";
      }
      if (model != "") {
        apiParam += "/model/" + model
        func = "year_make_model";
      }
      
      $.ajax({
          type: "GET",
          url: apiUrl + apiParam + "?format=json",
          dataType: "jsonp",
          success: process
      });
    } else {
      $("#search_btn_id").addClass("disabled");
    }
    
    function process(data) {
      if (func === "year") {
        years(data);
      } else if (func === "year_make") {
        year_make(data);
      } else if (func === "year_make_model") {
        year_make_model(data);
      }
    }
    
    function years(data) {
      $("#results").html("");
      
      $("<tr>").html("<td><strong>year</strong></td><td><strong>make</strong></td>").appendTo("#results");
      
      var results = data["Results"];
      $.each(results, function(key, val) {
        console.log(val);
        
        $("<tr>").html(
          "<td>" + val["ModelYear"] + "</td>"
          +
          "<td>" + val["Make"] + "</td>"
          //+
          //"<td>" + val["VehicleId"] + "</td>"
          +
          "<td></td>"
          +
          "<td></td>"
        ).appendTo($("#results"));
      });
    }
    
    function year_make(data) {
      $("#results").html("");
      
      $("<tr>").html("<td><strong>year</strong></td><td><strong>make</strong></td><td><strong>model</strong></td>").appendTo("#results");
      
      var results = data["Results"];
      $.each(results, function(key, val) {
        console.log(val);
        
        $("<tr>").html(
          "<td>" + val["ModelYear"] + "</td>"
          +
          "<td>" + val["Make"] + "</td>"
          +
          "<td>" + val["Model"] + "</td>"
          +
          "<td></td>"
          +
          "<td></td>"
        ).appendTo($("#results"));
      });
    }
    
    function year_make_model(data) {
      $("#results").html("");
      
      $("<tr>").html("<td><strong>id</strong></td>" +
                    "<td>&nbsp;&nbsp;</td>" +
                    "<td><strong>year/make/model</strong></td>"
                    ).appendTo("#results");
      
      var results = data["Results"];
      $.each(results, function(key, val) {
        console.log(val);
        
        $("<tr>").html(
          "<td>" + val["VehicleId"] + "</td>"
          +
          "<td>&nbsp;&nbsp;</td>"
          +
          "<td>" + val["VehicleDescription"] + "</td>"
        ).appendTo($("#results"));
      });
    }
  });
  
  $("#search_btn_rating").click(function(e) {
    e.preventDefault();
	
    var $vehicle_id = $(":input[name=vehicle_id]").val();
    
    if (!($vehicle_id === "")) {
      $.ajax({
          type: "GET",
          url: "http://www.nhtsa.gov/webapi/api/SafetyRatings/vehicleID/" + $vehicle_id + "?format=json",
          dataType: "jsonp",
          success: process
      });
    } else {
      $("#search_btn_rating").addClass("disabled");
    }
    
    function process(data) {
      $("#results").html("");
      
      $("<tr>").html("<td><strong>year/make/model</strong></td>" +
                    "<td>&nbsp;&nbsp;</td>" +
                     "<td><strong>rating</strong></td>"
                  ).appendTo("#results");
      
      var results = data["Results"];
      $.each(results, function(key, val) {
        console.log(val);
        
        $("<tr>").html(
          "<td>" + val["VehicleDescription"] + "</td>"
          +
          "<td>&nbsp;&nbsp;</td>"
          +
          "<td>" + val["OverallRating"] + "</td>"
        ).appendTo($("#results"));
      });
    }
  });
  
  $("#search_btn_id").addClass('disabled');
};

$(document).ready(main);
