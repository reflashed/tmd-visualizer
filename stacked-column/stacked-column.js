var colors = Highcharts.getOptions().colors;
var numColors = colors.length;

$(document).ready(function() {
  loadData('stacked-column.json', function(data) {
    makeChart(data);
  });
});

function formatText(text) {
  var toReturn = text;
  toReturn = toReturn.replace("_", " ");
  toReturn = toTitleCase(toReturn);
  return toReturn;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function loadData(url, c) {
  var dataUrl = url;
  $.getJSON(dataUrl, function(resp) {
    c(resp);
  });
}

function makeChart(data) {
  var series = []; // for highcharts
  var columns = Object.keys(data); // the columns of the TMD
  var numColumns = columns.length;

  $.each(columns, function(i, column) {
    var columnData = data[column];
    var columnBuckets = Object.keys(columnData); // of which each "bucket" is a percentage

    $.each(columnBuckets, function(j, columnBucket) {
      var percentage = columnData[columnBucket];

      var data = Array(numColumns);
      data.fill(0); // everything is "0" except for the item of interest
      data[i] = percentage; // this it the item of interest

      series.push({
        name: columnBucket,
        data: data,
        colors: colors
      });

    });
  });

  var columnsFormatted = [];
  $.each(columns, function(i, column) {
    columnsFormatted.push(formatText(column));
  });

  Highcharts.chart('container', {
    colors: Highcharts.getOptions().colors,
    chart: {
      type: 'column'
    },
    title: {
      text: 'TMD Stacked Column'
    },
    subtitle: {
      text: '(Danko\'s sample output)'
    },
    xAxis: {
      categories: columnsFormatted
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total fruit consumption'
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      useHTML: true,
      formatter: function() {
        var i = columnsFormatted.indexOf(this.x);
        var columnName = columns[i];

        var datum = data[columnName];
        var keys = Object.keys(datum);
        var numKeys = keys.length;


        var name = formatText(this.x);
        var text = `<strong style="display: block; margin-bottom: .4em; font-weight: bold; font-size: 150%;">${name}</strong>`;

        var startingIndex;
        $.each(this.points, function(k, point) {
          if(point.y != 0) {
            startingIndex = k;
            return false;
          }
        });

        $.each(keys, function(j, key) {
          var seriesIndex = startingIndex+j;
          var colorIndex = series[seriesIndex]._colorIndex;
          var color = colors[colorIndex];

          var val = datum[key];
          val *= 100;
          val = Math.round(val * 100) / 100;

          key = formatText(key);

          text += '<p>';
          text += `<span style="display: inline-block; width: 1em; height: 1em; background-color: ${color}; margin-right: 5px;"></span>`;
          text += `<span style="line-height: 20px; font-weight: bold;">${key}</span>: ${val}%`;
          text += '</p>';
        });

        return text;
      },
      //pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
      shared: true
    },
    plotOptions: {
      column: {
        stacking: 'percent'
      }
    },
    series: series
  });
}
