import React, { useEffect, useContext } from "react";
import CollectionPage from "../../components/collections/CollectionPage";
import { ProductContext } from "../../context/ProductContext";

const VintageBands = () => {
  const {
    products,
    loading,
    pagination,
    currentPage,
    fetchCollectionWithFallback
  } = useContext(ProductContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCollectionWithFallback({
      page: 1,
      primaryCollection: "Vintage Bands",
      fallbackCollections: ["Vintage", "Heritage", "Bands", "Rings"],
      fallbackCategory: "Rings",
    });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CollectionPage
      title="Vintage Bands"
      products={products || []}
      loading={loading}
      pagination={pagination}
      currentPage={currentPage}
      fetchProducts={(page) =>
        fetchCollectionWithFallback({
          page,
          primaryCollection: "Vintage Bands",
          fallbackCollections: ["Vintage", "Heritage", "Bands", "Rings"],
          fallbackCategory: "Rings",
        })
      }
    />
  );
};

export default VintageBands;