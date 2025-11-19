# Description
Sound design prototypes for [IMAGE](https://image.a11y.mcgill.ca/).



# Designs

## Echo


## Scan
Prototype for the idea of assigning a different sound to each region (as highlighted by IMAGE) and changing the balance of those sounds according to the balance of those elements while scanning across an image. I'm implementing this vertically, because I think that could be a good way to represent height, but it would probably take minimal change to do it horizontally instead. That could even maybe be a setting people can change!

This is a single example, where the sounds are hard-coded and it only works for one image (the photo of the wildebeest and river that won a nature photography competition a few months ago).

See the full audio render at `scanning/audio_tracks/scanning-full_render-vertical-updated_sounds.mp3`. Based on the photo at `scanning/photos/dramatic_crossing-a_stankiewicz.jpg`.


## OLD - depth layers
This was the first prototype I made at the very beginning of this project. It was too good a prototype for that point in the project: I'd done no testing and not enough brainstorming. **I do not recommend this for integration with IMAGE**. I'm just leaving it in for the sake of completeness. Who knows, maybe it'll be useful at some point.

This idea divides an image (a very easily-split landscape was used for demonstration purposes) into "layers" of perspective, from closest to farthest. Users can navigate forwards and backwards within these layers to gain a more immersive impression of the photo. Additional navigation is available for moving vertically within a "layer".

The idea was to apply the depth mapping, since I'd been told that was very useful especially for early-blind individuals.

### Features used:
- Pitch to outline the shape of a region (*this one has been lovingly nicknamed the "slide whistle" prototype...*)
- Volume to depict texture (e.g. rapidly changing volume for fluffy clouds)
- 2D panning: show horizontal extent of a region within a "layer"

### Usage
Execute the `prototype.py` script, follow spoken instructions.

Controls (repeated in instructions):
- `up` to move "deeper" (farther from yourself) by one layer
- `down` to move "closer" to yourself by one layer
- `shift+up` & `shift+down` to move vertically within the current layer.

### Missing
- The audio clips play on top of each other if you start one before the last one finishes.
- I was never happy with the sound effects.
- Program exits before the "exiting" audio clip can play
- I used a free limited AI text-to-voice program, so the voice is wonky at times and not always the same (I exceeded the daily limit on the main voice I'd been using lol)



# Terminology
- "Region": something identified by the semantic segmentation, using [this schema](https://github.com/Shared-Reality-Lab/IMAGE-server/blob/2945b52da77bf74b1307e7e2286c6297ebef6157/preprocessors/segmentation.schema.json)
- "Object" (in context of IMAGE output): something identified by object detection, using [this schema](https://github.com/Shared-Reality-Lab/IMAGE-server/blob/2945b52da77bf74b1307e7e2286c6297ebef6157/preprocessors/object-detection.schema.json)
- "2D panning": exclusively left-right panning