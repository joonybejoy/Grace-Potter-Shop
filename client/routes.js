import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'

import {me} from './store/user'
import {Login, Signup} from './components'
import UserHome from './pages/UserHome'
import Cart from './pages/Cart'
import SingleProduct from './pages/SingleProduct'
import ProductList from './pages/ProductList'
import Category from './pages/Category'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import EditProfileForm from './components/EditProfileForm'

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const loggedIn = this.props.isLoggedIn
    const guest = !loggedIn

    // You might be wondering why we haave to repeat the guest / loggedIn
    // checks. The answer is: react-router doesn't support nested switches!
    return (
      <Switch>
        {/* Routes available to all visitors */}
        <Route exact path="/products" component={ProductList} />
        <Route exact path="/products/:productId" component={SingleProduct} />
        <Route exact path="/category/:slug" component={Category} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/confirmation" component={OrderConfirmation} />
        {/* Routes for guest visitors only */}
        {guest && <Route path="/login" component={Login} />}
        {guest && <Route path="/signup" component={Signup} />}
        {/* Routes for logged in users only */}
        {loggedIn && <Route exact path="/home" component={UserHome} />}
        {loggedIn && (
          <Route exact path="/home/editProfile" component={EditProfileForm} />
        )}
        {/* Displays our product list as a fallback */}
        <Route component={ProductList} />
      </Switch>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
