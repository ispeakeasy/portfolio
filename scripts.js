async function init() {
  const canvas = document.getElementById('webgpu-canvas');
  if (!navigator.gpu) {
    canvas.textContent = 'WebGPU not supported on this browser.';
    return;
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    canvas.textContent = 'No appropriate GPUAdapter found.';
    return;
  }

  const device = await adapter.requestDevice();
  const context = canvas.getContext('webgpu');
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device: device,
    format: presentationFormat,
  });

  function frame() {
    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPassDescriptor = {
      colorAttachments: [{
        view: textureView,
        clearValue: { r: 0.0, g: 0.0, b: 1.0, a: 1.0 }, // Blue background
        loadOp: 'clear',
        storeOp: 'store',
      }],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
    requestAnimationFrame(frame);
  }

  frame();
}

init();
