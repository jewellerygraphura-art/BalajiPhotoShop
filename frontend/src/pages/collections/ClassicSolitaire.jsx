import React, { useEffect, useContext } from "react";
import CollectionPage from "../../components/collections/CollectionPage";
import { ProductContext } from "../../context/ProductContext";

const ClassicSolitaire = () => {
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
      primaryCollection: "Classic Solitaire",
      fallbackCollections: ["Classic", "Solitaire", "Modern Classics", "Rings"],
      fallbackCategory: "Rings",
    });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CollectionPage
      title="Classic Solitaire"
      products={products || []}
      loading={loading}
      pagination={pagination}
      currentPage={currentPage}
      fetchProducts={(page) =>
        fetchCollectionWithFallback({
          page,
          primaryCollection: "Classic Solitaire",
          fallbackCollections: ["Classic", "Solitaire", "Modern Classics", "Rings"],
          fallbackCategory: "Rings",
        })
      }
    />
  );
};

export default ClassicSolitaire;