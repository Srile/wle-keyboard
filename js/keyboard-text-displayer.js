WL.registerComponent('keyboard-text-displayer', {
    keyboard: {type: WL.Type.Object},
}, {
    start: function() {
      this.text = this.object.getComponent('text');
      this.keyboard.getComponent('keyboard').addTextChangedCallback(this.onTextChanged.bind(this));
    },
    onTextChanged: function(newText) {
      this.text.text = newText;
    }
});
