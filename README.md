#**Mellow Meadow**

**Background**
Mellow Meadow is a 3D interactive environment. The main setting
is in an (infinite?) flower meadow with various types flowers (for just a line of plotted
flowers if it take too much time) that sway in the wind. The player floats
through this meadow and can examine the flowers. Everything will be rendered with the WebGL
library on Canvas and HTML5, maybe also using some blender models.
Inspired by the game in Magic School Bus episode 48, "Magic School Bus Makes a Stink".

**Functionality/MVP's**
- [ ] 3D models of smell molecules and flowers with display pages
- [ ] Camera is controlled by keypresses
- [ ] Zoom is available
- [ ] ~Realistic~ animations

ind addition, the game with include:
- [ ] An intro sequence that will explain what is going on
- [ ] A production readme

**Wireframes**
The game will include a sidebar list of all molecules, and a toggle button that
switches between views
![Alt text](./Smell_blaster_wireframe.png?raw=true "Wireframe")

**Technologies**
This project will implement the following technologies:
- Blender models of flowers and meadowscape
- WebGL will handle animation, rendering, and game play logic.
- Canvas for DOM rendering
- Webpack to bundle and serve up the various scripts.

+models
  +flowers
  +grass
  +landscape
+physics
+js



**Implementation Timeline**
Day 1: work on blender models and have all the node set up done
1. have canvas set up on page,
2. work out controls and flow of the game
3. familiarize self with WebGL
4. work on laser/shooting elements

Day 2: work on blender models and begin physics in WebGL
1. have test models for physics testing
2. continue work on control flow
3. set up camera and lasers

Day 3: Import blender models and link with WebGL
1. make sure the WebGL and blender models work
2. tweek the visuals and mood as needed

Day 4: style style style
1. have adequate styling of the home page
2. make sure controls work

**Bonus Features**
honestly the flower section may end up being a bonus but if there is time I
would work on adding sound features
