import React, { useEffect, useContext } from "react";
import CollectionPage from "../../components/collections/CollectionPage";
import { ProductContext } from "../../context/ProductContext";

const Collections = () => {
  const {
    products,
    loading,
    pagination,
    currentPage,
    fetchProducts
  } = useContext(ProductContext);

  useEffect(() => {
    fetchProducts(1, "");
  }, []);

  return (
    <CollectionPage
      title="Collections"
      products={products}
      loading={loading}
      pagination={pagination}
      currentPage={currentPage}
      fetchProducts={fetchProducts}
    />
  );
};

export default Collections;
