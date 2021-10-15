import React from 'react';
import {Button, Form, FormGroup, Input, Label} from 'reactstrap';
import {connect} from 'dva'

@connect(({app}) => ({app}))
class Login extends React.PureComponent {

  render() {
    const {dispatch} = this.props;

    const onFormSubmit = () => {
      let login = document.getElementById('login').value;
      let password = document.getElementById('password').value;
      dispatch({
        type: 'app/signIn',
        payload: {login, password}
      })
    };

    return (
      <div className="row" style={{margin: 0}}>
        <div className="col-md-6 login_r">
        </div>
        <div className="col-md-6 login_l">
          <div className="card">
            <div className="card-body">
              <h5 className="login-title">Вход в систему</h5>
              <Form>
                <FormGroup>
                  <Label>Логин</Label>
                  <Input type="text" name="login" id="login" placeholder="Логин"/>
                </FormGroup>
                <FormGroup>
                  <Label>Пароль</Label>
                  <Input type="password" name="password" id="password" placeholder="Пароль"/>
                </FormGroup>
                <Button onClick={onFormSubmit} type="button" className="btn btn-primary btn-block">Войти</Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
