function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(data => {
    entries = Object.entries(data);
    console.log(data)

    // Use d3 to select the panel with id of `#sample-metadata`
    panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("")
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    for (i = 0; i < entries.length; i++) {
      panel.append("p")
        .text(`${entries[i][0]}: ${entries[i][1]}`)
        .style("font-weight", "bold")
    }

    // BONUS: Build the Gauge Chart
    gauge = d3.select("#gauge");

    function buildGauge(d) {
      var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: d,
          title: {
            text: "Belly Button Washing Frequency<br><span style='font-size:0.8em'>Scrubs per Week</span>"
          },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: {
              range: [null, 10],
              tickmode: "linear"
            },
            shape: "angular",
            bar: {
              'color': "black",
              'thickness': .5
            },
            steps: [
              { 'range': [0, 1], 'color': '#FF0000' },
              { 'range': [1, 2], 'color': 'F33600' },
              { 'range': [2, 3], 'color': 'E86801' },
              { 'range': [3, 4], 'color': 'DD9402' },
              { 'range': [4, 5], 'color': 'D1BA03' },
              { 'range': [5, 6], 'color': 'B0C603' },
              { 'range': [6, 7], 'color': '7EBB04' },
              { 'range': [7, 8], 'color': '50AF04' },
              { 'range': [8, 9], 'color': '28A404' },
              { 'range': [9, 10], 'color': '059905' }


            ]
          }
        }
      ];

      var layout = { margin: { t: 0, b: 0 } };
      Plotly.newPlot("gauge", data, layout);
    }

    buildGauge(data.WFREQ);

  }
  )
}


function buildCharts(sample) {
  console.log(sample);

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(response => {
    console.log(response);
    bubble = d3.select('#bubble');
    pie = d3.select('#pie');

    bubble.html("");
    pie.html("");


    // @TODO: Build a Bubble Chart using the sample data

    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: {
        color: response.otu_ids,
        size: response.sample_values
      }
    };

    var data = [trace1];

    var layout = {
      xaxis: {
        title: {
          text: 'OTU IDs'
        }
      },
      yaxis: {
        title: {
          text: 'Sample Values'
        }
      }
    };

    Plotly.newPlot('bubble', data, layout);


    var trace2 = {
      labels: response.otu_ids.slice(0, 10),
      values: response.sample_values.slice(0, 10),
      type: 'pie',
      hole: .4
    };

    var data2 = [trace2];

    var layout2 = {
      title: "Top 10 Samples"
    }

    Plotly.newPlot('pie', data2, layout2);
  })



  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];

    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
