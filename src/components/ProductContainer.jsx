
import { useState } from "react"
import ProductList from "./ProductList/ProductList"
import ProductDetails from "./ProductDetails/ProductDetails"

const ProductContainer = () => {
  const [currentView, setCurrentView] = useState("list")
  const [selectedProduct, setSelectedProduct] = useState(null)

  const showProductDetails = (product) => {
    setSelectedProduct(product)
    setCurrentView("details")
  }

  const backToList = () => {
    setCurrentView("list")
    setSelectedProduct(null)
  }

  return (
    <>
      {currentView === "list" && <ProductList onProductClick={showProductDetails} />}
      {currentView === "details" && selectedProduct && (
        <ProductDetails product={selectedProduct} onBackClick={backToList} />
      )}
    </>
  )
}

export default ProductContainer
