import React, {Component} from 'react';
import {Typography} from 'antd'

class Error extends Component {
  render() {
    return (
      <div className="page-404 pt-3">
        <div className="container mb-5">
          <Typography.Title level={1} className="text-center pt-5 mt-5">404</Typography.Title>
          <Typography.Title level={4} className="text-center m-0 text-muted mb-5">
            Страница не найден.
          </Typography.Title>
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
