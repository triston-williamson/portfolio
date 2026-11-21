---
title: "Handwritten Digit Classifier (CNN)"
summary: "PyTorch convolutional neural network reaching 98.3% test accuracy on MNIST in under 4 minutes of training."
tags: ["PyTorch", "Deep Learning", "TensorBoard"]
date: 2024-03-01
featured: true
---

## Architecture
Two convolutional layers with ReLU and max-pooling, followed by two fully connected layers with 20% dropout.

## Training
- Augmentation: random rotation up to 25°, tensor normalization
- SGD with cross-entropy loss, 10 epochs on GPU
- Loss and accuracy tracked per epoch in TensorBoard

## Result
**98.3% test accuracy** in under 4 minutes of total training time.
