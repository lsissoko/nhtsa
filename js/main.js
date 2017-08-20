$(document).ready(function() {
  /* eslint-disable no-extend-native */
  String.prototype.squish = function() {
    return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
  };
  /* eslint-enable */

  function getByYear(data) {
    // TODO - add pagination
    $('#results').html(
      '<div class="row">' +
      '  <td class="col-md-6"><strong>year</strong></td>' +
      '  <td class="col-md-6"><strong>make</strong></td>' +
      '</div>' +
      Lazy(data.Results) // eslint-disable-line new-cap
      .sortBy(function(item) { return item.Make; })
      .map(function(item) {
        return '' +
          '<div class="row">' +
          '  <tr>' +
          '    <td class="col-md-6">' + item.ModelYear + '</td>' +
          '    <td class="col-md-6">' + item.Make + '</td>' +
          '  </tr>' +
          '</div>';
      }).join('')
    );
  }


  function getByYearMake(data) {
    // TODO - add pagination
    $('#results').html(
      '<div class="row">' +
      '  <td class="col-md-4"><strong>year</strong></td>' +
      '  <td class="col-md-4"><strong>make</strong></td>' +
      '  <td class="col-md-4"><strong>model</strong></td>' +
      '</div>' +
      Lazy(data.Results) // eslint-disable-line new-cap
      .sortBy(function(item) { return item.Make && item.Model; })
      .map(function(item) {
        return '' +
          '<div class="row">' +
          '  <tr>' +
          '    <td class="col-md-4">' + item.ModelYear + '</td>' +
          '    <td class="col-md-4">' + item.Make + '</td>' +
          '    <td class="col-md-4">' + item.Model + '</td>' +
          '  </tr>' +
          '</div>';
      }).join('')
    );
  }


  function getByYearMakeModel(data) {
    // TODO - add pagination
    $('#results').html(
      '<div class="row">' +
      '  <td class="col-md-3"><strong>id</strong></td>' +
      '  <td class="col-md-9"><strong>year/make/model</strong></td>' +
      '</div>' +
      Lazy(data.Results) // eslint-disable-line new-cap
      .sortBy(function(item) { return item.Make; })
      .map(function(item) {
        return '' +
          '<div class="row">' +
          '  <tr id="' + item.VehicleId + '">' +
          '    <td class="col-md-3">' + item.VehicleId + '</td>' +
          '    <td class="col-md-9">' + item.VehicleDescription + '</td>' +
          '  </tr>' +
          '</div>';
      }).join('')
    );
  }


  function rating(data) {
    $('#results').html(
      '<div class="row">' +
      '  <td class="col-md-8"><strong>year/make/model</strong></td>' +
      '  <td class="col-md-4"><strong>rating</strong></td>' +
      '</div>' +
      Lazy(data.Results) // eslint-disable-line new-cap
      .map(function(item) {
        return '' +
          '<div class="row">' +
          '  <tr>' +
          '    <td class="col-md-8">' + item.VehicleDescription + '</td>' +
          '    <td class="col-md-4">' + item.OverallRating + '</td>' +
          '  </tr>' +
          '</div>';
      }).join('')
    );
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

      var successFunction = getByYear;
      var apiParam = '/modelyear/' + year;
      if (make !== '') {
        apiParam += '/make/' + make;
        successFunction = getByYearMake;
      }
      if (model !== '') {
        apiParam += '/model/' + model;
        successFunction = getByYearMakeModel;
      }

      // TODO - implement cache
      // TODO - check cache before calling API
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
