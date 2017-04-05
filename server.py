import numpy as np
import pandas as pd
import matplotlib.pylab as plt
import random
import operator

from sklearn.cluster import KMeans
from sklearn.manifold import MDS
from sklearn import cluster as Kcluster, metrics as SK_Metrics
from scipy.spatial.distance import cdist
from flask import Flask, render_template, request, jsonify
from sklearn.decomposition import PCA

app = Flask(__name__)
dataset_filename = "dengue.csv"
dataset = pd.read_csv(dataset_filename)
ratio = 0.3

# This method returns MDS based on the type of distance
def generate_MDS(data, distance_type):
    dis_mat = SK_Metrics.pairwise_distances(data, metric = distance_type)
    mds = MDS(n_components=2, dissimilarity='precomputed')
    return mds.fit_transform(dis_mat)

# Method to generate random sample
def generate_random_sample(data, sample_ratio):
    sample = random.sample(data.index, (int)(len(data) * sample_ratio))
    # returning rows of the randomly chosen sample.
    return data.ix[sample]

# Method to generate stratified sample#
def generate_stratified_sample(data, no_clusters, ratio):
    # generating the k-means
    kmeans = KMeans(n_clusters=no_clusters, random_state=0).fit(data)
    # clustered labels for each data point
    labels = kmeans.labels_

    # initializing the list#
    clusters = []
    for index in range(0, no_clusters):
        clusters.append([])
        
    # grouping respective cluster indexes together #
    for index in range(0, len(labels)):
        clusters[labels[index] - 1].append(index)

    sample = []
    # generating random samples from each cluster #
    for i in range(0, no_clusters):
        population = clusters[i]
        length = len(population)
        sample.append(random.sample(population, (int)(length * ratio)))

    del clusters
    # flat map operation #
    sample = reduce(operator.add, sample)
    return data.ix[sample]


# Method to generate eigen values
def generate_eigenValues(data):
    centered_matrix = data - np.mean(data, axis=0)
    cov = np.dot(centered_matrix.T, centered_matrix)
    eig_values, eig_vectors = np.linalg.eig(cov)
    return eig_values, eig_vectors

# To select suitable 'K' for K-Means
def elbow(data):
    mean_distance = []
    clusters = range(1, 10)
    
    for k in clusters:
        model = KMeans(n_clusters=k)
        model.fit(data)
        
        mean_distance.append(sum(np.min(cdist(data, model.cluster_centers_, \
                            'euclidean'), axis=1)) / data.shape[0])
    return clusters, mean_distance

# Method to generate PCA
def generate_PCA(data, components):
    if(components == 2):
        pca = PCA(n_components=components)
        return pca.fit_transform(data)
    else:
        pca = PCA()
        res = pca.fit_transform(data)  
        # First three componenets
        components = pca.components_[:components]
        sum_squared_components = []
   
        for index in range(0, data.shape[1]):
            temp = components[:,index]
            sum_squared_components.append(np.sqrt(np.sum(np.square(temp))))
        return components,sum_squared_components

def makeData(arr1, arr2, X, Y):
    data = []
    for index in range(0, len(arr1)):
        data.append({X:arr1[index], Y:arr2[index]})
    return data

def makeScatterData(arr1, arr2, arr3, X, Y, Z):
    data = []
    for index in range(0, len(arr1)):
        data.append({X:arr1[index], Y:arr2[index], Z:arr3[index]})
    return data


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/getData', methods=['POST', 'GET'])
def getData():
    requestType = request.form['name']
    print("Received request")
    if(requestType == "elbow"):
        first, second = elbow(dataset)
        data = makeData(first, second, 'No of clusters', 'sum of squared errors')
    elif(requestType == "squared_loadings"):
        random_sample = generate_random_sample(dataset, ratio)
        components, squared_loadings = generate_PCA(random_sample, 3)
        clusters = range(1, 14)
        data = makeData(clusters, squared_loadings, 'feature', 'squared_loadings')
    elif(requestType == "scree_random"):
        random_sample = generate_random_sample(dataset, ratio)
        eigen_values, eigen_vectors = generate_eigenValues(random_sample)
        features = range(1, 13)
        data = makeData(features, eigen_values, 'dimensions', 'eigen values')
    elif(requestType == "scree_stratified"):
        stratified_sample = generate_stratified_sample(dataset, 3, ratio)
        eigen_values, eigen_vectors = generate_eigenValues(stratified_sample)
        features = range(1, 13)
        data = makeData(features, eigen_values, 'dimensions', 'eigen values')
    elif(requestType == "pca_scatter"):
        stratified_sample = generate_stratified_sample(dataset, 3, ratio)
        random_sample = generate_random_sample(dataset, ratio)
        res1 = generate_PCA(random_sample, 2)
        res2 = generate_PCA(stratified_sample, 2)
        pca1 = np.append(res1[:,0], res2[:,0])
        pca2 = np.append(res1[:,1], res2[:,1])
        data = makeData(pca1, pca2, 'component_1', 'component_2')
    elif(requestType == "euclidian_scatter"):
        stratified_sample = generate_stratified_sample(dataset, 3, ratio)
        random_sample = generate_random_sample(dataset, ratio)
        
        distance1 = generate_MDS(random_sample,"euclidean")
        distance2 = generate_MDS(stratified_sample,"euclidean")
        first = np.append(distance1[:,0], distance2[:,0])
        second = np.append(distance1[:,1], distance2[:,1])
        data = makeData(first, second, 'component_1', 'component_2')
    elif(requestType == "correlation_scatter"):
        stratified_sample = generate_stratified_sample(dataset, 3, ratio)
        random_sample = generate_random_sample(dataset, ratio)
        
        distance1 = generate_MDS(random_sample,"correlation")
        distance2 = generate_MDS(stratified_sample,"correlation")
        first = np.append(distance1[:,0], distance2[:,0])
        second = np.append(distance1[:,1], distance2[:,1])
        data = makeData(first, second, 'component1', 'component2')
    elif(requestType == "scatter_matrix_random"):
        top_data = pd.read_csv("dengue.csv", usecols=[7,9,10])
        top_data = generate_random_sample(top_data, 0.2)

        first = top_data[top_data.columns[0]].values
        second = top_data[top_data.columns[1]].values
        third = top_data[top_data.columns[2]].values
        data = makeScatterData(first, second, third,"trees90","Xmin","Xmax")
    elif(requestType == "scatter_matrix_stratified"):
        top_data = pd.read_csv("dengue.csv", usecols=[7,9,10])
        top_data = generate_random_sample(top_data, 0.2)
        
        first = top_data[top_data.columns[0]].values
        second = top_data[top_data.columns[1]].values
        third = top_data[top_data.columns[2]].values
        data = makeScatterData(first, second, third,"trees90","Xmin","Xmax")
    else:
        data = makeData(arr1, arr2, 'letter', 'frequency')
        
    print("Get Array Request received!")
    response = jsonify({'first': data})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
    app.run(host = '127.0.0.1', port = 5000, debug = True)