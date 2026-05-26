import React, { useEffect, useContext } from "react";
import CollectionPage from "../../components/collections/CollectionPage";
import { ProductContext } from "../../context/ProductContext";

const WeddingBands = () => {
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
      primaryCollection: "Wedding Bands",
      fallbackCollections: ["Wedding", "Wedding Collection", "Bands", "Rings"],
      fallbackCategory: "Rings",
    });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CollectionPage
      title="Wedding Bands"
      products={products || []}
      loading={loading}
      pagination={pagination}
      currentPage={currentPage}
      fetchProducts={(page) =>
        fetchCollectionWithFallback({
          page,
          primaryCollection: "Wedding Bands",
          fallbackCollections: ["Wedding", "Wedding Collection", "Bands", "Rings"],
          fallbackCategory: "Rings",
        })
      }
    />
  );
};

export default WeddingBands;