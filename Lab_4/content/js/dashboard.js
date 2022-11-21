/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 92.85714285714286, "KoPercent": 7.142857142857143};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8416666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, ""], "isController": true}, {"data": [0.925, 500, 1500, "-1"], "isController": false}, {"data": [0.9, 500, 1500, "-2"], "isController": false}, {"data": [0.0, 500, 1500, "-3"], "isController": false}, {"data": [0.875, 500, 1500, "-4"], "isController": false}, {"data": [1.0, 500, 1500, "-5"], "isController": false}, {"data": [0.975, 500, 1500, "-6"], "isController": false}, {"data": [1.0, 500, 1500, "-7"], "isController": false}, {"data": [1.0, 500, 1500, "-8"], "isController": false}, {"data": [1.0, 500, 1500, "-9"], "isController": false}, {"data": [1.0, 500, 1500, "-10"], "isController": false}, {"data": [0.95, 500, 1500, "-11"], "isController": false}, {"data": [1.0, 500, 1500, "-12"], "isController": false}, {"data": [1.0, 500, 1500, "-13"], "isController": false}, {"data": [1.0, 500, 1500, "-14"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 280, 20, 7.142857142857143, 142.8357142857142, 21, 1889, 67.0, 241.0, 494.94999999999953, 1798.1699999999998, 0.6294511186245594, 0.16050432733593806, 0.30726136496475076], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["", 20, 20, 100.0, 1999.6999999999998, 874, 4283, 1225.0, 4224.1, 4280.2, 4283.0, 0.044954225360027154, 0.16048087745590553, 0.3072164737006543], "isController": true}, {"data": ["-1", 20, 0, 0.0, 305.0, 74, 1256, 237.0, 968.5000000000009, 1243.6, 1256.0, 0.04526433238504557, 0.012376965886535899, 0.02192491099900645], "isController": false}, {"data": ["-2", 20, 0, 0.0, 318.15000000000003, 54, 1889, 161.5, 1032.3000000000006, 1847.9499999999994, 1889.0, 0.04509298172832381, 0.01233011219133854, 0.02184191302465684], "isController": false}, {"data": ["-3", 20, 20, 100.0, 192.8, 21, 790, 180.0, 440.8000000000003, 773.2999999999997, 790.0, 0.045072250818061356, 0.010079634216148485, 0.021699823880179926], "isController": false}, {"data": ["-4", 20, 0, 0.0, 362.3, 51, 1833, 130.5, 1750.7000000000007, 1830.85, 1833.0, 0.045080683152672496, 0.012333352915255077, 0.021703883588151895], "isController": false}, {"data": ["-5", 20, 0, 0.0, 54.5, 26, 244, 31.0, 115.7, 237.5999999999999, 244.0, 0.04507651738826658, 0.012809830624985913, 0.02170187800040569], "isController": false}, {"data": ["-6", 20, 0, 0.0, 151.9, 30, 1119, 108.0, 227.10000000000005, 1074.4999999999993, 1119.0, 0.04506798505545616, 0.012138428006147273, 0.022137887190326607], "isController": false}, {"data": ["-7", 20, 0, 0.0, 49.05, 25, 262, 30.0, 107.00000000000003, 254.2999999999999, 262.0, 0.045078244563000226, 0.012687060627985025, 0.022142926772645618], "isController": false}, {"data": ["-8", 20, 0, 0.0, 33.55, 25, 93, 30.0, 42.20000000000002, 90.49999999999997, 93.0, 0.04507834616563587, 0.012687089223570565, 0.022142976680971527], "isController": false}, {"data": ["-9", 20, 0, 0.0, 37.150000000000006, 27, 111, 30.0, 74.50000000000006, 109.29999999999998, 111.0, 0.045078244563000226, 0.012687060627985025, 0.022142926772645618], "isController": false}, {"data": ["-10", 20, 0, 0.0, 70.95000000000002, 65, 94, 67.0, 89.30000000000001, 93.8, 94.0, 0.04507509510845068, 0.010168307587941511, 0.022141379726123723], "isController": false}, {"data": ["-11", 20, 0, 0.0, 137.55, 65, 773, 66.5, 699.4000000000015, 772.8, 773.0, 0.045075196696889586, 0.010168330504864742, 0.022141429627476037], "isController": false}, {"data": ["-12", 20, 0, 0.0, 83.95, 65, 236, 67.0, 208.7000000000003, 235.35, 236.0, 0.045075501464953795, 0.010168399256254226, 0.022141579332882577], "isController": false}, {"data": ["-13", 20, 0, 0.0, 109.80000000000001, 100, 213, 103.0, 122.50000000000001, 208.49999999999994, 213.0, 0.04507123508705509, 0.010167436821396217, 0.022139483641395223], "isController": false}, {"data": ["-14", 20, 0, 0.0, 93.05, 64, 340, 67.5, 277.30000000000047, 337.95, 340.0, 0.04507560305522437, 0.010168422173590654, 0.02214162923513463], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 20, 100.0, 7.142857142857143], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 280, 20, "400/Bad Request", 20, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-3", 20, 20, "400/Bad Request", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
