WL.registerComponent('keyboard', {
    panelSizeX: {type: WL.Type.Float, default: 0.008},
    panelSizeY: {type: WL.Type.Float, default: 0.008},
    padding: {type: WL.Type.Int, default: 2},
    keyMesh: {type: WL.Type.Mesh, default: null},
    keyMaterial: {type: WL.Type.Material, default: null},
    textMaterial: {type: WL.Type.Material, default: null},
    textSize: {type: WL.Type.Float, default: 7.0},
    clickMaterial: {type: WL.Type.Material},
}, {
    start: function() {
      this.getConfig();
      this.clickPosition = new Float32Array(3);
      this.tempVec = new Float32Array(3);
      this.tempScaleVec = new Float32Array(3);

      this.tempVec2Min = new Float32Array(2);
      this.tempVec2Max = new Float32Array(2);

      this.cursorTarget = this.object.children[0].getComponent('cursor-target');
      this.collider = this.object.children[0].getComponent('collision');
      window.kb = this;

      this.cursorObject = WL.scene.addObject(this.object);

      this.cursorTarget.addClickFunction(function(object, cursor) {
        this.cursorObject.setTranslationWorld(cursor.cursorPos);
        this.cursorObject.getTranslationLocal(this.clickPosition);
        let clickedCharacter = this.getClickedCharacter(this.clickPosition);
        if(clickedCharacter != null)
          this.onSelect(clickedCharacter);
      }.bind(this));

      this.linkedText = "";
      this.shift = false;

      const UNIT_SIZE = 51.2;

      let keys = Object.entries( this.config );
      this.children = WL.scene.addObjects(keys.length, this.object, keys.length);
      let childPos = new Float32Array(3);

      for(let i = 0; i < keys.length; i++) {
        let currentChild = this.children[i];
        let currentKey = keys[i];
        let currentKeyData = currentKey[1];
        currentChild.name = currentKey[0];

        this.config[currentKey[0]].object = currentChild;
        let mesh = currentChild.addComponent('mesh');

        this.config[currentKey[0]].mesh = mesh;

        mesh.mesh = this.keyMesh;
        mesh.material = this.keyMaterial;

        let textChild = WL.scene.addObject(currentChild);

        let text = textChild.addComponent('text');
        text.material = this.textMaterial;
        text.alignment = 2;
        text.justification = 2;
        childPos[0] = 0
        childPos[1] = 0
        childPos[2] = 0.02;
        textChild.scale([this.textSize, this.textSize, this.textSize]);
        textChild.setTranslationLocal(childPos)

        this.config[currentKey[0]].textComponent = text;

        let widthOffset =  ((currentKeyData.width / UNIT_SIZE) - 1);
        childPos[0] = (currentKeyData.position.x * this.panelSizeX) + widthOffset * 0.15;
        childPos[1] = currentKeyData.position.y * this.panelSizeY;
        childPos[2] = 0.02;
        currentChild.setTranslationLocal(childPos)
        currentChild.scale([0.15 + widthOffset * 0.15, 0.15, 0.15]);
      }
      this.getContent(0);
    },
    getClickedCharacter: function(localPosition) {
      let keys = Object.entries( this.config );
      for(let i = 0; i < keys.length; i++) {
        let currentKey = keys[i];
        let currentChild = this.config[currentKey[0]].object;
        glMatrix.vec3.copy(this.tempScaleVec, currentChild.scalingLocal);
        this.tempScaleVec[0] = this.tempScaleVec[0];
        this.tempScaleVec[1] = this.tempScaleVec[1];
        currentChild.getTranslationLocal(this.tempVec);

        glMatrix.vec2.sub(this.tempVec2Min, this.tempVec, this.tempScaleVec)
        glMatrix.vec2.add(this.tempVec2Max, this.tempVec, this.tempScaleVec)

        if( this.tempVec2Min[0] <= localPosition[0] && localPosition[0] <= this.tempVec2Max[0] && this.tempVec2Min[1] <= localPosition[1] && localPosition[1] <= this.tempVec2Max[1] ) {
          this.clickKey(this.config[currentKey[0]].mesh)
          return keys[i][0];
        }
      }

      return null;
    },
    clickKey: function(mesh) {
      mesh.material = this.clickMaterial;
      setTimeout(function() {
        mesh.material = this.keyMaterial;
      }.bind(this), 150);
    },
    getConfig: function() {
      let width = 51.2;
      let height = (( 256 - 2 * this.padding) / 4) - this.padding;

      let y = this.padding;
      let x = this.padding;

      this.config = {};

      for (let i=0; i<10; i++){
          const btn = { type: "button", position: { x, y }, width, height, padding: this.padding};
          this.config['btn' + i] = btn;
          x += (width );
      }
      //2nd row
      y -= (height + this.padding);
      x = this.padding;
      for (let i=0; i<10; i++){
          const btn = { type: "button", position: { x, y }, width, height, padding: this.padding};
          this.config['btn' + (i + 10)] = btn;
          x += (width);
      }
      //3rd row
      y -= (height + this.padding);
      x = this.padding;
      for (let i=0; i<9; i++){
          const w = (i==0 || i==8) ? (width * 1.5) : width;
          const btn = { type: "button", position: { x, y }, width: w, height, padding: this.padding};
          this.config['btn' + (i + 20)] = btn;
          x += ( w);
      }
      //4rd row
      y -= (height + this.padding);
      x = this.padding;
      for (let i=0; i<5; i++){
          const w = (i==0 || i==4) ? (width * 2 ) : (i==2) ? (width * 4) : width;
          const btn = { type: "button", position: { x, y }, width: w, height, padding: this.padding};
          if (i==0) btn.fontSize = 20;
          this.config['btn' + (i + 30)] = btn;
          x += ( w);
      }
    },
    getContent: function(layoutIndex) {
      this.content = {};
      let keys;
      layoutIndex = layoutIndex || 0;

      this.keyboardIndex = layoutIndex;

      switch(layoutIndex){
          case 0:
              keys = [ 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
                       'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '@',
                       'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Del', '',
                       '?123', ',', '   ', '.', 'Enter'];
              break;
          case 1:
              keys = [ 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
                       'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '@',
                       'Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Del', '',
                       '?123', ',', '   ', '.', 'Enter'];
              break;
          case 2:
              keys = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
                       '@', '#', '%', '&', '*', '/', '-', '+', '(', ')',
                       'Shift', '?', '!', '"', '\'', '\\', ':', ';', 'Del', '',
                       'abc', ',', '   ', '.', 'Enter'];
              break;
          case 3:
              keys = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
                       '€', '£', '$', '^', '=', '|', '{', '}', '[', '}',
                       'Shift', '<', '>', '_', '`', '~', ':', ';', 'Del', '',
                       'abc', ',', '   ', '.', 'Enter'];
              break;
      }
      for(let i=0; i<keys.length; i++){
          const key = keys[i];
          if (key!=='') {
            let btnName = 'btn'+i;
            this.content[btnName] = key;
            this.config[btnName].textComponent.text = key;
          }
      }
    },
    onSelect: function( key ) {
      let changeLayout = false
      let change = false

      switch(key) {
        case 'btn34'://Enter
            this.linkedText += "\n";
            change = true;
            break;
        case 'btn32'://space
            this.linkedText += ' ';
            change = true;
            break;
        case 'btn30'://switch keyboard
            this.shift = false;
            this.getContent( this.keyboardIndex < 2 ? 2 : 0 );
            break;
        case 'btn28'://backspace
            this.linkedText = this.linkedText.substring( 0, this.linkedText.length-1 );
            change = true;
            break;
        case 'btn20'://shift
            this.shift = !this.shift;
            if (this.keyboardIndex==0){
                this.getContent( 1 );
            }else if (this.keyboardIndex==1){
                this.getContent( 0 );
            }else if (this.keyboardIndex==2){
                this.getContent( 3 );
            }else if (this.keyboardIndex==3){
                this.getContent( 2 );
            }
            break;
        default:
            const txt = this.content[key];
            this.linkedText += txt;
            change = true;
            break;
      }
      if ( change ) {
        for(let i = 0; i < this.linkedTextChangedCallbacks.length; i++) {
          this.linkedTextChangedCallbacks[i](this.linkedText);
        }
      }
    },
    addOnLinkedTextChangedCallback: function(f) {
      if(!this.linkedTextChangedCallbacks)
        	this.linkedTextChangedCallbacks = [];
      this.linkedTextChangedCallbacks.push(f);
    },
    setVisibility: function(b) {
      if(!b) {
        this.object.scale([0, 0, 0]);
        this.collider.active = false;
      } else {
        this.object.resetScaling();
        this.collider.active = true;
      }
    }

});
