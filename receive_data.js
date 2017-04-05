var euclidian_data = null;
var pca_data = null;
var correlation_data = null;
var scree_random = null;
var scree_stratified = null;
var elbow_data = null;
var bar_data = null;
var scatter_matrix_random_data = null;
var scatter_matrix_stratified_data = null;



function getData(input, ID){
    if(input == "euclidian_scatter" && euclidian_data != null) {
        d3.select(ID).select("svg").remove();  
        scatterPlot(euclidian_data);
    } else if(input == "pca_scatter" && pca_data != null) {
        d3.select(ID).select("svg").remove();  
        scatterPlot(pca_data);
    } else if(input == "correlation_scatter" && correlation_data != null){
        d3.select(ID).select("svg").remove();  
        scatterPlot(correlation_data);
    } else if(input == "elbow" && elbow_data != null){
        d3.select(ID).select("svg").remove();  
        linePlot(elbow_data, ID);
    } else if(input == "scree_random" && scree_random != null){
        d3.select(ID).select("svg").remove();  
        linePlot(scree_random, ID);
    } else if(input == "scree_stratified" && scree_stratified != null){
        d3.select(ID).select("svg").remove();  
        linePlot(scree_stratified, ID);
    } else if(input == "squared_loadings" && bar_data != null){
        d3.select(ID).select("svg").remove();  
        BarChart(bar_data, ID);
    } else if(input == "scatter_matrix_random" && scatter_matrix_random_data != null){
        d3.select(ID).select("svg").remove();
        scatter_matrix(scatter_matrix_random_data, ID);
    } else if(input == "scatter_matrix_stratified" && scatter_matrix_stratified_data != null){
        d3.select(ID).select("svg").remove();
        scatter_matrix(scatter_matrix_stratified_data, ID);
    } else {
        $.ajax({
            data : {
	   	       name : input
            },
            type : 'POST',
            url : 'http://127.0.0.1:5000/getData'
        })
        .done(function(data_from_server) {       
            console.log("Received resposne")
            if(input == "squared_loadings"){
                BarChart(data_from_server.first, ID);
            } else if(input == "pca_scatter" || input == "euclidian_scatter" || input == "correlation_scatter") {
                if(input == "euclidian_scatter") {
                    euclidian_data = data_from_server.first;
                } else if(input == "pca_scatter") {
                    pca_data = data_from_server.first;
                } else if(input == "correlation_scatter") {
                    console.log(data_from_server.first);
                    correlation_data = data_from_server.first;
                }   
                d3.select(ID).select("svg").remove(); 
                scatterPlot(data_from_server.first);
            } else if(input == "scatter_matrix_random"){
                alert(input)
                d3.select(ID).select("svg").remove(); 
                scatter_matrix_random_data = data_from_server.first;
                scatter_matrix(scatter_matrix_random_data, ID);
            } else if(input == "scatter_matrix_stratified"){
                d3.select(ID).select("svg").remove(); 
                scatter_matrix_stratified_data = data_from_server.first;
                scatter_matrix(scatter_matrix_stratified_data, ID);
            } else {
                d3.select(ID).select("svg").remove(); 
                linePlot(data_from_server.first, ID);
            }
        });
    }
}