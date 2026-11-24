---
title: "Handwritten Digit Classifier (CNN)"
summary: "PyTorch convolutional neural network that reaches 98.3% test accuracy on MNIST, trained with augmentation on a Tesla T4 GPU in about 4 minutes."
tags: ["PyTorch", "Deep Learning", "Computer Vision", "TensorBoard"]
date: 2024-03-01
featured: true
---

**Applied Machine Learning (DSBA 6165) · UNC Charlotte**

## Overview
I built and trained a convolutional neural network (CNN) in PyTorch to classify handwritten digits (0–9) from the MNIST dataset: 60,000 training images and 10,000 test images, each 28×28 pixels in grayscale. The goal was to go from raw images to a trained, evaluated model, and to understand each step of the training loop rather than calling a high-level `fit()` function.

<figure>
  <img src="/images/cnn/sample-digits.png" alt="A 3 by 3 grid of handwritten digits from the training set, each labeled with its true value" width="1207" height="890" loading="lazy" />
  <figcaption>A batch of training images with their true labels. Some are visibly rotated by the augmentation step.</figcaption>
</figure>

## Data pipeline
- Loaded MNIST with `torchvision` in batches of 64, shuffling the training set every epoch.
- **Augmentation:** each training image is randomly rotated by up to ±25°, so the model learns digits written at different slants instead of memorizing upright ones. The test set isn't augmented, so it measures performance on real, unaltered digits.
- **Normalization:** scaled pixels to the dataset's mean (0.1307) and standard deviation (0.3081), which helps gradient descent converge faster.

## Architecture
| Layer | Details | Output shape |
|---|---|---|
| Input | 1 grayscale channel | 1 × 28 × 28 |
| Conv 1 + ReLU | 12 filters, 3×3, padding 1 | 12 × 28 × 28 |
| Max-pool | 2×2 | 12 × 14 × 14 |
| Conv 2 + ReLU | 24 filters, 3×3, padding 1 | 24 × 14 × 14 |
| Max-pool | 2×2 | 24 × 7 × 7 |
| Flatten | | 1,176 |
| Fully connected + ReLU | 64 units, **20% dropout** | 64 |
| Output | One score per digit | 10 |

The convolutional layers learn local features like strokes and curves, max-pooling shrinks the image while keeping the strongest signals, and dropout randomly switches off 20% of units during training to reduce overfitting.

## Training
- **Optimizer:** stochastic gradient descent (SGD) with a learning rate of 0.01.
- **Loss:** cross-entropy.
- **Hardware:** NVIDIA Tesla T4 GPU on Google Colab.
- **Schedule:** 10 epochs, evaluating on the test set after each one.
- Logged training and test loss to **TensorBoard** every epoch.

## Results
| Epoch | Training loss | Test loss | Test accuracy |
|---|---|---|---|
| 1 | 0.794 | 0.239 | 92.8% |
| 2 | 0.296 | 0.127 | 96.3% |
| 3 | 0.215 | 0.094 | 97.1% |
| 5 | 0.156 | 0.065 | 97.8% |
| 7 | 0.129 | 0.059 | 98.1% |
| 9 | 0.113 | 0.048 | **98.5%** |
| 10 | 0.106 | 0.053 | **98.3%** |

- **Final test accuracy: 98.3%** (peak of 98.5% at epoch 9).
- **Total training time: about 4 minutes** (244 seconds, roughly 24 seconds per epoch).
- Test loss stays below training loss the whole time. That's expected here: training images are rotated and pass through dropout, while test images are clean and evaluated with dropout off. It also shows the model isn't overfitting.

<figure>
  <img src="/images/cnn/loss-curves.png" alt="Line chart of training loss and test loss over 10 epochs, both falling steeply at first and then leveling off" width="1095" height="826" loading="lazy" />
  <figcaption>Training and test loss by epoch (0 = first epoch). Both fall quickly and level off without the test loss rising, so there's no sign of overfitting.</figcaption>
</figure>

<figure>
  <img src="/images/cnn/prediction-example.png" alt="A handwritten 2 next to a bar chart of class probabilities, with nearly all probability on the digit 2" width="1179" height="655" loading="lazy" />
  <figcaption>A test image of a handwritten 2. The softmax output puts nearly 100% of the probability on the correct class.</figcaption>
</figure>

## What I'd do next
- Add batch normalization and a learning-rate schedule to push accuracy above 99%.
- Report a confusion matrix to see which digits get mixed up (for example 4 and 9).
- Apply the same pipeline to a harder dataset such as Fashion-MNIST or CIFAR-10.

**Tools:** Python · PyTorch · torchvision · TensorBoard · Matplotlib · NumPy · Google Colab (Tesla T4 GPU)
