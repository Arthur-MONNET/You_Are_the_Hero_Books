class Quality {
  constructor(en, fr, icon) {
    this.en = en;
    this.fr = fr;
    this.icon = icon;
    this.value = null;
    this.max = null;
  }

  setValue(value) {
    this.value = value;
    this.max = value;
  }
}

module.exports = Quality;