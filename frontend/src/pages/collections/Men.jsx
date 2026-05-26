import React, { useEffect, useContext } from "react";
import CollectionPage from "../../components/collections/CollectionPage";
import { ProductContext } from "../../context/ProductContext";

const Men = () => {
  const {
    products,
    loading,
    pagination,
    currentPage,
    fetchProducts,
  } = useContext(ProductContext);

  useEffect(() => {
    fetchProducts(1, undefined, "male");
  }, []);

  return (
    <CollectionPage
      title="Men's Collection"
      products={products}
      loading={loading}
      pagination={pagination}
      currentPage={currentPage}
      fetchProducts={(page) => fetchProducts(page, undefined, "male")}
    />
  );
};

export default Men;
