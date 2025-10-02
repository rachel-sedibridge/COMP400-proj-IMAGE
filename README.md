# Description
Prototype for the **perspective navigation** idea. Definitely too high-fidelity for this stage, I was in a rush working on things this week (don't we all just love working for non-profits those *always* stay within expected work hours).

This idea divides an image (a very easily-split landscape was used for demonstration purposes) into "layers" of perspective, from closest to farthest. Users can navigate forwards and backwards within these layers to gain a more immersive impression of the photo. Additional navigation is available for moving vertically within a "layer". I experimented with pitch, volume and panning to illustrate the outlines and texture of elements in the photo.

## Usage
Execute the `prototype.py` script, follow spoken instructions.

Controls (repeated in instructions):
- `up` to move "deeper" (farther from yourself) by one layer
- `down` to move "closer" to yourself by one layer
- `shift+up` & `shift+down` to move vertically within the current layer.

## Missing
- The audio clips play on top of each other if you start one before the last one finishes.
- I'm not really happy with the sound effects.
- Program exits before the "exiting" audio clip can play
- I used a free limited AI text-to-voice program, so the voice is wonky at times and not always the same (I exceeded the daily limit on the main voice I'd been using)
