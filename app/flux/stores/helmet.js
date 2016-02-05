class HelmetStore {

  constructor() {
    this.bindActions(this.alt.getActions('helmet'));

    this.title = '';
    this.titleBase = 'Universal JS app - ';
    this.description = 'Meta description is very important for SEO';
    this.statusCode = 200;
  }

  onUpdate(props) {
    Object.keys(props)
      .forEach((key) => this[key] = props[key]);
  }

}

export default HelmetStore;
