$(document).ready(function() {
  /* eslint-disable no-extend-native */
  String.prototype.squish = function() {
    return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
  };
  /* eslint-enable */

  function years(data) {
    var results = data.Results;

    results.sort(function(a, b) {
      return a.Make === b.Make;
    });

    var resultsHtml = '' +
      '<div class="row">' +
      '  <td class="col-md-6"><strong>year</strong></td>' +
      '  <td class="col-md-6"><strong>make</strong></td>' +
      '</div>' +
      results.map(function(item) {
        return '' +
          '<div class="row">' +
          '  <tr>' +
          '    <td class="col col-md-6">' + item.ModelYear + '</td>' +
          '    <td class="col col-md-6">' + item.Make + '</td>' +
          '  </tr>' +
          '</div>';
      }).join('');

    // TODO - add pagination
    $('#results').html(resultsHtml);
  }


  function getByYearMake(data) {
    $('#results').empty();

    $('<tr>')
      .html('<td><strong>year</strong></td><td><strong>make</strong></td><td><strong>model</strong></td>')
      .appendTo('#results');

    $.each(data.Results, function(key, val) {
      $('<tr>').html(
        '<td>' + val.ModelYear + '</td>' +
        '<td>' + val.Make + '</td>' +
        '<td>' + val.Model + '</td>'
      ).appendTo($('#results'));
    });
  }


  function getByYearMakeModel(data) {
    $('#results').empty();

    $('<tr>').html('<td><strong>id</strong></td>' +
      '<td>&nbsp;&nbsp;</td>' +
      '<td><strong>year/make/model</strong></td>'
    ).appendTo('#results');

    $.each(data.Results, function(key, val) {
      $('<tr id="' + val.VehicleId + '">').html(
        '<td>' + val.VehicleId + '</td>' +
        '<td>&nbsp;&nbsp;</td>' +
        '<td>' + val.VehicleDescription + '</td>'
      ).appendTo($('#results'));
    });
  }


  function rating(data) {
    $('#results').empty();

    $('<tr>').html('<td><strong>year/make/model</strong></td>' +
      '<td>&nbsp;&nbsp;</td>' +
      '<td><strong>rating</strong></td>'
    ).appendTo('#results');

    $.each(data.Results, function(key, val) {
      $('<tr>').html(
        '<td>' + val.VehicleDescription + '</td>' +
        '<td>&nbsp;&nbsp;</td>' +
        '<td>' + val.OverallRating + '</td>'
      ).appendTo($('#results'));
    });
  }


  $('#search-btn-id').click(function(e) {
    e.preventDefault();

    var year = $(':input[name=year]').val().squish();
    var make = $(':input[name=make]').val().squish();
    var model = $(':input[name=model]').val().squish();

    // Step 1 works if the following fields are filled:
    // - year
    // - year, make
    // - year, make, model
    var valid = true;
    if (year === '') {
      valid = false;
    } else if (make === '' && model !== '') {
      valid = false;
    }

    if (valid) {
      $('#search-btn-id').removeClass('disabled');

      var successFunction = years;
      var apiParam = '/modelyear/' + year;
      if (make !== '') {
        apiParam += '/make/' + make;
        successFunction = getByYearMake;
      }
      if (model !== '') {
        apiParam += '/model/' + model;
        successFunction = getByYearMakeModel;
      }

      $.ajax({
        type: 'GET',
        url: 'http://www.nhtsa.gov/webapi/api/SafetyRatings' + apiParam + '?format=json',
        dataType: 'jsonp',
        success: function(data) {
          successFunction(data);
        }
      });
    } else {
      $('#search-btn-id').addClass('disabled');
    }
  });


  $('#search-btn-rating').click(function(e) {
    e.preventDefault();

    var vehicleId = $(':input[name=vehicle-id]').val().squish();

    if (vehicleId) {
      $('#search-btn-rating').removeClass('disabled');

      // TODO - implement cache
      // TODO - check cache before calling API

      $.ajax({
        type: 'GET',
        url: 'http://www.nhtsa.gov/webapi/api/SafetyRatings/vehicleID/' + vehicleId + '?format=json',
        dataType: 'jsonp',
        success: function(data) {
          rating(data);
        }
      });
    } else {
      $('#search-btn-rating').addClass('disabled');
    }
  });
});
