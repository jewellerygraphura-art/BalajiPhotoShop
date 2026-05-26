import React, { useEffect, useContext } from "react";
import CollectionPage from "../../components/collections/CollectionPage";
import { ProductContext } from "../../context/ProductContext";

const EngagementRings = () => {
  const {
    products,
    loading,
    pagination,
    currentPage,
    fetchCollectionWithFallback,
  } = useContext(ProductContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCollectionWithFallback({
      page: 1,
      primaryCollection: "Engagement Rings",
      fallbackCollections: ["Engagement", "Bridal", "Wedding Collection", "Rings"],
      fallbackCategory: "Rings",
    });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <CollectionPage
      title="Engagement Rings"
      products={products}
      loading={loading}
      pagination={pagination}
      currentPage={currentPage}
      fetchProducts={(page) =>
        fetchCollectionWithFallback({
          page,
          primaryCollection: "Engagement Rings",
          fallbackCollections: ["Engagement", "Bridal", "Wedding Collection", "Rings"],
          fallbackCategory: "Rings",
        })
      }
    />
  );
};

export default EngagementRings;