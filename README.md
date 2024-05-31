# zzho7550_9103_tut10_GroupA
## Instructions
### Clicking on different patterns (plant cells) will play different songs. Pressing the 'space' will stop all the music.
## Details of your individual approach
### audio
### When you click on a pattern, the spots within the group of shapes will bounce to the rhythm of the song.
## inspiration
### The inspiration came from an example I saw when I first learned about audio effects (link below). Although this example changes the Y-values based on microphone input, I am changing them based on existing audio sources.
### Because our group is working on plant cells, and plants are everywhere in our lives, they are always observing everything. So, I chose some audio recordings to reflect the world that plants hear, such as in a busy market, nature, a bird-chirping forest, a thundery rainy day, and by a creek.
[Link Text](https://p5js.org/reference/#/p5.AudioIn)
## technical explanation 
### Unlike the group code, I changed the background colour of the cells to black, reminiscent of vinyl records.
### Using the mousePressed function and the keyPressed function to play and pause the music.
### using the fft.analyze function to retrieve the audio spectrum data 
### Using map function to convert these data into position offsets 