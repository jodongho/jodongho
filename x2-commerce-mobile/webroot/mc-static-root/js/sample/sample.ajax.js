$.namespace("commerce.mobile.sample.Ajax");
commerce.mobile.sample.Ajax = {
    bindEvent : function() {
        $('button').each(function(index) {
            $(this)[0].onclick = commerce.mobile.sample.Ajax.request.bind($(this)[0]);
        });
    },

    request : function() {
        var ajaxFunction = common.Ajax[this.value].bind(common.Ajax);
        ajaxFunction("GET", '/m/sample/' + this.id, '', commerce.mobile.sample.Ajax["response_" + this.value].bind(commerce.mobile.sample.Ajax));
    },

    response_sendRequest : function(res) {
        this.appendLog(res);
    },

    response_sendJSONRequest : function(res) {
        if(res.message == "cache"){
            this.appendXchart(res.data);
            this.appendTotalLocalHeapChart(res.data);
        }else{
            this.appendLog($.parseJSON(res));
        }
    },
    
    appendLog : function(message){
        var html = $("#console").html();
        $("#console").html("<p>" +message + "</p>" + html);
    },
    
    appendXchart : function(res){
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawVisualization);
    
        function drawVisualization() { 
            var dataArray = [['cache', 'hit', 'miss', 'heap']];
            res.forEach(function (v, i){
                dataArray.push([v.title.replace("Cache",""), Number(v.contents), Number(v.fileName), Number(v.name)]);
            });
            
            var data = new google.visualization.arrayToDataTable(dataArray);
            
            var options = {
                    title : 'OY cache monitor',
                    vAxis: {title: 'cache monitor'},
                    hAxis: {title: ''}, 
                    seriesType: 'bars',
                    series: {5: {type: 'line'}}
                };
            
            var chart = new google.visualization.ComboChart(document.getElementById('console'));
            chart.draw(data, options);
        }
    },
    
    appendTotalLocalHeapChart : function(res){
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawVisualization);
    
        function drawVisualization() { 
            var dataArray = [['title', 'local heap size(kbyte)' ]];
            var item = res[res.length-1]; // 리스트의 마지막 값이 sum 값이므로 이것만 가져오면 됨
            dataArray.push(['local heap', Number(item.updatedBy)]);
            
            var data = new google.visualization.arrayToDataTable(dataArray);
            
            var options = {
                    title : 'local heap size',
                    vAxis: {title: 'kbyte'},
                    hAxis: {title: ''}, 
                    seriesType: 'bars',
                    series: {5: {type: 'line'}}
                };
            
            var chart = new google.visualization.ComboChart(document.getElementById('console2'));
            chart.draw(data, options);
        }
    }
};