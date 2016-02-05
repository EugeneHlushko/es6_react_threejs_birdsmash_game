class HelmetStore {

  constructor() {
    this.bindActions(this.alt.getActions('helmet'));

    this.title = '';
    this.titleBase = 'Smashing bird - ';
    this.description = 'Smash the bird against trees! Or dont, i dont care.';
    this.statusCode = 200;
  }

  onUpdate(props) {
    Object.keys(props)
      .forEach((key) => this[key] = props[key]);
  }

}

export default HelmetStore;
