import { AutoModel, AutoProcessor, RawImage, env } from '@huggingface/transformers';

// We do not need the cache on the browser if it's strictly local or we can let the browser cache it
// env.allowLocalModels = false;

// cybro2.50 (Classic cybro AI) as the default background remover
const DEFAULT_MODEL = 'briaai/RMBG-1.4';

class BackgroundRemoverPipeline {
  static model: any = null;
  static processor: any = null;
  static isInitializing = false;
  static currentModelId = '';

  static async getInstance(modelId: string, progress_callback: (info: any) => void) {
    if (this.model && this.currentModelId === modelId) {
      return { model: this.model, processor: this.processor, modelId: this.currentModelId };
    }

    this.isInitializing = true;
    let lastError = null;

    try {
      progress_callback({ status: 'init', name: modelId });
      
      const options: any = { progress_callback };
      if (modelId.includes('RMBG-1.4')) {
        options.config = { model_type: 'custom' };
      }
      if (modelId.includes('BiRefNet')) {
        options.quantized = false;
      }
      
      this.model = await AutoModel.from_pretrained(modelId, options);
      
      const processorOptions: any = { progress_callback };
      if (modelId.includes('RMBG-1.4')) {
        processorOptions.config = {
          do_normalize: true,
          do_pad: false,
          do_rescale: true,
          do_resize: true,
          image_mean: [0.5, 0.5, 0.5],
          feature_extractor_type: "ImageFeatureExtractor",
          image_std: [1, 1, 1],
          resample: 2,
          rescale_factor: 0.00392156862745098,
          size: { width: 1024, height: 1024 }
        };
      }
      
      this.processor = await AutoProcessor.from_pretrained(modelId, processorOptions);
      this.currentModelId = modelId;
    } catch (err) {
      console.error(`Failed to load ${modelId}:`, err);
      lastError = err;
      this.model = null;
      this.processor = null;
      throw new Error(`Failed to load background removal model ${modelId}. Error: ${lastError}`);
    }

    this.isInitializing = false;
    return { model: this.model, processor: this.processor, modelId: this.currentModelId };
  }
}

self.addEventListener('message', async (e: MessageEvent) => {
  const { action, id, imageURL, modelId } = e.data;

  const sanitizeProgress = (info: any) => {
    const sanitizedInfo = { ...info };
    if (sanitizedInfo.name && typeof sanitizedInfo.name === 'string') {
      sanitizedInfo.name = sanitizedInfo.name
        .replace(/briaai\/RMBG-1.4/gi, "cybro2.50 (Classic cybro AI)")
        .replace(/RMBG-1.4/gi, "cybro2.50 (Classic cybro AI)");
    }
    if (sanitizedInfo.file && typeof sanitizedInfo.file === 'string') {
      sanitizedInfo.file = sanitizedInfo.file
        .replace(/briaai\/RMBG-1.4/gi, "cybro2.50 (Classic cybro AI)")
        .replace(/RMBG-1.4/gi, "cybro2.50 (Classic cybro AI)");
    }
    return sanitizedInfo;
  };

  if (action === 'load') {
    try {
      await BackgroundRemoverPipeline.getInstance(modelId || DEFAULT_MODEL, (info) => {
        self.postMessage({ type: 'progress', data: sanitizeProgress(info) });
      });
      self.postMessage({ type: 'ready' });
    } catch (err: any) {
      self.postMessage({ type: 'error', error: err.message });
    }
  } else if (action === 'remove_bg') {
    try {
      self.postMessage({ type: 'processing', id });
      
      const { model, processor } = await BackgroundRemoverPipeline.getInstance(modelId || DEFAULT_MODEL, (info) => {
        self.postMessage({ type: 'progress', data: sanitizeProgress(info) });
      });

      // Load image
      const image = await RawImage.fromURL(imageURL);
      
      // Process inputs
      const { pixel_values } = await processor(image);

      // Predict
      const { output } = await model({ input: pixel_values });

      // The output is a mask. We need to resize it back to original image size and apply it.
      const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(image.width, image.height);

      // Draw original image
      const resultData = new Uint8ClampedArray(image.width * image.height * 4);
      
      // The original image might be RGB (3 channels) or RGBA (4 channels)
      // Transformers.js RawImage `image.data` contains channels depending on image format.
      // Usually after RawImage.fromURL, it converts to RGBA if we specify it or RGB. 
      // Let's ensure we get RGBA from RawImage
      const rgbaImage = image.rgba();
      
      for (let i = 0; i < mask.data.length; i++) {
        resultData[i * 4] = rgbaImage.data[i * 4];       // R
        resultData[i * 4 + 1] = rgbaImage.data[i * 4 + 1]; // G
        resultData[i * 4 + 2] = rgbaImage.data[i * 4 + 2]; // B
        resultData[i * 4 + 3] = mask.data[i];            // A (Use mask as alpha)
      }

      // Convert result to blob using a new RawImage or return raw data to main thread
      // We can send the raw image data back to the main thread where it's easier to create a blob using a canvas
      (self as any).postMessage({ 
        type: 'complete', 
        id, 
        resultData: {
          data: resultData,
          width: image.width,
          height: image.height
        }
      }, [resultData.buffer]);
    } catch (err: any) {
      self.postMessage({ type: 'error', id, error: err.message });
    }
  }
});
