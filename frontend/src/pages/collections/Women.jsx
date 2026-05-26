


import React, { useEffect, useContext } from "react";
import CollectionPage from "../../components/collections/CollectionPage";
import { ProductContext } from "../../context/ProductContext";

const Women = () => {
  const {
    products,
    loading,
    pagination,
    currentPage,
    fetchProducts,
  } = useContext(ProductContext);

  useEffect(() => {
    fetchProducts(1, undefined, "female");
  }, []);

  return (
    <CollectionPage
      title="Women's Collection"
      products={products}
      loading={loading}
      pagination={pagination}
      currentPage={currentPage}
      fetchProducts={(page) => fetchProducts(page, undefined, "female")}
    />
  );
};

export default Women;
