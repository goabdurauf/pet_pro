import React, {Component} from 'react';

class Error extends Component {
  render() {
    return (
      <div className="page-404 pt-3">
        <div className="container mb-5">
          <h1 className="text-center pt-5 mt-5">
            404
          </h1>
          <h4 className="text-center m-0 text-muted mb-5">
            Sahifa topilmadi.
          </h4>
        </div>
        <div style={{position: 'absolute', bottom: '0', width: '100%'}}>
          {/* <Footer/>*/}
        </div>
      </div>
    );
  }
}

/*Error.propTypes = {};*/
export default Error;
