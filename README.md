# Description
Prototypes for my COMP 400 project with IMAGE.

## Depth Layers directory
Prototype for the **perspective navigation** idea. Definitely too high-fidelity for this stage, I was in a rush working on things this week (don't we all just love working for non-profits those *always* stay within expected work hours).

This idea divides an image (a very easily-split landscape was used for demonstration purposes) into "layers" of perspective, from closest to farthest. Users can navigate forwards and backwards within these layers to gain a more immersive impression of the photo. Additional navigation is available for moving vertically within a "layer". I experimented with pitch, volume and panning to illustrate the outlines and texture of elements in the photo.

### Usage
Execute the `prototype.py` script, follow spoken instructions.

Controls (repeated in instructions):
- `up` to move "deeper" (farther from yourself) by one layer
- `down` to move "closer" to yourself by one layer
- `shift+up` & `shift+down` to move vertically within the current layer.

### Missing
- The audio clips play on top of each other if you start one before the last one finishes.
- I'm not really happy with the sound effects.
- Program exits before the "exiting" audio clip can play
- I used a free limited AI text-to-voice program, so the voice is wonky at times and not always the same (I exceeded the daily limit on the main voice I'd been using)


## Region Scanning directory
Prototype for the idea of assigning a different sound to each region (as highlighted by IMAGE) and changing the balance of those sounds according to the balance of those elements while scanning across an image. I'm implementing this vertically, because I think that could be a good way to represent height, but it would probably take minimal change to do it horizontally instead. That could even maybe be a setting people can change!

This is a single example, where the sounds are hard-coded and it only works for one image (the photo of the wildebeest and river that won a nature photography competition a few months ago).

See the full audio render at `scanning/audio_tracks/scanning-full_render-vertical-updated_sounds.mp3`. Based on the photo at `scanning/photos/dramatic_crossing-a_stankiewicz.jpg`.
