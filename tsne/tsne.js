$(document).ready(function() {
  loadData('tsne.json', function(data) {
    makeChart(data);
  });
});

function loadData(url, c) {
  var dataUrl = url;
  $.getJSON(dataUrl, function(resp) {
    c(resp);
  });
}

function makeChart(resp) {
  var data = resp['data'];
  var tsne = resp['tsne'];

  Highcharts.chart('container', {
    chart: {
      type: 'scatter',
      zoomType: 'xy'
    },
    title: {
      text: 'TMD t-SNE'
    },
    subtitle: {
      text: '(entire database)'
    },
    xAxis: {
      title: {
        enabled: true,
        text: 'Y (arbitrary units)'
      },
      startOnTick: true,
      endOnTick: true,
      showLastLabel: true
    },
    yAxis: {
      title: {
        text: 'X (arbitrary units)'
      }
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'top',
      x: 100,
      y: 70,
      floating: true,
      backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
      borderWidth: 1
    },
    plotOptions: {
      scatter: {
        marker: {
          radius: 5,
          states: {
            hover: {
              enabled: true,
              lineColor: 'rgb(100,100,100)'
            }
          }
        },
        states: {
          hover: {
            marker: {
              enabled: false
            }
          }
        },
        tooltip: {
          pointFormatter: function() {
            var index = this.index;
            var datum = data[index];

            var species = datum['species'];
            var antimicrobialSusceptibility = datum['antimicrobial_susceptibility'];
            var plantPathogen = datum['plant_pathogen'];
            var optimalPh = datum['optimal_ph'];
            var optimalTemperature = datum['optimal_temperature'];
            var extremeEnvironment = datum['extreme_environment'];
            var biofilmForming = datum['biofilm_forming'];
            var gramStain = datum['gram_stain'];
            var microbiomeLocation = datum['microbiome_location'];
            var sporeForming = datum['spore_forming'];
            var animalPathogen = datum['animal_pathogen'];
            var pathogenicity = datum['pathogenicity'];

            var text = '';
            text += `<strong>${species}</strong>`;
            text += '<br />';
            text += `Antimicrobial Susceptibility: ${antimicrobialSusceptibility}`;
            text += '<br />';
            text += `Plant Pathogen: ${plantPathogen}`;
            text += '<br />';
            text += `Optimal pH: ${optimalPh}`;
            text += '<br />';
            text += `Optimal Temperature: ${optimalTemperature}`;
            text += '<br />';
            text += `Extreme Environment: ${extremeEnvironment}`;
            text += '<br />';
            text += `Biofilm-forming: ${biofilmForming}`;
            text += '<br />';
            text += `Gram Stain: ${gramStain}`;
            text += '<br />';
            text += `Microbiome Location: ${microbiomeLocation}`;
            text += '<br />';
            text += `Spore-forming: ${sporeForming}`;
            text += '<br />';
            text += `Animal Pathogen: ${animalPathogen}`;
            text += '<br />';
            text += `Pathogenicity: ${pathogenicity}`;
            text += '<br />';

            return text;
          }
        }
      }
    },
    series: [{
      name: 'Microbes',
      color: 'rgba(223, 83, 83, .5)',
      data: tsne 
    }]
  });
}
