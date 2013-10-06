ChromeOsSubtitle
================

A small video player supporting subtitles
This is currently a toy app. Please report your suggestions.
It is basically a simple wrapper for http://mediaelementjs.com/

Please, if possible submit bug and feature request at https://github.com/guancio/ChromeOsSubtitle/issues

Change log:
- Version 1.3.0
  - Restyle of the subtitle interface
  - Allows to select the subtitle from a zip file containing several entries
  - Implemented the info window to credit the other projects
- Version 1.2.0
  - Drag and Drop:
    - drop a video file to the player to open it
    - drop a srt file to show it on an already opened video
    - drop a video and a srt (together) open the video and the corresponding subtitle
  - Zipped srt: automatically unzip the subtitle files (both in the open menu and in the drag and drop)
    Supports only zip containing a unique file in the root consisting of the subtitle.
- Version 1.1.0
  - support to select the subtitle encofing, allowing to load Greek and Korean subtitles
  - minor graphical fix on the subtitle menu
- Version 1.0.6
  - added feature to synchronize (advance/delay) captions
- Version 1.0.5
  - restored fullscreen button
  - added file type association, allowing to launch the player from the file browser
- Version 1.0.4
  - integrated file selection with the main media player
  - fixed window resize in non-fullscreen mode
  - disabled fullscreen   
- Version 1.0.3
  - deployed as packaged app
- Version 1.0.2
  - buttons to change subtitle size
- Version 1.0.1
  - first published release

Missing features/bug:
- fix subtitle stored in non-UTF8 files (e.g. greek)
- file type association to open video and subtitle togheter
- restyle caption interface
- better code style/integration with me player
- integration of an android remote control app