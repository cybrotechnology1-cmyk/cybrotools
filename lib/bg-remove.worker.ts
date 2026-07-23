import { AutoModel, AutoProcessor, RawImage, env } from '@huggingface/transformers';

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
      progress_callback({ status: 'init', name: 'cybrotools-engine' });
      
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
      console.error(`Failed to load model:`, err);
      lastError = err;
      this.model = null;
      this.processor = null;
      throw new Error(`Failed to load AI engine. Please try again.`);
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
      sanitizedInfo.name = 'cybrotools-ai-engine';
    }
    if (sanitizedInfo.file && typeof sanitizedInfo.file === 'string') {
      const ext = sanitizedInfo.file.split('.').pop() || 'bin';
      sanitizedInfo.file = `cybrotools-engine.${ext}`;
    }
    if (typeof sanitizedInfo.progress === 'number' && sanitizedInfo.progress > 0) {
      const realProgress = sanitizedInfo.progress > 1 ? sanitizedInfo.progress : sanitizedInfo.progress * 100;
      const fakeSize = 250;
      const fakeLoaded = Math.round((realProgress / 100) * fakeSize);
      sanitizedInfo.file = `cybrotools-engine.bin (${fakeLoaded}MB / ${fakeSize}MB)`;
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

      const image = await RawImage.fromURL(imageURL);
      const { pixel_values } = await processor(image);
      const { output } = await model({ input: pixel_values });
      const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(image.width, image.height);

      const resultData = new Uint8ClampedArray(image.width * image.height * 4);
      const rgbaImage = image.rgba();
      
      for (let i = 0; i < mask.data.length; i++) {
        resultData[i * 4] = rgbaImage.data[i * 4];
        resultData[i * 4 + 1] = rgbaImage.data[i * 4 + 1];
        resultData[i * 4 + 2] = rgbaImage.data[i * 4 + 2];
        resultData[i * 4 + 3] = mask.data[i];
      }

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
