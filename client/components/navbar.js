import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import NavLink from './NavLink'
import CartIcon from './CartIcon'
import {logout} from '../store/user'
import {fetchCart} from '../store/cart'

class Navbar extends React.Component {
  componentDidMount() {
    this.props.fetchCart()
  }
  render() {
    const {isLoggedIn, dispatchLogout, numOfItemsInCart} = this.props
    return (
      <div>
        <nav>
          <ul className="nav-left">
            <li id="logo">
              <img className="logo" src="/images/catctus-minified.svg" />
              <Link className="logo-link" to="/">
                Grace
                <br /> Potter
              </Link>
            </li>
          </ul>
          <ul className="nav-center">
            <li>
              <NavLink to="/products">Products</NavLink>
            </li>
          </ul>
          <ul className="nav-right">
            {isLoggedIn ? (
              <>
                {/* The navbar will show these links after you log in */}
                <li>
                  <NavLink to="/home">Home</NavLink>
                </li>
                <li>
                  <a className="nav-link" href="#" onClick={dispatchLogout}>
                    Logout
                  </a>
                </li>
              </>
            ) : (
              <>
                {/* The navbar will show these links before you log in */}
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
                <li>
                  <NavLink to="/signup">Sign Up</NavLink>
                </li>
              </>
            )}
            <li>
              <CartIcon itemCount={numOfItemsInCart} />
              <NavLink to="/cart">Cart</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    userId: state.user.id,
    numOfItemsInCart: state.cart.products.length
  }
}

const mapDispatch = dispatch => {
  return {
    dispatchLogout: () => dispatch(logout()),
    fetchCart: () => dispatch(fetchCart())
  }
}

export default connect(mapState, mapDispatch)(Navbar)
