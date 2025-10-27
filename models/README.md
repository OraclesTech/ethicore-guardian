# Ethicore Guardian - Models Directory

## ⚠️ Models NOT Included

This is the **open-source framework** for Ethicore Guardian. The trained machine learning models are **NOT included** in this repository as they represent proprietary work.

## 📁 What Goes Here

This directory is where you should place your trained models:

```
models/
├── README.md                    (this file - included)
├── model-interface.js          (architecture only - included)
├── .gitkeep                    (keeps directory in git)
├── threat-detector-v1.json     (YOUR trained model - NOT included)
├── threat-detector-v1.bin      (YOUR model weights - NOT included)
└── embeddings-cache.json       (YOUR embeddings - NOT included)
```

## 🚀 How to Use Your Own Models

### Option 1: Train Your Own Model

1. **Collect training data** - Gather examples of:
   - Legitimate user prompts
   - Jailbreak attempts (DAN, DUDE, etc.)
   - Prompt injections
   - Various attack patterns

2. **Use the provided architecture**:
   ```javascript
   // See core/ml-inference.js for the full architecture
   Input: 127 features
   Dense(256) -> ReLU -> Dropout(0.3)
   Dense(128) -> ReLU -> Dropout(0.2)
   Dense(64) -> ReLU
   Dense(1) -> Sigmoid
   ```

3. **Train using TensorFlow/Keras**:
   ```python
   import tensorflow as tf
   
   # Build model matching the architecture
   model = tf.keras.Sequential([
       tf.keras.layers.Dense(256, activation='relu', input_shape=(127,)),
       tf.keras.layers.Dropout(0.3),
       tf.keras.layers.Dense(128, activation='relu'),
       tf.keras.layers.Dropout(0.2),
       tf.keras.layers.Dense(64, activation='relu'),
       tf.keras.layers.Dense(1, activation='sigmoid')
   ])
   
   model.compile(
       optimizer='adam',
       loss='binary_crossentropy',
       metrics=['accuracy', 'precision', 'recall']
   )
   
   # Train on your dataset
   model.fit(X_train, y_train, epochs=50, validation_split=0.2)
   
   # Save for TensorFlow.js
   import tensorflowjs as tfjs
   tfjs.converters.save_keras_model(model, 'models/')
   ```

4. **Place files in this directory**:
   - `model.json` - Model architecture
   - `group1-shard1of1.bin` - Model weights

### Option 2: Use a Pre-trained Model

If you have access to pre-trained models:

1. Download the model files
2. Place them in this directory
3. Update `model-interface.js` to point to your files

### Option 3: Use a Different ML Framework

The interface is flexible! You can use:
- **ONNX Runtime** - Universal format
- **PyTorch** (via ONNX export)
- **Custom implementations**

Just implement the `ModelInterface` class defined in `model-interface.js`.

## 🔐 Security Note

**NEVER commit trained models to public repositories if they contain:**
- Proprietary training data
- Sensitive patterns you don't want to expose
- Competitive advantages

The `.gitignore` is configured to block model files automatically.

## 📊 Model Performance Targets

Based on our testing, here are the target metrics for a well-trained model:

| Metric | Target | Description |
|--------|--------|-------------|
| **Accuracy** | >93% | Overall correct predictions |
| **Precision** | >90% | True positives / (True positives + False positives) |
| **Recall** | >95% | True positives / (True positives + False negatives) |
| **F1 Score** | >92% | Harmonic mean of precision and recall |
| **Inference Time** | <20ms | Time to analyze one prompt |

## 🧪 Testing Your Model

Once you've added your model, test it:

```javascript
// Load your model
const model = new TensorFlowJSModel();
await model.load('models/model.json');

// Test prediction
const testFeatures = new Array(127).fill(0.5); // Example features
const prediction = await model.predict(testFeatures);

console.log(prediction);
// Expected output:
// {
//   threatProbability: 0.85,
//   threatLevel: 'HIGH',
//   confidence: 0.92,
//   modelVersion: '1.0.0'
// }
```

## 📚 Additional Resources

- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/)
- [Model Training Best Practices](https://www.tensorflow.org/guide/keras/train_and_evaluate)

## 💼 Commercial Use

If you're using this for commercial purposes and want pre-trained models optimized for production, contact [support@oraclestechnologies.com](mailto:support@oraclestechnologies.com).

## 🤝 Contributing

Have improvements to the model architecture? Open a PR! We accept:
- Architecture improvements
- Feature engineering enhancements
- Training pipeline optimizations
- Performance improvements

**Do NOT submit:**
- Trained weights
- Private datasets
- Proprietary embeddings

---

**Remember:** This framework is MIT licensed, but you own your trained models. Use them however you wish!