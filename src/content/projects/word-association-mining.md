---
title: "Word Association Mining"
summary: "NLP pipeline using entropy and mutual information to measure which terms best separate health-news topics."
tags: ["NLP", "NLTK", "Python", "Information Theory"]
date: 2023-12-01
---

## Data
200 health news articles across three categories: Dentistry, Depression and Diabetes.

## Pipeline
Cleaning, lowercasing, stopword removal and Porter stemming with NLTK, then a document-term matrix built with PyShortText.

## Analysis
Shannon entropy and mutual information for each term against the class label, as a quantitative basis for feature selection.
