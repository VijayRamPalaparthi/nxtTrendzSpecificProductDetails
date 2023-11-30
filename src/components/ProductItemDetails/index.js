// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

import './index.css'

const apiStatusState = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: 'initial',
    productsData: {},
    similarProducts: [],
    errorMsg: '',
    count: 1,
  }

  componentDidMount = () => {
    this.getProductData()
  }

  getProductData = async () => {
    this.setState({apiStatus: apiStatusState.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)

    console.log(response)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
      }
      const similarProductsList = data.similar_products.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        title: each.title,
        brand: each.brand,
        price: each.price,
        rating: each.rating,
      }))
      this.setState({
        productsData: updatedData,
        apiStatus: apiStatusState.success,
        similarProducts: similarProductsList,
      })
    } else {
      const data = await response.json()
      const error = data.error_msg
      this.setState({apiStatus: apiStatusState.failure, errorMsg: error})
    }
  }

  renderLoaderView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onClickIncrease = () => {
    this.setState(prev => ({
      count: prev.count + 1,
    }))
  }

  onClickDecrease = () => {
    const {count} = this.setState
    if (count > 0) {
      this.setState(prev => ({
        count: prev.count - 1,
      }))
    }
  }

  renderProductDetailSection = () => {
    const {productsData, count, similarProducts} = this.state
    console.log(similarProducts)
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      availability,
      totalReviews,
      rating,
    } = productsData
    return (
      <div className="body-container">
        <div className="product-item-container">
          <img src={imageUrl} className="product-image" alt="product" />
          <div className="product-description-container">
            <h1 className="p-title">{title}</h1>
            <p className="price">Rs {price}/- </p>
            <div className="rating-box-container">
              <div className="rating-container rate">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="rating-count"> {totalReviews} Reviews</p>
            </div>
            <p className="desc">{description}</p>
            <div className="avi">
              <p className="ab">Available: </p>
              <p className="desc"> {availability}</p>
            </div>
            <div className="avi">
              <p className="ab">Brand: </p>
              <p className="desc"> {brand}</p>
            </div>

            <hr className="line" />
            <div className="p-count-container">
              <BsDashSquare
                className="add"
                color="#616e7c"
                height="30"
                width="30"
                onClick={this.onClickDecrease}
                data-testid="minus"
              />
              <p className="count">{count}</p>
              <BsPlusSquare
                className="add"
                data-testid="plus"
                color="#616e7c"
                height="30"
                width="30"
                onClick={this.onClickIncrease}
              />
            </div>
            <button className="button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-heading">Similar Products</h1>
          <ul className="sim-products-list">
            {similarProducts.map(card => (
              <SimilarProductItem detail={card} key={card.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => {
    const {errorMsg} = this.state
    console.log(errorMsg)
    return (
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="failure-image"
        />
        <h1 className="failure-heading">Product Not Found</h1>
        <Link to="/products">
          <button className="button" type="button">
            Continue Shopping
          </button>
        </Link>
      </div>
    )
  }

  renderFromSwitch = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusState.success:
        return this.renderProductDetailSection()
      case apiStatusState.failure:
        return this.renderFailureView()
      case apiStatusState.loading:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-page-container">{this.renderFromSwitch()}</div>
      </>
    )
  }
}

export default ProductItemDetails
