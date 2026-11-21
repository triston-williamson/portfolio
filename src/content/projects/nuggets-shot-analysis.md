---
title: "NBA Shooting Mechanics: Computer Vision & ML"
summary: "Computer vision models that measure a basketball's spin axis and track 27 body key points through a shot, built from NBA training-session video for a professional shooting coach."
tags: ["Python", "OpenCV", "YOLOv8", "Computer Vision", "Pose Estimation", "Flask", "AWS"]
date: 2024-12-01
featured: true
---

**Machine Learning Internship · CDL Basketball Enterprises · Fall 2024**

## Overview
CDL Basketball Enterprises works with NBA players on their shooting. During my internship I built computer vision models that turn the company's training-session video into objective measurements of a shot. Coaches can then give feedback based on data, not just on what they see.

## The problem
- **Feedback has to be fast.** In a training session, feedback is only useful before the player's next attempts, but the video piles up quickly.
- **The details are easy to miss.** Small changes in body position or in the ball's spin are hard to measure by eye, and the measurements are inconsistent when people do it manually.
- **The video is messy.** Noise, missing frames, different camera angles and other people in the frame all break simple tracking methods.

## Objectives
1. **Track the body through the shot:** limb angles, rotation away from a flat plane, and how fast each body part accelerates.
2. **Measure the ball's spin axis** over the first ten frames after release, so coaches can spot and correct unwanted tilt.
3. **Build a feedback application** where a coach uploads a video and gets back the metrics plus a visualization of the shot.

## Spin axis analysis
- Tracked the marker dots on the ball from frame to frame using optical flow, and calculated the normalized spin axis components **eX, eY and eZ**.
- Compared dense optical flow (**Farneback**) with sparse optical flow (**Lucas-Kanade**). Farneback had consistently lower error when checked against the video.
- Applied **Kalman filtering** to smooth the dot trajectories, and used **Roboflow** to train and retrain the dot detector.
- Checked the results by working backwards: I used the calculated axis and angular velocity to simulate where each dot should be in every frame, then compared that to the real footage.
- Plotted the rotation in 3D (MATLAB) so coaches could see the tilt at a glance.

<figure>
  <img src="/images/nba/spin-axis-tracking.png" alt="A basketball outlined in blue, with its tracked rotation path drawn in green" width="927" height="739" loading="lazy" />
  <figcaption>Spin axis tracking: the detected ball (blue) and the rotation path traced across frames (green).</figcaption>
</figure>

## Pose estimation analysis
- Used **YOLOv8** and **OpenPose** with **OpenCV** to track **27 body key points** in 60 fps video.
- Smoothed the key-point paths with **Kalman filtering**, and filled gaps from missed detections with **linear and spline interpolation**.
- Automatically split longer videos into **individual shots**, so each output describes exactly one shooting motion.
- Added **bounding boxes and unique player IDs**, so other people in the frame aren't mistaken for the shooter. The IDs also make per-player dashboards possible later.
- Checked the 2D pose output against **3D pose estimation**, then turned the tracked points into joint angles over time, giving each player a mechanics profile.

<figure class="tall">
  <img src="/images/nba/pose-estimation.png" alt="A player at the top of a jump shot with tracked body key points and limbs drawn as colored lines" width="482" height="747" loading="lazy" />
  <figcaption>OpenPose estimation on a jump shot: tracked body key points and limb segments at the release.</figcaption>
</figure>

## Feedback application
- Built the backend in **Flask** and hosted the application on **AWS**.
- Coaches and players upload a shot video. The backend runs it through the spin axis and pose estimation models and returns the metrics along with a visualization of the shot.

## Challenges
- **Processing time:** at first, 3 minutes of video took 30 minutes for spin axis analysis, and 2 minutes took up to 20 minutes for pose estimation. The work became a balance between accuracy and the speed needed for feedback during a session.
- **Markers being misread:** noise and background pixels were sometimes detected as dots on the ball, which meant repeated retraining in Roboflow.
- **Tuning:** every change to the YOLOv8 and Kalman filter settings shifted both accuracy and runtime, so it took a lot of testing.

## Results
- The spin axis model produced reliable eX, eY and eZ values with clear 3D visualizations that coaches can use to find and fix unwanted tilt.
- Pose estimation followed player movement accurately through the shot and produced joint-angle profiles a coach can act on: limb position, joint flexion and extension.
- Together, the models replace guesswork with measurements. Coaches can spot recurring patterns, tailor training to each player, and work with more players at once.

## Next steps
- Cut processing time so the app can give feedback during a live training session.
- Measure accuracy formally with **MAE** and **RMSE** for spin axis estimation and for key-point and angle tracking.
- Build a larger, multi-angle set of hand-labeled marker data, and run a validation study across more players and shooting styles.
- Extend the analysis to other phases of the shot, such as foot position at takeoff.

**Tools:** Python · OpenCV · YOLOv8 · OpenPose · Roboflow · Optical flow (Farneback, Lucas-Kanade) · Kalman filtering · MATLAB · Flask · AWS
