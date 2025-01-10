import * as tf from "@tensorflow/tfjs";

const calculateSimilarity = (product, targetProduct) => {
 
  const features = [product.price || 0, product.rating || 0];
  const targetFeatures = [targetProduct.price || 0, targetProduct.rating || 0];

 
  const tensorA = tf.tensor(features);
  const tensorB = tf.tensor(targetFeatures);

  
  const similarity =
    tf.losses.cosineDistance(tensorA, tensorB, 0).dataSync()[0];

  return 1 - similarity; 
};

export const getRecommendations = (products, targetProduct) => {
  if (!products || !targetProduct) return [];
  return products
    .filter((product) => product.id !== targetProduct.id)
    .map((product) => ({
      ...product,
      similarity: calculateSimilarity(product, targetProduct),
    }))
    .sort((a, b) => b.similarity - a.similarity) 
    .slice(0, 5); 
};
