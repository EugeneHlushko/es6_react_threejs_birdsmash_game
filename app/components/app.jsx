import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) require('styles/app.css');

class App extends Component {

  static propTypes = { children: PropTypes.element }
  static contextTypes = { flux: PropTypes.object.isRequired }

  state = { i18n: this.context
      .flux.getStore('locale').getState() }

  componentDidMount() {
    const { flux } = this.context;
    flux.getStore('helmet').listen(this.handleTitleChange);
  }

  componentWillUnmount() {
    const { flux } = this.context;
    flux.getStore('helmet').unlisten(this.handleTitleChange);
  }

  handleTitleChange({ titleBase, title }) {
    document.title = titleBase + title;
  }

  render() {
    const { children } = this.props;

    return (
      <div>
        { children }
      </div>
    );
  }

}

export default App;
