import React, { useEffect, useContext } from "react";
import CollectionPage from "../../components/collections/CollectionPage";
import { ProductContext } from "../../context/ProductContext";

const Kid = () => {
  const {
    products,
    loading,
    pagination,
    currentPage,
    fetchProducts,
  } = useContext(ProductContext);

  useEffect(() => {
    fetchProducts(1, undefined, "Kid");
  }, []);

  return (
    <CollectionPage
      title="Kid's Collection"
      products={products}
      loading={loading}
      pagination={pagination}
      currentPage={currentPage}
      fetchProducts={(page) => fetchProducts(page, undefined, "Kid")}
    />
  );
};

export default Kid;

