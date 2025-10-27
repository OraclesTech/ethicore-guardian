/**
 * Ethicore Guardian - Model Interface
 * Defines the interface for loading and using trained ML models
 * Version: 1.0.0 (Open Source Framework)
 * 
 * This file provides a standardized interface for loading your own trained models.
 * The framework supports any model that implements this interface.
 * 
 * ARCHITECTURE ONLY - NO WEIGHTS INCLUDED
 * 
 * @module model-interface
 * @license MIT
 */

/**
 * Model Interface Specification
 * 
 * Any model implementation must provide these methods:
 * 
 * 1. async load(modelPath): Load model from file or URL
 * 2. async predict(features): Run inference on feature vector
 * 3. getMetadata(): Return model metadata
 * 4. isReady(): Check if model is loaded and ready
 */

class ModelInterface {
    constructor() {
        this.modelLoaded = false;
        this.modelMetadata = null;
    }

    /**
     * Load a trained model
     * 
     * Supported formats:
     * - TensorFlow.js (model.json + weights.bin)
     * - ONNX Runtime
     * - Custom format (implement your own loader)
     * 
     * @param {string|Object} modelSource - Path to model or model config
     * @param {Object} options - Loading options
     * @returns {Promise<boolean>} Success status
     */
    async load(modelSource, options = {}) {
        throw new Error('load() must be implemented by subclass');
    }

    /**
     * Run inference on feature vector
     * 
     * @param {Array<number>} features - 127-dimensional feature vector
     * @returns {Promise<Object>} Prediction result
     * 
     * Expected return format:
     * {
     *   threatProbability: number (0-1),
     *   threatLevel: string ('NONE'|'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'),
     *   confidence: number (0-1),
     *   modelVersion: string
     * }
     */
    async predict(features) {
        throw new Error('predict() must be implemented by subclass');
    }

    /**
     * Get model metadata
     * 
     * @returns {Object} Model information
     * 
     * Expected format:
     * {
     *   version: string,
     *   architecture: string,
     *   trainedOn: string,
     *   accuracy: number,
     *   precision: number,
     *   recall: number,
     *   f1Score: number,
     *   inputShape: Array<number>,
     *   outputShape: Array<number>
     * }
     */
    getMetadata() {
        throw new Error('getMetadata() must be implemented by subclass');
    }

    /**
     * Check if model is ready for inference
     * 
     * @returns {boolean} Ready status
     */
    isReady() {
        return this.modelLoaded;
    }

    /**
     * Validate feature vector
     * 
     * @param {Array<number>} features - Feature vector to validate
     * @returns {boolean} Valid status
     */
    validateFeatures(features) {
        if (!Array.isArray(features)) {
            console.error('Features must be an array');
            return false;
        }

        if (features.length !== 127) {
            console.error(`Expected 127 features, got ${features.length}`);
            return false;
        }

        if (!features.every(f => typeof f === 'number' && isFinite(f))) {
            console.error('All features must be finite numbers');
            return false;
        }

        return true;
    }
}

/**
 * TensorFlow.js Model Loader (Example Implementation)
 * 
 * This is a reference implementation for loading TensorFlow.js models.
 * Customize as needed for your deployment.
 */
class TensorFlowJSModel extends ModelInterface {
    constructor() {
        super();
        this.model = null;
        this.tf = null;
    }

    /**
     * Load TensorFlow.js model
     * 
     * @param {string} modelPath - Path to model.json file
     * @returns {Promise<boolean>}
     */
    async load(modelPath) {
        try {
            // Dynamically import TensorFlow.js
            // In production, you would have this as a dependency
            console.log('⚠️  TensorFlow.js not included in open-source version');
            console.log('📝 To use: npm install @tensorflow/tfjs');
            console.log(`📦 Load your model from: ${modelPath}`);
            
            // Example of what you would do with tfjs:
            // this.tf = await import('@tensorflow/tfjs');
            // this.model = await this.tf.loadLayersModel(modelPath);
            
            // For demo purposes:
            this.modelLoaded = false;
            this.modelMetadata = {
                version: '1.0.0',
                architecture: 'Dense(256)->Dense(128)->Dense(64)->Dense(1)',
                trainedOn: 'NOT_LOADED',
                accuracy: 0.0,
                precision: 0.0,
                recall: 0.0,
                f1Score: 0.0,
                inputShape: [127],
                outputShape: [1]
            };

            return this.modelLoaded;

        } catch (error) {
            console.error('Failed to load TensorFlow.js model:', error);
            return false;
        }
    }

    /**
     * Run prediction using TensorFlow.js
     * 
     * @param {Array<number>} features - Feature vector
     * @returns {Promise<Object>} Prediction
     */
    async predict(features) {
        if (!this.isReady()) {
            throw new Error('Model not loaded. Call load() first.');
        }

        if (!this.validateFeatures(features)) {
            throw new Error('Invalid feature vector');
        }

        // Example TensorFlow.js prediction:
        // const inputTensor = this.tf.tensor2d([features], [1, 127]);
        // const outputTensor = this.model.predict(inputTensor);
        // const probability = await outputTensor.data();
        // inputTensor.dispose();
        // outputTensor.dispose();

        // Mock prediction (replace with actual model inference)
        console.warn('⚠️  Using mock prediction - load your trained model!');
        const mockProbability = 0.5;

        return {
            threatProbability: mockProbability,
            threatLevel: this.probabilityToThreatLevel(mockProbability),
            confidence: 0.0,
            modelVersion: this.modelMetadata.version
        };
    }

    /**
     * Convert probability to threat level
     * 
     * @param {number} probability - Threat probability (0-1)
     * @returns {string} Threat level
     */
    probabilityToThreatLevel(probability) {
        if (probability >= 0.9) return 'CRITICAL';
        if (probability >= 0.7) return 'HIGH';
        if (probability >= 0.4) return 'MEDIUM';
        if (probability >= 0.2) return 'LOW';
        return 'NONE';
    }

    getMetadata() {
        return this.modelMetadata;
    }
}

/**
 * Example: Loading your own trained model
 * 
 * ```javascript
 * // 1. Train your model using the feature architecture
 * const model = new TensorFlowJSModel();
 * await model.load('path/to/your/trained-model/model.json');
 * 
 * // 2. Extract features from input
 * const features = mlEngine.extractFeatures(analysisData);
 * 
 * // 3. Run inference
 * const prediction = await model.predict(features);
 * console.log(prediction);
 * // {
 * //   threatProbability: 0.85,
 * //   threatLevel: 'HIGH',
 * //   confidence: 0.92,
 * //   modelVersion: '1.0.0'
 * // }
 * ```
 */

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ModelInterface,
        TensorFlowJSModel
    };
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.ModelInterface = ModelInterface;
    window.TensorFlowJSModel = TensorFlowJSModel;
}

console.log('🔌 Model Interface Loaded (Architecture Only - No Weights)');