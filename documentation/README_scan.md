# Usage

Set up a localhost however you want. The original static (non-interactive) prototype can be found at `scan/static_prototype`. For both interactive prototypes, pull up a localhost of `scan/scan.html`. The default version is the one that breaks the playback into sections. For the continuous playback, switch the \<script\> tag to point to `scan_continuous.js` (it points to `scan_segmented.js` by default).

The default keybinds for both interactive prototypes are up/down arrow keys to move up and down through the image, and spacebar to mute or restart playback.

Keybinds and, for the "segemnted" version, number of segments, can be changed by editing global variables in the appropriate .js file. One of my TODO's is to make that configurable from the web page.

# Design

Panning: make the source sounds mono before any other editing, b/c having panning built into the sound is confusing whether there's panning in the sonification or not.

This is meant to go alongside the alt-text description.

## Web interface

### Ease of Learning
This design isn't the most intuitive, especially since users\* may be more used to thinking from left-to-right than down-to-up (source: the *one* BLV user we've had look at this so far). To make it easier to parse, users can do the following:

1. Play the unedited sound associated with each region. Literally just play back the stock audio clip that was used in the sonification. No changes made to it except making it mono.
2. Remove and add back regions from the sonification.
e.g. Say the image contains the regions "sky", "water", "animal", "ground". If the "sky" sound is confusing the whole thing for them, a user could play the sonification without that sound. If they want to hear specifically where "animal" is located in the picture, they could mute all but the "animal" region.

At this time, these features are *only* implemented for the static (non-interactive) version. It wouldn't be hard to do it for the interactive versions, I just haven't gotten around to it...

*\*I have a theory that this would be different for users from places where the primary language(s) are written vertically. But this is total conjecture, and largely irrelevant anyway given the expected user base for IMAGE.*

### Layout - UNTESTED!
To work best for screen readers, the page is organized with the most important information at the top and least important at the bottom. All of this is by my own (Rachel's) best judgement or feedback from sighted lab members: *no user tests have been conducted to determine the actual relevance of each feature*.

The instructions are collapsible by interacting with a button, because I figured users would probably be accessing the page multiple times per day and clicking past the instructions every time would be annoying. The button is at the bottom for the same reason.

The buttons to play the individual sounds was judged most important, because it's the first thing users are likely to go to to better understand the sonification.

The "play all regions" vs "play these selected regions: [...]" toggle is next: it's less useful for basic understanding of the sonification, or at least not the first thing people would go for (again, per my best judgement not per user tests).

In the static (non-interactive) version, the "Play/Pause" button is at the top. In the interactive versions, play/pause is activated through the keyboard, so there is no representation of it on the page.

## Interactive controls

In the original prototype, users could control what was in it as described above, but could only play the sonification from start to finish.

Two different versions of interactivity have since been implemented, both of which allow people to play a section multiple times or go backwards (top to bottom).
1. Continuous playback (`scan/scan_continuous.js`)
2. Sonification broken into sections, which users can move through (`scan/scan_segmented.js`)

Both of these use the keyboard. The assumption was that BLV users are likely most comfortable w/ keyboard controls.

### Continuous playback prototype



# Implementation