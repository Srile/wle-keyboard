<p align="center">
<br>
<img src="https://github.com/Srile/wle-keyboard/blob/main/img/screenshot.png">
</p>


## Description
This is a keyboard component for the [Wonderland Engine](https://wonderlandengine.com/) that lets you use an on screen keyboard. This works both with Desktop and/or VR.

You can find the setup below, but an example scene with the functioning Keyboard is also included
in the repository.

### Setup
Begin by including `keyboard.js` in your Wonderland Engine project's javascript folder.
(Needs to be in a folder under that is listed in `Views->Project Settings->Javascript Sources`)
  - Create an empty object and add the keyboard component to it.
  - Set the component properties (numeric fields can stay at default):
    - panelSizeX: multiplier for the distance between the buttons on the x-axis.
    - panelSizeY: multiplier for the distance between the buttons on the y-axis.
    - padding: Minimum space between each key.
    - keyMesh: The mesh for the buttons, ideally `PrimitivePlane`.
    - keyMaterial: Material for the unpressed state of the keys.
    - textMaterial: Material for text on the keys, should be `DefaultFontMaterial`.
    - textSize: Size of the text on the keys.
    - clickMaterial: Material that gets displayed for a short duration when a key is pressed.
  - Create a child object of the keyboard component, we can call it Collider.
  - Add a `collision` component to the Collider object, set the collider to `box`, set its extents so, that is covers the whole keyboard on the x and y axes (default: `[2.050, 1.0, 0.01]`) and set the group to any one you like. I use group `4`, we will use need this later.
  - Add a `cursor-target` component to the Collider object.
  - (Optional) Add a `mesh` component to the Collider object, set it to `PrimitivePlane` and scale it accordingly. This can be used as a background.
  - Add a cursor component to your Camera object (object with `view component`), set the collisionGroup to the group you picked for the collision (`4` for me), set handedness to `input component` and rayCastMode to `collision`. This will enable clicking on 2D.
  For VR, you can use an object with an input component and a cursor (child to the player).
  - Your inputs should now work, as indicated by the material changing when a key is pressed.
  - To display the text, you will need to register your function via `addOnLinkedTextChangedCallback(function)`. This will register the function to be called when the keyboard receives input. Check `js/keyboard-text-displayer.js` for an example.
