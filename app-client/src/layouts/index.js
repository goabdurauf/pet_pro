import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import {Link} from "react-router-dom";
import React, {Component} from 'react';
import {connect} from "react-redux";
import {Menu, Dropdown} from 'antd';

@connect(({app}) => ({app}))
class Index extends Component {
  /*

    constructor(props) {
      super(props);
      this.state = {
        monthName: '',
        day: '',
        year: '',
        months: [
          'Yanvar',
          'Fevral',
          'Mart',
          'Aprel',
          'May',
          'Iyun',
          'Iyul',
          'Avgust',
          'Sentyabr',
          'Oktyabr',
          'Noyabr',
          'Dekabr'
        ],
      };
    }

    componentDidMount() {

      const {dispatch} = this.props;

      dispatch({
        type: 'app/userMe',
      });

      const d = new Date();
      const monthIndex = d.getMonth();
      const day = d.getDate();
      const year = d.getFullYear();
      const monthName = this.state.months.length ? this.state.months[monthIndex] : '';
      this.setState({
        monthName: monthName,
        day: day,
        year: year,
      });

    }
  */

  logout = () => {
    this.props.dispatch({
      type: "app/logout"
    })
  };

  render() {

    const {app} = this.props;
    const {currentActiveUser} = app;
    //
    const pathname = this.props.location.pathname;

    /* const toggle = () => {
       this.setState({
         open: !this.state.open,
       });
       this.props.app.openModal = !this.props.app.openModal;
     };*/

    let isSigned = true;
    if (pathname === "/login" || pathname === "/") {
      isSigned = false;
    }

    /*
        let showCourse = false;
        let showCash = false;
        let showUser = false;
        let showOrder = false;
        let showInvoice = false;
        let showSettings = false;
        let showReport = false;

        if (currentActiveUser !== null) {
          currentActiveUser.roles.map((item, i) => {
            if (item.id === 10) {
              showUser = true;
              showOrder = true;
              showReport = false;
            } else if (item.id === 20) {
              showOrder = true;
              showReport = false;
            } else if (item.id === 30) {
              showCourse = true;
              showCash = true;
              showUser = true;
              showInvoice = true;
              showSettings = true;
            } else if (item.id === 40) {
              showUser = true;
              showOrder = true;
              showInvoice = true;
              showReport = true;
              showCash = true;
            }
          })
        }
    */

    const userMenu = (
      <Menu onClick={this.logout}>
        <Menu.Item key="1">Выход</Menu.Item>
      </Menu>
    );

    return (
      <div>
        {isSigned ? <div className="navbar">
          <div className="row w-100">
            <div className="col-md-2">
              <img alt='' src="/images/logo.svg" className="logo"/>
            </div>
            <div className="col-md-8">
              <ul className="navbar-nav">
                <Link to="/dashboard">
                  <li className={"nav-item " + (pathname === '/dashboard' ? "current" : "")}>
                    <span><img alt='' src="/icons/diagram.svg"/></span>
                    <p className="text-center">Показатели</p>
                  </li>
                </Link>
                <Link to="/order">
                  <li className={"nav-item " + (pathname === '/order' ? "current" : "")}>
                    <span><img alt='' src="/icons/order.svg"/></span>
                    <p className="text-center">Заказы</p>
                  </li>
                </Link>
                <Link to="/finance">
                  <li className={"nav-item " + (pathname === '/finance' ? "current" : "")}>
                    <span><img alt='' src="/icons/money.svg"/></span>
                    <p className="text-center">Финансы</p>
                  </li>
                </Link>
                <Link to="/client">
                  <li className={"nav-item " + (pathname === '/client' ? "current" : "")}>
                    <span><img alt='' src="/icons/customer.svg"/></span>
                    <p className="text-center">Клиенты</p>
                  </li>
                </Link>
                <Link to="/supplier">
                  <li className={"nav-item " + (pathname === '/supplier' ? "current" : "")}>
                    <span><img alt='' src="/icons/customer.svg"/></span>
                    <p className="text-center">Поставщики</p>
                  </li>
                </Link>
                <Link to="/report">
                  <li className={"nav-item " + (pathname === '/report' ? "current" : "")}>
                    <span><img alt='' src="/icons/report.svg"/></span>
                    <p className="text-center">Отчёты</p>
                  </li>
                </Link>
                <Link to="/calendar">
                  <li className={"nav-item " + (pathname === '/calendar' ? "current" : "")}>
                    <span><img alt='' src="/icons/calendar.svg"/></span>
                    <p className="text-center">Календарь</p>
                  </li>
                </Link>
                <Link to="/catalog">
                  <li className={"nav-item " + (pathname === '/catalog' ? "current" : "")}>
                    <span><img alt='' src="/icons/settings.svg"/></span>
                    <p className="text-center">Справочники</p>
                  </li>
                </Link>
              </ul>
            </div>
            <div className="col-md-2">
              <Dropdown overlay={userMenu}>
                <div>
                  <img alt='' src="/icons/user.png" className="user-img"/>
                  <div>
                    <div
                      className="user-info">{currentActiveUser && currentActiveUser.fullName ? currentActiveUser.fullName : ''}</div>
                    <div
                      className="user-role">{currentActiveUser && currentActiveUser.roleName ? currentActiveUser.roleName : ''}</div>
                  </div>
                </div>
              </Dropdown>
              {/* <div className="dropdown">
                <button className="btn py-1 px-2 btn-outline-dark bg-transparent dropdown-toggle" type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <img src="../images/logout.png" width="24px" alt="man"/>
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <p className="dropdown-item cursor" onClick={this.logout}>Chiqish</p>
                </div>
              </div>*/}
            </div>
          </div>
        </div> : ''}

        {/*{isSigned ? <div className="m-col-1">
            <Link to={'/'}><h3>DASHBOARD</h3></Link>
            <Link to={'/login'} onClick={clear}>
              <div className="userinfo">
                <div className="mb-2">
                  <img src="../images/Oval.png" width="35px" alt="man"/>
                </div>
                <div>
                    <h5
                      className="text-white">{currentActiveUser !== null ? currentActiveUser.firstName : ''} {currentActiveUser !== null ? currentActiveUser.lastName : ''}</h5>
                    <h6>{
                      currentActiveUser !== null && currentActiveUser.roles.length <= 3 ?
                        currentActiveUser.roles.map(item => {
                          return (<div key={item.id} className="fs-20 text-white">{item.description}</div>)
                        }) : <div className="fs-20 text-white">Super admin</div>
                    }</h6>
                </div>
              </div>
            </Link>
            <ul>
              {showCourse ?
                <Link to={'/course'}>
                  <li
                    className={pathname === '/course' ? 'active' : ''}>
                    <img src="../images/Frame.png" alt="frame"/>
                    <span>Valyuta</span>
                  </li>
                </Link> : ''}
              {showCash ?
                <Link to={'/kassa'}>
                  <li
                    className={pathname === '/kassa' ? 'active' : ''}>
                    <img src="../images/Vector.png" alt="frame"/>
                    <span>Kassa</span>
                  </li>
                </Link> : ''}
              {showInvoice ?
                <Link to={'/income'}>
                  <li
                    className={pathname === '/income' ? 'active' : ''}>
                    <img src="../images/income.png" alt="frame"/>
                    <span>Income</span>
                  </li>
                </Link> : ''}
              {showInvoice ?
                <Link to={'/expence'}>
                  <li
                    className={pathname === '/expence' ? 'active' : ''}>
                    <img src="../images/expence.png" alt="frame"/>
                    <span>Expence</span>
                  </li>
                </Link> : ''}
              {showUser ?
                <Link to={'/user'}>
                  <li className={pathname === '/user' ? 'active' : ''}>
                    <img src="../images/Vector (1).png" alt="frame"/>
                    <span>Foydalanuvchilar</span>
                  </li>
                </Link> : ''}
              {showOrder ?
                <Link to={'/order'}>
                  <li className={(pathname === '/order' || pathname === '/order/add') ? 'active' : ''}>
                    <img src="../images/choices.png" alt="frame"/>
                    <span>Buyurtmalar</span>
                  </li>
                </Link> : ''}
              {showInvoice ?
                <Link to={'/invoice'}>
                  <li className={(pathname === '/invoice') ? 'active' : ''}>
                    <img src="../images/bill.png" alt="frame"/>
                    <span>Invoice</span>
                  </li>
                </Link> : ''}
              {showReport ?
                <Link to={'/report'}>
                  <li className={(pathname === '/report') ? 'active' : ''}>
                    <img src="../images/bill.png" alt="frame"/>
                    <span>Xisobotlar</span>
                  </li>
                </Link> : ''}
              {showSettings ?
                <Link to={'/manifacture'}>
                  <div className="settings-menu" id="accordion">
                    <li
                      className={(pathname === '/delivery' || pathname === '/manifacture' || pathname === '/product' || pathname === '/measure' || pathname === '/region') ? 'active' : ''}>
                      <div id="headingOne">
                        <div className="text-decoration-none text-white admin-link" data-toggle="collapse"
                             data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                          <img src="../images/settings.png" alt="frame"/>
                          Sozlamalar
                        </div>
                      </div>

                      <div id="collapseOne" className="collapse pl-2" aria-labelledby="headingOne"
                           data-parent="#accordion">
                        <ul>
                          <Link to={'/manifacture'}>
                            <li className={pathname === '/manifacture' ? 'active-2 pl-0' : 'pl-0'}>
                              <img src="../images/Vector (2).png" alt="frame"/>
                              Yetkazib beruvchi
                            </li>
                          </Link>
                          <Link to={'/delivery'}>
                            <li className={pathname === '/delivery' ? 'active-2 pl-0' : 'pl-0'}>
                              <img src="../images/Vector (3).png" alt="frame"/>
                              Buyurtmachi
                            </li>
                          </Link>
                          <Link to={'/measure'}>
                            <li className={pathname === '/measure' ? 'active-2 pl-0' : 'pl-0'}>
                              <img src="../images/measure.png" alt="frame"/>
                              O'lchov birliklari
                            </li>
                          </Link>
                          <Link to={'/category'}>
                            <li className={pathname === '/category' ? 'active-2 pl-0' : 'pl-0'}>
                              <img src="../images/product.png" alt="frame"/>
                              Kategoriya
                            </li>
                          </Link>
                          <Link to={'/product'}>
                            <li className={pathname === '/product' ? 'active-2 pl-0' : 'pl-0'}>
                              <img src="../images/product.png" alt="frame"/>
                              Mahsulotlar
                            </li>
                          </Link>
                          <Link to={'/region'}>
                            <li className={pathname === '/region' ? 'active-2 pl-0' : 'pl-0'}>
                              <img src="../images/region.png" alt="frame"/>
                              Regionlar
                            </li>
                          </Link>
                          <Link to={'/source'}>
                            <li className={pathname === '/source' ? 'active-2 pl-0' : 'pl-0'}>
                              <img src="../images/region.png" alt="frame"/>
                              Kimdan
                            </li>
                          </Link>
                          <Link to={'/repost'}>
                            <li className={pathname === '/repost' ? 'active-2 pl-0' : 'pl-0'}>
                              <img src="../images/region.png" alt="frame"/>
                              Report Status
                            </li>
                          </Link>
                        </ul>
                      </div>
                    </li>
                  </div>
                </Link> : ''}
            </ul>
          </div> : ''}*/}
        {this.props.children}
      </div>
    );
  }
}

export default Index;
