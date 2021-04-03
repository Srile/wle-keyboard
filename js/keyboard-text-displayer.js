WL.registerComponent('keyboard-text-displayer', {
    keyboard: {type: WL.Type.Object},
}, {
    start: function() {
      this.text = this.object.getComponent('text');
      this.keyboard.getComponent('keyboard').addOnLinkedTextChangedCallback(this.onTextChanged.bind(this));
    },
    onTextChanged: function(newText) {
      console.log("cz")
      this.text.text = newText;
    }
});
