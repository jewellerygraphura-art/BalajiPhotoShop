import React, { useState, useEffect } from "react";
import { axiosGetService } from "../../services/axios";
import CollectionPage from "../../components/collections/CollectionPage";
import toast, { Toaster } from "react-hot-toast";

const LIMIT = 9;

const BraceletsListing = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchBracelets = async (page = 1) => {
    try {
      setLoading(true);

      const apiResponse = await axiosGetService(
        `/customer/product/all?page=${page}&limit=${LIMIT}&category=Bracelet`
      );

      if (!apiResponse.ok) {
        toast.error("Failed to load Bracelets.");
        return;
      }

      const { products, pagination } = apiResponse.data.data;

      setProducts(products); // replace for numbered pagination
      setPagination(pagination);
      setCurrentPage(page);

    } catch (error) {
      console.error("Failed to load Bracelets", error);
      toast.error("Something went wrong while fetching Bracelets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBracelets(1);
  }, []);

  return (
    <>
      <Toaster />

      <CollectionPage
        title="Bracelets Collection"
        products={products}
        loading={loading}
        pagination={pagination}
        currentPage={currentPage}
        fetchProducts={fetchBracelets}
      />
    </>
  );
};

export default BraceletsListing;
