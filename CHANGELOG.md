1. Beautified all non-library JS and CSS files for added ease during testing. Also minified some of the library JS files (md5js, longjs)
2. Added missing modules (zipjs, longjs).
3. zipjs no longer uses workers as chrome doesnt support loading workers directly from filesystem (cross-origin policy issue.)
4. Restructured the app a little. (features folder)
5. Fixed issue that didn't allow mouse click based seeking for 2% around the current time.
6. Fixed offset in time float. Also fixed offset in duration played bar. The bug caused absence of correlation between selected time and actual time seeked.
7. Added multiline subtitle support.
8. Implemented a simple notification system that informs about seeking, playing, pausing etc.
9. Added new and improved(?) keyboard shortcuts. Seeking is now splitted into 3.... ctrl/alt/shift + left/right for 60s, 10s, 3s seeking. Soon to add options to change the default seek values.
10. Attempt to play when no media is loaded now causes file selection prompt. This allows us to load a media by simply pressing spacebar (shortcut for play)
11. Removed some empty features that might get added in the future. Removed backlight feature because it didn't work properly and was very CPU hungry.
12. Some of the settings are now remembered. (encoding, subs language etc.) Others may be later added based on user feedback (volume, last played file and time)
13. Added shortcuts to move captions position on screen.
14. Reworked CSS behind media controls to make it look more modern.
15. Added a very rudimentary playlist function. Can now use shortcuts to navigate through the playlist. Different types of navigation are also available.
16. WebAudio API is now used to provided volume levels beyond 100%. The current limit is at 200%. This can be increased if needed. Performance of WebAudio seems to be good at first glance. More research is needed to determine if the extra CPU cycles are worth the amplification.
17. Choosing multiple files is now possible in chromeOS as well.
18. contextmenu for those who hate keyboard shortcuts.
19. major changes in design.
20. App is now more efficient resulting in improved battery life.

Keyboard shortcuts:
Spacebar - Toggle play.
Ctrl/Alt/Shift + Left/Right - Seek for 60s, 10s, 3s.
Ctrl + Up/Down - Increase/Decrease volume.
Ctrl + f - Toggle Fullscreen.
Ctrl + o - Prompt file open.
Ctrl + -/+ - Decrease/Increase caption size.
Ctrl + x/z - Increase/Decrease caption delay.
Ctrl + ,/./'/' - Increase/Decrease/Reset playback speed.
Ctrl + l - Toggle loop.
Ctrl + d - Download subtitles from opensubtitles.
Ctrl + Shift + Arrow Keys - Move captions.
Ctrl + i - Show info window.
Ctrl + [ - Previous Media
Ctrl + ] - Next Media
Ctrl + q - Change Playlist Navigation
Ctrl + a - Change Aspect Ratio
Shift + Up/Down - Change Brightness

Known issues:
1. Prioritizing downloaded subtitles is a little tricky. Sometimes split CD subtitles (CD1, CD2...) are loaded. The user, however, can always pick different subs from the menu thanks to the already implemented system.
2. Subtitle download sometimes fails for some weird reasons. Retrying almost always works. Bug in XML-RPC.js? Bug in opensubtile? Dont know yet!
3. Buttons are not properly resized sometimes, The fullscreen button moves out of position. Resizing the windows fixes it. (fixed? frequency of bug has reduced. fixed i guess)
4. Opening files from external devices result in a empty file.fileType property. Hence, drag and drop fails in this situation.


Improvements to be made:
1. Redesign the controls bar. A more modern and minimalistic approach may be applauded by the community.
2. Implement a more sophisticated notification system.
3. Remove jQuery dependency.
4. Improve playlist feature.
5. Reduce event callbacks. For example, timeupdate callback is done every 250ms. This has a bad impact on battery life.