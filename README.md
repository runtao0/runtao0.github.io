#**Runtao's 3D Game of Life**
Live: [Runtao's Game of Life](runtao0.github.io/runtaos_life)

##**What is it?**

My Game of life is a 3D voxel painter and [Conway's Game of Life] (https://en.wikipedia.org/wiki/Conway's_Game_of_Life) simulation. Each cell is a voxel, but the Life2333 rules still apply, with the Z-axis representing time, with each discrete layer being a generation in the game. This game was created with Javascript using the Three.js library (including raycasting Detector.js and TrackballControls.js), running on WebGL.

##**Features and Implementation**

###**Initial Pattern Creation**

The initial phase of the game prompts to user to create an initial pattern on a 50X50 grid. The user may create voxels by moving the cursor for position and clicking to create the box. The user can also delete boxes while holding down the shift button and clicking existing boxes.
[Alt text](./images/user_creation.png?raw=true "User creations")
Furthermore, four preset patterns are available to the user via buttons on the right of the page. These are the Glider Gun, Cross, and Garden of Eden patterns, as well as a random initialization of voxels.
[Alt text](./images/glider_gun.png?raw=true "Glider gun preset")
Adding these patterns will not affect pre-existing voxels created by the user, but will replace previously selected preset patterns. Users can also add more voxels or subtract from preset patterns.

###**When Life Begins**
When the user is satisfied with his/her initial pattern, they may press the start button to begin calculating and rendering generations. Because each successive voxel added slows down the program, the animation is capped at 300 generations. The camera moves in a preset path to follow the growth of the voxels.
[Alt text](./images/life_standard_view.png?raw=true "Life standard view")
However, the camera can also be manipulated with the three standard mouse buttons. Left click will change the view angle with respect to the beginning level. The middle mouse button can be used to zoom in or out of the view, and the right button can be used to move the view linearly across the screen.
[Alt text](./images/mouse_control_ex.png?raw=true "Mouse control example")

##**Future Directions**

###**Optimization**
Particle system? creating all these voxels

###**Saving Initial Patterns**


<!-- **Functionality/MVP's**
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
[Alt text](./Smell_blaster_wireframe.png?raw=true "Wireframe")

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
would work on adding sound features -->
