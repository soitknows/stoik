const classifier = knnClassifier.create();
const webcamElement = document.getElementById('webcam');
const webcamConfig = { facingMode : 'environment'};

let net;

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Successfully loaded model');

  // Create an object from Tensorflow.js data API which could capture image 
  // from the web camera as Tensor.
  const webcam = await tf.data.webcam(webcamElement, webcamConfig);

  // Reads an image from the webcam and associates it with a specific class
  // index.
  const addExample = async classId => {
    // Capture an image from the web camera.
    const img = await webcam.capture();

    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = net.infer(img, 'conv_preds');

    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId);

    // Dispose the tensor to release the memory.
    img.dispose();
  };

  // When clicking a button, add an example for that class.
  document.getElementById('class-a').addEventListener('click', () => addExample(0));
  document.getElementById('class-b').addEventListener('click', () => addExample(1));
  document.getElementById('class-c').addEventListener('click', () => addExample(2));

  while (true) {
    if (classifier.getNumClasses() > 0) {
      const img = await webcam.capture();

      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(img, 'conv_preds');
      // Get the most likely class and confidences from the classifier module.
      const result = await classifier.predictClass(activation);

      const classes = ['Mouse', 'Laptop', 'Keyboard'];
      document.getElementById('console').innerText = `
        ${classes[result.label]}
        Probability: ${((result.confidences[result.label]) * 100).toFixed(2) + "%"}
      `;

      // Dispose the tensor to release the memory.
      img.dispose();
    }

    await tf.nextFrame();
  }
}

app();